import { LoginForm } from "@/components/auth/login-form";
import { Handshake } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary flex items-center justify-center rounded-full bg-primary/10">
                <Handshake className="h-8 w-8" />
            </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground font-headline">
            Welcome to Skillshare
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Connect, learn, and grow by swapping skills with others.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
