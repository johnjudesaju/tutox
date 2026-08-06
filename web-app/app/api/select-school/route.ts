import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../lib/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const payload = verifyToken(request);
    const { schoolId } = await request.json();

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
    }

    // Re-issue token with schoolId embedded — no cookies needed
    const token = jwt.sign(
      { userId: payload.userId, role: payload.role, schoolId: String(schoolId) },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized or invalid request" }, { status: 401 });
  }
}