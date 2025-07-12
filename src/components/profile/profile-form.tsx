
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, X, Loader2 } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

const availabilityTimeSlots = [
  { id: "mornings", label: "Mornings (9am - 12pm)" },
  { id: "afternoons", label: "Afternoons (12pm - 5pm)" },
  { id: "evenings", label: "Evenings (5pm - 9pm)" },
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
  availabilityDays: z.array(z.date()).optional(),
  availabilityTimes: z.array(z.string()).optional(),
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

  // A simple way to parse the string availability back into dates and times
  // This is a mock implementation. A real app would store this structured data.
  const initialAvailability = {
    days: user.availability.includes("Weekday") ? [new Date()] : [], // Placeholder
    times: availabilityTimeSlots.filter(slot => user.availability.toLowerCase().includes(slot.id.slice(0, -1))).map(s => s.id)
  };

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

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    // Derive a readable string from the structured availability data
    const days = data.availabilityDays && data.availabilityDays.length > 0
      ? `${data.availabilityDays.length} day(s) selected`
      : 'Flexible days';
    const times = data.availabilityTimes && data.availabilityTimes.length > 0
      ? data.availabilityTimes.join(', ')
      : 'any time';
    const derivedAvailability = `${days}; available during ${times}`;
    
    const submissionData = { ...data, availability: derivedAvailability };
    
    // Simulate API call to save data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(submissionData);
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
             <div className="space-y-4">
                <FormLabel>Your Availability</FormLabel>
                <FormDescription>
                    Let others know when you are generally available to connect.
                </FormDescription>
                <FormField
                  control={form.control}
                  name="availabilityDays"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm">Available Days</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value?.length && "text-muted-foreground"
                              )}
                            >
                              {field.value && field.value.length > 0 ? (
                                `${field.value.length} days selected`
                              ) : (
                                <span>Pick dates</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="multiple"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="availabilityTimes"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm">Available Times</FormLabel>
                      <div className="space-y-2">
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
