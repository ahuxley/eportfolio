document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("site-menu");
    const navLinkItems = navLinks ? Array.from(navLinks.querySelectorAll("a")) : [];
    const sectionLinks = navLinkItems
        .map((link) => {
            const targetId = link.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) {
                return null;
            }

            const section = document.querySelector(targetId);
            if (!section) {
                return null;
            }

            return { link, section };
        })
        .filter(Boolean);
    let sectionOffsets = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function recalculateSectionOffsets() {
        sectionOffsets = sectionLinks.map(({ section }) => ({
            id: section.id,
            top: Math.round(section.getBoundingClientRect().top + window.scrollY)
        }));
    }

    function closeMenu() {
        if (!menuBtn || !navLinks) {
            return;
        }

        menuBtn.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
    }

    function openMenu() {
        if (!menuBtn || !navLinks) {
            return;
        }

        menuBtn.setAttribute("aria-expanded", "true");
        navLinks.classList.add("is-open");
    }

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinkItems.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("click", (event) => {
            if (!navLinks.classList.contains("is-open")) {
                return;
            }

            if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
                closeMenu();
                menuBtn.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 840) {
                closeMenu();
            }
        });
    }

    if (sectionLinks.length) {
        const setActiveLink = (activeId) => {
            sectionLinks.forEach(({ link, section }) => {
                const isActive = `#${section.id}` === activeId;
                link.classList.toggle("is-active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        const syncHashActiveLink = () => {
            const hash = window.location.hash;
            const hasMatchingHashLink = sectionLinks.some(({ section }) => `#${section.id}` === hash);
            if (hasMatchingHashLink) {
                setActiveLink(hash);
            } else if (window.scrollY <= 1) {
                setActiveLink(null);
            }
        };

        const getActiveSectionFromScroll = () => {
            if (window.scrollY <= 1) {
                return null;
            }

            if (!sectionOffsets.length) {
                recalculateSectionOffsets();
            }

            const lastSectionId = sectionOffsets[sectionOffsets.length - 1].id;
            const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
            if (nearBottom) {
                return `#${lastSectionId}`;
            }

            const activationLine = window.scrollY + Math.min(window.innerHeight * 0.38, 320);
            let activeId = null;

            sectionOffsets.forEach(({ id, top }) => {
                if (top <= activationLine) {
                    activeId = `#${id}`;
                }
            });

            return activeId;
        };

        let syncFrame = null;
        const scheduleScrollSync = () => {
            if (syncFrame !== null) {
                return;
            }

            syncFrame = window.requestAnimationFrame(() => {
                syncFrame = null;
                setActiveLink(getActiveSectionFromScroll());
            });
        };

        const refreshOffsetsAndSync = () => {
            recalculateSectionOffsets();
            scheduleScrollSync();
        };

        recalculateSectionOffsets();
        syncHashActiveLink();
        scheduleScrollSync();

        window.addEventListener("scroll", scheduleScrollSync, { passive: true });
        window.addEventListener("resize", refreshOffsetsAndSync);
        window.addEventListener("load", refreshOffsetsAndSync);
        if (document.fonts?.ready) {
            document.fonts.ready.then(refreshOffsetsAndSync).catch(() => {
                // Ignore font readiness failures and continue.
            });
        }
        window.addEventListener("hashchange", () => {
            syncHashActiveLink();
            scheduleScrollSync();
        });
    }

    const reveals = document.querySelectorAll("[data-reveal]");
    if (reduceMotion) {
        reveals.forEach((element) => element.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.18
        });

        reveals.forEach((element) => revealObserver.observe(element));
    }

    const counters = document.querySelectorAll(".metric-value[data-count]");
    const counterState = new WeakSet();

    function animateCounter(counter) {
        if (counterState.has(counter)) {
            return;
        }

        counterState.add(counter);
        const target = Number(counter.dataset.count || 0);
        const suffix = counter.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            counter.textContent = `${value}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.textContent = `${target}${suffix}`;
            }
        }

        window.requestAnimationFrame(step);
    }

    if (reduceMotion) {
        counters.forEach((counter) => {
            counter.textContent = `${counter.dataset.count}${counter.dataset.suffix || ""}`;
        });
    } else if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.65
        });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    const galleries = Array.from(document.querySelectorAll("[data-gallery]"));

    galleries.forEach((gallery) => {
        const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
        const tabs = Array.from(gallery.querySelectorAll("[data-gallery-go]"));

        if (!slides.length || !tabs.length) {
            return;
        }

        let activeIndex = slides.findIndex((slide) => !slide.hasAttribute("hidden"));
        if (activeIndex < 0) {
            activeIndex = 0;
        }

        const updateGallery = (index) => {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === activeIndex;
                slide.classList.toggle("is-active", isActive);
                slide.hidden = !isActive;
                slide.setAttribute("aria-hidden", String(!isActive));
                slide.setAttribute("tabindex", isActive ? "0" : "-1");
            });

            tabs.forEach((tab, tabIndex) => {
                const isActive = tabIndex === activeIndex;
                tab.classList.toggle("is-active", isActive);
                tab.setAttribute("aria-selected", String(isActive));
                tab.setAttribute("tabindex", isActive ? "0" : "-1");
            });
        };

        tabs.forEach((tab, tabIndex) => {
            tab.addEventListener("click", () => updateGallery(tabIndex));
            tab.addEventListener("keydown", (event) => {
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    updateGallery(tabIndex + 1);
                    tabs[(tabIndex + 1) % tabs.length]?.focus();
                } else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    updateGallery(tabIndex - 1);
                    tabs[(tabIndex - 1 + tabs.length) % tabs.length]?.focus();
                } else if (event.key === "Home") {
                    event.preventDefault();
                    updateGallery(0);
                    tabs[0]?.focus();
                } else if (event.key === "End") {
                    event.preventDefault();
                    updateGallery(tabs.length - 1);
                    tabs[tabs.length - 1]?.focus();
                }
            });
        });

        updateGallery(activeIndex);
    });

    const currentYear = document.getElementById("current-year");
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }

    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitButton = document.getElementById("contact-submit-button");
    const messageField = document.getElementById("message");
    const messageCharCount = document.getElementById("message-char-count");
    const messageMaxLength = Number(messageField?.getAttribute("maxlength") || 0);

    const setFormStatus = (message, state = null) => {
        if (!formStatus) {
            return;
        }

        formStatus.textContent = message;
        formStatus.classList.remove("is-success", "is-error");
        if (state) {
            formStatus.classList.add(`is-${state}`);
        }
    };

    const updateMessageCharCount = () => {
        if (!messageField || !messageCharCount || !messageMaxLength) {
            return;
        }

        const currentLength = messageField.value.length;
        messageCharCount.textContent = `${currentLength} / ${messageMaxLength} characters`;
    };

    if (messageField && messageCharCount && messageMaxLength) {
        updateMessageCharCount();
        messageField.addEventListener("input", updateMessageCharCount);
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            if (!contactForm.reportValidity()) {
                event.preventDefault();
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Continuing...";
            }
            setFormStatus("Continuing to security check...");
        });
    }

});
