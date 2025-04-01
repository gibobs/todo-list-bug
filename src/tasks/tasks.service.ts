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
        const task = await this.tasksRepository.findOne({
            where: { id, owner: { id: userId } },
        });

        if (!task) {
            throw new ForbiddenException([
                'Task not found or you do not have permission to view it',
            ]);
        }

        return task;
    }

    async editTask(taskData: any, userId: string) {
        const task = await this.getTask(taskData.id, userId);

        if (!task) {
            throw new ForbiddenException([
                'Task not found or you do not have permission to edit it',
            ]);
        }

        await this.tasksRepository.update(taskData.id, taskData);
        return this.getTask(taskData.id, userId);
    }
}
