export interface StrapColorImagesDto {
  view1?: string | null;
  view2?: string | null;
  view3?: string | null;
}

export interface StrapColorDto {
  color_title: string;
  color_code?: string;
  price?: number;
  images?: StrapColorImagesDto;
  view1?: string | null;
  view2?: string | null;
  view3?: string | null;
}

export interface StrapViewImagesDto {
  view1?: string | null;
  view2?: string | null;
  view3?: string | null;
  ultraView1?: string | null;
  ultraView2?: string | null;
  ultraView3?: string | null;
}

export interface StrapParamsDto {
  leather_colors?: StrapColorDto[];
  stitching_colors?: StrapColorDto[];
  edge_colors?: StrapColorDto[];
  buckle_colors?: StrapColorDto[];
  adapter_colors?: StrapColorDto[];
  has_buckle_butterfly?: boolean;
  view_images?: StrapViewImagesDto;
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
  buckle_butterfly_price?: number;
  buckle_butterfly_image?: string;
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
  buckle_butterfly_price?: number;
  buckle_butterfly_image?: string;
  strap_params?: StrapParamsDto;
}


