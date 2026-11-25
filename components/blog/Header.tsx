"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Home", "/"],
  ["About SSLTA", "/about"],
  ["Players", "/players"],
  ["Tournaments", "/tournaments"],
  ["Live", "/live"],
  ["Rankings", "/rankings"],
  ["Development", "/development"],
  ["Membership", "/membership"],
  ["News & Blog", "/news"],
  ["Events", "/events"],
  ["History", "/history"],
  ["Media", "/gallery"],
  ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="top-left"><span className="flag">🇸🇸</span><span>South Sudan Lawn Tennis Association</span></div>
          <div className="top-links">
            <Link href="/news">News</Link>
            <Link href="/events">Events Calendar</Link>
            <Link href="/documents">Documents</Link>
            <Link href="/contact">Contact</Link>
            <span>Juba, South Sudan</span>
            <span className="socials" aria-label="Social media">
              <span className="social">f</span><span className="social">X</span><span className="social">▶</span>
            </span>
          </div>
        </div>
      </div>
      <div className="header-main container">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image src="/images/sslta-logo.jpg" alt="SSLTA official logo" width={94} height={94} priority className="logo" />
          <div>
            <div className="brand-title"><span>SOUTH SUDAN</span><span>LAWN TENNIS ASSOCIATION</span></div>
            <div className="brand-mark"><span className="s">S</span><span className="l">L</span><span className="t">T</span><span className="a">A</span></div>
          </div>
        </Link>
        <div className="header-actions">
          <Link className="btn btn-blue header-register" href="/membership">Join / Register</Link>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav className={open ? "nav nav-open" : "nav"} aria-label="Primary navigation">
        <div className="container nav-inner">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
