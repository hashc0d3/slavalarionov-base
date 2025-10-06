type buckleButterflyType = {
    choosen: boolean;
    data: {
        attributes: {
            buckle_name: string;
            buckle_price: string;
            choosen: boolean;
            buckle_image: {
                data: {
                    attributes: {
                        url: string;
                    };
                };
            };
        };
    };
};
export type { buckleButterflyType as default };
