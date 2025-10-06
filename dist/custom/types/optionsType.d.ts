import type selectedDeliveryPoint from '~/types/selectedDeliveryPoint';
import type deliveryAddressInfoType from '~/types/deliveryAddressInfo';
export interface optionsType {
    orderNumber: string;
    strapModel: string;
    strapLeatherColor: string;
    appleWatchModel: string;
    appleWatchModelSize: string;
    appleWatchModelColor: string;
    stitchingColor: string;
    edgeColor: string;
    buckleColor: string;
    adapterColor: string;
    initials: {
        choosen: boolean;
        text: string | null;
    };
    presentBox: {
        choosen: boolean;
    };
    postCard: {
        choosen: boolean;
        text: string | null;
    };
    buckleButterfly: {
        available: boolean;
        choosen: boolean;
    };
    receiverFullname: string;
    email: string;
    tel: string;
    deliveryCity: string;
    deliveryType: string;
    deliveryPoint: selectedDeliveryPoint | null;
    deliveryAddressInfo: deliveryAddressInfoType | null;
    mailAddress: string;
    curierAddress: string;
    deliveryComment: string;
    productsPrice: number;
    additionalOptionsPrice: number;
    deliveryPrice: number | undefined;
    promo: {
        code: string;
        used: boolean;
        discountValue: number;
        discountValueFull: string;
    };
    totalPrice: number;
    paymentType: string;
}
