import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KudosModule } from './kudos/kudos.module';
import { RankingModule } from './ranking/ranking.module';
import { DepartmentsModule } from './departments/departments.module';
import { AdminModule } from './admin/admin.module';
import { BadgesModule } from './badges/badges.module';
import { AchievementsModule } from './achievements/achievements.module';
import { SeasonsModule } from './seasons/seasons.module';
import { SocialProfileModule } from './social-profile/social-profile.module';
import { CommunitiesModule } from './communities/communities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    KudosModule,
    RankingModule,
    DepartmentsModule,
    AdminModule,
    BadgesModule,
    AchievementsModule,
    SeasonsModule,
    SocialProfileModule,
    CommunitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
