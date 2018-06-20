import { RandomReadable, RandomReadableOptions } from '../random-readable';

describe('emitting data', () => {
    function testDefinedData(testSize: number, done: jest.DoneCallback) {
        const stream: RandomReadable = new RandomReadable({size: testSize});
        let size = 0;

        expect.assertions(1);
        stream
            .on('data', data => {
                size += data.length;
            })
            .on('end', () => {
                expect(size).toBe(testSize);
                done();
            })
            .resume();
    }

    it('should emit no data', (done) => {
        testDefinedData(0, done);
    });

    it('should emit defined data size', (done) => {
        testDefinedData(100, done);
    });

    it('should emit defined data size (exceeding buffer)', (done) => {
        testDefinedData(100000, done);
    });
});

describe('emitting infinite data', () => {
    function testInfiniteData(opts: RandomReadableOptions, done: jest.DoneCallback) {
        const stream: RandomReadable = new RandomReadable(opts);
        const infiniteTest: string = 'infinite test';
        let count = 0;

        stream
            .on('data', data => {
                expect(data.length).toBeGreaterThan(0);
                if (count++ >= 10) {
                    stream.destroy(new Error(infiniteTest));
                }
            })
            .on('error', err => {
                expect(() => { throw err }).toThrowError(infiniteTest);
                done();
            })
            .resume();
    }

    test('when option is not given', (done) => {
        testInfiniteData(undefined, done);
    });

    test('when size option is not given', (done) => {
        testInfiniteData({}, done);
    });

    test('when invalid size is given', (done) => {
        testInfiniteData({ size: -1 }, done);
    });
});

describe('catching errors', () => {
    function testError(error: string, done: jest.DoneCallback) {
        const stream: RandomReadable = new RandomReadable();
        stream
            .on('error', err => {
                expect(() => { throw err }).toThrowError(error);
                done();
            })
            .resume();
    }

    test('when error occurs in randomBytes()', (done) => {
        jest.unmock('crypto');
        const crypto = require.requireActual('crypto');
        const randomBytesError: string = 'randomBytes() error';
        crypto.randomBytes = jest.fn((size, callback) => {
            callback(new Error(randomBytesError));
        });
        testError(randomBytesError, done);
    });
});
