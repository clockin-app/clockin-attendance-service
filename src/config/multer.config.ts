import { BadRequestException } from '@nestjs/common';
import { memoryStorage, FileFilterCallback } from 'multer';
import { Request } from 'express';

export const multerOptions = {
  storage: memoryStorage(),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(new BadRequestException('Only image files are allowed'));
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880'),
  },
};
