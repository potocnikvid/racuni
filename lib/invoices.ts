import axios from 'axios';
import path from 'path';
import {
  db,
  subscriptions,
  invoices,
  createInvoiceBatch,
  getCustomerById,
  getServiceById,
  getUserById
} from './db';
import { count, eq, ilike } from 'drizzle-orm';
import fs from 'fs';

export async function createInvoicesForServiceApi(
  startingInvoiceNumber: number,
  serviceId: number,
  issueDate: Date,
  date: Date,
  dueDate: Date
) {
  const year = issueDate.getFullYear();
  const batchId = await createInvoiceBatch();

  const pricingData = await db
    .select({
      customerId: subscriptions.customerId,
      customPrice: subscriptions.customPrice,
      active: subscriptions.active
    })
    .from(subscriptions)
    .where(eq(subscriptions.serviceId, serviceId));

  let currentInvoiceNumber = 990000 + startingInvoiceNumber;

  const invoicePromises = pricingData.map(async (data) => {
    if (!data.active) {
      return;
    }
    const customer = await getCustomerById(data.customerId);
    const user = await getUserById(2);
    const services = await getServiceById(serviceId);

    const invoice = {
      invoice_number: `${year}_${currentInvoiceNumber}`,
      issue_date: issueDate.toISOString(),
      date: date.toISOString(),
      due_date: dueDate.toISOString()
    };
    currentInvoiceNumber++;

    // const requestData = { user: user[0], customer: customer[0], invoice, services };

    const requestData = {
      user: {
        name: user.name,
        address: user.address,
        tax_number: user.taxNumber, // Convert to snake_case
        registration_number: user.registrationNumber,
        phone: user.phone,
        tax_payer: user.taxPayer,
        bank: user.bank,
        iban: user.iban
      },
      customer: {
        name: customer.name,
        address: customer.address,
        tax_number: String(customer.taxNumber) // Ensure this is a string
      },
      invoice: {
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date,
        date: invoice.date,
        due_date: invoice.due_date
      },
      services: services.map((service) => ({
        name: service.name,
        price: parseFloat(data.customPrice), // Ensure this is a float
        rabat: 0 // Default to 0 if not provided
      }))
    };

    // console.log(requestData)
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/generate-invoice/',
        requestData,
        { responseType: 'arraybuffer' }
      );
      const pdfFileName = `Invoice_${invoice.invoice_number}_${customer.name.replaceAll(' ', '-').replaceAll(',', '-').replaceAll('.', '').replaceAll('--', '-').toLowerCase()}.pdf`;

      const pdfFilePath = path.resolve('invoices', pdfFileName);
      const pdfDir = path.dirname(pdfFilePath);
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true }); // Create the directory
      }
      fs.writeFileSync(pdfFilePath, response.data);

      const invoiceData = {
        customerId: data.customerId,
        invoiceNumber: invoice.invoice_number,
        totalAmount: data.customPrice,
        issueDate,
        date,
        dueDate,
        batchId,
        url: pdfFilePath
      };

      await db.insert(invoices).values(invoiceData);

      return invoiceData;
    } catch (error) {
      console.error(
        'Failed to generate PDF for invoice:',
        invoice.invoice_number,
        error
      );
      throw new Error(`Failed to generate invoice for ${data.customerId}`);
    }
  });

  const results = await Promise.all(invoicePromises);
  return { invoices: results, batchId };
}
