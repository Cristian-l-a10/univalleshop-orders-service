import { IsString, IsNotEmpty } from 'class-validator';

export class CheckoutRequestDto {
  @IsString()
  @IsNotEmpty()
  addressId!: string;
}