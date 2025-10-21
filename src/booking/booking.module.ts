import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './booking.schema';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RoomsModule } from 'src/rooms/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    RoomsModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
