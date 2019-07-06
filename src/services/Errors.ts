class InvalidUserError extends Error {
  statusCode: number;

  constructor(public message: string, statusCode: number) {
    super(message);
    this.name = 'Invalid User';
    this.message = (<any> new Error()).stack;
    this.statusCode = statusCode;
  }
}

class InvalidRequestError extends Error {
  statusCode: number;

  constructor(public message: string, statusCode: number) {
    super(message);
    this.name = 'Invalid Request, Please include a query string for user and message';
    this.message = (<any> new Error()).stack;
    this.statusCode = statusCode;
  }
}

class InvalidMessageError extends Error {
  statusCode: number;

  constructor(public message: string, statusCode: number) {
    super(message);
    this.name = 'Invalid Message';
    this.message = (<any> new Error()).stack;
    this.statusCode = statusCode;
  }
}

export { InvalidUserError, InvalidMessageError, InvalidRequestError };
