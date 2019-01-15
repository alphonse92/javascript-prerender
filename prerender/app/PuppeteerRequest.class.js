import { cleanHeaders, isContentTypeImage, debug } from './utils'
import { NotAllowedToRender } from './errors';
import config from './../config'

async function resolveHeadlessResponse(page, puppeteerResponse) {
  debug("INFO", "resolveHeadlessResponse");
  const isHtml = valideHtmlResponse(puppeteerResponse)
  return isHtml ? page.content() : puppeteerResponse.buffer();
}

async function valideHtmlResponse(puppeteerResponse) {
  const bf = await puppeteerResponse.buffer()
  let bfString = bf.toString('utf8');
  let strings = [
    "<!DOCTYPE html>",
    "<html",
    "html>",
    "<body",
    "body>"
  ]
  for (let str in strings) {
    if (bfString.match(new RegExp(strings[str]), "i"))
      return true
  }
  return false
}

const valideAccessToResource = (baseUrl, target) => {
  let passFilter = !config.filter || (typeof config.filter === "function" && config.filter(baseUrl, target));
  if (!passFilter) throw new NotAllowedToRender()
}

export class PuppeteerRequest {
  constructor(browser) {
    this.browser = browser
    this.headers = {}
  }

  async  goto(target, opt = { waitUntil: "networkidle2", navigation: { timeout: 30000 } }) {
    valideAccessToResource(target)
    const page = await this.browser.newPage()
    const puppeteerResponse = await page.goto(target, opt)
    this.setHeaders(puppeteerResponse.headers())
    this.setResponse(await resolveHeadlessResponse(page, puppeteerResponse))
    debug("INFO", "closing page")
    return await page.close()
  }



  setHeaders(headers) {
    // delete this.headers["content-encoding"];
    this.headers = cleanHeaders(headers)
    if (isContentTypeImage(this.headers))
      headers["content-type"] = headers["content-type"]
        .split(";")
        .filter((content) => content.indexOf("charset") < 0)
        .join(";")
  }

  getHeaders() {
    return this.headers
  }

  setResponse(response) {
    this.response = response
  }

  getResponse() {
    return this.response
  }

}