
import { Button } from "@/components/ui/button";
import { Handshake, BrainCircuit, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Handshake className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              Skillshare
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
             <Button variant="outline" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
              Swap Your Skills, Expand Your World
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with talented individuals, share what you know, and learn something new. Our AI-powered platform makes finding the perfect skill swap easier than ever.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-24 bg-muted/50">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-headline">How It Works</h2>
              <p className="mt-2 text-muted-foreground">
                Start learning in just a few simple steps.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold">Create Your Profile</h3>
                <p className="mt-2 text-muted-foreground">
                  List the skills you can offer and the skills you want to learn.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold">Find a Match</h3>
                <p className="mt-2 text-muted-foreground">
                  Browse profiles or get AI-powered recommendations to find your perfect partner.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold">Connect & Learn</h3>
                <p className="mt-2 text-muted-foreground">
                  Send a request, connect with your partner, and start swapping skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24">
            <div className="container grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold font-headline">Why Choose Skillshare?</h2>
                    <p className="text-muted-foreground">
                        Our platform is designed to provide the best possible experience for collaborative learning and growth.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 mr-4">
                               <BrainCircuit className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">AI-Powered Recommendations</h4>
                                <p className="text-sm text-muted-foreground">Our smart algorithm helps you find the most compatible partners based on your skills and availability.</p>
                            </div>
                        </li>
                         <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-4">
                               <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Vibrant Community</h4>
                                <p className="text-sm text-muted-foreground">Join a growing network of passionate learners and experts from various fields.</p>
                            </div>
                        </li>
                         <li className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                               <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Integrated Chat & Sessions</h4>
                                <p className="text-sm text-muted-foreground">Once you match, easily schedule and conduct your skill swap sessions right on the platform.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                 <div className="flex justify-center">
                    <Image src="https://placehold.co/600x400.png" width={600} height={400} alt="A collage of people sharing skills" className="rounded-lg shadow-xl" data-ai-hint="collaboration learning" />
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary/5">
            <div className="container text-center">
                <h2 className="text-3xl font-bold font-headline">Ready to Start Your Learning Journey?</h2>
                <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                    Join thousands of others who are sharing their passions and learning new skills every day.
                </p>
                <div className="mt-8">
                     <Button size="lg" asChild>
                        <Link href="/register">Sign Up Now</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-6 flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Skillshare. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
