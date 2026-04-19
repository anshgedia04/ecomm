"use client"
import Link from "next/link"
import { useState } from "react"
import useAuth from "@/hooks/useAuth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { loading, loginWithPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await loginWithPassword(email, password)
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin}>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Logging in..." : "Login"}
              </Button>
              <FieldDescription className="px-6 text-center">
                Create a new Account <Link href="/signup">Signup</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
