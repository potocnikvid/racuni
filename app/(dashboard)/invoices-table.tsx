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
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export function InvoicesTable({
  invoices,
  offset,
  totalInvoices
}: {
  invoices: Array<{
    invoiceNumber: string;
    customerName: string;
    status: string;
    totalAmount: string;
    issueDate: Date;
    date: Date;
    dueDate: Date;
  }>;
  offset: number;
  totalInvoices: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoicesPerPage = 10;
  console.log('Offset:', offset);

  function prevPage() {
    const newOffset = Math.max(0, offset - invoicesPerPage);
    router.replace(`/invoices/?offset=${newOffset}`, { scroll: false });
  }

  function nextPage() {
    const newOffset = offset + invoicesPerPage;
    router.push(`/invoices/?offset=${newOffset}`, { scroll: false });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>View and manage all invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>IssueDate</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>${invoice.totalAmount}</TableCell>
                <TableCell>{format(new Date(invoice.issueDate), 'dd-mm-yyyy')}</TableCell>
                <TableCell>{format(new Date(invoice.date), 'dd-mm-yyyy')}</TableCell>
                <TableCell>{format(new Date(invoice.dueDate), 'dd-mm-yyyy')}</TableCell>
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
              {Math.min(offset + invoicesPerPage, totalInvoices)}
            </strong>{' '}
            of <strong>{totalInvoices}</strong> invoices
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
              disabled={offset + invoicesPerPage >= totalInvoices}
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
