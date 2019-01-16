import { cleanHeaders, isContentTypeImage, debug } from './utils'
import { NotAllowedToRender } from './errors';
import config from './../config'





const valideAccessToResource = (baseUrl, target) => {
  let passFilter = !config.filter || (typeof config.filter === "function" && config.filter(baseUrl, target));
  if (!passFilter) throw new NotAllowedToRender()
}

export class PuppeteerRequest {
  constructor(browser) {
    this.browser = browser
    this.headers = {}
  }

  async  goto(req, target, opt = { waitUntil: "networkidle2", navigation: { timeout: 30000 } }) {

    valideAccessToResource(target)

    const page = await this.browser.newPage()
    const requestMethod = req.method
    let headers = req.headers

    if (headers && Object.keys(headers))
      headers = cleanHeaders(headers)

    if (requestMethod && requestMethod.toUpperCase() === 'GET') {
      await page.setRequestInterception(true);
      page.on('request', interceptedRequest => {
        const method = requestMethod.toUpperCase()
        const data = { method }
        if (req.body) data.postData = req.body
        interceptedRequest.continue(data);
      });
    }

    const puppeteerResponse = await page.goto(target, opt)
    this.setHeaders(puppeteerResponse.headers())
    this.setResponse(await this.resolveHeadlessResponse(page, puppeteerResponse))
    debug("INFO", "closing page")
    return await page.close()
  }

  async resolveHeadlessResponse(page, puppeteerResponse) {
    debug("INFO", "resolveHeadlessResponse");
    const isHtml = await this.valideHtmlResponse(page, puppeteerResponse)
    let response
    if (isHtml) {
      response = await page.content()
    } else {
      response = await puppeteerResponse.buffer();
    }
    return response
  }

  async  valideHtmlResponse(page, puppeteerResponse) {
    const contenttype = this.headers['content-type']
    if (contenttype) {
      return contenttype.split(';')[0].trim() === 'text/html'
    }

    const Element = await page.$('html')
    const rta = !!Element
    return rta
  }

  setHeaders(headers) {
    delete headers["content-encoding"];
    this.headers = cleanHeaders(headers)
    if (isContentTypeImage(this.headers))
      this.headers["content-type"] = this.headers["content-type"]
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