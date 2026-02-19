import { z } from 'zod';

const addVIDEOSchema = z.object({
  body: z.object({ 
    content: z.string(),
    user: z.string()
  }),
});

export const VIDEOValidation = {
  addVIDEOSchema,
};