import {
    IsString,
    IsBoolean,
    IsNotEmpty,
    IsUUID,
    IsDateString,
} from 'class-validator';

export class EditTaskDto {
    @IsUUID('4', { message: 'id must be a valid UUID' })
    @IsNotEmpty({ message: 'id is required' })
    id: string;

    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @IsBoolean({ message: 'done must be a boolean' })
    done: boolean;

    @IsDateString({}, { message: 'dueDate must be a valid date' })
    @IsNotEmpty({ message: 'dueDate is required' })
    dueDate: string;
}
