type strapParamsType = {
    param_title: string;
    param_name: string;
    param_price: number;
    choosen: boolean;
}[];
type strapColorParam = {
    choosen: boolean;
    color_name: string;
    color_title: string;
    color_code: string;
    default_selected: boolean | null;
    available: boolean | null;
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
    view_3: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_view_1: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_view_2: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_view_3: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
};
type adapterColorParam = strapColorParam & {
    preview: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
};
type strapBuckleColorParam = {
    choosen: boolean;
    color_name: string;
    color_title: string;
    color_code: string;
    default_selected: boolean | null;
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
    view_3: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_view_1: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_view_2: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_view_3: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    preview: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
};
type strapViewImage = {
    main_image: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_main_image: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
};
type finalView = {
    data: {
        attributes: {
            url: string;
        };
    };
};
type watchStrapDataType = {
    id: number;
    strap_name: string;
    strap_title: string;
    strap_description: string;
    strap_full_description: string;
    price: number;
    preview_image: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    ultra_preview_image: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
    leather_colors: strapColorParam[];
    stitching_colors: strapColorParam[];
    edge_colors: strapColorParam[];
    buckle_colors: strapColorParam[];
    adapter_colors: adapterColorParam[];
    view_1: strapViewImage;
    view_2: strapViewImage;
    view_3: strapViewImage;
    final_view: finalView;
    strap_params: strapParamsType;
    is_available: boolean;
    has_buckle_butterfly: boolean;
    buckle_butterfly_choosen?: boolean;
};
type singleWatchStrap = {
    choosen: boolean;
    dataFetched: boolean;
    attributes: {
        watch_strap: watchStrapDataType;
    };
};
type watchStraps = {
    data: singleWatchStrap[];
};
export type { watchStraps as default, singleWatchStrap, watchStrapDataType, strapParamsType, strapColorParam, strapBuckleColorParam, strapViewImage };
