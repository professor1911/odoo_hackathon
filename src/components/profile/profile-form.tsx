
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Upload } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { auth, db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

const availabilityTimeSlots = [
  { id: "mornings", label: "Mornings" },
  { id: "afternoons", label: "Afternoons" },
  { id: "evenings", label: "Evenings" },
] as const;

const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
] as const;


const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().max(300, {
    message: "Bio must not be longer than 300 characters.",
  }).min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  skillsOffered: z.array(z.string()).min(1, "Please list at least one skill you can offer."),
  skillsWanted: z.array(z.string()).min(1, "Please list at least one skill you want to learn."),
  availability: z.string().min(1, "Please describe your availability."), // Keeping this for compatibility, will derive it.
  availabilityDays: z.array(z.string()).optional(),
  availabilityTimes: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

const getInitials = (name: string) => {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const SkillInput = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      const newSkill = inputValue.trim();
      if (!value.includes(newSkill)) {
        onChange([...value, newSkill]);
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-sm py-1">
            {skill}
            <button
              type="button"
              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeSkill(skill)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter"
      />
    </div>
  );
};


export function ProfileForm({ user }: ProfileFormProps) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);

  const initials = getInitials(user.name);

  // Parse availability string into form values
  const parseAvailability = (availabilityString: string) => {
    const parts = availabilityString.split(';').map(p => p.trim());
    const daysPart = parts.find(p => p.toLowerCase().includes('on')) || '';
    const timesPart = parts.find(p => p.toLowerCase().includes('during')) || '';

    const selectedDays = daysOfWeek
      .filter(day => daysPart.toLowerCase().includes(day.label.toLowerCase()))
      .map(day => day.id);

    const selectedTimes = availabilityTimeSlots
      .filter(slot => timesPart.toLowerCase().includes(slot.id))
      .map(slot => slot.id);

    return { days: selectedDays, times: selectedTimes };
  }

  const initialAvailability = parseAvailability(user.availability);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
      availabilityDays: initialAvailability.days,
      availabilityTimes: initialAvailability.times,
    },
    mode: "onChange",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };


  async function onSubmit(data: ProfileFormValues) {
    if (!authUser) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    setIsLoading(true);

    try {
      let newAvatarUrl = user.avatarUrl;

      // Upload new avatar if one was selected
      if (avatarFile) {
        const storageRef = ref(storage, `profile-pictures/${authUser.uid}`);
        const snapshot = await uploadBytes(storageRef, avatarFile);
        newAvatarUrl = await getDownloadURL(snapshot.ref);
      }

      // Derive a readable string from the structured availability data
      const selectedDayLabels = (data.availabilityDays || [])
        .map(dayId => daysOfWeek.find(d => d.id === dayId)?.label)
        .filter(Boolean);

      const daysString = selectedDayLabels.length > 0
        ? `Available on ${selectedDayLabels.join(', ')}`
        : 'Flexible days';
      
      const timesString = (data.availabilityTimes || []).length > 0
        ? `during ${(data.availabilityTimes).join(', ')}`
        : 'any time';
        
      const derivedAvailability = `${daysString}; ${timesString}`;
      
      const updatedFirestoreData = {
          name: data.name,
          bio: data.bio,
          skillsOffered: data.skillsOffered,
          skillsWanted: data.skillsWanted,
          availability: derivedAvailability,
          avatarUrl: newAvatarUrl
      };
      
      const updatedAuthData = {
          displayName: data.name,
          photoURL: newAvatarUrl,
      };

      // Perform updates in parallel
      const userDocRef = doc(db, "users", authUser.uid);
      await Promise.all([
          updateDoc(userDocRef, updatedFirestoreData),
          updateProfile(authUser, updatedAuthData)
      ]);


      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      router.refresh();
    } catch(error: any) {
        console.error("Profile update error:", error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
              <CardTitle className="font-headline">
                Edit Profile
              </CardTitle>
              <CardDescription>
                Make changes to your profile here. Click save when you're done.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                    <Input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                    />
                    <label htmlFor="avatar-upload" className="cursor-pointer group">
                        <Avatar className="h-24 w-24 transition-opacity group-hover:opacity-75">
                            <AvatarImage src={avatarPreview || undefined} alt={user.name} />
                            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-8 w-8 text-white" />
                        </div>
                    </label>
                </div>
              <div className="flex-1 space-y-2">
                <FormLabel>Profile Picture</FormLabel>
                <p className="text-sm text-muted-foreground">Click the image to upload a new one. <br className="hidden sm:inline" /> PNG, JPG, GIF up to 5MB.</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can write a brief introduction about yourself.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillsOffered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills You Offer</FormLabel>
                  <FormControl>
                    <SkillInput {...field} />
                  </FormControl>
                   <FormDescription>
                    These are the skills you can teach to others.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="skillsWanted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills You Want to Learn</FormLabel>
                  <FormControl>
                     <SkillInput {...field} />
                  </FormControl>
                   <FormDescription>
                    These are the skills you are interested in learning.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="space-y-4">
                <FormLabel>Your Availability</FormLabel>
                <FormDescription>
                    Let others know when you are generally available to connect.
                </FormDescription>
                
                <FormField
                  control={form.control}
                  name="availabilityDays"
                  render={() => (
                     <FormItem>
                      <FormLabel className="text-sm font-medium">Available Days</FormLabel>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {daysOfWeek.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="availabilityDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="availabilityTimes"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Available Times</FormLabel>
                      <div className="flex flex-col sm:flex-row gap-4">
                      {availabilityTimeSlots.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="availabilityTimes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
