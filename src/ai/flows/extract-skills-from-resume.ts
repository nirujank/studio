'use server';

/**
 * @fileOverview An AI agent that extracts skills from a resume.
 *
 * - extractSkillsFromResume - A function that handles the skill extraction process.
 * - ExtractSkillsFromResumeInput - The input type for the extractSkillsFromResume function.
 * - ExtractSkillsFromResumeOutput - The return type for the extractSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsFromResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractSkillsFromResumeInput = z.infer<typeof ExtractSkillsFromResumeInputSchema>;

const ExtractSkillsFromResumeOutputSchema = z.object({
  skills: z.array(z.string()).describe('The skills extracted from the resume.'),
});
export type ExtractSkillsFromResumeOutput = z.infer<typeof ExtractSkillsFromResumeOutputSchema>;

export async function extractSkillsFromResume(input: ExtractSkillsFromResumeInput): Promise<ExtractSkillsFromResumeOutput> {
  return extractSkillsFromResumeFlow(input);
}

const extractSkillsFromResumePrompt = ai.definePrompt({
  name: 'extractSkillsFromResumePrompt',
  input: {schema: ExtractSkillsFromResumeInputSchema},
  output: {schema: ExtractSkillsFromResumeOutputSchema},
  prompt: `You are a resume parsing expert. You will extract the skills from the resume provided.

  Resume:
  {{ resumeDataUri }}

  Return a list of skills extracted from the resume.
  Skills:`, // Modified to use Handlebars templating.
});

const extractSkillsFromResumeFlow = ai.defineFlow(
  {
    name: 'extractSkillsFromResumeFlow',
    inputSchema: ExtractSkillsFromResumeInputSchema,
    outputSchema: ExtractSkillsFromResumeOutputSchema,
  },
  async input => {
    const {output} = await extractSkillsFromResumePrompt(input);
    return output!;
  }
);
