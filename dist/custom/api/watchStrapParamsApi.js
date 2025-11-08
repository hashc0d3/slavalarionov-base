"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = watchStrapParamsApi;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const mockWatchStrapParams_1 = require("@/data/mockWatchStrapParams");
async function watchStrapParamsApi(id) {
    let result;
    const promise = new Promise((resolve, reject) => {
        const watchStrapData = mockWatchStrapParams_1.mockWatchStrapParamsById[id];
        if (!watchStrapData) {
            reject(new Error('Strap not found'));
            return;
        }
        const watchStrap = (0, cloneDeep_js_1.default)(watchStrapData);
        if (watchStrap.leather_colors) {
            watchStrap.leather_colors = watchStrap.leather_colors.filter((color) => color.available);
        }
        if (watchStrap.stitching_colors) {
            watchStrap.stitching_colors = watchStrap.stitching_colors.filter((color) => color.available);
        }
        if (watchStrap.edge_colors) {
            watchStrap.edge_colors = watchStrap.edge_colors.filter((color) => color.available);
        }
        if (watchStrap.adapter_colors) {
            watchStrap.adapter_colors = watchStrap.adapter_colors.filter((color) => color.available);
        }
        if (watchStrap.buckle_colors) {
            watchStrap.buckle_colors = watchStrap.buckle_colors.filter((color) => color.available);
        }
        resolve({ params: watchStrap });
    });
    await promise
        .then((data) => {
        result = data.params;
        if (result) {
            result.leather_colors?.forEach((color) => {
                color.choosen = color.default_selected || false;
            });
            result.stitching_colors?.forEach((color) => {
                color.choosen = color.default_selected || false;
            });
            result.edge_colors?.forEach((color) => {
                color.choosen = color.default_selected || false;
            });
            result.buckle_colors?.forEach((color) => {
                color.choosen = color.default_selected || false;
            });
            result.adapter_colors?.forEach((color) => {
                color.choosen = color.default_selected || false;
            });
            result.strap_params?.forEach((param) => {
                param.choosen = false;
            });
        }
    })
        .catch((err) => {
        console.log(err);
    });
    return { params: result };
}
//# sourceMappingURL=watchStrapParamsApi.js.map