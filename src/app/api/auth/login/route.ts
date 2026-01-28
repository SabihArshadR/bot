import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }
    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { success: false, error: "Users collection not found" },
        { status: 500 }
      );
    }
    const user = await usersCol.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: user,
        userId: user._id,
        isVerified: user.isVerified,

        //   message: user.isVerified
        //     ? "Login successful!"
        //     : "Email not verified. Please verify your email first."
        message: "Login successful!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}
