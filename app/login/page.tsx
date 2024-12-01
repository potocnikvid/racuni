// 'use client'

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { signIn } from 'next-auth/react';
// import { useState } from 'react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     const result = await signIn('credentials', {
//       redirect: false,
//       email,
//       password
//     });

//     if (result?.error) {
//       setError('Invalid email or password');
//     } else {
//       window.location.href = '/'; // Redirect to home page on successful login
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-start md:items-center p-8">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>
//             Login with your email and password.
//           </CardDescription>
//         </CardHeader>
//         <CardFooter>
//           <form onSubmit={handleSignIn} className="w-full space-y-4">
//             {error && <p className="text-red-500">{error}</p>}
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             />
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//           </form>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }



import Link from 'next/link';
import { Form } from 'app/(dashboard)/form';
import { signIn } from '@/lib/auth';
import { SubmitButton } from '@/components/ui/submit-button';

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            'use server';
            await signIn('credentials', {
              redirectTo: '/',
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            });
          }}
        >
          <SubmitButton>Sign in</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {' for free.'}
          </p>
        </Form>
      </div>
    </div>
  );
}