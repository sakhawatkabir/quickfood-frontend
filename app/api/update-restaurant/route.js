import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

// PUT /api/update-restaurant
export async function PUT(request) {
  const { payload, errorResponse } = await requireRole(
    request,
    "restaurant_owner"
  );
  if (errorResponse) return errorResponse;

  try {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"), 10);
    const name = formData.get("name");
    const description = formData.get("description");
    const location = formData.get("location");
    const imageFile = formData.get("image");

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

    // Upload new image if provided
    let imageUrl = existing.image;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, "quickfood/restaurants");
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        location: location ?? undefined,
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        image: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
