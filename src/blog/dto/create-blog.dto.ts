import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsString()
  @IsIn([ 'A', 'I' ])
  status: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  image: string;
}
