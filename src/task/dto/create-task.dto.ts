import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'The task should take at least 4 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  estimatedHours: number;

  @IsDateString()
  @IsNotEmpty()
  deadline: string; // TODO: change to date type

  @IsString()
  @IsEnum(['active', 'completed'])
  state: string;

  @IsNumber()
  @IsNotEmpty()
  asignedUsers: number[];

  @IsNumber()
  @IsNotEmpty()
  costPerTask: number;
}
