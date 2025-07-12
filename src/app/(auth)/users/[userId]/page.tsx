
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Mail, Calendar, Sparkles, Heart } from "lucide-react";
import { SkillBadge } from "@/components/shared/skill-badge";
import { User } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RequestSwapDialog } from "@/components/requests/request-swap-dialog";

const getInitials = (name: string) => {
  if (!name) return "";
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data() as User);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);


  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-pulse">Loading profile...</div>
        </div>
    );
  }

  if (!user) {
    notFound();
  }

  const initials = getInitials(user.name);

  return (
    <div className="flex flex-col h-full">
      <Header title="User Profile">
        <RequestSwapDialog targetUser={user} />
      </Header>
      <div className="p-6 flex-1 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader className="bg-muted/30">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
                            <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold font-headline">{user.name}</h2>
                            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{user.rating} ({user.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>{user.availability}</span>
                                </div>
                            </div>
                             <p className="mt-4 text-foreground/80">{user.bio}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-headline text-xl font-semibold flex items-center gap-2 text-green-600"><Sparkles className="h-5 w-5" />Skills Offered</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsOffered.map(skill => <SkillBadge key={skill} skill={skill} className="text-base py-1 px-3" />)}
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-headline text-xl font-semibold flex items-center gap-2 text-blue-600"><Heart className="h-5 w-5" />Skills Wanted</h3>
                        <div className="flex flex-wrap gap-2">
                             {user.skillsWanted.map(skill => <SkillBadge key={skill} skill={skill} variant="outline" className="text-base py-1 px-3 border-blue-300" />)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
