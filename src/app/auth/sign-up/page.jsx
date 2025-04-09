"use client";
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [userType, setUserType] = useState("client")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Here you would implement your registration logic
    // For example, calling an API route to register the user

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to onboarding based on user type
      if (userType === "admin") {
        router.push("/admin/onboarding")
      } else {
        router.push("/client/onboarding")
      }
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <Leaf className="h-6 w-6 text-green-600" />
        <span className="font-bold">NutriExpert</span>
      </Link>
      <div
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Sign up for {userType === "admin" ? "a nutritionist" : "a client"} account
          </p>
        </div>
        <Tabs defaultValue="client" onValueChange={setUserType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="admin">Nutritionist</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Client Account"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="admin">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name-admin">First name</Label>
                  <Input id="first-name-admin" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name-admin">Last name</Label>
                  <Input id="last-name-admin" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-admin">Email</Label>
                <Input id="email-admin" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentials">Credentials</Label>
                <Input id="credentials" placeholder="e.g., RD, LD, MS" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-admin">Password</Label>
                <Input id="password-admin" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password-admin">Confirm Password</Label>
                <Input id="confirm-password-admin" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms-admin" required />
                <Label htmlFor="terms-admin" className="text-sm">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Nutritionist Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-green-600 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
