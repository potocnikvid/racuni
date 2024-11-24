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
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

// Enum for invoice statuses
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'pending',
  'paid',
  'overdue',
  'cancelled'
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
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
  batchId: integer('batch_id').references(() => invoiceBatches.id) // Optional batch reference
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





export type SelectUser = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users);

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
  totalUsers: number;
}> {
  if (search) {
    return {
      users: await db
        .select()
        .from(users)
        .where(ilike(users.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalUsers: 0
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null, totalUsers: 0 };
  }

  const totalUsers = await db.select({ count: count() }).from(users);
  const moreUsers = await db.select().from(users).limit(10).offset(offset);
  const newOffset = moreUsers.length >= 5 ? offset + 5 : null;

  return {
    users: moreUsers,
    newOffset,
    totalUsers: totalUsers[0].count
  };
}

export async function createUser(data: SelectUser) {
  await db.insert(users).values(data);
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

export async function createInvoicesForService(startingInvoiceNumber: number, serviceId: number, issueDate: Date, dueDate: Date) {
  console.log('Creating invoices for service:', serviceId);
  console.log('Issue Date:', issueDate);
  console.log('Due Date:', dueDate);
  console.log('Starting Invoice Number:', startingInvoiceNumber);
  const year = issueDate.getFullYear();
  const batchId = await createInvoiceBatch(); // Create batch

  const pricingData = await db
    .select({
      customerId: customerServicePricing.customerId,
      customPrice: customerServicePricing.customPrice
    })
    .from(customerServicePricing)
    .where(eq(customerServicePricing.serviceId, serviceId));

  let currentInvoiceNumber = 990000 + startingInvoiceNumber;

  const invoicesData = pricingData.map((data) => {
    const invoice = {
      customerId: data.customerId,
      invoiceNumber: `${year}/${currentInvoiceNumber}`,
      totalAmount: data.customPrice,
      issueDate,
      dueDate,
      batchId
    };
    currentInvoiceNumber += 1; // Increment the invoice number
    return invoice;
  });

  if (invoicesData.length === 0) {
    throw new Error('No pricing data found for the given service.');
  }
  
  try {
    await db.insert(invoices).values(invoicesData);
    return { invoices, batchId };

  } catch (error) {
    console.error('Error inserting invoices:', error);
    throw error;
  }
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
