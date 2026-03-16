'use client';

import StretchTimer from '@/components/StretchTimer';

interface Props {
  holdTime: string;
  stretchName: string;
}

export default function StretchDetailClient({ holdTime, stretchName }: Props) {
  return (
    <StretchTimer
      defaultSeconds={parseInt(holdTime) || 30}
      stretchName={stretchName}
    />
  );
}
