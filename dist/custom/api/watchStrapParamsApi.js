"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = watchStrapParamsApi;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const watchStrapParams_gql_1 = __importDefault(require("@/apollo/query/watchStrapParams.gql"));
async function watchStrapParamsApi(id) {
    let result;
    const promise = new Promise((resolve, reject) => {
        const vars = {
            id
        };
        const { onResult, onError } = useQuery(watchStrapParams_gql_1.default, vars, {
            fetchPolicy: 'no-cache'
        });
        onError((error) => {
            console.log(error);
        });
        onResult((res) => {
            const result = (0, cloneDeep_js_1.default)(res?.data) || null;
            const watchStrap = result.watchStrap.data.attributes.watch_strap;
            watchStrap.leather_colors = watchStrap.leather_colors.filter((color) => color.available);
            watchStrap.stitching_colors = watchStrap.stitching_colors.filter((color) => color.available);
            watchStrap.edge_colors = watchStrap.edge_colors.filter((color) => color.available);
            watchStrap.adapter_colors = watchStrap.adapter_colors.filter((color) => color.available);
            watchStrap.buckle_colors = watchStrap.buckle_colors.filter((color) => color.available);
            if (result) {
                resolve({
                    params: result.watchStrap.data.attributes.watch_strap
                });
            }
            else
                reject(new Error('result failed'));
        });
    });
    await promise
        .then((data) => {
        result = data.params;
        result.leather_colors.forEach((color) => {
            if (color.default_selected) {
                color.choosen = true;
            }
            else {
                color.choosen = false;
            }
        });
        result.stitching_colors.forEach((color) => {
            if (color.default_selected) {
                color.choosen = true;
            }
            else {
                color.choosen = false;
            }
        });
        result.edge_colors.forEach((color) => {
            if (color.default_selected) {
                color.choosen = true;
            }
            else {
                color.choosen = false;
            }
        });
        result.buckle_colors.forEach((color) => {
            if (color.default_selected) {
                color.choosen = true;
            }
            else {
                color.choosen = false;
            }
        });
        result.adapter_colors.forEach((color) => {
            if (color.default_selected) {
                color.choosen = true;
            }
            else {
                color.choosen = false;
            }
        });
        result.strap_params.forEach((param) => {
            param.choosen = false;
        });
    })
        .catch((err) => {
        console.log(err);
    });
    return { params: result };
}
//# sourceMappingURL=watchStrapParamsApi.js.map