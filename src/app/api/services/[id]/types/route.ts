import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: serviceId } = await params;
    const { name, nameEn, description, descriptionEn, price, imageUrl } = await req.json();

    const serviceType = await prisma.serviceType.create({
      data: {
        serviceId,
        name,
        nameEn: nameEn || "",
        description: description || "",
        descriptionEn: descriptionEn || "",
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(serviceType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service type" }, { status: 500 });
  }
}
