# ⚔️ Forge the World

> **"Your World is Your Inventory"**
> Use your smartphone camera to turn everyday objects into legendary gear, summon them into the game, and defend against waves of monsters in this Real-time Survival Defense RPG.

---

## 🌟 Project Overview

**Forge the World** is an interactive web game that blurs the boundary between reality and fantasy.
Become the legendary blacksmith 'Varkan', awaken the latent magic in surrounding objects, and forge them into powerful weapons!

- **Genre:** Real-time Object Defense RPG
- **Core Experience:**
  - 📸 **Camera Interaction:** Capture real-world objects to convert them into in-game items.
  - 🤖 **AI-Driven Logic:** Google Gemini analyzes the physical properties of objects, while Featherless generates fantasy lore.
  - ⚡ **Real-time Action:** Utilizing a **Stop Motion** effect for dramatic action sequences.

---

## 🎮 Key Features

### 1. 📸 Scan to Craft
- **Craft:** A sharp pen becomes a 'Spear', a sturdy tumbler becomes a 'Mace'! The game analyzes shape and material to forge weapons.
- **Skill:** Tissues evoke 'Heal', batteries trigger 'Buffs', hot sauce unleashes 'Area Attacks'! Overcome crises with the essence of objects.
- **Enhance:** Fire (lighter) imbues flame attributes, Ice (ice cream) adds freezing effects.

### 2. 🎞️ Stop Motion Action System
- When the scan button is pressed, the game utilizes a stylistic **Stop Motion** effect.
- The action freezes dramatically, giving you a moment to capture the perfect shot amidst the chaos of monster waves.

### 3. 🎞️ Shared Film System (Resource)
- 'Attack (Skill)' and 'Growth (Craft/Enhance)' share a single resource: **Film**.
- With limited film, every choice matters. Will you save resources for later or spend them to survive now?

---

## 🏗️ System Architecture

This project is designed with a **"Three-Tier Brain"** structure.

1. **Body (Infrastructure):** ☁️ **Vultr**
   - Hosting both Frontend (Next.js) and Backend (FastAPI) on high-performance Cloud Compute to minimize latency.

2. **Eyes & Logic (Analysis):** 🧠 **Google Gemini 2.5 Flash Lite**
   - The core brain that analyzes object properties and determines game logic (JSON).
   - Handles Vision Analysis + Game Logic decisions in a single call.

3. **Lore (Creative):** 🪶 **Featherless (Deepseek V3)**
   - Adds 'fantasy settings' and 'immersive text' to the data analyzed by Gemini.
   - Ensures immediate responsiveness with ultra-low latency inference.

4. **Image Generation:** 🎨 **Google Gemini 2.5 Flash Image**
   - Generates item images based on the data analyzed by Gemini.

---

## 🛠️ Tech Stack

### Frontend (Mobile PWA)
- **Framework:** Next.js 14+ (App Router), TypeScript
- **State Management:** Zustand (Blade-light state control)
- **UX/UI:** Framer Motion, Tailwind CSS
- **PWA:** Offline support, Full-screen immersion
- **Effects:** Custom Stop Motion implementation

### Backend (AI Edge)
- **Runtime:** Python (FastAPI)
- **AI Models:**
  - Google Gemini 2.0 Flash Lite (Vision)
  - DeepSeek V3 (via Featherless)
  - Google Gemini 2.5 Flash Image (Image Generation)
- **Infrastructure:** Docker, Vultr Cloud Compute

---

> **Forge the World** - The world is your weapon.
