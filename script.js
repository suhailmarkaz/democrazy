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
