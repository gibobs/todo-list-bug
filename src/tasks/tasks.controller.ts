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
    InternalServerErrorException,
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

            if (!userTasks || userTasks.length === 0) {
                throw new BadRequestException('No tasks found for this user');
            }

            return {
                status: 'success',
                data: userTasks,
                message: 'We found your tasks successfully.',
            };
        } catch (_error) {
            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
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
    @UseGuards(AuthGuard) //autenticación del propietario de la tarea
    async deleteTask(@Body('id') idTask: string, @Request() req) {
        //param renombrado. más intuitivo.
        try {
            // Validamos que el usuario autenticado sea el propietario del id de la  tarea
            const userIdSession = req.user.id;

            // Pasamos la validación y eliminación al
            //  servicio
            const deletedTask = await this.tasksService.deleteTask(
                idTask,
                userIdSession,
            );
            // Devolvemos una respuesta exitosa
            return {
                status: 'success',
                data: deletedTask,
                message: 'Task deleted successfully.',
            };
        } catch (error) {
            console.error('Error deleting task:', error);
            // Si la tarea no fue encontrada, lanzamos una excepción

            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
        }
    }
//**************************** */
@Post('/createTask')
@UseGuards(AuthGuard) // Autenticación
async createTask(@Body() body: CreateTaskDto) {
    try {
        // Validamos que el cuerpo de la solicitud no esté vacío
        if (!body || !body.title || !body.dueDate) {
            throw new BadRequestException(
                'Request body, title, and due date are required.',
            );
        }

        // Invocamos el servicio para crear la tarea
        const newTask = await this.tasksService.createTask(createTaskDto);

        // Devolvemos una respuesta exitosa
        return {
            statusCode: 201,
            data: newTask,
            message: 'Task created successfully.',
        };
    } catch (error) {
        console.error('Error creating task:', error);

        // Si la tarea ya existe (por ejemplo, por un título duplicado)
        if (error.message === 'Task already exists') {
            throw new ConflictException(
                'A task with the same title already exists. Please use a different title.',
            );
        }

        // Para otros errores, lanzamos una excepción genérica
        throw new InternalServerErrorException(
            'An unexpected error occurred while creating the task. Please try again later.',
        );
    }
}
}
