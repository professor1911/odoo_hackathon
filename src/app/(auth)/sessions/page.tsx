
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { SwapRequest } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, or, and, Unsubscribe } from "firebase/firestore";
import { Loader2, MessageSquare, CheckCircle } from "lucide-react";
import { RequestCard } from "@/components/requests/request-card";

export default function SessionsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [activeSessions, setActiveSessions] = useState<SwapRequest[]>([]);
  const [completedSessions, setCompletedSessions] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!authUser) {
      setLoading(false);
      setActiveSessions([]);
      setCompletedSessions([]);
      return;
    }

    let unsubscribe: Unsubscribe | undefined;

    try {
      setLoading(true);
      
      const sessionsQuery = query(
        collection(db, "swapRequests"),
        and(
          or(
            where("toUserId", "==", authUser.uid),
            where("fromUserId", "==", authUser.uid)
          ),
          where("status", "in", ["accepted", "completed"])
        ),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(sessionsQuery, (querySnapshot) => {
        const active: SwapRequest[] = [];
        const completed: SwapRequest[] = [];
        querySnapshot.docs.forEach(doc => {
            const request = { id: doc.id, ...doc.data() } as SwapRequest;
            if (request.status === 'accepted') {
                active.push(request);
            } else if (request.status === 'completed') {
                completed.push(request);
            }
        });
        setActiveSessions(active);
        setCompletedSessions(completed);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching sessions:", error);
        setLoading(false);
      });

    } catch (error) {
        console.error("Failed to set up session listener:", error);
        setLoading(false);
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [authUser, authLoading]);

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Your Swap Sessions"
        description="View your ongoing and completed skill swaps."
      />
      <div className="p-6 flex-1 overflow-auto">
        {loading ? (
             <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        ) : (
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><MessageSquare className="text-primary"/>Active Sessions</h2>
                    <div className="space-y-4">
                        {activeSessions.length > 0 ? (
                            activeSessions.map(req => <RequestCard key={req.id} request={req} type={req.fromUserId === authUser?.uid ? 'outgoing' : 'incoming'} />)
                        ) : (
                            <p className="text-center text-muted-foreground py-10">You have no active swap sessions.</p>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" />Completed Sessions</h2>
                     <div className="space-y-4">
                        {completedSessions.length > 0 ? (
                            completedSessions.map(req => <RequestCard key={req.id} request={req} type={req.fromUserId === authUser?.uid ? 'outgoing' : 'incoming'} />)
                        ) : (
                            <p className="text-center text-muted-foreground py-10">You haven't completed any swaps yet.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
