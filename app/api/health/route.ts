import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({status:"ok",service:"sslta-professional",timestamp:new Date().toISOString()});}
