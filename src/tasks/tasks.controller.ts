import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @UseGuards(AuthGuard)
    @Get('')
    async listTasks() {
        return this.tasksService.listTasks();
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getTask(@Param('id') id: string) {
        return this.tasksService.getTask(id);
    }

    @UseGuards(AuthGuard)
    @Post('/edit')
    async editTask(@Body() body) {
        return this.tasksService.editTask(body);
    }
}
