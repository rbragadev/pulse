import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUser(googleUser: GoogleUser) {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        googleId: googleUser.googleId,
      });
    } else if (!user.googleId) {
      user = await this.usersService.update(user.id, {
        googleId: googleUser.googleId,
        avatar: googleUser.avatar,
      });
    }

    return user;
  }

  generateToken(user: { id: string; email: string; role: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
