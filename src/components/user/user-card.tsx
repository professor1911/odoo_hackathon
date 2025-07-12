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
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function UserCard({ user, layout = "vertical" }: UserCardProps) {
  const initials = getInitials(user.name);

  if (layout === "horizontal") {
    return (
       <Card className="transition-shadow hover:shadow-md">
        <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
          <div className="flex items-center gap-4 flex-shrink-0">
             <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="sm:hidden">
              <CardTitle className="text-lg font-headline">{user.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{user.rating} ({user.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="hidden sm:block">
              <CardTitle className="text-lg font-headline">{user.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{user.rating} ({user.reviews} reviews)</span>
              </div>
            </div>
             <div className="flex flex-wrap gap-1 justify-center sm:justify-start mt-2">
                <span className="text-sm font-semibold mr-1">Offers:</span>
                {user.skillsOffered.slice(0, 4).map((skill) => (
                    <SkillBadge key={skill} skill={skill} />
                ))}
                {user.skillsOffered.length > 4 && <SkillBadge skill={`+${user.skillsOffered.length - 4}`} />}
            </div>
            <div className="flex flex-wrap gap-1 justify-center sm:justify-start mt-1">
                <span className="text-sm font-semibold mr-1">Wants:</span>
                {user.skillsWanted.slice(0, 4).map((skill) => (
                    <SkillBadge key={skill} skill={skill} variant="outline" />
                ))}
                {user.skillsWanted.length > 4 && <SkillBadge skill={`+${user.skillsWanted.length - 4}`} variant="outline" />}
            </div>
          </div>
          <Link href={`/users/${user.id}`} className="w-full sm:w-auto">
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
            <span>{user.rating} ({user.reviews} reviews)</span>
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
