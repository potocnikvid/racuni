import { db, products, users, customers, services, customerServicePricing, invoiceBatches, invoices, invoiceItems } from 'lib/db';

export const dynamic = 'force-dynamic';

// export async function GET() {
//   Seed Products
//   await db.insert(products).values([
//     {
//       id: 1,
//       imageUrl:
//         'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/smartphone-gaPvyZW6aww0IhD3dOpaU6gBGILtcJ.webp',
//       name: 'Smartphone X Pro',
//       status: 'active',
//       customPrice: '999.00',
//       stock: 150,
//       availableAt: new Date()
//     },
//     {
//       id: 2,
//       imageUrl:
//         'https://uwja77bygk2kgfqe.public.blob.vercel-storage.com/earbuds-3rew4JGdIK81KNlR8Edr8NBBhFTOtX.webp',
//       name: 'Wireless Earbuds Ultra',
//       status: 'active',
//       customPrice: '199.00',
//       stock: 300,
//       availableAt: new Date()
//     },
//     // ...more product data
//   ]);

//   // Seed Users
//   await db.insert(users).values([
//     {
//       id: 1,
//       name: 'John Doe',
//       address: '123 Main St',
//       taxPayer: true,
//       taxNumber: '12345678',
//       registrationNumber: '987654321',
//       phone: '123-456-7890',
//       iban: 'SI56 1234 5678 1234 567',
//       bank: 'Bank A'
//     },
//     {
//       id: 2,
//       name: 'Jane Smith',
//       address: '456 Oak St',
//       taxPayer: false,
//       taxNumber: '87654321',
//       registrationNumber: '123987654',
//       phone: '987-654-3210',
//       iban: 'SI56 7654 3210 9876 543',
//       bank: 'Bank B'
//     }
//   ]);

//   // Seed Customers
//   await db.insert(customers).values([
//     {
//       id: 1,
//       name: 'Acme Corp',
//       email: 'info@acme.com',
//       phone: '123-456-7890',
//       address: '789 Pine St',
//       taxNumber: 12345678,
//       createdAt: new Date()
//     },
//     {
//       id: 2,
//       name: 'Global Inc',
//       email: 'contact@global.com',
//       phone: '987-654-3210',
//       address: '654 Maple St',
//       taxNumber: 87654321,
//       createdAt: new Date()
//     }
//   ]);

//   // Seed Services
//   await db.insert(services).values([
//     {
//       id: 1,
//       name: 'Web Hosting',
//       description: 'Monthly subscription for web hosting services',
//       customPrice: '9.99',
//       createdAt: new Date()
//     },
//     {
//       id: 2,
//       name: 'Domain Registration',
//       description: 'Annual domain registration fee',
//       customPrice: '14.99',
//       createdAt: new Date()
//     }
//   ]);

//   // Seed Customer Service Pricing
//   await db.insert(customerServicePricing).values([
//     {
//       id: 1,
//       customerId: 1,
//       serviceId: 1,
//       customcustomPrice: '8.99',
//       createdAt: new Date()
//     },
//     {
//       id: 2,
//       customerId: 2,
//       serviceId: 2,
//       customcustomPrice: '13.99',
//       createdAt: new Date()
//     }
//   ]);

//   // Seed Invoice Batches
//   const batchId = await db.insert(invoiceBatches).values([
//     { processed: false }
//   ]).returning({ id: invoiceBatches.id });

//   // Seed Invoices
//   await db.insert(invoices).values([
//     {
//       id: 1,
//       customerId: 1,
//       invoiceNumber: '2024/001',
//       status: 'pending',
//       totalAmount: '8.99',
//       createdAt: new Date(),
//       dueDate: new Date('2024-12-31'),
//       batchId: batchId[0].id
//     },
//     {
//       id: 2,
//       customerId: 2,
//       invoiceNumber: '2024/002',
//       status: 'pending',
//       totalAmount: '13.99',
//       createdAt: new Date(),
//       dueDate: new Date('2024-12-31'),
//       batchId: batchId[0].id
//     }
//   ]);

//   // Seed Invoice Items
//   await db.insert(invoiceItems).values([
//     {
//       id: 1,
//       invoiceId: 1,
//       serviceId: 1,
//       quantity: 1,
//       total: '8.99'
//     },
//     {
//       id: 2,
//       invoiceId: 2,
//       serviceId: 2,
//       quantity: 1,
//       total: '13.99'
//     }
//   ]);
// }

