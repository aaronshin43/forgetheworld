import React, { useState, useEffect } from 'react';
import { SKILL_DURATIONS, SKILL_CONFIGS, MONSTER_LIST, BACKGROUND_LIST } from '../constants/assetRegistry';
import { useGameStore } from '../store/gameStore';

export const DebugPanel = () => {
    const { addEffect, triggerCharacterAttack, spawnWave, clearMonsters, currentBackground, setBackground } = useGameStore();

    // ...

    <button
        onClick={() => spawnWave(1, selectedMonster)}
        className="flex-1 bg-green-600/30 hover:bg-green-600/50 text-xs py-2 rounded transition-colors border border-green-500/30 text-green-200"
    >
        Spawn Wave (1)
    </button>

    const [isOpen, setIsOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(Object.keys(SKILL_DURATIONS)[0]);
    const [selectedMonster, setSelectedMonster] = useState(MONSTER_LIST[0]);
    const [config, setConfig] = useState({ x: 50, y: 50, scale: 1.0 });

    useEffect(() => {
        if (SKILL_CONFIGS[selectedSkill]) {
            setConfig(SKILL_CONFIGS[selectedSkill]);
        } else {
            setConfig({ x: 50, y: 50, scale: 1.0 });
        }
    }, [selectedSkill]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-20 right-4 z-[9999] bg-gray-800/80 text-white text-xs px-2 py-1 rounded border border-gray-600 shadow-md backdrop-blur-sm hover:bg-gray-700 font-mono"
            >
                DEBUG
            </button>
        );
    }

    return (
        <div className="absolute top-16 right-4 z-[9999] bg-gray-900/95 text-white p-4 rounded-lg border border-gray-700 w-64 backdrop-blur-md shadow-2xl font-mono overflow-y-auto max-h-[80vh]">
            <div className="flex justify-end items-center mb-2">
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 bg-white/10 rounded-full w-6 h-6 flex items-center justify-center">✕</button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] text-gray-400 block mb-1 font-bold tracking-wider">BACKGROUND</label>
                    <select
                        value={currentBackground}
                        onChange={(e) => setBackground(e.target.value)}
                        className="w-full bg-black/50 border border-gray-600 rounded text-xs p-1.5 text-white mb-2"
                    >
                        {BACKGROUND_LIST.map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                </div>

                <hr className="border-gray-700" />

                <div>
                    <label className="text-[10px] text-gray-400 block mb-1 font-bold tracking-wider">CHARACTER</label>
                    <button
                        onClick={triggerCharacterAttack}
                        className="w-full bg-blue-600/30 hover:bg-blue-600/50 text-xs py-2 rounded transition-colors border border-blue-500/30"
                    >
                        Trigger Random Attack
                    </button>
                </div>

                <hr className="border-gray-700" />

                <div>
                    <label className="text-[10px] text-gray-400 block mb-1 font-bold tracking-wider">SKILL EFFECTS</label>
                    <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="w-full bg-black/50 border border-gray-600 rounded text-xs p-1.5 text-white mb-2"
                    >
                        {Object.keys(SKILL_DURATIONS).map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div>
                            <label className="text-gray-500 block">X %</label>
                            <input
                                type="number"
                                value={config.x}
                                onChange={(e) => setConfig({ ...config, x: Number(e.target.value) })}
                                className="w-full bg-black/50 border border-gray-600 rounded p-1 text-center"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 block">Y %</label>
                            <input
                                type="number"
                                value={config.y}
                                onChange={(e) => setConfig({ ...config, y: Number(e.target.value) })}
                                className="w-full bg-black/50 border border-gray-600 rounded p-1 text-center"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-gray-500 block mb-1">Scale ({config.scale.toFixed(1)}x)</label>
                            <input
                                type="range"
                                min="0.5" max="3.0" step="0.1"
                                value={config.scale}
                                onChange={(e) => setConfig({ ...config, scale: Number(e.target.value) })}
                                className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => addEffect(selectedSkill, config)}
                        className="w-full mt-2 bg-red-600/30 hover:bg-red-600/50 text-xs py-2 rounded transition-colors font-bold border border-red-500/30 text-red-200"
                    >
                        PLAY EFFECT
                    </button>
                </div>

                <hr className="border-gray-700" />

                <div>
                    <label className="text-[10px] text-gray-400 block mb-1 font-bold tracking-wider">MONSTERS</label>
                    <select
                        value={selectedMonster}
                        onChange={(e) => setSelectedMonster(e.target.value)}
                        className="w-full bg-black/50 border border-gray-600 rounded text-xs p-1.5 text-white mb-2"
                    >
                        {MONSTER_LIST.map(monster => (
                            <option key={monster} value={monster}>{monster}</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={() => spawnWave(1, selectedMonster)}
                            className="flex-1 bg-green-600/30 hover:bg-green-600/50 text-xs py-2 rounded transition-colors border border-green-500/30 text-green-200"
                        >
                            Spawn Wave (1)
                        </button>
                        <button
                            onClick={clearMonsters}
                            className="flex-1 bg-gray-600/30 hover:bg-gray-600/50 text-xs py-2 rounded transition-colors border border-gray-500/30"
                        >
                            Clear
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
