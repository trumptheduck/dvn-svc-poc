import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { HashedPassword } from "src/core/utils/password.utils";

export enum AccountType {
    user = "user",
    client = "client",
    admin = "admin",
}

export type UserDocument = User & Document;

@Schema({collection: "users"})
export class User {
    _id?: string;
    
    @Prop({required: true})
    account: string;
    @Prop(raw({
        hash: { type: String },
        salt: { type: String }
    }))
    password: HashedPassword

    @Prop({required: true, default: AccountType.client, enum: [AccountType.user, AccountType.client, AccountType.admin]})
    accountType: AccountType;

    @Prop({required: false})
    factoryId?: string;

    @Prop({required: true})
    fullname: string;
    @Prop({required: false})
    email?: string
    @Prop({required: false})
    phone?: string

    @Prop({required: false, default: []})
    permissions: string[]
}

export let UserSchema = SchemaFactory.createForClass(User);