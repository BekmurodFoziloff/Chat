import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Message } from '../messages/message.entity';
import User from '../users/user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @OneToMany(() => Message, (message) => message.room)
  public messages: Message[];

  @ManyToOne(() => User, (user) => user.rooms)
  public owner: User;

  @ManyToMany(() => User, (user) => user.joinedRooms)
  @JoinTable()
  public members: User[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}

export default Room;
