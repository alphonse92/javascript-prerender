import fs from 'fs'
import cache from 'memory-cache'
import puppeteer from 'puppeteer';
import request from 'request-promise-native'

import { ChromiumInvalidProtocol, } from './lib/errors';
import { Controller } from './controller';
import { debug } from './utils'
import config from '../config'



async function loadCache() {
  const files = await getFilesFromFolder(config.cache_path)
  const cache_path = './../' + config.cache_path.slice(1, config.cache_path.length)
  files.forEach(filename => {
    let data = require(cache_path + '/' + filename);
    let path = data.path
    if (path) {
      debug("INFO", "loading cache for", path)
      cache.put(data.path, data);
    }
  })

  debug("INFO", "urls cached", cache.keys())
}

function getFilesFromFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) reject(err);
      return resolve(files);
    })
  })
}

async function createLocalBrowser(opt) {
  return puppeteer.launch(opt);
}


async function getRemoteBrowserWebServiceURI(ChromiumWebToolsEndpoint) {
  const protocol = ChromiumWebToolsEndpoint.protocol
  const isHttp = protocol.indexOf('http') >= 0
  const isWs = protocol.indexOf('ws') >= 0
  if (!isHttp && !isWs) throw new ChromiumInvalidProtocol()

  const url = ChromiumWebToolsEndpoint.protocol + "://" + ChromiumWebToolsEndpoint.domain + ":" + ChromiumWebToolsEndpoint.port;
  if (isWs) return url

  const headers = { 'content-type': 'application/json', 'host': config.hostname }
  const requestOptions = { url: url + '/json/version', headers };
  const requestData = await request.get(requestOptions)
  debug('INFO', 'getting chromium ws uri', requestData)
  return JSON.parse(requestData).webSocketDebuggerUrl
}

async function createBrowserInstance() {
  const isRemote = !!config.remote
  const label = isRemote ? 'Using remote browser' : 'Using local browser'
  debug('INFO', label)
  if (!isRemote) {
    const opt = Object.assign(config.puppetter_opt, {
      args: ['--remote-debugging-port=9222', '--disable-dev-shm-usage']
    })
    return createLocalBrowser(opt);
  }

  let ws = await getRemoteBrowserWebServiceURI(config.remote);
  ws = ws.replace(/localhost/g, (config.remote.domain + ':' + config.remote.port))
  return { wsEndpoint: () => ws }
}

async function connectPuppetter(browser) {
  const browserWSEndpoint = browser.wsEndpoint()
  debug("INFO", "Puppeteer conected to", browserWSEndpoint, "chromium instance");
  return puppeteer.connect({ browserWSEndpoint })
}


export default async () => {
  try {
    debug("INFO", "Creating chromium instance browser", "config", config, "\n\n");
    const browserInstance = await createBrowserInstance()
    const puppeteerConnection = await connectPuppetter(browserInstance);
    const controller = new Controller(puppeteerConnection)
    return controller.middleware.bind(controller)
  } catch (e) {
    console.log(e)
  }
}





