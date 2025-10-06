"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maska_1 = require("maska");
exports.default = defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('maska', maska_1.vMaska);
});
//# sourceMappingURL=maska.js.map