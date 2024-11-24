'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export function CustomersTable({
  customers,
  offset,
  totalCustomers
}: {
  customers: Array<{
    name: string;
    address: string;
    taxNumber: number;
    createdAt: Date;
  }>;
  offset: number;
  totalCustomers: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customersPerPage = 10;
  console.log('Offset:', offset);

  function prevPage() {
    const newOffset = Math.max(0, offset - customersPerPage);
    router.replace(`/customers/?offset=${newOffset}`, { scroll: false });
  }

  function nextPage() {
    const newOffset = offset + customersPerPage;
    router.push(`/customers/?offset=${newOffset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>View and manage all customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Tax Number</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.taxNumber}</TableCell>
                <TableCell>
                  {format(new Date(customer.createdAt), 'dd-mm-yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(1, offset + 1)}-
              {Math.min(offset + customersPerPage, totalCustomers)}
            </strong>{' '}
            of <strong>{totalCustomers}</strong> customers
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              type="button"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              type="button"
              disabled={offset + customersPerPage >= totalCustomers}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
