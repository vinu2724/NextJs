import mongoose from "mongoose";

 export default async function connect(){
  const uri =process.env.MONGO_URI;
  try{
  
   await mongoose.connect(uri)
   const connection = mongoose.connection;
   

   connection.on("connected",()=>{
    console.log("MongoDB Connected Successfully")
   })


  }catch(error){

    console.log("something goes wrong")
    console.log(error)
  }
 }