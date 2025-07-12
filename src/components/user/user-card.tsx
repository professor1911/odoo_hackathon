import Link from "next/link";
import { User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { SkillBadge } from "@/components/shared/skill-badge";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
