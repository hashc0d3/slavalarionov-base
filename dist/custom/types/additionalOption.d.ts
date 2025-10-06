type additionalOptionsItemType = {
    option_name: string;
    option_title: string;
    option_price: string;
    choosen: boolean;
    option_image: {
        data: {
            attributes: {
                url: string;
            };
        };
    };
};
type additionalOptionsType = additionalOptionsItemType[];
interface additionalOption {
    data: {
        attributes: {
            title: string;
            description: string;
            additional_options: additionalOptionsType;
        };
    };
}
export type { additionalOption as default, additionalOptionsType, additionalOptionsItemType };
