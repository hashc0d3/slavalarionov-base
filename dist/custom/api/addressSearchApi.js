"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const app_1 = require("nuxt/app");
async function default_1(query, cityName = '') {
    const config = (0, app_1.useRuntimeConfig)();
    const url = `${config.public.BACKEND_BASE_ADDRESS}address.php`;
    const options = {
        method: 'POST',
        body: JSON.stringify({
            type: 'street',
            query,
            cityName: cityName.toLowerCase()
        })
    };
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const res = await response.json();
            return res;
        }
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=addressSearchApi.js.map