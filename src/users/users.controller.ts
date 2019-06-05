import { Controller, Get, Post, Put, Body, Delete, UseGuards, Param, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Users } from './users.interface';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/user.decorator';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Post('register')
    async createUser(@Body() users: Users) {
        const counts = await this.usersService.findCountAll();
        this.usersService.create(users);
        return true;
    }
    @Post('authenticate')
    async authenticate(@Body() users: Users) {
        const login = await this.usersService.login(users.username,users.password);
        if(login) {
            return login;
        }
        throw new BadRequestException('Invalid user');
    }
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('User')
    @Get()
    async findAll(@CurrentUser() user: Users): Promise<any[]> {
		if(user.roles[0] === 'User'){
			return await this.usersService.findAll({_id:user._id});
		}
        return await this.usersService.findAll();
    }

    @Get('test')
    async findAllTest(): Promise<any[]> {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('User')
    @Get(':_id')
    async findOne(@Param() users, @CurrentUser() user: Users): Promise<any> {
		if(users._id === user._id || user.roles.includes('Admin')){
			return this.usersService.findOne(users._id);
		}
		return new BadRequestException('Invalid user');
    }
	
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('User')
    @Put(':_id')
    async updateOne(@Param() users, @Body() body: Users, @CurrentUser() user: Users): Promise<any> {
		if(users._id === user._id || user.roles.includes('Admin')){
			return this.usersService.update(users._id, body);
		}
		return new BadRequestException('Invalid user');
    }

    @Delete(':_id')
    async deleteOne(@Param() users): Promise<any> {
        return this.usersService.deleteOne(users._id);
    }
	
    @Delete()
    async deleteAll(): Promise<any> {
        return this.usersService.deleteAll();
    }
}
