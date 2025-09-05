import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.string(),
});

let parsedEnv;
try {
  parsedEnv = envSchema.parse(import.meta.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(" Invalid environment variables:");
  } else {
    console.error(" Unknown error while parsing env:", error);
  }
  throw error;
}

export const runtimeEnv = {
  BACKEND_URL: parsedEnv.VITE_BACKEND_URL,
};
