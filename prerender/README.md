# Javascript prerender

Javascript prerender is a microservice to prerendering javascript single pages, without care about javascript technology.


# Prerequisites

## using with docker
1. docker
2. docker-compose

## using without docker

1. node 8 or greater
2. npm
3. google chorme or chromium distribution (let call it just chromium)


# Installlation

before all, create the folder ./tmp/prerender

## using docker
```sh
docker-compose build prerender
```

## without docker
```sh
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install .
```


# Run 

## with docker
```sh
  docker-compose up prerender
```
## without docker

**Atention** before all, you need open a debug websocket from chrome or chromium

1. open the chromium debug websocket
2. according your environment, update your config file in config folder and add the chromium attribute with the url to your chromium instance. For example, if you open the web socket using the port '9999' the url will be localhost:9999
3. open chromium
4. run
 ```sh
  #If you want change the NODE_ENV value, it is only an example
  NODE_ENV=development npm start
  #if you want to start with nodemon
  NODE_ENV=development npm run-script dev
```

# Documentation

## Environment vars

you can set the next env vars, or modify the config files in ./config/[env]/index.js (replace [env] with your NODE_ENV value, local is by default) according the next var list:

1. env: [optional] [default='development']
2. target: [required] url of web that you want to prerenderize
3. domain: [optional] [default='www.miwebsite.com'] your domain name
4. hostname: [optional] [default='localhost'] your hostname
5. port: [optional] [default=3000]  prerender port to listen
6. debug: [optional] [default=true] enable/disable debug (show data at console)
7. cache: [optional] [default=604800000] tls of prerender cache, if cache=0 then it will not cached
8. userAgent: [optional] [default='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36']
9. cache_path: [optional] [default='./tmp/prerender/'] path to your cache folder
10. chromium: [optional] [default='http://localhost:9222'] url to your chromium instance, accept websocket uri
11. header_target: [optional] [default='x-prerender-target'] if this header is present it will force to change the target of your web that you want to prerenderice

# Development state

I seeking for contributors. 

## To inprove

1. Add a way to specify puppeteer request headers
2. improve cache system 
3. Use redis instead of memory-cache
4. Create a gateway
5. Create tests

## No tested behavior

We need test the next:

1. when run in development mode
2. when run in local env
3. when run in production env
4. when run in any env


## Know Issues

### Pages that no renderice

### Issues 

#### Vanilla JS

#### Angular JS

#### Angular 2+ 

#### VueJs

#### ReactJS

