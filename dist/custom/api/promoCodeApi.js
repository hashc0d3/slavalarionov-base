"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const app_1 = require("nuxt/app");
async function default_1(code) {
    const config = (0, app_1.useRuntimeConfig)();
    if (code) {
        const payload = {
            code
        };
        try {
            const response = await fetch(`${config.public.BACKEND_BASE_ADDRESS}promo.php`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: new Headers({ 'content-type': 'application/json' })
            });
            if (response.ok) {
                const res = await response.json();
                return res;
            }
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    else {
        return null;
    }
}
//# sourceMappingURL=promoCodeApi.js.map