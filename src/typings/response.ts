export type ResponseSuccess<Data> = {
  success: true
  data: Data
}

export type ResponseError<Error> = {
  success: false
  data: Error
}

export type Response<Data = object, Error = any> =
  | ResponseSuccess<Data>
  | ResponseError<Error>
