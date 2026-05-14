import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

// POST /api/create-restaurant — create a new restaurant (owner only)
export async function POST(request) {
  const { payload, errorResponse } = await requireRole(
    request,
    "restaurant_owner"
  );
  if (errorResponse) return errorResponse;

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const location = formData.get("location");
    const imageFile = formData.get("image");

    if (!name || !description || !location) {
      return NextResponse.json(
        { error: "Name, description, and location are required." },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, "quickfood/restaurants");
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        location,
        image: imageUrl,
        ownerId: payload.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        image: true,
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("[create-restaurant]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
