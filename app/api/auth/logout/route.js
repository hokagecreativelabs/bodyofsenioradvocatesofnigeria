// app/api/auth/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear auth cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}