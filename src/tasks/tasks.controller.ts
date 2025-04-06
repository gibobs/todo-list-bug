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
    Put,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    //*************** */
    /// controlador que mostrará todas las tareas
    ///del usuario propietario
    @Get('/allTasks') //he añadido un mapeo para especificar la ruta
    @UseGuards(AuthGuard) //autenticación
    async listTasks(@Request() req) {
        try {
            // Extraemos el ID del usuario desde el token JWT
            const userIdSession = req.user.id;
            // Llamamos al servicio para obtener las tareas del usuario
            const userTasks = await this.tasksService.listTasks(userIdSession);

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
    //controlador que obtendrá el id de la tarea del propietario
    @Get('/:id')
    @UseGuards(AuthGuard) //autenticación del propietario de la tarea
    async getTask(@Param('id') id: string, @Request() req) {
        try {
            // Validamos que el usuario autenticado sea el propietario
            // del id de la  tarea
            const userIdSession = req.user.id;

            if (!id) {
                throw new BadRequestException('Task ID is required.');
            }

            // Llamamos al servicio para obtener la tareas , de diho user, con ese id
            const userIdTask = await this.tasksService.getTask(
                id,
                userIdSession,
            );
            if (!userIdTask) {
                throw new NotFoundException('Task not found.');
            }
            // Devolvemos una respuesta exitosa

            return {
                status: 'success',
                data: userIdTask,
                message: 'We found your task successfully.',
            };
        } catch (error) {
            console.error('Error retrieving task:', error);
            // Si el error es una excepción conocida, la relanzamos
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
        }
    }
    //*************** */
    //controlador que editará la información de una tarea de el propietario
    @Put('/:id/edit')
    @UseGuards(AuthGuard) //autenticación del propietario de la tarea
    async editTask(@Param('id') id: string, @Body() body: any, @Request() req) {
        try {
            // Obtenemos el ID del usuario autenticado
            const userIdSession = req.user.id;
            // Validamos que el ID de la tarea no sea nulo
            if (!id) {
                throw new BadRequestException(
                    'Task ID is required in the URL.',
                );
            }
            // Validamos que el cuerpo de la solicitud contenga los datos necesarios
            if (!body || Object.keys(body).length === 0) {
                throw new BadRequestException(
                    'Task ID is required. Please provide valid data.',
                );
            }

            // Llamamos al servicio para editar la tarea
            const updatedTask = await this.tasksService.editTask(
                id,
                userIdSession,
                body,
            );

            // Devolvemos una respuesta exitosa
            return {
                status: 'success',
                data: updatedTask,
                message: 'Task edited successfully.',
            };
        } catch (error) {
            console.error('Error editing task:', error);
            // Si el error es una excepción conocida, la relanzamos
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
        }
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
    ///
    // //***CONTROLADORES QUE PIENSO QUE HARÍAN
    // FALTA PARA QUE ESTÉ COMPLETA LA APLICACIÓN */
    /////////////////////////////////////////////////////////////////
    // controlador que crea una nueva tarea
    @Post('/createTask')
    async createTask() {
        return this.tasksService.createNewTask();
    }
    // controlador que modifica el estado de un id tarea de false a Done
    @Put('/:id/changeStatus')
    async updateTaskStatus() {
        return this.tasksService.updateTaskStatus();
    }
    // controlador recoje en una lista los id de las tareas cuyo status es Done
    // --> devuelve lista de id Tareas
    @Put('/tasksCompleted')
    async isDone() {
        return this.tasksService.taskIsDone();
    }
    //controlador que obtiene lista de tareas y recoge en las que la fecha es > hoy
    //  --> se mandaría un mensaje + lista de id Tareas atrasadas para que el
    //front las modificara en la interfaz(poniendo un color diferente, por ejemplo)
    @Get('/getOverdueTasks')
    async youAreLateWithDutties() {
        return this.tasksService.taskIsDone();
    }
    //controlador que obtiene lista de tareas y recoge en las que la fecha es < hoy + su status =Done
    //  --> se mandaría un mensaje + lista de id Tareas pendientes para que el
    //front las modificara en la interfaz(poniendo un color diferente, por ejemplo)
    @Get('/pendingTasks')
    async getPendingTasks() {
        return this.tasksService.getPendingTasks();
    }
    //controlador que obtiene lista de tareas y recoge en las que su status =Done
    //  --> se mandaría un mensaje + lista de id Tareas pendientes para que el
    //front las modificara en la interfaz(poniendo un color diferente, por ejemplo)
    @Get('/completedTasks')
    async getCompletedTasks() {
        return this.tasksService.getCompletedTasks();
    }
    //controlador que obtiene una tarea/lista de tareas por su uno de los parámetros
    //que se reciba del usuario ( vease, buscar por título, fecha, etc)
    // --> se mandaría un mensaje + lista de id Tareas correspondientes al filtrado.
    @Get('/searchTasks')
    async searchTasks() {
        return this.tasksService.searchTasks();
    }
}
