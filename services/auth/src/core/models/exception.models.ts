import { HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { GrpcInternalException, GrpcInvalidArgumentException, GrpcNotFoundException, GrpcUnauthenticatedException } from "nestjs-grpc-exceptions";

/**
 * ApiException wrap around HttpException for ease of use
 * @param {HttpStatus} status StatusCode of the error
 * @param {string} message Error message to send to client
 * @param {string} [trace] Error stacktrace
 */

export class ApiException extends HttpException {
    rpc: RpcException;
    constructor(status: HttpStatus, message:string, rpc: RpcException, trace?: any) {
        if (trace) {
            super({
                status: status,
                error: message,
                stackTrace: trace
            }, status)
        } else {
            super({
                status: status,
                error: message,
            }, status)
        }
        this.rpc = rpc;
    }
}

export class EForbidden extends ApiException {
    constructor(trace?: any, message: string = "Bạn không có quyền truy cập tài nguyên này!") {
        super(HttpStatus.FORBIDDEN, message, new GrpcUnauthenticatedException(message), trace)
    }
}

export class EInternalError extends ApiException {
    constructor(trace?: any, message: string = "Lỗi máy chủ!") {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message, new GrpcInternalException(message), trace)
        if (trace.status) {
            throw trace;
        }
    }
}

export class EUnauth extends ApiException {
    constructor(trace?: any, message: string = "Tài nguyên yêu cầu Authorization!") {
        super(HttpStatus.UNAUTHORIZED, message, new GrpcUnauthenticatedException(message), trace)
    }
}

export class EBadRequest extends ApiException {
    constructor(trace?: any, message: string = "Request không hợp lệ!") {
        super(HttpStatus.BAD_REQUEST, message, new GrpcInvalidArgumentException(message), trace)
    }
}

export class ENotFound extends ApiException {
    constructor(trace?: any, message: string = "Tài nguyên không tồn tại!") {
        super(HttpStatus.NOT_FOUND, message, new GrpcNotFoundException(message), trace)
    }
}
export class EUnprocessableEntity extends ApiException {
    constructor(trace?: any,reason?: string, message: string = "Dữ liệu gửi không hợp lệ!") {
        super(HttpStatus.UNPROCESSABLE_ENTITY, message+ "( "+ reason+" )", new GrpcUnauthenticatedException(message), trace)
    }
    
    static query(...queries: string[]) {
        return new EUnprocessableEntity(undefined, "Thiếu query " + queries.join(", "))
    }
    static field(...queries: string[]) {
        return new EUnprocessableEntity(undefined, "Thiếu field " + queries.join(", "))
    }
}