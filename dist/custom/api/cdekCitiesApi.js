"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const app_1 = require("nuxt/app");
async function default_1(cityName) {
    const config = (0, app_1.useRuntimeConfig)();
    if (cityName) {
        const payload = {
            type: 'cities-list',
            name: cityName
        };
        try {
            const response = await fetch(`${config.public.BACKEND_BASE_ADDRESS}cdek.php`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: new Headers({ 'content-type': 'application/json' })
            });
            if (response.ok) {
                const res = await response.json();
                return res;
            }
        }
        catch (err) {
            console.log(err);
        }
        return null;
    }
}
//# sourceMappingURL=cdekCitiesApi.js.map