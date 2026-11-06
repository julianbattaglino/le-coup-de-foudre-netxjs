import "./globals.css";

export const metadata = {
  title: "Le Coup de Foudre Paris — Private Journeys",
  description:
    "A Paris-based design and hospitality maison opening the doors to private journeys through French savoir-faire.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* taste-skill-ignore: Montserrat is the navigation face specified by the supplied brand system. */}<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
