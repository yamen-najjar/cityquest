'use client';

import dynamic from 'next/dynamic';

// three.js loads only when a 3D element is first shown, in its own chunk.
const Placeholder = ({ className }: { className: string }) => <div className={`${className} animate-pulse rounded-2xl bg-white/5`} aria-hidden="true" />;
export const Artifact3D = dynamic(() => import('../three/Artifact3D'), { ssr: false, loading: () => <Placeholder className="h-56 w-full" /> });
export const Lock3D = dynamic(() => import('../three/Lock3D'), { ssr: false, loading: () => <Placeholder className="h-80 w-full" /> });
export const Map3D = dynamic(() => import('../three/Map3D'), { ssr: false, loading: () => <Placeholder className="h-72 w-full" /> });
export const Cutscene3D = dynamic(() => import('../three/cutscene/Cutscene3D'), { ssr: false, loading: () => <Placeholder className="aspect-video w-full" /> });
