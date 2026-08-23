import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

document.fonts.ready.then(() => {
    const heroText = SplitText.create("#hero-text", {
        type: "chars, words",
    });

    gsap.from(heroText.chars, {
        opacity: 0,
        x: 200,
        duration: 5,
        delay: 0.25,
        stagger: 0.05,
        ease: "elastic.out(1.2, 0.75)",
    });
});

class TextFlip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._animations = null;
        this._isHovering = false;
        this._isFlipped = false;
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
    }

    connectedCallback() {
        this._render();
        this._setupEvents();
        this._setInitialState();
    }

    disconnectedCallback() {
        this._removeEvents();
        if (this._animations) {
            this._animations.forEach(anim => anim.kill());
            this._animations = null;
        }
    }

    static get observedAttributes() {
        return ['persist'];
    }

    attributeChangedCallback() { }

    _render() {
        const text = this.textContent.trim() || 'Flip';

        this.shadowRoot.innerHTML = `
                    <style>
                        .flip-wrap {
                            display: inline-grid;
                            overflow: hidden;
                            height: 1.2em;
                            line-height: 1.2;
                            vertical-align: bottom;
                            mask-image: linear-gradient(to bottom, black 0%, black 92%, transparent 100%);
                            -webkit-mask-image: linear-gradient(to bottom, black 0%, black 92%, transparent 100%);
                            transform: translateZ(0);
                            will-change: transform, opacity;
                        }

                        .flip-layer {
                            grid-area: 1 / 1;
                            white-space: nowrap;
                            height: 1.2em;
                            line-height: 1.2;
                            will-change: transform, opacity;
                            backface-visibility: hidden;
                            -webkit-backface-visibility: hidden;
                        }

                        .flip-layer--hidden {
                            user-select: none !important;
                            pointer-events: none !important;
                        }

                        .flip-layer--top {
                            transform: translateY(0);
                            opacity: 1;
                        }
                        .flip-layer--bottom {
                            transform: translateY(0);
                            opacity: 0;
                        }

                        .flip-wrap::after {
                            content: '';
                            position: absolute;
                            inset: 0;
                            pointer-events: none;
                            background: radial-gradient(
                                ellipse at center bottom,
                                rgba(255,255,255,0.06) 0%,
                                transparent 70%
                            );
                            opacity: 0;
                            transition: opacity 0.4s ease;
                            border-radius: 2px;
                            z-index: 2;
                        }
                        .flip-wrap.hover::after {
                            opacity: 1;
                        }
                    </style>

                    <div class="flip-wrap" role="text" aria-label="${text}" tabindex="0">
                        <span class="flip-layer flip-layer--top" aria-hidden="true">${text}</span>
                        <span class="flip-layer flip-layer--bottom" aria-hidden="true">${text}</span>
                    </div>
                `;
    }

    _setInitialState() {
        const wrap = this.shadowRoot.querySelector('.flip-wrap');
        if (!wrap) return;
        const top = wrap.querySelector('.flip-layer--top');
        const bottom = wrap.querySelector('.flip-layer--bottom');
        gsap.set(top, { y: 0, opacity: 1 });
        gsap.set(bottom, { y: 0, opacity: 0 });
        wrap.classList.remove('hover');
        this._isHovering = false;
        this._isFlipped = false;
        this._updateAccessibility(false);
    }

    _setupEvents() {
        const wrap = this.shadowRoot.querySelector('.flip-wrap');
        if (!wrap) return;
        wrap.addEventListener('mouseenter', this._onMouseEnter);
        wrap.addEventListener('mouseleave', this._onMouseLeave);
        wrap.addEventListener('focus', this._onMouseEnter);
        wrap.addEventListener('blur', this._onMouseLeave);
    }

    _removeEvents() {
        const wrap = this.shadowRoot.querySelector('.flip-wrap');
        if (!wrap) return;
        wrap.removeEventListener('mouseenter', this._onMouseEnter);
        wrap.removeEventListener('mouseleave', this._onMouseLeave);
        wrap.removeEventListener('focus', this._onMouseEnter);
        wrap.removeEventListener('blur', this._onMouseLeave);
    }

    _onMouseEnter() {
        if (this._isHovering) return;
        this._isHovering = true;
        this._playAnimation(true);
    }

    _onMouseLeave() {
        if (this.hasAttribute('persist')) return;
        if (!this._isHovering) return;
        this._isHovering = false;
        this._playAnimation(false);
    }

    _playAnimation(entering) {
        const wrap = this.shadowRoot.querySelector('.flip-wrap');
        if (!wrap) return;
        const top = wrap.querySelector('.flip-layer--top');
        const bottom = wrap.querySelector('.flip-layer--bottom');
        if (!top || !bottom) return;

        if (this._animations) {
            this._animations.forEach(anim => anim.kill());
            this._animations = null;
        }

        const duration = parseFloat(getComputedStyle(this).getPropertyValue('--flip-duration')) || 0.55;
        const ease = getComputedStyle(this).getPropertyValue('--flip-ease').trim() || 'power3.out';
        const anims = [];

        if (entering) {
            this._isFlipped = true;
            this._updateAccessibility(true);
            anims.push(gsap.to(top, { y: '-100%', opacity: 0, duration, ease, overwrite: 'auto' }));
            anims.push(gsap.to(bottom, {
                y: '0%',
                opacity: 1,
                duration,
                ease,
                overwrite: 'auto',
                onStart: () => wrap.classList.add('hover'),
            }));
        } else {
            this._isFlipped = false;
            this._updateAccessibility(false);
            anims.push(gsap.to(top, { y: '0%', opacity: 1, duration, ease, overwrite: 'auto' }));
            anims.push(gsap.to(bottom, {
                y: '0%',
                opacity: 0,
                duration,
                ease,
                overwrite: 'auto',
                onComplete: () => wrap.classList.remove('hover'),
            }));
        }

        this._animations = anims;
    }

    _updateAccessibility(flipped) {
        const wrap = this.shadowRoot?.querySelector('.flip-wrap');
        if (!wrap) return;
        const top = wrap.querySelector('.flip-layer--top');
        const bottom = wrap.querySelector('.flip-layer--bottom');
        if (!top || !bottom) return;

        if (flipped) {
            top.setAttribute('aria-hidden', 'true');
            top.classList.add('flip-layer--hidden');
            bottom.setAttribute('aria-hidden', 'true');
            bottom.classList.remove('flip-layer--hidden');
        } else {
            top.setAttribute('aria-hidden', 'true');
            top.classList.remove('flip-layer--hidden');
            bottom.setAttribute('aria-hidden', 'true');
            bottom.classList.add('flip-layer--hidden');
        }
    }
}

customElements.define('text-flip', TextFlip);