const loader = document.getElementById("loader");
window.addEventListener("load", () => setTimeout(() => loader.classList.add("done"), 450));

const menu = document.getElementById("menu");
const openButton = document.getElementById("menuOpen");
const closeButton = document.getElementById("menuClose");
function setMenu(open) {
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  openButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-lock", open);
}
openButton.addEventListener("click", () => setMenu(true));
closeButton.addEventListener("click", () => setMenu(false));
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenu(false);
});

// A subtle parallax shift gives the layered hero the same cinematic feel
// as the reference site without requiring a heavy animation library.
const hero = document.querySelector(".hero");
const sun = document.querySelector(".sun-disc");
const hills = document.querySelector(".hills");
if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hero.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    sun.style.transform = `translate(${x * -13}px, ${y * -9}px)`;
    hills.style.transform = `translateX(${x * 7}px)`;
  });
  hero.addEventListener("pointerleave", () => {
    sun.style.transform = "";
    hills.style.transform = "";
  });
}


// Drag the bicycle around the hero. On release it springs back to its home spot,
// as if pulled by a soft elastic gravity.
(() => {
  const bike = document.getElementById("draggableBike");
  if (!bike) return;
  let x = 0, y = 0, vx = 0, vy = 0;
  let dragging = false, pointerId = null, lastX = 0, lastY = 0, lastTime = 0;
  let frame = 0, startX = 0, startY = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paint() {
    bike.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.max(-9, Math.min(9, x * .025))}deg)`;
  }
  function animate() {
    if (dragging) return;
    const stiffness = reduceMotion ? .22 : .105;
    const damping = reduceMotion ? .5 : .82;
    vx += -x * stiffness;
    vy += -y * stiffness;
    vx *= damping;
    vy *= damping;
    x += vx;
    y += vy;
    paint();
    if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) > .35) {
      frame = requestAnimationFrame(animate);
    } else {
      x = 0; y = 0; vx = 0; vy = 0;
      paint();
      frame = 0;
    }
  }
  function stopAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }
  bike.addEventListener("pointerdown", event => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    stopAnimation();
    dragging = true;
    pointerId = event.pointerId;
    bike.classList.add("dragging");
    bike.setPointerCapture(pointerId);
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();
    event.preventDefault();
  });
  bike.addEventListener("pointermove", event => {
    if (!dragging || event.pointerId !== pointerId) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastTime);
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    x += dx; y += dy;
    vx = dx / dt * 16;
    vy = dy / dt * 16;
    lastX = event.clientX; lastY = event.clientY; lastTime = now;
    paint();
  });
  function release(event) {
    if (!dragging || (event && event.pointerId !== pointerId)) return;
    dragging = false;
    pointerId = null;
    bike.classList.remove("dragging");
    if (!frame) frame = requestAnimationFrame(animate);
  }
  bike.addEventListener("pointerup", release);
  bike.addEventListener("pointercancel", release);
  bike.addEventListener("lostpointercapture", release);
  bike.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!frame) frame = requestAnimationFrame(animate);
    }
  });
})();
