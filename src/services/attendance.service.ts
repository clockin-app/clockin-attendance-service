import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AttendanceRecord,
  AttendanceStatus,
} from '../entities/attendance-record.entity.js';
import {
  AttendancePhoto,
  PhotoType,
} from '../entities/attendance-photo.entity.js';
import { CheckInDto } from '../dto/check-in.dto.js';
import { CheckOutDto } from '../dto/check-out.dto.js';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly recordRepo: Repository<AttendanceRecord>,
    @InjectRepository(AttendancePhoto)
    private readonly photoRepo: Repository<AttendancePhoto>,
  ) {}

  async checkIn(
    employeeId: string,
    dto: CheckInDto,
    file?: Express.Multer.File,
  ): Promise<AttendanceRecord> {
    const today = this.getTodayDate();

    const existing = await this.recordRepo.findOne({
      where: { employee_id: employeeId, work_date: today },
    });
    if (existing) {
      throw new BadRequestException('Already checked in today');
    }

    const now = new Date();
    const record = this.recordRepo.create({
      employee_id: employeeId,
      check_in: now,
      work_date: today,
      status: this.resolveStatus(now),
      notes: dto.notes ?? null,
    });
    await this.recordRepo.save(record);

    if (file) {
      const photo = this.photoRepo.create({
        attendance_id: record.id,
        photo_url: `uploads/${file.filename}`,
        photo_type: PhotoType.CHECK_IN,
      });
      await this.photoRepo.save(photo);
      record.photos = [photo];
    } else {
      record.photos = [];
    }
    return record;
  }

  async checkOut(
    employeeId: string,
    dto: CheckOutDto,
    file?: Express.Multer.File,
  ): Promise<AttendanceRecord> {
    const today = this.getTodayDate();

    const record = await this.recordRepo.findOne({
      where: { employee_id: employeeId, work_date: today },
      relations: ['photos'],
    });

    if (!record) {
      throw new BadRequestException('No check-in found for today');
    }
    if (record.check_out) {
      throw new BadRequestException('Already checked out today');
    }

    record.check_out = new Date();
    if (dto.notes) record.notes = dto.notes;
    await this.recordRepo.save(record);

    if (file) {
      const photo = this.photoRepo.create({
        attendance_id: record.id,
        photo_url: `uploads/${file.filename}`,
        photo_type: PhotoType.CHECK_OUT,
      });
      await this.photoRepo.save(photo);
      record.photos = [...(record.photos ?? []), photo];
    }

    return record;
  }

  async getToday(employeeId: string): Promise<AttendanceRecord | null> {
    return this.recordRepo.findOne({
      where: { employee_id: employeeId, work_date: this.getTodayDate() },
      relations: ['photos'],
    });
  }

  async getHistory(
    employeeId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: AttendanceRecord[]; total: number }> {
    const [data, total] = await this.recordRepo.findAndCount({
      where: { employee_id: employeeId },
      relations: ['photos'],
      order: { work_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getMonitor(
    page = 1,
    limit = 10,
  ): Promise<{ data: AttendanceRecord[]; total: number }> {
    const [data, total] = await this.recordRepo.findAndCount({
      relations: ['photos'],
      order: { work_date: 'DESC', created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getMonitorById(
    employeeId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: AttendanceRecord[]; total: number }> {
    const employee = await this.recordRepo.findOne({
      where: { employee_id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(
        'No attendance records found for this employee',
      );
    }

    const [data, total] = await this.recordRepo.findAndCount({
      where: { employee_id: employeeId },
      relations: ['photos'],
      order: { work_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private resolveStatus(checkInTime: Date): AttendanceStatus {
    const totalMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();
    if (totalMinutes < 9 * 60)  return AttendanceStatus.PRESENT;
    if (totalMinutes < 12 * 60) return AttendanceStatus.LATE;
    return AttendanceStatus.HALF_DAY;
  }
}
