# Dynamic Sizing Feature Tutorial

This document explains how the dynamic horizontal resizing was implemented for the dashboard panels:
- Task List
- Timer
- Notepad

The behavior is:
- Dragging a divider left/right resizes the panel on the left and the panel on the right.
- If one gets smaller, its immediate neighbor gets larger (and vice versa).
- Other panels are unaffected.

---

## 1) Where the feature was implemented

Primary files:

- `frontEnd/studentDashboard_frontEnd/src/components/dashboard/dashboard.jsx`
- `frontEnd/studentDashboard_frontEnd/src/components/dashboard/dashboard.css`

The logic lives in the dashboard layout because that is where the three target components are side-by-side.

---

## 2) High-level approach

Instead of each component controlling its own width, the dashboard now owns the widths for all three panels and renders draggable handles between them.

### Width model

A single React state array stores widths as percentages:

- `TaskList = 40`
- `Timer = 36`
- `Notepad = 24`

So initial state is:

```js
const [panelWidths, setPanelWidths] = useState([40, 36, 24]);
```

Each panel receives `flex-basis: X%`.

---

## 3) Added resize handles between adjacent panels

In `dashboard.jsx`, the panels are wrapped in a new container and separated by two buttons used as drag handles:

- Handle 1: between Task List and Timer
- Handle 2: between Timer and Notepad

The handles call:

```js
onMouseDown={(event) => startResize(0, event)}
onMouseDown={(event) => startResize(1, event)}
```

Where the index indicates which adjacent pair is being resized.

---

## 4) Drag state and event lifecycle

### State/refs used

- `panelWidths` - current panel widths
- `isResizing` - UI state for cursor behavior
- `dragStateRef` - stores drag session data
- `panelContainerRef` - measures container width

### `startResize(...)`

When the user presses a handle:
1. Prevent default browser behavior.
2. Read container width from `panelContainerRef`.
3. Store:
   - divider index (which pair to resize)
   - initial mouse X
   - starting widths snapshot
   - container width (for pixel-to-percent conversion)
4. Set `isResizing = true`.

---

## 5) Mouse move calculation (core logic)

A `useEffect` runs while `isResizing` is true and attaches `mousemove` + `mouseup` listeners to `window`.

On every `mousemove`:

1. Convert horizontal mouse movement to percentage:
   ```js
   deltaPercent = ((currentX - startX) / containerWidth) * 100
   ```

2. Pick adjacent panels:
   - `leftPanelIndex = dividerIndex`
   - `rightPanelIndex = dividerIndex + 1`

3. Preserve their combined width:
   ```js
   combined = leftStart + rightStart
   ```

4. Apply min width clamp (15%):
   - left cannot go below `MIN_PANEL_WIDTH`
   - left cannot exceed `combined - MIN_PANEL_WIDTH`

5. Compute right as remainder:
   ```js
   nextRight = combined - nextLeft
   ```

6. Update only those two panel entries in `panelWidths`.

This guarantees "one shrinks, neighbor grows" behavior.

---

## 6) Mouse up cleanup

On `mouseup`:
- clear drag state ref
- set `isResizing` false
- remove listeners in effect cleanup

This prevents memory leaks and stale drag behavior.

---

## 7) CSS added for resizable layout

In `dashboard.css`, these were introduced:

- `.resizable-panels`
  - `display: flex; flex: 1; min-width: 0;`
- `.resizable-panel`
  - `display: flex; min-width: 0;`
- `.resize-handle`
  - slim vertical draggable area (`cursor: col-resize`)
- `.resizable-panels.is-resizing`
  - force col-resize cursor and disable text selection while dragging

Visual style for handle is done with `::before` and hover color.

---

## 8) Why width/margins in child components may stop working

Because the dashboard now controls panel width, child component widths are overridden in this layout context:

- `.resizable-panel > .container { width: 100%; ... }`
- `.resizable-panel > .timer-container.user-dashboard { width: 100%; }`
- `.resizable-panel > .notepad-container.user-dashboard { width: 100%; margin-right: 0; }`

So sizing should generally be adjusted at the dashboard wrapper level rather than component-local width rules.

---

## 9) Guardrails and UX decisions

- **Minimum panel width**: `15%`
- **Percentage-based sizing** keeps behavior responsive to screen size.
- **Immediate neighbor only** changes, matching standard split-pane UX.
- **Two independent dividers** allow local resizing in either pair.

---

## 10) Optional improvements

If you want to extend this feature:

1. Persist widths in `localStorage` so layout survives refresh.
2. Add touch support (`pointerdown` / `pointermove` / `pointerup`).
3. Add keyboard accessibility for handles (arrow key resizing).
4. Add min/max widths per panel (different values for TaskList/Timer/Notepad).
5. Animate width transitions when not actively dragging.

---

## 11) Quick implementation checklist

- [x] Move width ownership to dashboard
- [x] Add panel wrapper and divider handles
- [x] Track drag start state
- [x] Convert mouse delta px to %
- [x] Clamp min width and preserve pair total
- [x] Update only adjacent panels
- [x] Add cleanup listeners on mouseup
- [x] Add resize-specific CSS/cursor behavior

---

You can apply the same pattern to `guest-dashboard` if you later want draggable sizing there too.
