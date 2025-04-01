import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditTaskDto } from './tasks.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @UseGuards(AuthGuard)
    @Get('')
    async listTasks(@Request() req) {
        try {
            const userId = req.user.id;
            return await this.tasksService.listTasks(userId);
        } catch (error) {
            throw new InternalServerErrorException(
                'An error occurred while listing tasks.',
                error.message,
            );
        }
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getTask(@Param('id') id: string, @Request() req) {
        try {
            const userId = req.user.id;
            const task = await this.tasksService.getTask(id, userId);
            if (!task) {
                throw new NotFoundException(
                    'Task not found or you do not have permission to view it.',
                );
            }
            return task;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An error occurred while fetching the task.',
            );
        }
    }

    @UseGuards(AuthGuard)
    @Post('/edit')
    async editTask(@Body() body: EditTaskDto, @Request() req) {
        try {
            const userId = req.user.id;
            const task = await this.tasksService.editTask(body, userId);
            if (!task) {
                throw new ForbiddenException(
                    'You do not have permission to edit this task.',
                );
            }
            return task;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An error occurred while editing the task.',
            );
        }
    }
}
