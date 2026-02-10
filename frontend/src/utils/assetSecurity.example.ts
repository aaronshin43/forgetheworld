// Utility for decrypting obfuscated assets (XOR Example)

// IMPORTANT: This is an example file. 
// Do not commit the actual key to version control.
const XOR_KEY = 0x00; // Replace with your actual key
const CHUNK_SIZE = 100; // Limit for header encryption

export const fetchAndDecrypt = async (path: string): Promise<string> => {
    try {
        const binPath = path.replace(/\.(webp|mp3)$/i, '.bin');

        const response = await fetch(binPath);
        if (!response.ok) {
            throw new Error(`Failed to fetch obfuscated asset: ${binPath}`);
        }

        const buffer = await response.arrayBuffer();

        const dataView = new DataView(buffer);
        if (buffer.byteLength < 4) {
            throw new Error(`Invalid asset file (too small): ${binPath}`);
        }

        const chunkSize = dataView.getInt32(buffer.byteLength - 4, true);
        const contentData = new Uint8Array(buffer, 0, buffer.byteLength - 4);

        const limit = Math.min(contentData.length, chunkSize);
        for (let i = 0; i < limit; i++) {
            contentData[i] ^= XOR_KEY;
        }

        let mimeType = 'application/octet-stream';
        if (path.endsWith('.webp')) mimeType = 'image/webp';
        if (path.endsWith('.mp3')) mimeType = 'audio/mpeg';

        const blob = new Blob([contentData], { type: mimeType });
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Asset decryption failed:", error);
        return path;
    }
};
