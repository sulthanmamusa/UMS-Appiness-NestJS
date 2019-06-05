import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './jwt-payload.interface';
import { UsersDocument } from './users.document';
import { Users } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
  @InjectModel('Users') private readonly usersModel: Model<UsersDocument>,
  private readonly jwtService: JwtService) {}

  async create(user: Users): Promise<UsersDocument> {
	  if(user.roles === 'Admin') {
		  user.roles = ['Admin','User'];
	  }
    const createdUser = new this.usersModel(user);
    return await createdUser.save();
  }
  
  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.findOne(payload._id);
    return user;
  }
  
	async update(_id: string, user: Users): Promise<UsersDocument> {
		delete user._id;
	  if(user.roles === 'Admin') {
		  user.roles = ['Admin','User'];
	  }
	  return await this.usersModel.findOneAndUpdate(_id, user, { new: true });
  }
  
  async findCountAll(): Promise<number> {
    return await this.usersModel.count({}).exec();
  }

  async login(username: string, password: string): Promise<any> {
	  const users = await this.usersModel.find({username,password},{roles:1}).exec();
	  if(users.length) {
		  const user: JwtPayload = { roles: users[0].roles, _id: users[0]._id.toString() };
		  const accessToken = this.jwtService.sign(user);
			return {
			  _id: user._id,
			  roles: user.roles,
			  expiresIn: 3600,
			  token: accessToken,
			};
		
	  } else {
		return false;
	  }
  }

  async findAll(query?: any, projection?: any): Promise<UsersDocument[]> {
	  query = query ? query : {};
	  if(projection) return await this.usersModel.find(query, projection).exec();
	  return await this.usersModel.find(query).exec();
  }

  async findOne(_id: string): Promise<UsersDocument> {
    return await this.usersModel.findOne({_id}).exec();
  }

  async deleteOne(_id: string): Promise<any> {
    return await this.usersModel.deleteOne({_id}).exec();
  }
  
  async deleteAll(): Promise<any> {
    return await this.usersModel.deleteMany({}).exec();
  }
}