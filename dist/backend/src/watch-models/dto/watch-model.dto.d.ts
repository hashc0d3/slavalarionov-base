export declare class WatchSizeDto {
    watch_size: string;
}
export declare class FrameColorDto {
    color_name: string;
    color_code?: string;
}
export declare class CreateWatchModelDto {
    model_name: string;
    watch_model_name: string;
    watch_model_manufacturer?: string;
    main_image?: string;
    watch_sizes?: WatchSizeDto[];
    frame_colors?: FrameColorDto[];
}
export declare class UpdateWatchModelDto {
    model_name?: string;
    watch_model_name?: string;
    watch_model_manufacturer?: string;
    main_image?: string;
    watch_sizes?: WatchSizeDto[];
    frame_colors?: FrameColorDto[];
}
