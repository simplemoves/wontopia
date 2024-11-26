import * as child_process from "child_process";
import { getErrorMessage } from "./ErrorHandler";

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
export const trim = (str: string) => str.replace(/\r?\n|\r/, "");

export const spawn = (command: string, args: string[]) => new Promise<boolean>((resolve, reject) => {
    const spawn = child_process.spawn(command, args);

    spawn.stdout.on('data', (data: any) => {
        console.log(trim(data.toString()));
    })

    spawn.stderr.on('data', (error: any) => {
        const error_str = trim(error.toString());
        console.error(error_str);
        reject(Error(error_str));
    })

    spawn.on('exit', code => {
        if (code === 0) {
            resolve(true);
        } else {
            reject(Error(code?.toString()));
        }
    })
});

export class RateLimiter {
    private waitUntil: number;
    private limitTo: number;

    constructor(limit: number = 1200) {
        this.limitTo = limit;
        this.waitUntil = new Date().getTime()
    }

    limit = async () => {
        const now = new Date().getTime();
        if (this.waitUntil < now) {
            this.waitUntil = now + this.limitTo;
            // console.log(`Will run now at: ${now}`);
            return;
        }
        const backoffNow = this.waitUntil - now;
        // console.log(`Will run in: ${backoffNow} at ${this.waitUntil}`);
        this.waitUntil += this.limitTo;
        await wait(backoffNow);
    }
}

export const tryNTimes = async <T> (toTry: () => Promise<T>, times: number = 5, interval: number = 1) => {
    if (times < 1) throw new Error(`Illegal argument 'times' provided: ${times}, should be >= 1`);
    let attemptCount = 0
    while (true) {
        try {
            return await toTry();
        } catch(error) {
            if (++attemptCount >= times) {
                console.error(`The try ${times} times failed with: ${getErrorMessage(error)}`);
                return undefined;
            } else {
                console.warn(`The try ${attemptCount + 1}/${times} failed with: ${getErrorMessage(error)}`);
            }
        }
        await wait(interval)
    }
}