
import request from 'request-promise-native'
import fs from 'fs'
import { cloneDeep } from 'lodash'
import config from './../config'
import {  Logger } from '@alphonse92/ms-lib';
import { MicroserviceDoesNotExist, MicroserviceNotAllowed } from './lib/errors/gateway';

const controller = {}

controller.health = health
function health(req, res, next) { res.send('Gateway says ok') }

controller.proxy = proxy
async function proxy(req, res, next) {
  const { headers, body, files, method, params, query } = req
  const base = req.baseUrl
  const baseUrl = base.substring(1, base.length)
  const baseUrlParts = baseUrl.split("/")
  const resource = baseUrlParts.shift()
  const isFormData = headers['content-type'] && headers['content-type'].indexOf('multipart/form-data') === 0
  const { msDomain, redirectToPrerender, redirectToMicroservice } = getMicroserviceDomain(headers, resource)
  let path
  if (redirectToMicroservice) {
    path = baseUrlParts.join("/")
  } else {
    path = baseUrl
  }
  await sendRequest(res, next, redirectToPrerender, isFormData, resource, msDomain, headers, method, path, query, body, files)
}

async function sendRequest(res, next, redirectToPrerender, isFormData, resource, msDomain, headers, method, path, query, body, files) {

  try {
    if (resource === "health") return controller.health(req, res, next)
    if (!msDomain) throw new MicroserviceDoesNotExist(msDomain)
    if (!canRequestToMicroservice(resource)) new MicroserviceNotAllowed()
    if (redirectToPrerender) headers['x-prerender-target'] = config.ms.default
    const response = await requestToMs(isFormData, msDomain, headers, method, path, query, body, files)
    Logger.info(`[${response.uri}] =>  Responding \n\n ${JSON.stringify(response.headers, null, 2)} \n\n`)
    return res
      .status(response.status)
      .set(response.headers)
      .send(response.body)
  } catch (error) {
    next(error)
  }
}

function canRequestToMicroservice(msName) {
  const msNames = config.blacklist
  return !msNames.includes(msName)
}

function shouldRedirectToPrerender(userAgent) {
  for (let i in config.useragents.redirect) {
    const ua2Redirect = config.useragents.redirect[i]
    if (userAgent.indexOf(ua2Redirect) >= 0) return true
  }
  return false
}

/**
 * 
 * @param {*} headers 
 * @param {string} resource is a string that indentify the resource that the user is trying for (for example a microservice)
 */
function getMicroserviceDomain(headers, resource) {
  const userAgent = headers['user-agent']
  const redirectToPrerender = shouldRedirectToPrerender(userAgent)
  const data = {}
  if (redirectToPrerender) data.msDomain = config.ms.prerender
  else data.msDomain = config.ms[resource]
    ? config.ms[resource]
    : config.ms.default
  data.redirectToPrerender = redirectToPrerender
  data.redirectToMicroservice = data.msDomain !== config.ms.default
  return data
}

async function requestToMs(isFormData, msDomain, headers, requestMethod, path, qs, body, files) {
  const method = requestMethod.toUpperCase()
  const uri = `${msDomain}/${path}`
  const resolveWithFullResponse = true
  const encoding = null
  const transform = (body, response, resolveWithFullResponse) => ({ response, uri, headers: response.headers, status: response.statusCode, body: response.body, request: response.request })
  delete headers.host
  const options = { uri, method: method, headers, qs, resolveWithFullResponse, transform, encoding }

  if (method !== 'GET') {
    if (isFormData) options.formData = getOptionsForFormDataRequest(body, files)
    else if (Object.keys(body)) options.body = body
  }

  Logger.info(`Redirect To ${options.uri}`)

  try {
    const response = await request(options)
    return response
  } catch (e) {
    return e.response
  }
}

function getOptionsForFormDataRequest(body, files) {
  const out = cloneDeep(body)
  files
    .forEach(file => {
      const value = fs.createReadStream(`${file.path}`)
      const contentType = file.mimetype
      const filename = file.originalname
      const fileOpts = { contentType, filename }
      out[file.fieldname] = { value, options: fileOpts }
    })
  return out
}



export default controller