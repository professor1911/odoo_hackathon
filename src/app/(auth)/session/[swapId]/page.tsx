
"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { doc, onSnapshot, Unsubscribe, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { SwapRequest, User as UserType } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";
import { ChatInterface } from "@/components/session/chat-interface";
import { RatingForm } from "@/components/session/rating-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function SwapSessionPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const params = useParams();
  const swapId = params.swapId as string;

  const [swapRequest, setSwapRequest] = useState<SwapRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!swapId) return;

    const docRef = doc(db, "swapRequests", swapId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSwapRequest({ id: docSnap.id, ...docSnap.data() } as SwapRequest);
      } else {
        setSwapRequest(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching swap request:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [swapId]);

  const handleCompleteSwap = async () => {
    if (!swapRequest) return;
    try {
      const requestDocRef = doc(db, 'swapRequests', swapRequest.id);
      await updateDoc(requestDocRef, { status: 'completed' });
      toast({
          title: "Swap Completed!",
          description: "You can now rate your experience.",
      });
    } catch (error) {
      console.error("Error completing swap:", error);
      toast({
          variant: "destructive",
          title: "Update failed",
          description: "Could not mark the swap as complete. Please try again."
      })
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!swapRequest) {
    notFound();
  }

  // Ensure the logged-in user is part of this swap
  if (authUser?.uid !== swapRequest.fromUserId && authUser?.uid !== swapRequest.toUserId) {
    return (
        <div className="flex flex-col h-full">
            <Header title="Access Denied" />
            <div className="flex-1 flex items-center justify-center p-4 text-center">
                <p>You are not a participant in this swap session.</p>
            </div>
      </div>
    )
  }
  
  const otherUserId = authUser?.uid === swapRequest.fromUserId ? swapRequest.toUserId : swapRequest.fromUserId;
  const otherUserName = authUser?.uid === swapRequest.fromUserId ? swapRequest.toUserName : swapRequest.fromUserName;

  const isCompleted = swapRequest.status === 'completed';

  return (
    <div className="flex flex-col h-full">
      <Header 
        title={`Swap with ${otherUserName}`}
        description={`Trading "${swapRequest.skillOffered}" for "${swapRequest.skillWanted}"`}
      >
        {!isCompleted && (
           <Button onClick={handleCompleteSwap} size="sm">Mark as Complete</Button>
        )}
      </Header>
      <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto flex flex-col">
            {isCompleted ? (
                <RatingForm swapRequest={swapRequest} otherUserId={otherUserId} />
            ) : (
                <ChatInterface swapId={swapId} />
            )}
        </div>
      </div>
    </div>
  );
}
