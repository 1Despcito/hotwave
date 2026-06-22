import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: { types: { orderBy: { createdAt: 'asc' } } },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, titleEn, description, descriptionEn, images, imageUrl } = await req.json();

    const service = await prisma.service.create({
      data: { 
        title, 
        titleEn, 
        description, 
        descriptionEn, 
        images: images || (imageUrl ? [imageUrl] : []),
        imageUrl: imageUrl || (images && images.length > 0 ? images[0] : null)
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
