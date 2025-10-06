"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfiguratorStore = void 0;
const _imports_1 = require("#imports");
const watchModelsApi_1 = __importDefault(require("@/api/watchModelsApi"));
const watchStrapsApi_1 = __importDefault(require("@/api/watchStrapsApi"));
const buckleButterflyApi_1 = __importDefault(require("@/api/buckleButterflyApi"));
const watchStrapParamsApi_1 = __importDefault(require("@/api/watchStrapParamsApi"));
const dolyameCreateApi_1 = __importDefault(require("@/api/dolyameCreateApi"));
exports.useConfiguratorStore = defineStore('configuratorStore', {
    state() {
        return {
            isLoading: true,
            watchModels: null,
            watchStraps: null,
            buckleButterfly: null,
            currentStepNum: 1,
            stepsAmount: 4,
            additionalOption: null,
            steps: {
                model: {
                    id: 1,
                    title: 'Ваша модель часов',
                    queryParam: 'watch-model',
                    isChoosen: false,
                    modelName: null,
                    modelSize: null,
                    color: {
                        name: '',
                        code: ''
                    }
                },
                strap: {
                    id: 2,
                    title: 'Выберите модель ремешка',
                    queryParam: 'strap-model',
                    isChoosen: false,
                    strapName: null,
                    strapPrice: null
                },
                strapDesign: {
                    id: 3,
                    title: 'Создайте уникальный дизайн',
                    queryParam: 'strap-design',
                    isChoosen: null,
                    leatherColor: {
                        title: '',
                        name: ''
                    },
                    stitchingColor: {
                        title: '',
                        name: ''
                    },
                    edgeColor: {
                        title: '',
                        name: ''
                    },
                    buckleColor: {
                        title: '',
                        name: ''
                    },
                    adapterColor: {
                        title: '',
                        name: ''
                    },
                    buckleButterflyChoosen: false,
                    price: null
                },
                final: {
                    id: 4,
                    title: 'Добавьте надпись на ремешок',
                    queryParam: 'final',
                    isChoosen: null,
                    additionalOptions: {
                        totalPrice: 0,
                        initials: {
                            choosen: false,
                            price: null,
                            text: null
                        },
                        presentBox: {
                            choosen: false,
                            price: null
                        },
                        postCard: {
                            choosen: false,
                            price: null,
                            text: null
                        }
                    },
                    promo: {
                        code: '',
                        used: false,
                        discountValue: 0,
                        discountValueFull: ''
                    },
                    email: '',
                    phone: '',
                    name: {
                        firstName: '',
                        lastName: '',
                        middleName: ''
                    }
                }
            },
            finalImages: {
                view1: null,
                view2: null,
                view3: null
            },
            completeImage: null,
            orderPopupVisible: false,
            productAmount: 1,
            deliveryPrice: null,
            closestReadyDate: '',
            orderNumber: null,
            promoCode: null,
            promoAccepted: false,
            usedPromo: null
        };
    },
    actions: {
        async getWatchData() {
            if (this.watchModels === null) {
                const data = await (0, watchModelsApi_1.default)();
                await this.getWatchStrapsData();
                this.watchModels = data?.watchModels ? data.watchModels : [];
                this.additionalOption = data?.additionalOption
                    ? data.additionalOption
                    : null;
                this.steps.final.additionalOptions.initials.price =
                    Number(this.additionalOption?.data.attributes
                        .additional_options[0].option_price) || null;
                this.steps.final.additionalOptions.presentBox.price =
                    Number(this.additionalOption?.data.attributes
                        .additional_options[1].option_price) || null;
                this.steps.final.additionalOptions.postCard.price =
                    Number(this.additionalOption?.data.attributes
                        .additional_options[2].option_price) || null;
                this.isLoading = false;
                return data?.watchModels ? data.watchModels : null;
            }
            return null;
        },
        async getWatchStrapsData() {
            const { watchStraps } = await (0, watchStrapsApi_1.default)();
            const { buckleButterfly } = await (0, buckleButterflyApi_1.default)();
            this.buckleButterfly = buckleButterfly || null;
            if (watchStraps) {
                this.watchStraps = watchStraps;
            }
        },
        async getWatchStrapParams(id) {
            this.isLoading = true;
            const { params } = await (0, watchStrapParamsApi_1.default)(id);
            this.isLoading = false;
            if (params) {
                const target = this.watchStraps?.find((strap) => strap.attributes.watch_strap.id === id);
                if (target) {
                    Object.assign(target.attributes.watch_strap, params);
                    target.dataFetched = true;
                }
            }
        },
        spbPay() {
            const orderData = {
                amount: String(this.totalPriceWithDiscount),
                purpose: `Заказ ремешка ${this.steps.strap.strapName ?? ''} для модели ${this.steps.model.modelName ?? ''}`,
                paymentMode: ['sbp', 'card', 'tinkoff'],
                redirectUrl: 'https://slavalarionov.com/success'
            };
            const popupWindow = window.open();
            fetch('/spb-create.php', {
                method: 'POST',
                body: JSON.stringify(orderData),
                headers: { 'Content-Type': 'application/json' }
            })
                .then((res) => res.json())
                .then((data) => {
                const paymentLink = data?.Data?.paymentLink;
                if (popupWindow && paymentLink) {
                    popupWindow.location = paymentLink;
                }
                else if (popupWindow) {
                    popupWindow.location = 'https://slavalarionov.com/oh-no';
                }
            });
        },
        cardPay() {
            const widget = new cp.CloudPayments();
            widget.pay('charge', {
                publicId: 'pk_b40386c631341a63812676ab67bb0',
                description: `Заказ ремешка ${this.steps.strap.strapName} для модели ${this.steps.model.modelName}`,
                amount: this.totalPriceWithDiscount,
                currency: 'RUB',
                skin: 'mini',
                email: this.steps.final.email,
                configuration: {
                    common: {}
                },
                requireEmail: true
            }, {
                onSuccess: function () {
                    window.open('https://slavalarionov.com/success', '_blank');
                    this.closeOrderPopup();
                },
                onFail: function () {
                    window.open('https://slavalarionov.com/oh-no', '_blank');
                },
                onComplete: function () { }
            });
        },
        dolyamePay(deliveryOptions) {
            const orderItems = [
                {
                    name: `Ремешок ${this.steps.strap.strapName} для модели ${this.steps.model.modelName}`,
                    quantity: 1,
                    price: this.selectedStrapPrice
                }
            ];
            this.additionalOption?.data.attributes.additional_options.forEach((option) => {
                option.choosen &&
                    orderItems.push({
                        name: option.option_title,
                        quantity: 1,
                        price: Number(option.option_price)
                    });
            });
            if (deliveryOptions.deliveryType !== '' &&
                deliveryOptions.deliveryPrice !== 0) {
                orderItems.push({
                    name: deliveryOptions.deliveryType,
                    quantity: 1,
                    price: Number(deliveryOptions.deliveryPrice)
                });
            }
            const orderData = {
                orderId: this.orderNumber,
                phone: this.steps.final.phone,
                email: this.steps.final.email,
                name: this.steps.final.name,
                amount: this.totalPriceWithDiscount,
                items: orderItems
            };
            const popupWindow = window.open();
            (0, dolyameCreateApi_1.default)(orderData).then((res) => {
                if (res && !(res instanceof Error)) {
                    if (popupWindow) {
                        popupWindow.location = res.link;
                    }
                }
                else if (popupWindow) {
                    popupWindow.location = 'https://slavalarionov.com/oh-no';
                }
            });
        },
        chooseWatchModel(modelId, sizeId = 0) {
            if (this.watchModels) {
                this.watchModels.forEach((item, id) => {
                    item.watch_sizes.forEach((sizeItem) => {
                        sizeItem.choosen = false;
                    });
                    if (id === modelId) {
                        item.choosen = true;
                        item.watch_sizes[sizeId].choosen = true;
                        this.steps.model.modelSize =
                            item.watch_sizes[sizeId].watch_size;
                        this.steps.model.modelName = item.model_name;
                        if (!item.frame_colors.find((color) => color.choosen)) {
                            this.chooseFrameColor();
                        }
                    }
                    else {
                        item.choosen = false;
                    }
                });
            }
        },
        updateSelectedModel(option) {
            if (this.watchModels) {
                for (const item of this.watchModels) {
                    item.watch_sizes.forEach((sizeItem) => {
                        sizeItem.choosen = false;
                    });
                    if (item.watch_model_name === option) {
                        item.choosen = true;
                        item.watch_sizes[0].choosen = true;
                    }
                    else {
                        item.choosen = false;
                    }
                }
                if (!this.selectedStrapModel && this.currentStepNum > 2) {
                    this.updateSelectedStrap();
                }
                if (this.selectedWatchModelFrameColors?.length) {
                    this.chooseFrameColor();
                }
            }
        },
        updateWatchModelSize(option) {
            option = option.replace(/\D/g, '');
            if (this.selectedWatchModelAllSizes) {
                for (const item of this.selectedWatchModelAllSizes) {
                    if (option === item.watch_size) {
                        item.choosen = true;
                    }
                    else {
                        item.choosen = false;
                    }
                }
            }
        },
        updateSelectedFrameColor(option) {
            if (this.selectedWatchModelFrameColors) {
                for (const item of this.selectedWatchModelFrameColors) {
                    if (option === item.color_name) {
                        item.choosen = true;
                    }
                    else {
                        item.choosen = false;
                    }
                }
            }
        },
        chooseFrameColor(name = '') {
            if (name === '') {
                if (!this.selectedWatchModel?.frame_colors.find((color) => color.choosen)) {
                    if (this.selectedWatchModel) {
                        this.selectedWatchModel.frame_colors[0].choosen = true;
                    }
                }
            }
            else {
                this.selectedWatchModel?.frame_colors.forEach((color) => {
                    if (color.color_name === name) {
                        color.choosen = true;
                    }
                    else
                        color.choosen = false;
                });
            }
        },
        async chooseStrapModel(id) {
            if (this.watchStraps) {
                const target = this.watchStraps.find((strap) => strap.attributes.watch_strap.id === id);
                if (target?.choosen === false) {
                    this.watchStraps.forEach((strap) => {
                        strap.choosen = false;
                    });
                    target.choosen = true;
                    if (!target.dataFetched) {
                        await this.getWatchStrapParams(id);
                    }
                }
                this.steps.strap.isChoosen = true;
            }
        },
        async updateSelectedStrap(title = '') {
            if (this.selectedWatchModelStraps) {
                const target = title !== ''
                    ? this.selectedWatchModelStraps.data.find((item) => item.attributes.watch_strap.strap_title ===
                        title) || this.selectedWatchModelStraps.data[0]
                    : this.selectedWatchModelStraps.data[0];
                target.choosen = true;
                if (!target.dataFetched) {
                    await this.getWatchStrapParams(target.attributes.watch_strap.id);
                }
                if (this.watchStraps) {
                    this.watchStraps.forEach((item) => {
                        item.choosen = false;
                    });
                    target.choosen = true;
                }
            }
        },
        chooseStrapLeatherColor(title) {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.leather_colors.forEach((color) => {
                    color.choosen = color.color_title === title;
                });
            }
        },
        chooseStitchingColor(title) {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.stitching_colors.forEach((color) => {
                    color.choosen = color.color_title === title;
                });
            }
        },
        chooseEdgeColor(title) {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.edge_colors.forEach((color) => {
                    color.choosen = color.color_title === title;
                });
            }
        },
        chooseBuckleColor(title) {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.buckle_colors.forEach((color) => {
                    color.choosen = color.color_title === title;
                });
            }
        },
        chooseBuckleButterfly() {
            if (this.buckleButterfly) {
                const strap = this.watchStraps?.find((strap) => strap.attributes.watch_strap.id ===
                    this.selectedStrapModel?.attributes.watch_strap.id);
                if (strap) {
                    strap.attributes.watch_strap.buckle_butterfly_choosen =
                        !strap.attributes.watch_strap.buckle_butterfly_choosen;
                }
            }
        },
        chooseAdapterColor(title) {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.adapter_colors.forEach((color) => {
                    color.choosen = color.color_title === title;
                });
            }
        },
        setFinalImage(view, str) {
            this.finalImages[`view${view}`] = str;
        },
        setCompleteImage(str) {
            this.completeImage = str;
        },
        showOrderPopup() {
            this.orderPopupVisible = true;
        },
        closeOrderPopup() {
            this.orderPopupVisible = false;
        },
        increaseProductAmount() {
            this.productAmount++;
        },
        decreaseProductAmount() {
            if (this.productAmount > 1) {
                this.productAmount--;
            }
        },
        setClosestReadyDate(str) {
            this.closestReadyDate = str;
        },
        updatePromoCodeValue(str) {
            this.promoCode = str;
        },
        promoUse(promo) {
            this.promoAccepted = promo !== null;
            this.usedPromo = promo;
        }
    },
    getters: {
        selectedWatchModel() {
            if (this.watchModels) {
                for (const model of this.watchModels) {
                    if (model.choosen) {
                        return model;
                    }
                }
                return null;
            }
            return null;
        },
        isUltraModel() {
            return !!this.selectedWatchModel?.model_name
                .toLocaleLowerCase()
                .includes('ultra');
        },
        selectedWatchModelAllSizes() {
            if (this.selectedWatchModel) {
                return this.selectedWatchModel.watch_sizes;
            }
            return null;
        },
        selectedWatchModelSize() {
            if (this.selectedWatchModelAllSizes) {
                const size = this.selectedWatchModelAllSizes.find((size) => size.choosen) || null;
                return size;
            }
            return null;
        },
        selectedWatchModelFrameColors() {
            if (this.selectedWatchModel) {
                return this.selectedWatchModel.frame_colors;
            }
            return null;
        },
        selectedFrameColor() {
            if (this.selectedWatchModel) {
                const color = this.selectedWatchModel.frame_colors.find((color) => color.choosen) || null;
                return color;
            }
            return null;
        },
        selectedWatchModelStraps() {
            if (this.selectedWatchModel) {
                const res = {
                    data: []
                };
                this.watchStraps?.forEach((i) => {
                    const target = this.selectedWatchModel?.watch_straps.data.find((x) => x.attributes.watch_strap.strap_name ===
                        i.attributes.watch_strap.strap_name) || null;
                    if (target) {
                        res.data.push(i);
                    }
                });
                return res || null;
            }
            return null;
        },
        selectedStrapModel() {
            if (this.selectedWatchModelStraps) {
                return (this.selectedWatchModelStraps.data.find((strap) => strap.choosen) || null);
            }
            return null;
        },
        selectedStrapFrameColorImages() {
            if (this.selectedFrameColor) {
                const view1Image = this.selectedFrameColor.watch_model_color?.data?.attributes?.watch_models_straps_colors?.find((item) => item.strap_name ===
                    this.selectedStrapModel?.attributes.watch_strap
                        .strap_name)?.view_1.data.attributes.url || '';
                const view2Image = this.selectedFrameColor.watch_model_color?.data?.attributes?.watch_models_straps_colors?.find((item) => item.strap_name ===
                    this.selectedStrapModel?.attributes.watch_strap
                        .strap_name)?.view_2.data.attributes.url || '';
                const obj = {
                    view1: view1Image,
                    view2: view2Image
                };
                return obj;
            }
            else {
                return '';
            }
        },
        selectedStrapModelParams() {
            if (this.selectedStrapModel) {
                return this.selectedStrapModel?.attributes.watch_strap
                    .strap_params;
            }
            return null;
        },
        selectedLeatherColor() {
            if (this.selectedStrapModel) {
                return (this.selectedStrapModel?.attributes?.watch_strap?.leather_colors?.find((color) => color.choosen) || null);
            }
            return null;
        },
        selectedStitchingColor() {
            if (this.selectedStrapModel) {
                return (this.selectedStrapModel?.attributes?.watch_strap?.stitching_colors?.find((color) => color.choosen) || null);
            }
            return null;
        },
        selectedEdgeColor() {
            if (this.selectedStrapModel) {
                return (this.selectedStrapModel?.attributes?.watch_strap?.edge_colors?.find((color) => color.choosen) || null);
            }
            return null;
        },
        selectedBuckleColor() {
            if (this.selectedStrapModel) {
                return (this.selectedStrapModel?.attributes?.watch_strap?.buckle_colors?.find((color) => color.choosen) || null);
            }
            return null;
        },
        selectedAdapterColor() {
            if (this.selectedStrapModel) {
                return (this.selectedStrapModel?.attributes?.watch_strap?.adapter_colors?.find((color) => color.choosen) || null);
            }
            return null;
        },
        isStrapParamsSelected() {
            if (this.selectedLeatherColor !== null) {
                return true;
            }
            return false;
        },
        selectedAdditionalOptions() {
            if (this.selectedWatchModel) {
                const arr = [];
                this.additionalOption?.data.attributes.additional_options.forEach((option) => {
                    if (option.choosen)
                        arr.push(option);
                });
                return arr || null;
            }
            return null;
        },
        view1Images() {
            const config = (0, _imports_1.useRuntimeConfig)();
            const arr = [];
            const pushItem = (str) => {
                if (str !== '') {
                    const obj = {
                        src: config.public.API_BASE_URL + str
                    };
                    arr.push(obj);
                }
            };
            pushItem(!this.isUltraModel
                ? this.selectedStrapModel?.attributes.watch_strap.view_1
                    ?.main_image?.data?.attributes?.url || ''
                : this.selectedStrapModel?.attributes.watch_strap.view_1
                    .ultra_main_image.data.attributes.url || '');
            pushItem(this.selectedStrapFrameColorImages.view1);
            pushItem(!this.isUltraModel
                ? this.selectedLeatherColor?.view_1?.data?.attributes.url ||
                    ''
                : this.selectedLeatherColor?.ultra_view_1.data.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedEdgeColor?.view_1?.data?.attributes.url || ''
                : this.selectedEdgeColor?.ultra_view_1?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedAdapterColor?.view_1?.data?.attributes.url ||
                    ''
                : this.selectedAdapterColor?.ultra_view_1?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedBuckleColor?.view_1?.data?.attributes.url ||
                    ''
                : this.selectedBuckleColor?.ultra_view_1?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedStitchingColor?.view_1?.data?.attributes
                    .url || ''
                : this.selectedStitchingColor?.ultra_view_1?.data
                    ?.attributes.url || '');
            return arr;
        },
        view2Images() {
            const config = (0, _imports_1.useRuntimeConfig)();
            const arr = [];
            const pushItem = (str) => {
                if (str !== '') {
                    const obj = {
                        src: config.public.API_BASE_URL + str
                    };
                    arr.push(obj);
                }
            };
            pushItem(!this.isUltraModel
                ? this.selectedStrapModel?.attributes.watch_strap.view_2
                    ?.main_image?.data?.attributes?.url || ''
                : this.selectedStrapModel?.attributes.watch_strap.view_2
                    ?.ultra_main_image?.data?.attributes?.url || '');
            pushItem(!this.isUltraModel
                ? this.selectedLeatherColor?.view_2?.data?.attributes.url ||
                    ''
                : this.selectedLeatherColor?.ultra_view_2?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedEdgeColor?.view_2?.data?.attributes.url || ''
                : this.selectedEdgeColor?.ultra_view_2?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedAdapterColor?.view_2?.data?.attributes.url ||
                    ''
                : this.selectedAdapterColor?.ultra_view_2?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedBuckleColor?.view_2?.data?.attributes.url ||
                    ''
                : this.selectedBuckleColor?.ultra_view_2?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedStitchingColor?.view_2?.data?.attributes
                    .url || ''
                : this.selectedStitchingColor?.ultra_view_2?.data
                    ?.attributes.url || '');
            return arr;
        },
        view3Images() {
            const config = (0, _imports_1.useRuntimeConfig)();
            const arr = [];
            const pushItem = (str) => {
                if (str !== '') {
                    const obj = {
                        src: config.public.API_BASE_URL + str
                    };
                    arr.push(obj);
                }
            };
            pushItem(!this.isUltraModel
                ? this.selectedStrapModel?.attributes.watch_strap.view_3
                    ?.main_image?.data?.attributes?.url || ''
                : this.selectedStrapModel?.attributes.watch_strap.view_3
                    ?.ultra_main_image?.data?.attributes?.url || '');
            pushItem(this.selectedStrapFrameColorImages.view2);
            pushItem(!this.isUltraModel
                ? this.selectedLeatherColor?.view_3?.data?.attributes.url ||
                    ''
                : this.selectedLeatherColor?.ultra_view_3?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedEdgeColor?.view_3?.data?.attributes.url || ''
                : this.selectedEdgeColor?.ultra_view_3?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedAdapterColor?.view_3?.data?.attributes.url ||
                    ''
                : this.selectedAdapterColor?.ultra_view_3?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedBuckleColor?.view_3?.data?.attributes.url ||
                    ''
                : this.selectedBuckleColor?.ultra_view_3?.data?.attributes
                    .url || '');
            pushItem(!this.isUltraModel
                ? this.selectedStitchingColor?.view_3?.data?.attributes
                    .url || ''
                : this.selectedStitchingColor?.ultra_view_3?.data
                    ?.attributes.url || '');
            return arr;
        },
        prevStepQuery() {
            if (this.currentStepNum - 1 > 0) {
                for (const item in this.steps) {
                    const id = this.steps[item].id;
                    if (id === this.currentStepNum - 1) {
                        return this.steps[item]
                            .queryParam;
                    }
                }
                return null;
            }
            else {
                for (const item in this.steps) {
                    const id = this.steps[item].id;
                    if (id === 1) {
                        return this.steps[item]
                            .queryParam;
                    }
                }
                return null;
            }
        },
        nextStepQuery() {
            if (this.currentStepNum !== this.stepsAmount) {
                for (const item in this.steps) {
                    const id = this.steps[item].id;
                    if (id === this.currentStepNum + 1) {
                        return this.steps[item]
                            .queryParam;
                    }
                }
            }
            return null;
        },
        nextStepReady() {
            const steps = this.steps;
            const currentId = this.currentStepNum;
            for (const step in steps) {
                const id = steps[step].id;
                const isStepChoosen = steps[step].isChoosen;
                if (id === currentId && isStepChoosen) {
                    return true;
                }
            }
            return false;
        },
        currentAvailableStep() {
            if (this.steps) {
                let count = 1;
                for (const item in this.steps) {
                    const step = this.steps[item];
                    if (step.isChoosen) {
                        count++;
                    }
                }
                return count;
            }
            return 0;
        },
        selectedStrapPrice() {
            if (this.selectedStrapModel?.attributes) {
                const buckleButterflyPrice = Number(this.selectedStrapModel.attributes.watch_strap
                    .buckle_butterfly_choosen &&
                    this.buckleButterfly?.data.attributes.buckle_price) || 0;
                return (buckleButterflyPrice +
                    this.selectedStrapModel?.attributes.watch_strap.price ||
                    0);
            }
            return 0;
        },
        selectedStrapPriceWithDiscount() {
            const hasDiscount = this.promoAccepted && this.usedPromo;
            if (!hasDiscount) {
                return this.selectedStrapPrice;
            }
            else {
                const discount = this.usedPromo?.type === 'percent'
                    ? this.selectedStrapPrice *
                        this.productAmount *
                        (this.usedPromo.discountValue / 100)
                    : this.usedPromo?.discountValue || 0;
                return this.selectedStrapPrice - discount > 0
                    ? this.selectedStrapPrice - discount
                    : 0;
            }
        },
        additionalOptionsSum() {
            if (this.selectedAdditionalOptions) {
                return this.selectedAdditionalOptions.reduce((acc, item) => acc + Number(item.option_price), 0);
            }
            return 0;
        },
        productsPrice() {
            if (this.selectedStrapModel !== null &&
                this.selectedAdditionalOptions) {
                return this.selectedStrapPrice + this.additionalOptionsSum;
            }
            return 0;
        },
        productsPriceWithDiscount() {
            if (this.selectedStrapModel !== null &&
                this.selectedAdditionalOptions) {
                return (this.selectedStrapPriceWithDiscount +
                    this.additionalOptionsSum);
            }
            return 0;
        },
        totalPrice() {
            return (this.selectedStrapPrice +
                this.additionalOptionsSum +
                (this.deliveryPrice || 0));
        },
        totalPriceWithDiscount() {
            const hasDiscount = this.promoAccepted && this.usedPromo;
            if (!hasDiscount) {
                return this.totalPrice;
            }
            else {
                return (this.selectedStrapPriceWithDiscount +
                    this.additionalOptionsSum +
                    (this.deliveryPrice || 0));
            }
        }
    }
});
//# sourceMappingURL=configuratorStore.js.map