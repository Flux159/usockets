usockets
---

A universal socket.io wrapper with support for emitAsync (uses Promises and supports async-await syntax) and a request-response system through socket.io-request

Note: As of version 0.0.1, usockets is incomplete and untested. Use at your own risk.

```
npm install usockets
```

Usockets automatically determines which runtime to use (server or client) if running in node or packaging through browserify or webpack and also adds a few useful helper methods to socket.io's API.

emitAsync
---

Request/Response
---

TODO: 
---
- Documentation - what APIs to use server side vs client side (point to socket.io docs for standard apis)
- Write docs on node version support, browser support
- Testing
- Automated test/build process for publishing new versions - specifically babel & webpack dists (also will probably need older node version dists)
- Cleanup

LICENSE
---
The MIT License (MIT)

Copyright (c) 2017 Suyog Sonwalkar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
