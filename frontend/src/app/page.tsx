'use client';

import { useGameLoop } from '@/hooks/useGameLoop';
import { BattleStage } from '@/views/BattleStage';
import { CommandCenter } from '@/views/CommandCenter';

import { useGameStore } from '@/store/gameStore';
import { CameraView } from '@/components/CameraView';
import { AnalysisOverlay } from '@/views/AnalysisOverlay';
import { ResultOverlay } from '@/views/ResultOverlay';
import { DebugPanel } from '@/components/DebugPanel';

export default function Home() {
  useGameLoop();
  const { viewMode, isAnalyzing, scanResult } = useGameStore();

  return (
    <div className="min-h-[100dvh] w-full bg-neutral-900 flex justify-center overflow-hidden">
      <main className="flex flex-col h-[100dvh] w-full max-w-[480px] bg-black relative shadow-2xl overflow-hidden select-none touch-none overscroll-none border-x border-white/5">
        <BattleStage />
        {viewMode === 'battle' ? <CommandCenter /> : <CameraView />}

        {/* Overlays */}
        {isAnalyzing && <AnalysisOverlay />}
        {scanResult && <ResultOverlay />}

        {/* Debug Panel - Global Overlay */}
        <DebugPanel />
      </main>
    </div>
  );
}
