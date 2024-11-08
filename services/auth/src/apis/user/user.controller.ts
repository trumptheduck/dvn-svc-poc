import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO, UserUpdateDTO } from './dtos/user.dtos';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get("")
    async findById(@Query('id') userId) {
        return await this.userService.findById(userId);
    }

    @Get("all")
    async findAll() {
        return await this.userService.findAll();
    }

    @Post("")
    async create(@Body() dto: UserCreateDTO) {
        return await this.userService.create(dto);
    }

    @Patch("")
    async edit(@Body() dto: UserUpdateDTO) {
        return await this.userService.update(dto);
    }

    @Delete("")
    async delete(@Query('id') userId) {
        return await this.userService.delete(userId);
    }
}
