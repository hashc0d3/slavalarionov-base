"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchModelsModule = void 0;
const common_1 = require("@nestjs/common");
const watch_models_controller_1 = require("./watch-models.controller");
const watch_models_service_1 = require("./watch-models.service");
let WatchModelsModule = class WatchModelsModule {
};
exports.WatchModelsModule = WatchModelsModule;
exports.WatchModelsModule = WatchModelsModule = __decorate([
    (0, common_1.Module)({
        controllers: [watch_models_controller_1.WatchModelsController],
        providers: [watch_models_service_1.WatchModelsService],
        exports: [watch_models_service_1.WatchModelsService],
    })
], WatchModelsModule);
//# sourceMappingURL=watch-models.module.js.map