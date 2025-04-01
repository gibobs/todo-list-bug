import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @UseGuards(AuthGuard)
    @Get('')
    async listTasks(@Request() req) {
        const userId = req.user.id;
        return this.tasksService.listTasks(userId);
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getTask(@Param('id') id: string, @Request() req) {
        const userId = req.user.id;
        return this.tasksService.getTask(id, userId);
    }

    @UseGuards(AuthGuard)
    @Post('/edit')
    async editTask(@Body() body: any, @Request() req) {
        const userId = req.user.id;
        return this.tasksService.editTask(body, userId);
    }
}
