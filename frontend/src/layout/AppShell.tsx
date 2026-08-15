import React, { type ReactNode } from "react";



import GlobalBreadcrumb from "../components/GlobalBreadcrumb";

import Sidebar from "../components/Sidebar";

import { getAppShellGridColumns } from "./appShellLayout";

import PageTransition from "./PageTransition";

import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";



interface AppShellProps {

  children: ReactNode;

  header?: ReactNode;

  showBreadcrumb?: boolean;

}



const AppShell: React.FC<AppShellProps> = ({

  children,

  header,

  showBreadcrumb = true,

}) => {

  const { isAppNavCollapsed } = useSarathiWorkspace();



  return (

    <div

      className="grid h-screen min-h-0 overflow-hidden bg-slate-950 transition-[grid-template-columns] duration-[250ms] ease-in-out"

      style={{

        gridTemplateColumns: getAppShellGridColumns(isAppNavCollapsed, false),

        gridTemplateRows: header || showBreadcrumb ? "auto 1fr" : "1fr",

      }}

    >

      <div className="min-h-0 overflow-hidden" style={{ gridRow: "1 / -1" }}>

        <Sidebar />

      </div>



      {header || showBreadcrumb ? (

        <div

          className="min-w-0 border-b border-slate-800 bg-slate-900"

          style={{ gridColumn: "2" }}

        >

          {showBreadcrumb ? <GlobalBreadcrumb /> : null}

          {header}

        </div>

      ) : null}



      <main

        data-scroll-container="main"

        className="min-h-0 min-w-0 overflow-y-auto bg-slate-950"

        style={{

          gridColumn: "2",

          gridRow: header || showBreadcrumb ? "2" : "1",

        }}

      >

        <PageTransition>{children}</PageTransition>

      </main>

    </div>

  );

};



export default AppShell;

