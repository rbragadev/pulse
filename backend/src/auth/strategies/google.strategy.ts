import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const email: string = emails[0].value;
    const allowedDomain = this.configService.get<string>('ALLOWED_EMAIL_DOMAIN');

    if (!email.endsWith(`@${allowedDomain}`)) {
      return done(new Error('Email domain not allowed'), false);
    }

    const user = await this.authService.findOrCreateUser({
      googleId: id,
      email,
      name: `${name.givenName} ${name.familyName}`,
      avatar: photos[0]?.value,
    });

    done(null, user);
  }
}
