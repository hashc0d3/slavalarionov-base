import { IsString, IsNumber, IsOptional, IsBoolean, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class InitialsDto {
  @IsBoolean()
  choosen: boolean;

  @IsString()
  @IsOptional()
  text?: string | null;
}

class PresentBoxDto {
  @IsBoolean()
  choosen: boolean;
}

class PostCardDto {
  @IsBoolean()
  choosen: boolean;

  @IsString()
  @IsOptional()
  text?: string | null;
}

class BuckleButterflyDto {
  @IsBoolean()
  available: boolean;

  @IsBoolean()
  choosen: boolean;
}

class PromoDto {
  @IsString()
  code: string;

  @IsBoolean()
  used: boolean;

  @IsNumber()
  discountValue: number;

  @IsString()
  @IsOptional()
  discountValueFull?: string;
}

class DeliveryAddressInfoDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  building?: string;

  @IsString()
  @IsOptional()
  appartament?: string;
}

class DeliveryPointDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  workTime?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

class OrderItemDto {
  @IsString()
  strapModel: string;

  @IsString()
  strapLeatherColor: string;

  @IsString()
  appleWatchModel: string;

  @IsString()
  appleWatchModelSize: string;

  @IsString()
  appleWatchModelColor: string;

  @IsString()
  stitchingColor: string;

  @IsString()
  edgeColor: string;

  @IsString()
  buckleColor: string;

  @IsString()
  adapterColor: string;

  @ValidateNested()
  @Type(() => InitialsDto)
  initials: InitialsDto;

  @ValidateNested()
  @Type(() => PresentBoxDto)
  presentBox: PresentBoxDto;

  @ValidateNested()
  @Type(() => PostCardDto)
  postCard: PostCardDto;

  @ValidateNested()
  @Type(() => BuckleButterflyDto)
  buckleButterfly: BuckleButterflyDto;

  @IsNumber()
  quantity: number;

  @IsNumber()
  productsPrice: number;

  @IsNumber()
  additionalOptionsPrice: number;
}

export class CreateRetailCrmOrderDto {
  @IsString()
  orderNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  receiverFullname: string;

  @IsString()
  email: string;

  @IsString()
  tel: string;

  @IsString()
  deliveryCity: string;

  @IsString()
  deliveryType: string;

  @ValidateNested()
  @Type(() => DeliveryPointDto)
  @IsOptional()
  deliveryPoint?: DeliveryPointDto | null;

  @ValidateNested()
  @Type(() => DeliveryAddressInfoDto)
  @IsOptional()
  deliveryAddressInfo?: DeliveryAddressInfoDto | null;

  @IsString()
  @IsOptional()
  mailAddress?: string;

  @IsString()
  @IsOptional()
  curierAddress?: string;

  @IsString()
  @IsOptional()
  deliveryComment?: string;

  @IsNumber()
  @IsOptional()
  deliveryPrice?: number;

  @ValidateNested()
  @Type(() => PromoDto)
  promo: PromoDto;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  paymentType?: string;
}
