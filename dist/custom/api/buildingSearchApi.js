"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const app_1 = require("nuxt/app");
async function default_1(id, query) {
    const config = (0, app_1.useRuntimeConfig)();
    const url = `${config.public.BACKEND_BASE_ADDRESS}address.php`;
    const options = {
        method: 'POST',
        body: JSON.stringify({
            type: 'building',
            streetFiasId: id,
            query
        }),
        headers: new Headers({ 'content-type': 'application/json' })
    };
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            try {
                const res = await response.json();
                return res;
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=buildingSearchApi.js.map