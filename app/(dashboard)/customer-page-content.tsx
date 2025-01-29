"use client";

import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CustomersTable } from "./customers-table";
import { createCustomer } from "@/lib/db";

export function CustomerPageContent({
  customers,
  offset,
  totalCustomers,
}: {
  customers: Array<{ name: string; address: string; taxNumber: number; email: string | null; phone: string | null, createdAt: Date }>;
  offset: number;
  totalCustomers: number;
}) {
  const [newCustomer, setNewCustomer] = useState({ name: "", address: "", taxNumber: 0, email: "", phone: "" });

  const handleAddCustomer = async () => {
    try {
      await createCustomer(newCustomer);
      // Optionally trigger a data refresh here
      setNewCustomer({ name: "", address: "", taxNumber: 0, email: "", phone: "" });
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Customer</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Add New Customer</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <input
                  type="number"
                  placeholder="Tax Number"
                  value={newCustomer.taxNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, taxNumber: Number(e.target.value) })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setNewCustomer({ name: "", address: "", taxNumber: 0, email: "", phone: "" })}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer}>Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CustomersTable customers={customers} totalCustomers={totalCustomers} offset={offset}/>
    </>
  );
}
