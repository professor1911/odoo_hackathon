
import Link from "next/link";
import { User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { SkillBadge } from "@/components/shared/skill-badge";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: User;
  layout?: "vertical" | "horizontal";
}

const getInitials = (name: string) => {
  if (!name) return "";
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function UserCard({ user, layout = "vertical" }: UserCardProps) {
  const initials = getInitials(user.name);
  const rating = user.rating || 0;
  const reviews = user.reviews || 0;

  if (layout === "horizontal") {
    return (
       <Card className="transition-shadow hover:shadow-md">
        <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
          <div className="flex items-center gap-4 flex-shrink-0 self-start sm:self-center">
             <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-headline">{user.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{rating.toFixed(1)} ({reviews} reviews)</span>
                </div>
              </div>
               <Link href={`/users/${user.id}`} className="hidden sm:block">
                <Button className="font-semibold" size="sm">
                  View <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
             <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 mt-2 text-sm">
                <span className="font-semibold w-14 text-muted-foreground shrink-0">Offers:</span>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 4).map((skill) => (
                      <SkillBadge key={skill} skill={skill} />
                  ))}
                  {user.skillsOffered.length > 4 && <SkillBadge skill={`+${user.skillsOffered.length - 4}`} />}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 mt-1 text-sm">
                <span className="font-semibold w-14 text-muted-foreground shrink-0">Wants:</span>
                 <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 4).map((skill) => (
                      <SkillBadge key={skill} skill={skill} variant="outline" />
                  ))}
                  {user.skillsWanted.length > 4 && <SkillBadge skill={`+${user.skillsWanted.length - 4}`} variant="outline" />}
                </div>
            </div>
          </div>
          <Link href={`/users/${user.id}`} className="w-full sm:hidden">
            <Button className="w-full font-semibold">
              View Profile <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-headline">{user.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)} ({reviews} reviews)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
        <div>
          <h4 className="text-sm font-semibold mb-2">Offers:</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.slice(0, 3).map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
            {user.skillsOffered.length > 3 && <SkillBadge skill={`+${user.skillsOffered.length - 3}`} />}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Wants:</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.slice(0, 3).map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="outline" />
            ))}
            {user.skillsWanted.length > 3 && <SkillBadge skill={`+${user.skillsWanted.length - 3}`} variant="outline" />}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/users/${user.id}`} className="w-full">
            <Button className="w-full font-semibold">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
