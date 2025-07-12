"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
import { X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  availability: z.string().min(5, "Please describe your availability."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    // Simulate API call to save data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
    setIsLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="font-headline">
                  Edit Profile
                </CardTitle>
                <CardDescription>
                  Make changes to your profile here. Click save when you're done.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
             <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Availability</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekday evenings, weekends" {...field} />
                  </FormControl>
                   <FormDescription>
                    Let others know when you are generally available to connect.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
