'use server';

/**
 * @fileOverview An AI agent that extracts structured information from a resume.
 *
 * - extractInfoFromResume - A function that handles the information extraction process.
 * - ExtractInfoFromResumeInput - The input type for the extractInfoFromResume function.
 * - ExtractInfoFromResumeOutput - The return type for the extractInfoFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractInfoFromResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractInfoFromResumeInput = z.infer<typeof ExtractInfoFromResumeInputSchema>;

const ExtractInfoFromResumeOutputSchema = z.object({
  personal: z.object({
    name: z.string().describe("The full name of the candidate."),
    email: z.string().describe("The email address of the candidate."),
    phone: z.string().describe("The phone number of the candidate."),
    address: z.string().describe("The full address of the candidate."),
  }).describe("Personal information of the candidate."),
  skills: z.array(z.string()).describe('A list of professional skills extracted from the resume.'),
  education: z.array(z.object({
      degree: z.string().describe("The degree obtained."),
      university: z.string().describe("The name of the university or institution."),
      year: z.number().optional().describe("The year of graduation."),
  })).describe("The candidate's educational background."),
  experience: z.array(z.object({
    position: z.string().describe("The job title or position held."),
    company: z.string().describe("The name of the company."),
    startDate: z.string().optional().describe("The start date of the employment (YYYY-MM-DD)."),
    endDate: z.string().optional().describe("The end date of the employment (YYYY-MM-DD), or null if current."),
    summary: z.string().optional().describe("A brief summary of responsibilities and achievements.")
  })).describe("The candidate's work experience.")
});
export type ExtractInfoFromResumeOutput = z.infer<typeof ExtractInfoFromResumeOutputSchema>;

export async function extractInfoFromResume(input: ExtractInfoFromResumeInput): Promise<ExtractInfoFromResumeOutput> {
  return extractInfoFromResumeFlow(input);
}

const extractInfoFromResumePrompt = ai.definePrompt({
  name: 'extractInfoFromResumePrompt',
  input: {schema: ExtractInfoFromResumeInputSchema},
  output: {schema: ExtractInfoFromResumeOutputSchema},
  prompt: `You are an expert resume parsing AI. Your task is to extract structured information from the provided resume.
  Carefully analyze the content and populate all the fields in the output schema.

  Resume:
  {{media url=resumeDataUri}}
  
  Extract the information and provide it in the requested JSON format.
  `, 
});

const extractInfoFromResumeFlow = ai.defineFlow(
  {
    name: 'extractInfoFromResumeFlow',
    inputSchema: ExtractInfoFromResumeInputSchema,
    outputSchema: ExtractInfoFromResumeOutputSchema,
  },
  async input => {
    const {output} = await extractInfoFromResumePrompt(input);
    return output!;
  }
);
