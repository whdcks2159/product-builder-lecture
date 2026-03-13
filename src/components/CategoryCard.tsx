'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Exercise } from '@/types';

export default function CategoryCard({ exercise }: { exercise: Exercise }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/exercise/${exercise.slug}`}
      className="flex items-center gap-3 bg-white rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        border: `1px solid ${hovered ? exercise.accentColor : '#e5e7eb'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ backgroundColor: exercise.lightBg }}
      >
        {exercise.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{exercise.name}</p>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">{exercise.shortDesc}</p>
      </div>
    </Link>
  );
}
