// Smooth scroll + active link + modal gallery + mobile drawer + booking demo + google maps link
// + reveal animations + cursor glow + hero parallax + marquee speeds/opposite

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/* Year */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Smooth scroll */
function smoothTo(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
}

/* Preview buttons */
$$(".preview").forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-scroll");
        if (target) smoothTo(target);
    });
});

/* Drawer (mobile) */


function bindSmoothLinks(selector) {
    $$(selector).forEach((a) => {
        a.addEventListener("click", (e) => {
            const href = a.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                smoothTo(href);
                drawer?.classList.remove("is-open");
            }
        });
    });
}


bindSmoothLinks(".rail__link");
bindSmoothLinks(".toplink");
bindSmoothLinks(".drawer__link");
bindSmoothLinks(".pillbtn");

/* Active section observer */
const sectionIds = ["#home", "#about", "#work", "#sponsors", "#book", "#map", "#contact"];
const sections = sectionIds.map((id) => $(id)).filter(Boolean);

const railLinks = $$(".rail__link");
const topLinks = $$(".toplink");

if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = `#${entry.target.id}`;
                    railLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
                    topLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => io.observe(s));
} else {
    // fallback
    railLinks.forEach((l) => l.classList.remove("is-active"));
    topLinks.forEach((l) => l.classList.remove("is-active"));
}

/* ✅ Reveal animations */
const revealEls = $$(".reveal");
if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealIO = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) e.target.classList.add("is-in");
            });
        },
        { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealIO.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add("is-in"));
}

/* ✅ Cursor glow */
const glow = $(".cursorGlow");
if (glow && !prefersReducedMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx;
    let ty = gy;
    let raf = null;

    const tick = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
        raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", (e) => {
        tx = e.clientX;
        ty = e.clientY;
        glow.style.opacity = "1";
        if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
    });
}

/* ✅ Hero parallax (suave) */
const heroBg = $("#heroBg");
if (heroBg && !prefersReducedMotion) {
    window.addEventListener("scroll", () => {
        const y = window.scrollY || 0;
        const amt = Math.min(22, y * 0.04); // suave
        heroBg.style.transform = `scale(1.06) translateY(${amt}px)`;
    }, { passive: true });
}

/* ✅ Marquee: velocidades + dirección opuesta */
function setupMarquee() {
    const tracks = $$(".marquee__track");
    tracks.forEach((track) => {
        const speed = Number(track.getAttribute("data-speed") || "40");
        // speed = "segundos" (más alto -> más lento)
        track.style.setProperty("--dur", `${speed}s`);

        // pista B al revés
        if (track.classList.contains("marquee__track--b")) {
            track.style.animationName = "marqueeReverse";
        } else {
            track.style.animationName = "marquee";
        }
    });
}
setupMarquee();

/* ✅ Modal gallery (sirve para .work__card y para .shot del carrusel) */
const modal = $("#modal");
const modalImg = $("#modalImg");
const modalTag = $("#modalTag");
const modalCta = $("#modalCta");

function openModal(src, tag) {
    if (!modal || !modalImg || !modalTag) return;
    if (!src) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    modalImg.src = src;
    modalImg.alt = `Tatuaje seleccionado - ${tag || "Work"}`;
    modalTag.textContent = (tag || "").toUpperCase() || "WORK";

    if (modalCta) {
        modalCta.onclick = (e) => {
            e.preventDefault();
            closeModal();
            smoothTo("#book");
        };
    }

    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!modal || !modalImg) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    document.body.style.overflow = "";
}

function bindOpenTo(selector) {
    $$(selector).forEach((el) => {
        el.addEventListener("click", () => {
            const src = el.getAttribute("data-src") || "";
            const tag = el.getAttribute("data-tag") || "";
            openModal(src, tag);
        });
    });
}
bindOpenTo(".work__card");
bindOpenTo(".shot");

$$("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

/* Fake submit (demo -> WhatsApp) */
const bookingForm = $("#bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);

        const msg =
            `Hola Nill, quiero reservar una cita.
Nombre: ${fd.get("name")}
WhatsApp: ${fd.get("whatsapp")}
Email: ${fd.get("email")}
Instagram: ${fd.get("instagram") || "-"}
Estilo: ${fd.get("style")}
Zona: ${fd.get("zone")}
Idea: ${fd.get("idea")}`;

        // Reemplaza con el número real: 51xxxxxxxxx (sin +)
        const phone = "51993262752";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    });
}

/* Google Maps link */
const MAP_QUERY = "Lima, Peru";
const openMapsBtn = $("#openMapsBtn");
if (openMapsBtn) {
    /* Google Maps link (abrir en pestaña) */
    const openMapsBtn = document.getElementById("openMapsBtn");

    const LAT = -12.1259416;
    const LNG = -77.0272853;

    if (openMapsBtn) {
        // ✅ abre el lugar en Google Maps (pestaña nueva)
        openMapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;
        openMapsBtn.target = "_blank";
        openMapsBtn.rel = "noopener noreferrer";
    }
}

