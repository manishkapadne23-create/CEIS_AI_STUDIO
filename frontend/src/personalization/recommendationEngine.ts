import { getPendingTasks } from "../assistant/taskManager";
import {
  readRecentlyUsedCalculatorIds,
} from "../config/calculators/calculatorsPersistence";
import { getCalculatorsCatalogByDisciplineId } from "../config/calculators";
import {
  readFavouriteStandardIds,
  readRecentlyViewedStandardIds,
} from "../config/standards/standardsPersistence";
import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { listDocuments } from "../documents/documentMemory";
import { getProductivityItems } from "../dashboard/analyticsWidget";
import { buildPersonalizationBundle } from "../intelligence/recommendationEngine";
import { getUserLearningProfile } from "../intelligence/personalizationEngine";
import { getFavoriteTemplates } from "../templates/templateSearch";
import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";
import { disciplineIdToSlug } from "../navigation/disciplineSlugs";
import { getRecentActivity } from "./activityTracker";
import { getEngineeringProfile } from "./profileEngine";
import type {
  PersonalizedHomeBundle,
  PersonalizedItem,
  PersonalizationSearchContext,
  SmartRecommendations,
} from "./types";
import {
  getFavoriteResourceIdSet,
  getFrequentResourceIds,
  getRecentResourceIds,
  getUnifiedFavorites,
} from "./favoritesManager";

const toItem = (
  id: string,
  title: string,
  type: string,
  options?: Partial<PersonalizedItem>
): PersonalizedItem => ({
  id,
  title,
  type,
  ...options,
});

const resolveStandardsForDiscipline = (
  disciplineId: string,
  ids: string[]
): PersonalizedItem[] => {
  const catalog = getStandardsCatalogByDisciplineId(disciplineId);
  return ids.map((standardId) => {
    const standard = catalog?.standards.find((entry) => entry.id === standardId);
    return toItem(
      `standard-${disciplineId}-${standardId}`,
      standard?.codeNumber ?? standardId,
      "standard",
      {
        subtitle: standard?.title,
        route: `/chat/${disciplineIdToSlug(disciplineId)}/standards`,
        icon: "📜",
      }
    );
  });
};

const resolveCalculatorsForDiscipline = (
  disciplineId: string,
  ids: string[]
): PersonalizedItem[] => {
  const catalog = getCalculatorsCatalogByDisciplineId(disciplineId);
  return ids.map((calculatorId) => {
    const calculator = catalog?.calculators.find((entry) => entry.id === calculatorId);
    return toItem(
      `calculator-${disciplineId}-${calculatorId}`,
      calculator?.name ?? calculatorId,
      "calculator",
      {
        subtitle: calculator?.description,
        route: `/chat/${disciplineIdToSlug(disciplineId)}/calculators`,
        icon: "🔢",
      }
    );
  });
};

export const buildSmartRecommendations = (
  disciplineId: string | null
): SmartRecommendations => {
  const profile = getEngineeringProfile();
  const learningProfile = getUserLearningProfile();
  const bundle = buildPersonalizationBundle(learningProfile, disciplineId);

  const primaryDiscipline =
    disciplineId ?? profile.primaryDisciplineId ?? "civil-engineering";

  return {
    standards: bundle.recommendedStandards.map((title, index) =>
      toItem(`rec-standard-${index}`, title, "standard", {
        route: `/chat/${disciplineIdToSlug(primaryDiscipline)}/standards`,
        icon: "📜",
      })
    ),
    calculators: bundle.recommendedCalculators.map((title, index) =>
      toItem(`rec-calculator-${index}`, title, "calculator", {
        route: `/chat/${disciplineIdToSlug(primaryDiscipline)}/calculators`,
        icon: "🔢",
      })
    ),
    tools: bundle.recommendedTools.map((title, index) =>
      toItem(`rec-tool-${index}`, title, "tool", {
        route: `/chat/${disciplineIdToSlug(primaryDiscipline)}/professional-tools`,
        icon: "🛠️",
      })
    ),
    templates: getFavoriteTemplates()
      .slice(0, 4)
      .map((template) =>
        toItem(template.id, template.title, "template", {
          subtitle: template.documentTypeName,
          route: `/chat/${disciplineIdToSlug(template.disciplineId)}/professional-tools`,
          icon: "📋",
        })
      ),
    learning: bundle.recommendedLearning.map((title, index) =>
      toItem(`rec-learning-${index}`, title, "learning", {
        route: "/learning",
        icon: "🎓",
      })
    ),
    aiExperts: [
      toItem("ai-expert", `${profile.primaryDisciplineName ?? "Engineering"} AI Expert`, "ai-expert", {
        route: `/chat/${disciplineIdToSlug(primaryDiscipline)}/ai-expert`,
        icon: "🤖",
      }),
    ],
    documents: listDocuments()
      .slice(0, 4)
      .map((document) =>
        toItem(document.id, document.name, "document", {
          subtitle: document.documentType,
          route: "/documents",
          icon: "📄",
        })
      ),
  };
};

