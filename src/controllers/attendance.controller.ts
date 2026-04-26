import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service.js';
import { CheckInDto } from '../dto/check-in.dto.js';
import { CheckOutDto } from '../dto/check-out.dto.js';
import { multerOptions } from '../config/multer.config.js';
import { AttendanceRecord } from '../entities/attendance-record.entity.js';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  @ApiOperation({ summary: 'Clock in and upload selfie as WFH proof' })
  @ApiConsumes('multipart/form-data')
  checkIn(
    @Headers('x-employee-id') employeeId: string,
    @Body() dto: CheckInDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.checkIn(employeeId, dto, file);
  }

  @Post('check-out')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  @ApiOperation({ summary: 'Clock out and upload selfie as WFH proof' })
  @ApiConsumes('multipart/form-data')
  checkOut(
    @Headers('x-employee-id') employeeId: string,
    @Body() dto: CheckOutDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.checkOut(employeeId, dto, file);
  }

  @Get('today')
  @ApiOperation({ summary: "Get today's attendance status" })
  getToday(
    @Headers('x-employee-id') employeeId: string,
  ): Promise<AttendanceRecord | null> {
    return this.attendanceService.getToday(employeeId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get own attendance history (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getHistory(
    @Headers('x-employee-id') employeeId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: AttendanceRecord[]; total: number }> {
    return this.attendanceService.getHistory(employeeId, page, limit);
  }

  @Get('monitor')
  @ApiOperation({ summary: '[HRD_ADMIN] Get all employees attendance records' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getMonitor(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: AttendanceRecord[]; total: number }> {
    return this.attendanceService.getMonitor(page, limit);
  }

  @Get('monitor/:id')
  @ApiOperation({
    summary: '[HRD_ADMIN] Get specific employee attendance records',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getMonitorById(
    @Param('id') employeeId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: AttendanceRecord[]; total: number }> {
    return this.attendanceService.getMonitorById(employeeId, page, limit);
  }
}
