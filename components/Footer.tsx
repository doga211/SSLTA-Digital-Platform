import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Image src="/images/sslta-logo.jpg" alt="SSLTA" width={76} height={76} className="footer-logo" />
          <h3>South Sudan Lawn Tennis Association</h3>
          <p>National tennis development, competition, membership and administration for South Sudan.</p>
        </div>
        <div>
          <h4>Association</h4>
          <Link href="/about">About SSLTA</Link>
          <Link href="/players">Players</Link>
          <Link href="/rankings">National Rankings</Link>
          <Link href="/development">Development</Link>
        </div>
        <div>
          <h4>Competition</h4>
          <Link href="/tournaments">Tournaments</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/news">Newsroom & Blog</Link>
          <Link href="/history">SSLTA History</Link>
          <Link href="/events">Events Calendar</Link>
          <Link href="/gallery">Media Gallery</Link>
        </div>
        <div>
          <h4>Governance & Contact</h4>
          <p>Juba, South Sudan</p>
          <p>Official SSLTA communications</p>
          <Link href="/contact">Contact the Secretariat</Link>
          <Link href="/admin">Management Portal</Link>
          <p> <Number>+211920200020 </Number> </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} South Sudan Lawn Tennis Association. All rights reserved.</span>
        <span>National federation digital platform</span>
      </div>
    </footer>
  );
}
