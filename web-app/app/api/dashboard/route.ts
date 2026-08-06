import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import { getDashboardData } from "@/app/lib/dashboard";

export async function GET(request: Request) {
  try {
    const payload = verifyToken(request);

    if (!payload.schoolId) {
      return NextResponse.json(
        { error: "No school selected for this session", code: "NO_SCHOOL_SELECTED" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
const classId = searchParams.get("classId") ? Number(searchParams.get("classId")) : undefined;
const sectionId = searchParams.get("sectionId") ? Number(searchParams.get("sectionId")) : undefined;
const academicYear = searchParams.get("academicYear") ?? undefined;

const data = await getDashboardData(Number(payload.schoolId), classId, sectionId, academicYear);

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/dashboard error:", err);
    return NextResponse.json({ error: "Unauthorized or failed to fetch dashboard data" }, { status: 401 });
  }
}