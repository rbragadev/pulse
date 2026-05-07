import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateKudosDto {
  @IsString()
  @MinLength(10)
  message: string;

  @IsUUID()
  recipientId: string;

  @IsUUID()
  categoryId: string;
}
