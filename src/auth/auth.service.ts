import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserEntity): Promise<UserToken> {
    // Transforma o user em um JWT

    const payload: UserPayload = {
      sub: user.user_id,
      email: user.email,
      name: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (user) {
      // Checar se a senha informada corresponde a hash que está no banco

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new Error('Endereço de email ou senha está incorreto');
  }

  
}
