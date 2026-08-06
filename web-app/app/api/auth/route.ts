import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, password } = body;

    if (!mobile || !password) {
      return NextResponse.json(
        { message: "Mobile number and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { mobile: String(mobile).trim() },
    });

  console.log("Looking for mobile:", mobile);
  console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Incorrect username or password." },
        { status: 401 }
      );
    }

    // NOTE: still plain-text comparison — flagging again, see note below
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Incorrect username or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.roles,
        // schoolId is added later, once selected — see select-school route
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
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
    console.error("Prisma Database Authentication Error:", error);
    return NextResponse.json(
      { message: "Incorrect username or password." },
      { status: 401 }
    );
  }
}