"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const deliveryInfo_gql_1 = __importDefault(require("@/apollo/query/deliveryInfo.gql"));
let result = null;
async function default_1() {
    const promise = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery(deliveryInfo_gql_1.default);
        onError((error) => {
            console.log(error);
        });
        onResult((e) => {
            const result = (0, cloneDeep_js_1.default)(e.data);
            if (result) {
                const deliveryInfo = result.delivery;
                resolve({ deliveryInfo });
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
//# sourceMappingURL=deliveryInfoApi.js.map