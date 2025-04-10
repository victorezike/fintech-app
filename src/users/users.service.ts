// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const user = this.usersRepository.create(createUserDto);
//     return this.usersRepository.save(user);
//   }

//   async findOne(id: number) {
//     return this.usersRepository.findOne({ where: { id } }) ?? undefined;
//   }

//   async findByEmail(email: string) {
//     return this.usersRepository.findOne({ where: { email } });
//   }

//   async updateBalance(id: number, balance: number): Promise<void> {
//     await this.usersRepository.update(id, { balance });
//   }
// }






// src/users/users.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async create(name: string, email: string, password: string): Promise<User> {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = this.usersRepository.create({ name, email, password: hashedPassword });
//     return this.usersRepository.save(user);
//   }

//   async findOne(id: number): Promise<User | undefined> {
//     return this.usersRepository.findOne({ where: { id }, relations: ['transactions'] });
//   }

//   async findByEmail(email: string): Promise<User | undefined> {
//     return this.usersRepository.findOne({ where: { email } });
//   }

//   async update(id: number, updateData: Partial<User>): Promise<User> {
//     const user = await this.findOne(id);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     Object.assign(user, updateData);
//     return this.usersRepository.save(user);
//   }
// }




// src/users/users.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async create(name: string, email: string, password: string): Promise<User> {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = this.usersRepository.create({ name, email, password: hashedPassword });
//     return this.usersRepository.save(user);
//   }

//   async findOne(id: number): Promise<User | null> {
//     return this.usersRepository.findOne({ where: { id }, relations: ['transactions'] });
//   }

//   async findByEmail(email: string): Promise<User | null> {
//     return this.usersRepository.findOne({ where: { email } });
//   }

//   async update(id: number, updateData: Partial<User>): Promise<User> {
//     const user = await this.findOne(id);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     Object.assign(user, updateData);
//     return this.usersRepository.save(user);
//   }

//   async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
//     return bcrypt.compare(password, hashedPassword);
//   }
// }





// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ name, email, password: hashedPassword, balance: 0 });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> { // Changed from User | undefined to User | null
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> { // Changed from User | undefined to User | null
    return this.usersRepository.findOne({ where: { id } });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}