import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommunityPostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}
