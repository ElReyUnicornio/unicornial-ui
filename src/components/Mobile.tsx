import { useState, useEffect, type ReactNode } from 'react';

interface MobilePortraitOnlyProps {
  children: ReactNode;
}

const MobileOnly = ({ children }: MobilePortraitOnlyProps) => {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const checkMobilePortrait = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsMobilePortrait(isPortrait);
    };

    checkMobilePortrait();
    window.addEventListener('resize', checkMobilePortrait);
    
    return () => window.removeEventListener('resize', checkMobilePortrait);
  }, []);

  return isMobilePortrait ? <>{children}</> : null;
};

export { MobileOnly };