import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
	if(!request.headers.authorization){
		return false;
	}
	request.user = this.validateToken(request.headers.authorization); 
    const user = request.user;
    const hasRole = () => user.roles.some(role => !!roles.find(item => item === role));

    return user && user.roles && hasRole();
  }
  
  validateToken(auth: string){
    if(auth.split(' ')[0] !== 'Bearer'){
        throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }const token= auth.split(' ')[1];
    try{
        const decoded = jwt.verify(token, 'secretKey');
        return decoded;
    }catch(err){
        const message = 'Token error: ' + (err.message || err.name);
        throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
