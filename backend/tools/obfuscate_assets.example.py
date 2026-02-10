import os
import random
import struct

# Configuration
FRONTEND_PUBLIC_DIR = 'frontend/public'
XOR_KEY = 0x00 # Replace with your actual key
TARGET_EXTENSIONS = ('.webp', '.mp3')

def obfuscate_file(file_path):
    """Reads a file, XORs a random-sized header, appends size as metadata, and saves as .bin"""
    try:
        with open(file_path, 'rb') as f:
            data = bytearray(f.read())
        
        # Dynamic Chunk Encryption
        chunk_size = random.randint(50, 200)
        
        limit = min(len(data), chunk_size)
        for i in range(limit):
            data[i] ^= XOR_KEY
            
        metadata = struct.pack('<I', chunk_size)
        
        base_path = os.path.splitext(file_path)[0]
        bin_path = base_path + '.bin'
        
        with open(bin_path, 'wb') as f:
            f.write(data + metadata)
            
        print(f"[Encoded] {file_path} -> {bin_path}")
        return True
    except Exception as e:
        print(f"[Error] Failed to encode {file_path}: {e}")
        return False

def main():
    print(f"Starting asset obfuscation in {FRONTEND_PUBLIC_DIR}...")
    count = 0
    
    for root, dirs, files in os.walk(FRONTEND_PUBLIC_DIR):
        for file in files:
            if file.lower().endswith(TARGET_EXTENSIONS):
                file_path = os.path.join(root, file)
                if obfuscate_file(file_path):
                    count += 1
                    
    print(f"\nObfuscation Complete! Processed {count} files.")

if __name__ == "__main__":
    main()
