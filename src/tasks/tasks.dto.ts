import {
    IsBoolean,
    IsDateString,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class EditTaskDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    done?: boolean;

    @IsDateString()
    @IsOptional()
    dueDate?: string;
}
