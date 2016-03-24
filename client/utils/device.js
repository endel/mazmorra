import isMobile from 'is-mobile'
import fullscreen from 'fullscreen'

module.exports.isMobile = isMobile

if (isMobile()) {
  let el = window.document.body
    , fs = fullscreen(el)

  el.addEventListener('click', function() {
    fs.request()
  })
}
