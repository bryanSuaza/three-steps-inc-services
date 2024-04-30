import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  mobilephone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  description: string;
}
