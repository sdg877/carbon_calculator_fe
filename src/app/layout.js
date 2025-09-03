import { DM_Sans } from 'next/font/google'
import Navbar from '../components/Navbar'; // 👈 Import the Navbar component

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Carbon Calculator',
  description: '...',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <header>
          <Navbar /> 
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}