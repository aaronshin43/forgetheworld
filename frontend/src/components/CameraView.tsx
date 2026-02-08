import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useGameStore } from '../store/gameStore';
import { SKILL_CONFIGS } from '../constants/assetRegistry';

const videoConstraints = {
    facingMode: { ideal: "environment" }
};

export const CameraView = () => {
    const webcamRef = useRef<Webcam>(null);
    const { film, setIsAnalyzing, setScanResult, setTimeScale, useFilm, setInventoryItem, craftItem, inventory, scanMode, interactionMode, scanMaterial, triggerSkill } = useGameStore();

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc && film > 0) {
            // Consume film
            const success = useFilm();
            if (!success) return;

            // Start Analysis
            setIsAnalyzing(true);

            try {
                // 1. Prepare Image
                const res = await fetch(imageSrc);
                const blob = await res.blob();
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

                const formData = new FormData();
                formData.append("file", file);
                formData.append("mode", scanMode || "craft");

                if (interactionMode === 'enhancing') {
                    formData.append("skip_image_generation", "true");
                }

                // 2. Scan Item (Vision + Flavor Text)
                // Return to battle immediately so overlay shows there
                useGameStore.getState().setViewMode('battle');

                const endpoint = scanMode === 'skill'
                    ? "http://localhost:8000/scan-skill"
                    : "http://localhost:8000/scan";

                const response = await fetch(endpoint, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                // SKILL MODE LOGIC
                if (scanMode === 'skill') {
                    setIsAnalyzing(false);
                    const skillName = data.flavor?.name || data.analysis?.item || 'blast';
                    triggerSkill(skillName);
                    return;
                }

                // ENHANCE LOGIC
                if (interactionMode === 'enhancing') {
                    const flavor = data.flavor || { name: data.analysis?.item, description: '' };
                    scanMaterial({
                        name: flavor.name || data.analysis?.item || 'Unknown Material',
                        rarity: data.analysis?.rarity_score || 1,
                        affectedStats: data.analysis?.affected_stats || ['atk', 'def', 'hp'],
                        description: flavor.description
                    });
                    setIsAnalyzing(false);
                    return;
                }

                // CRAFT / ENHANCE LOGIC
                // 3. Add Placeholder to Inventory
                // Find first empty slot or overwrite last? Let's find first empty.
                let targetIndex = inventory.findIndex(item => item === null);
                if (targetIndex === -1) targetIndex = 0; // Overwrite first if full

                const newItemId = Date.now().toString();
                const flavor = data.flavor && typeof data.flavor === 'object'
                    ? { name: data.flavor.name ?? data.analysis?.item, description: data.flavor.description ?? '' }
                    : { name: data.analysis?.item ?? '—', description: '' };

                const rarity = data.analysis?.rarity_score || 1;
                let affectedStats = data.analysis?.affected_stats;

                // Fallback stats if backend fails
                if (!affectedStats || !Array.isArray(affectedStats) || affectedStats.length < 3) {
                    const allStats = ['atk', 'def', 'maxHp', 'spd', 'critRate'];
                    affectedStats = allStats.sort(() => 0.5 - Math.random()).slice(0, 3);
                }

                // Set Loading State & Apply Stats Immediately
                craftItem(targetIndex, {
                    id: newItemId,
                    name: flavor.name || data.analysis?.item || '—',
                    description: flavor.description || undefined,
                    rarity: rarity,
                    affectedStats: affectedStats
                });

                setScanResult(data);
                setIsAnalyzing(false);

                // 4. Trigger Image Generation (Async)
                generateImage(data.flavor.description || data.analysis.item, targetIndex, newItemId);

            } catch (err) {
                console.error("Scan failed", err);
                setIsAnalyzing(false);
                // setTimeScale(0.1); // REMOVED
            }
        }
    }, [webcamRef, film, setIsAnalyzing, setScanResult, setTimeScale, useFilm, inventory]);

    const generateImage = async (prompt: string, index: number, itemId: string) => {
        try {
            const response = await fetch("http://localhost:8000/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });
            const data = await response.json();

            if (data.image) {
                // Update Inventory with Real Image
                // We need to fetch current inventory again to ensure we don't overwrite other changes? 
                // Zustand setInventoryItem handles array copy, but index might be risky if items moved.
                // For this prototype, index locking is acceptable.

                // Check if the item at this index is still the one we created
                const currentItem = useGameStore.getState().inventory[index];
                if (currentItem && currentItem.id === itemId) {
                    useGameStore.getState().setInventoryItem(index, {
                        ...currentItem,
                        image: data.image,
                        status: 'ready'
                    });
                }
            }
        } catch (e) {
            console.error("Image generation failed", e);
            // Could set status to 'error' or keep placeholder
        }
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="object-cover w-full h-full"
            />

            {/* Button Overlay */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center pb-8 z-30 gap-8 pointer-events-auto">
                {/* Cancel Button */}
                <button
                    onClick={() => {
                        useGameStore.getState().setViewMode('battle');
                        // useGameStore.getState().setTimeScale(1.0); // REMOVED
                    }}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white/70 active:bg-white/20 transition-all hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Capture Button */}
                <button
                    onClick={capture}
                    disabled={film <= 0}
                    className={`w-20 h-20 rounded-full border-4 border-white backdrop-blur-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95
            ${film > 0 ? 'bg-white/20 active:bg-white/40' : 'bg-red-500/20 border-red-500/50 cursor-not-allowed'}
          `}
                />

                {/* Spacer for centering */}
                <div className="w-12 h-12" />
            </div>
        </div>
    );
};
