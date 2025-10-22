import { NotificationType } from "../../data/dto/notification.dto";
import { PostDTO, ReactionDTO } from "../../data/dto/post.dto";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";
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
  console.log({page,limit});
  
  if (!salonId) throw new ApiError(500,"salon id missing");
  const skip = (page - 1) * limit;
  try {
    const [posts,total] = await prisma.$transaction([
      prisma.post.findMany({
        where:{
          salonId
        },
        include : {
          reactions : true,
          author : true,
          comments : true,
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
        commentId : payload.comment.id ?? '',
        userId,
        postId : payload.post.id ?? '',
      }
    })

    return {
      success : true,
      data : res
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on create reaction')
  }
}

export default {
  createPost,
  getPostSalon,
  createReaction
}