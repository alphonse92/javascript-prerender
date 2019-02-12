
import request from 'request-promise-native'
import config from './../config'
import { debug } from './utils';



const controller = {}

controller.health = health
function health(req, res, next) { res.send('Gateway says ok') }

controller.proxy = proxy
function proxy(req, res, next) {

  const { headers, baseUrl, body, method, params, query } = req
  const baseUrlParts = baseUrl.substring(1, baseUrl.length).split("/")
  const msName = baseUrlParts.shift()

  if (!canRequestToMicroservice(msName)) res.status(401).send()



  const path = baseUrlParts.join("/")
  const data = { headers, baseUrl, body, method, params, query, path }
  const userAgent = headers['user-agent']
  const redirectToPrerender = shouldRedirectToPrerender(userAgent)



  return res.send(JSON.stringify(data, null, 2))
}

function canRequestToMicroservice(msName) {
  const msNames = config.blacklist.split(';')
  return !msNames.includes(msName)
}

function shouldRedirectToPrerender(userAgent) {
  return false
}

async function requestToMs(msName, method, path, body, query) {
  const msDomain = config.ms[msName]
  const METHOD = method.toUpperCase()
  const url = `http://${msDomain}/${path}`

  return await request()

}



export default controller