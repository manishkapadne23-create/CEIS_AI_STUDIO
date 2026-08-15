import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const NavigationProgressBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(12);

    const stepOne = window.setTimeout(() => setProgress(55), 80);
    const stepTwo = window.setTimeout(() => setProgress(88), 180);
    const complete = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => setVisible(false), 200);
    }, 320);

    return () => {
      window.clearTimeout(stepOne);
      window.clearTimeout(stepTwo);
      window.clearTimeout(complete);
    };
  }, [location.pathname]);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 bg-transparent">
      <div
        className="h-full bg-cyan-500 transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default NavigationProgressBar;
