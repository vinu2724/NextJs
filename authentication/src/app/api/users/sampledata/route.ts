import connect from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import sampledata from  '@/models/sampleData'
import { error } from "console";

export async function POST(request:NextRequest){

  connect();


  try{
    const reqBody = await request.json();
    const {username, email}=reqBody;

    const existingUser = await sampledata.findOne({email})
    if(existingUser){
      return NextResponse.json({error: "user already exist"}, {status: 409});


    }

    const data = new sampledata({
      username,
      email
    })

    const sampleUser= await data.save();

    return NextResponse.json({
      message: "used register succefully ",
      success: true, 
      sampledata: {
        username: sampleUser.username,
        email: sampleUser.email
      }
    },{status: 200}
  )


  }catch(error: any){
    return NextResponse.json({error: error.message},{status:500})
  }

}

export async function GET(){
  connect();

  try{
      const  list = await sampledata.find();


     return NextResponse.json({
      list: list
     })
  }catch(error: any){
    return NextResponse.json({
      error: error.message
    },{status: 500})
  }
}