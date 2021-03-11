import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash, compare } from 'bcryptjs';
import { User } from './entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../auth/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, name, password } = createUserDto;

      const hashedPassword = await hash(password, 8);

      const user = this.create({
        name,
        email,
        avatar: '1OEwCekHdEVCcK3qVY2spqvBU3tfKYDvi',
        password: hashedPassword,
      });

      await User.save(user);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async findUser(id: String): Promise<User> {
    try {
      const user = await User.findOne({ where: { id } });

      delete user.password;

      return user;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar o usuário no banco de dados',
      );
    }
  }

  async checkCredentials(loginDto: LoginDto): Promise<User> {
    try {
      const { email, password } = loginDto;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Email ou senha incorretos!');
      }

      const passwordMatched = await compare(password, user.password);

      if (!passwordMatched) {
        throw new UnauthorizedException('Email ou senha incorretos!');
      }

      delete user.password;
      delete user.created_at;
      delete user.updated_at;

      return user;
    } catch {
      throw new InternalServerErrorException('Erro ao realizar o login');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { name, avatar, oldPassword, newPassword } = updateUserDto;

      const user = await User.findOne({ where: { id } });

      user.name = name ? name : user.name;

      user.avatar = avatar ? avatar : user.avatar;

      if (oldPassword && newPassword) {
        const passwordMatched = await compare(oldPassword, user.password);

        if (!passwordMatched) {
          throw new UnauthorizedException('Senha antiga incorreta!');
        }

        if (newPassword.length < 6) {
          throw new UnauthorizedException(
            'A nova senha deve conter 6 caracteres ou mais!',
          );
        }

        const hashedPassword = await hash(newPassword, 8);

        user.password = hashedPassword;
      }

      await user.save();

      delete user.password;
      delete user.created_at;
      delete user.updated_at;

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }
}
