import { IsString } from 'class-validator';

export class CheckPromoCodeDto {
  @IsString()
  code: string;
}

