import { randomBytes } from 'crypto';
import { Readable, ReadableOptions } from 'stream';

export interface RandomReadableOptions extends ReadableOptions {
    size?: number;
}

export class RandomReadable extends Readable {
    private size: number;
    private currentSize: number;

    constructor(opts?: RandomReadableOptions) {
        super(opts);
        if (opts && typeof opts.size === 'number' && opts.size >= 0) {
            this.size = opts.size;
        } else {
            this.size = Infinity;
        }
        this.currentSize = 0;
    }

    public _read(size: number) {
        if (this.currentSize >= this.size) {
            return this.push(null);
        } else if (this.currentSize + size >= this.size) {
            size = this.size - this.currentSize;
        }
        this.currentSize += size;

        randomBytes(size, (err, buf) => {
            if (err) {
                process.nextTick(() => this.emit('error', err));
                return;
            }
            this.push(buf);
        });
    }
}

export function createRandomStream(opts?: RandomReadableOptions): RandomReadable {
    return new RandomReadable(opts);
}
