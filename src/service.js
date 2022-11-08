const temp = require('temp')
const fs = require('fs')
const {Subject} = require('rxjs')

const expressUnit = (app, {route, method}) => {
  const s = new Subject()

  app[method](route, (req, res) => {
    s.next({req, res})
  })

  return s
}

const handleError = (err, res) => {
  res.status(500)
  .contentType("text/plain")
  .end(err.toString())
}

const start = (app, data_dir) => {
  // expressUnit(
  //   app,
  //   {
  //     route: '/datasets/:name/:start/:end',
  //     method: 'get'
  //   }
  // )
  // .subscribe(({req, res}) => {
  //   console.info(req.url)
  //   res.json({message: 'no dataset available'})
  // })

  expressUnit(
    app,
    {
      route: '/dictionary',
      method: 'get'
    }
  )
  .subscribe(({req, res}) => {
    try {
      
    }
    catch(err) {
      console.error(err)
      handleError(err, res)
    }
  })
}

module.exports = {start}
