import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../entities/attendance-record.entity.js';
import { AttendancePhoto } from '../entities/attendance-photo.entity.js';
import { AttendanceService } from '../services/attendance.service.js';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, AttendancePhoto])],
  controllers: [AttendanceController],
  providers: [AttendanceService, CloudinaryService],
})
export class AttendanceModule {}
