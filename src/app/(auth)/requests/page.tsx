
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
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const [loadingOutgoing, setLoadingOutgoing] = useState(true);

  useEffect(() => {
    if (authLoading || !authUser) {
      // If auth is loading or there's no user, we're not ready to fetch.
      // We also clear out any existing data.
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setLoadingIncoming(true);
      setLoadingOutgoing(true);
      return;
    }

    const requestsRef = collection(db, "swapRequests");
    const unsubscribers: Unsubscribe[] = [];

    // Listener for incoming requests
    const incomingQuery = query(
      requestsRef,
      where("toUserId", "==", authUser.uid),
      orderBy("createdAt", "desc")
    );
    unsubscribers.push(onSnapshot(incomingQuery, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
      setIncomingRequests(requests);
      setLoadingIncoming(false);
    }, (error) => {
      console.error("Error fetching incoming requests: ", error);
      setLoadingIncoming(false);
    }));

    // Listener for outgoing requests
    const outgoingQuery = query(
      requestsRef,
      where("fromUserId", "==", authUser.uid),
      orderBy("createdAt", "desc")
    );
    unsubscribers.push(onSnapshot(outgoingQuery, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
      setOutgoingRequests(requests);
      setLoadingOutgoing(false);
    }, (error) => {
      console.error("Error fetching outgoing requests: ", error);
      setLoadingOutgoing(false);
    }));
    
    // Cleanup function: This is crucial for preventing memory leaks and Firestore errors.
    // It will be called when the component unmounts or when authUser/authLoading changes.
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [authUser, authLoading]);

  const isLoading = authLoading || loadingIncoming || loadingOutgoing;

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Swap Requests"
        description="Manage your incoming and outgoing skill swap proposals."
      />
      <div className="p-6 flex-1 overflow-auto">
        {isLoading ? (
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