const waLink = document.getElementById("waLink");

// ✅ pon tu número real aquí (sin +)
const WA_PHONE = "51993262752";

function buildWhatsAppMessage() {
    // Si quieres emojis, usa estos (son seguros si tu archivo está en UTF-8)
    // Si igual te falla, reemplázalos por "-" y listo.
    return [
        "Hola Nill Vasquez 🔥",
        "",
        "Quiero reservar una cita para un tatuaje (realismo / minimal).",
        "",
        "• Estilo: _____",
        "• Zona del cuerpo: _____",
        "• Tamaño aprox: _____",
        "• Idea / Referencia: _____",
        "• Disponibilidad: _____",
        "",
        "Quiero que quede brutal. ¿Me apoyas con la cotización y fechas?"
    ].join("\n");
}

if (waLink) {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    waLink.href = url;
}


/* ===========================
   Sponsors carousel logic
=========================== */
(function initSponsorsCarousel() {
    const track = document.getElementById("sponsorsTrack");
    const dotsWrap = document.getElementById("sponsorsDots");
    if (!track || !dotsWrap) return;

    const prevBtn = document.querySelector(".sponsors__btn--prev");
    const nextBtn = document.querySelector(".sponsors__btn--next");

    const slides = Array.from(track.querySelectorAll(".sponsor"));
    if (slides.length === 0) return;

    // Dots
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "sponsors__dot" + (i === 0 ? " is-active" : "");
        d.setAttribute("aria-label", `Ir a sponsor ${i + 1}`);
        d.addEventListener("click", () => scrollToIndex(i));
        dotsWrap.appendChild(d);
    });

    function slideCenterX(el) {
        const rect = el.getBoundingClientRect();
        return rect.left + rect.width / 2;
    }

    function viewportCenterX() {
        const vp = track.getBoundingClientRect();
        return vp.left + vp.width / 2;
    }

    function activeIndex() {
        const vpCenter = viewportCenterX();
        let best = 0, bestDist = Infinity;
        slides.forEach((s, i) => {
            const dist = Math.abs(slideCenterX(s) - vpCenter);
            if (dist < bestDist) { bestDist = dist; best = i; }
        });
        return best;
    }

    function setDots(i) {
        const dots = Array.from(dotsWrap.children);
        dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    }

    function scrollToIndex(i) {
        const el = slides[i];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        setTimeout(() => setDots(i), 120);
    }

    function step(dir) {
        const i = activeIndex();
        const next = (i + dir + slides.length) % slides.length;
        scrollToIndex(next);
    }

    prevBtn && prevBtn.addEventListener("click", () => step(-1));
    nextBtn && nextBtn.addEventListener("click", () => step(1));

    // Auto-play (solo si hay más de 1 sponsor)
    let timer = null;
    function start() {
        if (slides.length <= 1) return;
        timer = setInterval(() => step(1), 3500);
    }
    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    track.addEventListener("mouseenter", stop);
    track.addEventListener("mouseleave", start);
    track.addEventListener("focusin", stop);
    track.addEventListener("focusout", start);

    // Update dots on scroll
    let raf = null;
    track.addEventListener("scroll", () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setDots(activeIndex()));
    });

    start();
})();


/* ===========================
   Google Translate init
   (all languages)
=========================== */
function googleTranslateElementInit() {
    new window.google.translate.TranslateElement(
        { pageLanguage: "es", autoDisplay: false },
        "google_translate_element"
    );
}



(function () {
    const burger = document.getElementById("burger");
    const drawer = document.getElementById("drawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const closeBtn = document.getElementById("drawerClose");

    const translateEl = document.getElementById("google_translate_element");
    const slotTopbar = document.getElementById("langSlotTopbar");
    const slotDrawer = document.getElementById("langSlotDrawer");

    function openDrawer() {
        if (!drawer || !burger) return;
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        burger.setAttribute("aria-expanded", "true");
        document.documentElement.style.overflow = "hidden";
    }

    function closeDrawer() {
        if (!drawer || !burger) return;
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        burger.setAttribute("aria-expanded", "false");
        document.documentElement.style.overflow = "";
    }

    burger?.addEventListener("click", () => {
        drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });

    backdrop?.addEventListener("click", closeDrawer);
    closeBtn?.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
    });

    // cerrar al hacer click en link del drawer
    drawer?.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a && a.getAttribute("href")?.startsWith("#")) closeDrawer();
    });

    // ✅ mover translate según ancho
    function syncTranslatePlacement() {
        if (!translateEl || !slotTopbar || !slotDrawer) return;

        if (window.innerWidth <= 980) {
            if (!slotDrawer.contains(translateEl)) slotDrawer.appendChild(translateEl);
        } else {
            if (!slotTopbar.contains(translateEl)) slotTopbar.appendChild(translateEl);
        }
    }

    window.addEventListener("resize", syncTranslatePlacement);
    window.addEventListener("load", syncTranslatePlacement);
    syncTranslatePlacement();
})();
