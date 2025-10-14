import { ApiError } from "../../data/exception/api.exception";

const sendRequest = async (data:string,userId:string)=>{
  try {
    const res = await fetch(process.env.n8n_URL!, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Config': process.env.n8n_SECRET_KEY,
      },
      body:JSON.stringify({
        data:data,
        userId:userId
      })
    })
    
    if(!res.ok){
      throw new ApiError(res.status,res.statusText,'n8n error')
    }
    const dataRes = await res.json() as {output:string}
    return dataRes.output
  } catch (error) {
    throw new ApiError(500,JSON.stringify(error),'error from n8n')
  }
  
}

export default{
  sendRequest
}