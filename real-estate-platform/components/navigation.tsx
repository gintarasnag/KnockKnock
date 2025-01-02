'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Real Estate Platform
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/properties">
              <Button variant="ghost">Properties</Button>
            </Link>
            {pathname === '/login' ? (
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            ) : pathname === '/signup' ? (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}