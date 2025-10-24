import { NotificationType } from "../../data/dto/notification.dto";
import { CommentDTO, PostDTO, ReactionDTO } from "../../data/dto/post.dto";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";
import { buildTree } from "../../utils/tree.utils";
import sseSa from "./sse.sa";

const createPost = async ({author, content, mediaUrls, salon, type}:Partial<PostDTO>)=> {
  try {
    const res = await prisma.post.create({
      data : {
        content : content??'',
        authorId: author?.id!,
        salonId: salon?.id!,
        type,
        mediaUrls
      },
      include : {
        author:true
      }
    })

    sseSa.broadcastEvent(NotificationType.BROADCAST,{title:`${author?.firstName +' '+author?.lastName}'s post`, post:res, type:NotificationType.NEW_POST},author!)

    return {
      success:true,
      data: res
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on get user profile')
  }
}


const getPostSalon = async (salonId:string, page: number, limit: number)=>{
  
  if (!salonId) throw new ApiError(500,"salon id missing");
  const skip = (page - 1) * limit;
  try {
    const [posts,total] = await prisma.$transaction([
      prisma.post.findMany({
        where:{
          salonId
        },
        include : {
          reactions : {
            include : {
              user : true
            }
          },
          author : true,
          comments : {
            select :{
              id:true
            }
          }
        },
        orderBy: {
          createdAt : "desc"
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: {salonId}}),
    ])

    return {
      success:true,
      data:posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      }
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on get user profile')
  }
}

const createReaction = async (payload:ReactionDTO, userId : string)=> {
  try {
    const res = await prisma.reaction.create({
      data:{
        type : payload.type,
        commentId : payload.comment?.id ?? undefined,
        userId,
        postId : payload.post?.id ?? undefined,
      },
      include : {
        user : true
      }
    })

    return {
      success : true,
      data : res
    }
  } catch (error) {
    console.error(error);
    
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on create reaction')
  }
}

const deleteReaction = async (id:string) =>{
  try {
    const res = await prisma.reaction.delete({
      where : {
        id
      }
    })

    return {
      success : true,
      message : 'reaction deleted with success'
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on delete reaction')
  }
}

const createComment = async (payload:CommentDTO, authorId:string)=>{
  try {
    const res = await prisma.comment.create({
      data : {
        content : payload.content,
        authorId,
        parentId : payload.parent?.id ?? undefined,
        postId : payload.post.id!,
      },
      include : {
        author : true,
        post : true
      }
    })

    return {
      success: true,
      data : res
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on create comment')
  }
}

const getComments = async (postId:string)=>{
  try {
    const res = await prisma.comment.findMany({
      where : {
        postId
      },
      include : {
        post : true,
        author : true
      },
    })

    return {
      success :  true,
      data : buildTree(res),
      total : res.length
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on create comment')
  }
}

export default {
  createPost,
  getPostSalon,
  createReaction,
  deleteReaction,
  createComment,
  getComments
}