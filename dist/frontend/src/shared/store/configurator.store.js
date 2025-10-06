"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuratorStore = exports.ConfiguratorStore = void 0;
const mobx_1 = require("mobx");
const mockWatchModels = [
    {
        model_name: 'Apple Watch',
        watch_model_name: '4-6 серия, SE',
        watch_model_manufacturer: 'Apple Watch',
        main_image: 'https://api.slavalarionov.store/uploads/4_6_series_ab7100cb46.png',
        choosen: true,
        watch_sizes: [
            { watch_size: '40', choosen: true },
            { watch_size: '44', choosen: false }
        ],
        frame_colors: [
            { color_name: 'Silver', color_code: '#C0C0C0', choosen: true },
            { color_name: 'Black', color_code: '#000000', choosen: false }
        ]
    },
    {
        model_name: 'Apple Watch',
        watch_model_name: '7-9 серия',
        watch_model_manufacturer: 'Apple Watch',
        main_image: 'https://api.slavalarionov.store/uploads/7_8_series_0de058bb24.png',
        choosen: false,
        watch_sizes: [
            { watch_size: '41', choosen: false },
            { watch_size: '45', choosen: false }
        ],
        frame_colors: [
            { color_name: 'Silver', color_code: '#C0C0C0', choosen: false },
            { color_name: 'Black', color_code: '#000000', choosen: false }
        ]
    },
    {
        model_name: 'Apple Watch',
        watch_model_name: '10 серия',
        watch_model_manufacturer: 'Apple Watch',
        main_image: 'https://api.slavalarionov.store/uploads/10_series_7ad739c554.png',
        choosen: false,
        watch_sizes: [
            { watch_size: '42', choosen: false },
            { watch_size: '46', choosen: false }
        ],
        frame_colors: [
            { color_name: 'Silver', color_code: '#C0C0C0', choosen: false },
            { color_name: 'Black', color_code: '#000000', choosen: false }
        ]
    },
    {
        model_name: 'Apple Watch',
        watch_model_name: 'Ultra 1-2',
        watch_model_manufacturer: 'Apple Watch',
        main_image: 'https://api.slavalarionov.store/uploads/ultra_06287a958b.png',
        choosen: false,
        watch_sizes: [
            { watch_size: '49', choosen: false }
        ],
        frame_colors: [
            { color_name: 'Titanium', color_code: '#8A8D8F', choosen: false },
            { color_name: 'Black', color_code: '#000000', choosen: false }
        ]
    }
];
const mockStraps = [
    {
        choosen: true,
        attributes: {
            watch_strap: {
                id: 1,
                strap_name: 'classic-leather',
                strap_title: 'Классическая кожа',
                price: 3900,
                strap_params: {
                    leather_colors: [
                        { color_title: 'Черный', color_code: '#1b1b1b', choosen: true },
                        { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
                    ],
                    stitching_colors: [
                        { color_title: 'Черная', color_code: '#1b1b1b', choosen: true },
                        { color_title: 'Белая', color_code: '#ffffff', choosen: false }
                    ],
                    edge_colors: [
                        { color_title: 'Черный', color_code: '#1b1b1b', choosen: true },
                        { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
                    ],
                    buckle_colors: [
                        { color_title: 'Silver', color_code: '#C0C0C0', choosen: true },
                        { color_title: 'Black', color_code: '#000000', choosen: false }
                    ],
                    adapter_colors: [
                        { color_title: 'Silver', color_code: '#C0C0C0', choosen: true },
                        { color_title: 'Black', color_code: '#000000', choosen: false }
                    ]
                }
            }
        }
    }
];
class ConfiguratorStore {
    isLoading = false;
    watchModels = mockWatchModels;
    watchStraps = mockStraps;
    currentStepNum = 1;
    stepsAmount = 4;
    productAmount = 1;
    deliveryPrice = 0;
    closestReadyDate = '';
    orderNumber = null;
    promoCode = null;
    promoAccepted = false;
    usedPromo = null;
    steps = {
        model: {
            id: 1,
            title: 'Ваша модель часов',
            queryParam: 'watch-model',
            isChoosen: true,
            modelName: mockWatchModels[0].model_name,
            modelSize: mockWatchModels[0].watch_sizes[0].watch_size,
            color: { name: 'Silver', code: '#C0C0C0' }
        },
        strap: {
            id: 2,
            title: 'Выберите модель ремешка',
            queryParam: 'strap-model',
            isChoosen: true,
            strapName: 'Классическая кожа',
            strapPrice: 3900
        },
        strapDesign: {
            id: 3,
            title: 'Создайте уникальный дизайн',
            queryParam: 'strap-design',
            isChoosen: true,
            leatherColor: { title: 'Кожа', name: 'Черный' },
            stitchingColor: { title: 'Строчка', name: 'Черная' },
            edgeColor: { title: 'Край', name: 'Черный' },
            buckleColor: { title: 'Пряжка', name: 'Silver' },
            adapterColor: { title: 'Адаптер', name: 'Silver' },
            buckleButterflyChoosen: false,
            price: 3900
        },
        final: {
            id: 4,
            title: 'Добавьте надпись на ремешок',
            queryParam: 'final',
            isChoosen: true,
            additionalOptions: {
                totalPrice: 0,
                initials: { choosen: false, price: 500, text: null },
                presentBox: { choosen: false, price: 700 },
                postCard: { choosen: false, price: 300, text: null }
            },
            promo: { code: '', used: false, discountValue: 0, discountValueFull: '' },
            email: '',
            phone: '',
            name: { firstName: '', lastName: '', middleName: '' }
        }
    };
    constructor() {
        (0, mobx_1.makeAutoObservable)(this);
    }
    get selectedWatchModel() {
        return this.watchModels.find((m) => m.choosen) || null;
    }
    get selectedWatchModelAllSizes() {
        return this.selectedWatchModel?.watch_sizes || null;
    }
    get selectedWatchModelFrameColors() {
        return this.selectedWatchModel?.frame_colors || null;
    }
    get selectedFrameColor() {
        return this.selectedWatchModelFrameColors?.find((c) => c.choosen) || null;
    }
    get selectedWatchModelStraps() {
        return { data: this.watchStraps };
    }
    get selectedStrapModel() {
        return this.watchStraps.find((s) => s.choosen) || null;
    }
    get selectedStrapModelParams() {
        return this.selectedStrapModel?.attributes.watch_strap.strap_params || null;
    }
    get selectedLeatherColor() {
        return this.selectedStrapModelParams?.leather_colors.find((c) => c.choosen) || null;
    }
    get selectedStitchingColor() {
        return this.selectedStrapModelParams?.stitching_colors.find((c) => c.choosen) || null;
    }
    get selectedEdgeColor() {
        return this.selectedStrapModelParams?.edge_colors.find((c) => c.choosen) || null;
    }
    get selectedBuckleColor() {
        return this.selectedStrapModelParams?.buckle_colors.find((c) => c.choosen) || null;
    }
    get selectedAdapterColor() {
        return this.selectedStrapModelParams?.adapter_colors.find((c) => c.choosen) || null;
    }
    get isStrapParamsSelected() {
        return this.selectedLeatherColor !== null;
    }
    get selectedAdditionalOptions() {
        const opts = this.steps.final.additionalOptions;
        const arr = [];
        if (opts.initials.choosen && opts.initials.price)
            arr.push({ option_title: 'Инициалы', option_price: opts.initials.price });
        if (opts.presentBox.choosen && opts.presentBox.price)
            arr.push({ option_title: 'Подарочная коробка', option_price: opts.presentBox.price });
        if (opts.postCard.choosen && opts.postCard.price)
            arr.push({ option_title: 'Открытка', option_price: opts.postCard.price });
        return arr;
    }
    get selectedStrapPrice() {
        const base = this.selectedStrapModel?.attributes.watch_strap.price || 0;
        const butterfly = this.steps.strapDesign.buckleButterflyChoosen ? 700 : 0;
        return base + butterfly;
    }
    get selectedStrapPriceWithDiscount() {
        if (!(this.promoAccepted && this.usedPromo))
            return this.selectedStrapPrice;
        const discount = this.usedPromo.type === 'percent'
            ? this.selectedStrapPrice * this.productAmount * (this.usedPromo.discountValue / 100)
            : this.usedPromo.discountValue;
        return Math.max(0, this.selectedStrapPrice - discount);
    }
    get additionalOptionsSum() {
        return this.selectedAdditionalOptions.reduce((acc, item) => acc + Number(item.option_price), 0);
    }
    get productsPrice() {
        return this.selectedStrapPrice + this.additionalOptionsSum;
    }
    get productsPriceWithDiscount() {
        return this.selectedStrapPriceWithDiscount + this.additionalOptionsSum;
    }
    get totalPrice() {
        return this.productsPrice + (this.deliveryPrice || 0);
    }
    get totalPriceWithDiscount() {
        if (!(this.promoAccepted && this.usedPromo))
            return this.totalPrice;
        return this.productsPriceWithDiscount + (this.deliveryPrice || 0);
    }
    get nextStepReady() {
        const step = this.currentStepNum;
        if (step === 1)
            return !!this.steps.model.modelName;
        if (step === 2)
            return this.steps.strap.isChoosen;
        if (step === 3)
            return this.isStrapParamsSelected;
        return true;
    }
    get currentAvailableStep() {
        let count = 1;
        const steps = this.steps;
        for (const key in steps) {
            const k = key;
            if (steps[k].isChoosen)
                count++;
        }
        return count;
    }
    get prevStepQuery() {
        const stepsById = {};
        Object.keys(this.steps).forEach((k) => {
            stepsById[this.steps[k].id] = { queryParam: this.steps[k].queryParam };
        });
        const prev = this.currentStepNum - 1 > 0 ? this.currentStepNum - 1 : 1;
        return stepsById[prev]?.queryParam || null;
    }
    get nextStepQuery() {
        if (this.currentStepNum === this.stepsAmount)
            return null;
        const stepsById = {};
        Object.keys(this.steps).forEach((k) => {
            stepsById[this.steps[k].id] = { queryParam: this.steps[k].queryParam };
        });
        const next = this.currentStepNum + 1;
        return stepsById[next]?.queryParam || null;
    }
    chooseWatchModel(modelIdx, sizeIdx = 0) {
        this.watchModels.forEach((m, idx) => {
            m.choosen = idx === modelIdx;
            m.watch_sizes.forEach((s, sidx) => (s.choosen = idx === modelIdx && sidx === sizeIdx));
        });
        const model = this.watchModels[modelIdx];
        this.steps.model.modelName = model.model_name;
        this.steps.model.modelSize = model.watch_sizes[sizeIdx].watch_size;
    }
    updateSelectedModel(option) {
        this.watchModels.forEach((item) => {
            item.watch_sizes.forEach((s) => (s.choosen = false));
            item.choosen = item.watch_model_name === option;
            if (item.choosen)
                item.watch_sizes[0].choosen = true;
        });
    }
    updateWatchModelSize(option) {
        const clean = option.replace(/\D/g, '');
        this.selectedWatchModelAllSizes?.forEach((size) => {
            size.choosen = size.watch_size === clean;
        });
    }
    updateSelectedFrameColor(option) {
        this.selectedWatchModelFrameColors?.forEach((c) => (c.choosen = c.color_name === option));
    }
    chooseFrameColor(name = '') {
        if (name === '') {
            if (this.selectedWatchModel && !this.selectedWatchModel.frame_colors.find((c) => c.choosen)) {
                this.selectedWatchModel.frame_colors[0].choosen = true;
            }
            return;
        }
        this.selectedWatchModel?.frame_colors.forEach((c) => (c.choosen = c.color_name === name));
    }
    chooseStrapModel(id) {
        this.watchStraps.forEach((s) => (s.choosen = s.attributes.watch_strap.id === id));
        const strap = this.watchStraps.find((s) => s.attributes.watch_strap.id === id);
        if (strap) {
            this.steps.strap.isChoosen = true;
            this.steps.strap.strapName = strap.attributes.watch_strap.strap_title;
            this.steps.strap.strapPrice = strap.attributes.watch_strap.price;
        }
    }
    updateSelectedStrap(title = '') {
        const target = title
            ? this.watchStraps.find((s) => s.attributes.watch_strap.strap_title === title) || this.watchStraps[0]
            : this.watchStraps[0];
        this.watchStraps.forEach((s) => (s.choosen = false));
        if (target)
            target.choosen = true;
    }
    chooseStrapLeatherColor(title) {
        this.selectedStrapModel?.attributes.watch_strap.strap_params.leather_colors.forEach((c) => (c.choosen = c.color_title === title));
    }
    chooseStitchingColor(title) {
        this.selectedStrapModel?.attributes.watch_strap.strap_params.stitching_colors.forEach((c) => (c.choosen = c.color_title === title));
    }
    chooseEdgeColor(title) {
        this.selectedStrapModel?.attributes.watch_strap.strap_params.edge_colors.forEach((c) => (c.choosen = c.color_title === title));
    }
    chooseBuckleColor(title) {
        this.selectedStrapModel?.attributes.watch_strap.strap_params.buckle_colors.forEach((c) => (c.choosen = c.color_title === title));
    }
    chooseAdapterColor(title) {
        this.selectedStrapModel?.attributes.watch_strap.strap_params.adapter_colors.forEach((c) => (c.choosen = c.color_title === title));
    }
    chooseBuckleButterfly() {
        const strap = this.selectedStrapModel;
        if (strap) {
            strap.attributes.watch_strap.buckle_butterfly_choosen = !strap.attributes.watch_strap.buckle_butterfly_choosen;
            this.steps.strapDesign.buckleButterflyChoosen = !!strap.attributes.watch_strap.buckle_butterfly_choosen;
        }
    }
    setClosestReadyDate(str) {
        this.closestReadyDate = str;
    }
    increaseProductAmount() {
        this.productAmount++;
    }
    decreaseProductAmount() {
        if (this.productAmount > 1)
            this.productAmount--;
    }
    updatePromoCodeValue(str) {
        this.promoCode = str;
    }
    promoUse(promo) {
        this.promoAccepted = promo !== null;
        this.usedPromo = promo;
    }
    applyPromo(code) {
        this.updatePromoCodeValue(code);
        if (code.toLowerCase() === 'sale10') {
            this.promoUse({ promoFound: true, type: 'percent', discountValue: 10, code });
        }
        else if (code.toLowerCase() === 'minus500') {
            this.promoUse({ promoFound: true, type: 'ruble', discountValue: 500, code });
        }
        else {
            this.promoUse(null);
        }
    }
    toggleInitials(choosen) {
        this.steps.final.additionalOptions.initials.choosen = choosen;
    }
    setInitialsText(text) {
        this.steps.final.additionalOptions.initials.text = text;
    }
    togglePresentBox(choosen) {
        this.steps.final.additionalOptions.presentBox.choosen = choosen;
    }
    togglePostCard(choosen) {
        this.steps.final.additionalOptions.postCard.choosen = choosen;
    }
    nextStep() {
        if (this.currentStepNum < this.stepsAmount && this.nextStepReady)
            this.currentStepNum += 1;
    }
    prevStep() {
        if (this.currentStepNum > 1)
            this.currentStepNum -= 1;
    }
}
exports.ConfiguratorStore = ConfiguratorStore;
exports.configuratorStore = new ConfiguratorStore();
//# sourceMappingURL=configurator.store.js.map