export const buildPersonalizedHome = (
  disciplineId: string | null = null
): PersonalizedHomeBundle => {
  const profile = getEngineeringProfile();
  const activeDiscipline =
    disciplineId ?? profile.primaryDisciplineId ?? "civil-engineering";

  const chatsRaw = readPersistedString(PERSISTED_KEYS.chatSessions);
  let recentConversations: PersonalizedItem[] = [];
  if (chatsRaw) {
    try {
      const chats = JSON.parse(chatsRaw) as Array<{ id: string; title: string }>;
      recentConversations = chats.slice(0, 6).map((chat) =>
        toItem(chat.id, chat.title, "conversation", { route: "/chat", icon: "💬" })
      );
    } catch {
      recentConversations = [];
    }
  }

  const frequentStandards = resolveStandardsForDiscipline(
    activeDiscipline,
    readRecentlyViewedStandardIds(activeDiscipline).slice(0, 6)
  );

  const favoriteStandards = resolveStandardsForDiscipline(
    activeDiscipline,
    readFavouriteStandardIds(activeDiscipline).slice(0, 4)
  );

  const frequentCalculators = resolveCalculatorsForDiscipline(
    activeDiscipline,
    readRecentlyUsedCalculatorIds(activeDiscipline).slice(0, 6)
  );

  const smartRecommendations = buildSmartRecommendations(activeDiscipline);

  const productivity = [
    ...getPendingTasks()
      .slice(0, 4)
      .map((task) =>
        toItem(task.id, task.name, "task", {
          subtitle: task.status,
          route: "/chat",
          icon: "✅",
        })
      ),
    ...getProductivityItems()
      .slice(0, 4)
      .map((item) =>
        toItem(item.id, item.title, item.type, {
          route: "/chat",
          icon: item.type === "workflow" ? "🔄" : "📝",
        })
      ),
  ];

  const researchRaw = readPersistedString("sarathi.research.workspaces");
  let recentReports: PersonalizedItem[] = [];
  if (researchRaw) {
    try {
      const reports = JSON.parse(researchRaw) as Array<{ id: string; title: string }>;
      recentReports = reports.slice(0, 4).map((report) =>
        toItem(report.id, report.title, "report", { route: "/chat", icon: "📊" })
      );
    } catch {
      recentReports = [];
    }
  }

  return {
    recentConversations,
    frequentStandards: [...favoriteStandards, ...frequentStandards].slice(0, 8),
    frequentCalculators,
    frequentTools: smartRecommendations.tools.slice(0, 6),
    recommendedLearning: smartRecommendations.learning,
    recentDocuments: listDocuments()
      .slice(0, 6)
      .map((document) =>
        toItem(document.id, document.name, "document", {
          subtitle: document.category,
          route: "/documents",
          icon: "📄",
        })
      ),
    savedTemplates: getFavoriteTemplates()
      .slice(0, 6)
      .map((template) =>
        toItem(template.id, template.title, "template", {
          subtitle: template.documentTypeName,
          route: `/chat/${disciplineIdToSlug(template.disciplineId)}/professional-tools`,
          icon: "📋",
        })
      ),
    recentReports,
    smartRecommendations,
    recentActivity: getRecentActivity(10),
    productivity,
  };
};

export const getPersonalizationSearchContext = (): PersonalizationSearchContext => ({
  disciplineId: getEngineeringProfile().primaryDisciplineId,
  favoriteResourceIds: getFavoriteResourceIdSet(),
  recentResourceIds: getRecentResourceIds(),
  frequentResourceIds: getFrequentResourceIds(),
});

export const getPersonalizationSearchBoost = (
  entryType: string,
  resourceId: string | undefined,
  disciplineId: string | null
): number => {
  const context = getPersonalizationSearchContext();
  let boost = 0;

  if (resourceId && context.favoriteResourceIds.has(`${entryType}:${resourceId}`)) {
    boost += 5;
  }
  if (resourceId && context.recentResourceIds.has(`${entryType}:${resourceId}`)) {
    boost += 3;
  }
  if (resourceId && context.frequentResourceIds.has(`${entryType}:${resourceId}`)) {
    boost += 4;
  }
  if (disciplineId && context.disciplineId && disciplineId === context.disciplineId) {
    boost += 6;
  }

  return boost;
};

export const getPersonalizedQuickAccess = (): PersonalizedItem[] => {
  const favorites = getUnifiedFavorites().slice(0, 8);
  return favorites.map((favorite) =>
    toItem(favorite.id, favorite.title, favorite.type, {
      route:
        favorite.type === "document"
          ? "/documents"
          : favorite.disciplineId
            ? `/chat/${disciplineIdToSlug(favorite.disciplineId)}`
            : "/chat",
      icon: "⭐",
    })
  );
};
