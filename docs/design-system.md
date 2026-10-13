# YouthForge Design System — The Idea Forge Editorial

> Built per Section 27 and `frontend-design` guidance. Tailored specifically for young ambitious builders, hackathon juries, and transparent multi-agent orchestration.

---

## 1. Brand Identity & Creative Direction
**Concept:** "The Idea Forge" — Transforming raw, unpolished early ideas into tempered, research-backed, actionable ventures through an autonomous team of specialist agents.

- **Tone:** Ambitious, energetic, rigorous, truthful, non-patronizing.
- **Visual Motif:** Warm graphite substrate, copper/ember accents, laser-precise hairline borders, crisp editorial typography, and live agent telemetry rings.

---

## 2. Color Tokens

### Dark Mode (Primary Production Environment)
- **Background Root:** `#0B0D11` (Deep Charcoal Slate)
- **Card / Surface Elevated:** `#12161F` (Dark Mineral)
- **Surface Hover / Interactive:** `#1A202C`
- **Border Subtle (Hairline):** `rgba(255, 255, 255, 0.08)`
- **Border Active / Focus:** `rgba(249, 115, 22, 0.4)`

### Accent & Brand Tones (The Forge)
- **Ember Core (Primary Accent):** `#F97316` (Vibrant Forge Ember)
- **Ember Glow (Subtle):** `rgba(249, 115, 22, 0.15)`
- **Ember Deep (Borders/Active):** `#C2410C`
- **Signal Violet (Coordinator / Spark):** `#8B5CF6`
- **Signal Cyan (Researcher / Scout):** `#06B6D4`
- **Signal Amber (Critic / Judge):** `#F59E0B`
- **Signal Emerald (Planner / Smith):** `#10B981`
- **Signal Indigo (Tracker / Trail):** `#6366F1`

### Neutral Scale
- **Text Headings:** `#F8FAFC` (Slate 50)
- **Text Body:** `#CBD5E1` (Slate 300)
- **Text Muted / Meta:** `#64748B` (Slate 500)
- **Text Faint / Inactive:** `#475569` (Slate 600)

---

## 3. Typography Scale
- **Display Hero:** 48px – 64px, Weight 800, tracking -0.03em
- **H1 Section:** 32px – 40px, Weight 700, tracking -0.025em
- **H2 Card / Agent Header:** 20px – 24px, Weight 600, tracking -0.015em
- **Body Large:** 16px, Weight 400, leading 1.6
- **Body Standard:** 14px, Weight 400, leading 1.5
- **Caption / Meta / Chips:** 12px, Weight 500, tracking +0.02em, uppercase where appropriate
- **Telemetry / Hashes / Citations:** Font Family `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

---

## 4. Component States Standard
Every interactive component explicitly supports:
1. `Default`
2. `Hover` (subtle border illumination + 102% brightness)
3. `Focus-Visible` (2px ember ring with offset)
4. `Active / Pressed` (0.98 scale transform)
5. `Disabled` (opacity 0.4, cursor-not-allowed)
6. `Loading` (animated glowing border or skeleton pulse)
7. `Error / Degraded` (crimson tint + explicit reason text)

---

## 5. Motion Principles (Section 28)
- **Small interactions (hover, button):** 150ms – 200ms `cubic-bezier(0.16, 1, 0.3, 1)`
- **Agent step transitions:** 350ms ease-out
- **Idle brand pulsing:** Subtle 4s infinite sine curve (transforms opacity by 5% max)
- **Respects `prefers-reduced-motion`:** Immediately falls back to instant opacity toggles with no spatial translation.
