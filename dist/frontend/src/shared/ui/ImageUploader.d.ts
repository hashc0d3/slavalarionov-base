interface ImageUploaderProps {
    onImageUpload: (base64: string) => void;
    currentImage?: string;
    fallbackUrl?: string;
}
export declare const ImageUploader: ({ onImageUpload, currentImage, fallbackUrl }: ImageUploaderProps) => import("react").JSX.Element;
export {};
