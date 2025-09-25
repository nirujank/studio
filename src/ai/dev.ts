import { config } from 'dotenv';
config();

import '@/ai/flows/extract-skills-from-resume.ts';
import '@/ai/flows/extract-info-from-resume.ts';
import '@/ai/flows/calculate-project-fit-score.ts';
