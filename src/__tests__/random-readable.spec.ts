import { createRandomStream, RandomReadableOptions } from '../random-readable';

function testDefinedData(done: jest.DoneCallback, size: number) {
    const stream = createRandomStream({ size: size });
    let current = 0;

    expect.assertions(1);
    stream
        .on('data', data => {
            current += data.length;
        })
        .on('end', () => {
            expect(current).toBe(size);
            done();
        })
        .resume();
}

function testInfiniteData(done: jest.DoneCallback, opts?: RandomReadableOptions) {
    const stream = createRandomStream(opts);
    const error = new Error('infinite test');
    let count = 0;

    stream
        .on('data', data => {
            expect(data.length).toBeGreaterThan(0);
            if (count++ >= 10) {
                stream.destroy(error);
            }
        })
        .on('error', err => {
            expect(() => { throw err }).toThrowError(error);
            done();
        })
        .resume();
}

function testError(done: jest.DoneCallback, error: Error) {
    const stream = createRandomStream();
    stream
        .on('error', err => {
            expect(() => { throw err }).toThrowError(error);
            done();
        })
        .resume();
}

describe('stream emits no data', () => {
    test('when size is 0', (done) => {
        testDefinedData(done, 0);
    });
})

describe('stream emits data', () => {
    test('when size is valid', (done) => {
        testDefinedData(done, 1000);
    });
});

describe('stream emits infinite data', () => {
    test('when option is undefined', (done) => {
        testInfiniteData(done);
    });

    test('when size is omitted', (done) => {
        testInfiniteData(done, {});
    });

    test('when size has negative value', (done) => {
        testInfiniteData(done, { size: -1 });
    });
});

describe('stream emits errors', () => {
    test('when error occured in randomBytes()', (done) => {
        const crypto = require.requireActual('crypto');
        const error = new Error('randomBytes() error');
        crypto.randomBytes = jest.fn((size, callback) => {
            callback(error);
        });
        testError(done, error);
    });
});
