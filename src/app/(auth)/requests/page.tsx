
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
      setLoading(true);
      return;
    }

    if (!authUser) {
      setLoading(false);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      return;
    }

    // This effect handles setting up the Firestore listeners.
    // It will only run when authUser.uid is available and will clean up on unmount.
    let unsubscribeIncoming: Unsubscribe | undefined;
    let unsubscribeOutgoing: Unsubscribe | undefined;

    try {
      setLoading(true);
      
      // Listener for incoming requests
      const incomingQuery = query(
        collection(db, "swapRequests"),
        where("toUserId", "==", authUser.uid),
        orderBy("createdAt", "desc")
      );
      unsubscribeIncoming = onSnapshot(incomingQuery, (querySnapshot) => {
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
        setIncomingRequests(requests);
        setLoading(false); // Set loading to false once data is received
      }, (error) => {
        console.error("Error fetching incoming requests: ", error);
        setLoading(false);
      });

      // Listener for outgoing requests
      const outgoingQuery = query(
        collection(db, "swapRequests"),
        where("fromUserId", "==", authUser.uid),
        orderBy("createdAt", "desc")
      );
      unsubscribeOutgoing = onSnapshot(outgoingQuery, (querySnapshot) => {
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
        setOutgoingRequests(requests);
        // Do not set loading to false here again, to avoid flickering
      }, (error) => {
        console.error("Error fetching outgoing requests: ", error);
        setLoading(false);
      });
    } catch (error) {
        console.error("Failed to set up listeners:", error);
        setLoading(false);
    }
    
    // Cleanup function to unsubscribe from listeners when the component unmounts
    // or when the authUser changes.
    return () => {
      if (unsubscribeIncoming) {
        unsubscribeIncoming();
      }
      if (unsubscribeOutgoing) {
        unsubscribeOutgoing();
      }
    };
  }, [authUser, authLoading]);

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Swap Requests"
        description="Manage your incoming and outgoing skill swap proposals."
      />
      <div className="p-6 flex-1 overflow-auto">
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="incoming">Incoming ({incomingRequests.length})</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing ({outgoingRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="incoming">
            <div className="space-y-4 max-w-3xl mx-auto pt-4">
              {loading ? (
                 <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : incomingRequests.length > 0 ? (
                incomingRequests.map(req => <RequestCard key={req.id} request={req} type="incoming" />)
              ) : (
                <p className="text-center text-muted-foreground py-10">No incoming requests yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="outgoing">
             <div className="space-y-4 max-w-3xl mx-auto pt-4">
                {loading && incomingRequests.length === 0 ? ( // Only show loader if incoming is also loading
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : outgoingRequests.length > 0 ? (
                    outgoingRequests.map(req => <RequestCard key={req.id} request={req} type="outgoing" />)
                ) : (
                    <p className="text-center text-muted-foreground py-10">You haven't sent any requests.</p>
                )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
