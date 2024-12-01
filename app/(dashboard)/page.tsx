import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CustomSelect } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createInvoicesAction } from './actions'; // Import the action
import { getAllServices } from '@/lib/db';
import { auth, signOut } from '@/lib/auth';

export default async function HomePage() {
  // Fetch services (ensure this is a server component)
  const session = await auth();

  const services = await getAllServices();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoices Batch</CardTitle>
        <CardDescription>
          Fill out the details to generate a invoice batch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createInvoicesAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="service" className="text-sm font-medium">
                Service
              </label>
              <CustomSelect
                id="service"
                name="serviceId"
                options={services.map((service) => ({
                  value: String(service.id),
                  label: service.name
                }))}
                required
              />
            </div>
            <div>
              <label htmlFor="invoiceNumber" className="text-sm font-medium">
                Invoice Number
              </label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                placeholder="Enter starting invoice number"
                required
              />
            </div>
            <div>
              <label htmlFor="issueDate" className="text-sm font-medium">
                Invoice Issue Date
              </label>
              <Input id="issueDate" name="issueDate" type="date" required />
            </div>
            <div>
              <label htmlFor="dueDate" className="text-sm font-medium">
                Invoice Due Date
              </label>
              <Input id="dueDate" name="dueDate" type="date" required />
            </div>
          </div>

          <CardFooter className="flex justify-end">
            <Button type="submit">Create Invoices</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}