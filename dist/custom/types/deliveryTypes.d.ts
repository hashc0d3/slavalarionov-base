type deliveryEnumsType = 'СДЭК до пункта выдачи' | 'Постамат OmniCDEK' | 'СДЭК курьером до двери' | 'Почта России 1 класс' | 'Я покупаю подарочный сертификат' | 'Доставка курьером по Санкт-Петербургу' | 'Самовывоз с производства в Санкт-Петербурге' | '';
type deliveryValuesEnumsType = 'point-delivery' | 'parcel-locker-omnicdek' | 'cdek-door-delivery' | 'post-office' | 'gift-certificate' | 'city-courier-delivery' | 'self-pickup';
type deliveryListItemType = {
    deliveryType: deliveryEnumsType;
    deliveryTime?: string;
    deliveryPrice?: number;
    priceFixed?: boolean;
    value: deliveryValuesEnumsType;
    available: boolean | ComputedRef<boolean>;
};
type deliveryListType = deliveryListItemType[];
export type { deliveryListType as default, deliveryListItemType, deliveryEnumsType, deliveryValuesEnumsType };
