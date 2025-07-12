import { RegisterForm } from "@/components/auth/register-form";
import { Handshake } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary flex items-center justify-center rounded-full bg-primary/10">
                <Handshake className="h-8 w-8" />
            </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground font-headline">
            Create an Account
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Join the Skillshare community today!
          </p>
        </div>
        <RegisterForm />
         <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            Login here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
