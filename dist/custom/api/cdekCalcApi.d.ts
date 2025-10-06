type responseType = {
    price: number;
    minDays: number;
    tariffId: number;
}[];
export default function (cityPostalCode: string): Promise<responseType | null | undefined>;
export {};
