import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AttendanceRecord } from './attendance-record.entity.js';

export enum PhotoType {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
}

@Entity('attendance_photos')
export class AttendancePhoto {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  attendance_id: string;

  @Column({ type: 'varchar', length: 500 })
  photo_url: string;

  @Column({ type: 'enum', enum: PhotoType })
  photo_type: PhotoType;

  @CreateDateColumn()
  uploaded_at: Date;

  @ManyToOne(() => AttendanceRecord, (record) => record.photos)
  @JoinColumn({ name: 'attendance_id' })
  attendance: AttendanceRecord;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = uuidv4();
  }
}
