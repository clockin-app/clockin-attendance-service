import { BadRequestException } from '@nestjs/common';
import { diskStorage, FileFilterCallback } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const multerOptions = {
  storage: diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const uploadPath = process.env.UPLOAD_PATH ?? './uploads';
      mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const ext = extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
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
