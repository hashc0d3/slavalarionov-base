"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const app_1 = require("nuxt/app");
async function default_1(payload) {
    if (payload) {
        const config = (0, app_1.useRuntimeConfig)();
        try {
            const response = await fetch(`${config.public.BACKEND_BASE_ADDRESS}dolyame-info.php`, {
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
    return null;
}
//# sourceMappingURL=dolyameInfoApi.js.map