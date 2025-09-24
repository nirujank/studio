
'use server';

import { extractSkillsFromResume } from '@/ai/flows/extract-skills-from-resume';
import { z } from 'zod';

const schema = z.object({
  resume: z.any(),
});

type State = {
  skills?: string[];
  error?: string;
};

export async function extractSkillsAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = schema.safeParse({
      resume: formData.get('resume'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid resume file.' };
    }
    
    const file = formData.get('resume') as File;
    if (!file || file.size === 0) {
      return { error: 'Please upload a resume file.' };
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await extractSkillsFromResume({
      resumeDataUri: dataUri,
    });
    
    if (result.skills && result.skills.length > 0) {
      return { skills: result.skills };
    } else {
      return { error: "Couldn't extract any skills. Try a different file." };
    }
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
