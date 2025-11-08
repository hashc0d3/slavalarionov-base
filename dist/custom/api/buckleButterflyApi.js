"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const mockBuckleButterfly_1 = require("@/data/mockBuckleButterfly");
async function default_1() {
    let result;
    const promise = new Promise((resolve) => {
        const buckleButterfly = (0, cloneDeep_js_1.default)(mockBuckleButterfly_1.mockBuckleButterfly);
        buckleButterfly.choosen = false;
        resolve({ buckleButterfly });
    });
    await promise.then((data) => {
        result = data;
    });
    return result;
}
//# sourceMappingURL=buckleButterflyApi.js.map