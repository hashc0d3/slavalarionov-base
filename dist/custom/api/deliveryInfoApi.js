"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const mockDeliveryInfo_1 = require("@/data/mockDeliveryInfo");
let result = null;
async function default_1() {
    const promise = new Promise((resolve) => {
        const deliveryInfo = (0, cloneDeep_js_1.default)(mockDeliveryInfo_1.mockDeliveryInfo);
        resolve({ deliveryInfo });
    });
    await promise.then((data) => {
        result = data;
    });
    return result;
}
//# sourceMappingURL=deliveryInfoApi.js.map