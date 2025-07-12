"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/lib/types";

import { Header } from "@/components/layout/header";
import { ProfileForm } from "@/components/profile/profile-form";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser) {
        setLoadingProfile(false);
        return;
      }
      
      setLoadingProfile(true);
      try {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as User);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          console.error("No user profile found in Firestore for UID:", authUser.uid);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [authUser, authLoading]);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Manage Your Profile"
        description="Keep your skills and availability up to date."
      />
      <div className="p-6 flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {loadingProfile || authLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userProfile ? (
            <ProfileForm user={userProfile} />
          ) : (
            <p className="text-center text-muted-foreground">
              Could not load your profile. Please try again later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}