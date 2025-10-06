"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("nuxt/app");
class ScrollBehavior {
    lock() {
        const body = document.querySelector('body');
        const pageYOffset = window.scrollY;
        if (body) {
            body.style.position = 'fixed';
            body.style.width = '100%';
            body.style.height = '100%';
            body.style.top = -pageYOffset + 'px';
            body.dataset.scrollDisabled = 'true';
            return pageYOffset;
        }
    }
    unlock() {
        const body = document.querySelector('body');
        const html = document.querySelector('html');
        if (body?.dataset.scrollDisabled === 'true' && body && html) {
            const scrollY = -body.style.top.replace(/[a-z]/gi, '');
            body.classList.remove('no-scroll');
            body.style.removeProperty('top');
            body.style.removeProperty('width');
            body.style.removeProperty('height');
            body.style.removeProperty('position');
            html.style.scrollBehavior = 'auto';
            window.scroll(0, scrollY);
            html.style.removeProperty('scroll-behavior');
            setTimeout(() => {
                body.removeAttribute('data-scroll-disabled');
            }, 1000);
        }
    }
}
const scrollBehavior = new ScrollBehavior();
exports.default = (0, app_1.defineNuxtPlugin)(() => {
    return {
        provide: {
            lockScroll: () => scrollBehavior.lock(),
            unlockScroll: () => scrollBehavior.unlock()
        }
    };
});
//# sourceMappingURL=scrollBehavior.client.js.map