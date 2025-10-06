type designParamColor = {
    title: string | '';
    name: string | '';
};
type configuratorSteps = {
    model: {
        id: number;
        title: string;
        queryParam: string;
        isChoosen: boolean;
        color: {
            name: string;
            code: string;
        };
        modelName: string | null;
        modelSize: string | null;
    };
    strap: {
        id: number;
        title: string;
        queryParam: string;
        isChoosen: boolean;
        strapName: string | null;
        strapPrice: number | null;
    };
    strapDesign: {
        id: number;
        title: string;
        queryParam: string;
        isChoosen: boolean | null;
        leatherColor: designParamColor;
        stitchingColor: designParamColor;
        edgeColor: designParamColor;
        buckleColor: designParamColor;
        adapterColor: designParamColor;
        price: number | null;
        buckleButterflyChoosen: boolean;
    };
    final: {
        id: number;
        title: string;
        queryParam: string;
        isChoosen: boolean | null;
        additionalOptions: {
            totalPrice: number | null;
            initials: {
                choosen: boolean;
                price: number | null;
                text: string | null;
            };
            presentBox: {
                choosen: boolean;
                price: number | null;
            };
            postCard: {
                choosen: boolean;
                price: number | null;
                text: string | null;
            };
        };
        promo: {
            code: string;
            used: boolean;
            discountValue: number;
            discountValueFull: string;
        };
        email: string;
        phone: string;
        name: {
            firstName: string;
            lastName: string;
            middleName: string;
        };
    };
};
export type { configuratorSteps as default };
