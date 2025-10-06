"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deliveryTypesList = [
    {
        deliveryType: 'СДЭК до пункта выдачи',
        deliveryTime: 'от 3 дней',
        deliveryPrice: 235,
        value: 'point-delivery',
        available: true
    },
    {
        deliveryType: 'Постамат OmniCDEK',
        deliveryTime: 'от 3 дней',
        deliveryPrice: 235,
        value: 'parcel-locker-omnicdek',
        available: true
    },
    {
        deliveryType: 'СДЭК курьером до двери',
        deliveryTime: 'от 3 дней',
        deliveryPrice: 375,
        value: 'cdek-door-delivery',
        available: true
    },
    {
        deliveryType: 'Почта России 1 класс',
        deliveryTime: '4-6 дней',
        deliveryPrice: 250,
        priceFixed: true,
        value: 'post-office',
        available: true
    },
    {
        deliveryType: 'Доставка курьером по Санкт-Петербургу',
        deliveryPrice: 600,
        priceFixed: true,
        value: 'city-courier-delivery',
        available: true
    },
    {
        deliveryType: 'Самовывоз с производства в Санкт-Петербурге',
        value: 'self-pickup',
        available: true
    }
];
exports.default = deliveryTypesList;
//# sourceMappingURL=deliveryTypesList.js.map