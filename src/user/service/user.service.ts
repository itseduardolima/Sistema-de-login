import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.userRepository.save(createUserDto);

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async getById(id: number) {
    return this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });
  }

  async getByName(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async getByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getById(id);

    if (!user) throw new BadRequestException('Id invalido!');

    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.getById(id);

    if (!user) throw new BadRequestException('id inválido!');
    return this.userRepository.remove(user);
  }
}
