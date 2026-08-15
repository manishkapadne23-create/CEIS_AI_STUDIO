import React from "react";

interface SarathiChatWelcomeProps {
  disciplineName?: string | null;
}

const SarathiChatWelcome: React.FC<SarathiChatWelcomeProps> = ({
  disciplineName,
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl text-white">
        ⚙
      </div>
      <h2 className="text-2xl font-bold text-white sm:text-3xl">
        Sarathi AI Engineering Workspace
      </h2>
      <p className="mt-2 max-w-lg text-sm text-cyan-300 sm:text-base">
        {disciplineName
          ? `Working in ${disciplineName}. Use the navigator, assistant, or chat to continue.`
          : "Select a discipline in the Engineering Navigator to open your workspace."}
      </p>
      <p className="mt-4 max-w-xl text-sm text-slate-400">
        AI Chat stays at the center of your workflow. Browse standards,
        calculators, tools, and workflows from the navigator while Sarathi AI
        assists with engineering decisions.
      </p>
    </div>
  );
};

export default SarathiChatWelcome;
