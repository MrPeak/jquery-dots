/*
 *  Project: jquery.dots
 *  Description: jQuery Plugin can cut off the excess characters, and replace them with dots
 *  Author: @gaofeng.gf
 */

;(function($, window, document, undefined) {

  var name       = 'dots';
  var defaults   = {
    // dot asterisk
    ellipType: 'dot',  
    wrapClass: 'elip-wrap',
    responsive: false
  };

  var _reg       = /(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/;     
  var _isResized = false; 

  var _throttle  = function(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
      method.call(context);
    }, 200);
  };

  function Plugin(element, options) {

    this.element   = element;
    this.options   = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name     = name;

    this.init();
  }

  Plugin.prototype.init = function() {

    var that   = this;

    this._text = $(that.element).text();

    if (that.options['responsive'] === true) {

      $(window).resize(function(event) {

        _throttle(function() {
          _isResized = true;
          that.dots(that.options);
        }, window);

      });

    }
    
    $(this.element).wrap('<div class="' + that.options['wrapClass'] + '"></div>');

    this.dots(that.options);
  };

  Plugin.prototype.dots = function(options) {
    
    var that = this;

    var $ele = $(this.element);

    if (options['ellipType'] == 'asterisk') {
      _reg = /(\s)*([a-zA-Z0-9]+|\W)(\*\*\*)?$/;
    }

    if (_isResized === true) {  
      $ele.text(that._text);
    }

    while ($ele.outerHeight() > $ele.parent().height()) {
      $ele.text($ele.text().replace(_reg, that.options['ellipType'] == 'dot' ? '...' : '***'));
    }

  };

  $.fn[name] = function(options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      
      return this.each(function() {
        
        if (!$.data(this, 'plugin_' + name)) {
          $.data(this, 'plugin_' + name, new Plugin(this, options));
        }

      });

    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function() {
        var instance = $.data(this, 'plugin_' + name);

        if (instance instanceof Plugin && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        if (options === 'destroy') {
          $.data(this, 'plugin_' + name, null);
        }
      });

      return returns !== undefined ? returns : this;
    }
  };

}(jQuery, window, document));
