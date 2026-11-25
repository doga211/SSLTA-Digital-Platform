// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { LayoutDashboard, Users, Trophy, Medal, Newspaper, Images, Building2, LogOut, Menu, X, UserRound, CalendarDays, ShieldCheck, ClipboardList, GitBranch, Radio, Flag, Sprout, BarChart3 } from "lucide-react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";

// const items = [
//   ["Dashboard", "/admin/dashboard", LayoutDashboard],
//   ["Players", "/admin/players", Users],
//   ["Clubs & Centres", "/admin/clubs", Building2],
//   ["Tournaments", "/admin/tournaments", Trophy],
//   ["Rankings", "/admin/rankings", Medal],
//   ["Calendar", "/admin/events", CalendarDays],
//   ["Membership", "/admin/memberships", UserRound],
//   ["Registrations", "/admin/registrations", ClipboardList],
//   ["Draws", "/admin/draws", GitBranch],
//   ["Matches", "/admin/matches", Radio],
//   ["Scheduling", "/admin/scheduling", CalendarDays],
//   ["Live Control", "/admin/live", Radio],
//   ["National Teams", "/admin/national-teams", Flag],
//   ["Development", "/admin/development", Sprout],
//   ["Reports", "/admin/reports", BarChart3],
//   ["Events Calendar", "/admin/events", CalendarDays],
//   ["News & Blog", "/admin/news", Newspaper],
//   ["Gallery", "/admin/gallery", Images],

// ] as const;

// export function AdminShell({ children }: { children: React.ReactNode }) {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   async function signOut() {
//     const supabase = createClient();
//     if (supabase) await supabase.auth.signOut();
//     router.replace("/sign-in");
//     router.refresh();
//   }

//   return <div className="admin-layout">
//     <aside className={open ? "admin-sidebar show" : "admin-sidebar"}>
//       <div className="admin-brand"><Image src="/images/sslta-logo.jpg" alt="SSLTA" width={52} height={52}/><div><b>SSLTA</b><small>Federation Management</small></div></div>
//       <div className="admin-label">OPERATIONS</div>
//       {items.map(([label, href, Icon]) => <Link key={`${label}-${href}`} href={href} onClick={() => setOpen(false)}><Icon size={18}/><span>{label}</span></Link>)}
//       <div className="admin-label">GOVERNANCE</div>
//       <Link href="/admin/profile" onClick={() => setOpen(false)}><UserRound size={18}/><span>My Profile</span></Link>
//       <Link href="/admin/enquiries" onClick={() => setOpen(false)}><ClipboardList size={18}/><span>Enquiries</span></Link>
//       <Link href="/admin/security" onClick={() => setOpen(false)}><ShieldCheck size={18}/><span>Security</span></Link>
//       <div className="admin-side-bottom">
//         <Link href="/"><LogOut size={18}/>View Public Website</Link>
//         <button className="admin-signout" onClick={signOut}><LogOut size={18}/>Sign out</button>
//       </div>
//     </aside>
//     <div className="admin-content"><div className="admin-mobilebar"><button onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button><b>SSLTA Federation Management</b></div>{children}</div>
//   </div>
// }





"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Flag,
  GitBranch,
  Images,
  LayoutDashboard,
  LogOut,
  Medal,
  Menu,
  Newspaper,
  Radio,
  ShieldCheck,
  Sprout,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const operationItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Players", href: "/admin/players", Icon: Users },
  { label: "Clubs & Centres", href: "/admin/clubs", Icon: Building2 },
  { label: "Tournaments", href: "/admin/tournaments", Icon: Trophy },
  { label: "Rankings", href: "/admin/rankings", Icon: Medal },
  { label: "Calendar", href: "/admin/events", Icon: CalendarDays },
  { label: "Membership", href: "/admin/memberships", Icon: UserRound },
  { label: "Registrations", href: "/admin/registrations", Icon: ClipboardList },
  { label: "Draws", href: "/admin/draws", Icon: GitBranch },
  { label: "Matches", href: "/admin/matches", Icon: Radio },
  { label: "Scheduling", href: "/admin/scheduling", Icon: CalendarDays },
  { label: "Live Control", href: "/admin/live", Icon: Radio },
  { label: "National Teams", href: "/admin/national-teams", Icon: Flag },
  { label: "Development", href: "/admin/development", Icon: Sprout },
  { label: "Reports", href: "/admin/reports", Icon: BarChart3 },
  { label: "News & Blog", href: "/admin/news", Icon: Newspaper },
  { label: "Gallery", href: "/admin/gallery", Icon: Images },
] as const;

const governanceItems = [
  { label: "My Profile", href: "/admin/profile", Icon: UserRound },
  { label: "Media Management", href: "/admin/media", Icon: Images },
  { label: "Enquiries & Forms", href: "/admin/enquiries", Icon: ClipboardList },
  { label: "Security", href: "/admin/security", Icon: ShieldCheck },
] as const;

function isRouteActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, closeMenu]);

  async function signOut() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    closeMenu();
    router.replace("/sign-in");
    router.refresh();
  }

  function renderNavigation(
    entries: ReadonlyArray<{
      label: string;
      href: string;
      Icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
    }>,
  ) {
    return entries.map(({ label, href, Icon }) => {
      const active = isRouteActive(pathname, href);

      return (
        <Link
          key={href}
          href={href}
          className={`admin-nav-link${active ? " active" : ""}`}
          onClick={closeMenu}
          aria-current={active ? "page" : undefined}
        >
          <Icon size={18} aria-hidden />
          <span>{label}</span>
        </Link>
      );
    });
  }

  return (
    <div className="admin-layout">
      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close administration menu"
          onClick={closeMenu}
        />
      )}

      <aside
        id="sslta-admin-sidebar"
        className={`admin-sidebar${mobileOpen ? " show" : ""}`}
        aria-label="Administration navigation"
        aria-hidden={!mobileOpen && typeof window !== "undefined" && window.innerWidth <= 900}
      >
        <div className="admin-brand">
          <Image
            src="/images/sslta-logo.jpg"
            alt="SSLTA"
            width={48}
            height={48}
            priority
          />
          <div>
            <b>SSLTA</b>
            <small>Federation Management</small>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="admin-sidebar-scroll">
          <div className="admin-label">OPERATIONS</div>
          <nav className="admin-nav">{renderNavigation(operationItems)}</nav>

          <div className="admin-label admin-label-spaced">GOVERNANCE</div>
          <nav className="admin-nav">{renderNavigation(governanceItems)}</nav>
        </div>

        <div className="admin-side-bottom">
          <Link href="/" className="admin-nav-link" onClick={closeMenu}>
            <LogOut size={18} aria-hidden />
            <span>View Public Website</span>
          </Link>
          <button className="admin-signout" type="button" onClick={signOut}>
            <LogOut size={18} aria-hidden />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-mobilebar">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="sslta-admin-sidebar"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="admin-mobilebar-title">
            <b>SSLTA</b>
            <span>Federation Management</span>
          </div>
          <Image
            src="/images/sslta-logo.jpg"
            alt=""
            width={36}
            height={36}
            aria-hidden
          />
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}