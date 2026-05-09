import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpdateCartItemRequestDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(0)
  quantity!: number;
}