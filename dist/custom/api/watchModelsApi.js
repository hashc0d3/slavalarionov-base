"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = watchModelsApi;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const watchModels_gql_1 = __importDefault(require("@/apollo/query/watchModels.gql"));
async function watchModelsApi() {
    let result;
    const promise = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery(watchModels_gql_1.default);
        onError((error) => {
            console.log(error);
        });
        onResult((e) => {
            const result = (0, cloneDeep_js_1.default)(e.data);
            if (result) {
                const watchModels = result.watchModels.data.map((item) => {
                    return item.attributes.watch_model;
                });
                watchModels.forEach((item, idx, arr) => {
                    if (item.is_available === false) {
                        arr.splice(idx, 1);
                    }
                    item.watch_sizes.forEach((size) => {
                        size.choosen = false;
                    });
                    item.frame_colors.forEach((color) => {
                        color.choosen = false;
                    });
                    item.watch_straps.data.forEach((strap) => {
                        strap.choosen = false;
                    });
                    item.choosen = false;
                });
                const additionalOption = result.additionalOption;
                resolve({ watchModels, additionalOption });
            }
            else {
                reject(new Error('some-error'));
            }
        });
    });
    await promise.then((data) => {
        result = data;
    });
    return result;
}
//# sourceMappingURL=watchModelsApi.js.map