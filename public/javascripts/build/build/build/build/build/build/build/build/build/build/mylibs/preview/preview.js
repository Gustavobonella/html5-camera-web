(function() {

  define(['jQuery', 'Kendo', 'mylibs/utils/utils', 'libs/webgl/effects', 'libs/webgl/glfx.min'], function($, kendo, utils, effects) {
    var $container, canvas, draw, height, paused, preview, pub, update, video, webgl, width;
    $container = {};
    canvas = {};
    webgl = {};
    video = {};
    paused = true;
    preview = {};
    width = 460;
    height = 340;
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    update = function() {
      var canvas2d, texture;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        texture = webgl.texture(canvas);
        if (preview.method !== "normal") {
          if (preview.hasFrames) {
            webgl.draw(texture)[preview.method].apply(webgl, [preview.params.frame]).update();
            if (preview.params.frame < preview.range.max) {
              ++preview.params.frame;
            } else {
              preview.params.frame = 0;
            }
          } else {
            webgl.draw(texture)[preview.method].apply(webgl, preview.paramsArray).update();
          }
        } else {
          webgl.draw(texture).update();
        }
        return texture.destroy();
      }
    };
    return pub = {
      init: function(container, v) {
        var $footer, $header, $preview, presets;
        $container = $("#" + container);
        $header = $container.find(".header");
        $preview = $container.find(".body");
        $footer = $container.find(".footer");
        video = v;
        presets = effects(width, height);
        canvas = document.createElement("canvas");
        webgl = fx.canvas();
        $preview.append(webgl);
        $.subscribe("/preview/show", function(e) {
          var param, paramValue, _ref;
          $.extend(preview, e);
          paused = false;
          preview.paramsArray = [];
          _ref = presets[preview.name].params;
          for (param in _ref) {
            paramValue = _ref[param];
            preview.paramsArray.push(paramValue);
          }
          video.width = canvas.width = width;
          video.height = canvas.height = height;
          $header.kendoStop(true).kendoAnimate({
            effects: "fadeIn",
            show: true,
            duration: 500
          });
          $preview.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500
          });
          return $footer.kendoStop(true).kendoAnimate({
            effects: "slideIn:up fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              return $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
            }
          });
        });
        $container.find("#effects").click(function() {
          paused = true;
          $("footer").kendoStop(true).kendoAnimate({
            effects: "fadeOut",
            hide: true,
            duration: 200
          });
          $header.kendoStop(true).kendoAnimate({
            effects: "fadeOut",
            hide: true,
            duration: 500
          });
          $preview.kendoStop(true).kendoAnimate({
            effects: "zoomOut fadeOut",
            hide: true,
            duration: 500
          });
          $footer.kendoStop(true).kendoAnimate({
            effects: "slide:down fadeOut",
            hide: true,
            duration: 500
          });
          return $.publish("/previews/show");
        });
        $.subscribe("/preview/snapshot", function() {
          var callback;
          callback = function() {
            return $(webgl).kendoAnimate({
              effects: "zoomOut: fadeOut",
              duration: 300,
              show: false
            }).kendoAnimate({
              effects: "zoomIn: fadeIn",
              duration: 300,
              show: true,
              complete: function() {
                $(webgl).show();
                return $.publish("/snapshot/create", [webgl.toDataURL()]);
              }
            });
          };
          return $.publish("/camera/countdown", [3, callback]);
        });
        $.subscribe("/preview/photobooth", function() {
          var callback, images, photoNumber;
          images = [];
          photoNumber = 2;
          callback = function() {
            --photoNumber;
            images.push(webgl.toDataURL());
            if (photoNumber > 0) {
              return $.publish("/camera/countdown", [3, callback]);
            } else {
              return $.publish("/photobooth/create", [images]);
            }
          };
          return $.publish("/camera/countdown", [3, callback]);
        });
        return draw();
      }
    };
  });

}).call(this);