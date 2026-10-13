
/* =========================================
   BENHILL COLLEGE — SHARED JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initMobileNavigation();
    initHeroSlider();
    initFooterYear();
    initContactForm();
});

/* 1. MOBILE NAVIGATION */
function initMobileNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".primary-navigation");

    if (!toggle || !nav) return;

    function setMenu(open) {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );
    }

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        setMenu(!isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            setMenu(false);
        }
    });

    // Close the mobile menu when clicking outside it.
    document.addEventListener("click", (event) => {
        if (
            window.innerWidth <= 760 &&
            !nav.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            setMenu(false);
        }
    });
}

/* 2. HOMEPAGE HERO SLIDESHOW */
function initHeroSlider() {
    const hero = document.querySelector(".hero-section");
    const title = document.querySelector(".hero-content h1");
    const description = document.querySelector(".hero-description");
    const actions = document.querySelector(".hero-actions");
    const indicators = document.querySelectorAll(".hero-indicator");

    if (!hero || !title || !description || !actions) return;
    if (indicators.length === 0) return;

    const slides = [
        {
            heading: "A Brighter Future",
            highlight: "Starts Here",
            description:
                "We provide a nurturing and inspiring environment where every student can discover their potential, build confidence and achieve their dreams.",
            primaryText: "Explore Our School",
            primaryLink: "#about",
            secondaryText: "Admissions",
            secondaryLink: "#admissions",
            image: "images/hero-school.jpg"
        },
        {
            heading: "Learning Today",
            highlight: "Leading Tomorrow",
            description:
                "We encourage curiosity, creativity and critical thinking to prepare our students for the opportunities of tomorrow.",
            primaryText: "Explore Academics",
            primaryLink: "#academics",
            secondaryText: "Our Approach",
            secondaryLink: "#about",
            image: "images/hero-school-2.jpg"
        },
        {
            heading: "Growing Together",
            highlight: "Achieving More",
            description:
                "Discover a supportive school community where students develop knowledge, character and lifelong friendships.",
            primaryText: "Discover Student Life",
            primaryLink: "#student-life",
            secondaryText: "Our Branches",
            secondaryLink: "#branches",
            image: "images/hero-school-3.jpg"
        }
    ];

    if (indicators.length !== slides.length) {
        console.warn(
            "Hero slider: provide exactly one indicator per slide."
        );
        return;
    }

    let currentSlide = 0;
    let timer = null;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Preload slideshow images.
    slides.forEach((slide) => {
        const image = new Image();
        image.src = slide.image;
    });

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        const slide = slides[currentSlide];

        title.replaceChildren();

        title.append(document.createTextNode(slide.heading + " "));

        const highlight = document.createElement("span");
        highlight.textContent = slide.highlight;
        title.append(highlight);

        description.textContent = slide.description;

        // Build links safely without inserting HTML strings.
        actions.replaceChildren();

        [
            {
                text: slide.primaryText,
                href: slide.primaryLink,
                className: "btn btn-primary"
            },
            {
                text: slide.secondaryText,
                href: slide.secondaryLink,
                className: "btn btn-outline"
            }
        ].forEach((item) => {
            const link = document.createElement("a");
            link.className = item.className;
            link.href = item.href;
            link.append(document.createTextNode(item.text + " "));

            const arrow = document.createElement("span");
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = "→";

            link.append(arrow);
            actions.append(link);
        });

        // The CSS pseudo-element uses this custom property.
        hero.style.setProperty(
            "--hero-image",
            `url("${slide.image}")`
        );

        indicators.forEach((indicator, i) => {
            const active = i === currentSlide;

            indicator.classList.toggle("active", active);

            if (active) {
                indicator.setAttribute("aria-current", "true");
            } else {
                indicator.removeAttribute("aria-current");
            }
        });
    }

    function stopSlider() {
        if (timer !== null) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    function startSlider() {
        stopSlider();

        if (reducedMotion.matches) return;
        if (document.hidden) return;

        timer = window.setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            showSlide(index);
            startSlider();
        });
    });

    hero.addEventListener("mouseenter", stopSlider);
    hero.addEventListener("mouseleave", startSlider);

    hero.addEventListener("focusin", stopSlider);
    hero.addEventListener("focusout", (event) => {
        if (!hero.contains(event.relatedTarget)) {
            startSlider();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener("change", startSlider);
    }

    showSlide(0);
    startSlider();
}

/* 3. AUTOMATIC COPYRIGHT YEAR */
function initFooterYear() {
    document.querySelectorAll("#current-year").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}

/* 4. CONTACT FORM DEMO */
function initContactForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#contact-form-message");

    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        status.textContent =
            "This demonstration form is not connected to an email service. " +
            "Your message has not been sent. Connect a backend or form " +
            "service to receive enquiries.";

        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
    });
}

