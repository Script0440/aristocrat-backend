import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() data: Partial<Booking>) {
    console.log(data);
    return this.bookingService.create(data);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Booking>) {
    return this.bookingService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookingService.delete(id);
  }
}
