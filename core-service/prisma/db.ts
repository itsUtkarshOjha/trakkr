import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

async function seed() {
  console.log("Running Prisma Seed...");

  // Your function that should always run after migration
  await prisma.exercise.upsert({
    where: { name: "Barbell Bench Press" },
    update: {},
    create: { name: "Barbell Bench Press" },
  });

  console.log("Seeding completed.");
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
