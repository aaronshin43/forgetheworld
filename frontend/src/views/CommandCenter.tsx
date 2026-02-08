import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { InventoryItem } from '../store/gameStore';
import { ItemDetailModal } from '../components/ItemDetailModal';

/** Reference: inventory.webp = Full frame (Title + Slots + Buttons), itembox = 6 slots, craft/skill/enhance = Bottom 3 buttons */
const BTN_CLASS =
    'relative w-full min-w-0 h-full min-h-0 flex items-center justify-center active:scale-95 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded overflow-hidden';

export const CommandCenter = () => {
    const { inventory } = useGameStore();
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const hasItems = inventory.some(item => item !== null);

    return (
        <div className="h-full flex flex-col justify-center items-center border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-20 overflow-hidden min-w-0 relative bg-zinc-900">
            {/* Maintain 3:4 aspect ratio to ensure slots/buttons align with the background image */}
            <div
                className="w-full max-w-full h-full max-h-full flex flex-col min-h-0 relative"
                style={{ aspectRatio: '3/4' }}
            >
                {/* Full frame background - contained within the box */}
                <div
                    className="absolute inset-0 bg-no-repeat bg-center bg-cover"
                    style={{ backgroundImage: 'url(/ui/inventory.webp)' }}
                    aria-hidden
                />
                {/* Overlay: Title spacing + Slots + Buttons */}
                <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full max-w-full min-w-0 p-[8%] sm:p-[10%] pt-[8%]">
                    <div className="flex-shrink-0 h-[2%] min-h-0" aria-hidden />

                    <div
                        className="flex-1 min-h-0 w-full max-w-full grid place-content-center place-items-center -mt-0.5 overflow-hidden min-w-0"
                        style={{
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
                            columnGap: '6%',
                            rowGap: 0,
                        }}
                    >
                        {inventory.map((item, index) => (
                            <div
                                key={index}
                                role={item ? 'button' : undefined}
                                tabIndex={item ? 0 : undefined}
                                onClick={() => item && setSelectedItem(item)}
                                onKeyDown={(e) => item && (e.key === 'Enter' || e.key === ' ') && setSelectedItem(item)}
                                className={`group relative w-full h-full min-w-0 min-h-0 aspect-square max-w-full max-h-full flex items-center justify-center overflow-hidden rounded-[0.25rem] ${item ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400' : ''}`}
                            >
                                {/* Layer 1: Item (Image/Name) or Empty Slot (Anvil) - rendered behind the box */}
                                <div className="absolute inset-0 z-0 flex items-center justify-center p-[8%] overflow-hidden">
                                    {item ? (
                                        <>
                                            {item.status === 'loading' ? (
                                                <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden">
                                                    <div className="w-6 h-6 flex-shrink-0 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            ) : item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain pointer-events-none" />
                                            ) : (
                                                <span className="text-xs font-bold text-amber-200 drop-shadow-md text-center px-1 truncate w-full min-w-0 block">
                                                    {item.name}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <img
                                            src="/ui/anvil.webp"
                                            alt="Empty Slot"
                                            className="w-1/2 h-1/2 object-contain opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-300 pointer-events-none"
                                        />
                                    )}
                                </div>
                                {/* Layer 2: Itembox Frame - rendered on top to simulate item inside box */}
                                <img
                                    src="/ui/itembox.webp"
                                    alt=""
                                    className="absolute inset-0 z-10 w-full h-full object-contain pointer-events-none"
                                    aria-hidden
                                />
                            </div>
                        ))}
                    </div>

                    {/* Bottom Button Area: Pushed down (mt-auto + translateY) */}
                    <div
                        className="flex-shrink-0 w-full max-w-full min-w-0 grid gap-2 sm:gap-3 py-2 mt-auto translate-y-[1.05rem] sm:translate-y-[1.3rem]"
                        style={{
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            height: 'clamp(5rem, 38%, 8rem)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={useGameStore.getState().startCrafting}
                            className={BTN_CLASS}
                            aria-label="Craft"
                        >
                            <img src="/ui/craft_btn.webp" alt="Craft" className="w-full h-full object-contain pointer-events-none" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                useGameStore.getState().setViewMode('camera');
                                useGameStore.getState().setScanMode('skill');
                            }}
                            className={BTN_CLASS}
                            aria-label="Skill"
                        >
                            <img src="/ui/skill_btn.webp" alt="Skill" className="w-full h-full object-contain pointer-events-none" />
                        </button>
                        <button
                            type="button"
                            onClick={hasItems ? useGameStore.getState().startEnhancement : undefined}
                            disabled={!hasItems}
                            className={`${BTN_CLASS} ${!hasItems ? '!opacity-30 !grayscale !cursor-not-allowed hover:!scale-100 active:!scale-100' : ''}`}
                            aria-label="Enhance"
                            title={!hasItems ? "Craft an item first!" : "Enhance Item"}
                        >
                            <img src="/ui/enhance_btn.webp" alt="Enhance" className="w-full h-full object-contain pointer-events-none" />
                        </button>
                    </div>
                </div>
            </div>

            {selectedItem && (
                <ItemDetailModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
};
