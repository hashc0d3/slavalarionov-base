import { IsString, IsNumber, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  paymentMode?: string[];

  @IsString()
  @IsOptional()
  redirectUrl?: string;
}

