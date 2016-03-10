var User = require('../db/models').User
  , Hero = require('../db/models').Hero

module.exports = function validUser(req, res, next) {
  var token = req.query.token
  if (!token) {
    return res.send(JSON.stringify({valid: false}))
  } else {
    User.findOne({ token: token }).populate('heros').then(user => {
      console.log("validUser?", user)
      // Hero.findOne({ userId: user._id }).then(hero => {
      //   user.heros = [ hero ]
      // })
      req.user = user
      next()
    })
  }
}
