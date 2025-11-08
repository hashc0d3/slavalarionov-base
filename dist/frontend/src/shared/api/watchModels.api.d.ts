import { WatchModel } from '../store/configurator.store';
export interface WatchModelDB {
    id: number;
    model_name: string;
    watch_model_name: string;
    watch_model_manufacturer?: string | null;
    main_image?: string | null;
    createdAt: string;
    updatedAt: string;
    watch_sizes: {
        id: number;
        watch_size: string;
        watchModelId: number;
    }[];
    frame_colors: {
        id: number;
        color_name: string;
        color_code?: string | null;
        watchModelId: number;
    }[];
}
export interface CreateWatchModelData {
    model_name: string;
    watch_model_name: string;
    watch_model_manufacturer?: string;
    main_image?: string;
    watch_sizes: {
        watch_size: string;
    }[];
    frame_colors: {
        color_name: string;
        color_code?: string;
    }[];
}
export declare const mapDBToStore: (dbModel: WatchModelDB) => WatchModel;
export declare const mapStoreToAPI: (storeModel: WatchModel) => CreateWatchModelData;
export declare const watchModelsApi: {
    getAll(): Promise<WatchModel[]>;
    getOne(id: number): Promise<WatchModel>;
    create(model: WatchModel): Promise<WatchModel>;
    update(id: number, model: WatchModel): Promise<WatchModel>;
    delete(id: number): Promise<void>;
    backup(): Promise<{
        timestamp: string;
        data: WatchModelDB[];
    }>;
    restore(backupData: WatchModelDB[]): Promise<{
        success: boolean;
        restoredCount: number;
    }>;
};
