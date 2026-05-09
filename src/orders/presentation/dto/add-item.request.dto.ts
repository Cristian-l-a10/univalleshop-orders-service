import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddItemRequestDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}