import { config } from 'dotenv';
config();

import '@/ai/flows/extract-skills-from-resume.ts';
import '@/ai/flows/extract-info-from-resume.ts';
import '@/ai/flows/calculate-project-fit-score.ts';
import '@/ai/flows/extract-project-info-from-brd.ts';
import '@/ai/flows/assess-leave-request.ts';
