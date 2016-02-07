var User = require('../db/models').User
  , Hero = require('../db/models').Hero

module.exports = function validUser(req, res, next) {
  var token = req.query.token
  if (!token) {
    return res.send(JSON.stringify({valid: false}))
  } else {
    User.findOne({
      where: { token: token },
      include: [ Hero ]
    }).then(user => {
      req.user = user
      next()
    })
  }
}
