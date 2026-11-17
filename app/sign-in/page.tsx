
import { Suspense } from 'react'
import SignInForm from './SignInForm'

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <section className="auth-card">
            <p>Loading sign-in page...</p>
          </section>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  )
}










// import { Suspense } from 'react'
// import SignInForm from './SignInForm'

// export default function SignInPage() {
//   return (
//     <Suspense
//       fallback={
//         <main className="auth-page">
//           <section className="auth-card">
//             <p>Loading sign-in page…</p>
//           </section>
//         </main>
//       }
//     >
//       <SignInForm />
//     </Suspense>
//   )
// }







// 'use client'

// import Image from 'next/image'
// import { FormEvent, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'

// export default function SignInPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setError('')
//     setLoading(true)
//     const supabase = createClient()
//     if (!supabase) {
//       setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
//       setLoading(false)
//       return
//     }

//     const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
//     if (signInError) {
//       setError(signInError.message)
//       setLoading(false)
//       return
//     }

//     router.replace(searchParams.get('next') || '/admin/dashboard')
//     router.refresh()
//   }

//   return (
//     <main className="auth-page">
//       <section className="auth-card">
//         <Image src="/images/sslta-logo.jpg" alt="SSLTA" width={82} height={82} priority />
//         <h1>SSLTA Management Portal</h1>
//         <p>Authorized federation users only.</p>
//         <form className="form" onSubmit={submit}>
//           <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required /></label>
//           <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required /></label>
//           {error && <div className="notice" role="alert">{error}</div>}
//           <button className="btn btn-blue" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
//         </form>
//       </section>
//     </main>
//   )
// }





// "use client";

// import { FormEvent, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { createClient } from "../../lib/supabase/browser";

// export default function SignIn() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const next = searchParams.get("next") || "/admin";

//   async function submit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     const supabase = createClient();

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       setError(error.message);
//       setLoading(false);
//       return;
//     }

//     // Return the user to the page they originally requested.
//     router.replace(next);
//     router.refresh();
//   }

//   return (
//     <main className="landing">
//       <form className="landing-card" onSubmit={submit}>
//         <div className="crest">ES</div>

//         <p className="eyebrow">
//           EL SULTAN LAW FIRM · SECURE ACCESS
//         </p>

//         <h1>
//           Platform <i>sign in.</i>
//         </h1>

//         <p>Authorized personnel only.</p>

//         <label
//           style={{
//             display: "grid",
//             gap: 7,
//             marginTop: 22,
//             fontSize: 11,
//           }}
//         >
//           Email

//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             autoComplete="email"
//             required
//             style={{
//               padding: 12,
//               border: "1px solid #dfe5ea",
//               borderRadius: 7,
//             }}
//           />
//         </label>

//         <label
//           style={{
//             display: "grid",
//             gap: 7,
//             marginTop: 12,
//             fontSize: 11,
//           }}
//         >
//           Password

//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             type="password"
//             autoComplete="current-password"
//             required
//             style={{
//               padding: 12,
//               border: "1px solid #dfe5ea",
//               borderRadius: 7,
//             }}
//           />
//         </label>

//         {error && (
//           <p
//             style={{
//               color: "#a94b4b",
//               fontSize: 11,
//               marginTop: 12,
//             }}
//           >
//             {error}
//           </p>
//         )}

//         <button
//           type="submit"
//           className="btn gold"
//           disabled={loading}
//           style={{
//             marginTop: 18,
//             width: "100%",
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           {loading ? "Signing in..." : "Sign in"}
//         </button>
//       </form>
//     </main>
//   );
// }
