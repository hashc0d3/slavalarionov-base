import watchStrapsType from './watchStraps';
import watchModelSizes from './watchModelSizes';
import frameColors from './frameColors';
import watchAngles from './watchAngles';
type singleWatchModelType = {
    model_name: string;
    watch_model_name: string;
    watch_model_manufacturer: string;
    main_image: {
        data: {
            attributes: {
                url: string;
                height: string;
                width: string;
            };
        };
    };
    watch_sizes: watchModelSizes;
    watch_straps: watchStrapsType;
    frame_colors: frameColors;
    watch_angles: watchAngles;
    choosen: boolean;
    is_available: boolean;
};
type watchModels = singleWatchModelType[];
export type { watchModels as default, singleWatchModelType };
