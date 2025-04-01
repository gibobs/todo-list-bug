import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { RequestWithUser } from '../interfaces/request.interface';
import { AuthGuard } from '../auth/auth.guard';
import { EditTaskDto } from './dto/edit-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    async listTasks(@Req() req: RequestWithUser) {
        return this.tasksService.listTasks(req.user.id);
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.tasksService.getTask(id, req.user.id);
    }

    @Post('/edit')
    async editTask(
        @Body(ValidationPipe) editTaskDto: EditTaskDto,
        @Req() req: RequestWithUser,
    ) {
        return this.tasksService.editTask(editTaskDto, req.user.id);
    }
}
