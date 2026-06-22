import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const packages = await prisma.serviceType.findMany({
      orderBy: { createdAt: 'desc' },
      include: { service: true }
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      serviceId, 
      name, 
      nameEn, 
      description, 
      descriptionEn, 
      price, 
      images, 
      duration, 
      durationEn, 
      includes, 
      includesEn,
      notIncludes,
      notIncludesEn,
      featured 
    } = body;

    if (!serviceId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pkg = await prisma.serviceType.create({
      data: {
        serviceId,
        name,
        nameEn: nameEn || "",
        description: description || "",
        descriptionEn: descriptionEn || "",
        price: price ? parseFloat(price) : null,
        images: images || [],
        duration,
        durationEn,
        includes,
        includesEn,
        notIncludes,
        notIncludesEn,
        featured: featured || false,
      },
    });

    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
