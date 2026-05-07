import { Module } from '@nestjs/common';
import { SocialProfileService } from './social-profile.service';
import { SocialProfileController } from './social-profile.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SocialProfileController],
  providers: [SocialProfileService],
  exports: [SocialProfileService],
})
export class SocialProfileModule {}
