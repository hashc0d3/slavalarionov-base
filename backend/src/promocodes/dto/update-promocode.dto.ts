import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoCodeDto } from './create-promocode.dto';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePromoCodeDto extends PartialType(CreatePromoCodeDto) {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  discountPercent?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  discountAmount?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  activationsLeft?: number;
}

