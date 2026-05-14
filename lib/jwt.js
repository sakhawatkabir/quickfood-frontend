import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "quickfood_super_secret_jwt_key_change_in_production"
);

/**
 * Sign a JWT token
 */
export async function signToken(payload, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verify a JWT token and return the payload
 */
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
