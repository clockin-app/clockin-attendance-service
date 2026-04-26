import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AttendancePhoto } from './attendance-photo.entity.js';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  employee_id: string;

  @Column({ type: 'datetime' })
  check_in: Date;

  @Column({ type: 'datetime', nullable: true })
  check_out: Date | null;

  @Index()
  @Column({ type: 'date' })
  work_date: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => AttendancePhoto, (photo) => photo.attendance, {
    cascade: true,
  })
  photos: AttendancePhoto[];

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = uuidv4();
  }
}
