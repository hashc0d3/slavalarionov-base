"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const watchStraps_gql_1 = __importDefault(require("@/apollo/query/watchStraps.gql"));
async function default_1() {
    let result;
    const promise = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery(watchStraps_gql_1.default, null, {
            fetchPolicy: 'no-cache'
        });
        onError((error) => {
            console.log(error);
        });
        onResult((res) => {
            const response = (0, cloneDeep_js_1.default)(res?.data) || null;
            if (response) {
                const result = response.watchStraps.data;
                result.forEach((item, idx, arr) => {
                    if (item.attributes.watch_strap.is_available === false) {
                        arr.splice(idx, 1);
                    }
                    item.choosen = false;
                    item.dataFetched = false;
                    item.attributes.watch_strap.buckle_butterfly_choosen = false;
                });
                resolve({ watchStraps: result });
            }
            else
                reject(new Error('result failed'));
        });
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