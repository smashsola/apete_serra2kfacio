import { animate, type AnimationPlaybackControls } from 'framer-motion';

// Adapt the supplied dock's spring/proximity effect to the existing native buttons.
// Transforms preserve layout dimensions, event handlers and accessible button semantics.
const spring = { type: 'spring' as const, mass: 0.18, stiffness: 150, damping: 12 };
const header = document.querySelector<HTMLElement>('.topbar');
const buttons = Array.from(document.querySelectorAll<HTMLElement>('#menu-toggle, #theme-toggle, #locate, #user-button, #cart-button'));
const sidebarButtons = Array.from(document.querySelectorAll<HTMLElement>('.side-nav a, #sidebar-close, .brand'));
const allButtons = [...buttons, ...sidebarButtons];
// Header interaction animation explicitly enabled by the user, independent of OS defaults.
const controls = new Map<HTMLElement, AnimationPlaybackControls>();
const pressed = new Set<HTMLElement>();

function move(button: HTMLElement, scale = 1, y = 0) {
  controls.get(button)?.stop();
  controls.set(button, animate(button, { scale, y }, spring));
}
function reset() { buttons.forEach(button => { if (!pressed.has(button)) move(button); }); }

header?.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse') return;
  // Read all bounds before writing transforms. client coordinates also work after scrolling.
  const targets = buttons.map(button => {
    const rect = button.getBoundingClientRect();
    const dx = Math.max(0, Math.abs(event.clientX - (rect.left + rect.width / 2)) - rect.width / 2);
    const dy = Math.max(0, Math.abs(event.clientY - (rect.top + rect.height / 2)) - rect.height / 2);
    const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 100);
    return { button, proximity };
  });
  targets.forEach(({ button, proximity }) => {
    if (!pressed.has(button)) move(button, 1 + proximity * .055, -proximity * 1.4);
  });
});
header?.addEventListener('pointerleave', reset);
allButtons.forEach(button => {
  const scale = sidebarButtons.includes(button) ? 1.025 : 1.055;
  button.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') move(button, scale, -1.4); });
  button.addEventListener('pointerleave', () => { if (!pressed.has(button)) move(button); });
  button.addEventListener('pointerdown', () => { pressed.add(button); move(button, scale, -1.4); });
  button.addEventListener('focus', () => move(button, scale, -1));
  button.addEventListener('blur', () => move(button));
  button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') move(button, scale, -1.4);
  });
  button.addEventListener('keyup', () => move(button));
});
function release() { pressed.clear(); allButtons.forEach(button => move(button)); }
window.addEventListener('pointerup', release);
window.addEventListener('pointercancel', release);
window.addEventListener('blur', release);
