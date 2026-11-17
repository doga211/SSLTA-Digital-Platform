import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};





// import {createServerClient} from '@supabase/ssr';
// import {NextResponse,type NextRequest} from 'next/server';
// export async function proxy(request:NextRequest){
//     let response=NextResponse.next({request});
//     const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//         {cookies:{getAll(){return request.cookies.getAll()},
//         setAll(cookiesToSet){cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
//         response=NextResponse.next({request});
//         cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}});
//         const {data:{user}}=await supabase.auth.getUser();if(request.nextUrl.pathname.startsWith('/admin')&&!request.nextUrl.pathname.startsWith('/admin/login')&&!user){const url=request.nextUrl.clone();url.pathname='/admin/login';return NextResponse.redirect(url)}return response}
// export const config={matcher:['/admin/:path*']};










// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function proxy(request: NextRequest) {
//   let response = NextResponse.next({ request });
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() { return request.cookies.getAll(); },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
//           response = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
//         },
//       },
//     }
//   );

//   const { data } = await supabase.auth.getClaims();
//   const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
//   const isAuthRoute = request.nextUrl.pathname.startsWith('/sign-in');

//   if (isAdminRoute && !data?.claims) {
//     const url = request.nextUrl.clone();
//     url.pathname = '/sign-in';
//     url.searchParams.set('next', request.nextUrl.pathname);
//     return NextResponse.redirect(url);
//   }

//   if (isAuthRoute && data?.claims && request.nextUrl.pathname !== '/auth/error') {
//     return NextResponse.redirect(new URL('/admin', request.url));
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/admin/:path*', '/sign-in/:path*'],
// };












// import {createServerClient} from '@supabase/ssr';
// import {NextResponse,type NextRequest} from 'next/server';
// export async function proxy(request:NextRequest){let response=NextResponse.next({request});const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll(){return request.cookies.getAll()},setAll(cookiesToSet){cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}});const {data:{user}}=await supabase.auth.getUser();if(request.nextUrl.pathname.startsWith('/admin')&&!request.nextUrl.pathname.startsWith('/admin/login')&&!user){const url=request.nextUrl.clone();url.pathname='/admin/login';return NextResponse.redirect(url)}return response}
// export const config={matcher:['/admin/:path*']};



// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function proxy(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },

//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => {
//             request.cookies.set(name, value);
//           });

//           supabaseResponse = NextResponse.next({
//             request,
//           });

//           cookiesToSet.forEach(({ name, value, options }) => {
//             supabaseResponse.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   // Validate / refresh the Supabase Auth session.
//   const { data } = await supabase.auth.getClaims();

//   const user = data?.claims;

//   const pathname = request.nextUrl.pathname;

//   // Protect the admin area.
//   // /admin/login remains publicly accessible.
//   const isAdminRoute =
//     pathname.startsWith("/admin") &&
//     !pathname.startsWith("/admin/login");

//   if (isAdminRoute && !user) {
//     const loginUrl = request.nextUrl.clone();

//     loginUrl.pathname = "/admin/login";
//     loginUrl.searchParams.set("next", pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   return supabaseResponse;
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };








// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function proxy(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },

//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => {
//             request.cookies.set(name, value);
//           });

//           supabaseResponse = NextResponse.next({
//             request,
//           });

//           cookiesToSet.forEach(({ name, value, options }) => {
//             supabaseResponse.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   // Validate the Supabase authentication token.
//   const { data } = await supabase.auth.getClaims();

//   const user = data?.claims;

//   const pathname = request.nextUrl.pathname;

//   // Protect /admin routes.
//   const isAdminRoute = pathname.startsWith("/admin");

//   if (isAdminRoute && !user) {
//     const loginUrl = request.nextUrl.clone();

//     // Use the actual sign-in page.
//     loginUrl.pathname = "/sign-in";

//     // Preserve the page the user originally requested.
//     loginUrl.search = "";
//     loginUrl.searchParams.set("next", pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   return supabaseResponse;
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };