type responseType = {
    cityCode: number;
    cityName: string;
    cityUuid: string;
    country: string;
    countryCode: string;
    kladr: string;
    latitude: number;
    longitude: number;
    region: string;
    subRegion: string;
    regionCode: number;
}[];
export default function (cityName: string): Promise<responseType | null | undefined>;
export {};
