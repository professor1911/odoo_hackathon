export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  rating: number;
  reviews: number;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  createdAt: string; // Should be ISO string or Timestamp
  // Cache user details to reduce lookups
  fromUserName?: string;
  fromUserAvatar?: string;
  toUserName?: string;
  toUserAvatar?: string;
}
