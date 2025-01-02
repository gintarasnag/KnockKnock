'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session.user?.name}</CardTitle>
          <CardDescription>You are signed in as {session.user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/properties">
            <Button>View Property Listings</Button>
          </Link>
          <form action="/auth/signout" method="POST">
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

