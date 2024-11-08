import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type PermissionDocument = Permission & Document;

@Schema({collection: "permissions"})
export class Permission {
    _id?: string;
    
    @Prop({required: true})
    permission: string;

}

export let PermissionSchema = SchemaFactory.createForClass(Permission);