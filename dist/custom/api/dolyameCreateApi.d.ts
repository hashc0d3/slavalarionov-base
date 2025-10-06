interface payloadType {
    orderId: string | null;
    phone: string;
    email: string;
    name: {
        firstName: string;
        lastName: string;
        middleName: string;
    };
    amount: number;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}
interface resType {
    status: string;
    amount: number;
    link: string;
    xCorrelationId: string;
    orderId: string;
}
export default function (payload: payloadType): Promise<resType | null | Error>;
export {};
