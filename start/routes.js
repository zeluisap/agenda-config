"use strict";

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
const Route = use("Route");

Route.post("/upload", "UploadController.store").middleware(["tjap_auth"]);
Route.get("/upload/:id", "UploadController.get").middleware(["tjap_auth"]);
Route.delete("/upload/:id", "UploadController.delete").middleware([
  "tjap_auth"
]);
Route.get("/download/:id", "UploadController.download").middleware([
  "tjap_auth"
]);
Route.post("/agenda", "UploadController.agenda").middleware([]);
