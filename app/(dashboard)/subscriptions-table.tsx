'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Subscription } from './subscription';
import { SelectProduct, SelectSubscription } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubscriptionsTable({
  subscriptions,
  offset,
  totalSubscriptions
}: {
  subscriptions: SelectSubscription[];
  offset: number;
  totalSubscriptions: number;
}) {
  let router = useRouter();
  let subscriptionsPerPage = 10;

  function prevPage() {
    const newOffset = Math.max(0, offset - subscriptionsPerPage);
    router.replace(`/subscriptions/?offset=${newOffset}`, { scroll: false });
  }

  function nextPage() {
    const newOffset = offset + subscriptionsPerPage;
    router.push(`/subscriptions/?offset=${newOffset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>
          Manage your subscriptions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Id</TableHead>
              <TableHead>Product Id</TableHead>
              <TableHead className="hidden md:table-cell">Custom Price</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <Subscription key={subscription.id} subscription={subscription} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(0, Math.min(offset - subscriptionsPerPage, totalSubscriptions) + 1)}-{offset}
            </strong>{' '}
            of <strong>{totalSubscriptions}</strong> subscriptions
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === subscriptionsPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + subscriptionsPerPage > totalSubscriptions}
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
