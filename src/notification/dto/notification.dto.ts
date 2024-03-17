import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  user_id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum([])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  read_at?: Date;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  source_id?: string;
}

export class UpdateNotificationDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum([])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  read_at?: Date;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  source_id?: string;
}
