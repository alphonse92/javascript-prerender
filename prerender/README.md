# Javascript prerender

Javascript prerender is a microservice to prerendering javascript single pages, without care about javascript technology.

# Installlation

```sh
docker-compose build
```

# Run 

```sh
docker-compose run
```

# Documentation

## Environment vars

1. env: [optional] [default='development']
2. target: [required] url of web that you want to prerenderize
3. domain: [optional] [default='www.miwebsite.com'] your domain name
4. hostname: [optional] [default='localhost'] your hostname
5. port: [optional] [default=3000]  prerender port to listen
6. debug: [optional] [default=true] enable/disable debug (show data at console)
7. cache: [optional] [default=604800000] tls of prerender cache
8. userAgent: [optional] [default='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36']
9. cache_path: [optional] [default='./tmp/prerender/'] path to your cache folder
10. chromium: [optional] [default='http://localhost:9222'] url to your chromium instance, accept websocket uri
11. header_target: [optional] [default='x-prerender-target'] if this header is present it will force to change the target of your web that you want to prerenderice

# Development state

I seeking for contributors. 

## To inprove

1. Add a way to specify puppeteer request headers
2. Use redis instead of memory-cache
3. Create a gateway
4. Create tests


## Know Issues

### Pages that no renderice

### Issues 

#### Vanilla JS

#### Angular JS

#### Angular 2+ 

#### VueJs

#### ReactJS

