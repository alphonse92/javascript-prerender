import cache from 'memory-cache'
import querystring from 'querystring'
import config from './../config'
import { PuppeteerRequest } from './PuppeteerRequest.class';
import { debug } from './utils';
import { Factory } from './lib/cache'


const postfixForCachedData = {
  DATA: '___DATA____',
  HEADERS: '___HEADERS____',
}


function getTarget(req) {
  const header = config.header_target;
  debug("INFO", "Header", header, !!req.headers[header] ? "was found" : "was not found");
  const urlquery = querystring.stringify(req.query).toString()
  const base = req.baseUrl; // path/to/asset/logo.png
  let target = req.headers[header] || config.target; // http://target/
  target += base; //"http://target/path/to/asset/logo.png"
  if (urlquery.length) target = target + '/?' + urlquery.toString();
  return target
}

export class Controller {

  constructor(puppeteerConnection) {
    this.puppeteerConnection = puppeteerConnection
    this.cacheSystem = Factory.get(config.cache.type)(config.cache.config)
  }

  send(res, headers, data) {
    Object.keys(headers)
      .forEach(header => {
        const value = headers[header];
        res.setHeader(header, value)
      })
    res.send(data)
  }


  error(res, error) {
    res.status(error.status || 500).send(error.message)
  }

  sendFromCache(res) {
    this.send(res, this.response_cache.headers, this.response_cache.data)
  }

  async sendAndCache(target, res, headers, data) {
    debug('INFO', 'sending data, headers are', headers)
    await this.cacheResponse(target, { headers, data })
    this.send(res, headers, data)
  }

  async  cacheResponse(target, dataToBeStored) {

    const time = +config.cache.time
    if (time !== 0) return

    const { headers, data } = dataToBeStored

    if (time > 0) {

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + time);
      data.expiresAt = expiresAt;
      await this.cacheSystem.set(target + postfixForCachedData.DATA, data, 'EX', expiresAt)
      await this.cacheSystem.set(target + postfixForCachedData.HEADERS, headers, 'EX', expiresAt)
      return
    }

    await this.cacheSystem.set(target + postfixForCachedData.DATA, data)
    await this.cacheSystem.set(target + postfixForCachedData.HEADERS, headers)

  }
  
  async initCacheResponse(target) {
    this.response_cache = {
      data: await cacheSystem.get(target + postfixForCachedData.DATA),
      headers: await cacheSystem.get(target + postfixForCachedData.HEADERS),
    }
  }

  isValidTheCachedResponse() {
    return !!this.response_cache.data
  }

  sendNotCachedData(target, req, res, next) {
    debug('INFO', 'cache for target: ', target, 'NOT FOUND')
    const puppeterRequest = new PuppeteerRequest(this.puppeteerConnection)
    try {
      debug("INFO", req.method.toUpperCase(), "requesting for :", target);
      await puppeterRequest.goto(req, target)
      this.sendAndCache(target, res, puppeterRequest.getHeaders(), puppeterRequest.getResponse())
    }
    catch (e) {
      console.log(e)
      this.error(res, e)
    }
  }

  async middleware(req, res, next) {
    const target = getTarget(req)
    await this.initCacheResponse(target)
    if (this.isValidTheCachedResponse()) return this.sendFromCache(res)
    this.sendNotCachedData(target, req, res, next)
  }

}