What I changed to improve mobile responsiveness

Files updated:

- `src/layouts/AppBar.jsx`
  - Adjusted heights and paddings for mobile (h-12 / px-4) and desktop (h-14 / px-6).
  - Made title truncate on small screens.

- `src/layouts/DefaultLayout.jsx`
  - Added `className="app-main"` to `<main>` and removed inline paddingTop so CSS can handle responsive padding.
  - Kept `minHeight` calculation to reserve space.

- `src/App.css`
  - Reduced root padding on small screens.
  - Added `img, canvas { max-width:100%; height:auto }` to make media fluid.
  - Added `.stage-container` helper class.
  - Added `.app-main` rules to set `padding-top` to match AppBar height (56px default, 48px on small screens).

- `src/CropPreview.jsx`
  - Ensure canvas element displays responsively (CSS width:100%, height:auto) after rendering.

- `src/ImageStudio.jsx`
  - Make the Stage wrapper a full-width block (`stage-container`) rather than `inline-block`.
  - Keep Konva stage scale logic but display container as fluid.

- `src/Upload.jsx`
  - Stack upload buttons on small screens using `flex-col sm:flex-row`.

How to test quickly

1. Start the frontend dev server:

   npm run dev

2. Open the site in a mobile viewport via browser devtools or an actual device:

   http://localhost:5173/

3. Things to verify:
   - The AppBar should be fixed at top; content should not be hidden under it.
   - Buttons should stack on narrow screens.
   - Images and canvases (crop preview, konva stage) should not overflow the screen and should scale down.
   - The image stage should allow pinch-to-zoom and pan (behavior unchanged).

Notes / Next steps (optional enhancements)

- Replace the simple title with a hamburger menu for complex navigation on mobile if needed.
- Consider switching to container-aware `fitToScreen` (use container width instead of `window.innerWidth`) to better respect side paddings.
- Add visual tests for small screen sizes (Cypress/Playwright) if automated verification is required.
