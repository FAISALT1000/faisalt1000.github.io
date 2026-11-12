// The TV's QR code opens this page only when the app didn't open by itself:
// the app isn't installed, it's too old, or this isn't an Android phone.
(function () {
  var PACKAGE = 'com.alhejaili.androidmirror';
  var guest = location.pathname.indexOf('/guest') >= 0;
  var hash = location.hash.replace(/^#/, '');
  var p = {};
  hash.split('&').forEach(function (kv) {
    var i = kv.indexOf('=');
    if (i > 0) { try { p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {} }
  });
  var $ = function (id) { return document.getElementById(id); };
  var name = (p.n || '').slice(0, 40);
  if (name) $('tv-name').textContent = name;
  var android = /Android/i.test(navigator.userAgent);
  $('android').hidden = !android;
  $('other').hidden = android;
  if (!hash || p.v !== '1') { $('broken').hidden = false; return; }

  // Google Play keeps the TV's details and hands them to the app after installing.
  var referrer = (guest ? 'guest&' : '') + hash;
  $('play').href = 'https://play.google.com/store/apps/details?id=' + PACKAGE + '&referrer=' + encodeURIComponent(referrer);
  // For an installed app whose links aren't verified yet.
  $('open').href = 'androidmirror://' + (guest ? 'guest' : 'tv') + '?' + hash;

  // Other phones: the TV's browser remote, if it's on (local network only).
  var host = (p.a || '').split(':')[0];
  var local = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)\d{1,3}\.\d{1,3}(\.\d{1,3})?$/.test(host);
  var port = parseInt(p.r || '0', 10);
  if (local && port > 0 && port < 65536) {
    $('web').href = 'http://' + host + ':' + port + '/';
    $('web').hidden = false;
    $('no-web').hidden = true;
  }
})();
