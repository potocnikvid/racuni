// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { File, PlusCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { CustomersTable } from '../customers-table';
// import { getCustomers } from '@/lib/db';

// export default async function CustomersPage(
//   props: {
//     searchParams: Promise<{ q: string; offset: string }>;
//   }
// ) {
//   const searchParams = await props.searchParams;
//   const search = searchParams.q ?? '';
//   const offset = searchParams.offset ?? 0;
//   const { customers, newOffset, totalCustomers } = await getCustomers(
//     search,
//     Number(offset)
//   );

//   return (
//     <Tabs defaultValue="all">
//       <div className="flex items-center">
//         <TabsList>
//           <TabsTrigger value="all">All</TabsTrigger>
//           <TabsTrigger value="active">Active</TabsTrigger>
//           <TabsTrigger value="inactive">Inactive</TabsTrigger>
//         </TabsList>
//         <div className="ml-auto flex items-center gap-2">
//           <Button size="sm" variant="outline" className="h-8 gap-1">
//             <File className="h-3.5 w-3.5" />
//             <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//               Export
//             </span>
//           </Button>
//           <Button size="sm" className="h-8 gap-1">
//             <PlusCircle className="h-3.5 w-3.5" />
//             <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//               Add Customer
//             </span>
//           </Button>
//         </div>
//       </div>
//       <TabsContent value="all">
//         <CustomersTable
//           customers={customers}
//           offset={Number(offset) ?? 0}
//           totalCustomers={totalCustomers}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }




// "use client";

// import { useState } from "react";
// import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetClose } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { PlusCircle } from "lucide-react";
// import { CustomersTable } from "../customers-table";
// import { getCustomers, createCustomer } from "@/lib/db";

// export default async function CustomersPage(props: { searchParams: Promise<{ q: string; offset: string }> }) {
//   const [newCustomer, setNewCustomer] = useState({ name: "", address: "", taxNumber: 0, email: "", phone: "" });

//   const handleAddCustomer = async () => {
//     try {
//       await createCustomer(newCustomer);
//       // Optionally refresh data or notify success
//       setNewCustomer({ name: "", address: "", taxNumber: 0, email: "", phone: "" });
//     } catch (error) {
//       console.error("Failed to create customer:", error);
//     }
//   };

//   const searchParams = await props.searchParams;
//   const search = searchParams.q ?? "";
//   const offset = searchParams.offset ?? 0;
//   const { customers, newOffset, totalCustomers } = await getCustomers(search, Number(offset));

//   return (
//     <>
//       <div className="flex items-center">
//         <div className="ml-auto flex items-center gap-2">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button size="sm" className="h-8 gap-1">
//                 <PlusCircle className="h-3.5 w-3.5" />
//                 <span>Add Customer</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right">
//               <SheetHeader>
//                 <SheetTitle>Add New Customer</SheetTitle>
//               </SheetHeader>
//               <div className="mt-4 space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={newCustomer.name}
//                   onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Address"
//                   value={newCustomer.address}
//                   onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Tax Number"
//                   value={newCustomer.taxNumber}
//                   onChange={(e) => setNewCustomer({ ...newCustomer, taxNumber: Number(e.target.value) })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//                 />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={newCustomer.email}
//                   onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//                 />
//                 <input
//                   type="tel"
//                   placeholder="Phone"
//                   value={newCustomer.phone}
//                   onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
//                 />
//               </div>
//               <SheetFooter>
//                 <Button variant="outline" onClick={() => setNewCustomer({ name: "", address: "", taxNumber: 0, email: "", phone: "" })}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleAddCustomer}>Save</Button>
//               </SheetFooter>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//       <CustomersTable customers={customers} offset={Number(offset)} totalCustomers={totalCustomers} />
//     </>
//   );
// }


import { getCustomers } from "@/lib/db";
import { CustomerPageContent } from "../customer-page-content";

export default async function CustomersPage(props: { searchParams: any }) {
  const search = props.searchParams.q ?? "";
  const offset = Number(props.searchParams.offset) || 0;
  const { customers, totalCustomers } = await getCustomers(search, offset);

  return (
    <CustomerPageContent customers={customers} totalCustomers={totalCustomers} offset={offset} />
  );
}
