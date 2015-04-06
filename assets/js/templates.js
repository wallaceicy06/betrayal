define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/overlay.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="overlay" class="overlay" style="display: none">\n  <div class="title">' +
((__t = ( title )) == null ? '' : __t) +
'</div>\n  <div class="flavor">' +
((__t = ( flavor )) == null ? '' : __t) +
'</div>\n  <div class="body">' +
((__t = ( body )) == null ? '' : __t) +
'</div>\n  ';
 if (seconds > 0) { ;
__p += '\n    <div class="countdown">Re-enabling movement in <span class="seconds">' +
((__t = ( seconds )) == null ? '' : __t) +
'</span> seconds</div>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/overlay_chat.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="overlay" class="overlay" style="display: none; color: ' +
((__t = ( color )) == null ? '' : __t) +
';">\n  <div class="name">' +
((__t = ( name )) == null ? '' : __t) +
'</div>\n  <div class="body">' +
((__t = ( message )) == null ? '' : __t) +
'</div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/playerlistitem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="' +
((__t = ( id )) == null ? '' : __t) +
'" class="player-list-item" style="color: ' +
((__t = ( color )) == null ? '' : __t) +
'; border: 1px solid ' +
((__t = ( color )) == null ? '' : __t) +
';">\n  ' +
((__t = ( name )) == null ? '' : __t) +
'\n  <div class="player-health">\n    ';
 _.times(7, function(i) {
      if (i < curHealth) {
        ;
__p += '<img class="full_heart">';

      } else if (i < maxHealth) {
        ;
__p += '<img class="empty_heart">';

      } else {
        ;
__p += '<img class="empty_heart invisible">';

      }
    }); ;
__p += '\n  </div>\n  <div class="player-speed">\n    ';
 _.times(7, function(i) {
      if (i < speed) {
        ;
__p += '<img class="small_lightning">';

      } else {
        ;
__p += '<img class="small_lightning invisible">';

      }
    }); ;
__p += '\n  </div>\n  <div class="player-weapon">\n    ';
 _.times(7, function(i) {
      if (i < weapon) {
        ;
__p += '<img class="small_flame">';

      } else {
        ;
__p += '<img class="small_flame invisible">';

      }
    }); ;
__p += '\n  </div>\n  <div class="player-relics">\n    ';
 _.times(7, function(i) {
      if (i < relics) {
        ;
__p += '<img class="small_jewel">';

      } else {
        ;
__p += '<img class="small_jewel invisible">';

      }
    }); ;
__p += '\n  </div>\n  <div class="player-keys hidden">\n    ';
 _.times(7, function(i) {
      if (i < keys) {
        ;
__p += '<img class="small_key">';

      } else {
        ;
__p += '<img class="small_key invisible">';

      }
    }); ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

  return this["JST"];

});