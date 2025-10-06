type deliveryPointsListItemType = {
    address: string;
    addressComment: string;
    city: string;
    cityCode: number;
    code: string;
    name: string;
    workTime: string;
    type: string;
    postalCode: string;
    phone: string;
    phoneDetails: string;
    coordX: number;
    coordY: number;
};
type deliveryPointsListType = deliveryPointsListItemType[];
export type { deliveryPointsListType as default, deliveryPointsListItemType };
