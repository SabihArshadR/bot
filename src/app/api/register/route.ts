import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

export async function POST(req: Request) {
  try {
    const { username, phone, origin } = await req.json();
    
    if (!username || !phone) {
      return NextResponse.json(
        { success: false, error: "Username and phone are required" },
        { status: 400 }
      );
    }

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Username must be 3-30 characters long and can only contain letters, numbers, and underscores" 
        },
        { status: 400 }
      );
    }

    // if (!PHONE_REGEX.test(phone.replace(/\s+/g, ''))) {
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       error: "Please enter a valid phone number" 
    //     },
    //     { status: 400 }
    //   );
    // }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { success: false, error: "Database connection error" },
        { status: 500 }
      );
    }

    const existingUser = await usersCol.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      username: username.trim(),
      phone: phone.replace(/\s+/g, ''),
      origin: (origin || 'web').toLowerCase(),
      hasSeenPopup: false,
      points: 0,
      currentLevel: 1,
      POIsCompleted: 0,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      loginCount: 0
    };

    const result = await usersCol.insertOne(newUser);
    const insertedUser = {
      ...newUser,
      _id: result.insertedId
    };

    return NextResponse.json(
      {
        success: true,
        user: insertedUser,
        userId: result.insertedId,
        isVerified: true,
        message: "Registration successful!"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}
