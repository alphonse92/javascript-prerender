mkdir -p prerender/tmp/prerender
mkdir -p redis/
mkdir -p chromium/data
touch redis/appendonly.aof
docker-compose build