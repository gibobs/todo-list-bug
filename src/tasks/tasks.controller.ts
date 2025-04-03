import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
    Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    //*************** */
    /// controlador que mostrará todas las tareas

    @Get('/allTasks') //he añadido un mapeo para especificar la ruta
    @UseGuards(AuthGuard) //autenticación
    async listTasks(@Request() req) {
        try {
            // Extraemos el ID del usuario desde el token JWT
            const userIdForAll = req.user.id;
            // Llamamos al servicio para obtener las tareas del usuario
            const userTasks = await this.tasksService.listTasks(userIdForAll);
            return {
                status: 'success',
                data: userTasks,
            };
        } catch (_error) {
            throw new BadRequestException('Error fetching tasks');
        }
    }
    //*************** */
    @Get('/:id')
    async getTask(@Param('id') id: string) {
        return this.tasksService.getTask(id);
    }
    //*************** */

    @Post('/edit')
    async editTask(@Body() body) {
        return this.tasksService.editTask(body);
    }

    //*************** */

    @Delete('/delete')
    async deleteTask(@Body() body) {
        return this.tasksService.editTask(body);
    }
}
