import * as z from "zod";
import { MessageType } from "@prisma/client";
import { Prettify } from "./helpers";
import { PartialUserSchema } from "./User";



// define the schema for the message folder
export const baseMessageFolderSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  folderId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type MessageFolder = z.infer<typeof baseMessageFolderSchema> & {
  message: PartialMessageSchemaProps;
  folder: FolderProps;
};

export const messageFolderSchema: z.ZodType<MessageFolder> =
  baseMessageFolderSchema.extend({
    message: z.lazy(() => partialMessageSchema),
    folder: z.lazy(() => folderSchema),
  });


export type MessageFolderProps = Prettify<z.infer<typeof messageFolderSchema>>;

// define the schema for user folder
export const baseUserFolderSchema = z.object({
  id: z.string(),
  folderId: z.string(),
  user: z.lazy(() => PartialUserSchema),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type UserFolder = z.infer<typeof baseUserFolderSchema> & {
  folder: FolderProps;
};

export const userFolderSchema: z.ZodType<UserFolder> =
  baseUserFolderSchema.extend({
    folder: z.lazy(() => folderSchema),
  });

export type UserFolderProps = Prettify<z.infer<typeof userFolderSchema>>;


// define the schema for the folders
export const folderSchema = z.object({
  name: z.string(),
  id: z.string(),
  userFolders: z.array(z.lazy(() => userFolderSchema)),
  messageFolders: z.array(z.lazy(() => messageFolderSchema)),
  message_count: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type FolderProps = Prettify<z.infer<typeof folderSchema>>;

// define the schema for the messages
export const messageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  recipient: z.lazy(() => PartialUserSchema),
  recipientId: z.string(),
  sender: z.lazy(() => PartialUserSchema),
  senderId: z.string(),
  subject: z.string(),
  company: z.string(),
  html: z.string(),
  message: z.string(),
  text: z.string(),
  react: z.string(),
  messageType: z.nativeEnum(MessageType),
  createdAt: z.string(),
  updatedAt: z.string(),
  isRead: z.boolean(),
  messageFolders: z.array(z.lazy(() => messageFolderSchema)),
});

export const partialMessageSchema = messageSchema.partial();

export const partialFolderSchema = folderSchema.partial();

export type PartialMessageSchemaProps = Prettify<
  z.infer<typeof partialMessageSchema>
>;

export type PartialFolderProps = Prettify<z.infer<typeof partialFolderSchema>>;