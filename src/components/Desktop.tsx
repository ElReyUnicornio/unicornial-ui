import type { ReactNode } from "react";
import { useState, useEffect } from 'react';

interface NonMobilePortraitOnlyProps {
  children: ReactNode;
}

const DesktopOnly = ({ children }: NonMobilePortraitOnlyProps) => {
  const [isNonMobilePortrait, setIsNonMobilePortrait] = useState(false);

  useEffect(() => {
    const checkNonMobilePortrait = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsNonMobilePortrait(!isPortrait);
    };

    checkNonMobilePortrait();
    window.addEventListener('resize', checkNonMobilePortrait);
    
    return () => window.removeEventListener('resize', checkNonMobilePortrait);
  }, []);

  return isNonMobilePortrait ? <>{children}</> : null;
};

export { DesktopOnly };
