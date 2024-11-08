import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"
import { AccountType, User, UserDocument } from "./schemas/user.schema";
import { EBadRequest, EInternalError, ENotFound, EUnauth, EUnprocessableEntity } from "src/core/models/exception.models";
import { isStringEmpty } from "src/core/utils/global.utils";
import { UserCreateDTO, UserUpdateDTO } from "./dtos/user.dtos";
import { PasswordUtils } from "src/core/utils/password.utils";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        ) {}

    async findById(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _user = await this.userModel.findById(id);
            if (!_user) throw new ENotFound();
            return _user;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async findAll() {
        try {
            return await this.userModel.find()
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async create(dto: UserCreateDTO) {
        try {
            const passwordHash = await PasswordUtils.hashPassword(dto.password);
            const user: User = {
                account: dto.account,
                accountType: dto.accountType,
                fullname: dto.fullname,
                password: passwordHash,
                email: dto.email,
                phone: dto.phone,
                permissions: []
            }
            return await (new this.userModel(user)).save();
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async update(dto: UserUpdateDTO) {
        try {
            const _user = await this.userModel.findByIdAndUpdate(dto._id, dto);
            if (!_user) throw new ENotFound();
            return await this.userModel.findById(_user._id);
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async delete(id: string) {
        try {
            if (isStringEmpty(id)) throw EUnprocessableEntity.query("id");
            const _user = await this.userModel.findByIdAndDelete(id);
            if (!_user) throw new ENotFound();
            return _user;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}