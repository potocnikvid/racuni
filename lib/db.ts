// import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  boolean,
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  varchar
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { spawn } from "child_process";
import fs from "fs/promises";
import axios from "axios";
import path from "path";
import { genSaltSync, hashSync } from 'bcrypt-ts';

let client = neon(`${process.env.POSTGRES_URL!}`);

export const db = drizzle(client);

// Enum for invoice statuses
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'pending',
  'paid',
  'overdue',
  'cancelled'
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  taxPayer: boolean('tax_payer').notNull(),
  taxNumber: text('tax_number').notNull(),
  registrationNumber: text('registration_number').notNull(),
  phone: text('phone').notNull(),
  iban: text('iban').notNull(),
  bank: text('bank').notNull()
});


// Customers Table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address').notNull(),
  taxNumber: integer('tax_number').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});


// Invoices Table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
  invoiceNumber: text('invoice_number').notNull(),
  status: invoiceStatusEnum('status').default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  issueDate: timestamp('issue_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  batchId: integer('batch_id').references(() => invoiceBatches.id), // Optional batch reference
  url: text('url')
});


// Services Table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Customer Service Pricing Table
export const customerServicePricing = pgTable('customer_service_pricing', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
  serviceId: integer('service_id')
    .notNull()
    .references(() => services.id),
  customPrice: numeric('custom_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});


// Invoice_Items Table (many-to-many relationship between invoices and services)
export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id')
    .notNull()
    .references(() => invoices.id),
  serviceId: integer('service_id')
    .notNull()
    .references(() => services.id),
  quantity: integer('quantity').default(1).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull()
});


// Invoice_Batches Table
export const invoiceBatches = pgTable('invoice_batches', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processed: boolean('processed').default(false).notNull()
});




// Products Table
export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});


