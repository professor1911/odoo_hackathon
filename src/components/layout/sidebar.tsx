
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, User, Bell, Wand2, LogOut, Handshake, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/auth-context'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/requests', icon: Bell, label: 'Requests' },
  { href: '/sessions', icon: MessageSquare, label: 'Sessions'},
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

  const name = user?.displayName || 'User';
  const email = user?.email || '';
  const avatarUrl = user?.photoURL || `https://storage.googleapis.com/project-rsc-bucket/vignesh_testing/default_avatar.png`;
  const initials = getInitials(name);

  return (
     <Sidebar collapsible="icon" className="group-data-[variant=inset]:border-r-0">
        <SidebarHeader className="border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-headline font-semibold text-lg p-2">
            <Handshake className="h-6 w-6 text-primary" />
            <span className="group-data-[collapsible=icon]:hidden">Skillshare</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        tooltip={{ children: item.label }}
                        className="w-full justify-start"
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
             <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium leading-none truncate">{name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{email}</p>
            </div>
             <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout} className="group-data-[collapsible=icon]:hidden">
                  <LogOut className="h-5 w-5" />
              </Button>
          </div>
        </SidebarFooter>
    </Sidebar>
  )
}
