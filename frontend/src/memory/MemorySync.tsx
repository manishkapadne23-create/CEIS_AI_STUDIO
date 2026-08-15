import { useEffect } from "react";

import { hydrateEngineeringMemory } from "./memoryEngine";
import { hydrateProjectStorage } from "../projects/projectStorage";

const MemorySync: React.FC = () => {
  useEffect(() => {
    hydrateProjectStorage();
    hydrateEngineeringMemory();
  }, []);

  return null;
};

export default MemorySync;
