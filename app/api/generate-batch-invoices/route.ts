import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { invoiceNumber, serviceId, issueDate, date, dueDate } = body;

    // Validate input
    if (!invoiceNumber || !serviceId || !issueDate || !date || !dueDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Path to Python script
    const scriptPath = path.resolve('./path/to/python/script.py');

    // Spawn a Python process to generate the PDF
    const pythonProcess = spawn('python3', [scriptPath, invoiceNumber, serviceId, issueDate, date, dueDate]);

    // Capture output (PDF path)
    let output = '';
    for await (const chunk of pythonProcess.stdout) {
      output += chunk;
    }

    const [pdfPath] = output.trim().split('\n').slice(-1); // Assuming last line contains the PDF path

    // Read PDF
    const pdfBuffer = await fs.readFile(pdfPath);

    // Return the PDF as a response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice_${invoiceNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
