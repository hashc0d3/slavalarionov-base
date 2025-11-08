import { WatchModelsService } from './watch-models.service';
import { CreateWatchModelDto, UpdateWatchModelDto } from './dto/watch-model.dto';
export declare class WatchModelsController {
    private readonly watchModelsService;
    constructor(watchModelsService: WatchModelsService);
    findAll(): Promise<({
        watch_sizes: {
            id: number;
            watch_size: string;
            watchModelId: number;
        }[];
        frame_colors: {
            id: number;
            color_name: string;
            color_code: string | null;
            watchModelId: number;
        }[];
    } & {
        model_name: string;
        watch_model_name: string;
        watch_model_manufacturer: string | null;
        main_image: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    })[]>;
    backup(): Promise<{
        timestamp: string;
        data: ({
            watch_sizes: {
                id: number;
                watch_size: string;
                watchModelId: number;
            }[];
            frame_colors: {
                id: number;
                color_name: string;
                color_code: string | null;
                watchModelId: number;
            }[];
        } & {
            model_name: string;
            watch_model_name: string;
            watch_model_manufacturer: string | null;
            main_image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        })[];
    }>;
    restore(body: {
        data: any[];
    }): Promise<{
        success: boolean;
        restoredCount: number;
    }>;
    findOne(id: number): Promise<({
        watch_sizes: {
            id: number;
            watch_size: string;
            watchModelId: number;
        }[];
        frame_colors: {
            id: number;
            color_name: string;
            color_code: string | null;
            watchModelId: number;
        }[];
    } & {
        model_name: string;
        watch_model_name: string;
        watch_model_manufacturer: string | null;
        main_image: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }) | null>;
    create(createDto: CreateWatchModelDto): Promise<{
        watch_sizes: {
            id: number;
            watch_size: string;
            watchModelId: number;
        }[];
        frame_colors: {
            id: number;
            color_name: string;
            color_code: string | null;
            watchModelId: number;
        }[];
    } & {
        model_name: string;
        watch_model_name: string;
        watch_model_manufacturer: string | null;
        main_image: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, updateDto: UpdateWatchModelDto): Promise<{
        watch_sizes: {
            id: number;
            watch_size: string;
            watchModelId: number;
        }[];
        frame_colors: {
            id: number;
            color_name: string;
            color_code: string | null;
            watchModelId: number;
        }[];
    } & {
        model_name: string;
        watch_model_name: string;
        watch_model_manufacturer: string | null;
        main_image: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    delete(id: number): Promise<{
        model_name: string;
        watch_model_name: string;
        watch_model_manufacturer: string | null;
        main_image: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
