import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('users')
@Unique(['email']) // Asegura que el campo email sea único
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullname: string;

    @Column()
    email: string;

    // Por motivos de simplicidad, vamos a guardar la contraseña en texto plano
    @Column()
    pass: string;

    @OneToMany(() => Task, (task) => task.owner)
    tasks: Task[];
}
