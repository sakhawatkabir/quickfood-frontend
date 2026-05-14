import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// PUT /api/users/update-profile — update current user's profile
export async function PUT(request) {
  const { payload, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { first_name, last_name, phone_number, address, profile_image } =
      body;

    const updated = await prisma.user.update({
      where: { id: payload.id },
      data: {
        firstName: first_name ?? undefined,
        lastName: last_name ?? undefined,
        phoneNumber: phone_number ?? undefined,
        address: address ?? undefined,
        profileImage: profile_image ?? undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        address: true,
        profileImage: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      first_name: updated.firstName,
      last_name: updated.lastName,
      phone_number: updated.phoneNumber,
      address: updated.address,
      profile_image: updated.profileImage,
    });
  } catch (error) {
    console.error("[update-profile]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
