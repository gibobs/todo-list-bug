import {
   // IsBoolean,
   // isNotEmpty,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';

export class CreateTasksDto {
    @IsNotEmpty({
        message: 'Title is required, please',
    })
    @IsString()
    @MaxLength(50, {
        message: 'Title is too long. Max length is 50 characters',
    })
    title: string;

    @IsString()
    @MaxLength(100, {
        message: 'Description is too long. Max length is 15 characters',
    })
    @IsNotEmpty({
        message: 'Description is required, please',
    })
    description: string;

    on: string;

    @IsNotEmpty({
        message: 'Due date is required, please',
    })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/, {
        message: 'Due date must be in the format YYYY-MM-DD HH:mm:ss.SSS',
    })
    dueDate: string;
}
