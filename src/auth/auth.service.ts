import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
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
