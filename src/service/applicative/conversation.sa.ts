import { ConversationDTO } from "../../data/dto/conversation.dto"
import { ApiError } from "../../data/exception/api.exception"
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler"
import { prisma } from "../../repository"

/**
 * get all conversations by user
 * @param userId 
 * @returns 
 */
const getAllConversationByUser = async (id : string | undefined, page: number, limit: number) => {
  if (!id) throw new ApiError(500,"email missing");
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
          messages: {
            include : {
              user : true
            }
          },
          members : true
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
        ownerId : payload.ownerId,
        title : payload.title,
      }
    })

    return {
      success : true,
      data : res
    }
    
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'error on get all conversation')
  }
}

export default {
  getAllConversationByUser,
  createConversation
}