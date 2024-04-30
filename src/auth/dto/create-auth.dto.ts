import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  password: string;
}
