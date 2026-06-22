import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceTypeId = searchParams.get('serviceTypeId');

    if (!serviceTypeId) {
      return NextResponse.json({ error: "serviceTypeId is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        serviceTypeId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, authorName, serviceTypeId } = body;

    if (!serviceTypeId || !authorName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        authorName,
        serviceTypeId,
        // isApproved is true by default from our schema
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Database operation failed", details: error.message }, { status: 500 });
  }
}
