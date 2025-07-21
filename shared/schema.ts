import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  contactNo: z.string(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Question Schema
export const questionSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
});

export type Question = z.infer<typeof questionSchema>;

// Subject Schema
export const subjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.array(questionSchema),
  duration: z.number(), // in minutes
  totalQuestions: z.number(),
});

export type Subject = z.infer<typeof subjectSchema>;

// User Score Schema
export const userScoreSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  contactNo: z.string(),
  scores: z.object({
    webDevelopment: z.number().nullable(),
    ai: z.number().nullable(),
    dataScience: z.number().nullable(),
  }),
  lastUpdated: z.date(),
});

export type UserScore = z.infer<typeof userScoreSchema>;

// Exam Attempt Schema
export const examAttemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subjectId: z.string(),
  subjectName: z.string(),
  answers: z.array(z.number()),
  score: z.number(),
  percentage: z.number(),
  timeTaken: z.number(), // in seconds
  completedAt: z.date(),
});

export type ExamAttempt = z.infer<typeof examAttemptSchema>;
