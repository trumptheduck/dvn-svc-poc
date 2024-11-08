import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { EInternalError, ENotFound, EUnprocessableEntity } from 'src/core/models/exception.models';
import { isStringEmpty } from 'src/core/utils/global.utils';
import { PermissionCreateDTO, PermissionUpdateDTO } from './dtos/permission.dtos';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) {}
    async findById(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _permission = await this.permissionModel.findById(id);
            if (!_permission) throw new ENotFound();
            return _permission;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async findAll() {
        try {
            return await this.permissionModel.find()
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async create(dto: PermissionCreateDTO) {
        try {
            const permission: Permission = {
                permission: dto.permission
            }
            return await (new this.permissionModel(permission)).save();
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async update(dto: PermissionUpdateDTO) {
        try {
            const _permission = await this.permissionModel.findByIdAndUpdate(dto._id, dto);
            if (!_permission) throw new ENotFound();
            return await this.permissionModel.findById(_permission._id);
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async delete(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _permission = await this.permissionModel.findByIdAndDelete(id);
            if (!_permission) throw new ENotFound();
            return _permission;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}
