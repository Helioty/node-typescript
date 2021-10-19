export class OracleError extends Error {
    // constructor(
    //     public message: string,
    //     protected code: number = 500,
    //     protected title?: string
    // ) {
    //     super(title);
    //     Error.captureStackTrace(this, this.constructor);
    // }

    constructor(message: string) {
        super();
        const error = Error(message);

        // set immutable object properties
        Object.defineProperty(error, 'message', {
            get() {
                return message;
            },
        });
        Object.defineProperty(error, 'error', {
            get() {
                return 'Oracle Internal Error!';
            },
        });
        Object.defineProperty(error, 'status', {
            get() {
                return 500;
            },
        });
        // capture where error occured
        Error.captureStackTrace(error, OracleError);
        return error;
    }
}
