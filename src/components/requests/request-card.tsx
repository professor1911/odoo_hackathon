"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { users } from "@/lib/data";
import { SwapRequest } from "@/lib/types";
import { ArrowRight, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function getStatusBadge(status: SwapRequest['status']) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline">Pending</Badge>;
    case 'accepted':
      return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
  }
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function RequestCard({ request, type }: { request: SwapRequest, type: 'incoming' | 'outgoing' }) {
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    // This will only run on the client, after initial hydration
    setFormattedDate(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }));
  }, [request.createdAt]);

  const otherUserId = type === 'incoming' ? request.fromUserId : request.toUserId;
  const otherUser = users.find(u => u.id === otherUserId);

  if (!otherUser) return null;

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
            <Button variant="outline"><X className="mr-2 h-4 w-4" />Reject</Button>
            <Button className="bg-green-600 hover:bg-green-700"><Check className="mr-2 h-4 w-4" />Accept</Button>
        </CardFooter>
      )}
    </Card>
  )
}
