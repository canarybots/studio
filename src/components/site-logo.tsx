import { Activity } from 'lucide-react';
import type { SVGProps } from 'react';

// Using Activity icon as a placeholder for a physiotherapy related logo
const DefaultLogo = (props: SVGProps<SVGSVGElement>) => (
    <Activity {...props} />
);


interface SiteLogoProps {
  className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <DefaultLogo className="h-8 w-8" />
      <span className="text-xl font-semibold">Physio Insights</span>
    </div>
  );
}
