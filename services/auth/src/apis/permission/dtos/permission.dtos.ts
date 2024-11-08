import { Permission } from "../schemas/permission.schema";

export type PermissionCreateDTO = Omit<Permission, "_id"> 

export type PermissionUpdateDTO = Permission;