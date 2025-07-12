import type { User, SwapRequest } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    bio: 'Frontend developer passionate about UI/UX and teaching React.',
    skillsOffered: ['React', 'JavaScript', 'UI/UX Design', 'Tailwind CSS'],
    skillsWanted: ['Python', 'Guitar', 'Public Speaking'],
    availability: 'Weekends, weekday evenings',
    rating: 4.8,
    reviews: 12,
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    bio: 'Professional chef looking to learn coding in my free time.',
    skillsOffered: ['Cooking', 'Baking', 'Meal Prep', 'Italian Cuisine'],
    skillsWanted: ['JavaScript', 'HTML/CSS'],
    availability: 'Mondays, Wednesdays',
    rating: 4.9,
    reviews: 25,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    bio: 'Guitarist and music producer. I can teach you how to play or produce music.',
    skillsOffered: ['Guitar', 'Music Production', 'Ableton Live', 'Songwriting'],
    skillsWanted: ['Photography', 'Graphic Design', 'Marketing'],
    availability: 'Flexible',
    rating: 4.7,
    reviews: 8,
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    bio: 'Data scientist and Python enthusiast. Always eager to learn new things.',
    skillsOffered: ['Python', 'Data Analysis', 'Machine Learning', 'SQL'],
    skillsWanted: ['React', 'Creative Writing', 'Yoga'],
    availability: 'Tuesdays, Thursdays',
    rating: 4.9,
    reviews: 18,
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    bio: 'Marketing guru who can help you grow your brand. Looking to pick up design skills.',
    skillsOffered: ['Marketing', 'SEO', 'Content Strategy', 'Public Speaking'],
    skillsWanted: ['UI/UX Design', 'Figma', 'Graphic Design'],
    availability: 'Weekends',
    rating: 4.6,
    reviews: 31,
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    bio: 'Photographer and visual artist. I can teach you how to take amazing photos.',
    skillsOffered: ['Photography', 'Photo Editing', 'Adobe Lightroom', 'Portraiture'],
    skillsWanted: ['Music Production', 'Web Development'],
    availability: 'Fridays',
    rating: 5.0,
    reviews: 15,
  }
];

// Mock current user - let's assume Alice is logged in.
export const currentUser = users[0];
export const otherUsers = users.slice(1);

export const swapRequests: SwapRequest[] = [
    {
        id: 'req1',
        fromUserId: '2', // Bob
        toUserId: '1', // Alice (current user)
        skillOffered: 'Cooking',
        skillWanted: 'React',
        status: 'pending',
        message: "Hi Alice, I'd love to teach you some advanced cooking techniques in exchange for some React lessons!",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
        id: 'req2',
        fromUserId: '1', // Alice (current user)
        toUserId: '3', // Charlie
        skillOffered: 'UI/UX Design',
        skillWanted: 'Guitar',
        status: 'accepted',
        message: "Hey Charlie, saw you wanted to learn design. Let's trade for some guitar lessons.",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    },
    {
        id: 'req3',
        fromUserId: '5', // Ethan
        toUserId: '1', // Alice (current user)
        skillOffered: 'Marketing',
        skillWanted: 'UI/UX Design',
        status: 'completed',
        message: "Hey, would love to swap my marketing expertise for your design skills.",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
    },
    {
        id: 'req4',
        fromUserId: '1', // Alice (current user)
        toUserId: '4', // Diana
        skillOffered: 'JavaScript',
        skillWanted: 'Python',
        status: 'rejected',
        message: "Hi Diana, let's trade programming languages!",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    }
];
