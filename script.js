const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    const input = document.querySelector(`input[value="${savedTheme}"]`);
    if (input) input.checked = true;
} else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme = prefersDark ? "dark" : "light";

    const input = document.querySelector(`input[value="${defaultTheme}"]`);
    if (input) input.checked = true;
}

const themeInputs = document.querySelectorAll('input[name="theme"]');

themeInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
        if (!document.startViewTransition) {
            applyTheme(input);
            return;
        }

        e.preventDefault();

        document.startViewTransition(() => {
            applyTheme(input);
        });
    });
});

function applyTheme(input) {
    input.checked = true;

    localStorage.setItem("theme", input.value);
}

const LContainerStyle = new CSSStyleSheet();

LContainerStyle.replaceSync(`
:host {
  --padding-inline: 1rem;
  --content-max-width: 60ch;
  --breakout-max-width: 90ch;

  display: grid;

  grid-template-columns:
    [full-width-start] minmax(var(--padding-inline), 1fr)
    [breakout-start] minmax(0, calc(var(--padding-inline) * 2))
    [content-start] minmax(0, var(--content-max-width)) [content-end]
    minmax(0, calc(var(--padding-inline) * 2)) [breakout-end]
    minmax(var(--padding-inline), 1fr) [full-width-end];
}

::slotted(*) {
  grid-column: content;
  margin-block-end: 0;
  margin-inline: 0;
  width: 100%;
}

::slotted(:first-child) {
  margin: 0;
}

::slotted([breakout]) {
  grid-column: breakout;
  max-width: var(--breakout-max-width);
  margin-inline: auto;
}

::slotted([full-width]),
::slotted(content-grid) {
  grid-column: full-width;
}

img[full-width] {
  width: 100%;
  object-fit: cover;
}
`);

class ContentGrid extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });

        this.shadowRoot.adoptedStyleSheets = [LContainerStyle];

        this.shadowRoot.innerHTML = `<slot></slot>`;
    }
}

customElements.define("content-grid", ContentGrid);

class FancyButton extends HTMLElement {
    connectedCallback() {
        const count = parseInt(this.getAttribute("count")) || 30;

        const button = document.createElement("button");
        button.className = "button--fancy";
        button.type = this.getAttribute("type") || "button";

        for (const attr of this.attributes) {
            if (attr.name !== "count") {
                button.setAttribute(attr.name, attr.value);
            }
        }

        if (!button.hasAttribute("data-color")) {
            button.setAttribute("data-color", "brand-gradient-100");
        }

        const cells = document.createElement("div");
        cells.className = "button--fancy__cells";

        for (let i = 0; i < count; i++) {
            cells.appendChild(document.createElement("span"));
        }

        const content = document.createElement("span");
        content.className = "button--fancy__content";
        content.innerHTML = this.innerHTML;

        button.append(cells, content);

        this.replaceChildren(button);
    }
}

customElements.define("fancy-button", FancyButton);

class FancyLink extends HTMLElement {
    connectedCallback() {
        const count = parseInt(this.getAttribute("count")) || 30;

        const a = document.createElement("a");
        a.className = "button--fancy";

        for (const attr of this.attributes) {
            if (attr.name !== "count") {
                a.setAttribute(attr.name, attr.value);
            }
        }

        if (!a.hasAttribute("hreflang")) {
            a.setAttribute("hreflang", "en");
        }

        if (!a.hasAttribute("data-color")) {
            a.setAttribute("data-color", "brand-gradient-100");
        }

        if (!a.hasAttribute("target")) {
            a.setAttribute("target", "_blank");
        }

        if (a.getAttribute("target") === "_blank" && !a.hasAttribute("rel")) {
            a.setAttribute("rel", "noopener noreferrer");
        }

        const cells = document.createElement("div");
        cells.className = "button--fancy__cells";

        for (let i = 0; i < count; i++) {
            cells.appendChild(document.createElement("span"));
        }

        const content = document.createElement("span");
        content.className = "button--fancy__content";
        content.innerHTML = this.innerHTML;

        a.append(cells, content);

        this.replaceChildren(a);
    }
}

customElements.define("fancy-link", FancyLink);

const scrollers = document.querySelectorAll(".scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
}

function addAnimation() {
    scrollers.forEach((scroller) => {
        if (scroller.getAttribute("data-animated") !== "true") return;

        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        });
    });
}

class SmartPicture extends HTMLElement {
  connectedCallback() {
    const avif = this.getAttribute("avif");
    const webp = this.getAttribute("webp");
    const jpeg = this.getAttribute("jpeg") || this.getAttribute("jpg");
    const alt = this.getAttribute("alt") || "";
    const className = this.getAttribute("class") || "";
    const loading = this.getAttribute("loading") || "lazy";
    const width = this.getAttribute("width");
    const height = this.getAttribute("height");
    const picture = document.createElement("picture");

    if (avif) {
      const sourceAvif = document.createElement("source");
      sourceAvif.srcset = avif;
      sourceAvif.type = "image/avif";
      picture.appendChild(sourceAvif);
    }

    if (webp) {
      const sourceWebp = document.createElement("source");
      sourceWebp.srcset = webp;
      sourceWebp.type = "image/webp";
      picture.appendChild(sourceWebp);
    }

    const img = document.createElement("img");

    img.src = jpeg || webp || avif || "";
    img.alt = alt;
    img.loading = loading;

    if (className) img.className = className;
    if (width) img.width = width;
    if (height) img.height = height;

    picture.appendChild(img);

    this.replaceWith(picture);
  }
}

customElements.define("smart-picture", SmartPicture);