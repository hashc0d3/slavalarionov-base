type frameColors = {
    choosen: boolean;
    color_name: string;
    color_title: string;
    color_code: string;
    watch_model_color: {
        data: {
            attributes: {
                color_name: string;
                watch_models_straps_colors: {
                    strap_name: string;
                    view_1: {
                        data: {
                            attributes: {
                                url: string;
                            };
                        };
                    };
                    view_2: {
                        data: {
                            attributes: {
                                url: string;
                            };
                        };
                    };
                }[];
            };
        };
    };
}[];
export type { frameColors as default };
