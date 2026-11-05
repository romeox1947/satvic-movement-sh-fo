'use client';

import { useEffect, useState } from 'react';
import { Iphone } from '@/components/ui/iphone';

export default function DesktopPreview({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 700px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (!isDesktop) return children;

  return (
    <div className="desktop-phone-stage">
      <div className="desktop-phone">
        <iframe className="desktop-phone-screen" src="/" title="Satvic mobile app preview" />
        <Iphone className="desktop-phone-bezel" />
      </div>
    </div>
  );
}
