import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; typeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { typeId } = await params;

    await prisma.serviceType.delete({
      where: { id: typeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service type" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; typeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { typeId } = await params;
    const body = await req.json();
    
    // Extract and sanitize data
    const { name, nameEn, description, descriptionEn, price, imageUrl, duration, durationEn, includes, includesEn, notIncludes, notIncludesEn, featured } = body;

    const updatedType = await prisma.serviceType.update({
      where: { id: typeId },
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        price: price ? parseFloat(price) : null,
        imageUrl,
        duration,
        durationEn,
        includes,
        includesEn,
        notIncludes,
        notIncludesEn,
        featured,
      },
    });

    return NextResponse.json(updatedType);
  } catch (error) {
    console.error("Update service type error:", error);
    return NextResponse.json({ error: "Failed to update service type" }, { status: 500 });
  }
}
