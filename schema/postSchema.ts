import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const PostSchema = z.object({
  id:z.string().optional(),
  heading: z.string().min(3, "Heading must be at least 3 characters"),
  coverImage: z.string().url("Must be a valid URL"),
  content: z.string().min(10, "Content must be at least 10 characters"), // HTML content
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  createdAt: z.date().optional(),
  interactions: z.object({
    views: z.number().default(0),
    like: z.number().default(0),
    share: z.number().default(0),
  }).default({ views: 0, like: 0, share: 0 }).optional(),
  status: z.enum(["active", "archived"]).default("active").optional(),
  by: z.string().default("admin").optional(),
});

export type Post = {
  id: string;
  coverImage: string;
  heading: string;
  status: "active" | "archived";
  createdAt: Timestamp;
  content: string;
  interactions: {
    views:number,
    like:number,
    share:number,
  } ,
  tags:string[]

};

export type PostType = z.infer<typeof PostSchema>;
