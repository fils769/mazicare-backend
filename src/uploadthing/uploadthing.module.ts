import { Module } from '@nestjs/common';
import { UploadThingService } from './uploadthing.service';

@Module({
  providers: [UploadThingService],
  exports: [UploadThingService],
})
export class UploadThingModule {}