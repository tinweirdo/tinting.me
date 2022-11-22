import { Response as InternalResponse } from "@netlify/functions/dist/function/response"
import { ErrorCode, ResponseMessage } from "./types"

export class ResponseBody {
  readonly data?: any
  readonly code: ErrorCode
  readonly message: string
  constructor(data?: any, code: ErrorCode = ErrorCode.OK, message: string = ResponseMessage.OK) {
    this.data = data
    this.code = code
    this.message = message
  }

  static new(data?: any, status: ErrorCode = ErrorCode.OK, message: string = ResponseMessage.OK): ResponseBody {
    return new ResponseBody(data, status, message)
  }

  static forbidden(message: string = ResponseMessage.Forbidden): ResponseBody {
    return ResponseBody.new(null, ErrorCode.Forbidden, message)
  }

  static error<T extends Error>(error: T, message: string = error.message): ResponseBody {
    return ResponseBody.new(null, ErrorCode.Unkown, message)
  }

  static notFound(message: string = ResponseMessage.NotFound): ResponseBody {
    return ResponseBody.new(null, ErrorCode.NotFound, message)
  }
}

export class Response implements InternalResponse {
  readonly statusCode: number
  readonly body: string
  readonly headers: { [header: string]: string | number | boolean }
  constructor(body: ResponseBody, statusCode: number, headers: { [header: string]: string | number | boolean } = {}) {
    this.body = JSON.stringify(body)
    this.statusCode = statusCode
    !headers['content-type'] && (headers['content-type'] = 'application/json')
    this.headers = headers
  }
  static new(body: ResponseBody, statusCode: number): Response {
    return new Response(body, statusCode)
  }

  static ok(data?: any): Response {
    return Response.new(ResponseBody.new(data), 200)
  }

  static error<T extends Error>(error: T, message?: string): Response {
    return Response.new(ResponseBody.error(error, message), 500)
  }

  static forbidden(message?: string): Response {
    return Response.new(ResponseBody.forbidden(message), 401)
  }

  static notFound(message?: string): Response {
    return Response.new(ResponseBody.notFound(message), 404)
  }
}
