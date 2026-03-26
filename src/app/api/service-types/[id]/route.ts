import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Clean up body to only include fields we want to update
    const updateData: any = {};
    const fields = [
      'name', 'nameEn', 'description', 'descriptionEn', 'price', 
      'images', 'duration', 'durationEn', 'includes', 'includesEn', 'featured', 'serviceId'
    ];
    
    fields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'price') updateData[field] = body[field] ? parseFloat(body[field]) : null;
        else updateData[field] = body[field];
      }
    });

    const pkg = await prisma.serviceType.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.serviceType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
