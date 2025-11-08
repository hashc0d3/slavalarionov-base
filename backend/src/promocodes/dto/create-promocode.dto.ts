import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePromoCodeDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  discountPercent?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  discountAmount?: number | null;

  @IsInt()
  @Min(0)
  activationsLeft: number;
}

