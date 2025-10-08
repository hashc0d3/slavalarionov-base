"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const next_1 = __importDefault(require("next"));
let NextMiddleware = class NextMiddleware {
    nextApp = (0, next_1.default)({
        dev: process.env.NODE_ENV !== 'production',
        dir: require('path').resolve(__dirname, '../../frontend'),
    });
    handle = this.nextApp.getRequestHandler();
    prepared = false;
    async use(req, res, nextFn) {
        if (!this.prepared) {
            await this.nextApp.prepare();
            this.prepared = true;
        }
        if (req.url && req.url.startsWith('/api')) {
            return nextFn();
        }
        this.handle(req, res);
    }
};
exports.NextMiddleware = NextMiddleware;
exports.NextMiddleware = NextMiddleware = __decorate([
    (0, common_1.Injectable)()
], NextMiddleware);
//# sourceMappingURL=next.middleware.js.map