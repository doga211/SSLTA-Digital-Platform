



// import {
//   createServerClient as createSSRServerClient,
// } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// type ServerClientOptions = NonNullable<
//   Parameters<typeof createSSRServerClient>[2]
// >

// type ServerClient = ReturnType<typeof createSSRServerClient>

// // New API: automatically obtains Next.js cookies.
// export function createServerClient(): Promise<ServerClient>

// // Legacy API: preserves existing three-argument callers.
// export function createServerClient(
//   url: string,
//   key: string,
//   options: ServerClientOptions
// ): ServerClient

// export function createServerClient(
//   url?: string,
//   key?: string,
//   options?: ServerClientOptions
// ): ServerClient | Promise<ServerClient> {

//   // Preserve existing application integrations.
//   if (url && key && options) {
//     return createSSRServerClient(url, key, options)
//   }

//   // Reject incomplete legacy configurations.
//   if (url || key || options) {
//     throw new Error('Incomplete Supabase server client configuration')
//   }

//   // New cookie-aware initialization.
//   return createClientWithCookies()
// }

// async function createClientWithCookies(): Promise<ServerClient> {
//   const cookieStore = await cookies()

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

//   if (!supabaseUrl || !supabaseKey) {
//     throw new Error('Supabase environment variables are missing')
//   }

//   return createSSRServerClient(supabaseUrl, supabaseKey, {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll()
//       },

//       setAll(cookiesToSet) {
//         try {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             cookieStore.set(name, value, options)
//           })
//         } catch {
//           // Server Components may not have permission to write cookies.
//         }
//       },
//     },
//   })
// }




import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase server environment configuration'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Cookie updates may be handled by middleware.
          }
        },
      },
    }
  )
}