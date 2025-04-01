import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: string) {
        const tasks = await this.tasksRepository.find({
            where: { owner: { id: userId } },
        });
        return tasks;
    }

    async getTask(id: string, userId: string) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.owner.id = :userId', { userId })
            .andWhere('task.id = :id', { id })
            .getOne();

        if (!task) {
            throw new ForbiddenException([
                'Task not found or you do not have permission to view it',
            ]);
        }

        return task;
    }

    async editTask(taskData: any, userId: string) {
        const task = await this.tasksRepository
            .createQueryBuilder()
            .update(Task)
            .set(taskData)
            .where('ownerId = :userId', { userId }) // Usa el nombre real de la columna en la base de datos
            .andWhere('id = :id', { id: taskData.id }) // Usa el nombre real de la columna
            .execute();

        if (task.affected === 0) {
            throw new ForbiddenException([
                'Task not found or you do not have permission to edit it',
            ]);
        }

        return { ...taskData, id: taskData.id };
    }
}
