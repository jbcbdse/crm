#!/bin/sh

NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript
export NODE_PATH
cd "$(dirname "$0")"
exec node server.js
