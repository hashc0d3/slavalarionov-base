"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defineNuxtPlugin(() => {
    if (process.client) {
        ;
        (function (m, e, t, r, i, k, a) {
            m[i] =
                m[i] ||
                    function (...args) {
                        ;
                        (m[i].a = m[i].a || []).push(args);
                    };
            m[i].l = Date.now();
            for (let j = 0; j < e.scripts.length; j++) {
                if (e.scripts[j].src === r)
                    return;
            }
            k = e.createElement(t);
            a = e.getElementsByTagName(t)[0];
            k.async = true;
            k.src = r;
            a?.parentNode?.insertBefore(k, a);
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=103476650', 'ym');
        window.ym?.(103476650, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: 'dataLayer',
            accurateTrackBounce: true,
            trackLinks: true
        });
    }
});
//# sourceMappingURL=yandex-metrika.client.js.map