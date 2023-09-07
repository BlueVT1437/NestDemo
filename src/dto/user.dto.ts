import { MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'This field must be input' })
  name: string;

  @IsNotEmpty({ message: 'This field must be input' })
  email: string;

  @IsOptional()
  @MinLength(5, { message: 'Password must be longer than 5 characters' })
  password: string;

  @IsOptional()
  role: string[];
}

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'This field must be input' })
  password: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'This field must be input' })
  email: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'Password must be longer than 5 characters' })
  password: string;
}

export class UpdateStatusAccountDto {
  @IsNotEmpty({ message: 'Must input status!' })
  isActive: boolean;
}
