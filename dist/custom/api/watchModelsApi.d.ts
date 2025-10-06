import watchModelsType from 'types/watchModels';
import additionalOptionType from '@/types/additionalOption';
export default function watchModelsApi(): Promise<{
    watchModels: watchModelsType;
    additionalOption: additionalOptionType;
} | undefined>;
