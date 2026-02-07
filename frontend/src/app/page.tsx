'use client';

import React from 'react';
import { BattleStage } from '../views/BattleStage';
import { CommandCenter } from '../views/CommandCenter';
import { CameraView } from '../components/CameraView';
import { IntroScreen } from '../views/IntroScreen';
import { DebugPanel } from '../components/DebugPanel';
import { useGameStore } from '../store/gameStore';

export default function Home() {
  const { viewMode, appMode } = useGameStore();

  const renderContent = () => {
    if (appMode === 'intro') {
      return <IntroScreen />;
    }

    if (viewMode === 'camera') {
      return <CameraView />;
    }

    return (
      <>
        <BattleStage />
        <CommandCenter />
      </>
    );
  };

  return (
    // Letterbox Container
    <main className="flex h-screen w-full items-center justify-center bg-zinc-900">
      {/* Mobile Aspect Ratio Wrapper */}
      <div className="relative w-full h-full max-w-[430px] max-h-[932px] bg-black shadow-2xl overflow-hidden flex flex-col border-x border-zinc-800">

        {renderContent()}

        {/* Debug Panel only in Dev Mode */}
        {appMode === 'dev' && <DebugPanel />}
      </div>
    </main>
  );
}
