import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EUnprocessableEntity, EBadRequest, EInternalError, EUnauth, ENotFound } from 'src/core/models/exception.models';
import { isStringEmpty } from 'src/core/utils/global.utils';
import { PasswordUtils } from 'src/core/utils/password.utils';
import { AuthLoginDTO, AuthRegisterDTO } from './dtos/auth.dtos';
import { User, UserDocument, AccountType } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async register(dto: AuthRegisterDTO) {
        try {
            if (isStringEmpty(dto.account)) throw EUnprocessableEntity.field(".account");
            if (isStringEmpty(dto.password)) throw EUnprocessableEntity.field(".password");
            if (isStringEmpty(dto.fullname)) throw EUnprocessableEntity.field(".fullname");

            const isExist = await this.userModel.exists({account: dto.account});
            if (isExist) throw new EBadRequest(undefined, "Tên đăng nhập đã tồn tại");

            return await this.userService.create({
                account: dto.account,
                fullname: dto.fullname,
                password: dto.password,
                accountType: AccountType.user,
                permissions: []
            })
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async login(dto: AuthLoginDTO) {
        try {
            if (isStringEmpty(dto.account)) throw EUnprocessableEntity.field(".account");
            if (isStringEmpty(dto.password)) throw EUnprocessableEntity.field(".password");

            const user = await this.userModel.findOne({account: dto.account});

            if (!user) throw new EUnauth();

            const isPasswordCorrect = await PasswordUtils.comparePassword(user.password, dto.password);
            if (!isPasswordCorrect) throw new EUnauth();

            return {
                access_token: await this.jwtService.signAsync({
                    _id: user._id,
                    account: user.account,
                    accountType: user.accountType,
                }),
                user: {
                    _id: user._id,
                    account: user.account,
                    accountType: user.accountType,
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,
                }
            }
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async getUserFromToken(token: string) {
        const tokenPayload = await this.jwtService.verifyAsync(token);
        if (!tokenPayload||!tokenPayload._id) throw new ENotFound();
        let user = await this.cacheManager.get<User | null>(tokenPayload._id);
        if (!user) {
            user = await this.userModel.findById(tokenPayload._id);
            await this.cacheManager.set(tokenPayload._id, user, 60000);
            console.log("Cache miss!");
        } else {
            console.log("Cache hit!");
        }
        if (!user) throw new ENotFound();
        return user;
    }
}
