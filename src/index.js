/**
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import mirror from './mirror.txt'
import intro from './intro.html'
import { statusRequest } from './status.js'
import { addRecord } from './api.js'

export default {
  async fetch(request, environment, context) {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname === '/mirror') {
      return new Response(mirror, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }})
    }
    if (pathname == '/') {
      return new Response(intro, { headers: { 'Content-Type': 'text/html' }, })
    }
    if (pathname == '/status') {
      return statusRequest(request, environment)
    }

    if (pathname.startsWith('/op')) {
      const apiKey = request.headers.get('x-api-key')

      if (!apiKey || apiKey !== 'your-secret-api-key') {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    if (request.method != 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    if (pathname == '/op/add') {
      return addRecord(request, environment)
    }

    return new Response('Not Found!', { status: 404 })
  }
}

// vim: ts=2 sw=2 sts=2 et
