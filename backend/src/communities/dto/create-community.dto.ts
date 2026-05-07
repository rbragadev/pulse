import { IsString, IsOptional, IsBoolean, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';
}
