import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useGameStore } from '../store/gameStore';

const videoConstraints = {
    facingMode: { ideal: "environment" }
};

export const CameraView = () => {
    const webcamRef = useRef<Webcam>(null);
    const { film, setIsAnalyzing, setScanResult, setTimeScale, useFilm } = useGameStore();

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc && film > 0) {
            // Consume film
            const success = useFilm();
            if (!success) return;

            // Start Analysis
            setIsAnalyzing(true);
            setTimeScale(0.0); // Stop time

            try {
                // Convert base64 to blob
                const res = await fetch(imageSrc);
                const blob = await res.blob();
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

                const formData = new FormData();
                formData.append("file", file);
                formData.append("mode", "craft"); // Default to craft for now

                const response = await fetch("http://localhost:8000/scan", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                setScanResult(data);
                setIsAnalyzing(false); // Stop analyzing animation, show result
            } catch (err) {
                console.error("Scan failed", err);
                setIsAnalyzing(false);
                setTimeScale(0.1);
            }
        }
    }, [webcamRef, film, setIsAnalyzing, setScanResult, setTimeScale, useFilm]);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden rounded-lg">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 border-[2px] border-white/30 pointer-events-none rounded-lg" />

            {/* Capture Button Overlay */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center pb-8 z-30">
                <button
                    onClick={capture}
                    disabled={film <= 0}
                    className={`w-20 h-20 rounded-full border-4 border-white backdrop-blur-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]
            ${film > 0 ? 'bg-white/20 active:bg-white/40' : 'bg-red-500/20 border-red-500/50 cursor-not-allowed'}
          `}
                />
            </div>
        </div>
    );
};
