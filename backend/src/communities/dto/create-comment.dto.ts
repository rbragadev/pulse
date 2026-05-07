import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommunityCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
