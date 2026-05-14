import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

/**
 * Extract and verify the Bearer token from an incoming Request.
 */
export async function requireAuth(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return {
      payload: null,
      errorResponse: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = await verifyToken(token);
    return { payload, errorResponse: null };
  } catch {
    return {
      payload: null,
      errorResponse: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}


export async function requireRole(request, role) {
  const { payload, errorResponse } = await requireAuth(request);
  if (errorResponse) return { payload: null, errorResponse };

  if (payload.role !== role) {
    return {
      payload: null,
      errorResponse: NextResponse.json(
        { error: "Forbidden: insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { payload, errorResponse: null };
}
