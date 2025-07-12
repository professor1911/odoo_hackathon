
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NOTIFICATION_SESSION_KEY = 'swapRequestNotificationShown';

export function NewRequestNotifier() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [notificationShown, setNotificationShown] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    // Check session storage on mount
    const hasBeenShown = sessionStorage.getItem(NOTIFICATION_SESSION_KEY);
    setNotificationShown(!!hasBeenShown);
  }, []);

  useEffect(() => {
    if (loading || !user || notificationShown) {
      return;
    }

    const checkPendingRequests = async () => {
      try {
        const q = query(
          collection(db, 'swapRequests'),
          where('toUserId', '==', user.uid),
          where('status', '==', 'pending'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const firstRequest = querySnapshot.docs[0].data();
          
          toast({
            title: 'You have a new swap request!',
            description: `${firstRequest.fromUserName} wants to swap skills with you.`,
            action: (
              <Link href="/requests">
                <Button>View Request</Button>
              </Link>
            ),
            duration: 10000, // Show for 10 seconds
          });

          // Mark as shown for this session
          sessionStorage.setItem(NOTIFICATION_SESSION_KEY, 'true');
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error checking for new swap requests:', error);
      }
    };

    checkPendingRequests();

  }, [user, loading, toast, notificationShown]);

  return null; // This component does not render anything itself
}
