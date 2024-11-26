type ErrorWithMessage = {
    message: string
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    )
}

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
    if (isErrorWithMessage(maybeError)) return maybeError

    try {
        return new Error(printJson(maybeError))
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError))
    }
}

export const getErrorMessage = (error: unknown) => {
    return toErrorWithMessage(error).message
}

export function printJson<T>(obj: T) {
    return JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface BigInt {
    /** Convert to BigInt to string form in JSON.stringify */
    toJSON: () => string;
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};