import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// GET /api/user-orders
export async function GET(request) {
  const { payload, errorResponse } = await requireRole(
    request,
    "restaurant_owner",
  );
  if (errorResponse) return errorResponse;

  try {
    const orders = await prisma.order.findMany({
      where: {
        restaurant: { ownerId: payload.id },
      },
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { id: true, username: true, email: true },
        },
        restaurant: { select: { id: true, name: true } },
        items: {
          include: {
            menuItem: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        status: order.status,
        delivery_address: order.deliveryAddress,
        total_cost: order.totalCost,
        created_at: order.createdAt,
        customer: order.customer,
        restaurant: order.restaurant,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.totalPrice,
        })),
      })),
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
