import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../entities/attendance-record.entity.js';
import { AttendancePhoto } from '../entities/attendance-photo.entity.js';
import { AttendanceService } from '../services/attendance.service.js';
import { AttendanceController } from '../controllers/attendance.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, AttendancePhoto])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
