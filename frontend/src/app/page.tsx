'use client';

import React from 'react';
import { BattleStage } from '../views/BattleStage';
import { CommandCenter } from '../views/CommandCenter';
import { CameraView } from '../components/CameraView';
import { GameMenu } from '../components/GameMenu';
import { IntroScreen } from '../views/IntroScreen';
import { DebugPanel } from '../components/DebugPanel';
import { AnalysisOverlay } from '../views/AnalysisOverlay';
import { ResultOverlay } from '../views/ResultOverlay';
import { AssetPreloader } from '../components/AssetPreloader';
import { useGameStore } from '../store/gameStore';
import { useBGM } from '../hooks/useBGM';

export default function Home() {
  const { viewMode, appMode, isLoading, loadingProgress } = useGameStore();

  // BGM: Starts at Intro, persists (or stops if we want separate tracks)
  // For now, playing 'bgm.mp3' globally once loaded.
  useBGM('/skill_sound/bgm.mp3', {
    enabled: !isLoading, // Start after loading 
    volume: 0.3
  });

  const renderContent = () => {
    // 1. Loading Screen
    if (isLoading) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-orange-400 font-bold text-xl tracking-widest animate-pulse">
              LOADING RESOURCE...
            </span>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full bg-orange-500 transition-all duration-200 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-gray-500 text-sm font-mono">{loadingProgress}%</span>
          </div>
        </div>
      );
    }

    // 2. Intro Screen
    if (appMode === 'intro') {
      return <IntroScreen />;
    }

    // 3. Game View
    return (
      <>
        {/* Battle Stage */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 shrink-0 ${viewMode === 'camera'
            ? 'h-[40%]'
            : 'h-1/2 max-h-[700px]:h-[40%] max-h-[600px]:h-[35%]'
            }`}
        >
          <BattleStage />
        </div>

        {/* Bottom Panel */}
        <div
          className={`w-full transition-all duration-300 min-h-0 ${viewMode === 'camera'
            ? 'h-[60%]'
            : 'h-1/2 max-h-[700px]:h-[60%] max-h-[600px]:h-[65%]'
            }`}
        >
          {viewMode === 'camera' ? <CameraView /> : <CommandCenter />}
        </div>
      </>
    );
  };

  return (
    // Letterbox Container
    <main className="flex h-screen w-full min-h-0 items-center justify-center bg-zinc-900 overflow-hidden">
      {/* Asset Preloader (Invisible) */}
      <AssetPreloader />

      {/* Mobile Aspect Ratio Wrapper */}
      <div className="relative w-full h-full min-h-0 max-w-[430px] max-h-[932px] bg-black shadow-2xl overflow-hidden flex flex-col border-x border-zinc-800">

        {renderContent()}

        {/* Global Overlays (Only show when not loading and not intro) */}
        {!isLoading && (
          <>
            {useGameStore.getState().isAnalyzing && <AnalysisOverlay />}
            <ResultOverlay />

            {/* Game Menu - Visible in Game/Dev modes */}
            {appMode !== 'intro' && <GameMenu />}

            {/* Debug Panel only in Dev Mode */}
            {appMode === 'dev' && <DebugPanel />}
          </>
        )}
      </div>
    </main>
  );
}


