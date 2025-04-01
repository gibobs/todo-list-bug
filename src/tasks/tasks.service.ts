import { Injectable } from '@nestjs/common';
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
        const tasks = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.ownerId = :ownerId', { ownerId: userId })
            .getMany();

        return tasks;
    }

    async getTask(id: string, userId: string) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.id = :id', { id })
            .andWhere('task.ownerId = :ownerId', { ownerId: userId })
            .getOne();

        return task;
    }

    async editTask(body: any, userId: string) {
        const task = await this.getTask(body.id, userId);
        if (!task) {
            throw new Error(
                'Task not found or you do not have permission to edit it.',
            );
        }

        await this.tasksRepository.update(body.id, body);

        return this.getTask(body.id, userId);
    }
}
