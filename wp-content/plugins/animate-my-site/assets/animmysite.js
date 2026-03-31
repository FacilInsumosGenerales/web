document.addEventListener("DOMContentLoaded", function () {
    const map = {
        images: "img",
        headings: "h1, h2, h3, h4, h5, h6",
        paragraphs: "p",
        lists: "ul, ol, li",
        quotes: "blockquote",
        figures: "figure",
        figures: "figure"
    };

    const settings = window.ANIMMYSITE_SETTINGS || {};
    const enabled = settings.elements || { images: 1 };

    let selectors = [];

    for (let key in enabled) {
        if (enabled[key] && map[key]) {
            selectors.push(map[key]);
        }
    }

    if (selectors.length === 0) return;

    const elements = document.querySelectorAll(selectors.join(","));

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("animmysite-visible");
            } else {
                entry.target.classList.remove("animmysite-visible");
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(function (el) {
        // Check if element is disabled or inside header/footer
        if (el.closest('.animmysite-disabled') ||
            el.closest('header, footer, .site-header, .site-footer, .main-header, .main-footer')) {
            return;
        }
        el.classList.add("animmysite-anim");
        observer.observe(el);
    });
});

