
"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { Message } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

export function ChatInterface({ swapId }: { swapId: string }) {
  const { user: authUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesCollectionRef = collection(db, "swapRequests", swapId, "messages");
    const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [swapId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authUser) return;

    const messagesCollectionRef = collection(db, "swapRequests", swapId, "messages");
    
    await addDoc(messagesCollectionRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      userId: authUser.uid,
      userName: authUser.displayName,
      userAvatar: authUser.photoURL,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {loading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />}
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
              "flex items-start gap-3", 
              msg.userId === authUser?.uid ? "justify-end" : "justify-start"
            )}>
                {msg.userId !== authUser?.uid && (
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.userAvatar || undefined} />
                        <AvatarFallback>{getInitials(msg.userName || '')}</AvatarFallback>
                    </Avatar>
                )}
                <div className={cn(
                    "p-3 rounded-lg max-w-xs md:max-w-md",
                    msg.userId === authUser?.uid ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn("text-xs mt-1", msg.userId === authUser?.uid ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true }) : 'sending...'}
                    </p>
                </div>
                 {msg.userId === authUser?.uid && (
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.userAvatar || undefined} />
                        <AvatarFallback>{getInitials(msg.userName || '')}</AvatarFallback>
                    </Avatar>
                )}
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send />
        </Button>
      </form>
    </div>
  );
}
