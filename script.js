const CONTACT_EMAIL = "kivoraservices@gmail.com";
const WHATSAPP_NUMBER = "+258 863108477";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const leadForm = document.querySelector("#lead-form");
const formFeedback = document.querySelector("#form-feedback");
const whatsappStatus = document.querySelector("#whatsapp-status");
const sectorSelect = document.querySelector("#lead-sector");
const sectorByKey = {
    bancos: "Bancos e finanças",
    educacao: "Educação e escolas",
    mecanica: "Mecânica e indústria"
};

const requestedSector = new URLSearchParams(window.location.search).get("segmento");
if (sectorSelect && requestedSector && sectorByKey[requestedSector]) {
    sectorSelect.value = sectorByKey[requestedSector];
}

function createContactMessage(lead) {
    return [
        "Olá! Gostaria de conhecer a plataforma Kwela.",
        "",
        `Nome: ${lead.name}`,
        `E-mail: ${lead.email}`,
        `Empresa: ${lead.company}`,
        `Segmento: ${lead.sector}`,
        `Canal preferido: ${lead.contactMethod}`
    ].join("\n");
}

function showFormMessage(message, isError = false) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.classList.toggle("is-error", isError);
}

function openWhatsApp(lead) {
    const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
    const message = createContactMessage(lead);
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.location.assign(url);
    return true;
}

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
        mainNav.classList.toggle("is-open", !isExpanded);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
            mainNav.classList.remove("is-open");
        });
    });
}

document.querySelectorAll(".billing-option").forEach((button) => {
    button.addEventListener("click", () => {
        const billing = button.dataset.billing;

        document.querySelectorAll(".billing-option").forEach((option) => {
            const isActive = option === button;
            option.classList.toggle("is-active", isActive);
            option.setAttribute("aria-pressed", String(isActive));
        });

        document.querySelectorAll(".price-value").forEach((price) => {
            price.textContent = price.dataset[billing];
        });

        document.querySelectorAll(".plan-price-note").forEach((note) => {
            note.textContent = note.dataset[`${billing}Note`];
        });
    });
});

document.querySelectorAll("[data-sector]").forEach((link) => {
    link.addEventListener("click", () => {
        if (sectorSelect) sectorSelect.value = link.dataset.sector;
    });
});

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
    link.href = `https://wa.me/${phoneNumber}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.addEventListener("click", (event) => {
        if (link.matches(".whatsapp-link") && leadForm && !leadForm.reportValidity()) {
            event.preventDefault();
        }
    });
});

if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!leadForm.reportValidity()) return;

        const lead = Object.fromEntries(new FormData(leadForm).entries());

        if (lead.contactMethod === "WhatsApp") {
            openWhatsApp(lead);
            return;
        }

        if (!CONTACT_EMAIL) {
            showFormMessage("Configure o e-mail de contato ou o número do WhatsApp em script.js.", true);
            return;
        }

        const subject = encodeURIComponent(`Demonstração Kwela — ${lead.company}`);
        const body = encodeURIComponent(createContactMessage(lead));
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        showFormMessage("O seu aplicativo de e-mail será aberto com a mensagem pronta.");
    });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll(
    ".section-heading, .sector-card, .step-item, .benefit, .testimonial-card, .faq-list details, .plan-card, .lead-form, [data-reveal]"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => {
        target.setAttribute("data-reveal", "");
        revealObserver.observe(target);
    });
} else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
}
