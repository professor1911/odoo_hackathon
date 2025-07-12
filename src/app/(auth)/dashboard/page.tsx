"use client";

import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { UserCard } from "@/components/user/user-card";
import { otherUsers } from "@/lib/data";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

const USERS_PER_PAGE = 8;
const SKILL_FILTERS = ["React", "Python", "Cooking", "Guitar", "Marketing", "Photography"];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return otherUsers
      .filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .filter((user) => {
        if (!activeFilter) return true;
        return user.skillsOffered.includes(activeFilter) || user.skillsWanted.includes(activeFilter);
      });
  }, [searchQuery, activeFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleFilterClick = (skill: string) => {
    if (activeFilter === skill) {
      setActiveFilter(null); // Deselect if already active
    } else {
      setActiveFilter(skill);
    }
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Discover Skills" 
        description="Find talented people to learn from and share with." 
      />
      <div className="p-6 flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name or skill..." 
                className="pl-10 w-full" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium self-center">Popular filters:</span>
              {SKILL_FILTERS.map(skill => (
                <Button 
                  key={skill}
                  variant={activeFilter === skill ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterClick(skill)}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                    <UserCard key={user.id} user={user} layout="horizontal" />
                ))
            ) : (
                <p className="text-center text-muted-foreground py-10">No users found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
