import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const adminExists = await prisma.user.findFirst({
      where: { email: "hotwave" },
    });

    if (adminExists) {
      return NextResponse.json(
        { message: "Admin user already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash("waves010", 10);
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "hotwave",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "Admin user created successfully", email: admin.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to set up admin user." },
      { status: 500 }
    );
  }
}
