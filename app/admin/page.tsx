import Image from "next/image"; 
import Link from "next/link"; 
import { signInAdmin } from "@/app/actions/auth";
export default async function AdminLogin({searchParams}:{searchParams:Promise<{error?:string}>})
{
    const {error}=await searchParams;
    return <main className="auth-page"><div className="auth-card">
        <Image src="/images/sslta-logo.jpg" alt="SSLTA" width={85} height={85}/>
        <h1>SSLTA Management</h1>
        <p>Secure administration portal for authorized SSLTA officials.</p>
        {error&&<p className="form-error">{error==="credentials"?"Invalid email or password.":error==="unauthorized"?"Your account is not authorized for management access.":"Unable to connect. Check Supabase configuration."}</p>}<form className="form" action={signInAdmin}><input name="email" placeholder="Email address" type="email" autoComplete="username" required/><input name="password" placeholder="Password" type="password" autoComplete="current-password" required/><button className="btn btn-primary" type="submit">Sign in securely</button></form><p style={{marginTop:20}}><Link href="/">← Return to public website</Link></p></div></main>}
