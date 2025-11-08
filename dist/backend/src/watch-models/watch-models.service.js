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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchModelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WatchModelsService = class WatchModelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.watchModel.findMany({
            include: {
                watch_sizes: true,
                frame_colors: true,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }
    async findOne(id) {
        return this.prisma.watchModel.findUnique({
            where: { id },
            include: {
                watch_sizes: true,
                frame_colors: true,
            },
        });
    }
    async create(data) {
        return this.prisma.watchModel.create({
            data: {
                model_name: data.model_name,
                watch_model_name: data.watch_model_name,
                watch_model_manufacturer: data.watch_model_manufacturer,
                main_image: data.main_image,
                watch_sizes: {
                    create: data.watch_sizes || [],
                },
                frame_colors: {
                    create: data.frame_colors || [],
                },
            },
            include: {
                watch_sizes: true,
                frame_colors: true,
            },
        });
    }
    async update(id, data) {
        await this.prisma.watchSize.deleteMany({ where: { watchModelId: id } });
        await this.prisma.frameColor.deleteMany({ where: { watchModelId: id } });
        return this.prisma.watchModel.update({
            where: { id },
            data: {
                model_name: data.model_name,
                watch_model_name: data.watch_model_name,
                watch_model_manufacturer: data.watch_model_manufacturer,
                main_image: data.main_image,
                watch_sizes: {
                    create: data.watch_sizes || [],
                },
                frame_colors: {
                    create: data.frame_colors || [],
                },
            },
            include: {
                watch_sizes: true,
                frame_colors: true,
            },
        });
    }
    async delete(id) {
        return this.prisma.watchModel.delete({
            where: { id },
        });
    }
    async backup() {
        const models = await this.findAll();
        return {
            timestamp: new Date().toISOString(),
            data: models,
        };
    }
    async restoreFromBackup(backupData) {
        await this.prisma.watchModel.deleteMany();
        for (const modelData of backupData) {
            await this.prisma.watchModel.create({
                data: {
                    model_name: modelData.model_name,
                    watch_model_name: modelData.watch_model_name,
                    watch_model_manufacturer: modelData.watch_model_manufacturer,
                    main_image: modelData.main_image,
                    watch_sizes: {
                        create: modelData.watch_sizes.map((s) => ({
                            watch_size: s.watch_size,
                        })),
                    },
                    frame_colors: {
                        create: modelData.frame_colors.map((c) => ({
                            color_name: c.color_name,
                            color_code: c.color_code,
                        })),
                    },
                },
            });
        }
        return { success: true, restoredCount: backupData.length };
    }
};
exports.WatchModelsService = WatchModelsService;
exports.WatchModelsService = WatchModelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchModelsService);
//# sourceMappingURL=watch-models.service.js.map