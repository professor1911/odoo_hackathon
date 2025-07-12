import { Header } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { swapRequests, users, currentUser } from "@/lib/data";
import { SwapRequest } from "@/lib/types";
import { ArrowRight, Check, X } from "lucide-react";
import { RequestCard } from "@/components/requests/request-card";

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
