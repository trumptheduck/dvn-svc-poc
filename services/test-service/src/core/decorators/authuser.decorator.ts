import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../schemas/user.schema';
/**
 * Delete unused fields from request body
 * @param {string[]} stripFields An array of field keys as string to remove
 */
export const AuthUser = createParamDecorator(
  (stripFields: string[] = [], ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return (response.locals.user as User)??null;
  },
);