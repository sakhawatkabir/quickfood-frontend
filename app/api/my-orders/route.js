import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/my-orders — get the logged-in customer's order history
export async function GET(request) {
  const { payload, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const orders = await prisma.order.findMany({
      where: { customerId: payload.id },
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: { select: { id: true, name: true } },
        items: {
          include: {
            menuItem: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status,
        delivery_address: order.deliveryAddress,
        total_cost: order.totalCost,
        created_at: order.createdAt,
        restaurant: order.restaurant,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.menuItem.name,
          menu_item_name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.totalPrice,
        })),
      })),
    });
  } catch (error) {
    console.error("[my-orders GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
