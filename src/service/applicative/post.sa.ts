import { PostDTO } from "../../data/dto/post.dto";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";

const createPost = async ({author, content, mediaUrls, salon, type}:PostDTO)=> {
  try {
    const res = await prisma.post.create({
      data : {
        content,
        authorId: author.id!,
        salonId: salon.id!,
        type,
        mediaUrls
      }
    })
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on get user profile')
  }
}

export default {
  createPost
}