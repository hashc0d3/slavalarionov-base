"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = watchModelsApi;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const mockWatchModels_1 = require("@/data/mockWatchModels");
async function watchModelsApi() {
    let result;
    const promise = new Promise((resolve) => {
        const watchModels = (0, cloneDeep_js_1.default)(mockWatchModels_1.mockWatchModels);
        const additionalOption = (0, cloneDeep_js_1.default)(mockWatchModels_1.mockAdditionalOption);
        watchModels.forEach((item) => {
            if (item.watch_sizes) {
                item.watch_sizes.forEach((size) => {
                    size.choosen = false;
                });
            }
            if (item.frame_colors) {
                item.frame_colors.forEach((color) => {
                    color.choosen = false;
                });
            }
            if (item.watch_straps?.data) {
                item.watch_straps.data.forEach((strap) => {
                    strap.choosen = false;
                });
            }
            item.choosen = false;
        });
        resolve({ watchModels, additionalOption });
    });
    await promise.then((data) => {
        result = data;
    });
    return result;
}
//# sourceMappingURL=watchModelsApi.js.map