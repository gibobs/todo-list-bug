import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Equal, Repository } from 'typeorm';
//import { CreateTasksDto } from './create-task-dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    //**************** */
    // Método para obtener la lista de tareas de un usuario
    async listTasks(userId: string) {
        try {
            // Validamos que el ID del usuario no sea nulo
            if (!userId) {
                throw new NotFoundException('User ID is required.');
            }

            // Filtramos las tareas por el ID del usuario (owner)
            return this.tasksRepository.find({
                where: { owner: Equal(userId) },
            });
        } catch (error) {
            console.error('Error listing tasks:', error);
            throw new Error(
                'An unexpected error occurred while listing tasks.',
            );
        }
    }

    //**************** */
    // Método para conseguir una tarea por su ID
    async getTask(taskId: string, userId: string) {
        try {
            // Validamos la propiedad de la tarea
            const isAuthorized = await this.userTasksValidate(taskId, userId);

            if (isAuthorized == true) {
                console.log('User is authorized to access this task.');

                // Buscamos y devolvemos la tarea
                const task = await this.tasksRepository.findOne({
                    where: { id: taskId },
                    relations: ['owner'],
                });

                //validamos que se haya encontrado la tarea
                if (!task) {
                    throw new NotFoundException('Task not found.');
                }

                return {
                    status: 'success',
                    data: task,
                    message: 'We found your task successfully.',
                };

                //si el propietario no es el mismo que el del id de la tarea
            } else {
                console.log('User is not authorized to access this task.');
                throw new ForbiddenException(
                    'You are not authorized to access this task.',
                );
            }
        } catch (error) {
            console.error('Error retrieving task:', error);
            // Si el error es una excepción conocida, la relanzamos
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException
            ) {
                throw error;
            }

            // Para otros errores, lanzamos una excepción genérica
            throw new Error(
                'An unexpected error occurred while retrieving the task.',
            );
        }
    }

    //**************** */
    // Método que edita el contenido de una tarea de un propietario
    async editTask(
        taskId: string,
        userId: string,
        updateData: any,
    ): Promise<Task> {
        try {
            // Validamos la propiedad de la tarea
            const isAuthorized = await this.userTasksValidate(taskId, userId);

            // Validamos que el cuerpo de la solicitud contenga datos para actualizar
            if (!updateData || Object.keys(updateData).length === 0) {
                throw new BadRequestException(
                    'Update data is required. Empty updates are not allowed.',
                );
            }

            // Validamos que los campos no estén vacíos
            if (
                ('title' in updateData && updateData.title.trim() === '') ||
                ('description' in updateData &&
                    updateData.description.trim() === '')
            ) {
                throw new BadRequestException(
                    'Fields cannot be empty. Please provide valid data.',
                );
            }
            if (isAuthorized == true) {
                console.log('User is authorized to access this task.');

                // Buscamos y devolvemos la tarea
                const task = await this.tasksRepository.findOne({
                    where: { id: taskId },
                    relations: ['owner'],
                });

                //validamos que se haya encontrado la tarea
                if (!task) {
                    throw new NotFoundException('Task not found.');
                }

                // Actualizamos la tarea con los datos proporcionados
                await this.tasksRepository.update(taskId, updateData);

                // Devolvemos la tarea actualizada
                const updatedTask = await this.tasksRepository.findOne({
                    where: { id: taskId },
                    relations: ['owner'],
                });

                return updatedTask;

                //si el propietario no es el mismo que el del id de la tarea
            } else {
                console.log('User is not authorized to access this task.');
                throw new ForbiddenException(
                    'You are not authorized to access this task.',
                );
            }
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
            // Para otros errores, lanzamos una excepción genérica
            throw new Error(
                'An unexpected error occurred while retrieving the task.',
            );
        }
    }

    //**************** */
    // Método para eliminar una tarea por su ID siempre por el propietario
    async deleteTask(taskId: string, userId: string): Promise<Task> {
        try {
            // Validamos la propiedad de la tarea
            const isAuthorized = await this.userTasksValidate(taskId, userId);

            if (isAuthorized == true) {
                console.log('User is authorized to access this task.');

                // Buscamos la tarea antes de eliminarla
                const task = await this.tasksRepository.findOne({
                    where: { id: taskId },
                });

                if (!task) {
                    throw new NotFoundException('Task not found.');
                }

                // Eliminamos la tarea
                await this.tasksRepository.delete(taskId);

                console.log('Task deleted successfully.');

                return task;
            } else {
                console.log('User is not authorized to access this task.');
                throw new ForbiddenException(
                    'You are not authorized to access this task.',
                );
            }
        } catch (error) {
            console.error('Error deleting task:', error);

            // Si el error es una excepción conocida, la relanzamos
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException
            ) {
                throw error;
            }
        }
    }

    //**************** */
    // Método para validar la propiedad de una tarea y el usuario autenticado
    async userTasksValidate(taskId: string, userId: string): Promise<boolean> {
        if (!taskId) {
            throw new NotFoundException('Task ID is required.');
        }

        if (!userId) {
            throw new NotFoundException('User ID is required.');
        }

        // Buscamos la tarea por su ID
        const task = await this.tasksRepository.findOne({
            where: { id: taskId },
            relations: ['owner'], // Incluimos la relación con el propietario
        });

        if (!task) {
            throw new NotFoundException('Task not found.');
        }

        // Verificamos que el usuario autenticado sea el propietario de la tarea
        if (task.owner.id !== userId) {
            throw new ForbiddenException(
                'You are not authorized to perform this action on this task.',
            );
        }

        return true;
    }

    // //***MÉTODOS PENDIENTES DE IMPLANTAR */
    /////////////////////////////////////////////////////////////////
    //**************** */
    createNewTask() {
        throw new Error('Method not implemented.');
    }
    updateTaskStatus() {
        throw new Error('Method not implemented.');
    }

    getPendingTasks() {
        throw new Error('Method not implemented.');
    }

    getCompletedTasks() {
        throw new Error('Method not implemented.');
    }

    searchTasks() {
        throw new Error('Method not implemented.');
    }

    taskIsDone() {
        throw new Error('Method not implemented.');
    }
}
