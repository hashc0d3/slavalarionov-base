"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cloneDeep_js_1 = __importDefault(require("lodash/fp/cloneDeep.js"));
const buckleButterfly_gql_1 = __importDefault(require("@/apollo/query/buckleButterfly.gql"));
async function default_1() {
    let result;
    const promise = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery(buckleButterfly_gql_1.default);
        onError((error) => {
            console.log(error);
        });
        onResult((e) => {
            const result = (0, cloneDeep_js_1.default)(e.data);
            if (result) {
                const buckleButterfly = result.buckleButterfly;
                buckleButterfly.choosen = false;
                resolve({ buckleButterfly });
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
//# sourceMappingURL=buckleButterflyApi.js.map