import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4">
        <LoginForm />
      </main>
    </div>
  )
}
