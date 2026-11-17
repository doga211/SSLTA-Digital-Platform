"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Trophy, Medal, Newspaper, Images, Building2, LogOut, Menu, X, UserRound, CalendarDays, ShieldCheck, ClipboardList, GitBranch, Radio, Flag, Sprout, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const items = [
  ["Dashboard", "/admin/dashboard", LayoutDashboard],
  ["Players", "/admin/players", Users],
  ["Clubs & Centres", "/admin/clubs", Building2],
  ["Tournaments", "/admin/tournaments", Trophy],
  ["Rankings", "/admin/rankings", Medal],
  ["Calendar", "/admin/events", CalendarDays],
  ["Membership", "/admin/memberships", UserRound],
  ["Registrations", "/admin/registrations", ClipboardList],
  ["Draws", "/admin/draws", GitBranch],
  ["Matches", "/admin/matches", Radio],
  ["Scheduling", "/admin/scheduling", CalendarDays],
  ["Live Control", "/admin/live", Radio],
  ["National Teams", "/admin/national-teams", Flag],
  ["Development", "/admin/development", Sprout],
  ["Reports", "/admin/reports", BarChart3],
  ["Events Calendar", "/admin/events", CalendarDays],
  ["News & Blog", "/admin/news", Newspaper],
  ["Gallery", "/admin/gallery", Images],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return <div className="admin-layout">
    <aside className={open ? "admin-sidebar show" : "admin-sidebar"}>
      <div className="admin-brand"><Image src="/images/sslta-logo.jpg" alt="SSLTA" width={52} height={52}/><div><b>SSLTA</b><small>Federation Management</small></div></div>
      <div className="admin-label">OPERATIONS</div>
      {items.map(([label, href, Icon]) => <Link key={`${label}-${href}`} href={href} onClick={() => setOpen(false)}><Icon size={18}/><span>{label}</span></Link>)}
      <div className="admin-label">GOVERNANCE</div>
      <Link href="/admin/dashboard#profile" onClick={() => setOpen(false)}><UserRound size={18}/><span>My Profile</span></Link>
      <Link href="/admin/dashboard#security" onClick={() => setOpen(false)}><ShieldCheck size={18}/><span>Security</span></Link>
      <div className="admin-side-bottom">
        <Link href="/"><LogOut size={18}/>View Public Website</Link>
        <button className="admin-signout" onClick={signOut}><LogOut size={18}/>Sign out</button>
      </div>
    </aside>
    <div className="admin-content"><div className="admin-mobilebar"><button onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button><b>SSLTA Federation Management</b></div>{children}</div>
  </div>
}
