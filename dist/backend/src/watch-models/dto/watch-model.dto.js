"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWatchModelDto = exports.CreateWatchModelDto = exports.FrameColorDto = exports.WatchSizeDto = void 0;
class WatchSizeDto {
    watch_size;
}
exports.WatchSizeDto = WatchSizeDto;
class FrameColorDto {
    color_name;
    color_code;
}
exports.FrameColorDto = FrameColorDto;
class CreateWatchModelDto {
    model_name;
    watch_model_name;
    watch_model_manufacturer;
    main_image;
    watch_sizes;
    frame_colors;
}
exports.CreateWatchModelDto = CreateWatchModelDto;
class UpdateWatchModelDto {
    model_name;
    watch_model_name;
    watch_model_manufacturer;
    main_image;
    watch_sizes;
    frame_colors;
}
exports.UpdateWatchModelDto = UpdateWatchModelDto;
//# sourceMappingURL=watch-model.dto.js.map