import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { UserCard } from "@/components/user/user-card";
import { otherUsers } from "@/lib/data";
import { Search } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Discover Skills" 
        description="Find talented people to learn from and share with." 
      />
      <div className="p-6 flex-1">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by skill (e.g., Python, Guitar, Cooking...)" 
              className="pl-10 w-full max-w-lg" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {otherUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
