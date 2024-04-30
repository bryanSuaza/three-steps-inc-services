import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtServices: JwtService,
  ) {}

  async signIn(username: string, passwordIn: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.password !== passwordIn) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };
    const access_token = await this.jwtServices.signAsync(payload);

    return {
      access_token,
    };
  }
}
