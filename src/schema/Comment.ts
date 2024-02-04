import * as z from "zod";
import { Prettify } from "./helpers";


export const commentSchema = z.object({
    id: z.string({ required_error: 'ID is required' }),
    feedContentId: z.string({ required_error: 'Feed content id required' }),
    localFeedContentId: z.string({ required_error: 'Local feed content id required' }).nullable(),
    message: z.string({ required_error: 'Message content is required' }),
    createdAt: z.string(),
    updatedAt: z.string(),
    authorId: z.string({ required_error: 'Author id is required' }),
    parentId: z.string({ required_error: 'Parent id is required' }).nullable(),
});

export const partialCommentSchema = commentSchema.partial();

export type CommentSchemaProps = Prettify<z.infer<typeof commentSchema>>;

export type PartialCommentSchemaProps = Prettify<z.infer<typeof partialCommentSchema>>;

