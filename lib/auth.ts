// import NextAuth from 'next-auth';
// import { authConfig } from 'auth.config';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import { getUserByEmail } from './db';
// import bcrypt from 'bcrypt';

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       // Provide a proper return type for `authorize`
//       async authorize(credentials) {
//         // Validate the credentials using zod
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);

//           if (parsedCredentials.success) {
//             const { email, password } = parsedCredentials.data;
//             const user = await getUser(email);
//             if (!user) return null;
//             const passwordsMatch = await bcrypt.compare(password, user.password);
   
//             if (passwordsMatch) return user;
//           }
   
//           console.log('Invalid credentials');
//           return null;
//       },
//     }),
//   ],
// });


import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { authConfig } from 'auth.config';
import { getUserByEmail } from './db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUserByEmail(email);
        if (!user) return null;
        let passwordsMatch = await compare(password, user.password!);
        if (passwordsMatch) return user as any;
      },
    }),
  ],
});