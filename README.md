# random-readable
Generate a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of random bytes using [crypto.randomBytes](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback).

## Install
```
$ npm install --save random-readable
```
or
```
$ yarn add random-readable
```

## Usage
```js
const RandomReadable = require('random-readable');

const stream = new RandomReadable({ size: 1000 });
stream
    .on('data', data => {})  // chunk of random bytes
    .on('error', err => {})  // emitted errors
    .on('end', () => {});    // no more data
stream.pipe(process.stdout); // outputs 1000 random bytes to stdout

const nullStream = new RandomReadable({ size: 0 });
nullStream.pipe(process.stdout); // outputs nothing
```

### Infinite Stream
```js
const RandomReadable = require('random-readable');

const infiniteStream = new RandomReadable();
infiniteStream.on('data', data => {}); // manipulate infinite chunks of random data
infiniteStream.resume(); // this will cause infinite loop
```

## License
[MIT](LICENSE)