export async function GET() {
  // Seed Customers Table
  await db.insert(customers).values([
    {
      name: "MEPAX, d.o.o., Kranj",
      address: "Planina 5 , 4000 Kranj",
      taxNumber: 98857967
    },
    {
      name: "VIBO CARS, Borivoje Vidaković s.p.",
      address: "Cesta v Mestni log 55, 1000 Ljubljana",
      taxNumber: 83701923
    },
    {
      name: "AVTO MOSTE d.o.o.",
      address: "Kajuhova ulica 32A, 1000 Ljubljana",
      taxNumber: 43292224
    },
    {
      name: "AVTOHIŠA REAL, d.o.o.",
      address: "Vodovodna cesta 93, 1000 Ljubljana",
      taxNumber: 43292224
    },
    {
      name: "PAN-JAN d.o.o.",
      address: "Obrtniška ulica 33, 8210 Trebnje",
      taxNumber: 64653609
    },
    {
      name: "AVTOMOBILI LEONARDO, Naki Aziri s.p.",
      address: "Ruška cesta 77, 2000 Maribor",
      taxNumber: 64893391
    },
    {
      name: "EKOMOBIL CAR, d.o.o.",
      address: "Ptujska cesta 134, 2000 Maribor",
      taxNumber: 64508072
    },
    {
      name: "AVTO CENTER ROK d.o.o.",
      address: "Videm 53, 1262 Dol pri Ljubljani",
      taxNumber: 71609334
    },
    {
      name: "EVROAVTO PTUJ d.o.o.",
      address: "Mariborska cesta 43, 2250 Ptuj",
      taxNumber: 96020946
    },
    {
      name: "TOP GROUP d.o.o.",
      address: "Skorba 36M, 2288 Hajdina",
      taxNumber: 11345250
    },
    {
      name: "AVTO SERVIS STRAŠEK d.o.o.",
      address: "Krtince 15, 3241 Podplat",
      taxNumber: 80733506
    },
    {
      name: "CETENA d.o.o.",
      address: "Hmeljarska ulica 20, 3311 Šempeter v Savinjski dolini",
      taxNumber: 70097992
    },
    {
      name: "TPV AVTO d.o.o.",
      address: "Kandijska cesta 60, 8000 Novo mesto",
      taxNumber: 24891002
    },
    {
      name: "P & D AVTO d.o.o.",
      address: "Špelina ulica 1, 2000 Maribor",
      taxNumber: 94340463
    },
    {
      name: "Avtoline RV d.o.o.",
      address: "Žadovinek 37, 8273 Leskovec pri Krškem",
      taxNumber: 13315366
    },
    {
      name: "AC LOVŠE d.o.o.",
      address: "Jarška cesta 11, 1230 Domžale",
      taxNumber: 60793511
    },
    {
      name: "PLUS VITA AVTO d.o.o.",
      address: "Slance 8, 3221 Teharje",
      taxNumber: 11752734
    },
    {
      name: "AVTOCENTER PANDA",
      address: "Zadobrova 84A, 3211 Škofja vas",
      taxNumber: 73715000
    },
    {
      name: "TIP-TOP AVTOMOBILI d.o.o.",
      address: "Kompole 126, 3220 Štore",
      taxNumber: 86866150
    },
    {
      name: "AC VOVK d.o.o.",
      address: "Ločna 10A, 8000 Novo mesto",
      taxNumber: 22779540
    },
    {
      name: "ROBO MOBIL, Robert Gaber s.p.",
      address: "Višnja vas 36, 3212 Vojnik",
      taxNumber: 72234075
    },
    {
      name: "IGOR LOVŠE S.P.",
      address: "Mali Obrež 26, 8257 Dobova",
      taxNumber: 46988840
    },
    {
      name: "A.D. AVTO DENIS ANTLEJ, s.p.",
      address: "Bodrež 14A, 3231 Grobelno",
      taxNumber: 17375428
    },
    {
      name: "AC MAKKO",
      address: "Cesta na Brdo 49, 4000 Kranj",
      taxNumber: 39846601
    },
    {
      name: "CSG d.o.o.",
      address: "Pelechova cesta 17G, 1235 Radomlje",
      taxNumber: 69423911
    },
    {
      name: "AVTO SLAK d.o.o.",
      address: "Obrtniška ulica 51, 8210 Trebnje",
      taxNumber: 57404453
    },
    {
      name: "PRO ART d.o.o.",
      address: "Likozarjeva ulica 20A, 4000 Kranj",
      taxNumber: 55841180
    },
    {
      name: "AB, Branka Atelj s.p.",
      address: "Novo Polje, cesta XI 1, 1260 LJUBLJANA-POLJE",
      taxNumber: 90259424
    },
    {
      name: "VLADIMIR MUŽERLIN S.P.",
      address: "Gornja vas 14, 3231 Grobelno",
      taxNumber: 53222954
    }
  ]);

  // Seed Customer Service Pricing Table
  const serviceId = 3; // Service ID
  await db.insert(customerServicePricing).values([
    {
      customerId: 1,
      customPrice: '80',
      serviceId: serviceId
    },
    {
      customerId: 2,
      customPrice: '120',
      serviceId: serviceId
    },
    {
      customerId: 3,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 4,
      customPrice: '130',
      serviceId: serviceId
    },
    {
      customerId: 5,
      customPrice: '240',
      serviceId: serviceId
    },
    {
      customerId: 6,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 7,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 8,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 9,
      customPrice: '140',
      serviceId: serviceId
    },
    {
      customerId: 10,
      customPrice: '240',
      serviceId: serviceId
    },
    {
      customerId: 11,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 12,
      customPrice: '140',
      serviceId: serviceId
    },
    {
      customerId: 13,
      customPrice: '170',
      serviceId: serviceId
    },
    {
      customerId: 14,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 15,
      customPrice: '130',
      serviceId: serviceId
    },
    {
      customerId: 16,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 17,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 18,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 19,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 20,
      customPrice:'130',
      serviceId: serviceId
    },
    {
      customerId: 21,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 22,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 23,
      customPrice: '140',
      serviceId: serviceId
    },
    {
      customerId: 24,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 25,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 26,
      customPrice: '130',
      serviceId: serviceId
    },
    {
      customerId: 27,
      customPrice: '150',
      serviceId: serviceId
    },
    {
      customerId: 28,
      customPrice: '100',
      serviceId: serviceId
    },
    {
      customerId: 29,
      customPrice: '130',
      serviceId: serviceId
    }
  ]);
  return Response.json({ message: 'Seed data has been successfully added!' });
}
