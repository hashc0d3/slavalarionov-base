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
exports.LegacyController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
let LegacyController = class LegacyController {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async proxy(req, res) {
        const legacyUrl = this.configService.get('LEGACY_BACKEND_URL');
        if (!legacyUrl) {
            res.status(502).json({ error: 'LEGACY_BACKEND_URL is not set' });
            return;
        }
        const url = legacyUrl + req.originalUrl;
        const method = req.method.toLowerCase();
        const data = req.body;
        const headers = req.headers;
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.request({
                url,
                method,
                data,
                headers,
                responseType: 'stream',
            }));
            if (response && response.data && typeof response.data.pipe === 'function') {
                response.data.pipe(res);
            }
            else {
                res.status(502).json({ error: 'Legacy backend unavailable' });
            }
        }
        catch {
            res.status(502).json({ error: 'Legacy backend unavailable' });
        }
    }
};
exports.LegacyController = LegacyController;
__decorate([
    (0, common_1.All)('*path'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LegacyController.prototype, "proxy", null);
exports.LegacyController = LegacyController = __decorate([
    (0, common_1.Controller)('api/old'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], LegacyController);
//# sourceMappingURL=legacy.controller.js.map