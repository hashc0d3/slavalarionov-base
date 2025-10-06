"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendTelegramMessageApi;
function sendTelegramMessageApi(config, options) {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}sendTelegramMessage.php`, {
        method: 'POST',
        body: { msgContent: options }
    });
}
//# sourceMappingURL=sendTelegramMessageApi.js.map