import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.service.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, titleEn, description, descriptionEn, images, imageUrl, icon } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        images: images || undefined,
        imageUrl: imageUrl || (images && images.length > 0 ? images[0] : undefined),
        icon,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
