"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");
const Env = use("Env");
const Youch = use("youch");

const TjapException = use("App/Exceptions/TjapException");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    if (Env.get("NODE_ENV") === "development") {
      const youch = new Youch(error, request.request);
      const errorJson = await youch.toJSON();
      return response.status(error.status).send(errorJson);
    }

    let errorMessage = "Erro interno do servidor, avise o administrador!";

    if (error instanceof TjapException) {
      errorMessage = error.message;
    }

    return response.status(error.status).send({
      error: {
        message: errorMessage
      }
    });
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
