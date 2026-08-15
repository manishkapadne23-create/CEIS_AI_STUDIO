import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PRODUCT_BRAND } from './branding/productBrand';
import { EngineeringWorkspaceProvider } from './context/EngineeringWorkspaceContext';
import { KnowledgeModuleProvider } from './knowledge/components/KnowledgeModuleProvider';
import { initializePluginFramework } from './plugins';
import { initializeGovernance } from './governance';
import './styles.css';

document.title = PRODUCT_BRAND.documentTitle;

void initializePluginFramework().catch((error) => {
  console.warn('[PluginFramework] initialization deferred:', error);
});

void initializeGovernance().catch((error) => {
  console.warn('[Governance] initialization deferred:', error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EngineeringWorkspaceProvider>
      <KnowledgeModuleProvider>
        <App />
      </KnowledgeModuleProvider>
    </EngineeringWorkspaceProvider>
  </React.StrictMode>
);
