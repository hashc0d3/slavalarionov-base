interface response {
    promoFound: boolean;
    type: 'percent' | 'ruble';
    discountValue: number;
    code: string;
}
export default function (code: string): Promise<response | null | Error>;
export {};
