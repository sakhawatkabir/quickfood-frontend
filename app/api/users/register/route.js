import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, password2 } = body;

    // ── Validation
    const errors = { username: [], email: [], password: [], password2: [] };
    let hasError = false;

    if (!username || username.trim().length < 3) {
      errors.username.push("Username must be at least 3 characters.");
      hasError = true;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email.push("Enter a valid email address.");
      hasError = true;
    }

    if (!password || password.length < 6) {
      errors.password.push("Password must be at least 6 characters.");
      hasError = true;
    }

    if (password !== password2) {
      errors.password2.push("Passwords do not match.");
      hasError = true;
    }

    if (hasError) {
      return NextResponse.json(errors, { status: 400 });
    }

    // ── Uniqueness checks
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      errors.username.push("A user with this username already exists.");
      return NextResponse.json(errors, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      errors.email.push("A user with this email already exists.");
      return NextResponse.json(errors, { status: 400 });
    }

    // ── Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
      select: { id: true, username: true, email: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
