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
const random = require('random-readable');

const stream = random.createRandomStream({ size: 1000 });
stream
    .on('data', data => {})  // chunk of random bytes
    .on('error', err => {})  // emitted errors
    .on('end', () => {});    // no more data
stream.pipe(process.stdout); // outputs 1000 random bytes to stdout

const nullStream = random.createRandomStream({ size: 0 });
nullStream.pipe(process.stdout); // outputs nothing
```

### ES6 import
```js
import { createRandomStream } from 'random-readable';

createRandomStream({ size: 10 }).pipe(process.stdout);
```

### Infinite Stream
```js
const random = require('random-readable');

const infiniteStream = random.createRandomStream();
infiniteStream.on('data', data => {}); // manipulate infinite chunks of random data
infiniteStream.resume(); // this will cause infinite loop
```

## License
[MIT](LICENSE)
