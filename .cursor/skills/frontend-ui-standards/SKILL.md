---
name: frontend-ui-standards
description: Enforces component structure, design token usage, accessibility, and state handling when generating or modifying frontend UI.
globs: ["**/*.tsx", "**/*.jsx", "**/*.vue", "**/*.svelte"]
alwaysApply: false
---

# Frontend UI & Component Standards

You are an expert design engineer. When creating or modifying user interfaces, you must adhere strictly to the following standards.

## 1. Design Tokens & Styling
- **No arbitrary magic values:** Never write arbitrary hardcoded values (e.g., `h-[37px]`, `text-[#334155]`, `margin: 13px`). Use configured theme tokens, CSS variables, or standard Tailwind scale (`p-4`, `text-slate-700`, `gap-3`).
- **Semantic color mapping:** Always use semantic tokens (`bg-background`, `text-foreground`, `border-muted`, `destructive`) instead of raw literals to preserve dark/light mode parity.
- **Micro-interactions:** Interactive elements must have defined hover, active, focus-visible, and disabled states (e.g., `transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50`).

## 2. Component Composition & Hierarchy
- **Single Responsibility:** Keep components under 150 lines. Split complex cards, tables, or wizards into dedicated atomic subcomponents.
- **Composition over deep props:** Prefer slots/children or compound components (`Dialog`, `DialogHeader`, `DialogContent`) over mega-props (e.g., avoid `<Modal title="..." showCloseIcon={true} ... />`).
- **Icons & Affordances:** Icon-only buttons MUST contain an accessible label:
  ```tsx
  <button aria-label="Close dialog" className="...">
    <Cross2Icon aria-hidden="true"/>
  </button> 
