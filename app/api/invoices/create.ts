import { NextApiRequest, NextApiResponse } from "next";
import { createInvoicesForServiceApi } from "../../../lib/invoices";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { startingInvoiceNumber, serviceId, issueDate, dueDate } = req.body;

  if (!startingInvoiceNumber || !serviceId || !issueDate || !dueDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await createInvoicesForServiceApi(
      startingInvoiceNumber,
      serviceId,
      new Date(issueDate),
      new Date(dueDate)
    );
    res.status(200).json(result);
  } catch (error) {
    // Narrowing the type of 'error'
    if (error instanceof Error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create invoices", error: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}
