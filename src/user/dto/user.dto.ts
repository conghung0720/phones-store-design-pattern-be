import {
  IsNotEmpty,
  Length,
  IsString,
  IsEmail,
  IsBoolean,
  IsEmpty,
} from 'class-validator';
import { Roles } from 'src/constants';

export class UserDto {
  @IsNotEmpty()
  @Length(4, 30)
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsString()
  role: String;
}
