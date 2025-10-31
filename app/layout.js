import "./globals.css";
import { Poppins } from 'next/font/google';
import 'katex/dist/katex.min.css';

const poppins = Poppins({
  subsets: ['latin'],           // include only needed character sets
  weight: ['400', '500', '600', '700'], // weights you plan to use
  variable: '--font-poppins',  // optional: use a CSS variable
  display: 'swap',              // recommended for better performance
});

export const metadata = {
  title: "MathsTutor",
  description: "App made to help you get better at maths",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
