import deliveryMailDataType from '@/types/deliveryInfo';
export default function (): Promise<{
    deliveryInfo: deliveryMailDataType;
} | null>;
