import {
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
    async listTasks(userId: string) {
        //añadido try-catch
        try {
            // Validamos que el ID del usuario no esté vacío
            if (!userId) {
                throw new Error('User ID is required.');
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
    // Método para consigue una tarea por su ID
    async getTask(id: string) {
        if (!id) {
            throw new Error('Task ID is required.');
        }
        // Buscamos la tarea por su ID
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .where(`task.id = "${id}"`)
            .getOne();
        if (!task) {
            throw new Error('Task not found.');
        }
        // Devolvemos la tarea encontrada
        return task;
    }
    //**************** */

    async editTask(body: any) {
        await this.tasksRepository.update(body.id, body);

        const editedTask = await this.getTask(body.id);

        return editedTask;
    }
    //**************** */
    // Método para eliminar una tarea por su ID
    async deleteTask(taskId: string, userId: string): Promise<Task> {
        // Verificamos la propiedad de la tarea
        const task = await this.userTasksValidate(taskId, userId);

        // Eliminamos la tarea
        await this.tasksRepository.delete(taskId);

        // Devolvemos la tarea eliminada
        return task;
    }
    //********************* */
    // Método para validar la propiedad de una tarea
    // y el usuario autenticado
    async userTasksValidate(taskId: string, userId: string) {
        // Validamos que el ID de la tarea no esté vacío
        if (!taskId) {
            throw new NotFoundException('Task ID is required.');
        }

        // Buscamos la tarea por su ID
        const task = await this.getTask(taskId);

        // Verificamos si la tarea existe
        if (!task) {
            throw new NotFoundException('Task not found.');
        }
        if (!userId) {
            throw new NotFoundException('User ID is required.');
        }
        // Verificamos que el usuario autenticado sea el propietario de la tarea
        if (task.owner.id !== userId) {
            throw new ForbiddenException(
                'You are not authorized to perform this action on this task.',
            );
        }
        return task;
    }
 /*   async createTask(body: CreateTasksDto, userId: string): Promise<Task> {
        try {
            // Validamos que el ID del usuario no esté vacío
            if (!userId) {
                throw new NotFoundException('User ID is required.');
            }
    
            // Validamos que el cuerpo de la solicitud no esté vacío
            if (!body || !body.title || !body.dueDate) {
                throw new BadRequestException(
                    'Request body, title, and due date are required.',
                );
            }
    
            // Creamos la nueva tarea
            const newTask = this.tasksRepository.create({
                title: body.title,
                description: body.description,
                done: body.done || false, // Por defecto, la tarea no está completada
                dueDate: body.dueDate,
                owner: { id: userId }, // Asociamos la tarea al usuario autenticado
            });
    
            // Guardamos la tarea en la base de datos
            return await this.tasksRepository.save(newTask);
        } catch (error) {
            console.error('Error creating task:', error);
    
            // Manejo de errores específicos
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
    
            // Lanzamos una excepción genérica para errores inesperados
            throw new InternalServerErrorException(
                'An unexpected error occurred while creating the task. Please try again later.',
            );
        }
    }*/
}
