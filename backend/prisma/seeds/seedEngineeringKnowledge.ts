import type { PrismaClient } from "@prisma/client";
import {
  loadCategoriesConfig,
  loadDisciplinesConfig,
  loadSampleItemsConfig,
  loadSpecializationsConfig,
} from "./loadKnowledgeConfig.js";

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const buildSearchText = (input: {
  title: string;
  content?: string | null;
  keywords: string[];
  tags: string[];
  disciplineName: string;
  specializationName?: string | null;
  categoryName: string;
}): string =>
  [
    input.title,
    input.content,
    input.disciplineName,
    input.specializationName,
    input.categoryName,
    ...input.keywords,
    ...input.tags,
  ]
    .filter(Boolean)
    .join(" ");

const applyTemplate = (
  template: string,
  values: Record<string, string>
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

export const seedEngineeringKnowledge = async (prisma: PrismaClient) => {
  const { disciplines } = loadDisciplinesConfig();
  const { categories } = loadCategoriesConfig();
  const { specializations } = loadSpecializationsConfig();
  const { items: sampleItems } = loadSampleItemsConfig();

  for (const discipline of disciplines) {
    await prisma.engineeringDiscipline.upsert({
      where: { id: discipline.id },
      update: {
        name: discipline.name,
        icon: discipline.icon,
        description: discipline.description,
        color: discipline.color,
        active: discipline.active,
        displayOrder: discipline.displayOrder,
      },
      create: {
        id: discipline.id,
        name: discipline.name,
        icon: discipline.icon,
        description: discipline.description,
        color: discipline.color,
        active: discipline.active,
        displayOrder: discipline.displayOrder,
      },
    });
  }

  for (const category of categories) {
    await prisma.engineeringKnowledgeCategory.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
        active: category.active,
      },
      create: {
        id: category.id,
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
        active: category.active,
      },
    });
  }

  for (const specialization of specializations) {
    await prisma.engineeringSpecialization.upsert({
      where: { id: specialization.id },
      update: {
        disciplineId: specialization.disciplineId,
        name: specialization.name,
        description: specialization.description,
        icon: specialization.icon,
        displayOrder: specialization.displayOrder,
        active: specialization.active,
      },
      create: {
        id: specialization.id,
        disciplineId: specialization.disciplineId,
        name: specialization.name,
        description: specialization.description,
        icon: specialization.icon,
        displayOrder: specialization.displayOrder,
        active: specialization.active,
      },
    });
  }

  const disciplineMap = new Map(disciplines.map((entry) => [entry.id, entry]));
  const categoryMap = new Map(categories.map((entry) => [entry.id, entry]));
  const specializationByDiscipline = new Map<string, typeof specializations>();

  for (const specialization of specializations) {
    const list = specializationByDiscipline.get(specialization.disciplineId) ?? [];
    list.push(specialization);
    specializationByDiscipline.set(specialization.disciplineId, list);
  }

  for (const sample of sampleItems) {
    const discipline = disciplineMap.get(sample.disciplineId);
    const category = categoryMap.get(sample.categoryId);
    const firstSpecialization =
      specializationByDiscipline.get(sample.disciplineId)?.[0] ?? null;

    if (!discipline || !category || !firstSpecialization) {
      continue;
    }

    const templateValues = {
      discipline: discipline.name,
      specialization: firstSpecialization.name,
      category: category.name,
    };

    const title = applyTemplate(sample.titleTemplate, templateValues);
    const content = applyTemplate(sample.contentTemplate, templateValues);
    const stableSeedId = `seed-${sample.disciplineId}-${sample.categoryId}`;

    const knowledgeItem = await prisma.engineeringKnowledgeItem.upsert({
      where: { id: stableSeedId },
      update: {
        title,
        disciplineId: sample.disciplineId,
        specializationId: firstSpecialization.id,
        categoryId: sample.categoryId,
        keywords: sample.keywords,
        tags: sample.tags,
        language: sample.language,
        version: sample.version,
        source: sample.source,
        status: sample.status,
        content,
      },
      create: {
        id: stableSeedId,
        title,
        disciplineId: sample.disciplineId,
        specializationId: firstSpecialization.id,
        categoryId: sample.categoryId,
        keywords: sample.keywords,
        tags: sample.tags,
        language: sample.language,
        version: sample.version,
        source: sample.source,
        status: sample.status,
        content,
      },
    });

    const searchText = buildSearchText({
      title: knowledgeItem.title,
      content: knowledgeItem.content,
      keywords: knowledgeItem.keywords,
      tags: knowledgeItem.tags,
      disciplineName: discipline.name,
      specializationName: firstSpecialization.name,
      categoryName: category.name,
    });

    const keywordTokens = Array.from(
      new Set([
        ...tokenize(searchText),
        ...knowledgeItem.keywords.map((value) => value.toLowerCase()),
        ...knowledgeItem.tags.map((value) => value.toLowerCase()),
      ])
    );

    await prisma.engineeringKnowledgeSearchIndex.upsert({
      where: { knowledgeItemId: knowledgeItem.id },
      update: {
        searchText,
        keywordTokens,
      },
      create: {
        knowledgeItemId: knowledgeItem.id,
        searchText,
        keywordTokens,
      },
    });
  }

  console.log(
    `Engineering knowledge seeded: ${disciplines.length} disciplines, ${categories.length} categories, ${specializations.length} specializations, ${sampleItems.length} sample items.`
  );
};
