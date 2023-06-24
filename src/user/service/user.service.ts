import { BadRequestException, Injectable } from '@nestjs/common';
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
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  async getUsers() {
    const findAll = await this.userRepository.find();

    return this.userRepository.findBy(findAll);
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
