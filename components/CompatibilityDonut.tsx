'use client';

import { getCompatibilityVariant, DONUT_CHART_COLORS } from '@/lib/constants';

interface CompatibilityDonutProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function CompatibilityDonut({
  score,
  size = 'md',
  showLabel = true,
}: CompatibilityDonutProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  const radius = size === 'sm' ? 18 : size === 'md' ? 22 : 28;
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 5 : 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;
  
  const variant = getCompatibilityVariant(normalizedScore);
  
  const colorVariant = ['red', 'orange', 'yellow', 'green'].includes(variant) 
    ? variant as keyof typeof DONUT_CHART_COLORS 
    : 'green';
  
  const colors = DONUT_CHART_COLORS[colorVariant];
  
  const sizeConfig = {
    sm: {
      svg: 44,
      text: 'text-[10px]',
      container: 'w-11 h-11'
    },
    md: {
      svg: 54,
      text: 'text-xs',
      container: 'w-[54px] h-[54px]'
    },
    lg: {
      svg: 66,
      text: 'text-sm',
      container: 'w-[66px] h-[66px]'
    }
  };
  
  const config = sizeConfig[size];
  const svgSize = config.svg;
  const center = svgSize / 2;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${config.container}`}>
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90"
        >
          <circle
            cx={center}
            cy={center}
            r={normalizedRadius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          <circle
            cx={center}
            cy={center}
            r={normalizedRadius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.1))'
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.text} ${colors.text}`}>
            {normalizedScore}%
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Compatib.
        </span>
      )}
    </div>
  );
}
