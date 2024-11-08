export interface AuthRegisterDTO {
    account: string,
    password: string,
    fullname: string,
}

export interface AuthLoginDTO {
    account: string,
    password: string
}

export interface AuthGetUserFromTokenDTO {
    token: string,
}