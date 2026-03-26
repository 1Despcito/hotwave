import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all bookings (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST a new booking (Public)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phoneNumber, customerEmail, serviceName, packageName, notes, adults, children, bookingDate } = body;

    if (!serviceName) {
      return NextResponse.json({ error: "Service name is required" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: customerName || null,
        phoneNumber: phoneNumber || null,
        customerEmail: customerEmail || null,
        serviceName,
        packageName: packageName || null,
        adults: adults ? parseInt(adults) : 1,
        children: children ? parseInt(children) : 0,
        bookingDate: bookingDate ? new Date(bookingDate) : null,
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
