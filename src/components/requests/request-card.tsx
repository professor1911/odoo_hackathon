"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, SwapRequest } from "@/lib/types";
import { ArrowRight, Check, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

function getStatusBadge(status: SwapRequest['status']) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
    case 'accepted':
      return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
    default:
       return <Badge variant="secondary">Unknown</Badge>;
  }
}

const getInitials = (name: string) => {
  if (!name) return "?";
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function RequestCard({ request, type }: { request: SwapRequest, type: 'incoming' | 'outgoing' }) {
  const [formattedDate, setFormattedDate] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This will only run on the client, after initial hydration
    if (request.createdAt) {
      setFormattedDate(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }));
    }
  }, [request.createdAt]);

  useEffect(() => {
    const otherUserId = type === 'incoming' ? request.fromUserId : request.toUserId;
    if (otherUserId) {
        const userDocRef = doc(db, "users", otherUserId);
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
                setOtherUser(docSnap.data() as User);
            }
        });
    }
  }, [request, type]);

  const handleRequestUpdate = async (newStatus: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
        const requestDocRef = doc(db, 'swapRequests', request.id);
        await updateDoc(requestDocRef, { status: newStatus });
        toast({
            title: `Request ${newStatus}`,
            description: `The swap request has been ${newStatus}.`,
        });
    } catch (error) {
        console.error(`Error updating request to ${newStatus}:`, error);
        toast({
            variant: "destructive",
            title: "Update failed",
            description: "Could not update the request status. Please try again."
        })
    } finally {
        setLoading(false);
    }
  };

  if (!otherUser) {
    return (
        <Card className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
        </Card>
    );
  }

  const initials = getInitials(otherUser.name);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base font-headline">
                    {type === 'incoming' ? `${otherUser.name} sent you a request` : `You sent a request to ${otherUser.name}`}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{formattedDate || '...'}</p>
            </div>
            </div>
            {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-around text-center bg-muted/50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">{type === 'incoming' ? 'They Offer' : 'You Offer'}</p>
            <p className="font-semibold">{request.skillOffered}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{type === 'incoming' ? 'They Want' : 'You Want'}</p>
            <p className="font-semibold">{request.skillWanted}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-background">"{request.message}"</p>
      </CardContent>
      {type === 'incoming' && request.status === 'pending' && (
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleRequestUpdate('rejected')} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleRequestUpdate('accepted')} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Accept
            </Button>
        </CardFooter>
      )}
    </Card>
  )
}
