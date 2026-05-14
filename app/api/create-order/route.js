import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// POST /api/create-order 
export async function POST(request) {
  const { payload, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { restaurant_id, items, delivery_address } = body;

    if (!restaurant_id || !items?.length || !delivery_address?.trim()) {
      return NextResponse.json(
        {
          message:
            "restaurant_id, items, and delivery_address are required.",
        },
        { status: 400 }
      );
    }

    // Validate restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurant_id },
    });
    if (!restaurant) {
      return NextResponse.json(
        { message: "Restaurant not found." },
        { status: 404 }
      );
    }

    const menuItemIds = items.map((i) => i.menu_item_id);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, restaurantId: restaurant_id },
    });

    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { message: "One or more menu items are invalid or unavailable." },
        { status: 400 }
      );
    }

    const menuMap = Object.fromEntries(menuItems.map((m) => [m.id, m]));

    // Calculate total cost
    let totalCost = 0;
    const orderItemsData = items.map((item) => {
      const menuItem = menuMap[item.menu_item_id];
      const price = parseFloat(menuItem.price);
      const quantity = item.quantity;
      const totalPrice = price * quantity;
      totalCost += totalPrice;

      return {
        menuItemId: item.menu_item_id,
        quantity,
        price,
        totalPrice,
      };
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: payload.id,
        restaurantId: restaurant_id,
        deliveryAddress: delivery_address.trim(),
        totalCost,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { menuItem: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json(
      {
        id: order.id,
        status: order.status,
        delivery_address: order.deliveryAddress,
        total_cost: order.totalCost,
        items: order.items.map((i) => ({
          id: i.id,
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.price,
          total_price: i.totalPrice,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
