
import request from 'request-promise-native'
import fs from 'fs'
import { cloneDeep } from 'lodash'
import config from './../config'
import { debug } from './utils';

const controller = {}

controller.health = health
function health(req, res, next) { res.send('Gateway says ok') }

controller.proxy = proxy
async function proxy(req, res, next) {

  const { headers, baseUrl, body, files, method, params, query } = req
  const baseUrlParts = baseUrl.substring(1, baseUrl.length).split("/")
  const msName = baseUrlParts.shift()
  const isFormData = headers['content-type'] && headers['content-type'].indexOf('multipart/form-data') === 0
  const msDomain = getMicroserviceDomain(headers, msName)
  const path = baseUrlParts.join("/")

  if (msName === "health") return controller.health(req, res, next)
  if (!msDomain) return res.status(404).send()
  if (!canRequestToMicroservice(msName)) return res.status(401).send()

  try {
    const response = await requestToMs(isFormData, msDomain, headers, method, path, query, body, files)
    return res.send(response)
  } catch (e) {
    console.log(e)
    return res.status(502).send("Gateway Error")
  }

}

function canRequestToMicroservice(msName) {
  const msNames = config.blacklist.split(';')
  return !msNames.includes(msName)
}

function shouldRedirectToPrerender(userAgent) {
  return false
}

function getMicroserviceDomain(headers, msName) {
  const userAgent = headers['user-agent']
  const redirectToPrerender = shouldRedirectToPrerender(userAgent)
  if (redirectToPrerender) return config.ms.prerender
  else return config.ms[msName]
}

async function requestToMs(isFormData, msDomain, headers, method, path, query, body, files) {
  const METHOD = method.toUpperCase()
  const url = `${msDomain}/${path}`
  const options = {
    uri: url,
    method: METHOD,
    headers,
    qs: query
  }

  if (isFormData) options.formData = getOptionsForFormDataRequest(body, files)
  else options.body = body
  return Promise.resolve(options)
  return await request(options)
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