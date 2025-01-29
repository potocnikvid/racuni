import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectSubscription } from '@/lib/db';
import { deleteSubscription } from './actions';

export function Subscription({ subscription }: { subscription: SelectSubscription }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{subscription.customerId}</TableCell>
      <TableCell className="font-medium">{subscription.serviceId}</TableCell>
      <TableCell className="hidden md:table-cell">{`$${subscription.customPrice}`}</TableCell>
      <TableCell className="font-medium">{subscription.active ? 'Yes' : 'No'}</TableCell>
      <TableCell className="hidden md:table-cell">
        {subscription.createdAt.toLocaleDateString("en-US")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteSubscription}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
