import { randomBytes } from 'crypto';
import { Readable } from 'stream';

export function createRandomStream(size?: number): RandomReadable {
    return new RandomReadable(size);
}

class RandomReadable extends Readable {
    private size = Infinity;
    private currentSize = 0;
    private destroyed = false;

    constructor(size?: number) {
        super();

        if (typeof size === 'number' && size >= 0) {
            this.size = size;
        }
    }

    public _read(size: number) {
        if (this.currentSize >= this.size) {
            return this.push(null);
        } else if (this.currentSize + size >= this.size) {
            size = this.size - this.currentSize;
        }
        this.currentSize += size;

        randomBytes(size, (err, buf) => {
            if (this.destroyed)
                return;

            if (err) {
                process.nextTick(() => this.emit('error', err));
                return;
            }
            this.push(buf);
        });
    }

    public _destroy(error: Error | null, callback: (error: Error | null) => void) {
        this.destroyed = true;
        super._destroy(error, callback)
    }
}
