export class AppError extends Error {
    statusCode: number
    code: string
    isOperational: boolean
    
    constructor(
        statusCode: number,
        code: string,
        message: string,
        isOperational = true
    ) {
        super(message);

        this.statusCode = statusCode
        this.code = code
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor)
    }
}