import type { deliveryEnumsType } from './deliveryTypes';
type deliveryMailDataType = {
    data: {
        attributes: {
            delivery_mail_data: {
                label: deliveryEnumsType;
                price: number;
                delivery_time: string;
            };
            closest_delivery_date: string;
        };
    };
};
export type { deliveryMailDataType as default };
