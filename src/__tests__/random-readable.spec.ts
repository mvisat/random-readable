import { createRandomStream } from '../random-readable';

function testDefinedData(done: jest.DoneCallback, size: number) {
    const stream = createRandomStream(size);
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

function testInfiniteData(done: jest.DoneCallback, size?: number) {
    const stream = createRandomStream(size);
    const error = new Error('infinite test');
    const N = 100;
    let count = 0;

    stream
        .on('data', data => {
            expect(data.length).toBeGreaterThan(0);
            if (count++ >= N) {
                stream.destroy(error);
            }
        })
        .on('error', err => {
            expect(() => { throw err; }).toThrowError(error);
            done();
        })
        .resume();
}

function testError(done: jest.DoneCallback, error: Error) {
    createRandomStream()
        .on('error', err => {
            expect(() => { throw err; }).toThrowError(error);
            done();
        })
        .resume();
}

describe('stream emits no data', () => {
    test('when size is 0', (done) => {
        testDefinedData(done, 0);
    });
});

describe('stream emits data', () => {
    test('when size is valid', (done) => {
        testDefinedData(done, 1000);
    });
});

describe('stream emits infinite data', () => {
    test('when size is undefined', (done) => {
        testInfiniteData(done);
    });

    test('when size has negative value', (done) => {
        testInfiniteData(done, -1);
    });

    test('when size is NaN', (done) => {
        testInfiniteData(done, NaN);
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
