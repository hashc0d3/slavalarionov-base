"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchModelsController = void 0;
const common_1 = require("@nestjs/common");
const watch_models_service_1 = require("./watch-models.service");
const watch_model_dto_1 = require("./dto/watch-model.dto");
let WatchModelsController = class WatchModelsController {
    watchModelsService;
    constructor(watchModelsService) {
        this.watchModelsService = watchModelsService;
    }
    async findAll() {
        return this.watchModelsService.findAll();
    }
    async backup() {
        return this.watchModelsService.backup();
    }
    async restore(body) {
        return this.watchModelsService.restoreFromBackup(body.data);
    }
    async findOne(id) {
        return this.watchModelsService.findOne(id);
    }
    async create(createDto) {
        return this.watchModelsService.create(createDto);
    }
    async update(id, updateDto) {
        return this.watchModelsService.update(id, updateDto);
    }
    async delete(id) {
        return this.watchModelsService.delete(id);
    }
};
exports.WatchModelsController = WatchModelsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('backup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "backup", null);
__decorate([
    (0, common_1.Post)('restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "restore", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [watch_model_dto_1.CreateWatchModelDto]),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, watch_model_dto_1.UpdateWatchModelDto]),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WatchModelsController.prototype, "delete", null);
exports.WatchModelsController = WatchModelsController = __decorate([
    (0, common_1.Controller)('api/watch-models'),
    __metadata("design:paramtypes", [watch_models_service_1.WatchModelsService])
], WatchModelsController);
//# sourceMappingURL=watch-models.controller.js.map