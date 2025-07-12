
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestCard } from "@/components/requests/request-card";
import { SwapRequest } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, Unsubscribe } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function RequestsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      // Auth state is still being determined, so we wait.
      setLoading(true);
      return;
    }

    if (!authUser) {
      // If there's no user, clear data and stop loading.
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setLoading(false);
      return;
    }

    // At this point, we have an authenticated user.
    // Set up the real-time listeners.
    setLoading(true);

    const requestsRef = collection(db, "swapRequests");

    // Listener for incoming requests
    const incomingQuery = query(
      requestsRef,
      where("toUserId", "==", authUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeIncoming = onSnapshot(incomingQuery, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
      setIncomingRequests(requests);
      setLoading(false); // Stop loading after the first data comes in.
    }, (error) => {
      console.error("Error fetching incoming requests: ", error);
      setLoading(false);
    });

    // Listener for outgoing requests
    const outgoingQuery = query(
      requestsRef,
      where("fromUserId", "==", authUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeOutgoing = onSnapshot(outgoingQuery, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
      setOutgoingRequests(requests);
      // We don't set loading to false here again to avoid potential race conditions.
      // The first listener to return data will handle it.
    }, (error) => {
      console.error("Error fetching outgoing requests: ", error);
      setLoading(false);
    });

    // This is the cleanup function.
    // It runs when the component unmounts or when authUser changes.
    // This is crucial to prevent memory leaks and Firestore errors.
    return () => {
      unsubscribeIncoming();
      unsubscribeOutgoing();
    };
  }, [authUser, authLoading]); // Rerun this effect if the user or auth loading state changes.

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Swap Requests"
        description="Manage your incoming and outgoing skill swap proposals."
      />
      <div className="p-6 flex-1 overflow-auto">
        {loading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="incoming">Incoming ({incomingRequests.length})</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing ({outgoingRequests.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="incoming">
              <div className="space-y-4 max-w-3xl mx-auto pt-4">
                {incomingRequests.length > 0 ? (
                  incomingRequests.map(req => <RequestCard key={req.id} request={req} type="incoming" />)
                ) : (
                  <p className="text-center text-muted-foreground py-10">No incoming requests yet.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="outgoing">
              <div className="space-y-4 max-w-3xl mx-auto pt-4">
                  {outgoingRequests.length > 0 ? (
                      outgoingRequests.map(req => <RequestCard key={req.id} request={req} type="outgoing" />)
                  ) : (
                      <p className="text-center text-muted-foreground py-10">You haven't sent any requests.</p>
                  )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
