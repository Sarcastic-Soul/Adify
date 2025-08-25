import { Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>

          <p className="text-gray-400 mb-8">
            We've sent you a verification link. Click the link in your email to activate your account.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">Didn't receive the email? Check your spam folder.</p>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800 bg-transparent">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
