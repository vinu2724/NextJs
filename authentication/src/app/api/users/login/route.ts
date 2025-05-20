import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"


export async function POST(request: NextRequest) {

  //conneting the database
  await connect();
try{

  //getting value from payload 
   const reqBody = await request.json();
   const {email,password} = reqBody;
   

   //find user by email and store in user
   const user = await User.findOne({email});

   if(!user){
      return NextResponse.json({error:"user not found"},{status: 400});

   }

   const isMatch= await bcryptjs.compare(password,user.password);

   if(!isMatch){
    return NextResponse.json({error:"invalid password"}, {status: 401});

   }

   //create token data
   const tokenData = {
    id: user._id,
    username: user.username, 
    email: user.email,
  };
  
 
   //create token 
   const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1h"})
   
 
   const response = NextResponse.json({
     message: "login successful",
     success: true
   })
   
   response.cookies.set("Token", token, {
    httpOnly: true,
    path: "/", // 👈 ensures cookie is sent for all routes
    sameSite: "lax", // 👈 default but safe
    secure: process.env.NODE_ENV === "production", // use secure only in prod
  });
  
   return response

   


  
}catch(error:any){
    return NextResponse.json({error:error.message},{status:500})
}
  
}