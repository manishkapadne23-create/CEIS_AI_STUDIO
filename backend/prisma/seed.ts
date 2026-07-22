import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const domains = [
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics & Communication Engineering",
  "Computer Science Engineering",
  "Software Engineering",
  "Artificial Intelligence & Machine Learning Engineering",
  "Chemical Engineering",
  "Environmental Engineering",
  "Biomedical Engineering",
  "Biotechnology Engineering",
  "Agricultural Engineering",
  "Architectural Engineering",
  "Automotive Engineering",
  "Aerospace Engineering",
  "Aeronautical Engineering",
  "Avionics Engineering",
  "Marine Engineering",
  "Naval Architecture",
  "Mining Engineering",
  "Geological Engineering",
  "Geotechnical Engineering",
  "Petroleum Engineering",
  "Nuclear Engineering",
  "Materials Science & Engineering",
  "Metallurgical Engineering",
  "Polymer Engineering",
  "Nanotechnology Engineering",
  "Microelectronics Engineering",
  "Instrumentation & Control Engineering",
  "Industrial Engineering",
  "Production Engineering",
  "Systems Engineering",
  "Data Engineering",
  "Cybersecurity Engineering",
  "Information Technology",
  "Food Process Engineering",
  "Pharmaceutical Engineering",
  "Genetic Engineering",
  "Optical / Photonics Engineering",
  "Renewable Energy Engineering",
  "Robotics Engineering",
  "Mechatronics Engineering",
  "Telecommunication Engineering",
  "Textile Engineering",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const seed = async () => {
  for (const [index, name] of domains.entries()) {
    const slug = slugify(name);

    await prisma.engineeringDomain.upsert({
      where: { slug },
      update: { name, isActive: true, displayOrder: index + 1 },
      create: {
        name,
        slug,
        icon: "🛠️",
        description: `${name} domain for CEIS AI Studio workflows.`,
        color: "#06b6d4",
        displayOrder: index + 1,
        isActive: true,
      },
    });
  }
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
