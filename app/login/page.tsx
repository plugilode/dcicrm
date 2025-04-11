"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showRequestAccess, setShowRequestAccess] = useState(false)
  const [requestForm, setRequestForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    organization: "",
    message: ""
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // After successful login, redirect to dashboard
      // The auth cookie will be automatically included in future requests
      router.push("/dashboard")
      router.refresh() // Refresh to update client-side state
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm)
      })

      if (!res.ok) {
        throw new Error("Failed to submit request")
      }

      setShowRequestAccess(false)
      alert("Access request submitted successfully! An admin will review your request.")
    } catch (err) {
      setError("Failed to submit request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-blue-600 rounded-2xl p-8 shadow-2xl border border-blue-700">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/dci-media-logo.png"
              alt="DCI MEDIA AG"
              width={200}
              height={80}
              className="transform hover:scale-105 transition-transform"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              className="bg-white/90 border-blue-300 text-blue-900 placeholder:text-blue-400"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              className="bg-white/90 border-blue-300 text-blue-900 placeholder:text-blue-400"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-white hover:text-blue-100"
              onClick={() => setShowRequestAccess(true)}
            >
              Request Access
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={showRequestAccess} onOpenChange={setShowRequestAccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Access</DialogTitle>
            <DialogDescription>
              Fill out this form to request access to the system. An administrator will review your request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAccessRequest} className="space-y-4">
            <Input
              placeholder="Email"
              value={requestForm.email}
              onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
              required
            />
            <Input
              placeholder="First Name"
              value={requestForm.firstName}
              onChange={(e) => setRequestForm({ ...requestForm, firstName: e.target.value })}
              required
            />
            <Input
              placeholder="Last Name"
              value={requestForm.lastName}
              onChange={(e) => setRequestForm({ ...requestForm, lastName: e.target.value })}
              required
            />
            <Input
              placeholder="Organization"
              value={requestForm.organization}
              onChange={(e) => setRequestForm({ ...requestForm, organization: e.target.value })}
              required
            />
            <textarea
              placeholder="Message (optional)"
              value={requestForm.message}
              onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setShowRequestAccess(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
