
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import {
  skillSwapRecommendation,
  SkillSwapRecommendationOutput,
} from "@/ai/flows/skill-swap-recommendation";
import { users as allMockUsers } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCard } from "../user/user-card";
import { User } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

export function RecommendationClient() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SkillSwapRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      if (!authUser) return;

      // Fetch current user
      const userDocRef = doc(db, "users", authUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setCurrentUser(userDocSnap.data() as User);
      }

      // Fetch other users
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("id", "!=", authUser.uid));
      const querySnapshot = await getDocs(q);
      const others = querySnapshot.docs.map(doc => doc.data() as User);
      setOtherUsers(others);
    }

    fetchUsers();
  }, [authUser]);

  const getRecommendations = async () => {
    if (!currentUser) {
        setError("Could not load your profile. Please try again.");
        return;
    }

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await skillSwapRecommendation({
        userSkills: currentUser.skillsOffered,
        userWants: currentUser.skillsWanted,
        otherUserProfiles: otherUsers.map(u => ({
            userId: u.id,
            skillsOffered: u.skillsOffered,
            skillsWanted: u.skillsWanted,
        })),
        numberOfRecommendations: 3,
      });
      setRecommendations(result);
    } catch (e) {
      console.error(e);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedUser = (userId: string): User | undefined => {
    // We search both other users and all users from mock data just in case
    // some users haven't been created in firestore yet during testing
    return otherUsers.find(u => u.id === userId) || allMockUsers.find(u => u.id === userId);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center gap-2">
            <Wand2 />
            Find Your Perfect Match
          </CardTitle>
          <CardDescription>
            Let our AI analyze your profile and find the best people for you to connect with for a skill swap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={getRecommendations} disabled={loading || !currentUser}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {error && <p className="text-destructive mt-4 text-center">{error}</p>}

      {recommendations && (
        <div className="mt-8">
            <h2 className="text-2xl font-bold font-headline mb-4">Top Recommendations For You</h2>
             {recommendations.recommendations.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">No recommendations found at this time. Try updating your skills!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.recommendations.map(rec => {
                        const user = getRecommendedUser(rec.userId);
                        if (!user) return null;
                        return (
                            <div key={rec.userId}>
                                <UserCard user={user} />
                                <div className="mt-2 p-3 bg-accent/20 rounded-md border border-accent/30 text-sm text-accent-foreground/80">
                                    <span className="font-semibold text-accent-foreground">Reason:</span> {rec.reason}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
