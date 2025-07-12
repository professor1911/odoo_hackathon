"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RequestSwapDialogProps {
  targetUser: User;
}

export function RequestSwapDialog({ targetUser }: RequestSwapDialogProps) {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skillOffered, setSkillOffered] = useState<string>("");
  const [skillWanted, setSkillWanted] = useState<string>("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authUser) {
      const userDocRef = doc(db, "users", authUser.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as User);
        }
      });
    }
  }, [authUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !currentUser) {
      toast({ variant: "destructive", title: "You must be logged in to send a request." });
      return;
    }
    if (!skillOffered || !skillWanted) {
        toast({ variant: "destructive", title: "Please select both skills for the swap." });
        return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "swapRequests"), {
        fromUserId: authUser.uid,
        toUserId: targetUser.id,
        skillOffered,
        skillWanted,
        message,
        status: "pending",
        createdAt: serverTimestamp(),
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatarUrl,
        toUserName: targetUser.name,
        toUserAvatar: targetUser.avatarUrl,
      });

      toast({
        title: "Request Sent!",
        description: `Your swap request has been sent to ${targetUser.name}.`,
      });
      setIsOpen(false);
      // Reset form
      setSkillOffered("");
      setSkillWanted("");
      setMessage("");
    } catch (error) {
      console.error("Error sending swap request:", error);
      toast({
        variant: "destructive",
        title: "Failed to send request",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isMyProfile = authUser?.uid === targetUser.id;

  if (isMyProfile) {
    return null; // Don't show the button on your own profile
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Request Swap</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request a Skill Swap with {targetUser.name}</DialogTitle>
            <DialogDescription>
              Propose a skill exchange. Select a skill you offer and a skill you want to learn from them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-offered" className="text-right">
                You Offer
              </Label>
              <Select onValueChange={setSkillOffered} value={skillOffered}>
                <SelectTrigger id="skill-offered" className="col-span-3">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser?.skillsOffered.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-wanted" className="text-right">
                You Want
              </Label>
               <Select onValueChange={setSkillWanted} value={skillWanted}>
                <SelectTrigger id="skill-wanted" className="col-span-3">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {targetUser.skillsOffered.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
               <Label htmlFor="message" className="text-right pt-2">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
                placeholder={`Hi ${targetUser.name}, I'd love to trade skills...`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
