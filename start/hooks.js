const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {

  const Response = use('Adonis/Src/Response')

  Response.macro("tucujurisFormat", function (data, overrideStatus) {

    this.status(overrideStatus).json(
      {
        status: "OK",
        dados: data
      }
    )

  })


})
