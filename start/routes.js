'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/log', "LogController.save")
  .middleware([
    // "tjap_log"
  ])

Route.get('/log', "LogController.report")
  .middleware([
    "tjap_auth",
    "tjap_auth_required"
  ])

Route.get('/log/grafico', "LogController.grafico")
  .middleware([
    "tjap_auth",
    "tjap_auth_required"
  ])

Route.get('/log/:id', "LogController.showTrilha")
  .middleware([
    "tjap_auth",
    "tjap_auth_required"
  ])

Route.get('/log/:id/response', "LogController.showResponse")
  .middleware([
    "tjap_auth",
    "tjap_auth_required"
  ])
