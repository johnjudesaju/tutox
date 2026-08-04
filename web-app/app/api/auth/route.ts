import { NextResponse } from "next/server";
// Explicit relative navigation out of app/api/auth to the web-app root lib folder
import { prisma } from "../../lib/prisma"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, password } = body;

    // 1. Basic format validation
    if (!mobile || !password) {
      return NextResponse.json(
        { message: "Mobile number and password are required." },
        { status: 400 }
      );
    }

    // 2. Fetch the user profile by the dynamic mobile number string
    const user = await prisma.user.findFirst({
      where: {
        mobile: String(mobile).trim(),
      },
    });

    // 3. Fail early if no match is found
    if (!user) {
      return NextResponse.json(
        { message: "Incorrect username or password." },
        { status: 401 }
      );
    }

    // 4. Verify password plain-text equality
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Incorrect username or password." },
        { status: 401 }
      );
    }

    // 5. Successful validation payload
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          role: user.roles,
          status: user.status,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    // Check your terminal window running the server to read the true connection error trace here
    console.error("Prisma Database Authentication Error:", error);
    
    return NextResponse.json(
      { message: "Incorrect username or password." },
      { status: 401 }
    );
  }
}
