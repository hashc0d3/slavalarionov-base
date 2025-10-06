export type StepKey = 'model' | 'strap' | 'strapDesign' | 'final';
export type FrameColor = {
    color_name: string;
    color_code?: string;
    choosen: boolean;
};
export type WatchSize = {
    watch_size: string;
    choosen: boolean;
};
export type WatchModel = {
    model_name: string;
    watch_model_name: string;
    watch_model_manufacturer?: string;
    main_image?: string;
    choosen: boolean;
    watch_sizes: WatchSize[];
    frame_colors: FrameColor[];
};
export type StrapColor = {
    color_title: string;
    color_code?: string;
    choosen: boolean;
    price?: number;
};
export type StrapParams = {
    leather_colors: StrapColor[];
    stitching_colors: StrapColor[];
    edge_colors: StrapColor[];
    buckle_colors: StrapColor[];
    adapter_colors: StrapColor[];
};
export type Strap = {
    choosen: boolean;
    dataFetched?: boolean;
    attributes: {
        watch_strap: {
            id: number;
            strap_name: string;
            strap_title: string;
            price: number;
            buckle_butterfly_choosen?: boolean;
            strap_params: StrapParams;
        };
    };
};
export type Promo = {
    promoFound: boolean;
    type: 'percent' | 'ruble';
    discountValue: number;
    code: string;
};
export declare class ConfiguratorStore {
    isLoading: boolean;
    watchModels: WatchModel[];
    watchStraps: Strap[];
    currentStepNum: number;
    stepsAmount: number;
    productAmount: number;
    deliveryPrice: number | null;
    closestReadyDate: string;
    orderNumber: string | null;
    promoCode: string | null;
    promoAccepted: boolean;
    usedPromo: Promo | null;
    steps: any;
    constructor();
    get selectedWatchModel(): WatchModel | null;
    get selectedWatchModelAllSizes(): WatchSize[] | null;
    get selectedWatchModelFrameColors(): FrameColor[] | null;
    get selectedFrameColor(): FrameColor | null;
    get selectedWatchModelStraps(): {
        data: Strap[];
    };
    get selectedStrapModel(): Strap | null;
    get selectedStrapModelParams(): StrapParams | null;
    get selectedLeatherColor(): StrapColor | null;
    get selectedStitchingColor(): StrapColor | null;
    get selectedEdgeColor(): StrapColor | null;
    get selectedBuckleColor(): StrapColor | null;
    get selectedAdapterColor(): StrapColor | null;
    get isStrapParamsSelected(): boolean;
    get selectedAdditionalOptions(): {
        option_title: string;
        option_price: number;
    }[];
    get selectedStrapPrice(): number;
    get selectedStrapPriceWithDiscount(): number;
    get additionalOptionsSum(): number;
    get productsPrice(): number;
    get productsPriceWithDiscount(): number;
    get totalPrice(): number;
    get totalPriceWithDiscount(): number;
    get nextStepReady(): any;
    get currentAvailableStep(): number;
    get prevStepQuery(): string | null;
    get nextStepQuery(): string | null;
    chooseWatchModel(modelIdx: number, sizeIdx?: number): void;
    updateSelectedModel(option: string): void;
    updateWatchModelSize(option: string): void;
    updateSelectedFrameColor(option: string): void;
    chooseFrameColor(name?: string): void;
    chooseStrapModel(id: number): void;
    updateSelectedStrap(title?: string): void;
    chooseStrapLeatherColor(title: string): void;
    chooseStitchingColor(title: string): void;
    chooseEdgeColor(title: string): void;
    chooseBuckleColor(title: string): void;
    chooseAdapterColor(title: string): void;
    chooseBuckleButterfly(): void;
    setClosestReadyDate(str: string): void;
    increaseProductAmount(): void;
    decreaseProductAmount(): void;
    updatePromoCodeValue(str: string): void;
    promoUse(promo: Promo | null): void;
    applyPromo(code: string): void;
    toggleInitials(choosen: boolean): void;
    setInitialsText(text: string): void;
    togglePresentBox(choosen: boolean): void;
    togglePostCard(choosen: boolean): void;
    nextStep(): void;
    prevStep(): void;
}
export declare const configuratorStore: ConfiguratorStore;
