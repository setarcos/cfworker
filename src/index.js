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
import { addRecord, deleteRecord, updateRecord, editRecord } from './api.js'

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

      if (!apiKey || apiKey !== environment.ARCH_API_KEY) {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    if (request.method != 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const match = pathname.match(/^\/op\/(add|delete|update|edit)(?:\/(.+))?$/)

    switch (match[1]) {
      case 'add':
        return addRecord(request, environment)

      case 'delete':
        return deleteRecord(match[2], environment)

      case 'update':
        return updateRecord(request, match[2], environment)

      case 'edit':
        return editRecord(request, match[2], environment)

      default:
        return new Response('Command not found', { status: 404 })
    }
  }
}

// vim: ts=2 sw=2 sts=2 et
