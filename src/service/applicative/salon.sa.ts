import { ApiError } from "../../data/exception/api.exception"
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler"
import { prisma } from "../../repository"

const getSalonListByUser = async (userId:string)=>{
  try {
    const res = await prisma.salon.findMany({
      where : {
        members : {
          some : {
            userId
          }
        }
      }
    })

    return {
      success:true,
      data : res
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on get user profile')
  }
}

export default {
  getSalonListByUser
}