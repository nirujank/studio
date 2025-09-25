'use server';

/**
 * @fileOverview A chatbot flow that answers questions about platform data, with role-based access.
 *
 * - runChatbotFlow - The main function that handles chatbot queries.
 * - ChatbotInput - The input type for the chatbotFlow function.
 * - ChatbotOutput - The return type for the chatbotFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { staffData, projectData, tenantData } from '@/lib/data';

const ChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  userId: z.string().describe('The ID of the user asking the question.'),
  userRole: z.enum(['admin', 'staff']).describe('The role of the user.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s answer to the query.'),
  link: z.object({
    text: z.string().describe("The call-to-action text for the link."),
    href: z.string().describe("The URL to redirect to.")
  }).optional().describe("A link to a relevant page if the user's query implies a navigation action.")
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


const chatbotPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {
    schema: z.object({
      query: z.string(),
      userRole: z.string(),
      context: z.string(),
    })
  },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are an expert AI assistant for the Invorg Staff Hub platform. Your role is to answer questions based ONLY on the data provided in the context.

Current User Role: {{userRole}}

Context Data:
{{{context}}}
---

User's Question:
"{{query}}"

Instructions:
1.  Analyze the user's question and the provided context data.
2.  If the user's question implies an action they want to take (e.g., "how do I apply for leave?", "take me to the timesheet", "log my hours"), provide a direct link to the relevant page in the 'link' field.
    - For leave requests, the link text should be "Request Leave" and the href should be "/staff/my-leave".
    - For timesheet entries ('E6'), the link text should be "Log Time" and the href should be "/staff/e6".
3.  If the user is an 'admin', you can use all the provided data to answer the question.
4.  If the user is a 'staff' member, you MUST only answer questions about their OWN data. Do not reveal information about other staff, tenants, or projects they are not a part of. If they ask about something they don't have access to, politely refuse by saying "I'm sorry, I can only provide information about your own data." or something similar.
5.  If the question cannot be answered with the provided context, say "I'm sorry, I don't have enough information to answer that question."
6.  Be concise and helpful in your response.
`,
});


const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { query, userId, userRole } = input;
    
    let contextData: any = {};

    if (userRole === 'admin') {
      contextData = {
        staff: staffData,
        projects: projectData,
        tenants: tenantData,
      };
    } else {
      const currentUser = staffData.find(s => s.id === userId);
      if (currentUser) {
        contextData.currentUser = currentUser;
        contextData.myProjects = projectData.filter(p => 
          p.resources.teamMembers.some(m => m.userId === userId)
        );
      }
    }
    
    const contextString = JSON.stringify(contextData, null, 2);

    const { output } = await chatbotPrompt({
        query,
        userRole,
        context: contextString
    });

    return output!;
  }
);

export async function runChatbotFlow(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}
