import React from "react";

import { Navigate, Outlet } from "react-router-dom";



import NavigationProgressBar from "../components/NavigationProgressBar";
import PersonalizationSync from "../personalization/PersonalizationSync";
import MemorySync from "../memory/MemorySync";

import { ChatSessionProvider } from "../navigation/ChatSessionContext";

import { WorkspaceNavigationProvider } from "../navigation/WorkspaceNavigationContext";

import { SarathiWorkspaceProvider } from "../sarathi";

import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";



const AuthenticatedLayout: React.FC = () => {

  const token = readPersistedString("token");



  if (!token) {

    return <Navigate to="/" replace />;

  }



  return (

    <SarathiWorkspaceProvider>

      <ChatSessionProvider>

        <WorkspaceNavigationProvider>

          <NavigationProgressBar />
          <PersonalizationSync />
          <MemorySync />
          <Outlet />

        </WorkspaceNavigationProvider>

      </ChatSessionProvider>

    </SarathiWorkspaceProvider>

  );

};



export const getLastSidebarRoute = (): string =>

  readPersistedString(PERSISTED_KEYS.lastSidebarRoute, "/dashboard") ?? "/dashboard";



export default AuthenticatedLayout;

