import {app} from './app'

app.listen(process.env.PORT,async ()=>{
  console.log('server stated at',process.env.PORT);
})