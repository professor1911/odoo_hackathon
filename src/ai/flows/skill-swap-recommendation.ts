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
  userAvailability: z.string().describe("The current user's availability."),
  otherUserProfiles: z.array(z.object({
    userId: z.string(),
    skillsOffered: z.array(z.string()),
    skillsWanted: z.array(z.string()),
    availability: z.string(),
  })).describe('Profiles of other users in the skill sharing network'),
  numberOfRecommendations: z.number().default(5).describe('The number of skill swap recommendations to provide.'),
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
  prompt: `You are an AI assistant designed to recommend skill swaps between users. Your goal is to provide a list of the best possible matches.

Given a user's profile and a list of other potential users, you will recommend potential skill swap partners.

Current User's Profile:
- Skills Offered: {{userSkills}}
- Skills Wanted: {{userWants}}
- Availability: {{userAvailability}}

Other User Profiles available for matching:
{{#each otherUserProfiles}}
- User ID: {{userId}}
  - Skills Offered: {{skillsOffered}}
  - Skills Wanted: {{skillsWanted}}
  - Availability: {{availability}}
{{/each}}

Please analyze the profiles and provide exactly {{numberOfRecommendations}} recommendations.

Consider the following criteria for a good recommendation, in order of importance:
1.  **Direct Skill Match:** The best match is a user who offers a skill the current user wants, AND wants a skill the current user offers.
2.  **Availability Overlap:** Strongly prefer users whose availability is compatible with the current user's. For example, if the user is available on 'Weekends', prioritize other users who are also available on 'Weekends'.
3.  **Indirect Match:** If a direct match is not possible, consider users who have a high potential for a good swap.
4.  **Fill the List:** It is crucial to return exactly {{numberOfRecommendations}} recommendations. If you cannot find enough strong matches, provide the next best options and explain in the 'reason' field why they are a weaker but still potentially valuable connection.

For each recommendation, provide the user's ID and a clear, concise reason explaining why they are a good match, mentioning the skill overlap and compatibility.

Output the final recommendations in JSON format.
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
