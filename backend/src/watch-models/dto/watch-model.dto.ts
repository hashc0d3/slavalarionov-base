export class WatchSizeDto {
  watch_size: string;
}

export class FrameColorDto {
  color_name: string;
  color_code?: string;
  view_images?: {
    view1?: string;
    view2?: string;
    view3?: string;
  };
}

export class CreateWatchModelDto {
  model_name: string;
  watch_model_name: string;
  watch_model_manufacturer?: string;
  main_image?: string;
  watch_sizes?: WatchSizeDto[];
  frame_colors?: FrameColorDto[];
  available_strap_ids?: number[];
}

export class UpdateWatchModelDto {
  model_name?: string;
  watch_model_name?: string;
  watch_model_manufacturer?: string;
  main_image?: string;
  watch_sizes?: WatchSizeDto[];
  frame_colors?: FrameColorDto[];
  available_strap_ids?: number[];
}

