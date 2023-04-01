import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsOptional,
} from 'class-validator';

export class RegisterUserDto implements Prisma.UserCreateInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  imageUri: string;
}
