import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(7)
  mobilephone: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  internal_description: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  state: 'I' | 'P' | 'C' | 'D';
}
