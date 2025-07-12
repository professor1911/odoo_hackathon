

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, SwapRequest } from "@/lib/types";
import { ArrowRight, Check, X, Loader2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
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
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // This will only run on the client, after initial hydration
    if (request.createdAt) {
      // Assuming createdAt is a Firestore timestamp, convert to Date
      const date = typeof request.createdAt === 'string' 
        ? new Date(request.createdAt)
        // @ts-ignore
        : request.createdAt?.toDate?.();

      if (date) {
        setFormattedDate(formatDistanceToNow(date, { addSuffix: true }));
      }
    }
  }, [request.createdAt]);
  
  const handleRequestUpdate = async (newStatus: 'accepted' | 'rejected') => {
    setActionLoading(true);
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
        setActionLoading(false);
    }
  };

  const otherUserName = type === 'incoming' ? request.fromUserName : request.toUserName;
  const otherUserAvatar = type === 'incoming' ? request.fromUserAvatar : request.toUserAvatar;
  const initials = getInitials(otherUserName || '');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={otherUserAvatar} alt={otherUserName} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base font-headline">
                    {type === 'incoming' ? `${otherUserName} sent you a request` : `You sent a request to ${otherUserName}`}
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
        {request.message && (
          <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-background">"{request.message}"</p>
        )}
      </CardContent>
      {type === 'incoming' && request.status === 'pending' && (
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleRequestUpdate('rejected')} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleRequestUpdate('accepted')} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Accept
            </Button>
        </CardFooter>
      )}
       {request.status === 'accepted' && (
        <CardFooter className="flex justify-end gap-2">
            <Link href={`/session/${request.id}`} passHref>
                <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Go to Session
                </Button>
            </Link>
        </CardFooter>
      )}
      {request.status === 'completed' && (
        <CardFooter className="flex justify-end gap-2">
            <Link href={`/session/${request.id}`} passHref>
                <Button variant="outline">
                    View Session Details
                </Button>
            </Link>
        </CardFooter>
      )}
    </Card>
  )
}
