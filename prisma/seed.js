import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data (order matters due to FK constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // ── Users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const owner1 = await prisma.user.create({
    data: {
      username: "mario_owner",
      email: "mario@quickfood.com",
      password: hashedPassword,
      role: "restaurant_owner",
      firstName: "Mario",
      lastName: "Rossi",
      phoneNumber: "+1-555-0101",
      address: "123 Main St, New York, NY",
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      username: "sakura_owner",
      email: "sakura@quickfood.com",
      password: hashedPassword,
      role: "restaurant_owner",
      firstName: "Sakura",
      lastName: "Tanaka",
      phoneNumber: "+1-555-0202",
      address: "456 Oak Ave, Los Angeles, CA",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      username: "john_doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "user",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+1-555-0303",
      address: "789 Pine Rd, Chicago, IL",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      username: "jane_smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: "user",
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "+1-555-0404",
      address: "321 Elm St, Houston, TX",
    },
  });

  console.log("👤 Created 2 owners + 2 customers");

  // ── Restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: "Mario's Italian Kitchen",
      description: "Authentic Italian cuisine made with love. Fresh pasta, wood-fired pizza, and classic desserts.",
      location: "123 Little Italy, New York, NY 10013",
      hours: "Mon–Sun: 11:00 AM – 10:00 PM",
      contact: "+1-555-1001 | mario@italianktichen.com",
      ownerId: owner1.id,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: "Sakura Sushi Bar",
      description: "Premium Japanese sushi and ramen. Fresh fish delivered daily, traditional recipes.",
      location: "456 Japan Town, Los Angeles, CA 90012",
      hours: "Tue–Sun: 12:00 PM – 11:00 PM",
      contact: "+1-555-2002 | sakura@sushibar.com",
      ownerId: owner2.id,
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: "The Burger Shack",
      description: "Juicy smash burgers, crispy fries, and thick milkshakes. Classic American comfort food.",
      location: "789 Burger Blvd, Chicago, IL 60601",
      hours: "Mon–Sun: 10:00 AM – 11:00 PM",
      contact: "+1-555-3003",
      ownerId: owner1.id,
    },
  });

  const restaurant4 = await prisma.restaurant.create({
    data: {
      name: "Spice Garden",
      description: "Vibrant Indian flavors — curries, biryanis, tandoori dishes, and freshly baked naan.",
      location: "101 Curry Lane, Houston, TX 77001",
      hours: "Mon–Sun: 11:30 AM – 10:30 PM",
      contact: "+1-555-4004",
      ownerId: owner2.id,
    },
  });

  console.log("🏪 Created 4 restaurants");

  // ── Menu Items — Mario's Italian Kitchen
  const pasta = await prisma.menuItem.create({
    data: {
      name: "Spaghetti Carbonara",
      description: "Classic Roman pasta with eggs, Pecorino Romano, guanciale, and black pepper.",
      price: 16.99,
      restaurantId: restaurant1.id,
    },
  });

  const pizza = await prisma.menuItem.create({
    data: {
      name: "Margherita Pizza",
      description: "Wood-fired pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
      price: 14.99,
      restaurantId: restaurant1.id,
    },
  });

  const lasagna = await prisma.menuItem.create({
    data: {
      name: "Lasagna al Forno",
      description: "Layers of fresh pasta, Bolognese ragù, béchamel, and Parmigiano-Reggiano.",
      price: 18.99,
      restaurantId: restaurant1.id,
    },
  });

  const tiramisu = await prisma.menuItem.create({
    data: {
      name: "Tiramisu",
      description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.",
      price: 7.99,
      restaurantId: restaurant1.id,
    },
  });

  // ── Menu Items — Sakura Sushi Bar
  const salmonRoll = await prisma.menuItem.create({
    data: {
      name: "Salmon Avocado Roll",
      description: "Fresh Atlantic salmon, creamy avocado, cucumber, wrapped in seasoned sushi rice.",
      price: 13.99,
      restaurantId: restaurant2.id,
    },
  });

  const ramen = await prisma.menuItem.create({
    data: {
      name: "Tonkotsu Ramen",
      description: "Rich pork bone broth, chashu pork, soft-boiled egg, nori, and green onions.",
      price: 15.99,
      restaurantId: restaurant2.id,
    },
  });

  const sashimi = await prisma.menuItem.create({
    data: {
      name: "Sashimi Platter (12 pcs)",
      description: "Chef's selection of premium fresh fish — tuna, salmon, yellowtail, and more.",
      price: 28.99,
      restaurantId: restaurant2.id,
    },
  });

  const edamame = await prisma.menuItem.create({
    data: {
      name: "Edamame",
      description: "Steamed young soybeans lightly salted. Perfect starter.",
      price: 5.99,
      restaurantId: restaurant2.id,
    },
  });

  // ── Menu Items — The Burger Shack
  const smashBurger = await prisma.menuItem.create({
    data: {
      name: "Classic Smash Burger",
      description: "Double smash patty, American cheese, pickles, onions, special sauce, brioche bun.",
      price: 12.99,
      restaurantId: restaurant3.id,
    },
  });

  const fries = await prisma.menuItem.create({
    data: {
      name: "Loaded Cheese Fries",
      description: "Crispy fries topped with cheddar cheese sauce, bacon bits, and jalapeños.",
      price: 7.99,
      restaurantId: restaurant3.id,
    },
  });

  const milkshake = await prisma.menuItem.create({
    data: {
      name: "Vanilla Milkshake",
      description: "Thick and creamy hand-spun vanilla milkshake topped with whipped cream.",
      price: 6.99,
      restaurantId: restaurant3.id,
    },
  });

  // ── Menu Items — Spice Garden
  const butterChicken = await prisma.menuItem.create({
    data: {
      name: "Butter Chicken",
      description: "Tender chicken in a rich, creamy tomato-based sauce with aromatic spices.",
      price: 17.99,
      restaurantId: restaurant4.id,
    },
  });

  const biryani = await prisma.menuItem.create({
    data: {
      name: "Lamb Biryani",
      description: "Fragrant basmati rice slow-cooked with tender lamb, saffron, and whole spices.",
      price: 19.99,
      restaurantId: restaurant4.id,
    },
  });

  const naan = await prisma.menuItem.create({
    data: {
      name: "Garlic Naan (3 pcs)",
      description: "Freshly baked tandoor bread brushed with garlic butter and cilantro.",
      price: 4.99,
      restaurantId: restaurant4.id,
    },
  });

  const mangoLassi = await prisma.menuItem.create({
    data: {
      name: "Mango Lassi",
      description: "Chilled yogurt-based drink blended with sweet Alphonso mangoes.",
      price: 4.99,
      restaurantId: restaurant4.id,
    },
  });

  console.log("🍕 Created 15 menu items");

  // ── Orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      restaurantId: restaurant1.id,
      deliveryAddress: "789 Pine Rd, Chicago, IL",
      status: "delivered",
      totalCost: 33.98,
      items: {
        create: [
          { menuItemId: pasta.id, quantity: 1, price: 16.99, totalPrice: 16.99 },
          { menuItemId: pizza.id, quantity: 1, price: 14.99, totalPrice: 14.99 },
          { menuItemId: tiramisu.id, quantity: 1, price: 7.99, totalPrice: 7.99 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      restaurantId: restaurant2.id,
      deliveryAddress: "321 Elm St, Houston, TX",
      status: "preparing",
      totalCost: 29.98,
      items: {
        create: [
          { menuItemId: salmonRoll.id, quantity: 2, price: 13.99, totalPrice: 27.98 },
          { menuItemId: edamame.id, quantity: 1, price: 5.99, totalPrice: 5.99 },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      restaurantId: restaurant3.id,
      deliveryAddress: "789 Pine Rd, Chicago, IL",
      status: "pending",
      totalCost: 27.97,
      items: {
        create: [
          { menuItemId: smashBurger.id, quantity: 2, price: 12.99, totalPrice: 25.98 },
          { menuItemId: milkshake.id, quantity: 1, price: 6.99, totalPrice: 6.99 },
        ],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      restaurantId: restaurant4.id,
      deliveryAddress: "321 Elm St, Houston, TX",
      status: "out_for_delivery",
      totalCost: 42.97,
      items: {
        create: [
          { menuItemId: butterChicken.id, quantity: 1, price: 17.99, totalPrice: 17.99 },
          { menuItemId: biryani.id, quantity: 1, price: 19.99, totalPrice: 19.99 },
          { menuItemId: naan.id, quantity: 1, price: 4.99, totalPrice: 4.99 },
          { menuItemId: mangoLassi.id, quantity: 2, price: 4.99, totalPrice: 9.98 },
        ],
      },
    },
  });

  console.log("📦 Created 4 orders");

  console.log("\n✅ Seed complete!");
  console.log("\n📋 Login credentials (all passwords: password123)");
  console.log("   Owners  : mario_owner | sakura_owner");
  console.log("   Customers: john_doe   | jane_smith");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
