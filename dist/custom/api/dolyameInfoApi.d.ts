interface payloadType {
    xCorrelationId: string;
    orderId: string;
}
interface resType {
    status: string;
    amount: number;
    link: string;
}
export default function (payload: payloadType): Promise<resType | null | Error>;
export {};
