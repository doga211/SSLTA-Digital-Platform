// import type { Metadata } from "next";
// import "./globals.css";
// export const metadata: Metadata = {
//   title: "South Sudan Lawn Tennis Association | SSLTA",
//   description: "Official digital platform of the South Sudan Lawn Tennis Association — players, tournaments, rankings, development, membership and tennis news.",
// };
// export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}





import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "South Sudan Lawn Tennis Association",
  description:
    "Official digital platform of the South Sudan Lawn Tennis Association — players, tournaments, rankings, development, membership and tennis news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en" suppressHydrationWarning>
    //   <body>{children}</body>
    // </html>

<html lang="en" suppressHydrationWarning>
  <body suppressHydrationWarning>
    {children}
  </body>
</html>

  );
}
