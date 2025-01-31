'use server';

import { deleteCustomerById, deleteInvoiceById, deleteProductById, deleteServiceById, deleteSubscriptionById, deleteUserById } from '@/lib/db';
import { createInvoicesForServiceApi } from '@/lib/invoices';
import { revalidatePath } from 'next/cache';

// export async function deleteUser(formData: FormData) {
//   let id = Number(formData.get('id'));
//   await deleteUserById(id);
//   revalidatePath('/');
// }

// export async function deleteCustomer(formData: FormData) {
//   let id = Number(formData.get('id'));
//   await deleteCustomerById(id);
//   revalidatePath('/');
// }

export async function deleteProduct(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteProductById(id);
  revalidatePath('/');
}

// export async function deleteInvoice(formData: FormData) {
//   let id = Number(formData.get('id'));
//   await deleteInvoiceById(id);
//   revalidatePath('/');
// }

// export async function deleteService(formData: FormData) {
//   let id = Number(formData.get('id'));
//   await deleteServiceById(id);
//   revalidatePath('/');
// }

export async function deleteSubscription(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteSubscriptionById(id);
  revalidatePath('/');
}

export async function createInvoicesAction(formData: FormData) {
  console.log('Creating invoices with form data:', formData);

  const invoiceNumber = Number(formData.get('invoiceNumber'));
  const issueDate = formData.get('issueDate') as string;
  const date = formData.get('date') as string;
  const dueDate = formData.get('dueDate') as string;
  const serviceId = Number(formData.get('serviceId'));

  console.log('Invoice number:', invoiceNumber);
  console.log('Issue date:', issueDate);
  console.log('Date:', date);
  console.log('Due date:', dueDate);
  console.log('Service ID:', serviceId);

  if (!invoiceNumber || !issueDate || !date || !serviceId || !dueDate) {
    throw new Error('Missing required fields');
  }

  try {
    // Example logic for creating invoices
    const { invoices, batchId } = await createInvoicesForServiceApi(invoiceNumber, serviceId, new Date(issueDate), new Date(date), new Date(dueDate));

    console.log('Invoices created:', invoices);
    console.log('Batch ID:', batchId);  

    return {
      success: true,
      message: `Invoices created successfully! Batch ID: ${batchId}`
    };
  } catch (error) {
    console.error('Error creating invoices:', error);
    return {
      success: false,
      message: 'Failed to create invoices. Please try again later.'
    };
  }
}