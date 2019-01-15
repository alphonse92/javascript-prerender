import cache from 'memory-cache'
import { PuppeteerRequest } from './PuppeteerRequest.class';
import { debug, saveFile } from './utils';
import config from './../config'

function getTarget(req) {
  const header = config.header_target;
  debug("INFO", "Header", header, !!req.headers[header] ? "was found" : "was not found");
  let base = req.baseUrl; // path/to/asset/logo.png
  let target = req.headers[header] || config.target; // http://target/
  target += base; //"http://target/path/to/asset/logo.png"
  return target;
}

export class Controller {

  constructor(puppeteerConnection) {
    this.puppeteerConnection = puppeteerConnection
  }

  send(res, headers, data) {
    res.set(headers)
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

  async  cacheResponse(target, data) {
    //config.cache < 0 cache request never expire
    //config.cache === 0 , doesnt cache
    //config.cache > 0, cache it and the expiration time is config.cache
    //if config.cache === 0 and doesnt exist a cached request
    const cache = +config.cache
    if (cache!== 0) {
      //create date 
      let expiresAt = new Date();
      //adding to date the amount of seconds that cache is valid
      expiresAt.setSeconds(expiresAt.getSeconds() + config.cache);
      //saving as string
      data.expiresAt = expiresAt;
      cache.put(target, data);
      let cacheData = Object.assign({}, data);
      cacheData.data = cacheData.data.toString("utf8");
      cacheData.path = target;
      let filename = config.cache_path + '/' + Date.now() + ".json";
      debug("INFO", "Caching request to", target);
      debug(" |_", "File name", filename);
      return await saveFile(filename, JSON.stringify(cacheData, null, 2));
      //return a single resolve promise for make saveCache data as async
    }
  }

  isCachedResponseExpired(target) {
    this.response_cache = cache.get(target)
    debug("INFO", "valide if cache expired")
    debug(" |_", "exist cache for the request?(", target, ")", !!this.response_cache)

    if (!this.response_cache) return true

    let now = new Date();
    let expirationTime = new Date(this.response_cache.expiresAt);
    let isExpired = now > expirationTime;
    debug(" |_", "Current", "date", now);
    debug(" |_", "Expiration", "date", expirationTime);
    debug(" |_", "is expired?", isExpired);
    return isExpired;
  }


  async middleware(req, res, next) {
    const target = getTarget(req)
    if (!this.isCachedResponseExpired(target)) return this.sendFromCache(res)
    debug('INFO', 'cache for target: ', target, 'NOT FOUND')
    const puppeterRequest = new PuppeteerRequest(this.puppeteerConnection)
    try {
      debug("INFO", req.method.toUpperCase(), "requesting for :", req.baseUrl);
      await puppeterRequest.goto(target)
      this.sendAndCache(target, res, puppeterRequest.getHeaders(), puppeterRequest.getResponse())
    }
    catch (e) {
      console.log(e)
      this.error(res, e)
    }

  }

}