import { PrismaClient } from "@prisma/client";
import { seedEngineeringDomains } from "./seeds/seedEngineeringDomains.js";
import { seedEngineeringKnowledge } from "./seeds/seedEngineeringKnowledge.js";
import { seedEdm } from "./seeds/seedEdm.js";

const prisma = new PrismaClient();

const seed = async () => {
  await seedEngineeringDomains(prisma);
  await seedEngineeringKnowledge(prisma);
  await seedEdm(prisma);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
