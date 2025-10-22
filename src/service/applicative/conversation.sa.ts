import { ConversationDTO, ConversationType } from "../../data/dto/conversation.dto"
import { MessageDTO, MessageType, SenderType } from "../../data/dto/message.dto"
import { NotificationType } from "../../data/dto/notification.dto"
import { ApiError } from "../../data/exception/api.exception"
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler"
import { prisma } from "../../repository"
import n8n from "../technique/n8n.ts"
import sseSa from "./sse.sa"

/**
 * get all conversations by user
 * @param userId 
 * @returns 
 */
const getAllConversationByUser = async (id : string | undefined, page: number, limit: number) => {
  
  if (!id) throw new ApiError(500,"user id missing");
  const skip = (page - 1) * limit;
  try {
    const [conversations, total] = await prisma.$transaction([
      prisma.conversation.findMany({
        where: { 
          OR : [
            {ownerId : id},
            { members: { some: { userId: id } } },
          ]
        },
        include: {
          owner : {
            select : {
              firstName : true,
              lastName : true
            }
          },
          members : {
            include : {
              user : true
            }
          }
        },
        orderBy: { updatedAt: "desc" }, // ou createdAt
        skip,
        take: limit,
      }),
      prisma.conversation.count({ where: {OR : [
        {ownerId : id},
        { members: { some: { userId: id } } },
      ]}}),
    ]);
    
    return {
      success: true,
      conversations : JSON.parse(JSON.stringify(conversations)),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      }
    }
    
  } catch (error) {
      const newError = PrismaExceptionHandler.handle(error)
      throw new ApiError(500,newError.message,'error on get all conversation')
  }
}

const createConversation = async (ownerId : string, payload:ConversationDTO)=>{
  
  try {
    const res = await prisma.conversation.create({
      data : {
        type : payload.type,
        members : {
          create : payload.members.map(m=>{
            return {
              userId : m.userId,
              role : m.role
            }
          })
        },
        ownerId : ownerId,
        title : payload.title,
        read : true,
      }
    })

    sseSa.sendEventToUser({title:"Nouvelle conversation",userId:payload.userId,read:false,type:NotificationType.NEW_CONVERSATION,data:res,message:"vous avez une nouvelle conversation"})

    return {
      success : true,
      data : res
    }
    
  } catch (error) {
    console.error(error);
    
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'error on create conversation')
  }
}

const createMessage = async (payload: MessageDTO) => {
  try {
    // 1. Sauvegarde du message utilisateur (toujours)
    const userMessage = await prisma.message.create({
      data: {
        content: payload.content,
        conversationId: payload.conversation.id,
        sender: payload.sender,
        userId: payload.user.id,
        type: payload.type,
      },
    });

    // 2. Si c’est un message à l’IA
    if (payload.conversation.type === ConversationType.AI_CHAT) {
      // Appel à n8n
      const aiResponseContent = await n8n.sendRequest(payload.content, payload.user.id!);

      // 3. Sauvegarde de la réponse de l’IA
      const aiMessage = await prisma.message.create({
        data: {
          content: aiResponseContent,
          conversationId: payload.conversation.id,
          sender: SenderType.AI,
          userId: payload.user.id,
          type: MessageType.TEXT, // ou le type adapté
        },
      });

      // 4. Notification à l’utilisateur (propriétaire de la conversation)
      sseSa.sendEventToUser({
        title: "Nouveau message",
        userId: payload.conversation.ownerId,
        read: false,
        type: NotificationType.NEW_MESSAGE,
        data: aiMessage,
        message: "L’IA a répondu à votre message",
      });

      return {
        success: true,
        data: { userMessage, aiMessage },
      };
    }

    // 5. Si c’est un message humain → notifie les autres membres
    const otherMembers = payload.conversation.members.filter(
      (m) => m.userId !== payload.user.id
    );

    otherMembers.forEach((m) => {
      sseSa.sendEventToUser({
        title: "Nouveau message",
        userId: m.userId,
        read: false,
        type: NotificationType.NEW_MESSAGE,
        data: userMessage,
        message: "Vous avez un nouveau message",
      });
    });

    return {
      success: true,
      data: userMessage,
    };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "Erreur lors de la création du message");
  }
};

const getAllMessagesByConversation = async (conversationId:string | undefined, page: number, limit: number)=>{
  
  if (!conversationId) throw new ApiError(500,"conversation's id missing");
  try {
    const skip = (page - 1) * limit;
    const [messages, total] = await prisma.$transaction([
      prisma.message.findMany({
        where: { 
          conversationId
        },
        include: {
          user : true
        },
        orderBy: { createdAt: "desc" }, 
        skip,
        take: limit,
      }),
      prisma.message.count({
        where:{
          conversationId
        }
      }),
    ]);

    return {
      success: true,
      messages : JSON.parse(JSON.stringify(messages)),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      }
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'error on get all message by conversation')
  }
}

export default {
  getAllConversationByUser,
  createConversation,
  createMessage,
  getAllMessagesByConversation,
}