import { IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'This field must be input' })
  title: string;
	
  @IsNotEmpty({ message: 'This field must be input' })
  description: string;
}
