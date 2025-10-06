"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendRetailCrmApi;
function sendRetailCrmApi(config, options) {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}retailcrm.php`, {
        method: 'POST',
        body: { orderData: options }
    });
}
//# sourceMappingURL=sendRetailCrmApi.js.map