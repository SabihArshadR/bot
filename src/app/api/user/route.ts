import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { getCollection } from "@/lib/mongodb";

// ==================== GET ====================
export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    // Check if session exists and has required user data
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized - No session" }, { status: 401 });
    }

    const username = (session.user as any)?.username;
    
    if (!username) {
      return NextResponse.json(
        { message: "Unauthorized - No username in session" }, 
        { status: 401 }
      );
    }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { message: "Users collection not found" },
        { status: 500 }
      );
    }

    const user = await usersCol.findOne(
      { username },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==================== POST ====================
export async function POST(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized: No session" }, { status: 401 });
    }
    
    const username = (session.user as any)?.username;
    if (!username) {
      return NextResponse.json({ message: "Unauthorized: Username is required" }, { status: 401 });
    }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { message: "Users collection not found" },
        { status: 500 }
      );
    }

    const body = await req.json();

    if ("password" in body) {
      return NextResponse.json(
        { message: "Password cannot be updated via this route" },
        { status: 400 }
      );
    }

    const updateResult = await usersCol.updateOne(
      { username },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("POST /api/user error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
