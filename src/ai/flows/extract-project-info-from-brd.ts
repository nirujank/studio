'use server';

/**
 * @fileOverview An AI agent that extracts structured project information from a Business Requirements Document (BRD).
 *
 * - extractProjectInfoFromBrd - A function that handles the information extraction process.
 * - ExtractProjectInfoFromBrdInput - The input type for the function.
 * - ExtractProjectInfoFromBrdOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractProjectInfoFromBrdInputSchema = z.object({
  brdDataUri: z
    .string()
    .describe(
      "A Business Requirements Document (BRD) file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractProjectInfoFromBrdInput = z.infer<typeof ExtractProjectInfoFromBrdInputSchema>;

const ExtractProjectInfoFromBrdOutputSchema = z.object({
    name: z.string().describe("The name of the project."),
    manager: z.string().optional().describe("The name of the project manager."),
    owner: z.string().optional().describe("The name of the project owner or primary stakeholder."),
    techStack: z.object({
        languages: z.array(z.string()).describe("A list of programming languages mentioned."),
        frameworks: z.array(z.string()).describe("A list of frameworks or libraries required."),
        databases: z.array(z.string()).describe("A list of databases mentioned."),
        cloudProvider: z.string().optional().describe("The cloud provider (e.g., Firebase, AWS, Azure) if mentioned."),
        integrations: z.array(z.string()).describe("A list of third-party integrations required."),
        devOps: z.array(z.string()).describe("A list of DevOps tools or CI/CD technologies mentioned."),
    }).describe("The technical stack required for the project."),
    timeline: z.object({
        startDate: z.string().optional().describe("The proposed start date of the project (YYYY-MM-DD)."),
        endDate: z.string().optional().describe("The proposed end date or deadline for the project (YYYY-MM-DD)."),
        estimatedHours: z.number().optional().describe("The estimated effort in person-hours if mentioned."),
    }).describe("Project timeline and estimations."),
    resources: z.array(z.object({
        role: z.string().describe("The role required for the project (e.g., 'Frontend Developer', 'UX Designer')."),
        count: z.number().optional().describe("The number of people required for this role."),
    })).describe("A list of human resources or roles identified as necessary for the project."),
});

export type ExtractProjectInfoFromBrdOutput = z.infer<typeof ExtractProjectInfoFromBrdOutputSchema>;

export async function extractProjectInfoFromBrd(input: ExtractProjectInfoFromBrdInput): Promise<ExtractProjectInfoFromBrdOutput> {
  return extractProjectInfoFromBrdFlow(input);
}

const extractProjectInfoFromBrdPrompt = ai.definePrompt({
  name: 'extractProjectInfoFromBrdPrompt',
  input: {schema: ExtractProjectInfoFromBrdInputSchema},
  output: {schema: ExtractProjectInfoFromBrdOutputSchema},
  prompt: `You are an expert project management assistant. Your task is to extract structured information from the provided Business Requirements Document (BRD).
  Carefully analyze the content and populate all the fields in the output schema.
  
  Infer the technologies, programming languages, frameworks, databases, and tools from the requirements.
  Identify key dates for the project timeline.
  Identify the roles and team composition mentioned in the document.

  BRD Document:
  {{media url=brdDataUri}}
  
  Extract the information and provide it in the requested JSON format.
  `, 
});

const extractProjectInfoFromBrdFlow = ai.defineFlow(
  {
    name: 'extractProjectInfoFromBrdFlow',
    inputSchema: ExtractProjectInfoFromBrdInputSchema,
    outputSchema: ExtractProjectInfoFromBrdOutputSchema,
  },
  async input => {
    const {output} = await extractProjectInfoFromBrdPrompt(input);
    return output!;
  }
);
