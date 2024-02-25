import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const KeyStore = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    return request.keyStore
})