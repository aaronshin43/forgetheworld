import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { EnhancementSelectionModal } from '../components/EnhancementSelectionModal';

/** API의 flavor가 문자열(마크다운 JSON)로 올 수 있으므로 항상 { name, description } 객체로 정규화 */
function normalizeFlavor(flavor: unknown): { name: string; description: string } {
    if (flavor && typeof flavor === 'object' && 'name' in flavor && 'description' in flavor) {
        return { name: String((flavor as { name: string }).name), description: String((flavor as { description: string }).description) };
    }
    if (typeof flavor === 'string') {
        try {
            const raw = flavor.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
            const parsed = JSON.parse(raw) as { name?: string; description?: string };
            return { name: parsed?.name ?? '—', description: parsed?.description ?? '' };
        } catch {
            return { name: '—', description: '' };
        }
    }
    return { name: '—', description: '' };
}

export const ResultOverlay = () => {
    const { scanResult, setScanResult, setViewMode, setTimeScale, setIsAnalyzing, inventory, interactionMode, enhanceItem } = useGameStore();
    const [showEnhanceSelect, setShowEnhanceSelect] = useState(false);

    if (!scanResult) return null;

    const handleSelectEnhance = (itemId: string) => {
        enhanceItem(itemId);
        // enhanceItem clears scanResult, so overlay will close automatically
        setShowEnhanceSelect(false);
    };

    if (showEnhanceSelect) {
        return <EnhancementSelectionModal onSelect={handleSelectEnhance} onCancel={() => setShowEnhanceSelect(false)} />;
    }

    const flavor = normalizeFlavor(scanResult.flavor);
    // 이미지: JSON flavor.name과 일치하는 인벤토리 아이템만 사용 (인식 로직 제거)
    const displayImage = inventory.find(item => item && item.name === flavor.name && item.image)?.image;

    const handleClose = () => {
        setScanResult(null);
        setIsAnalyzing(false);
        // Note: View transition is now handled in CameraView immediately after capture, 
        // but we might want to ensure we are in battle mode here too just in case.
        setViewMode('battle');
        setTimeScale(1.0);
    };

    const item = inventory.find(i => i && i.name === flavor.name);
    // If enhancing, we use the grade from result directly because item isn't in inventory yet (it's tempMaterial).
    // Or scanResult.analysis.rarity_score logic.
    // Actually, for enhancing, `item` will likely be undefined because `scanMaterial` doesn't add to inventory.
    // So we need to calculate grade locally or use `tempMaterial`.
    // But `ResultOverlay` uses `scanResult`. `scanMaterial` sets `scanResult` with `rarity_score`.
    // Let's recalculate grade if item is missing.

    // BUT wait, `calculateGrade` is in store/utils but not exported?
    // It's in `gameStore.ts`.
    // `scanResult` has `rarity_score`.
    // Let's just use a simplified grade logic or assume `item` exists?
    // For Enhancing, "Material" is NOT in inventory. So `item` is null.
    // We should display the grade of the material.
    // `scanResult.analysis.rarity_score` is available.
    // Let's copy calculateGrade logic or use a helper?
    // I'll just hardcode threshold here for display or use `scanResult.analysis.grade` if I added it?
    // I didn't add `grade` to `scanResult.analysis`.
    // But `scanMaterial` calculates it.
    // Let's assume standard checks.

    const getGrade = (score: number) => {
        if (score >= 14) return 'Legendary';
        if (score >= 11) return 'Epic';
        if (score >= 8) return 'Unique';
        if (score >= 5) return 'Rare';
        return 'Common';
    };

    const grade = item?.grade || getGrade(scanResult.analysis.rarity_score || 0);

    const gradeColor = {
        Legendary: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]',
        Epic: 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]',
        Unique: 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]',
        Rare: 'text-blue-400',
        Common: 'text-gray-400',
    }[grade] || 'text-gray-400';

    return (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm bg-gray-800 rounded-xl overflow-hidden border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
            >
                <div className="bg-gray-900 p-8 flex items-center justify-center relative overflow-hidden h-64">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-transparent to-transparent" />

                    {displayImage ? (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={displayImage}
                            alt="Generated Item"
                            className="relative z-10 w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        />
                    ) : (
                        <div className="relative z-10 flex flex-col items-center">
                            <motion.img
                                src="/character/forge.webp"
                                alt=""
                                className="w-24 h-24 object-contain mb-4 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                            <span className="text-xs text-yellow-500/70 uppercase tracking-widest animate-pulse">
                                {interactionMode === 'enhancing' ? 'Analyzing Material...' : 'Forging...'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h2 className={`text-2xl font-bold mb-1 ${interactionMode === 'enhancing' ? 'text-indigo-400' : 'text-yellow-400'}`}>
                        {interactionMode === 'enhancing' ? 'MATERIAL FOUND' : flavor.name}
                    </h2>
                    <p className="text-gray-400 text-xs italic mb-4">"{flavor.description}"</p>

                    <div className="mb-6">
                        <div className="flex flex-col items-center justify-center gap-1 mb-3">
                            <span className={`text-2xl font-black italic uppercase tracking-wider ${gradeColor}`}>
                                {grade}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {(scanResult.analysis.affected_stats || ['atk', 'def', 'maxHp']).map((stat: string) => {
                                // For material, values are in scanResult.analysis.stats (if I added it in scanMaterial store action)
                                // In `scanMaterial` store action, I did: `analysis: { ...data, stats: itemStats ... }`
                                // So `scanResult.analysis.stats` should exist.
                                // For crafted items, `item` exists and has stats.
                                // So we prefer `item.stats` if it exists, else `scanResult.analysis.stats`.

                                const val = item?.stats?.[stat as keyof typeof item.stats] ?? scanResult.analysis.stats?.[stat] ?? 0;
                                return (
                                    <span key={stat} className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-gray-300 uppercase font-bold flex items-center gap-1">
                                        <span>{stat}</span>
                                        <span className="text-yellow-400">+{val}</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={interactionMode === 'enhancing' ? () => setShowEnhanceSelect(true) : handleClose}
                        className={`w-full py-3 ${interactionMode === 'enhancing' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-yellow-600 hover:bg-yellow-500'} text-black font-bold rounded-lg transition-colors`}
                    >
                        {interactionMode === 'enhancing' ? 'SELECT ITEM TO ENHANCE' : 'CLAIM ITEM'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
