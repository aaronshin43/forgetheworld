## Project Structure

This project is built with Next.js using the App Router. The core logic is state-driven (Zustand) and component-based.

### `src/app`
- **`layout.tsx`**: Root layout definition, includes global styles and meta tags.
- **`page.tsx`**: Main entry point. Orchestrates the view modes (Intro, Battle, Camera) and layout (BattleStage vs BottomPanel).
- **`globals.css`**: Global CSS styles, Tailwind directives, and custom animations.

### `src/store`
- **`gameStore.ts`**: The central brain of the frontend application. Uses Zustand to manage all game state (Hero stats, Inventory, Monsters, Game Loop status, UI modes). Contains actions for combat, crafting, and enhancement.

### `src/hooks`
- **`useGameLoop.ts`**: The heartbeat of the game. Handles the `requestAnimationFrame` loop to update game logic (monster movement, attack cooldowns, state transitions) based on `deltaTime`.
- **`useBGM.ts`**: Manages background music playback and persistence.
- **`useSkillSound.ts`**: Handles sound effects for skills.

### `src/components`
Reusable UI components and specific game entities.
- **`AssetPreloader.tsx`**: Invisible component that pre-fetches and decrypts (if needed) game assets to prevent pop-in.
- **`Character.tsx`**: Renders the player character animations.
- **`Monster.tsx`**: Renders individual monster entities with their animations and health bars.
- **`SkillEffect.tsx`**: Renders visual effects for skills.
- **`DamageNumber.tsx`**: Renders floating combat text.
- **`GameMenu.tsx`**: In-game menu for Pausing/Quitting.
- **`DebugPanel.tsx`**: Developer tools for spawning monsters, adding items, etc.
- **`EnhancementSelectionModal.tsx`**: UI logic for selecting items to enhance.
- **`ItemDetailModal.tsx`**: Detailed view of an inventory item.
- **`LoadingScreen.tsx`**: Fallback loading indicator.
- **`CameraView.tsx`**: The interface for the device camera. Handles image capture, calling the backend analysis API, and triggering state updates based on scan results.

### `src/views`
High-level screen compositions or major UI sections.
- **`IntroScreen.tsx`**: The initial title screen with "Touch to Start".
- **`BattleStage.tsx`**: Rendering engine for the actual gameplay. Handles the game world layer (Monsters, Character, Effects), damage numbers, and the HUD (Head-Up Display). Implements dynamic scaling for different device sizes.
- **`CommandCenter.tsx`**: The bottom UI panel containing the Inventory grid and Action Buttons (Craft, Enhance, Skill).
- **`AnalysisOverlay.tsx`**: Visual overlay shown while the AI is analyzing a captured image.
- **`ResultOverlay.tsx`**: Displays the outcome of an action (Crafting result, Skill cast confirmation, Enhancement success).

### `src/constants`
- **`assetRegistry.ts`**: Configuration for game assets (Monster lists, Skill definitions, Animation durations, Base stats).
- **`soundRegistry.ts`**: Configuration for sound files.
