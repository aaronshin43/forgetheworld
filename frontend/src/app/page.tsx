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
import { useGameStore } from '../store/gameStore';

export default function Home() {
  const { viewMode, appMode } = useGameStore();

  const renderContent = () => {
    if (appMode === 'intro') {
      return <IntroScreen />;
    }

    return (
      <>
        {/* Battle Stage – 작은 화면에서는 비율 축소, 인벤토리 꽉 차도록 */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 shrink-0 ${
            viewMode === 'camera'
              ? 'h-[40%]'
              : 'h-1/2 max-h-[700px]:h-[40%] max-h-[600px]:h-[35%]'
          }`}
        >
          <BattleStage />
        </div>

        {/* Bottom Panel (인벤토리/카메라) – 작은 화면에서 비율 확대해 잘리지 않게 */}
        <div
          className={`w-full transition-all duration-300 min-h-0 ${
            viewMode === 'camera'
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
    // Letterbox Container – 인트로/게임 모두 스크롤 없이 화면 비율에 맞게
    <main className="flex h-screen w-full min-h-0 items-center justify-center bg-zinc-900 overflow-hidden">
      {/* Mobile Aspect Ratio Wrapper */}
      <div className="relative w-full h-full min-h-0 max-w-[430px] max-h-[932px] bg-black shadow-2xl overflow-hidden flex flex-col border-x border-zinc-800">

        {renderContent()}

        {/* Global Overlays */}
        {useGameStore.getState().isAnalyzing && <AnalysisOverlay />}
        <ResultOverlay />

        {/* Game Menu (Hamburger) - Visible in Game/Dev modes */}
        {appMode !== 'intro' && <GameMenu />}

        {/* Debug Panel only in Dev Mode */}
        {appMode === 'dev' && <DebugPanel />}
      </div>
    </main>
  );
}
