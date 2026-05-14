import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// GET /api/owner-restaurants
export async function GET(request) {
  const { payload, errorResponse } = await requireRole(
    request,
    "restaurant_owner"
  );
  if (errorResponse) return errorResponse;

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: payload.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        image: true,
        hours: true,
        contact: true,
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
