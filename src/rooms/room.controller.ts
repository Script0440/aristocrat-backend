import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RoomsService } from './room.service';
import { Room } from './room.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import type { Express } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateRoom(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    // Преобразуем beds из строки в массив
    if (body.beds) {
      try {
        body.beds = JSON.parse(body.beds);
      } catch {
        body.beds = [];
      }
    }

    const updateData: any = {
      ...body,
      number: body.number ? Number(body.number) : undefined,
      size: body.size ? Number(body.size) : undefined,
      price: body.price ? Number(body.price) : undefined,
      balcony: body.balcony !== undefined ? body.balcony === 'true' : undefined,
      beds: Array.isArray(body.beds)
        ? body.beds
        : body.beds?.split(',') || undefined,
      status: body.status !== undefined ? body.status === 'true' : undefined,
    };

    // Обрабатываем новые файлы
    if (files.mainImage?.[0]) {
      updateData.mainImage = files.mainImage[0].path.replace(/\\/g, '/');
    }

    if (files.images && files.images.length > 0) {
      updateData.images = files.images.map((f) => f.path.replace(/\\/g, '/'));
    }

    console.log('Update room data:', updateData);

    return this.roomsService.update(id, updateData);
  }

  //Создание комнат
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const mainImage = files.mainImage?.[0];
    const images = files.images || [];

    if (body.beds) {
      try {
        body.beds = JSON.parse(body.beds);
      } catch {
        body.beds = [];
      }
    }

    const preparedRoom = {
      ...body,
      number: Number(body.number),
      size: Number(body.size),
      price: Number(body.price),
      balcony: body.balcony === 'true',
      beds: Array.isArray(body.beds) ? body.beds : body.beds?.split(',') || [],
      mainImage: mainImage ? mainImage.path.replace(/\\/g, '/') : null,
      images: images.map((f) => f.path.replace(/\\/g, '/')),
      status: body.status === 'true' || false,
    };

    console.log('Prepared room:', preparedRoom);
    return this.roomsService.create(preparedRoom);
  }

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<Room> {
    return this.roomsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Room> {
    return this.roomsService.remove(id);
  }
}
