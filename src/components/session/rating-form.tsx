
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, writeBatch, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SwapRequest } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface RatingFormProps {
  swapRequest: SwapRequest;
  otherUserId: string;
}

export function RatingForm({ swapRequest, otherUserId }: RatingFormProps) {
  const { user: authUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  
  const ratingFieldName = authUser?.uid === swapRequest.fromUserId ? 'fromUserRated' : 'toUserRated';

  useEffect(() => {
    // @ts-ignore
    if (swapRequest && swapRequest[ratingFieldName]) {
        setAlreadyRated(true);
    }
  }, [swapRequest, ratingFieldName]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        toast({ variant: 'destructive', title: 'Please select a rating' });
        return;
    }
    setIsSubmitting(true);

    try {
        const userToRateRef = doc(db, "users", otherUserId);
        const requestRef = doc(db, "swapRequests", swapRequest.id);

        // Use a batch to perform atomic operations
        const batch = writeBatch(db);

        // Get the current user data to calculate new average rating
        const userDoc = await getDoc(userToRateRef);
        if (!userDoc.exists()) throw new Error("User to rate not found.");
        
        const userData = userDoc.data();
        const currentRating = userData.rating || 0;
        const currentReviews = userData.reviews || 0;
        
        const newReviews = currentReviews + 1;
        const newAverageRating = ((currentRating * currentReviews) + rating) / newReviews;

        // Update the user's profile
        batch.update(userToRateRef, {
            rating: newAverageRating,
            reviews: increment(1)
        });

        // Mark that this user has rated in the swap request document
        batch.update(requestRef, { [ratingFieldName]: true });

        await batch.commit();

        toast({ title: "Rating submitted!", description: "Thank you for your feedback." });
        setAlreadyRated(true);

    } catch (error) {
        console.error("Error submitting rating:", error);
        toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your rating." });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (alreadyRated) {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Thank You!</CardTitle>
                <CardDescription>You have already submitted your rating for this swap session.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
        <CardDescription>
          Your feedback helps build a trustworthy community. Please rate your
          swap with {swapRequest.fromUserId === authUser?.uid ? swapRequest.toUserName : swapRequest.fromUserName}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-8 w-8 cursor-pointer transition-colors",
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  )}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your experience? What did you learn?"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
