import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageSkeleton from "../components/PageSkeleton";
import AuthenticatedLayout, {
  getLastSidebarRoute,
} from "../layout/AuthenticatedLayout";
import { APP_ROUTES } from "./routeConfig";

const LoginPage = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ChatPage = lazy(() => import("../pages/ChatPage"));
const EngineeringDomainsPage = lazy(() => import("../pages/EngineeringDomainsPage"));
const PlaceholderPage = lazy(() => import("../pages/PlaceholderPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const DocumentsPage = lazy(() => import("../pages/hub/DocumentsPage"));
const EngineeringHubPage = lazy(() => import("../pages/hub/EngineeringHubPage"));
const EngineeringToolsPage = lazy(() => import("../pages/hub/EngineeringToolsPage"));
const HelpPage = lazy(() => import("../pages/hub/HelpPage"));
const LearningHubPage = lazy(() => import("../pages/hub/LearningHubPage"));
const NotificationsPage = lazy(() => import("../pages/hub/NotificationsPage"));
const ProfilePage = lazy(() => import("../pages/hub/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/hub/SettingsPage"));
const SubscriptionPage = lazy(() => import("../pages/hub/SubscriptionPage"));
const WalletPage = lazy(() => import("../pages/hub/WalletPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const DecisionIntelligencePage = lazy(() => import("../pages/DecisionIntelligencePage"));
const StandardsIntelligencePage = lazy(() => import("../pages/StandardsIntelligencePage"));
const KnowledgeGraphPage = lazy(() => import("../pages/KnowledgeGraphPage"));
const EngineeringMemoryPage = lazy(() => import("../pages/EngineeringMemoryPage"));
const KnowledgeWorkspacePage = lazy(() => import("../pages/KnowledgeWorkspacePage"));

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
);

const AppRouter = () => (
  <Routes>
    <Route path={APP_ROUTES.login} element={withSuspense(<LoginPage />)} />
    <Route element={<AuthenticatedLayout />}>
      <Route path={APP_ROUTES.dashboard} element={withSuspense(<Dashboard />)} />
      <Route
        path={APP_ROUTES.dashboardDiscipline}
        element={withSuspense(<Dashboard />)}
      />
      <Route path={APP_ROUTES.chat} element={withSuspense(<ChatPage />)} />
      <Route path={APP_ROUTES.chatDiscipline} element={withSuspense(<ChatPage />)} />
      <Route path={APP_ROUTES.chatModule} element={withSuspense(<ChatPage />)} />
      <Route
        path={APP_ROUTES.engineeringHub}
        element={withSuspense(<EngineeringHubPage />)}
      />
      <Route
        path={APP_ROUTES.engineeringHubSection}
        element={withSuspense(<EngineeringHubPage />)}
      />
      <Route
        path={APP_ROUTES.engineering}
        element={withSuspense(<EngineeringDomainsPage />)}
      />
      <Route path={APP_ROUTES.learning} element={withSuspense(<LearningHubPage />)} />
      <Route path={APP_ROUTES.documents} element={withSuspense(<DocumentsPage />)} />
      <Route
        path={APP_ROUTES.engineeringTools}
        element={withSuspense(<EngineeringToolsPage />)}
      />
      <Route
        path="/tools"
        element={<Navigate to={APP_ROUTES.engineeringTools} replace />}
      />
      <Route
        path={APP_ROUTES.subscription}
        element={withSuspense(<SubscriptionPage />)}
      />
      <Route path={APP_ROUTES.wallet} element={withSuspense(<WalletPage />)} />
      <Route
        path={APP_ROUTES.notifications}
        element={withSuspense(<NotificationsPage />)}
      />
      <Route path={APP_ROUTES.settings} element={withSuspense(<SettingsPage />)} />
      <Route path={APP_ROUTES.profile} element={withSuspense(<ProfilePage />)} />
      <Route path={APP_ROUTES.help} element={withSuspense(<HelpPage />)} />
      <Route path={APP_ROUTES.search} element={withSuspense(<SearchPage />)} />
      <Route
        path={APP_ROUTES.decisionIntelligence}
        element={withSuspense(<DecisionIntelligencePage />)}
      />
      <Route
        path={APP_ROUTES.standardsIntelligence}
        element={withSuspense(<StandardsIntelligencePage />)}
      />
      <Route
        path={APP_ROUTES.knowledgeGraph}
        element={withSuspense(<KnowledgeGraphPage />)}
      />
      <Route
        path={APP_ROUTES.engineeringMemory}
        element={withSuspense(<EngineeringMemoryPage />)}
      />
      <Route
        path={APP_ROUTES.knowledgeWorkspace}
        element={withSuspense(<KnowledgeWorkspacePage />)}
      />
      <Route
        path={APP_ROUTES.knowledgeDiscipline}
        element={withSuspense(<KnowledgeWorkspacePage />)}
      />
      <Route
        path={APP_ROUTES.pmis}
        element={withSuspense(
          <PlaceholderPage
            title="PMIS"
            description="PMIS workflows and enterprise integrations will appear here."
          />
        )}
      />
      <Route
        path={APP_ROUTES.app}
        element={<Navigate to={getLastSidebarRoute()} replace />}
      />
      <Route path="*" element={withSuspense(<NotFoundPage />)} />
    </Route>
    <Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
  </Routes>
);

export default AppRouter;
