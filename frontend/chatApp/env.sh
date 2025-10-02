#!/bin/sh

# Create runtime config based on environment variables
cat <<EOF > /usr/share/nginx/html/config/runtime-config.js
window.RUNTIME_CONFIG = {
  WS_URL: '${WS_URL:-ws://localhost:8080}'
};
EOF

echo "Runtime configuration generated"