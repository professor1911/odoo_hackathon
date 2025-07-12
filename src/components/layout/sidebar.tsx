'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Bell, Wand2, LogOut, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser } from '@/lib/data'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/requests', icon: Bell, label: 'Requests' },
  { href: '/recommendations', icon: Wand2, label: 'For You' },
]

export default function AppSidebar() {
  const pathname = usePathname()

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
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                </div>
            </div>
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Log out">
                  <LogOut className="h-5 w-5" />
              </Button>
            </Link>
         </div>
      </div>
    </aside>
  )
}
