import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// DELETE /api/delete-restaurant?id=<restaurantId>
export async function DELETE(request) {
  const { payload, errorResponse } = await requireRole(
    request,
    "restaurant_owner"
  );
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"), 10);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Restaurant ID is required." },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Restaurant not found." },
        { status: 404 }
      );
    }
    if (existing.ownerId !== payload.id) {
      return NextResponse.json(
        { error: "Forbidden: you do not own this restaurant." },
        { status: 403 }
      );
    }

    await prisma.restaurant.delete({ where: { id } });

    return NextResponse.json({ message: "Restaurant deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