async function ensureTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(64),
        password VARCHAR(64)
      );`;
  }

  const table = pgTable('User', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 64 }),
    password: varchar('password', { length: 64 }),
  });

  return table;
}



export type SelectUser = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users);

export async function getUserById(id: number) {
  const userList = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return userList[0];
}

export async function getUserByEmail(email: string) {
  const userList = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return userList[0];
}

export async function createUser(data: SelectUser) {
  await db.insert(users).values(data);
}

export async function createUserAuth(email: string, password: string) {
  const users = await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);
  console.log('Hashed password:', hash);
  const res = await db.insert(users).values({ email, password: hash });
  return res;
}
 
export async function updateUserById(id: number, data: Partial<SelectUser>) {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}


export type SelectCustomer = typeof customers.$inferSelect;
export const insertCustomerSchema = createInsertSchema(customers);

export async function getCustomers(
  search: string,
  offset: number
): Promise<{
  customers: Array<{ name: string; address: string; taxNumber: number; createdAt: Date }>;
  newOffset: number | null;
  totalCustomers: number;
}> {
  if (search) {
    const customerData = await db
      .select()
      .from(customers)
      .where(ilike(customers.name, `%${search}%`))
      .limit(1000)
    return {
      customers: customerData.map((customer) => ({
        name: customer.name,
        address: customer.address,
        taxNumber: customer.taxNumber,
        createdAt: customer.createdAt
      })),
      newOffset: null,
      totalCustomers: 0
    };
  }

  if (offset === null) {
    return { customers: [], newOffset: null, totalCustomers: 0 };
  }

  const totalCustomers = await db.select({ count: count() }).from(customers);
  const moreCustomers = await db
    .select()
    .from(customers)
    .limit(10)
    .offset(offset);
  const newOffset = moreCustomers.length >= 10 ? offset + 10 : null;

  return {
    customers: moreCustomers,
    newOffset,
    totalCustomers: totalCustomers[0].count
  };
}

export async function getCustomerById(id: number) {
  const customerList = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return customerList[0];
}

export async function createCustomer(data: SelectCustomer) {
  await db.insert(customers).values(data);
}

export async function updateCustomerById(id: number, data: Partial<SelectCustomer>) {
  await db.update(customers).set(data).where(eq(customers.id, id));
}

export async function deleteCustomerById(id: number) {
  await db.delete(customers).where(eq(customers.id, id));
}



export type SelectInvoice = typeof invoices.$inferSelect;
export const insertInvoiceSchema = createInsertSchema(invoices);

export async function getInvoices(
  search: string,
  offset: number
): Promise<{
  invoices: SelectInvoice[];
  newOffset: number | null;
  totalInvoices: number;
}> {
  if (search) {
    return {
      invoices: await db
        .select()
        .from(invoices)
        .where(ilike(invoices.status, `%${search}%`)) // Modify based on searchable fields
        .limit(1000),
      newOffset: null,
      totalInvoices: 0
    };
  }

  if (offset === null) {
    return { invoices: [], newOffset: null, totalInvoices: 0 };
  }

  const totalInvoices = await db.select({ count: count() }).from(invoices);
  const moreInvoices = await db.select().from(invoices).limit(10).offset(offset);
  const newOffset = moreInvoices.length >= 10 ? offset + 10 : null;

  return {
    invoices: moreInvoices,
    newOffset,
    totalInvoices: totalInvoices[0].count
  };
}

export type SelectInvoiceCustomer = Array<{
  invoiceNumber: string;
  customerName: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
  issueDate: Date;
  dueDate: Date;
}>;

export async function getInvoiceCustomer(
  search: string,
  offset: number
): Promise<{
  invoices: SelectInvoiceCustomer;
  newOffset: number | null;
  totalInvoices: number;
}> {
  if (search) {
    return {
      invoices: await db
        .select({
          invoiceNumber: invoices.invoiceNumber,
          customerName: customers.name,
          status: invoices.status,
          totalAmount: invoices.totalAmount,
          createdAt: invoices.createdAt,
          issueDate: invoices.issueDate,
          dueDate: invoices.dueDate
        })
        .from(invoices)
        .innerJoin(customers, eq(invoices.customerId, customers.id))
        .where(ilike(customers.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalInvoices: 0
    };
  }

  if (offset === null) {
    return { invoices: [], newOffset: null, totalInvoices: 0 };
  }

  const totalInvoices = await db.select({ count: count() }).from(invoices);
  const moreInvoices = await db
    .select({
      invoiceNumber: invoices.invoiceNumber,
      customerName: customers.name,
      status: invoices.status,
      totalAmount: invoices.totalAmount,
      createdAt: invoices.createdAt,
      issueDate: invoices.issueDate,
      dueDate: invoices.dueDate
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .limit(10)
    .offset(offset);
  const newOffset = moreInvoices.length >= 10 ? offset + 10 : null;

  return {
    invoices: moreInvoices,
    newOffset,
    totalInvoices: totalInvoices[0].count
  };
}

export async function createInvoice(data: SelectInvoice) {
  await db.insert(invoices).values(data);
}

export async function updateInvoiceById(id: number, data: Partial<SelectInvoice>) {
  await db.update(invoices).set(data).where(eq(invoices.id, id));
}

export async function deleteInvoiceById(id: number) {
  await db.delete(invoices).where(eq(invoices.id, id));
}

export async function createInvoiceBatch(): Promise<number> {
  const [batch] = await db
    .insert(invoiceBatches)
    .values({ processed: false })
    .returning({ id: invoiceBatches.id });
  return batch.id;
}

export async function markBatchAsProcessed(batchId: number) {
  await db.update(invoiceBatches).set({ processed: true }).where(eq(invoiceBatches.id, batchId));
}


// export async function createInvoicesForService(
//   startingInvoiceNumber: number,
//   serviceId: number,
//   issueDate: Date,
//   dueDate: Date
// ) {
//   const scriptPath = path.resolve("scripts", "generate_invoice.py");
//   const year = issueDate.getFullYear();
//   const batchId = await createInvoiceBatch();

//   const pricingData = await db
//     .select({
//       customerId: customerServicePricing.customerId,
//       customPrice: customerServicePricing.customPrice,
//     })
//     .from(customerServicePricing)
//     .where(eq(customerServicePricing.serviceId, serviceId));

//   let currentInvoiceNumber = 990000 + startingInvoiceNumber;
//   const invoicePromises = pricingData.map(async (data) => {
//     const customer = await getCustomerById(data.customerId);
//     const user = await getUserById(1);
//     const services = await getServiceById(serviceId);

//     const invoice = {
//       invoice_number: `${year}/${currentInvoiceNumber}`,
//       issue_date: issueDate.toISOString(),
//       due_date: dueDate.toISOString(),
//     };
//     currentInvoiceNumber++;

//     // console.log('Invoking Python script with command: python3', scriptPath, `'${JSON.stringify(user[0])}'`, `'${JSON.stringify(customer[0])}'`, `'${JSON.stringify(invoice)}'`, `'${JSON.stringify(services)}'`);

//     // Call Python script
//     const pythonProcess = spawn("python3", [
//       path.resolve(scriptPath),
//       `'${JSON.stringify(user[0])}'`,
//       `'${JSON.stringify(customer[0])}'`,
//       `'${JSON.stringify(invoice)}'`,
//       `'${JSON.stringify(services)}'`,
//     ]);
    
//     let pdfPath = "";
//     for await (const chunk of pythonProcess.stdout) {
//       pdfPath += chunk;
//     }

//     pdfPath = pdfPath.trim(); // Last line contains the file path
//     if (!pdfPath) throw new Error("Failed to generate PDF");

//     // Save invoice to the database
//     const invoiceData = {
//       customerId: data.customerId,
//       invoiceNumber: invoice.invoice_number,
//       totalAmount: data.customPrice,
//       issueDate,
//       dueDate,
//       batchId,
//       url: pdfPath, // Store the path
//     };

//     await db.insert(invoices).values(invoiceData);

//     return invoiceData;
//   });

//   const results = await Promise.all(invoicePromises);
//   return { invoices: results, batchId };
// }


export async function createInvoicesForServiceApi(
  startingInvoiceNumber: number,
  serviceId: number,
  issueDate: Date,
  dueDate: Date
) {
  const year = issueDate.getFullYear();
  const batchId = await createInvoiceBatch();

  const pricingData = await db
    .select({
      customerId: customerServicePricing.customerId,
      customPrice: customerServicePricing.customPrice,
    })
    .from(customerServicePricing)
    .where(eq(customerServicePricing.serviceId, serviceId));

  let currentInvoiceNumber = 990000 + startingInvoiceNumber;

  const invoicePromises = pricingData.map(async (data) => {
    const customer = await getCustomerById(data.customerId);
    const user = await getUserById(1);
    const services = await getServiceById(serviceId);

    const invoice = {
      invoice_number: `${year}/${currentInvoiceNumber}`,
      issue_date: issueDate.toISOString(),
      due_date: dueDate.toISOString(),
    };
    currentInvoiceNumber++;

    // Construct request payload for the FastAPI API
    const requestData = {
      user: user, // Ensure this matches the expected FastAPI model
      customer: customer,
      invoice,
      services,
    };

    try {
      // Call the FastAPI API endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-invoice/", // FastAPI endpoint
        requestData,
        {
          responseType: "arraybuffer", // Ensure PDF file is received as a binary
        }
      );

      // Save the PDF to a specific location
      const pdfFileName = `Invoice_${invoice.invoice_number}.pdf`;
      const pdfFilePath = path.resolve("invoices", pdfFileName);
      require("fs").writeFileSync(pdfFilePath, response.data);

      // Save invoice to the database
      const invoiceData = {
        customerId: data.customerId,
        invoiceNumber: invoice.invoice_number,
        totalAmount: data.customPrice,
        issueDate,
        dueDate,
        batchId,
        url: pdfFilePath, // Store the file path
      };

      await db.insert(invoices).values(invoiceData);

      return invoiceData;
    } catch (error) {
      console.error("Failed to generate PDF for invoice:", invoice.invoice_number, error);
      throw new Error(`Failed to generate invoice for ${data.customerId}`);
    }
  });
}


export type SelectService = typeof services.$inferSelect;
export const insertServiceSchema = createInsertSchema(services);

export async function getServices(
  search: string,
  offset: number
): Promise<{
  services: SelectService[];
  newOffset: number | null;
  totalServices: number;
}> {
  if (search) {
    return {
      services: await db
        .select()
        .from(services)
        .where(ilike(services.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalServices: 0
    };
  }

  if (offset === null) {
    return { services: [], newOffset: null, totalServices: 0 };
  }

  const totalServices = await db.select({ count: count() }).from(services);
  const moreServices = await db.select().from(services).limit(10).offset(offset);
  const newOffset = moreServices.length >= 10 ? offset + 10 : null;

  return {
    services: moreServices,
    newOffset,
    totalServices: totalServices[0].count
  };
}

export async function getAllServices() {
  return await db.select().from(services);
}

export async function getServiceById(id: number) {
  return await db.select().from(services).where(eq(services.id, id)).limit(1);
}

export async function createService(data: SelectService) {
  await db.insert(services).values(data);
}

export async function updateServiceById(id: number, data: Partial<SelectService>) {
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteServiceById(id: number) {
  await db.delete(services).where(eq(services.id, id));
}


export async function getCustomerServicePricing() {
  return await db
    .select({
      customerId: customerServicePricing.customerId,
      serviceId: customerServicePricing.serviceId,
      customPrice: customerServicePricing.customPrice,
      customerName: customers.name,
      serviceName: services.name
    })
    .from(customerServicePricing)
    .innerJoin(customers, eq(customerServicePricing.customerId, customers.id))
    .innerJoin(services, eq(customerServicePricing.serviceId, services.id));
}



export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(10).offset(offset);
  let newOffset = moreProducts.length >= 10 ? offset + 10 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function createProduct(data: SelectProduct) {
  await db.insert(products).values(data);
}

export async function updateProductById(id: number, data: Partial<SelectProduct>) {
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}
