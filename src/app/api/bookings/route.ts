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
  } catch (error: any) {
    console.error("Booking GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings", details: error.message }, { status: 500 });
  }
}

// POST a new booking (Public)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST Body:", body);
    
    if (!process.env.DATABASE_URL) {
        console.error("CRITICAL: DATABASE_URL is missing!");
        return NextResponse.json({ error: "Internal Server Configuration Error (DB)" }, { status: 500 });
    }

    const { customerName, phoneNumber, customerEmail, serviceName, packageName, hotelName, notes, adults, children, bookingDate } = body;

    if (!serviceName) {
      return NextResponse.json({ error: "Service name is required" }, { status: 400 });
    }

    try {
        const booking = await prisma.booking.create({
          data: {
            customerName: customerName || null,
            phoneNumber: phoneNumber || null,
            customerEmail: customerEmail || null,
            serviceName,
            packageName: packageName || null,
            hotelName: hotelName || null,
            adults: (typeof adults === 'string' ? parseInt(adults) : adults) || 1,
            children: (typeof children === 'string' ? parseInt(children) : children) || 0,
            bookingDate: bookingDate ? new Date(bookingDate) : null,
            notes: notes || null,
            status: "PENDING",
          },
        });
        return NextResponse.json(booking, { status: 201 });
    } catch (dbError: any) {
        console.error("PRISMA CREATE ERROR:", dbError);
        return NextResponse.json({ error: "Database operation failed", details: dbError.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Booking API Fatal Error:", error);
    return NextResponse.json({ 
      error: "General API failure", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
