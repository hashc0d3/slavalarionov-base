export interface StrapParamsDto {
  leather_colors?: Array<{ color_title: string; color_code?: string }>;
  stitching_colors?: Array<{ color_title: string; color_code?: string }>;
  edge_colors?: Array<{ color_title: string; color_code?: string }>;
  buckle_colors?: Array<{ color_title: string; color_code?: string }>;
  adapter_colors?: Array<{ color_title: string; color_code?: string }>;
  has_buckle_butterfly?: boolean;
}

export class CreateWatchStrapDto {
  strap_name: string;
  strap_title: string;
  strap_description?: string;
  strap_short_description?: string;
  price: number;
  preview_image?: string;
  ultra_preview_image?: string;
  has_buckle_butterfly?: boolean;
  strap_params: StrapParamsDto;
}

export class UpdateWatchStrapDto {
  strap_name?: string;
  strap_title?: string;
  strap_description?: string;
  strap_short_description?: string;
  price?: number;
  preview_image?: string;
  ultra_preview_image?: string;
  has_buckle_butterfly?: boolean;
  strap_params?: StrapParamsDto;
}


