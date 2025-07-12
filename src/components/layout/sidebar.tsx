'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, User, Bell, Wand2, LogOut, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser } from '@/lib/data' // This will be replaced with real user data
import { useAuth } from '@/context/auth-context'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/requests', icon: Bell, label: 'Requests' },
  { href: '/recommendations', icon: Wand2, label: 'For You' },
]

const getInitials = (name: string) => {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  const name = user?.displayName || currentUser.name;
  const email = user?.email || currentUser.email;
  const avatarUrl = user?.photoURL || currentUser.avatarUrl;
  const initials = getInitials(name);

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-headline font-semibold">
          <Handshake className="h-6 w-6 text-primary" />
          <span className="text-lg">Skillshare</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                </div>
            </div>
              <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
              </Button>
         </div>
      </div>
    </aside>
  )
}
