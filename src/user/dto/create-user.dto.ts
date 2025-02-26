import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'The user should take at least 4 characters' })
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsEnum(['admin', 'member'])
  default: 'member';
  role: string;

  @IsString()
  @MinLength(8, { message: 'The password should take at least 8 characters' })
  password: string;
}
