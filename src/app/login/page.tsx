
import { LoginForm } from "@/components/auth/login-form";
import { Handshake } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary flex items-center justify-center rounded-full bg-primary/10">
                <Handshake className="h-8 w-8" />
            </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground font-headline">
            Welcome Back!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Log in to continue your skill-swapping journey.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Register here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
