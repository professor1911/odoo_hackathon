'use server';

/**
 * @fileOverview AI-powered skill swap recommendation flow.
 *
 * - skillSwapRecommendation - A function that provides skill swap recommendations.
 * - SkillSwapRecommendationInput - The input type for the skillSwapRecommendation function.
 * - SkillSwapRecommendationOutput - The return type for the skillSwapRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillSwapRecommendationInputSchema = z.object({
  userSkills: z
    .array(z.string())
    .describe('The skills offered by the user.'),
  userWants: z
    .array(z.string())
    .describe('The skills the user wants to learn.'),
  otherUserProfiles: z.array(z.object({
    userId: z.string(),
    skillsOffered: z.array(z.string()),
    skillsWanted: z.array(z.string()),
  })).describe('Profiles of other users in the skill sharing network'),
  numberOfRecommendations: z.number().default(3).describe('The number of skill swap recommendations to provide.'),
});

export type SkillSwapRecommendationInput = z.infer<typeof SkillSwapRecommendationInputSchema>;

const SkillSwapRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      userId: z.string().describe('The user ID of the recommended skill swap partner.'),
      reason: z.string().describe('The reason for recommending this user as a skill swap partner.'),
    })
  ).describe('A list of skill swap recommendations.')
});

export type SkillSwapRecommendationOutput = z.infer<typeof SkillSwapRecommendationOutputSchema>;

export async function skillSwapRecommendation(input: SkillSwapRecommendationInput): Promise<SkillSwapRecommendationOutput> {
  return skillSwapRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillSwapRecommendationPrompt',
  input: { schema: SkillSwapRecommendationInputSchema },
  output: { schema: SkillSwapRecommendationOutputSchema },
  prompt: `You are an AI assistant designed to recommend skill swaps between users.

Given a user's profile including their skills and what they want to learn, and a list of other user profiles, you will recommend potential skill swap partners.

User Skills: {{userSkills}}
User Wants: {{userWants}}
Other User Profiles: {{otherUserProfiles}}

Consider the following when making recommendations:

*   A good skill swap partner is someone who has skills the user wants to learn and wants to learn skills that the user has.
*   The more skills overlap, the better the recommendation.
*   Only recommend users from the list of other user profiles.

Provide {{numberOfRecommendations}} recommendations.

Output should be in JSON format.
`,
});

const skillSwapRecommendationFlow = ai.defineFlow(
  {
    name: 'skillSwapRecommendationFlow',
    inputSchema: SkillSwapRecommendationInputSchema,
    outputSchema: SkillSwapRecommendationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
