import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckOutDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  photo?: Express.Multer.File;

  @ApiPropertyOptional({ example: 'Finished all tasks for today' })
  @IsOptional()
  @IsString()
  notes?: string;
}
