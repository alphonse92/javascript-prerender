mkdir -p prerender/tmp/prerender
mkdir -p redis/
mkdir -p chromium/data
mkdir -p chromium/nats
touch redis/appendonly.aof
docker-compose build