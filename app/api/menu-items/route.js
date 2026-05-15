import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/menu-items —
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        restaurantId: true,
        restaurant: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        restaurant_id: item.restaurantId,
        restaurant: item.restaurant,
      })),
    );
  } catch (error) {
    console.error("[menu-items GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
