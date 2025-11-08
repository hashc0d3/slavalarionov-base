"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const mockWatchStraps_1 = require("@/data/mockWatchStraps");
async function default_1() {
    let result;
    const promise = new Promise((resolve) => {
        const watchStraps = (0, cloneDeep_js_1.default)(mockWatchStraps_1.mockWatchStraps);
        watchStraps.forEach((item) => {
            item.choosen = false;
            item.dataFetched = false;
            if (item.attributes?.watch_strap) {
                item.attributes.watch_strap.buckle_butterfly_choosen = false;
            }
        });
        resolve({ watchStraps });
    });
    await promise
        .then((res) => {
        result = res.watchStraps;
    })
        .catch((err) => {
        console.log(err);
    });
    return { watchStraps: result };
}
//# sourceMappingURL=watchStrapsApi.js.map