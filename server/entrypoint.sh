# -----------------------------------------------------------------------------
# Brew & Co. — Backend entrypoint script
# -----------------------------------------------------------------------------
# Runs Prisma migrations then starts the Express server. Used by docker-compose.
# -----------------------------------------------------------------------------

#!/bin/sh
set -e

npx prisma migrate deploy
node prisma/seed.js
node server.js
