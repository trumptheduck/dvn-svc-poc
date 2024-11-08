import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { PermissionCreateDTO, PermissionUpdateDTO } from './dtos/permission.dtos';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
    constructor(private permissionService: PermissionService) { }

    @Get("")
    async findById(@Query('id') permissionId) {
        return await this.permissionService.findById(permissionId);
    }

    @Get("all")
    async findAll() {
        return await this.permissionService.findAll();
    }

    @Post("")
    async create(@Body() dto: PermissionCreateDTO) {
        return await this.permissionService.create(dto);
    }

    @Patch("")
    async edit(@Body() dto: PermissionUpdateDTO) {
        return await this.permissionService.update(dto);
    }

    @Delete("")
    async delete(@Query('id') permissionId) {
        return await this.permissionService.delete(permissionId);
    }
}
