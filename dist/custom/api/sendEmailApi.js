"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const app_1 = require("nuxt/app");
async function default_1(formData) {
    if (formData) {
        const payload = {
            formData
        };
        const config = (0, app_1.useRuntimeConfig)();
        try {
            const response = await fetch(`${config.public.BACKEND_BASE_ADDRESS}mail.php`, {
                method: 'POST',
                body: payload.formData
            });
            if (response.ok) {
                return 'success';
            }
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
}
//# sourceMappingURL=sendEmailApi.js.map