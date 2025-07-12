
"use client";

import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { UserCard } from "@/components/user/user-card";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { User } from "@/lib/types";

const SKILL_FILTERS = ["React", "Python", "Cooking", "Guitar", "Marketing", "Photography"];

export default function DashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  useEffect(() => {
    async function fetchUsers() {
      if (!authUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("id", "!=", authUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => doc.data() as User);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchUsers();
    }
  }, [authUser, authLoading]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .filter((user) => {
        if (!activeFilter) return true;
        return user.skillsOffered.includes(activeFilter) || user.skillsWanted.includes(activeFilter);
      });
  }, [users, searchQuery, activeFilter]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleFilterClick = (skill: string) => {
    if (activeFilter === skill) {
      setActiveFilter(null); // Deselect if already active
    } else {
      setActiveFilter(skill);
    }
    setCurrentPage(1); // Reset to first page
  };

  const handleUsersPerPageChange = (value: string) => {
    setUsersPerPage(Number(value));
    setCurrentPage(1);
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
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                      <UserCard key={user.id} user={user} layout="horizontal" />
                  ))
              ) : (
                  <p className="text-center text-muted-foreground py-10">No users found.</p>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8 space-x-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="users-per-page" className="text-sm text-muted-foreground whitespace-nowrap">Users per page:</Label>
                <Select
                  value={String(usersPerPage)}
                  onValueChange={handleUsersPerPageChange}
                >
                  <SelectTrigger id="users-per-page" className="w-20">
                    <SelectValue placeholder={usersPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center space-x-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
