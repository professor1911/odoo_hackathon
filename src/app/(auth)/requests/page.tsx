import { Header } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { swapRequests, users, currentUser } from "@/lib/data";
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

function RequestCard({ request, type }: { request: SwapRequest, type: 'incoming' | 'outgoing' }) {
  const otherUserId = type === 'incoming' ? request.fromUserId : request.toUserId;
  const otherUser = users.find(u => u.id === otherUserId);

  if (!otherUser) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base font-headline">
                    {type === 'incoming' ? `${otherUser.name} sent you a request` : `You sent a request to ${otherUser.name}`}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</p>
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

export default function RequestsPage() {
  const incomingRequests = swapRequests.filter(r => r.toUserId === currentUser.id);
  const outgoingRequests = swapRequests.filter(r => r.fromUserId === currentUser.id);

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
      </div>
    </div>
  );
}
