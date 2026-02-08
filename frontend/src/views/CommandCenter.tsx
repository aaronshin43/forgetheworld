import React from 'react';
import { useGameStore } from '../store/gameStore';

/** 레퍼런스: inventory.webp = 전체 프레임(제목+슬롯 영역+버튼 영역), itembox = 슬롯 6개, craft/skill/enhance = 하단 버튼 3개 */
const BTN_CLASS =
    'relative w-full min-w-0 h-full min-h-0 flex items-center justify-center active:scale-95 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded overflow-hidden';

export const CommandCenter = () => {
    const { inventory } = useGameStore();

    return (
        <div className="h-full flex flex-col justify-center items-center border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-20 overflow-hidden min-w-0 relative bg-zinc-900">
            {/* 배경 + 오버레이를 같은 비율 박스 안에 (레퍼런스 비율 3:4 → 슬롯/버튼가 배경과 정확히 겹치도록) */}
            <div
                className="w-full max-w-full h-full max-h-full flex flex-col min-h-0 relative"
                style={{ aspectRatio: '3/4' }}
            >
                {/* 전체 프레임 배경 – 이 박스 안에서만 보이게, 잘리지 않게 */}
                <div
                    className="absolute inset-0 bg-no-repeat bg-center bg-cover"
                    style={{ backgroundImage: 'url(/ui/inventory.webp)' }}
                    aria-hidden
                />
                {/* 오버레이: 제목 여백 + 슬롯 + 버튼 (슬롯을 살짝 위로) */}
                <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full max-w-full min-w-0 p-[8%] sm:p-[10%] pt-[8%]">
                    <div className="flex-shrink-0 h-[2%] min-h-0" aria-hidden />

                    <div
                        className="flex-1 min-h-0 w-full max-w-full grid place-content-center place-items-center -mt-0.5"
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
                            className="group relative w-full h-full min-w-0 min-h-0 aspect-square max-w-full max-h-full flex items-center justify-center cursor-pointer overflow-hidden"
                        >
                            {/* 1층: 아이템(생성된 이미지/이름) 또는 빈 슬롯 anvil – 박스 뒤에 보이게 */}
                            <div className="absolute inset-0 z-0 flex items-center justify-center p-[8%]">
                                {item ? (
                                    <>
                                        {item.status === 'loading' ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                                                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        ) : null}
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain pointer-events-none" />
                                        ) : (
                                            <span className="text-xs font-bold text-amber-200 drop-shadow-md text-center px-1 truncate w-full">
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
                            {/* 2층: itembox 프레임 – 앞에 올려서 아이템이 박스 안에 들어간 것처럼 */}
                            <img
                                src="/ui/itembox.webp"
                                alt=""
                                className="absolute inset-0 z-10 w-full h-full object-contain pointer-events-none"
                                aria-hidden
                            />
                        </div>
                    ))}
                </div>

                {/* 하단 버튼 영역: 버튼만 더 아래로 (mt-auto + translateY) */}
                <div
                    className="flex-shrink-0 w-full max-w-full min-w-0 grid gap-2 sm:gap-3 py-2 mt-auto translate-y-[1.05rem] sm:translate-y-[1.3rem]"
                    style={{
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        height: 'clamp(5rem, 38%, 8rem)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            useGameStore.getState().setViewMode('camera');
                            useGameStore.getState().setTimeScale(0.1);
                            useGameStore.getState().setScanMode('craft');
                        }}
                        className={BTN_CLASS}
                        aria-label="Craft"
                    >
                        <img src="/ui/craft_btn.webp" alt="Craft" className="w-full h-full object-contain pointer-events-none" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            useGameStore.getState().setViewMode('camera');
                            useGameStore.getState().setTimeScale(0.1);
                            useGameStore.getState().setScanMode('skill');
                        }}
                        className={BTN_CLASS}
                        aria-label="Skill"
                    >
                        <img src="/ui/skill_btn.webp" alt="Skill" className="w-full h-full object-contain pointer-events-none" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            useGameStore.getState().setViewMode('camera');
                            useGameStore.getState().setTimeScale(0.1);
                            useGameStore.getState().setScanMode('enhance');
                        }}
                        className={BTN_CLASS}
                        aria-label="Enhance"
                    >
                        <img src="/ui/enhance_btn.webp" alt="Enhance" className="w-full h-full object-contain pointer-events-none" />
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};
