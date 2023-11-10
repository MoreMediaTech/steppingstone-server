import createError from "http-errors";
import dotenv from "dotenv";
import { MessageType, PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { env } from "../../utils/env";
import { PartialMessageSchemaProps } from "../../schema/Messages";

dotenv.config();

type Folder =
  | {
      name: string;
      message_count: number;
    }
  | undefined;

// initalise prisma client
const prisma = new PrismaClient();

// initialise resend
const resend = new Resend(env.RESEND_API_KEY);

/**
 * @description This function is used to send email
 * @param msg
 * @param company
 * @returns  a message to user confirming email has been sent
 */
export const sendMail = async (
  msg: PartialMessageSchemaProps & { name: string },
  messageType: MessageType,
  folderName: string,
  company?: string
) => {
  try {
    // send mail with defined transport object
    await resend.emails.send({
      from: "email@mail.steppingstonesapp.com",
      to: msg.to as string,
      subject: msg.subject as string,
      text: msg.text as string,
      react: msg.react,
      html: msg.html,
    });

    // get sender id
    const senderId = await prisma.user.upsert({
      select: {
        id: true,
      },
      where: {
        email: msg.from as string,
      },
      create: {
        email: msg.from as string,
        name: msg.name ? (msg.name as string) : (msg.from as string),
      },
      update: {},
    });

    // get recipient id
    const recipientId = await prisma.user.upsert({
      select: {
        id: true,
      },
      where: {
        email: msg.to as string,
      },
      create: {
        email: msg.to as string,
        name: msg.to as string,
      },
      update: {},
    });

    // insert message into message table
    const newMessage = await prisma.message.create({
      data: {
        sender: {
          connect: {
            id: senderId?.id as string,
          },
        },
        recipient: {
          connect: {
            id: recipientId.id as string,
          },
        },
        company: company as string,
        subject: msg.subject as string,
        html: msg.html as string,
        messageType: messageType,
        message: msg?.message as string,
      },
    });

    // Get sent folder id
    const sentFolder = await prisma.folder.findUnique({
      where: {
        name: folderName,
      },
      select: {
        id: true,
      },
    });

    // add message to sent folder
    await prisma.messageFolders.create({
      data: {
        message: {
          connect: {
            id: newMessage.id,
          },
        },
        folder: {
          connect: {
            id: sentFolder?.id as string,
          },
        },
      },
    });

    await prisma.$disconnect();
    return {
      message: `Message Sent successfully`,
      success: true,
    };
  } catch (error) {
    return new createError.BadRequest("Unable to send mail");
  }
};

/**
 * @description This function is used to send email
 * @param id
 * @param isRead
 * @param isArchived
 * @returns  a message to user confirming email has been updated
 */
const updateMsgStatusById = async (
  id: string,
  isRead: boolean,
  isArchived: boolean
) => {
  await prisma.message.update({
    where: {
      id,
    },
    data: {
      isRead: isRead,
      isArchived: isArchived,
    },
  });
  return { message: "Message updated successfully", success: true };
};

/**
 * @description This function is used to get all folders with message count
 * @returns  array of folders {name: string, message_count: number}
 */
const getFoldersWithMessagesCount = async () => {
  // get all folders
  const folders = await prisma.folder.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  // get email count for each message folder by message id
  const messageFolders = await prisma.messageFolders.findMany({
    where: {
      folderId: {
        in: folders.map((folder) => folder.id),
      },
    },
    select: {
      messageId: true,
      folderId: true,
    },
  });

  // get an array of the message count as message_count and folder name for each folder
  const result = folders.map((folder) => ({
    name: folder.name,
    message_count: messageFolders.filter(
      (messageFolder) => messageFolder.folderId === folder.id
    ).length,
  }));

  const specialFoldersOrder = ["Inbox", "Flagged", "Sent"];

  // find folder by specialFoldersOrder
  const specialFolders = specialFoldersOrder
    .map((name) => result.find((folder) => folder.name === name))
    .filter(Boolean) as Folder[];

  // find folders not in specialFoldersOrder
  const otherFolders = result.filter(
    (folder) => !specialFoldersOrder.includes(folder.name)
  ) as Folder[];

  return { specialFolders, otherFolders };
};

/**
 * @description This function is used to get all messages for a folder 'Inbox', 'Sent', 'Flagged'
 * @param folderName
 * @returns  array of messages for a folder
 */
const getMessagesForFolder = async (folderName: string) => {
  let result;
  if (folderName === "Sent") {
    result = await prisma.messageFolders.findMany({
      where: {
        folder: {
          name: folderName,
        },
      },
      include: {
        message: {
          include: {
            recipient: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        folder: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        message: {
          createdAt: "desc",
        },
      },
    });
  } else {
    result = await prisma.messageFolders.findMany({
      where: {
        folder: {
          name: folderName,
        },
      },
      include: {
        message: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        folder: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        message: {
          createdAt: "desc",
        },
      },
    });
  }
  return result;
};

const getMessageInFolder = async (folderName: string, messageId: string) => {
  const result = await prisma.messageFolders.findMany({
    where: {
      messageId: messageId,
    },
    include: {
      message: {
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          recipient: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      message: {
        createdAt: "desc",
      },
    },
  });

  return result;
};

/**
 * @description This function is used to get message by id
 * @param id
 * @returns  a message
 */
const getMessageById = async (id: string) => {
  const message = await prisma.message.findUnique({
    where: {
      id,
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      recipient: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
  return message;
};

/**
 * @description This function is used to delete message by id
 * @param id
 * @returns  a message to user confirming email has been deleted
 */
const deleteMessageById = async (folderName: string, id: string) => {
  // get folder id
  const folder = await prisma.folder.findUnique({
    where: {
      name: folderName,
    },
    select: {
      id: true,
    },
  });

  // delete message from folder
  await prisma.messageFolders.delete({
    where: {
      messageId: id,
      folderId: folder?.id as string,
    },
  });

  // delete message
  await prisma.message.delete({
    where: {
      id,
    },
  });
  return { message: "Message deleted successfully", success: true };
};
/**
 * @description This function is used to delete message by id
 * @param id
 * @returns  a message to user confirming email has been deleted
 */
const deleteManyMessages = async (folderName: string, ids: string[]) => {
  // get folder id
  const folder = await prisma.folder.findUnique({
    where: {
      name: folderName,
    },
    select: {
      id: true,
    },
  });

  // delete message from folder
  await prisma.messageFolders.deleteMany({
    where: {
      messageId: {
        in: ids,
      },
      folderId: folder?.id as string,
    },
  });

  await prisma.message.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return { message: "Message deleted successfully", success: true };
};

export const messagesServices = {
  sendMail,
  getFoldersWithMessagesCount,
  getMessagesForFolder,
  getMessageInFolder,
  deleteMessageById,
  getMessageById,
  deleteManyMessages,
  updateMsgStatusById,
};
