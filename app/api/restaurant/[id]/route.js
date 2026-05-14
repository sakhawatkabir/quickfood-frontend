import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/restaurant/[id]
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid restaurant ID" },
        { status: 400 },
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        image: true,
        hours: true,
        contact: true,
        menuItems: {
          where: { isAvailable: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            restaurantId: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    const { menuItems, ...rest } = restaurant;
    return NextResponse.json({
      ...rest,
      menus: menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        restaurant_id: item.restaurantId,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
