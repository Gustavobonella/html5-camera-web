
(function() {

  define('mylibs/camera/normalize',['jQuery', 'Kendo'], function($, kendo) {
    var optionStyle, options;
    window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);
    navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    optionStyle = (function(win) {
      var el, object, root, string;
      if (!navigator.getUserMedia) return;
      el = document.createElement("iframe");
      root = document.body || document.documentElement;
      string = true;
      object = true;
      return {
        string: string,
        object: object
      };
    })(window);
    return options = function(opts) {
      var o, stringOptions;
      stringOptions = [];
      if (optionStyle.string && !optionStyle.object) {
        for (o in opts) {
          if (opts[o] === true) stringOptions.push(o);
        }
        return stringOptions.join(" ");
      } else {
        return opts;
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/controls/controls',['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      init: function(controlsId) {
        var $controls, previousAlpha, previousBeta, previousGamma;
        $controls = $("#" + controlsId);
        $controls.on("click", "button", function() {
          return $.publish($(this).data("event"));
        });
        $controls.on("change", "input", function(e) {
          return $.publish("/polaroid/change", [e]);
        });
        if (window.DeviceOrientationEvent || window.OrientationEvent) {
          $(".polaroid-container").show();
          previousAlpha = 0;
          previousGamma = 0;
          previousBeta = 0;
          return window.addEventListener('deviceorientation', function(eventData) {
            if ((eventData.gamma - previousGamma) > 40 || (previousGamma - eventData.gamma) > 40) {
              $.publish("/shake/gamma");
            }
            if ((eventData.beta - previousBeta) > 40 || (previousBeta - eventData.beta) > 40) {
              return $.publish("/shake/beta");
            }
          }, false);
        }
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/effects/presets',['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      effects: {
        none: {
          vignette: {
            black: false,
            white: false
          },
          noise: false,
          screen: {
            red: false,
            green: false,
            blue: false,
            strenth: 0
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: "image/jpeg",
          viewFinder: false
        },
        vintage: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 20,
          screen: {
            red: 227,
            green: 12,
            blue: 169,
            strength: 0.1
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        sepia: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 25,
          screen: {
            red: 141,
            green: 107,
            blue: 3,
            strength: 0.47
          },
          desaturate: 0.7,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        grayscale: {
          vignette: {
            black: 0.7,
            white: 0.2
          },
          noise: 25,
          screen: {
            red: false,
            green: false,
            blue: false,
            strength: false
          },
          desaturate: 1,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        green: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 20,
          screen: {
            red: 255,
            green: 255,
            blue: 0,
            strength: 0.1
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        }
      }
    };
  });

}).call(this);

(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define('mylibs/effects/effects',['jQuery', 'Kendo', 'mylibs/effects/presets'], function($, kendo, presets) {
    var applyEffect, pub, updateImage, vintageDefaults;
    vintageDefaults = {
      vignette: {
        black: 0,
        white: 0
      },
      noise: false,
      screen: {
        blue: false,
        green: false,
        red: false,
        strength: 0
      },
      desaturate: false,
      allowMultiEffect: true,
      mime: 'image/jpeg',
      viewFinder: false,
      curves: false,
      blur: false,
      preset: "custom",
      callback: function() {}
    };
    updateImage = function($image, options, value) {
      var effect;
      effect = vintageDefaults;
      if (options[0] === "vignette") {
        effect.vignette[options[1]] = value;
      } else if (options[0] === "screen") {
        effect.screen[options[1]] = value;
      } else {
        effect[options[0]] = value;
      }
      return $image.vintage(effect);
    };
    applyEffect = function($image, effect) {
      $image.vintage(effect);
      return $image.data("vintage", effect);
    };
    return pub = {
      init: function() {
        return $.subscribe("/image/update", function($image, effect, value) {
          return updateImage($image, effect, value);
        });
      },
      presets: function() {
        var key, _ref, _results;
        _ref = presets.effects;
        _results = [];
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          _results.push({
            preset: key
          });
        }
        return _results;
      },
      applyPreset: function($img, preset) {
        return applyEffect($img, presets.effects[preset]);
      }
    };
  });

}).call(this);

/*! @source http://purl.eligrey.com/github/BlobBuilder.js/blob/master/BlobBuilder.js */
var BlobBuilder=BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||(function(j){var c=function(v){return Object.prototype.toString.call(v).match(/^\[object\s(.*)\]$/)[1]},u=function(){this.data=[]},t=function(x,v,w){this.data=x;this.size=x.length;this.type=v;this.encoding=w},k=u.prototype,s=t.prototype,n=j.FileReaderSync,a=function(v){this.code=this[this.name=v]},l=("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),r=l.length,o=j.URL||j.webkitURL||j,p=o.createObjectURL,b=o.revokeObjectURL,e=o,i=j.btoa,f=j.atob,m=false,h=function(v){m=!v},d=j.ArrayBuffer,g=j.Uint8Array;u.fake=s.fake=true;while(r--){a.prototype[l[r]]=r+1}try{if(g){h.apply(0,new g(1))}}catch(q){}if(!o.createObjectURL){e=j.URL={}}e.createObjectURL=function(w){var x=w.type,v;if(x===null){x="application/octet-stream"}if(w instanceof t){v="data:"+x;if(w.encoding==="base64"){return v+";base64,"+w.data}else{if(w.encoding==="URI"){return v+","+decodeURIComponent(w.data)}}if(i){return v+";base64,"+i(w.data)}else{return v+","+encodeURIComponent(w.data)}}else{if(real_create_object_url){return real_create_object_url.call(o,w)}}};e.revokeObjectURL=function(v){if(v.substring(0,5)!=="data:"&&real_revoke_object_url){real_revoke_object_url.call(o,v)}};k.append=function(z){var B=this.data;if(g&&z instanceof d){if(m){B.push(String.fromCharCode.apply(String,new g(z)))}else{var A="",w=new g(z),x=0,y=w.length;for(;x<y;x++){A+=String.fromCharCode(w[x])}}}else{if(c(z)==="Blob"||c(z)==="File"){if(n){var v=new n;B.push(v.readAsBinaryString(z))}else{throw new a("NOT_READABLE_ERR")}}else{if(z instanceof t){if(z.encoding==="base64"&&f){B.push(f(z.data))}else{if(z.encoding==="URI"){B.push(decodeURIComponent(z.data))}else{if(z.encoding==="raw"){B.push(z.data)}}}}else{if(typeof z!=="string"){z+=""}B.push(unescape(encodeURIComponent(z)))}}}};k.getBlob=function(v){if(!arguments.length){v=null}return new t(this.data.join(""),v,"raw")};k.toString=function(){return"[object BlobBuilder]"};s.slice=function(y,v,x){var w=arguments.length;if(w<3){x=null}return new t(this.data.slice(y,w>1?v:this.data.length),x,this.encoding)};s.toString=function(){return"[object Blob]"};return u}(self));
define("mylibs/utils/BlobBuilder.min", function(){});

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||(function(h){var r=h.document,l=function(){return h.URL||h.webkitURL||h},e=h.URL||h.webkitURL||h,n=r.createElementNS("http://www.w3.org/1999/xhtml","a"),g="download" in n,j=function(t){var s=r.createEvent("MouseEvents");s.initMouseEvent("click",true,false,h,0,0,0,0,0,false,false,false,false,0,null);return t.dispatchEvent(s)},o=h.webkitRequestFileSystem,p=h.requestFileSystem||o||h.mozRequestFileSystem,m=function(s){(h.setImmediate||h.setTimeout)(function(){throw s},0)},c="application/octet-stream",k=0,b=[],i=function(){var t=b.length;while(t--){var s=b[t];if(typeof s==="string"){e.revokeObjectURL(s)}else{s.remove()}}b.length=0},q=function(t,s,w){s=[].concat(s);var v=s.length;while(v--){var x=t["on"+s[v]];if(typeof x==="function"){try{x.call(t,w||t)}catch(u){m(u)}}}},f=function(t,u){var v=this,B=t.type,E=false,x,w,s=function(){var F=l().createObjectURL(t);b.push(F);return F},A=function(){q(v,"writestart progress write writeend".split(" "))},D=function(){if(E||!x){x=s(t)}w.location.href=x;v.readyState=v.DONE;A()},z=function(F){return function(){if(v.readyState!==v.DONE){return F.apply(this,arguments)}}},y={create:true,exclusive:false},C;v.readyState=v.INIT;if(!u){u="download"}if(g){x=s(t);n.href=x;n.download=u;if(j(n)){v.readyState=v.DONE;A();return}}if(h.chrome&&B&&B!==c){C=t.slice||t.webkitSlice;t=C.call(t,0,t.size,c);E=true}if(o&&u!=="download"){u+=".download"}if(B===c||o){w=h}else{w=h.open()}if(!p){D();return}k+=t.size;p(h.TEMPORARY,k,z(function(F){F.root.getDirectory("saved",y,z(function(G){var H=function(){G.getFile(u,y,z(function(I){I.createWriter(z(function(J){J.onwriteend=function(K){w.location.href=I.toURL();b.push(I);v.readyState=v.DONE;q(v,"writeend",K)};J.onerror=function(){var K=J.error;if(K.code!==K.ABORT_ERR){D()}};"writestart progress write abort".split(" ").forEach(function(K){J["on"+K]=v["on"+K]});J.write(t);v.abort=function(){J.abort();v.readyState=v.DONE};v.readyState=v.WRITING}),D)}),D)};G.getFile(u,{create:false},z(function(I){I.remove();H()}),z(function(I){if(I.code===I.NOT_FOUND_ERR){H()}else{D()}}))}),D)}),D)},d=f.prototype,a=function(s,t){return new f(s,t)};d.abort=function(){var s=this;s.readyState=s.DONE;q(s,"abort")};d.readyState=d.INIT=0;d.WRITING=1;d.DONE=2;d.error=d.onwritestart=d.onprogress=d.onwrite=d.onabort=d.onerror=d.onwriteend=null;h.addEventListener("unload",i,false);return a}(self));
define("mylibs/utils/FileSaver.min", function(){});

/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed 
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */
if(!window.console) {
	window.console = {};
	window.console.log = function(str) {};
	window.console.dir = function(str) {};
}

if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

(function(){
	// canvg(target, s)
	// empty parameters: replace all 'svg' elements on page with 'canvas' elements
	// target: canvas element or the id of a canvas element
	// s: svg string, url to svg file, or xml document
	// opts: optional hash of options
	//		 ignoreMouse: true => ignore mouse events
	//		 ignoreAnimation: true => ignore animations
	//		 ignoreDimensions: true => does not try to resize canvas
	//		 ignoreClear: true => does not clear canvas
	//		 offsetX: int => draws at a x offset
	//		 offsetY: int => draws at a y offset
	//		 scaleWidth: int => scales horizontally to width
	//		 scaleHeight: int => scales vertically to height
	//		 renderCallback: function => will call the function after the first render is completed
	//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
	this.canvg = function (target, s, opts) {
		// no parameters
		if (target == null && s == null && opts == null) {
			var svgTags = document.getElementsByTagName('svg');
			for (var i=0; i<svgTags.length; i++) {
				var svgTag = svgTags[i];
				var c = document.createElement('canvas');
				c.width = svgTag.clientWidth;
				c.height = svgTag.clientHeight;
				svgTag.parentNode.insertBefore(c, svgTag);
				svgTag.parentNode.removeChild(svgTag);
				var div = document.createElement('div');
				div.appendChild(svgTag);
				canvg(c, div.innerHTML);
			}
			return;
		}	
		opts = opts || {};
	
		if (typeof target == 'string') {
			target = document.getElementById(target);
		}
		
		// reuse class per canvas
		var svg;
		if (target.svg == null) {
			svg = build();
			target.svg = svg;
		}
		else {
			svg = target.svg;
			svg.stop();
		}
		svg.opts = opts;
		
		var ctx = target.getContext('2d');
		if (typeof(s.documentElement) != 'undefined') {
			// load from xml doc
			svg.loadXmlDoc(ctx, s);
		}
		else if (s.substr(0,1) == '<') {
			// load from xml string
			svg.loadXml(ctx, s);
		}
		else {
			// load from url
			svg.load(ctx, s);
		}
	}

	function build() {
		var svg = { };
		
		svg.FRAMERATE = 30;
		svg.MAX_VIRTUAL_PIXELS = 30000;
		
		// globals
		svg.init = function(ctx) {
			svg.Definitions = {};
			svg.Styles = {};
			svg.Animations = [];
			svg.Images = [];
			svg.ctx = ctx;
			svg.ViewPort = new (function () {
				this.viewPorts = [];
				this.Clear = function() { this.viewPorts = []; }
				this.SetCurrent = function(width, height) { this.viewPorts.push({ width: width, height: height }); }
				this.RemoveCurrent = function() { this.viewPorts.pop(); }
				this.Current = function() { return this.viewPorts[this.viewPorts.length - 1]; }
				this.width = function() { return this.Current().width; }
				this.height = function() { return this.Current().height; }
				this.ComputeSize = function(d) {
					if (d != null && typeof(d) == 'number') return d;
					if (d == 'x') return this.width();
					if (d == 'y') return this.height();
					return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);			
				}
			});
		}
		svg.init();
		
		// images loaded
		svg.ImagesLoaded = function() { 
			for (var i=0; i<svg.Images.length; i++) {
				if (!svg.Images[i].loaded) return false;
			}
			return true;
		}

		// trim
		svg.trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }
		
		// compress spaces
		svg.compressSpaces = function(s) { return s.replace(/[\s\r\t\n]+/gm,' '); }
		
		// ajax
		svg.ajax = function(url) {
			var AJAX;
			if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
			else{AJAX=new ActiveXObject('Microsoft.XMLHTTP');}
			if(AJAX){
			   AJAX.open('GET',url,false);
			   AJAX.send(null);
			   return AJAX.responseText;
			}
			return null;
		} 
		
		// parse xml
		svg.parseXml = function(xml) {
			if (window.DOMParser)
			{
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			}
			else 
			{
				xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
				var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(xml); 
				return xmlDoc;
			}		
		}
		
		svg.Property = function(name, value) {
			this.name = name;
			this.value = value;
			
			this.hasValue = function() {
				return (this.value != null && this.value !== '');
			}
							
			// return the numerical value of the property
			this.numValue = function() {
				if (!this.hasValue()) return 0;
				
				var n = parseFloat(this.value);
				if ((this.value + '').match(/%$/)) {
					n = n / 100.0;
				}
				return n;
			}
			
			this.valueOrDefault = function(def) {
				if (this.hasValue()) return this.value;
				return def;
			}
			
			this.numValueOrDefault = function(def) {
				if (this.hasValue()) return this.numValue();
				return def;
			}
			
			/* EXTENSIONS */
			var that = this;
			
			// color extensions
			this.Color = {
				// augment the current color value with the opacity
				addOpacity: function(opacity) {
					var newValue = that.value;
					if (opacity != null && opacity != '') {
						var color = new RGBColor(that.value);
						if (color.ok) {
							newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacity + ')';
						}
					}
					return new svg.Property(that.name, newValue);
				}
			}
			
			// definition extensions
			this.Definition = {
				// get the definition from the definitions table
				getDefinition: function() {
					var name = that.value.replace(/^(url\()?#([^\)]+)\)?$/, '$2');
					return svg.Definitions[name];
				},
				
				isUrl: function() {
					return that.value.indexOf('url(') == 0
				},
				
				getFillStyle: function(e) {
					var def = this.getDefinition();
					
					// gradient
					if (def != null && def.createGradient) {
						return def.createGradient(svg.ctx, e);
					}
					
					// pattern
					if (def != null && def.createPattern) {
						return def.createPattern(svg.ctx, e);
					}
					
					return null;
				}
			}
			
			// length extensions
			this.Length = {
				DPI: function(viewPort) {
					return 96.0; // TODO: compute?
				},
				
				EM: function(viewPort) {
					var em = 12;
					
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					if (fontSize.hasValue()) em = fontSize.Length.toPixels(viewPort);
					
					return em;
				},
			
				// get the length as pixels
				toPixels: function(viewPort) {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/em$/)) return that.numValue() * this.EM(viewPort);
					if (s.match(/ex$/)) return that.numValue() * this.EM(viewPort) / 2.0;
					if (s.match(/px$/)) return that.numValue();
					if (s.match(/pt$/)) return that.numValue() * 1.25;
					if (s.match(/pc$/)) return that.numValue() * 15;
					if (s.match(/cm$/)) return that.numValue() * this.DPI(viewPort) / 2.54;
					if (s.match(/mm$/)) return that.numValue() * this.DPI(viewPort) / 25.4;
					if (s.match(/in$/)) return that.numValue() * this.DPI(viewPort);
					if (s.match(/%$/)) return that.numValue() * svg.ViewPort.ComputeSize(viewPort);
					return that.numValue();
				}
			}
			
			// time extensions
			this.Time = {
				// get the time as milliseconds
				toMilliseconds: function() {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/s$/)) return that.numValue() * 1000;
					if (s.match(/ms$/)) return that.numValue();
					return that.numValue();
				}
			}
			
			// angle extensions
			this.Angle = {
				// get the angle as radians
				toRadians: function() {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/deg$/)) return that.numValue() * (Math.PI / 180.0);
					if (s.match(/grad$/)) return that.numValue() * (Math.PI / 200.0);
					if (s.match(/rad$/)) return that.numValue();
					return that.numValue() * (Math.PI / 180.0);
				}
			}
		}
		
		// fonts
		svg.Font = new (function() {
			this.Styles = ['normal','italic','oblique','inherit'];
			this.Variants = ['normal','small-caps','inherit'];
			this.Weights = ['normal','bold','bolder','lighter','100','200','300','400','500','600','700','800','900','inherit'];
			
			this.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) { 
				var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
				return { 
					fontFamily: fontFamily || f.fontFamily, 
					fontSize: fontSize || f.fontSize, 
					fontStyle: fontStyle || f.fontStyle, 
					fontWeight: fontWeight || f.fontWeight, 
					fontVariant: fontVariant || f.fontVariant,
					toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') } 
				} 
			}
			
			var that = this;
			this.Parse = function(s) {
				var f = {};
				var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
				var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
				var ff = '';
				for (var i=0; i<d.length; i++) {
					if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
					else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true;	}
					else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {	if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
					else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
					else { if (d[i] != 'inherit') ff += d[i]; }
				} if (ff != '') f.fontFamily = ff;
				return f;
			}
		});
		
		// points and paths
		svg.ToNumberArray = function(s) {
			var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i=0; i<a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
		}		
		svg.Point = function(x, y) {
			this.x = x;
			this.y = y;
			
			this.angleTo = function(p) {
				return Math.atan2(p.y - this.y, p.x - this.x);
			}
			
			this.applyTransform = function(v) {
				var xp = this.x * v[0] + this.y * v[2] + v[4];
				var yp = this.x * v[1] + this.y * v[3] + v[5];
				this.x = xp;
				this.y = yp;
			}
		}
		svg.CreatePoint = function(s) {
			var a = svg.ToNumberArray(s);
			return new svg.Point(a[0], a[1]);
		}
		svg.CreatePath = function(s) {
			var a = svg.ToNumberArray(s);
			var path = [];
			for (var i=0; i<a.length; i+=2) {
				path.push(new svg.Point(a[i], a[i+1]));
			}
			return path;
		}
		
		// bounding box
		svg.BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
			this.x1 = Number.NaN;
			this.y1 = Number.NaN;
			this.x2 = Number.NaN;
			this.y2 = Number.NaN;
			
			this.x = function() { return this.x1; }
			this.y = function() { return this.y1; }
			this.width = function() { return this.x2 - this.x1; }
			this.height = function() { return this.y2 - this.y1; }
			
			this.addPoint = function(x, y) {	
				if (x != null) {
					if (isNaN(this.x1) || isNaN(this.x2)) {
						this.x1 = x;
						this.x2 = x;
					}
					if (x < this.x1) this.x1 = x;
					if (x > this.x2) this.x2 = x;
				}
			
				if (y != null) {
					if (isNaN(this.y1) || isNaN(this.y2)) {
						this.y1 = y;
						this.y2 = y;
					}
					if (y < this.y1) this.y1 = y;
					if (y > this.y2) this.y2 = y;
				}
			}			
			this.addX = function(x) { this.addPoint(x, null); }
			this.addY = function(y) { this.addPoint(null, y); }
			
			this.addBoundingBox = function(bb) {
				this.addPoint(bb.x1, bb.y1);
				this.addPoint(bb.x2, bb.y2);
			}
			
			this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
				var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
				var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
				this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
			}
			
			this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
				// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
				var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
				this.addPoint(p0[0], p0[1]);
				this.addPoint(p3[0], p3[1]);
				
				for (i=0; i<=1; i++) {
					var f = function(t) { 
						return Math.pow(1-t, 3) * p0[i]
						+ 3 * Math.pow(1-t, 2) * t * p1[i]
						+ 3 * (1-t) * Math.pow(t, 2) * p2[i]
						+ Math.pow(t, 3) * p3[i];
					}
					
					var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
					var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
					var c = 3 * p1[i] - 3 * p0[i];
					
					if (a == 0) {
						if (b == 0) continue;
						var t = -c / b;
						if (0 < t && t < 1) {
							if (i == 0) this.addX(f(t));
							if (i == 1) this.addY(f(t));
						}
						continue;
					}
					
					var b2ac = Math.pow(b, 2) - 4 * c * a;
					if (b2ac < 0) continue;
					var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
					if (0 < t1 && t1 < 1) {
						if (i == 0) this.addX(f(t1));
						if (i == 1) this.addY(f(t1));
					}
					var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
					if (0 < t2 && t2 < 1) {
						if (i == 0) this.addX(f(t2));
						if (i == 1) this.addY(f(t2));
					}
				}
			}
			
			this.isPointInBox = function(x, y) {
				return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
			}
			
			this.addPoint(x1, y1);
			this.addPoint(x2, y2);
		}
		
		// transforms
		svg.Transform = function(v) {	
			var that = this;
			this.Type = {}
		
			// translate
			this.Type.translate = function(s) {
				this.p = svg.CreatePoint(s);			
				this.apply = function(ctx) {
					ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				}
			}
			
			// rotate
			this.Type.rotate = function(s) {
				var a = svg.ToNumberArray(s);
				this.angle = new svg.Property('angle', a[0]);
				this.cx = a[1] || 0;
				this.cy = a[2] || 0;
				this.apply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(this.angle.Angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.applyToPoint = function(p) {
					var a = this.angle.Angle.toRadians();
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
					p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
					p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
				}			
			}
			
			this.Type.scale = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
				}				
			}
			
			this.Type.matrix = function(s) {
				this.m = svg.ToNumberArray(s);
				this.apply = function(ctx) {
					ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
				}
				this.applyToPoint = function(p) {
					p.applyTransform(this.m);
				}					
			}
			
			this.Type.SkewBase = function(s) {
				this.base = that.Type.matrix;
				this.base(s);
				this.angle = new svg.Property('angle', s);
			}
			this.Type.SkewBase.prototype = new this.Type.matrix;
			
			this.Type.skewX = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, 0, Math.tan(this.angle.Angle.toRadians()), 1, 0, 0];
			}
			this.Type.skewX.prototype = new this.Type.SkewBase;
			
			this.Type.skewY = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, Math.tan(this.angle.Angle.toRadians()), 0, 1, 0, 0];
			}
			this.Type.skewY.prototype = new this.Type.SkewBase;
		
			this.transforms = [];
			
			this.apply = function(ctx) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].apply(ctx);
				}
			}
			
			this.applyToPoint = function(p) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].applyToPoint(p);
				}
			}
			
			var data = svg.trim(svg.compressSpaces(v)).split(/\s(?=[a-z])/);
			for (var i=0; i<data.length; i++) {
				var type = data[i].split('(')[0];
				var s = data[i].split('(')[1].replace(')','');
				var transform = new this.Type[type](s);
				this.transforms.push(transform);
			}
		}
		
		// aspect ratio
		svg.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
			// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
			aspectRatio = svg.compressSpaces(aspectRatio);
			aspectRatio = aspectRatio.replace(/^defer\s/,''); // ignore defer
			var align = aspectRatio.split(' ')[0] || 'xMidYMid';
			var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';					
	
			// calculate scale
			var scaleX = width / desiredWidth;
			var scaleY = height / desiredHeight;
			var scaleMin = Math.min(scaleX, scaleY);
			var scaleMax = Math.max(scaleX, scaleY);
			if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
			if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }	
			
			refX = new svg.Property('refX', refX);
			refY = new svg.Property('refY', refY);
			if (refX.hasValue() && refY.hasValue()) {				
				ctx.translate(-scaleMin * refX.Length.toPixels('x'), -scaleMin * refY.Length.toPixels('y'));
			} 
			else {					
				// align
				if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0); 
				if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0); 
				if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0); 
				if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight); 
			}
			
			// scale
			if (align == 'none') ctx.scale(scaleX, scaleY);
			else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin); 
			else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax); 	
			
			// translate
			ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);			
		}
		
		// elements
		svg.Element = {}
		
		svg.Element.ElementBase = function(node) {	
			this.attributes = {};
			this.styles = {};
			this.children = [];
			
			// get or create attribute
			this.attribute = function(name, createIfNotExists) {
				var a = this.attributes[name];
				if (a != null) return a;
							
				a = new svg.Property(name, '');
				if (createIfNotExists == true) this.attributes[name] = a;
				return a;
			}
			
			// get or create style, crawls up node tree
			this.style = function(name, createIfNotExists) {
				var s = this.styles[name];
				if (s != null) return s;
				
				var a = this.attribute(name);
				if (a != null && a.hasValue()) {
					return a;
				}
				
				var p = this.parent;
				if (p != null) {
					var ps = p.style(name);
					if (ps != null && ps.hasValue()) {
						return ps;
					}
				}
					
				s = new svg.Property(name, '');
				if (createIfNotExists == true) this.styles[name] = s;
				return s;
			}
			
			// base render
			this.render = function(ctx) {
				// don't render display=none
				if (this.style('display').value == 'none') return;
				
				// don't render visibility=hidden
				if (this.attribute('visibility').value == 'hidden') return;
			
				ctx.save();
					this.setContext(ctx);
						// mask
						if (this.attribute('mask').hasValue()) {
							var mask = this.attribute('mask').Definition.getDefinition();
							if (mask != null) mask.apply(ctx, this);
						}
						else if (this.style('filter').hasValue()) {
							var filter = this.style('filter').Definition.getDefinition();
							if (filter != null) filter.apply(ctx, this);
						}
						else this.renderChildren(ctx);				
					this.clearContext(ctx);
				ctx.restore();
			}
			
			// base set context
			this.setContext = function(ctx) {
				// OVERRIDE ME!
			}
			
			// base clear context
			this.clearContext = function(ctx) {
				// OVERRIDE ME!
			}			
			
			// base render children
			this.renderChildren = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					this.children[i].render(ctx);
				}
			}
			
			this.addChild = function(childNode, create) {
				var child = childNode;
				if (create) child = svg.CreateElement(childNode);
				child.parent = this;
				this.children.push(child);			
			}
				
			if (node != null && node.nodeType == 1) { //ELEMENT_NODE
				// add children
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
				}
				
				// add attributes
				for (var i=0; i<node.attributes.length; i++) {
					var attribute = node.attributes[i];
					this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.nodeValue);
				}
										
				// add tag styles
				var styles = svg.Styles[node.nodeName];
				if (styles != null) {
					for (var name in styles) {
						this.styles[name] = styles[name];
					}
				}					
				
				// add class styles
				if (this.attribute('class').hasValue()) {
					var classes = svg.compressSpaces(this.attribute('class').value).split(' ');
					for (var j=0; j<classes.length; j++) {
						styles = svg.Styles['.'+classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
						styles = svg.Styles[node.nodeName+'.'+classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
					}
				}
				
				// add inline styles
				if (this.attribute('style').hasValue()) {
					var styles = this.attribute('style').value.split(';');
					for (var i=0; i<styles.length; i++) {
						if (svg.trim(styles[i]) != '') {
							var style = styles[i].split(':');
							var name = svg.trim(style[0]);
							var value = svg.trim(style[1]);
							this.styles[name] = new svg.Property(name, value);
						}
					}
				}	

				// add id
				if (this.attribute('id').hasValue()) {
					if (svg.Definitions[this.attribute('id').value] == null) {
						svg.Definitions[this.attribute('id').value] = this;
					}
				}
			}
		}
		
		svg.Element.RenderedElementBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.setContext = function(ctx) {
				// fill
				if (this.style('fill').Definition.isUrl()) {
					var fs = this.style('fill').Definition.getFillStyle(this);
					if (fs != null) ctx.fillStyle = fs;
				}
				else if (this.style('fill').hasValue()) {
					var fillStyle = this.style('fill');
					if (this.style('fill-opacity').hasValue()) fillStyle = fillStyle.Color.addOpacity(this.style('fill-opacity').value);
					ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
				}
									
				// stroke
				if (this.style('stroke').Definition.isUrl()) {
					var fs = this.style('stroke').Definition.getFillStyle(this);
					if (fs != null) ctx.strokeStyle = fs;
				}
				else if (this.style('stroke').hasValue()) {
					var strokeStyle = this.style('stroke');
					if (this.style('stroke-opacity').hasValue()) strokeStyle = strokeStyle.Color.addOpacity(this.style('stroke-opacity').value);
					ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
				}
				if (this.style('stroke-width').hasValue()) ctx.lineWidth = this.style('stroke-width').Length.toPixels();
				if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
				if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
				if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;

				// font
				if (typeof(ctx.font) != 'undefined') {
					ctx.font = svg.Font.CreateFont( 
						this.style('font-style').value, 
						this.style('font-variant').value, 
						this.style('font-weight').value, 
						this.style('font-size').hasValue() ? this.style('font-size').Length.toPixels() + 'px' : '', 
						this.style('font-family').value).toString();
				}
				
				// transform
				if (this.attribute('transform').hasValue()) { 
					var transform = new svg.Transform(this.attribute('transform').value);
					transform.apply(ctx);
				}
				
				// clip
				if (this.attribute('clip-path').hasValue()) {
					var clip = this.attribute('clip-path').Definition.getDefinition();
					if (clip != null) clip.apply(ctx);
				}
				
				// opacity
				if (this.style('opacity').hasValue()) {
					ctx.globalAlpha = this.style('opacity').numValue();
				}
			}		
		}
		svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;
		
		svg.Element.PathElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				if (ctx != null) ctx.beginPath();
				return new svg.BoundingBox();
			}
			
			this.renderChildren = function(ctx) {
				this.path(ctx);
				svg.Mouse.checkPath(this, ctx);
				if (ctx.fillStyle != '') ctx.fill();
				if (ctx.strokeStyle != '') ctx.stroke();
				
				var markers = this.getMarkers();
				if (markers != null) {
					if (this.style('marker-start').Definition.isUrl()) {
						var marker = this.style('marker-start').Definition.getDefinition();
						marker.render(ctx, markers[0][0], markers[0][1]);
					}
					if (this.style('marker-mid').Definition.isUrl()) {
						var marker = this.style('marker-mid').Definition.getDefinition();
						for (var i=1;i<markers.length-1;i++) {
							marker.render(ctx, markers[i][0], markers[i][1]);
						}
					}
					if (this.style('marker-end').Definition.isUrl()) {
						var marker = this.style('marker-end').Definition.getDefinition();
						marker.render(ctx, markers[markers.length-1][0], markers[markers.length-1][1]);
					}
				}					
			}
			
			this.getBoundingBox = function() {
				return this.path();
			}
			
			this.getMarkers = function() {
				return null;
			}
		}
		svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;
		
		// svg element
		svg.Element.svg = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseClearContext = this.clearContext;
			this.clearContext = function(ctx) {
				this.baseClearContext(ctx);
				svg.ViewPort.RemoveCurrent();
			}
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				// initial values
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				ctx.lineCap = 'butt';
				ctx.lineJoin = 'miter';
				ctx.miterLimit = 4;			
			
				this.baseSetContext(ctx);
				
				// create new view port
				if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
					ctx.translate(this.attribute('x').Length.toPixels('x'), this.attribute('y').Length.toPixels('y'));
				}
				
				var width = svg.ViewPort.width();
				var height = svg.ViewPort.height();
				if (typeof(this.root) == 'undefined' && this.attribute('width').hasValue() && this.attribute('height').hasValue()) {
					width = this.attribute('width').Length.toPixels('x');
					height = this.attribute('height').Length.toPixels('y');
					
					var x = 0;
					var y = 0;
					if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
						x = -this.attribute('refX').Length.toPixels('x');
						y = -this.attribute('refY').Length.toPixels('y');
					}
					
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(width, y);
					ctx.lineTo(width, height);
					ctx.lineTo(x, height);
					ctx.closePath();
					ctx.clip();
				}
				svg.ViewPort.SetCurrent(width, height);	
						
				// viewbox
				if (this.attribute('viewBox').hasValue()) {				
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];
					
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value, 
									svg.ViewPort.width(), 
									width,
									svg.ViewPort.height(),
									height,
									minX,
									minY,
									this.attribute('refX').value,
									this.attribute('refY').value);
										
					svg.ViewPort.RemoveCurrent();	
					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);						
				}				
			}
		}
		svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

		// rect element
		svg.Element.rect = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				var rx = this.attribute('rx').Length.toPixels('x');
				var ry = this.attribute('ry').Length.toPixels('y');
				if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
				if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(x + rx, y);
					ctx.lineTo(x + width - rx, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
					ctx.lineTo(x + width, y + height - ry);
					ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
					ctx.lineTo(x + rx, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
					ctx.lineTo(x, y + ry);
					ctx.quadraticCurveTo(x, y, x + rx, y)
					ctx.closePath();
				}
				
				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.rect.prototype = new svg.Element.PathElementBase;
		
		// circle element
		svg.Element.circle = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var cx = this.attribute('cx').Length.toPixels('x');
				var cy = this.attribute('cy').Length.toPixels('y');
				var r = this.attribute('r').Length.toPixels();
			
				if (ctx != null) {
					ctx.beginPath();
					ctx.arc(cx, cy, r, 0, Math.PI * 2, true); 
					ctx.closePath();
				}
				
				return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
			}
		}
		svg.Element.circle.prototype = new svg.Element.PathElementBase;	

		// ellipse element
		svg.Element.ellipse = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
				var rx = this.attribute('rx').Length.toPixels('x');
				var ry = this.attribute('ry').Length.toPixels('y');
				var cx = this.attribute('cx').Length.toPixels('x');
				var cy = this.attribute('cy').Length.toPixels('y');
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(cx, cy - ry);
					ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
					ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
					ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
					ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
					ctx.closePath();
				}
				
				return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
			}
		}
		svg.Element.ellipse.prototype = new svg.Element.PathElementBase;			
		
		// line element
		svg.Element.line = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.getPoints = function() {
				return [
					new svg.Point(this.attribute('x1').Length.toPixels('x'), this.attribute('y1').Length.toPixels('y')),
					new svg.Point(this.attribute('x2').Length.toPixels('x'), this.attribute('y2').Length.toPixels('y'))];
			}
								
			this.path = function(ctx) {
				var points = this.getPoints();
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					ctx.lineTo(points[1].x, points[1].y);
				}
				
				return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
			}
			
			this.getMarkers = function() {
				var points = this.getPoints();	
				var a = points[0].angleTo(points[1]);
				return [[points[0], a], [points[1], a]];
			}
		}
		svg.Element.line.prototype = new svg.Element.PathElementBase;		
				
		// polyline element
		svg.Element.polyline = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.points = svg.CreatePath(this.attribute('points').value);
			this.path = function(ctx) {
				var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
				}
				for (var i=1; i<this.points.length; i++) {
					bb.addPoint(this.points[i].x, this.points[i].y);
					if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				return bb;
			}
			
			this.getMarkers = function() {
				var markers = [];
				for (var i=0; i<this.points.length - 1; i++) {
					markers.push([this.points[i], this.points[i].angleTo(this.points[i+1])]);
				}
				markers.push([this.points[this.points.length-1], markers[markers.length-1][1]]);
				return markers;
			}			
		}
		svg.Element.polyline.prototype = new svg.Element.PathElementBase;				
				
		// polygon element
		svg.Element.polygon = function(node) {
			this.base = svg.Element.polyline;
			this.base(node);
			
			this.basePath = this.path;
			this.path = function(ctx) {
				var bb = this.basePath(ctx);
				if (ctx != null) {
					ctx.lineTo(this.points[0].x, this.points[0].y);
					ctx.closePath();
				}
				return bb;
			}
		}
		svg.Element.polygon.prototype = new svg.Element.polyline;

		// path element
		svg.Element.path = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
					
			var d = this.attribute('d').value;
			// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
			d = d.replace(/,/gm,' '); // get rid of all commas
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // separate commands from points
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from points
			d = d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits when no comma
			d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when no comma
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
			d = svg.compressSpaces(d); // compress multiple spaces
			d = svg.trim(d);
			this.PathParser = new (function(d) {
				this.tokens = d.split(' ');
				
				this.reset = function() {
					this.i = -1;
					this.command = '';
					this.previousCommand = '';
					this.start = new svg.Point(0, 0);
					this.control = new svg.Point(0, 0);
					this.current = new svg.Point(0, 0);
					this.points = [];
					this.angles = [];
				}
								
				this.isEnd = function() {
					return this.i >= this.tokens.length - 1;
				}
				
				this.isCommandOrEnd = function() {
					if (this.isEnd()) return true;
					return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
				}
				
				this.isRelativeCommand = function() {
					return this.command == this.command.toLowerCase();
				}
							
				this.getToken = function() {
					this.i = this.i + 1;
					return this.tokens[this.i];
				}
				
				this.getScalar = function() {
					return parseFloat(this.getToken());
				}
				
				this.nextCommand = function() {
					this.previousCommand = this.command;
					this.command = this.getToken();
				}				
				
				this.getPoint = function() {
					var p = new svg.Point(this.getScalar(), this.getScalar());
					return this.makeAbsolute(p);
				}
				
				this.getAsControlPoint = function() {
					var p = this.getPoint();
					this.control = p;
					return p;
				}
				
				this.getAsCurrentPoint = function() {
					var p = this.getPoint();
					this.current = p;
					return p;	
				}
				
				this.getReflectedControlPoint = function() {
					if (this.previousCommand.toLowerCase() != 'c' && this.previousCommand.toLowerCase() != 's') {
						return this.current;
					}
					
					// reflect point
					var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);					
					return p;
				}
				
				this.makeAbsolute = function(p) {
					if (this.isRelativeCommand()) {
						p.x = this.current.x + p.x;
						p.y = this.current.y + p.y;
					}
					return p;
				}
				
				this.addMarker = function(p, from, priorTo) {
					// if the last angle isn't filled in because we didn't have this point yet ...
					if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length-1] == null) {
						this.angles[this.angles.length-1] = this.points[this.points.length-1].angleTo(priorTo);
					}
					this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
				}
				
				this.addMarkerAngle = function(p, a) {
					this.points.push(p);
					this.angles.push(a);
				}				
				
				this.getMarkerPoints = function() { return this.points; }
				this.getMarkerAngles = function() {
					for (var i=0; i<this.angles.length; i++) {
						if (this.angles[i] == null) {
							for (var j=i+1; j<this.angles.length; j++) {
								if (this.angles[j] != null) {
									this.angles[i] = this.angles[j];
									break;
								}
							}
						}
					}
					return this.angles;
				}
			})(d);

			this.path = function(ctx) {
				var pp = this.PathParser;
				pp.reset();

				var bb = new svg.BoundingBox();
				if (ctx != null) ctx.beginPath();
				while (!pp.isEnd()) {
					pp.nextCommand();
					switch (pp.command.toUpperCase()) {
					case 'M':
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.moveTo(p.x, p.y);
						pp.start = pp.current;
						while (!pp.isCommandOrEnd()) {
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, pp.start);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'L':
						while (!pp.isCommandOrEnd()) {
							var c = pp.current;
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, c);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'H':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'V':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'C':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'S':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getReflectedControlPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'Q':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'T':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getReflectedControlPoint();
							pp.control = cntrl;
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'A':
						while (!pp.isCommandOrEnd()) {
						    var curr = pp.current;
							var rx = pp.getScalar();
							var ry = pp.getScalar();
							var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
							var largeArcFlag = pp.getScalar();
							var sweepFlag = pp.getScalar();
							var cp = pp.getAsCurrentPoint();

							// Conversion from endpoint to center parameterization
							// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
							// x1', y1'
							var currp = new svg.Point(
								Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
								-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
							);
							// adjust radii
							var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);
							if (l > 1) {
								rx *= Math.sqrt(l);
								ry *= Math.sqrt(l);
							}
							// cx', cy'
							var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
								(Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
							);
							if (isNaN(s)) s = 0;
							var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
							// cx, cy
							var centp = new svg.Point(
								(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
								(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
							);
							// vector magnitude
							var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
							// ratio between two vectors
							var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
							// angle between two vectors
							var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
							// initial angle
							var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
							// angle delta
							var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
							var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
							var ad = a(u, v);
							if (r(u,v) <= -1) ad = Math.PI;
							if (r(u,v) >= 1) ad = 0;

							if (sweepFlag == 0 && ad > 0) ad = ad - 2 * Math.PI;
							if (sweepFlag == 1 && ad < 0) ad = ad + 2 * Math.PI;

							// for markers
							var halfWay = new svg.Point(
								centp.x - rx * Math.cos((a1 + ad) / 2),
								centp.y - ry * Math.sin((a1 + ad) / 2)
							);
							pp.addMarkerAngle(halfWay, (a1 + ad) / 2 + (sweepFlag == 0 ? 1 : -1) * Math.PI / 2);
							pp.addMarkerAngle(cp, ad + (sweepFlag == 0 ? 1 : -1) * Math.PI / 2);

							bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
							if (ctx != null) {
								var r = rx > ry ? rx : ry;
								var sx = rx > ry ? 1 : rx / ry;
								var sy = rx > ry ? ry / rx : 1;

								ctx.translate(centp.x, centp.y);
								ctx.rotate(xAxisRotation);
								ctx.scale(sx, sy);
								ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
								ctx.scale(1/sx, 1/sy);
								ctx.rotate(-xAxisRotation);
								ctx.translate(-centp.x, -centp.y);
							}
						}
						break;
					case 'Z':
						if (ctx != null) ctx.closePath();
						pp.current = pp.start;
					}
				}

				return bb;
			}

			this.getMarkers = function() {
				var points = this.PathParser.getMarkerPoints();
				var angles = this.PathParser.getMarkerAngles();
				
				var markers = [];
				for (var i=0; i<points.length; i++) {
					markers.push([points[i], angles[i]]);
				}
				return markers;
			}
		}
		svg.Element.path.prototype = new svg.Element.PathElementBase;
		
		// pattern element
		svg.Element.pattern = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.createPattern = function(ctx, element) {
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['x'] = new svg.Property('x', this.attribute('x').value);
				tempSvg.attributes['y'] = new svg.Property('y', this.attribute('y').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
				tempSvg.children = this.children;
				
				var c = document.createElement('canvas');
				c.width = this.attribute('width').Length.toPixels('x');
				c.height = this.attribute('height').Length.toPixels('y');
				tempSvg.render(c.getContext('2d'));		
				return ctx.createPattern(c, 'repeat');
			}
		}
		svg.Element.pattern.prototype = new svg.Element.ElementBase;
		
		// marker element
		svg.Element.marker = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.baseRender = this.render;
			this.render = function(ctx, point, angle) {
				ctx.translate(point.x, point.y);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
				ctx.save();
							
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
				tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
				tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
				tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
				tempSvg.children = this.children;
				tempSvg.render(ctx);
				
				ctx.restore();
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1/ctx.lineWidth, 1/ctx.lineWidth);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
				ctx.translate(-point.x, -point.y);
			}
		}
		svg.Element.marker.prototype = new svg.Element.ElementBase;
		
		// definitions element
		svg.Element.defs = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			this.render = function(ctx) {
				// NOOP
			}
		}
		svg.Element.defs.prototype = new svg.Element.ElementBase;
		
		// base for gradients
		svg.Element.GradientBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.gradientUnits = this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
			
			this.stops = [];			
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				this.stops.push(child);
			}	
			
			this.getGradient = function() {
				// OVERRIDE ME!
			}			

			this.createGradient = function(ctx, element) {
				var stopsContainer = this;
				if (this.attribute('xlink:href').hasValue()) {
					stopsContainer = this.attribute('xlink:href').Definition.getDefinition();
				}
			
				var g = this.getGradient(ctx, element);
				for (var i=0; i<stopsContainer.stops.length; i++) {
					g.addColorStop(stopsContainer.stops[i].offset, stopsContainer.stops[i].color);
				}
				
				if (this.attribute('gradientTransform').hasValue()) {
					// render as transformed pattern on temporary canvas
					var rootView = svg.ViewPort.viewPorts[0];
					
					var rect = new svg.Element.rect();
					rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
					rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);
					
					var group = new svg.Element.g();
					group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
					group.children = [ rect ];
					
					var tempSvg = new svg.Element.svg();
					tempSvg.attributes['x'] = new svg.Property('x', 0);
					tempSvg.attributes['y'] = new svg.Property('y', 0);
					tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
					tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
					tempSvg.children = [ group ];
					
					var c = document.createElement('canvas');
					c.width = rootView.width;
					c.height = rootView.height;
					var tempCtx = c.getContext('2d');
					tempCtx.fillStyle = g;
					tempSvg.render(tempCtx);		
					return tempCtx.createPattern(c, 'no-repeat');
				}
				
				return g;				
			}
		}
		svg.Element.GradientBase.prototype = new svg.Element.ElementBase;
		
		// linear gradient element
		svg.Element.linearGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();
				
				var x1 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('x1').numValue() 
					: this.attribute('x1').Length.toPixels('x'));
				var y1 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('y1').numValue()
					: this.attribute('y1').Length.toPixels('y'));
				var x2 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('x2').numValue()
					: this.attribute('x2').Length.toPixels('x'));
				var y2 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('y2').numValue()
					: this.attribute('y2').Length.toPixels('y'));

				return ctx.createLinearGradient(x1, y1, x2, y2);
			}
		}
		svg.Element.linearGradient.prototype = new svg.Element.GradientBase;
		
		// radial gradient element
		svg.Element.radialGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();
				
				var cx = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('cx').numValue() 
					: this.attribute('cx').Length.toPixels('x'));
				var cy = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('cy').numValue() 
					: this.attribute('cy').Length.toPixels('y'));
				
				var fx = cx;
				var fy = cy;
				if (this.attribute('fx').hasValue()) {
					fx = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('fx').numValue() 
					: this.attribute('fx').Length.toPixels('x'));
				}
				if (this.attribute('fy').hasValue()) {
					fy = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('fy').numValue() 
					: this.attribute('fy').Length.toPixels('y'));
				}
				
				var r = (this.gradientUnits == 'objectBoundingBox' 
					? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
					: this.attribute('r').Length.toPixels());
				
				return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
			}
		}
		svg.Element.radialGradient.prototype = new svg.Element.GradientBase;
		
		// gradient stop element
		svg.Element.stop = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.offset = this.attribute('offset').numValue();
			
			var stopColor = this.style('stop-color');
			if (this.style('stop-opacity').hasValue()) stopColor = stopColor.Color.addOpacity(this.style('stop-opacity').value);
			this.color = stopColor.value;
		}
		svg.Element.stop.prototype = new svg.Element.ElementBase;
		
		// animation base element
		svg.Element.AnimateBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			svg.Animations.push(this);
			
			this.duration = 0.0;
			this.begin = this.attribute('begin').Time.toMilliseconds();
			this.maxDuration = this.begin + this.attribute('dur').Time.toMilliseconds();
			
			this.getProperty = function() {
				var attributeType = this.attribute('attributeType').value;
				var attributeName = this.attribute('attributeName').value;
				
				if (attributeType == 'CSS') {
					return this.parent.style(attributeName, true);
				}
				return this.parent.attribute(attributeName, true);			
			};
			
			this.initialValue = null;
			this.removed = false;			

			this.calcValue = function() {
				// OVERRIDE ME!
				return '';
			}
			
			this.update = function(delta) {	
				// set initial value
				if (this.initialValue == null) {
					this.initialValue = this.getProperty().value;
				}
			
				// if we're past the end time
				if (this.duration > this.maxDuration) {
					// loop for indefinitely repeating animations
					if (this.attribute('repeatCount').value == 'indefinite') {
						this.duration = 0.0
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
						this.removed = true;
						this.getProperty().value = this.initialValue;
						return true;
					}
					else {
						return false; // no updates made
					}
				}			
				this.duration = this.duration + delta;
			
				// if we're past the begin time
				var updated = false;
				if (this.begin < this.duration) {
					var newValue = this.calcValue(); // tween
					
					if (this.attribute('type').hasValue()) {
						// for transform, etc.
						var type = this.attribute('type').value;
						newValue = type + '(' + newValue + ')';
					}
					
					this.getProperty().value = newValue;
					updated = true;
				}
				
				return updated;
			}
			
			// fraction of duration we've covered
			this.progress = function() {
				return ((this.duration - this.begin) / (this.maxDuration - this.begin));
			}			
		}
		svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;
		
		// animate element
		svg.Element.animate = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);
			
			this.calcValue = function() {
				var from = this.attribute('from').numValue();
				var to = this.attribute('to').numValue();
				
				// tween value linearly
				return from + (to - from) * this.progress(); 
			};
		}
		svg.Element.animate.prototype = new svg.Element.AnimateBase;
			
		// animate color element
		svg.Element.animateColor = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var from = new RGBColor(this.attribute('from').value);
				var to = new RGBColor(this.attribute('to').value);
				
				if (from.ok && to.ok) {
					// tween color linearly
					var r = from.r + (to.r - from.r) * this.progress();
					var g = from.g + (to.g - from.g) * this.progress();
					var b = from.b + (to.b - from.b) * this.progress();
					return 'rgb('+parseInt(r,10)+','+parseInt(g,10)+','+parseInt(b,10)+')';
				}
				return this.attribute('from').value;
			};
		}
		svg.Element.animateColor.prototype = new svg.Element.AnimateBase;
		
		// animate transform element
		svg.Element.animateTransform = function(node) {
			this.base = svg.Element.animate;
			this.base(node);
		}
		svg.Element.animateTransform.prototype = new svg.Element.animate;
		
		// font element
		svg.Element.font = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();			
			
			this.isRTL = false;
			this.isArabic = false;
			this.fontFace = null;
			this.missingGlyph = null;
			this.glyphs = [];			
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'font-face') {
					this.fontFace = child;
					if (child.style('font-family').hasValue()) {
						svg.Definitions[child.style('font-family').value] = this;
					}
				}
				else if (child.type == 'missing-glyph') this.missingGlyph = child;
				else if (child.type == 'glyph') {
					if (child.arabicForm != '') {
						this.isRTL = true;
						this.isArabic = true;
						if (typeof(this.glyphs[child.unicode]) == 'undefined') this.glyphs[child.unicode] = [];
						this.glyphs[child.unicode][child.arabicForm] = child;
					}
					else {
						this.glyphs[child.unicode] = child;
					}
				}
			}	
		}
		svg.Element.font.prototype = new svg.Element.ElementBase;
		
		// font-face element
		svg.Element.fontface = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			this.ascent = this.attribute('ascent').value;
			this.descent = this.attribute('descent').value;
			this.unitsPerEm = this.attribute('units-per-em').numValue();				
		}
		svg.Element.fontface.prototype = new svg.Element.ElementBase;
		
		// missing-glyph element
		svg.Element.missingglyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);	
			
			this.horizAdvX = 0;
		}
		svg.Element.missingglyph.prototype = new svg.Element.path;
		
		// glyph element
		svg.Element.glyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);	
			
			this.horizAdvX = this.attribute('horiz-adv-x').numValue();
			this.unicode = this.attribute('unicode').value;
			this.arabicForm = this.attribute('arabic-form').value;
		}
		svg.Element.glyph.prototype = new svg.Element.path;
		
		// text element
		svg.Element.text = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			if (node != null) {
				// add children
				this.children = [];
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) { // capture tspan and tref nodes
						this.addChild(childNode, true);
					}
					else if (childNode.nodeType == 3) { // capture text
						this.addChild(new svg.Element.tspan(childNode), false);
					}
				}
			}
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.style('dominant-baseline').hasValue()) ctx.textBaseline = this.style('dominant-baseline').value;
				if (this.style('alignment-baseline').hasValue()) ctx.textBaseline = this.style('alignment-baseline').value;
			}
			
			this.renderChildren = function(ctx) {
				var textAnchor = this.style('text-anchor').valueOrDefault('start');
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				for (var i=0; i<this.children.length; i++) {
					var child = this.children[i];
				
					if (child.attribute('x').hasValue()) {
						child.x = child.attribute('x').Length.toPixels('x');
					}
					else {
						if (child.attribute('dx').hasValue()) x += child.attribute('dx').Length.toPixels('x');
						child.x = x;
					}
					
					var childLength = child.measureText(ctx);
					if (textAnchor != 'start' && (i==0 || child.attribute('x').hasValue())) { // new group?
						// loop through rest of children
						var groupLength = childLength;
						for (var j=i+1; j<this.children.length; j++) {
							var childInGroup = this.children[j];
							if (childInGroup.attribute('x').hasValue()) break; // new group
							groupLength += childInGroup.measureText(ctx);
						}
						child.x -= (textAnchor == 'end' ? groupLength : groupLength / 2.0);
					}
					x = child.x + childLength;
					
					if (child.attribute('y').hasValue()) {
						child.y = child.attribute('y').Length.toPixels('y');
					}
					else {
						if (child.attribute('dy').hasValue()) y += child.attribute('dy').Length.toPixels('y');
						child.y = y;
					}	
					y = child.y;
					
					child.render(ctx);
				}
			}
		}
		svg.Element.text.prototype = new svg.Element.RenderedElementBase;
		
		// text base
		svg.Element.TextElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.getGlyph = function(font, text, i) {
				var c = text[i];
				var glyph = null;
				if (font.isArabic) {
					var arabicForm = 'isolated';
					if ((i==0 || text[i-1]==' ') && i<text.length-2 && text[i+1]!=' ') arabicForm = 'terminal'; 
					if (i>0 && text[i-1]!=' ' && i<text.length-2 && text[i+1]!=' ') arabicForm = 'medial';
					if (i>0 && text[i-1]!=' ' && (i == text.length-1 || text[i+1]==' ')) arabicForm = 'initial';
					if (typeof(font.glyphs[c]) != 'undefined') {
						glyph = font.glyphs[c][arabicForm];
						if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
					}
				}
				else {
					glyph = font.glyphs[c];
				}
				if (glyph == null) glyph = font.missingGlyph;
				return glyph;
			}
			
			this.renderChildren = function(ctx) {
				var customFont = this.parent.style('font-family').Definition.getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						var scale = fontSize / customFont.fontFace.unitsPerEm;
						ctx.translate(this.x, this.y);
						ctx.scale(scale, -scale);
						var lw = ctx.lineWidth;
						ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
						if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
						glyph.render(ctx);
						if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
						ctx.lineWidth = lw;
						ctx.scale(1/scale, -1/scale);
						ctx.translate(-this.x, -this.y);	
						
						this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							this.x += dx[i];
						}
					}
					return;
				}
			
				if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
				if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
			}
			
			this.getText = function() {
				// OVERRIDE ME
			}
			
			this.measureText = function(ctx) {
				var customFont = this.parent.style('font-family').Definition.getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var measure = 0;
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							measure += dx[i];
						}
					}
					return measure;
				}
			
				var textToMeasure = svg.compressSpaces(this.getText());
				if (!ctx.measureText) return textToMeasure.length * 10;
				
				ctx.save();
				this.setContext(ctx);
				var width = ctx.measureText(textToMeasure).width;
				ctx.restore();
				return width;
			}
		}
		svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;
		
		// tspan 
		svg.Element.tspan = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.text = node.nodeType == 3 ? node.nodeValue : // text
						node.childNodes.length > 0 ? node.childNodes[0].nodeValue : // element
						node.text;
			this.getText = function() {
				return this.text;
			}
		}
		svg.Element.tspan.prototype = new svg.Element.TextElementBase;
		
		// tref
		svg.Element.tref = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.getText = function() {
				var element = this.attribute('xlink:href').Definition.getDefinition();
				if (element != null) return element.children[0].getText();
			}
		}
		svg.Element.tref.prototype = new svg.Element.TextElementBase;		
		
		// a element
		svg.Element.a = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.hasText = true;
			for (var i=0; i<node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType != 3) this.hasText = false;
			}
			
			// this might contain text
			this.text = this.hasText ? node.childNodes[0].nodeValue : '';
			this.getText = function() {
				return this.text;
			}		

			this.baseRenderChildren = this.renderChildren;
			this.renderChildren = function(ctx) {
				if (this.hasText) {
					// render as text element
					this.baseRenderChildren(ctx);
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.Length.toPixels('y'), this.x + this.measureText(ctx), this.y));					
				}
				else {
					// render as temporary group
					var g = new svg.Element.g();
					g.children = this.children;
					g.parent = this;
					g.render(ctx);
				}
			}
			
			this.onclick = function() {
				window.open(this.attribute('xlink:href').value);
			}
			
			this.onmousemove = function() {
				svg.ctx.canvas.style.cursor = 'pointer';
			}
		}
		svg.Element.a.prototype = new svg.Element.TextElementBase;		
		
		// image element
		svg.Element.image = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			svg.Images.push(this);
			this.img = document.createElement('img');
			this.loaded = false;
			var that = this;
			this.img.onload = function() { that.loaded = true; }
			this.img.src = this.attribute('xlink:href').value;
			
			this.renderChildren = function(ctx) {
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');			
				if (width == 0 || height == 0) return;
			
				ctx.save();
				ctx.translate(x, y);
				svg.AspectRatio(ctx,
								this.attribute('preserveAspectRatio').value,
								width,
								this.img.width,
								height,
								this.img.height,
								0,
								0);	
				ctx.drawImage(this.img, 0, 0);			
				ctx.restore();
			}
		}
		svg.Element.image.prototype = new svg.Element.RenderedElementBase;
		
		// group element
		svg.Element.g = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.getBoundingBox = function() {
				var bb = new svg.BoundingBox();
				for (var i=0; i<this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				return bb;
			};
		}
		svg.Element.g.prototype = new svg.Element.RenderedElementBase;

		// symbol element
		svg.Element.symbol = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {		
				this.baseSetContext(ctx);
				
				// viewbox
				if (this.attribute('viewBox').hasValue()) {				
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];
					
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value, 
									this.attribute('width').Length.toPixels('x'),
									width,
									this.attribute('height').Length.toPixels('y'),
									height,
									minX,
									minY);

					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);						
				}
			}			
		}
		svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;		
			
		// style element
		svg.Element.style = function(node) { 
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			// text, or spaces then CDATA
			var css = node.childNodes[0].nodeValue + (node.childNodes.length > 1 ? node.childNodes[1].nodeValue : '');
			css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
			css = svg.compressSpaces(css); // replace whitespace
			var cssDefs = css.split('}');
			for (var i=0; i<cssDefs.length; i++) {
				if (svg.trim(cssDefs[i]) != '') {
					var cssDef = cssDefs[i].split('{');
					var cssClasses = cssDef[0].split(',');
					var cssProps = cssDef[1].split(';');
					for (var j=0; j<cssClasses.length; j++) {
						var cssClass = svg.trim(cssClasses[j]);
						if (cssClass != '') {
							var props = {};
							for (var k=0; k<cssProps.length; k++) {
								var prop = cssProps[k].indexOf(':');
								var name = cssProps[k].substr(0, prop);
								var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
								if (name != null && value != null) {
									props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
								}
							}
							svg.Styles[cssClass] = props;
							if (cssClass == '@font-face') {
								var fontFamily = props['font-family'].value.replace(/"/g,'');
								var srcs = props['src'].value.split(',');
								for (var s=0; s<srcs.length; s++) {
									if (srcs[s].indexOf('format("svg")') > 0) {
										var urlStart = srcs[s].indexOf('url');
										var urlEnd = srcs[s].indexOf(')', urlStart);
										var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
										var doc = svg.parseXml(svg.ajax(url));
										var fonts = doc.getElementsByTagName('font');
										for (var f=0; f<fonts.length; f++) {
											var font = svg.CreateElement(fonts[f]);
											svg.Definitions[fontFamily] = font;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		svg.Element.style.prototype = new svg.Element.ElementBase;
		
		// use element 
		svg.Element.use = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').Length.toPixels('x'), 0);
				if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').Length.toPixels('y'));
			}
			
			this.getDefinition = function() {
				var element = this.attribute('xlink:href').Definition.getDefinition();
				if (this.attribute('width').hasValue()) element.attribute('width', true).value = this.attribute('width').value;
				if (this.attribute('height').hasValue()) element.attribute('height', true).value = this.attribute('height').value;
				return element;
			}
			
			this.path = function(ctx) {
				var element = this.getDefinition();
				if (element != null) element.path(ctx);
			}
			
			this.renderChildren = function(ctx) {
				var element = this.getDefinition();
				if (element != null) element.render(ctx);
			}
		}
		svg.Element.use.prototype = new svg.Element.RenderedElementBase;
		
		// mask element
		svg.Element.mask = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
						
			this.apply = function(ctx, element) {
				// render as temp svg	
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				
				// temporarily remove mask to avoid recursion
				var mask = element.attribute('mask').value;
				element.attribute('mask').value = '';
				
					var cMask = document.createElement('canvas');
					cMask.width = x + width;
					cMask.height = y + height;
					var maskCtx = cMask.getContext('2d');
					this.renderChildren(maskCtx);
				
					var c = document.createElement('canvas');
					c.width = x + width;
					c.height = y + height;
					var tempCtx = c.getContext('2d');
					element.render(tempCtx);
					tempCtx.globalCompositeOperation = 'destination-in';
					tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
					tempCtx.fillRect(0, 0, x + width, y + height);
					
					ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
					ctx.fillRect(0, 0, x + width, y + height);
					
				// reassign mask
				element.attribute('mask').value = mask;	
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.mask.prototype = new svg.Element.ElementBase;
		
		// clip element
		svg.Element.clipPath = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.apply = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					if (this.children[i].path) {
						this.children[i].path(ctx);
						ctx.clip();
					}
				}
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.clipPath.prototype = new svg.Element.ElementBase;

		// filters
		svg.Element.filter = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
						
			this.apply = function(ctx, element) {
				// render as temp svg	
				var bb = element.getBoundingBox();
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				if (x == 0 || y == 0) {
					x = bb.x1;
					y = bb.y1;
				}
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				if (width == 0 || height == 0) {
					width = bb.width();
					height = bb.height();
				}
				
				// temporarily remove filter to avoid recursion
				var filter = element.style('filter').value;
				element.style('filter').value = '';
				
				// max filter distance
				var extraPercent = .20;
				var px = extraPercent * width;
				var py = extraPercent * height;
				
				var c = document.createElement('canvas');
				c.width = width + 2*px;
				c.height = height + 2*py;
				var tempCtx = c.getContext('2d');
				tempCtx.translate(-x + px, -y + py);
				element.render(tempCtx);
			
				// apply filters
				for (var i=0; i<this.children.length; i++) {
					this.children[i].apply(tempCtx, 0, 0, width + 2*px, height + 2*py);
				}
				
				// render on me
				ctx.drawImage(c, 0, 0, width + 2*px, height + 2*py, x - px, y - py, width + 2*px, height + 2*py);
				
				// reassign filter
				element.style('filter', true).value = filter;	
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}		
		}
		svg.Element.filter.prototype = new svg.Element.ElementBase;
		
		svg.Element.feGaussianBlur = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			function make_fgauss(sigma) {
				sigma = Math.max(sigma, 0.01);			      
				var len = Math.ceil(sigma * 4.0) + 1;                     
				mask = [];                               
				for (var i = 0; i < len; i++) {                             
					mask[i] = Math.exp(-0.5 * (i / sigma) * (i / sigma));                                           
				}                                                           
				return mask; 
			}
			
			function normalize(mask) {
				var sum = 0;
				for (var i = 1; i < mask.length; i++) {
					sum += Math.abs(mask[i]);
				}
				sum = 2 * sum + Math.abs(mask[0]);
				for (var i = 0; i < mask.length; i++) {
					mask[i] /= sum;
				}
				return mask;
			}
			
			function convolve_even(src, dst, mask, width, height) {
			  for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
				  var a = imGet(src, x, y, width, height, 3)/255;
				  for (var rgba = 0; rgba < 4; rgba++) {					  
					  var sum = mask[0] * (a==0?255:imGet(src, x, y, width, height, rgba)) * (a==0||rgba==3?1:a);
					  for (var i = 1; i < mask.length; i++) {
						var a1 = imGet(src, Math.max(x-i,0), y, width, height, 3)/255;
					    var a2 = imGet(src, Math.min(x+i, width-1), y, width, height, 3)/255;
						sum += mask[i] * 
						  ((a1==0?255:imGet(src, Math.max(x-i,0), y, width, height, rgba)) * (a1==0||rgba==3?1:a1) + 
						   (a2==0?255:imGet(src, Math.min(x+i, width-1), y, width, height, rgba)) * (a2==0||rgba==3?1:a2));
					  }
					  imSet(dst, y, x, height, width, rgba, sum);
				  }			  
				}
			  }
			}		

			function imGet(img, x, y, width, height, rgba) {
				return img[y*width*4 + x*4 + rgba];
			}
			
			function imSet(img, x, y, width, height, rgba, val) {
				img[y*width*4 + x*4 + rgba] = val;
			}
						
			function blur(ctx, width, height, sigma)
			{
				var srcData = ctx.getImageData(0, 0, width, height);
				var mask = make_fgauss(sigma);
				mask = normalize(mask);
				tmp = [];
				convolve_even(srcData.data, tmp, mask, width, height);
				convolve_even(tmp, srcData.data, mask, height, width);
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(srcData, 0, 0);
			}			
		
			this.apply = function(ctx, x, y, width, height) {
				// assuming x==0 && y==0 for now
				blur(ctx, width, height, this.attribute('stdDeviation').numValue());
			}
		}
		svg.Element.filter.prototype = new svg.Element.feGaussianBlur;
		
		// title element, do nothing
		svg.Element.title = function(node) {
		}
		svg.Element.title.prototype = new svg.Element.ElementBase;

		// desc element, do nothing
		svg.Element.desc = function(node) {
		}
		svg.Element.desc.prototype = new svg.Element.ElementBase;		
		
		svg.Element.MISSING = function(node) {
			console.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
		}
		svg.Element.MISSING.prototype = new svg.Element.ElementBase;
		
		// element factory
		svg.CreateElement = function(node) {	
			var className = node.nodeName.replace(/^[^:]+:/,''); // remove namespace
			className = className.replace(/\-/g,''); // remove dashes
			var e = null;
			if (typeof(svg.Element[className]) != 'undefined') {
				e = new svg.Element[className](node);
			}
			else {
				e = new svg.Element.MISSING(node);
			}

			e.type = node.nodeName;
			return e;
		}
				
		// load from url
		svg.load = function(ctx, url) {
			svg.loadXml(ctx, svg.ajax(url));
		}
		
		// load from xml
		svg.loadXml = function(ctx, xml) {
			svg.loadXmlDoc(ctx, svg.parseXml(xml));
		}
		
		svg.loadXmlDoc = function(ctx, dom) {
			svg.init(ctx);
			
			var mapXY = function(p) {
				var e = ctx.canvas;
				while (e) {
					p.x -= e.offsetLeft;
					p.y -= e.offsetTop;
					e = e.offsetParent;
				}
				if (window.scrollX) p.x += window.scrollX;
				if (window.scrollY) p.y += window.scrollY;
				return p;
			}
			
			// bind mouse
			if (svg.opts['ignoreMouse'] != true) {
				ctx.canvas.onclick = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onclick(p.x, p.y);
				};
				ctx.canvas.onmousemove = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onmousemove(p.x, p.y);
				};
			}
		
			var e = svg.CreateElement(dom.documentElement);
			e.root = true;
					
			// render loop
			var isFirstRender = true;
			var draw = function() {
				svg.ViewPort.Clear();
				if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);
			
				if (svg.opts['ignoreDimensions'] != true) {
					// set canvas size
					if (e.style('width').hasValue()) {
						ctx.canvas.width = e.style('width').Length.toPixels('x');
						ctx.canvas.style.width = ctx.canvas.width + 'px';
					}
					if (e.style('height').hasValue()) {
						ctx.canvas.height = e.style('height').Length.toPixels('y');
						ctx.canvas.style.height = ctx.canvas.height + 'px';
					}
				}
				var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
				var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
				svg.ViewPort.SetCurrent(cWidth, cHeight);		
				
				if (svg.opts != null && svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
				if (svg.opts != null && svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
				if (svg.opts != null && svg.opts['scaleWidth'] != null && svg.opts['scaleHeight'] != null) {
					var xRatio = 1, yRatio = 1;
					if (e.attribute('width').hasValue()) xRatio = e.attribute('width').Length.toPixels('x') / svg.opts['scaleWidth'];
					if (e.attribute('height').hasValue()) yRatio = e.attribute('height').Length.toPixels('y') / svg.opts['scaleHeight'];
				
					e.attribute('width', true).value = svg.opts['scaleWidth'];
					e.attribute('height', true).value = svg.opts['scaleHeight'];			
					e.attribute('viewBox', true).value = '0 0 ' + (cWidth * xRatio) + ' ' + (cHeight * yRatio);
					e.attribute('preserveAspectRatio', true).value = 'none';
				}
			
				// clear and render
				if (svg.opts['ignoreClear'] != true) {
					ctx.clearRect(0, 0, cWidth, cHeight);
				}
				e.render(ctx);
				if (isFirstRender) {
					isFirstRender = false;
					if (svg.opts != null && typeof(svg.opts['renderCallback']) == 'function') svg.opts['renderCallback']();
				}			
			}
			
			var waitingForImages = true;
			if (svg.ImagesLoaded()) {
				waitingForImages = false;
				draw();
			}
			svg.intervalID = setInterval(function() { 
				var needUpdate = false;
				
				if (waitingForImages && svg.ImagesLoaded()) {
					waitingForImages = false;
					needUpdate = true;
				}
			
				// need update from mouse events?
				if (svg.opts['ignoreMouse'] != true) {
					needUpdate = needUpdate | svg.Mouse.hasEvents();
				}
			
				// need update from animations?
				if (svg.opts['ignoreAnimation'] != true) {
					for (var i=0; i<svg.Animations.length; i++) {
						needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
					}
				}
				
				// need update from redraw?
				if (svg.opts != null && typeof(svg.opts['forceRedraw']) == 'function') {
					if (svg.opts['forceRedraw']() == true) needUpdate = true;
				}
				
				// render if needed
				if (needUpdate) {
					draw();				
					svg.Mouse.runEvents(); // run and clear our events
				}
			}, 1000 / svg.FRAMERATE);
		}
		
		svg.stop = function() {
			if (svg.intervalID) {
				clearInterval(svg.intervalID);
			}
		}
		
		svg.Mouse = new (function() {
			this.events = [];
			this.hasEvents = function() { return this.events.length != 0; }
		
			this.onclick = function(x, y) {
				this.events.push({ type: 'onclick', x: x, y: y, 
					run: function(e) { if (e.onclick) e.onclick(); }
				});
			}
			
			this.onmousemove = function(x, y) {
				this.events.push({ type: 'onmousemove', x: x, y: y,
					run: function(e) { if (e.onmousemove) e.onmousemove(); }
				});
			}			
			
			this.eventElements = [];
			
			this.checkPath = function(element, ctx) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
				}
			}
			
			this.checkBoundingBox = function(element, bb) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
				}			
			}
			
			this.runEvents = function() {
				svg.ctx.canvas.style.cursor = '';
				
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					var element = this.eventElements[i];
					while (element) {
						e.run(element);
						element = element.parent;
					}
				}		
			
				// done running, clear
				this.events = []; 
				this.eventElements = [];
			}
		});
		
		return svg;
	}
})();

if (CanvasRenderingContext2D) {
	CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
		canvg(this.canvas, s, { 
			ignoreMouse: true, 
			ignoreAnimation: true, 
			ignoreDimensions: true, 
			ignoreClear: true, 
			offsetX: dx, 
			offsetY: dy, 
			scaleWidth: dw, 
			scaleHeight: dh
		});
	}
};
define("mylibs/utils/canvg", function(){});

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}

;
define("mylibs/utils/rgbcolor", function(){});

(function() {

  define('mylibs/utils/utils',['jQuery', 'Kendo', 'mylibs/utils/BlobBuilder.min', 'mylibs/utils/FileSaver.min', 'mylibs/utils/canvg', 'mylibs/utils/rgbcolor'], function($, kendo) {
    var canvas, pub;
    canvas = {};
    return pub = {
      init: function() {
        canvas = document.createElement("canvas");
        return canvas.toDataURI = function(el) {
          var ctx, imgData, src;
          ctx = canvas.getContext("2d");
          ctx.drawImage(el, 0, 0, el.width, el.height);
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imgData, 0, 0);
          return src = canvas.toDataURL("image/jpeg");
        };
      },
      toArray: function(list) {
        return Array.prototype.slice.call(list || [], 0);
      },
      elToDataURI: function(el) {
        canvas.width = el.width;
        canvas.height = el.height;
        return canvas.toDataURI(el);
      },
      svgToDataURI: function(svg) {
        var src, svg_xml;
        svg_xml = (new XMLSerializer()).serializeToString(svg);
        canvg(canvas, svg_xml);
        return src = canvas.toDataURL("image/jpeg");
      },
      getAnimationFrame: function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
          return window.setTimeout(callback, 1000 / 60);
        };
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/file/file',['jQuery', 'Kendo', 'mylibs/utils/utils'], function(utils) {
    var blobBuiler, compare, dataURIToBlob, errorHandler, fileSystem, myPicturesDir, pub;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    fileSystem = {};
    myPicturesDir = {};
    blobBuiler = {};
    compare = function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    };
    dataURIToBlob = function(dataURI) {
      var ab, blob, byteString, bytes, ia, mimeString, _i, _len;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      ab = new ArrayBuffer(byteString.length, 'binary');
      ia = new Uint8Array(ab);
      for (_i = 0, _len = byteString.length; _i < _len; _i++) {
        bytes = byteString[_i];
        ia[_i] = byteString.charCodeAt(_i);
      }
      blobBuiler = new BlobBuilder();
      blobBuiler.append(ab);
      return blob = blobBuiler.getBlob(mimeString);
    };
    errorHandler = function(e) {
      var msg;
      msg = '';
      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error';
      }
      console.log('Error: ' + msg);
      return $.publish("/msg/error", ["Access to the file system could not be obtained."]);
    };
    return pub = {
      init: function(kb) {
        var success;
        window.webkitStorageInfo.requestQuota(PERSISTENT, kb * 1024, function(grantedBytes) {
          return window.requestFileSystem(PERSISTENT, grantedBytes, success, errorHandler);
        });
        return success = function(fs) {
          fs.root.getDirectory("MyPictures", {
            create: true
          }, function(dirEntry) {
            var animation, dirReader, entries, read;
            myPicturesDir = dirEntry;
            entries = [];
            dirReader = fs.root.createReader();
            animation = {
              effects: "zoomIn fadeIn",
              show: true,
              duration: 1000
            };
            read = function() {
              return dirReader.readEntries(function(results) {
                var entry, _i, _j, _len, _len2, _results;
                if (!results.length) {
                  console.info(entries);
                  entries.sort(compare);
                  _results = [];
                  for (_i = 0, _len = entries.length; _i < _len; _i++) {
                    entry = entries[_i];
                    _results.push($.publish("/pictures/create", [entry.toURL(), entry.name, false, false, null]));
                  }
                  return _results;
                } else {
                  for (_j = 0, _len2 = results.length; _j < _len2; _j++) {
                    entry = results[_j];
                    if (entry.isFile) entries.push(entry);
                  }
                  return read();
                }
              });
            };
            return read();
          }, errorHandler);
          fileSystem = fs;
          return console.info("Got Storage!");
        };
      },
      save: function(name, dataURI) {
        return fileSystem.root.getFile(name, {
          create: true
        }, function(fileEntry) {
          return fileEntry.createWriter(function(fileWriter) {
            var blob;
            fileWriter.onwriteend = function(e) {
              return console.info("save completed");
            };
            fileWriter.onerror = function(e) {
              return console.error("Write failed: " + e.toString());
            };
            blob = dataURIToBlob(dataURI);
            return fileWriter.write(blob);
          });
        }, errorHandler);
      },
      "delete": function(name) {
        return fileSystem.root.getFile(name, {
          create: false
        }, function(fileEntry) {
          return fileEntry.remove(function() {
            return $.publish("/file/deleted/" + name);
          }, errorHandler);
        }, errorHandler);
      },
      download: function(img) {
        var blob, canvas, ctx, dataURL;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        dataURL = canvas.toDataURL();
        blob = dataURIToBlob(dataURL);
        return saveAs(blob);
      }
    };
  });

}).call(this);

/*
 RequireJS text 1.0.6 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){var k=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],n=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,o=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,i=typeof location!=="undefined"&&location.href,p=i&&location.protocol&&location.protocol.replace(/\:/,""),q=i&&location.hostname,r=i&&(location.port||void 0),j=[];define('text',[],function(){var g,h,l;typeof window!=="undefined"&&window.navigator&&window.document?h=function(a,c){var b=g.createXhr();b.open("GET",a,!0);b.onreadystatechange=
function(){b.readyState===4&&c(b.responseText)};b.send(null)}:typeof process!=="undefined"&&process.versions&&process.versions.node?(l=require.nodeRequire("fs"),h=function(a,c){var b=l.readFileSync(a,"utf8");b.indexOf("\ufeff")===0&&(b=b.substring(1));c(b)}):typeof Packages!=="undefined"&&(h=function(a,c){var b=new java.io.File(a),e=java.lang.System.getProperty("line.separator"),b=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(b),"utf-8")),d,f,g="";try{d=new java.lang.StringBuffer;
(f=b.readLine())&&f.length()&&f.charAt(0)===65279&&(f=f.substring(1));for(d.append(f);(f=b.readLine())!==null;)d.append(e),d.append(f);g=String(d.toString())}finally{b.close()}c(g)});return g={version:"1.0.6",strip:function(a){if(a){var a=a.replace(n,""),c=a.match(o);c&&(a=c[1])}else a="";return a},jsEscape:function(a){return a.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r")},createXhr:function(){var a,c,
b;if(typeof XMLHttpRequest!=="undefined")return new XMLHttpRequest;else for(c=0;c<3;c++){b=k[c];try{a=new ActiveXObject(b)}catch(e){}if(a){k=[b];break}}if(!a)throw Error("createXhr(): XMLHttpRequest not available");return a},get:h,parseName:function(a){var c=!1,b=a.indexOf("."),e=a.substring(0,b),a=a.substring(b+1,a.length),b=a.indexOf("!");b!==-1&&(c=a.substring(b+1,a.length),c=c==="strip",a=a.substring(0,b));return{moduleName:e,ext:a,strip:c}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(a,
c,b,e){var d=g.xdRegExp.exec(a),f;if(!d)return!0;a=d[2];d=d[3];d=d.split(":");f=d[1];d=d[0];return(!a||a===c)&&(!d||d===b)&&(!f&&!d||f===e)},finishLoad:function(a,c,b,e,d){b=c?g.strip(b):b;d.isBuild&&(j[a]=b);e(b)},load:function(a,c,b,e){if(e.isBuild&&!e.inlineText)b();else{var d=g.parseName(a),f=d.moduleName+"."+d.ext,m=c.toUrl(f),h=e&&e.text&&e.text.useXhr||g.useXhr;!i||h(m,p,q,r)?g.get(m,function(c){g.finishLoad(a,d.strip,c,b,e)}):c([f],function(a){g.finishLoad(d.moduleName+"."+d.ext,d.strip,a,
b,e)})}},write:function(a,c,b){if(c in j){var e=g.jsEscape(j[c]);b.asModule(a+"!"+c,"define(function () { return '"+e+"';});\n")}},writeFile:function(a,c,b,e,d){var c=g.parseName(c),f=c.moduleName+"."+c.ext,h=b.toUrl(c.moduleName+"."+c.ext)+".js";g.load(f,b,function(){var b=function(a){return e(h,a)};b.asModule=function(a,b){return e.asModule(a,h,b)};g.write(a,f,b,d)},d)}}})})();

define('text!intro.html',[],function () { return '<div id="intro">\n\t<p><h1>Welcome to HTML5 Camera!</h1></p>\n\t<p>This site is an experiment with HTML5 technologies, including WebRTC, Device Orientation, Canvas, Video and others.</p>\n\t<p>In order to use this site, you will need a browser that is on the bleeding edge of HTML5.  Currently, HTML5 Camera Supports the following browsers...</p>\n\t<ul>\n\t\t<li><a href="http://www.chromium.org/getting-involved/dev-channel">Chrome Dev Channel</a></li>\n\t\t<li><a href="http://www.chromium.org/getting-involved/dev-channel">Chrome Canary</a></li>\n\t\t<li><a href="http://snapshot.opera.com/labs/camera/">Opera Labs Camera Build</a></li>\n\t</ul>\t\n\t<p>For the Chrome Builds, you will need to turn on the experimental WebRTC feature by entering <strong>chrome://flags</strong> in your address bar and then enabling <strong>Media Streaming</strong></p>\n\t<br />\n\t<p><div class="chrome-flags"><img src="stylesheets/images/chrome_flags.png" alt="Enable Media Streaming Under Chrome Flags" /></div></p>\n</div>';});

define('text!mylibs/photobooth/views/photostrip.html',[],function () { return '<div class="photostrip box">\n\t<img />\n</div>\n\t';});

(function() {

  define('mylibs/photobooth/photobooth',['jQuery', 'Kendo', 'text!mylibs/photobooth/views/photostrip.html'], function($, kendo, photostrip) {
    var canvas, createStrip, images, pub;
    images = [];
    canvas = {};
    createStrip = function(counter, images, ctx, width, height) {
      var image;
      image = new Image();
      image.src = images[counter];
      image.width = width;
      image.height = height;
      return image.onload = function() {
        var animation, imgData, src, y;
        y = (counter * height) + ((counter * 20) + 20);
        ctx.drawImage(image, 20, y, image.width, image.height);
        if (counter === images.length - 1) {
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imgData, 0, 0);
          src = canvas.toDataURL();
          animation = {
            effects: "slideIn:down fadeIn",
            show: true,
            duration: 1000
          };
          return $.publish("/pictures/create", [src, null, false, true, animation, true]);
        } else {
          return createStrip(++counter, images, ctx, width, height);
        }
      };
    };
    return pub = {
      init: function(width, height) {
        canvas = $("<canvas style=color:fff></canvas>")[0];
        return $.subscribe("/photobooth/create", function(images) {
          var counter, ctx, img;
          counter = 0;
          canvas.width = width + 40;
          canvas.height = (height * images.length) + (images.length * 20) + 20;
          ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgb(255,255,255)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          return img = createStrip(counter, images, ctx, width, height);
        });
      }
    };
  });

}).call(this);

define('text!mylibs/customize/views/customize.html',[],function () { return '<div id="customize">\n\t<div class="row">\n\t\t<div class="span6 customize-left">\n\t\t\t<div class="row centered">\n\t\t\t\t<div class="canvas reflection"></div>\n\t\t\t\t<div class="yep-nope">\n\t\t\t\t\t<button class="button" data-bind="events: { click: yep }">Yep</button>\n\t\t\t\t\t<button class="button" data-bind="events: { click: nope }">Nope</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="span4">\n\t\t\t<h3>Brightness / Contrast</h3>\n\t\t\t<div>\n\t\t\t\t<div>Brightness<div>\n\t\t\t\t<input class="slider" data-role="slider" data-tick-placement="none" data-bind="value: effects.brightnessContrast.brightness.value, events: { slide: change, change: change }" data-small-step=".01" data-large-step=".01" min="0" max="1" />\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<div>Contrast</div>\n\t\t\t\t\t<input class="slider" data-role="slider" data-tick-placement="none" data-bind="value: effects.brightnessContrast.contrast.value, events: { slide: change, change: change }" max="1" min="0" data-small-step=".01" data-large-step=".01"/>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<br />\n\t\t\t<h3>Vignette</h3>\n\t\t\t<div>\n\t\t\t\t<div>Corner Size</div>\n\t\t\t\t\t<input data-role="slider" data-tick-placement="none" class="slider" data-large-step=".01" data-small-step=".01" max="1" min="0" data-bind="value: effects.vignette.size.value, events: { slide: change, change: change }" />\n\t\t\t</div>\n\t\t\t<div>\t\n\t\t\t\t<div>Corner Amount</div>\n\t\t\t\t<input data-role="slider" data-tick-placement="none" class="slider" data-large-step=".01" data-small-step=".01" max="1" min="0" data-bind="value: effects.vignette.amount.value, events: { slide: change, change: change }" />\n\t\t\t</div>\n\t\t\t<br />\n\t\t\t<h3>Hue / Saturation</h3>\n\t\t\t<div>\n\t\t\t\t<div>Hue</div>\n\t\t\t\t\t<input data-role="slider" data-tick-placement="none" class="slider" data-large-step=".01" data-small-step=".01" max="1" min="0" data-bind="value: effects.hueSaturation.hue.value, events: { slide: change, change: change }" />\n\t\t\t</div>\n\t\t\t<div>\t\n\t\t\t\t<div>Saturation</div>\n\t\t\t\t<input data-role="slider" data-tick-placement="none" class="slider" data-large-step=".01" data-small-step=".01" max="1" min="0" data-bind="value: effects.hueSaturation.saturation.value, events: { slide: change, change: change }" />\n\t\t\t</div>\n\t\t\t<br />\n\t\t\t<h3>Noise</h3>\n\t\t\t<div>\n\t\t\t\t<div>Noise</div>\n\t\t\t\t\t<input data-role="slider" data-tick-placement="none" class="slider" data-large-step=".01" data-small-step=".01" max="1" min="0" data-bind="value: effects.noise.noise.value, events: { slide: change, change: change }" />\n\t\t\t</div>\n\t\t\t<!--\n\t\t\t<div>\n\t\t\t\t<div>Denoise</div>\n\t\t\t\t\t<input data-role="slider" data-tick-placement="none" class="slider" data-large-step="1" data-small-step="1" max="50" min="0" data-bind="value: effects.denoise.denoise.value, events: { slide: change, change: change }" />\n\t\t\t</div>\n\t\t-->\n\t\t</div>\n\t</div>\n</div>';});

(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define('mylibs/customize/customize',['jQuery', 'Kendo', 'text!mylibs/customize/views/customize.html'], function($, kendo, template) {
    var $window, callback, canvas, customizeEffect, oldImage, pub, texture, viewModel, webgl;
    $window = {};
    webgl = fx.canvas();
    oldImage = new Image();
    canvas = {};
    texture = {};
    callback = {};
    viewModel = kendo.observable({
      effects: {
        brightnessContrast: {
          filter: "brightnessContrast",
          brightness: {
            isParam: true,
            value: 0
          },
          contrast: {
            isParam: true,
            value: 0
          }
        },
        vignette: {
          filter: "vignette",
          size: {
            isParam: true,
            value: 0
          },
          amount: {
            isParam: true,
            value: 0
          }
        },
        hueSaturation: {
          filter: "hueSaturation",
          hue: {
            isParam: true,
            value: 0
          },
          saturation: {
            isParam: true,
            value: 0
          }
        },
        noise: {
          filter: "noise",
          noise: {
            isParam: true,
            value: 0
          }
        },
        denoise: {
          filter: "denoise",
          denoise: {
            isParam: true,
            value: 100
          }
        }
      },
      change: function() {
        var filter, filters, key, params, value, _i, _len, _ref;
        webgl.draw(texture);
        filters = [];
        _ref = viewModel.effects;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          if (viewModel.effects[key].filter) {
            filter = viewModel.effects[key];
            params = [];
            for (key in filter) {
              if (!__hasProp.call(filter, key)) continue;
              value = filter[key];
              if (filter[key].isParam) params.push(filter[key].value);
            }
            filters.push({
              name: filter.filter,
              params: params
            });
          }
        }
        console.info(filters);
        for (_i = 0, _len = filters.length; _i < _len; _i++) {
          filter = filters[_i];
          webgl[filter.name].apply(webgl, filter.params);
        }
        return webgl.update();
      },
      yep: function() {
        callback(webgl.toDataURL());
        return $window.close();
      },
      nope: function() {
        return $window.close();
      }
    });
    customizeEffect = function(image, saveFunction) {
      oldImage.src = image.src;
      callback = saveFunction;
      return oldImage.onload = function() {
        var ctx;
        canvas.width = oldImage.width;
        canvas.height = oldImage.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height);
        texture = webgl.texture(canvas);
        webgl.draw(texture).update();
        return $window.open().center();
      };
    };
    return pub = {
      init: function(containerId) {
        var $content;
        $.subscribe('/customize', function(sender, saveFunction) {
          return customizeEffect(sender, saveFunction);
        });
        $content = $(template);
        canvas = document.createElement("canvas");
        $content.find(".canvas").append(webgl);
        $window = $content.kendoWindow({
          visible: false,
          modal: true,
          title: "",
          open: function() {
            return $.publish("/app/pause");
          },
          close: function() {
            return $.publish("/app/resume");
          },
          animation: {
            open: {
              effects: "slideIn:up fadeIn",
              duration: 500
            },
            close: {
              effects: "slide:up fadeOut",
              duration: 500
            }
          }
        }).data("kendoWindow").center();
        return kendo.bind($content, viewModel);
      }
    };
  });

}).call(this);

define('text!mylibs/share/views/download.html',[],function () { return '<div id="download">\n\t<input placeholder="Save File As..." class="k-textbox" />\n\t<button class="k-button">Save</button>\n</div>';});

define('text!mylibs/share/views/tweet.html',[],function () { return '<img class="tweet-img" src="#= src #" />\n<div class="arrow_box tweet-box">\n\t<textarea col= placeholder="type something here...." />\n</div>';});

(function() {

  define('mylibs/share/share',['jQuery', 'Kendo', 'mylibs/utils/utils', 'text!mylibs/share/views/download.html', 'text!mylibs/share/views/tweet.html'], function($, kendo, utils, downloadView, tweet) {
    /*
        shareWindow = {}
        twitter_token = ""
        
        openCenteredWindow = (url) ->
            y = 700 
            C = window.screenX or 0 
            B = if C then $(window).width() else screen.availWidth
            A = 520 
            u = window.screenY || 0 
            x = if u then $(window).height() else screen.availHeight
            v = C + (B - y) / 2
            z = u + (x - A) / 2
            
            childWindow = window.open("authenticate/twitter", "auth", "resizable=yes,toolbar=no,scrollbars=yes,status=no,width=" + y + ",height=" + A + ",left=" + v + ",top=" + z)
            
            checkWindow = ->
                if childWindow and childWindow.closed
                    window.clearInterval(intervalID)
                    
                    twitter = sessionStorage.getItem("twitter")
                    
                    if (twitter)
                        $(".tweet").show()
            
            intervalID = window.setInterval(checkWindow, 500)
                    
      
            
        
        pub =
            
            twitter_token: ""
        
            init: ->
    
                # create the download popup window but don't show it, just
                # store a reference to it that we can use later
    
                $.subscribe("/share/download", ($img) ->    
                    img = new Image()
                    img.src = $img.src
                    
                    src = utils.elToDataURI(img)
                    utils.saveImage(src)
                    
                    delete img
                    
                )
                
                $.subscribe("/share/tweet", (src) ->
                
                    template = kendo.template(tweet)
                    tweet = template({src: src })
                    
                    shareWindow.content(tweet).open().center()
                    
                )
                
                
                $('#twitter-sign-in').click( (e) ->            
                
                    # open a new child window and sign in!
                    openCenteredWindow("twitter")
                    
                    e.preventDefault()
                    
                )
    
                # the download goes via the HTML5 FileWorker spec so there's no prompt
                # provide that prompt here and set the download name
    
                shareWindow = $("<div id='share'></div>").kendoWindow({
                                    modal: true
                                    visible: false
                                 }).data("kendoWindow")
                                   
                                   
                download: (el) ->
    
                    # we need to write the element containing the image to a canvas
                    # then we can save it back as a data url. we need to do it again
                    # so that the css filters are applied.
    
                    dataURI = utils.elToDataURI(el);
    
                    # attach the dataURI to the data-uri attribute on the save button
                    $("#{downloadView} > button").data("uri", dataURI)
    */
  });

}).call(this);

twitpic = function uploadTwitpic(file, callback){
  function core_upload(){
    var message = {
      action: 'https://api.twitter.com/1/account/verify_credentials.json',
      method: "GET",
        parameters: [
          	["oauth_consumer_key", Keys.twitter.key],
          	["oauth_signature_method", "HMAC-SHA1"],
          	["oauth_token", localStorage.twitter_token]
      	]
    };

    // Define the accessor
    var accessor = {
      consumerSecret: Keys.twitter.secret,
      tokenSecret: localStorage.twitter_secret
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var auth = OAuth.getAuthorizationHeader("http://api.twitter.com/", message.parameters);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://api.twitpic.com/2/upload.json");  
    xhr.setRequestHeader('X-Verify-Credentials-Authorization', auth);
    xhr.setRequestHeader('X-Auth-Service-Provider', 'https://api.twitter.com/1/account/verify_credentials.json');
    
    xhr.onload = function(){
      console.log(xhr);
      if(xhr.status == 401){
        twitter_login(core_upload);
      }else if(xhr.status == 200){
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        callback({url: json.url}); //note that Twitpic does not support direct links!
      }else{
        callback('error: Twitpic uploading failed')
      }
    }
    xhr.onerror = function(){
      callback('error: Twitpic uploading failed')
    }
    xhr.sendMultipart({
      key: Keys.twitpic,
      media: file
    })
  }
  if(localStorage.twitter_token && localStorage.twitter_secret){
    core_upload();
  }else{
    twitter_login(core_upload);
  }
  return "http://twitpic.com/";
}
;
define("mylibs/share/twitpic", function(){});

define('text!mylibs/pictures/views/picture.html',[],function () { return '<div class="snapshot box">\n\t<div class="wrap">\n\t\t<img class="picture" width="180" height="130" />\n\t</div>\n\t<div class="actions">\n\t\t<div class="share">\n\t\t\t<a class="download pointer" rel="Download"><img src="images/icons/glyphicons_200_download.png" /></a>\n\t\t\t<a class="tweet pointer" rel="Twitter"><img src="images/icons/glyphicons_392_twitter.png" /></a>\n\t\t</div>\n\t\t<div class="delete">\n\t\t\t<a class="trash pointer" rel="Trash"><img src="images/icons/glyphicons_016_bin.png" /></a>\n\t\t</div>\n\t</div>\n</div>';});

(function() {

  define('mylibs/pictures/pictures',['jQuery', 'Kendo', 'mylibs/effects/effects', 'mylibs/file/file', 'mylibs/share/twitpic', 'text!mylibs/pictures/views/picture.html'], function($, kendo, effects, file, twitpic, picture) {
    var $container, pub;
    $container = {};
    return pub = {
      init: function(containerId) {
        $container = $("#" + containerId);
        $container.masonry();
        $.subscribe("/pictures/reload", function() {
          return pub.reload();
        });
        return $.subscribe("/pictures/create", function(src, name, polaroid, save, animation, photoStrip) {
          var $div, $img, callback, opacity, presets;
          $div = $(picture);
          $img = $div.find(".picture").attr("src", src).css("opacity", 1);
          if (save) {
            name = name || new Date().getTime() + ".png";
            if (photoStrip) name = "p_" + name;
            file.save(name, src);
          }
          callback = function() {
            $img.attr("src", arguments[0]);
            return file.save(name, arguments[0]);
          };
          if (!name.substring(0, 1) === "p") {
            $img.on("click", function() {
              return $.publish("/customize", [this, callback]);
            });
            $img.addClass("pointer");
          }
          $container.append($div);
          if (animation) $div.kendoStop(true).kendoAnimate(animation);
          $img.load(function() {
            return $container.masonry("reload");
          });
          presets = effects.presets();
          if (polaroid) {
            opacity = 0;
            $.subscribe("/shake/beta", function() {
              opacity = parseFloat($wrap.css("opacity"));
              if (opacity < 1) {
                opacity = opacity + .03;
                return $img.css("opacity", opacity);
              } else {
                return $.unsubscribe("/shake/beta");
              }
            });
          } else {
            if (save) file.save(name, $img.attr("src"));
          }
          $div.on("click", ".download", function() {
            return file.download($img[0]);
          });
          $div.on("click", ".tweet", function() {
            var intent;
            intent = new Intent("http://webintents.org/share", "image/*", $img.attr("src"));
            return window.navigator.startActivity(intent, function(data) {});
          });
          return $div.on("click", ".trash", function() {
            $.subscribe("/file/deleted/" + name, function() {
              $div.kendoStop(true).kendoAnimate({
                effects: "zoomOut fadeOut",
                hide: true,
                duration: 500,
                complete: function() {
                  $div.remove();
                  return $container.masonry("reload");
                }
              });
              return $.unsubscribe("file/deleted/" + name);
            });
            return file["delete"](name);
          });
        });
      },
      reload: function() {
        return $container.masonry("reload");
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/snapshot/snapshot',['jQuery', 'Kendo', 'mylibs/pictures/pictures'], function($, kendo, effects, filters, snapshot, utils, file) {
    var $container, create, develop, polaroid, preview, pub, svg;
    polaroid = false;
    preview = {};
    $container = {};
    svg = [];
    create = function(src) {
      var animation;
      animation = {
        effects: "slideIn:down fadeIn",
        show: true,
        duration: 1000
      };
      return $.publish("/pictures/create", [src, null, false, true, animation]);
    };
    develop = function(opacity) {
      if (opacity < 1) {
        opacity = opacity + .01;
        $image.css("opacity", opacity);
      } else {
        $.unsubscribe("/shake/beta");
        $.unsubscribe("/shake/gamma");
      }
      return opacity;
    };
    return pub = {
      init: function(sender, container) {
        preview = sender;
        $container = $("#" + container);
        $.subscribe("/polaroid/change", function(e) {
          if (e.currentTarget.checked) {
            return polaroid = true;
          } else {
            return polaroid = false;
          }
        });
        return $.subscribe("/snapshot/create", function(src) {
          return create(src);
        });
      }
    };
  });

}).call(this);

(function() {

  define('libs/webgl/effects',['jQuery', 'Kendo'], function($, kendo) {
    var draw;
    draw = function(canvas, element, effect) {
      var texture;
      texture = canvas.texture(element);
      canvas.draw(texture);
      effect();
      canvas.update();
      return texture.destroy();
    };
    return [
      {
        name: "normal",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas;
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "bulge",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, .65);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "pinch",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, -.65);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "swirl",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.swirl(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, 3);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "zoomBlur",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.zoomBlur(canvas.width / 2, canvas.height / 2, 2, canvas.height / 5);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "blockhead",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.blockhead(canvas.width / 2, canvas.height / 2, 200, 300, 1);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "mirrorLeft",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.mirror(0);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "mirrorTop",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.mirror(1.57841);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "quadRotate",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.quadRotate(0, 1, 2, 3);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "colorHalfTone",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.colorHalftone(canvas.width / 2, canvas.height / 2, .30, 3);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "pixelate",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.pixelate(canvas.width / 2, canvas.height / 2, 5);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "hopePoster",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.hopePoster();
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "photocopy",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.photocopy(.5, frame);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "oldFilm",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.oldFilm(frame);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "vhs",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.vhs(frame);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "quadColor",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.quadColor([1, .2, .1], [0, .8, 0], [.25, .5, 1], [.8, .8, .8]);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "kaleidoscope",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.kaleidoscope(canvas.width / 2, canvas.height / 2, 200, 0);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "invert",
        filter: function(canvas, element) {
          var effect;
          effect = function() {
            return canvas.invert();
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "chromeLogo",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            return canvas.chromeLogo(canvas.width / 2, canvas.height / 2, frame, canvas.height / 2.5);
          };
          return draw(canvas, element, effect);
        }
      }, {
        name: "ghost",
        filter: function(canvas, element, frame) {
          var effect;
          effect = function() {
            var buffer, createBuffers;
            buffer = [];
            createBuffers = function(length) {
              var _results;
              _results = [];
              while (buffer.length < length) {
                _results.push(buffer.push(canvas.texture(element)));
              }
              return _results;
            };
            createBuffers(32);
            buffer[frame++ % buffer.length].loadContentsOf(element);
            canvas.matrixWarp([-1, 0, 0, 1], false, true);
            canvas.blend(buffer[frame % 32], 0.5);
            return canvas.matrixWarp([-1, 0, 0, 1], false, true);
          };
          return draw(canvas, element, effect);
        }
      }
    ];
  });

}).call(this);

/*
 * glfx.js
 * http://evanw.github.com/glfx.js/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */
var fx = (function() {
var exports = {};

// src/core/canvas.js
var gl;

function clamp(lo, value, hi) {
    return Math.max(lo, Math.min(value, hi));
}

function wrapTexture(texture) {
    return {
        _: texture,
        loadContentsOf: function(element) { this._.loadContentsOf(element); },
        destroy: function() { this._.destroy(); }
    };
}

function texture(element) {
    return wrapTexture(Texture.fromElement(element));
}

function initialize(width, height) {
    // Go for floating point buffer textures if we can, it'll make the bokeh filter look a lot better
    var type = gl.getExtension('OES_texture_float') ? gl.FLOAT : gl.UNSIGNED_BYTE;

    if (this._.texture) this._.texture.destroy();
    if (this._.spareTexture) this._.spareTexture.destroy();
    this.width = width;
    this.height = height;
    this._.texture = new Texture(width, height, gl.RGBA, type);
    this._.spareTexture = new Texture(width, height, gl.RGBA, type);
    this._.extraTexture = this._.extraTexture || new Texture(0, 0, gl.RGBA, type);
    this._.flippedShader = this._.flippedShader || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));\
        }\
    ');
    this._.isInitialized = true;
}

/*
   Draw a texture to the canvas, with an optional width and height to scale to.
   If no width and height are given then the original texture width and height
   are used.
*/
function draw(texture, width, height) {
    if (!this._.isInitialized || texture._.width != this.width || texture._.height != this.height) {
        initialize.call(this, width ? width : texture._.width, height ? height : texture._.height);
    }

    texture._.use();
    this._.texture.drawTo(function() {
        Shader.getDefaultShader().drawRect();
    });

    return this;
}

function update() {
    this._.texture.use();
    this._.flippedShader.drawRect();
    return this;
}

function simpleShader(shader, uniforms, textureIn, textureOut) {
    (textureIn || this._.texture).use();
    this._.spareTexture.drawTo(function() {
        shader.uniforms(uniforms).drawRect();
    });
    this._.spareTexture.swapWith(textureOut || this._.texture);
}

function replace(node) {
    node.parentNode.insertBefore(this, node);
    node.parentNode.removeChild(node);
    return this;
}

function contents() {
    var texture = new Texture(this._.texture.width, this._.texture.height, gl.RGBA, gl.UNSIGNED_BYTE);
    this._.texture.use();
    texture.drawTo(function() {
        Shader.getDefaultShader().drawRect();
    });
    return wrapTexture(texture);
}

/*
   Get a Uint8 array of pixel values: [r, g, b, a, r, g, b, a, ...]
   Length of the array will be width * height * 4.
*/
function getPixelArray() {
    var w = this._.texture.width;
    var h = this._.texture.height;
    var array = new Uint8Array(w * h * 4);
    this._.texture.drawTo(function() {
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, array);
    });
    return array;
}

// Fix broken toDataURL() methods on some implementations
function toDataURL(mimeType) {
    var w = this._.texture.width;
    var h = this._.texture.height;
    var array = getPixelArray.call(this);
    var canvas2d = document.createElement('canvas');
    var c = canvas2d.getContext('2d');
    canvas2d.width = w;
    canvas2d.height = h;
    var data = c.createImageData(w, h);
    for (var i = 0; i < array.length; i++) {
        data.data[i] = array[i];
    }
    c.putImageData(data, 0, 0);
    return canvas2d.toDataURL(mimeType);
}

function wrap(func) {
    return function() {
        // Make sure that we're using the correct global WebGL context
        gl = this._.gl;

        // Now that the context has been switched, we can call the wrapped function
        return func.apply(this, arguments);
    };
}

exports.canvas = function() {
    var canvas = document.createElement('canvas');
    try {
        gl = canvas.getContext('experimental-webgl', { premultipliedAlpha: false });
    } catch (e) {
        gl = null;
    }
    if (!gl) {
        throw 'This browser does not support WebGL';
    }
    canvas._ = {
        gl: gl,
        isInitialized: false,
        texture: null,
        spareTexture: null,
        flippedShader: null
    };

    // Core methods
    canvas.texture = wrap(texture);
    canvas.draw = wrap(draw);
    canvas.update = wrap(update);
    canvas.replace = wrap(replace);
    canvas.contents = wrap(contents);
    canvas.getPixelArray = wrap(getPixelArray);
    canvas.toDataURL = wrap(toDataURL);

    // Filter methods
    canvas.brightnessContrast = wrap(brightnessContrast);
    canvas.hexagonalPixelate = wrap(hexagonalPixelate);
    canvas.hueSaturation = wrap(hueSaturation);
    canvas.colorHalftone = wrap(colorHalftone);
    canvas.triangleBlur = wrap(triangleBlur);
    canvas.kaleidoscope = wrap(kaleidoscope);
    canvas.unsharpMask = wrap(unsharpMask);
    canvas.perspective = wrap(perspective);
    canvas.matrixWarp = wrap(matrixWarp);
    canvas.bulgePinch = wrap(bulgePinch);
    canvas.quadRotate = wrap(quadRotate);
    canvas.chromeLogo = wrap(chromeLogo);
    canvas.hopePoster = wrap(hopePoster);
    canvas.mirrorTube = wrap(mirrorTube);
    canvas.tiltShift = wrap(tiltShift);
    canvas.dotScreen = wrap(dotScreen);
    canvas.blockhead = wrap(blockhead);
    canvas.quadColor = wrap(quadColor);
    canvas.photocopy = wrap(photocopy);
    canvas.edgeWork = wrap(edgeWork);
    canvas.lensBlur = wrap(lensBlur);
    canvas.zoomBlur = wrap(zoomBlur);
    canvas.pixelate = wrap(pixelate);
    canvas.wetTable = wrap(wetTable);
    canvas.oldFilm = wrap(oldFilm);
    canvas.denoise = wrap(denoise);
    canvas.curves = wrap(curves);
    canvas.mirror = wrap(mirror);
    canvas.invert = wrap(invert);
    canvas.swirl = wrap(swirl);
    canvas.noise = wrap(noise);
    canvas.blend = wrap(blend);
    canvas.ink = wrap(ink);
    canvas.vhs = wrap(vhs);
    canvas.vignette = wrap(vignette);
    canvas.vibrance = wrap(vibrance);
    canvas.sepia = wrap(sepia);
    canvas.timeStrips = wrap(timeStrips);
    canvas.stamp = wrap(stamp);

    return canvas;
};
exports.splineInterpolate = splineInterpolate;

// src/core/matrix.js
// from javax.media.jai.PerspectiveTransform

function getSquareToQuad(x0, y0, x1, y1, x2, y2, x3, y3) {
    var dx1 = x1 - x2;
    var dy1 = y1 - y2;
    var dx2 = x3 - x2;
    var dy2 = y3 - y2;
    var dx3 = x0 - x1 + x2 - x3;
    var dy3 = y0 - y1 + y2 - y3;
    var det = dx1*dy2 - dx2*dy1;
    var a = (dx3*dy2 - dx2*dy3) / det;
    var b = (dx1*dy3 - dx3*dy1) / det;
    return [
        x1 - x0 + a*x1, y1 - y0 + a*y1, a,
        x3 - x0 + b*x3, y3 - y0 + b*y3, b,
        x0, y0, 1
    ];
}

function getInverse(m) {
    var a = m[0], b = m[1], c = m[2];
    var d = m[3], e = m[4], f = m[5];
    var g = m[6], h = m[7], i = m[8];
    var det = a*e*i - a*f*h - b*d*i + b*f*g + c*d*h - c*e*g;
    return [
        (e*i - f*h) / det, (c*h - b*i) / det, (b*f - c*e) / det,
        (f*g - d*i) / det, (a*i - c*g) / det, (c*d - a*f) / det,
        (d*h - e*g) / det, (b*g - a*h) / det, (a*e - b*d) / det
    ];
}

function multiply(a, b) {
    return [
        a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
        a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
        a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
        a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
        a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
        a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
        a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
        a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
        a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
    ];
}

// src/core/shader.js
var Shader = (function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }

    function isNumber(obj) {
        return Object.prototype.toString.call(obj) == '[object Number]';
    }

    function compileSource(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw 'compile error: ' + gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    var defaultVertexSource = '\
    attribute vec2 vertex;\
    attribute vec2 _texCoord;\
    varying vec2 texCoord;\
    void main() {\
        texCoord = _texCoord;\
        gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);\
    }';

    var defaultFragmentSource = '\
    uniform sampler2D texture;\
    varying vec2 texCoord;\
    void main() {\
        gl_FragColor = texture2D(texture, texCoord);\
    }';

    function Shader(vertexSource, fragmentSource) {
        this.uniformLocations = {};
        this.vertexAttribute = null;
        this.texCoordAttribute = null;
        this.program = gl.createProgram();
        vertexSource = vertexSource || defaultVertexSource;
        fragmentSource = fragmentSource || defaultFragmentSource;
        fragmentSource = 'precision highp float;' + fragmentSource; // annoying requirement is annoying
        gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
        gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw 'link error: ' + gl.getProgramInfoLog(this.program);
        }
    }

    Shader.prototype.destroy = function() {
        gl.deleteProgram(this.program);
        this.program = null;
    };

    Shader.prototype.uniforms = function(uniforms) {
        gl.useProgram(this.program);
        for (var name in uniforms) {
            if (!uniforms.hasOwnProperty(name)) continue;
            var location = this.uniformLocations[name] || (this.uniformLocations[name] = gl.getUniformLocation(this.program, name));
            if (location === null) continue; // will be null if the uniform isn't used in the shader
            var value = uniforms[name];
            if (isArray(value)) {
                switch (value.length) {
                    case 1: gl.uniform1fv(location, new Float32Array(value)); break;
                    case 2: gl.uniform2fv(location, new Float32Array(value)); break;
                    case 3: gl.uniform3fv(location, new Float32Array(value)); break;
                    case 4: gl.uniform4fv(location, new Float32Array(value)); break;
                    case 9: gl.uniformMatrix3fv(location, false, new Float32Array(value)); break;
                    case 16: gl.uniformMatrix4fv(location, false, new Float32Array(value)); break;
                    default: throw 'dont\'t know how to load uniform "' + name + '" of length ' + value.length;
                }
            } else if (isNumber(value)) {
                gl.uniform1f(location, value);
            } else {
                throw 'attempted to set uniform "' + name + '" to invalid value ' + (value || 'undefined').toString();
            }
        }
        // allow chaining
        return this;
    };

    // textures are uniforms too but for some reason can't be specified by gl.uniform1f,
    // even though floating point numbers represent the integers 0 through 7 exactly
    Shader.prototype.textures = function(textures) {
        gl.useProgram(this.program);
        for (var name in textures) {
            if (!textures.hasOwnProperty(name)) continue;
            var location = this.uniformLocations[name] || (this.uniformLocations[name] = gl.getUniformLocation(this.program, name));
            if (location === null) continue; // will be null if the uniform isn't used in the shader
            gl.uniform1i(location, textures[name]);
        }
        // allow chaining
        return this;
    };

    Shader.prototype.drawRect = function(left, top, right, bottom, cropToRect) {
        var undefined;
        var viewport = gl.getParameter(gl.VIEWPORT);
        top = top !== undefined ? (top - viewport[1]) / viewport[3] : 0;
        left = left !== undefined ? (left - viewport[0]) / viewport[2] : 0;
        right = right !== undefined ? (right - viewport[0]) / viewport[2] : 1;
        bottom = bottom !== undefined ? (bottom - viewport[1]) / viewport[3] : 1;
        if (gl.vertexBuffer == null) {
            gl.vertexBuffer = gl.createBuffer();
        }
        var vertices = [ left, top, left, bottom, right, top, right, bottom ];
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        if (gl.texCoordBuffer == null) {
            gl.texCoordBuffer = gl.createBuffer();
        }
        var coords = cropToRect ? vertices : [ 0, 0, 0, 1, 1, 0, 1, 1 ];
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
        if (this.vertexAttribute == null) {
            this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
            gl.enableVertexAttribArray(this.vertexAttribute);
        }
        if (this.texCoordAttribute == null) {
            this.texCoordAttribute = gl.getAttribLocation(this.program, '_texCoord');
            gl.enableVertexAttribArray(this.texCoordAttribute);
        }
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    Shader.getDefaultShader = function() {
        gl.defaultShader = gl.defaultShader || new Shader();
        return gl.defaultShader;
    };

    return Shader;
})();

// src/core/spline.js
// from SplineInterpolator.cs in the Paint.NET source code

function SplineInterpolator(points) {
    var n = points.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];

    points.sort(function(a, b) {
        return a[0] - b[0];
    });
    for (var i = 0; i < n; i++) {
        this.xa.push(points[i][0]);
        this.ya.push(points[i][1]);
    }

    this.u[0] = 0;
    this.y2[0] = 0;

    for (var i = 1; i < n - 1; ++i) {
        // This is the decomposition loop of the tridiagonal algorithm. 
        // y2 and u are used for temporary storage of the decomposed factors.
        var wx = this.xa[i + 1] - this.xa[i - 1];
        var sig = (this.xa[i] - this.xa[i - 1]) / wx;
        var p = sig * this.y2[i - 1] + 2.0;

        this.y2[i] = (sig - 1.0) / p;

        var ddydx = 
            (this.ya[i + 1] - this.ya[i]) / (this.xa[i + 1] - this.xa[i]) - 
            (this.ya[i] - this.ya[i - 1]) / (this.xa[i] - this.xa[i - 1]);

        this.u[i] = (6.0 * ddydx / wx - sig * this.u[i - 1]) / p;
    }

    this.y2[n - 1] = 0;

    // This is the backsubstitution loop of the tridiagonal algorithm
    for (var i = n - 2; i >= 0; --i) {
        this.y2[i] = this.y2[i] * this.y2[i + 1] + this.u[i];
    }
}

SplineInterpolator.prototype.interpolate = function(x) {
    var n = this.ya.length;
    var klo = 0;
    var khi = n - 1;

    // We will find the right place in the table by means of
    // bisection. This is optimal if sequential calls to this
    // routine are at random values of x. If sequential calls
    // are in order, and closely spaced, one would do better
    // to store previous values of klo and khi.
    while (khi - klo > 1) {
        var k = (khi + klo) >> 1;

        if (this.xa[k] > x) {
            khi = k; 
        } else {
            klo = k;
        }
    }

    var h = this.xa[khi] - this.xa[klo];
    var a = (this.xa[khi] - x) / h;
    var b = (x - this.xa[klo]) / h;

    // Cubic spline polynomial is now evaluated.
    return a * this.ya[klo] + b * this.ya[khi] + 
        ((a * a * a - a) * this.y2[klo] + (b * b * b - b) * this.y2[khi]) * (h * h) / 6.0;
};

// src/core/texture.js
var Texture = (function() {
    Texture.fromElement = function(element) {
        var texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.loadContentsOf(element);
        return texture;
    };

    function Texture(width, height, format, type) {
        this.id = gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (width && height) gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
    }

    Texture.prototype.loadContentsOf = function(element) {
        this.width = element.width || element.videoWidth;
        this.height = element.height || element.videoHeight;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, element);
    };

    Texture.prototype.initFromBytes = function(width, height, data) {
        this.width = width;
        this.height = height;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.type, new Uint8Array(data));
    };

    Texture.prototype.destroy = function() {
        gl.deleteTexture(this.id);
        this.id = null;
    };

    Texture.prototype.use = function(unit) {
        gl.activeTexture(gl.TEXTURE0 + (unit || 0));
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    };

    Texture.prototype.unuse = function(unit) {
        gl.activeTexture(gl.TEXTURE0 + (unit || 0));
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    Texture.prototype.ensureFormat = function(width, height, format, type) {
        // allow passing an existing texture instead of individual arguments
        if (arguments.length == 1) {
            var texture = arguments[0];
            width = texture.width;
            height = texture.height;
            format = texture.format;
            type = texture.type;
        }

        // change the format only if required
        if (width != this.width || height != this.height || format != this.format || type != this.type) {
            this.width = width;
            this.height = height;
            this.format = format;
            this.type = type;
            gl.bindTexture(gl.TEXTURE_2D, this.id);
            gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
        }
    };

    Texture.prototype.drawTo = function(callback) {
        // start rendering to this texture
        gl.framebuffer = gl.framebuffer || gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
        gl.viewport(0, 0, this.width, this.height);

        // do the drawing
        callback();

        // stop rendering to this texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    var canvas = null;

    function getCanvas(texture) {
        if (canvas == null) canvas = document.createElement('canvas');
        canvas.width = texture.width;
        canvas.height = texture.height;
        var c = canvas.getContext('2d');
        c.clearRect(0, 0, canvas.width, canvas.height);
        return c;
    }

    Texture.prototype.fillUsingCanvas = function(callback) {
        callback(getCanvas(this));
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        return this;
    };

    Texture.prototype.toImage = function(image) {
        this.use();
        Shader.getDefaultShader().drawRect();
        var size = this.width * this.height * 4;
        var pixels = new Uint8Array(size);
        var c = getCanvas(this);
        var data = c.createImageData(this.width, this.height);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        for (var i = 0; i < size; i++) {
            data.data[i] = pixels[i];
        }
        c.putImageData(data, 0, 0);
        image.src = canvas.toDataURL();
    };

    Texture.prototype.swapWith = function(other) {
        var temp;
        temp = other.id; other.id = this.id; this.id = temp;
        temp = other.width; other.width = this.width; this.width = temp;
        temp = other.height; other.height = this.height; this.height = temp;
        temp = other.format; other.format = this.format; this.format = temp;
    };

    return Texture;
})();

// src/filters/adjust/brightnesscontrast.js
/**
 * @filter           Brightness / Contrast
 * @description      Provides additive brightness and multiplicative contrast control.
 * @param brightness -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
 * @param contrast   -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */
function brightnessContrast(brightness, contrast) {
    gl.brightnessContrast = gl.brightnessContrast || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float brightness;\
        uniform float contrast;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color.rgb += brightness;\
            if (contrast > 0.0) {\
                color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;\
            } else {\
                color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;\
            }\
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.brightnessContrast, {
        brightness: clamp(-1, brightness, 1),
        contrast: clamp(-1, contrast, 1)
    });

    return this;
}

// src/filters/adjust/curves.js
function splineInterpolate(points) {
    var interpolator = new SplineInterpolator(points);
    var array = [];
    for (var i = 0; i < 256; i++) {
        array.push(clamp(0, Math.floor(interpolator.interpolate(i / 255) * 256), 255));
    }
    return array;
}

/**
 * @filter      Curves
 * @description A powerful mapping tool that transforms the colors in the image
 *              by an arbitrary function. The function is interpolated between
 *              a set of 2D points using splines. The curves filter can take
 *              either one or three arguments which will apply the mapping to
 *              either luminance or RGB values, respectively.
 * @param red   A list of points that define the function for the red channel.
 *              Each point is a list of two values: the value before the mapping
 *              and the value after the mapping, both in the range 0 to 1. For
 *              example, [[0,1], [1,0]] would invert the red channel while
 *              [[0,0], [1,1]] would leave the red channel unchanged. If green
 *              and blue are omitted then this argument also applies to the
 *              green and blue channels.
 * @param green (optional) A list of points that define the function for the green
 *              channel (just like for red).
 * @param blue  (optional) A list of points that define the function for the blue
 *              channel (just like for red).
 */
function curves(red, green, blue) {
    // Create the ramp texture
    red = splineInterpolate(red);
    if (arguments.length == 1) {
        green = blue = red;
    } else {
        green = splineInterpolate(green);
        blue = splineInterpolate(blue);
    }
    var array = [];
    for (var i = 0; i < 256; i++) {
        array.splice(array.length, 0, red[i], green[i], blue[i], 255);
    }
    this._.extraTexture.initFromBytes(256, 1, array);
    this._.extraTexture.use(1);

    gl.curves = gl.curves || new Shader(null, '\
        uniform sampler2D texture;\
        uniform sampler2D map;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color.r = texture2D(map, vec2(color.r)).r;\
            color.g = texture2D(map, vec2(color.g)).g;\
            color.b = texture2D(map, vec2(color.b)).b;\
            gl_FragColor = color;\
        }\
    ');

    gl.curves.textures({
        map: 1
    });
    simpleShader.call(this, gl.curves, {});

    return this;
}

// src/filters/adjust/denoise.js
/**
 * @filter         Denoise
 * @description    Smooths over grainy noise in dark images using an 9x9 box filter
 *                 weighted by color intensity, similar to a bilateral filter.
 * @param exponent The exponent of the color intensity difference, should be greater
 *                 than zero. A value of zero just gives an 9x9 box blur and high values
 *                 give the original image, but ideal values are usually around 10-20.
 */
function denoise(exponent) {
    // Do a 9x9 bilateral box filter
    gl.denoise = gl.denoise || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float exponent;\
        uniform float strength;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec4 center = texture2D(texture, texCoord);\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            for (float x = -4.0; x <= 4.0; x += 1.0) {\
                for (float y = -4.0; y <= 4.0; y += 1.0) {\
                    vec4 sample = texture2D(texture, texCoord + vec2(x, y) / texSize);\
                    float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\
                    weight = pow(weight, exponent);\
                    color += sample * weight;\
                    total += weight;\
                }\
            }\
            gl_FragColor = color / total;\
        }\
    ');

    // Perform two iterations for stronger results
    for (var i = 0; i < 2; i++) {
        simpleShader.call(this, gl.denoise, {
            exponent: Math.max(0, exponent),
            texSize: [this.width, this.height]
        });
    }

    return this;
}

// src/filters/adjust/huesaturation.js
/**
 * @filter           Hue / Saturation
 * @description      Provides rotational hue and multiplicative saturation control. RGB color space
 *                   can be imagined as a cube where the axes are the red, green, and blue color
 *                   values. Hue changing works by rotating the color vector around the grayscale
 *                   line, which is the straight line from black (0, 0, 0) to white (1, 1, 1).
 *                   Saturation is implemented by scaling all color channel values either toward
 *                   or away from the average color channel value.
 * @param hue        -1 to 1 (-1 is 180 degree rotation in the negative direction, 0 is no change,
 *                   and 1 is 180 degree rotation in the positive direction)
 * @param saturation -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */
function hueSaturation(hue, saturation) {
    gl.hueSaturation = gl.hueSaturation || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float hue;\
        uniform float saturation;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */\
            float angle = hue * 3.14159265;\
            float s = sin(angle), c = cos(angle);\
            vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\
            float len = length(color.rgb);\
            color.rgb = vec3(\
                dot(color.rgb, weights.xyz),\
                dot(color.rgb, weights.zxy),\
                dot(color.rgb, weights.yzx)\
            );\
            \
            /* saturation adjustment */\
            float average = (color.r + color.g + color.b) / 3.0;\
            if (saturation > 0.0) {\
                color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));\
            } else {\
                color.rgb += (average - color.rgb) * (-saturation);\
            }\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.hueSaturation, {
        hue: clamp(-1, hue, 1),
        saturation: clamp(-1, saturation, 1)
    });

    return this;
}

// src/filters/adjust/noise.js
/**
 * @filter         Noise
 * @description    Adds black and white noise to the image.
 * @param amount   0 to 1 (0 for no effect, 1 for maximum noise)
 */
function noise(amount) {
    gl.noise = gl.noise || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float amount;\
        varying vec2 texCoord;\
        float rand(vec2 co) {\
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
        }\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            float diff = (rand(texCoord) - 0.5) * amount;\
            color.r += diff;\
            color.g += diff;\
            color.b += diff;\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.noise, {
        amount: clamp(0, amount, 1)
    });

    return this;
}

// src/filters/adjust/sepia.js
/**
 * @filter         Sepia
 * @description    Gives the image a reddish-brown monochrome tint that imitates an old photograph.
 * @param amount   0 to 1 (0 for no effect, 1 for full sepia coloring)
 */
function sepia(amount) {
    gl.sepia = gl.sepia || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float amount;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float r = color.r;\
            float g = color.g;\
            float b = color.b;\
            \
            color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));\
            color.g = min(1.0, (r * 0.349 * amount) + (g * (1.0 - (0.314 * amount))) + (b * 0.168 * amount));\
            color.b = min(1.0, (r * 0.272 * amount) + (g * 0.534 * amount) + (b * (1.0 - (0.869 * amount))));\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.sepia, {
        amount: clamp(0, amount, 1)
    });

    return this;
}

// src/filters/adjust/unsharpmask.js
/**
 * @filter         Unsharp Mask
 * @description    A form of image sharpening that amplifies high-frequencies in the image. It
 *                 is implemented by scaling pixels away from the average of their neighbors.
 * @param radius   The blur radius that calculates the average of the neighboring pixels.
 * @param strength A scale factor where 0 is no effect and higher values cause a stronger effect.
 */
function unsharpMask(radius, strength) {
    gl.unsharpMask = gl.unsharpMask || new Shader(null, '\
        uniform sampler2D blurredTexture;\
        uniform sampler2D originalTexture;\
        uniform float strength;\
        uniform float threshold;\
        varying vec2 texCoord;\
        void main() {\
            vec4 blurred = texture2D(blurredTexture, texCoord);\
            vec4 original = texture2D(originalTexture, texCoord);\
            gl_FragColor = mix(blurred, original, 1.0 + strength);\
        }\
    ');

    // Store a copy of the current texture in the second texture unit
    this._.extraTexture.ensureFormat(this._.texture);
    this._.texture.use();
    this._.extraTexture.drawTo(function() {
        Shader.getDefaultShader().drawRect();
    });

    // Blur the current texture, then use the stored texture to detect edges
    this._.extraTexture.use(1);
    this.triangleBlur(radius);
    gl.unsharpMask.textures({
        originalTexture: 1
    });
    simpleShader.call(this, gl.unsharpMask, {
        strength: strength
    });
    this._.extraTexture.unuse(1);

    return this;
}

// src/filters/adjust/vibrance.js
/**
 * @filter       Vibrance
 * @description  Modifies the saturation of desaturated colors, leaving saturated colors unmodified.
 * @param amount -1 to 1 (-1 is minimum vibrance, 0 is no change, and 1 is maximum vibrance)
 */
function vibrance(amount) {
    gl.vibrance = gl.vibrance || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float amount;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float average = (color.r + color.g + color.b) / 3.0;\
            float mx = max(color.r, max(color.g, color.b));\
            float amt = (mx - average) * (-amount * 3.0);\
            color.rgb = mix(color.rgb, vec3(mx), amt);\
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.vibrance, {
        amount: clamp(-1, amount, 1)
    });

    return this;
}

// src/filters/adjust/vignette.js
/**
 * @filter         Vignette
 * @description    Adds a simulated lens edge darkening effect.
 * @param size     0 to 1 (0 for center of frame, 1 for edge of frame)
 * @param amount   0 to 1 (0 for no effect, 1 for maximum lens darkening)
 */
function vignette(size, amount) {
    gl.vignette = gl.vignette || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float size;\
        uniform float amount;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            float dist = distance(texCoord, vec2(0.5, 0.5));\
            color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.vignette, {
        size: clamp(0, size, 1),
        amount: clamp(0, amount, 1)
    });

    return this;
}

// src/filters/blur/lensblur.js
/**
 * @filter           Lens Blur
 * @description      Imitates a camera capturing the image out of focus by using a blur that generates
 *                   the large shapes known as bokeh. The polygonal shape of real bokeh is due to the
 *                   blades of the aperture diaphragm when it isn't fully open. This blur renders
 *                   bokeh from a 6-bladed diaphragm because the computation is more efficient. It
 *                   can be separated into three rhombi, each of which is just a skewed box blur.
 *                   This filter makes use of the floating point texture WebGL extension to implement
 *                   the brightness parameter, so there will be severe visual artifacts if brightness
 *                   is non-zero and the floating point texture extension is not available. The
 *                   idea was from John White's SIGGRAPH 2011 talk but this effect has an additional
 *                   brightness parameter that fakes what would otherwise come from a HDR source.
 * @param radius     the radius of the hexagonal disk convolved with the image
 * @param brightness -1 to 1 (the brightness of the bokeh, negative values will create dark bokeh)
 * @param angle      the rotation of the bokeh in radians
 */
function lensBlur(radius, brightness, angle) {
    // All averaging is done on values raised to a power to make more obvious bokeh
    // (we will raise the average to the inverse power at the end to compensate).
    // Without this the image looks almost like a normal blurred image. This hack is
    // obviously not realistic, but to accurately simulate this we would need a high
    // dynamic range source photograph which we don't have.
    gl.lensBlurPrePass = gl.lensBlurPrePass || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float power;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color = pow(color, vec4(power));\
            gl_FragColor = vec4(color);\
        }\
    ');

    var common = '\
        uniform sampler2D texture0;\
        uniform sampler2D texture1;\
        uniform vec2 delta0;\
        uniform vec2 delta1;\
        uniform float power;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        vec4 sample(vec2 delta) {\
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(delta, 151.7182), 0.0);\
            \
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            for (float t = 0.0; t <= 30.0; t++) {\
                float percent = (t + offset) / 30.0;\
                color += texture2D(texture0, texCoord + delta * percent);\
                total += 1.0;\
            }\
            return color / total;\
        }\
    ';

    gl.lensBlur0 = gl.lensBlur0 || new Shader(null, common + '\
        void main() {\
            gl_FragColor = sample(delta0);\
        }\
    ');
    gl.lensBlur1 = gl.lensBlur1 || new Shader(null, common + '\
        void main() {\
            gl_FragColor = (sample(delta0) + sample(delta1)) * 0.5;\
        }\
    ');
    gl.lensBlur2 = gl.lensBlur2 || new Shader(null, common + '\
        void main() {\
            vec4 color = (sample(delta0) + 2.0 * texture2D(texture1, texCoord)) / 3.0;\
            gl_FragColor = pow(color, vec4(power));\
        }\
    ').textures({ texture1: 1 });

    // Generate
    var dir = [];
    for (var i = 0; i < 3; i++) {
        var a = angle + i * Math.PI * 2 / 3;
        dir.push([radius * Math.sin(a) / this.width, radius * Math.cos(a) / this.height]);
    }
    var power = Math.pow(10, clamp(-1, brightness, 1));

    // Remap the texture values, which will help make the bokeh effect
    simpleShader.call(this, gl.lensBlurPrePass, {
        power: power
    });

    // Blur two rhombi in parallel into extraTexture
    this._.extraTexture.ensureFormat(this._.texture);
    simpleShader.call(this, gl.lensBlur0, {
        delta0: dir[0]
    }, this._.texture, this._.extraTexture);
    simpleShader.call(this, gl.lensBlur1, {
        delta0: dir[1],
        delta1: dir[2]
    }, this._.extraTexture, this._.extraTexture);

    // Blur the last rhombus and combine with extraTexture
    simpleShader.call(this, gl.lensBlur0, {
        delta0: dir[1]
    });
    this._.extraTexture.use(1);
    simpleShader.call(this, gl.lensBlur2, {
        power: 1 / power,
        delta0: dir[2]
    });

    return this;
}

// src/filters/blur/pixelate.js
/**
 * @filter        Pixelate
 * @description   Renders the image at a lower resolution using square tiles. Tile colors
 *                are nearest-neighbor sampled from the centers of the tiles.
 * @param centerX The x coordinate of the pattern center.
 * @param centerY The y coordinate of the pattern center.
 * @param scale   The width of an individual tile, in pixels.
 */
function pixelate(centerX, centerY, scale) {
    gl.pixelate = gl.pixelate || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 tex = (texCoord * texSize - center) / scale;\
            vec2 choice = floor(tex) + 0.5;\
            choice *= scale / texSize;\
            gl_FragColor = texture2D(texture, choice + center / texSize);\
        }\
    ');

    simpleShader.call(this, gl.pixelate, {
        center: [centerX, centerY],
        scale: scale,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/blur/tiltshift.js
/**
 * @filter               Tilt Shift
 * @description          Simulates the shallow depth of field normally encountered in close-up
 *                       photography, which makes the scene seem much smaller than it actually
 *                       is. This filter assumes the scene is relatively planar, in which case
 *                       the part of the scene that is completely in focus can be described by
 *                       a line (the intersection of the focal plane and the scene). An example
 *                       of a planar scene might be looking at a road from above at a downward
 *                       angle. The image is then blurred with a blur radius that starts at zero
 *                       on the line and increases further from the line.
 * @param startX         The x coordinate of the start of the line segment.
 * @param startY         The y coordinate of the start of the line segment.
 * @param endX           The x coordinate of the end of the line segment.
 * @param endY           The y coordinate of the end of the line segment.
 * @param blurRadius     The maximum radius of the pyramid blur.
 * @param gradientRadius The distance from the line at which the maximum blur radius is reached.
 */
function tiltShift(startX, startY, endX, endY, blurRadius, gradientRadius) {
    gl.tiltShift = gl.tiltShift || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float blurRadius;\
        uniform float gradientRadius;\
        uniform vec2 start;\
        uniform vec2 end;\
        uniform vec2 delta;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\
            float radius = smoothstep(0.0, 1.0, abs(dot(texCoord * texSize - start, normal)) / gradientRadius) * blurRadius;\
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec4 sample = texture2D(texture, texCoord + delta / texSize * percent * radius);\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            gl_FragColor = color / total;\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    var dx = endX - startX;
    var dy = endY - startY;
    var d = Math.sqrt(dx * dx + dy * dy);
    simpleShader.call(this, gl.tiltShift, {
        blurRadius: blurRadius,
        gradientRadius: gradientRadius,
        start: [startX, startY],
        end: [endX, endY],
        delta: [dx / d, dy / d],
        texSize: [this.width, this.height]
    });
    simpleShader.call(this, gl.tiltShift, {
        blurRadius: blurRadius,
        gradientRadius: gradientRadius,
        start: [startX, startY],
        end: [endX, endY],
        delta: [-dy / d, dx / d],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/blur/triangleblur.js
/**
 * @filter       Triangle Blur
 * @description  This is the most basic blur filter, which convolves the image with a
 *               pyramid filter. The pyramid filter is separable and is applied as two
 *               perpendicular triangle filters.
 * @param radius The radius of the pyramid convolved with the image.
 */
function triangleBlur(radius) {
    gl.triangleBlur = gl.triangleBlur || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec4 sample = texture2D(texture, texCoord + delta * percent);\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            gl_FragColor = color / total;\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    simpleShader.call(this, gl.triangleBlur, {
        delta: [radius / this.width, 0]
    });
    simpleShader.call(this, gl.triangleBlur, {
        delta: [0, radius / this.height]
    });

    return this;
}

// src/filters/blur/zoomblur.js
/**
 * @filter          Zoom Blur
 * @description     Blurs the image away from a certain point, which looks like radial motion blur.
 * @param centerX   The x coordinate of the blur origin.
 * @param centerY   The y coordinate of the blur origin.
 * @param strength  The strength of the blur. Values in the range 0 to 1 are usually sufficient,
 *                  where 0 doesn't change the image and 1 creates a highly blurred image.
 * @param minRadius The radius inside which this filter has no effect.
 */
function zoomBlur(centerX, centerY, strength, minRadius) {
    gl.zoomBlur = gl.zoomBlur || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float minRadius;\
        uniform float strength;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            vec2 toCenter = center - texCoord * texSize;\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = 0.0; t <= 40.0; t++) {\
                float percent = (t + offset) / 40.0;\
                float weight = percent - percent * percent;\
                percent *= 1.0 - 1.0 / (1.0 + 0.5 * (max(length(toCenter), minRadius) - minRadius) / (minRadius + 0.00001));\
                vec4 sample = texture2D(texture, texCoord + toCenter * percent * strength / texSize);\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            gl_FragColor = color / total;\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    simpleShader.call(this, gl.zoomBlur, {
        center: [centerX, centerY],
        minRadius: minRadius,
        strength: strength,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/colorhalftone.js
/**
 * @filter        Color Halftone
 * @description   Simulates a CMYK halftone rendering of the image by multiplying pixel values
 *                with a four rotated 2D sine wave patterns, one each for cyan, magenta, yellow,
 *                and black.
 * @param centerX The x coordinate of the pattern origin.
 * @param centerY The y coordinate of the pattern origin.
 * @param angle   The rotation of the pattern in radians.
 * @param size    The diameter of a dot in pixels.
 */
function colorHalftone(centerX, centerY, angle, size) {
    gl.colorHalftone = gl.colorHalftone || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float angle;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        float pattern(float angle) {\
            float s = sin(angle), c = cos(angle);\
            vec2 tex = texCoord * texSize - center;\
            vec2 point = vec2(\
                c * tex.x - s * tex.y,\
                s * tex.x + c * tex.y\
            ) * scale;\
            return (sin(point.x) * sin(point.y)) * 4.0;\
        }\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            vec3 cmy = 1.0 - color.rgb;\
            float k = min(cmy.x, min(cmy.y, cmy.z));\
            cmy = (cmy - k) / (1.0 - k);\
            cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(angle + 0.26179), pattern(angle + 1.30899), pattern(angle)), 0.0, 1.0);\
            k = clamp(k * 10.0 - 5.0 + pattern(angle + 0.78539), 0.0, 1.0);\
            gl_FragColor = vec4(1.0 - cmy - k, color.a);\
        }\
    ');

    simpleShader.call(this, gl.colorHalftone, {
        center: [centerX, centerY],
        angle: angle,
        scale: Math.PI / size,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/dotscreen.js
/**
 * @filter        Dot Screen
 * @description   Simulates a black and white halftone rendering of the image by multiplying
 *                pixel values with a rotated 2D sine wave pattern.
 * @param centerX The x coordinate of the pattern origin.
 * @param centerY The y coordinate of the pattern origin.
 * @param angle   The rotation of the pattern in radians.
 * @param size    The diameter of a dot in pixels.
 */
function dotScreen(centerX, centerY, angle, size) {
    gl.dotScreen = gl.dotScreen || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float angle;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        float pattern() {\
            float s = sin(angle), c = cos(angle);\
            vec2 tex = texCoord * texSize - center;\
            vec2 point = vec2(\
                c * tex.x - s * tex.y,\
                s * tex.x + c * tex.y\
            ) * scale;\
            return (sin(point.x) * sin(point.y)) * 4.0;\
        }\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float average = (color.r + color.g + color.b) / 3.0;\
            gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\
        }\
    ');

    simpleShader.call(this, gl.dotScreen, {
        center: [centerX, centerY],
        angle: angle,
        scale: Math.PI / size,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/edgework.js
/**
 * @filter       Edge Work
 * @description  Picks out different frequencies in the image by subtracting two
 *               copies of the image blurred with different radii.
 * @param radius The radius of the effect in pixels.
 */
function edgeWork(radius) {
    gl.edgeWork1 = gl.edgeWork1 || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec2 color = vec2(0.0);\
            vec2 total = vec2(0.0);\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec3 sample = texture2D(texture, texCoord + delta * percent).rgb;\
                float average = (sample.r + sample.g + sample.b) / 3.0;\
                color.x += average * weight;\
                total.x += weight;\
                if (abs(t) < 15.0) {\
                    weight = weight * 2.0 - 1.0;\
                    color.y += average * weight;\
                    total.y += weight;\
                }\
            }\
            gl_FragColor = vec4(color / total, 0.0, 1.0);\
        }\
    ');
    gl.edgeWork2 = gl.edgeWork2 || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec2 color = vec2(0.0);\
            vec2 total = vec2(0.0);\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec2 sample = texture2D(texture, texCoord + delta * percent).xy;\
                color.x += sample.x * weight;\
                total.x += weight;\
                if (abs(t) < 15.0) {\
                    weight = weight * 2.0 - 1.0;\
                    color.y += sample.y * weight;\
                    total.y += weight;\
                }\
            }\
            float c = clamp(10000.0 * (color.y / total.y - color.x / total.x) + 0.5, 0.0, 1.0);\
            gl_FragColor = vec4(c, c, c, 1.0);\
        }\
    ');

    simpleShader.call(this, gl.edgeWork1, {
        delta: [radius / this.width, 0]
    });
    simpleShader.call(this, gl.edgeWork2, {
        delta: [0, radius / this.height]
    });

    return this;
}

// src/filters/fun/hexagonalpixelate.js
/**
 * @filter        Hexagonal Pixelate
 * @description   Renders the image using a pattern of hexagonal tiles. Tile colors
 *                are nearest-neighbor sampled from the centers of the tiles.
 * @param centerX The x coordinate of the pattern center.
 * @param centerY The y coordinate of the pattern center.
 * @param scale   The width of an individual tile, in pixels.
 */
function hexagonalPixelate(centerX, centerY, scale) {
    gl.hexagonalPixelate = gl.hexagonalPixelate || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 tex = (texCoord * texSize - center) / scale;\
            tex.y /= 0.866025404;\
            tex.x -= tex.y * 0.5;\
            \
            vec2 a;\
            if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0) a = vec2(floor(tex.x), floor(tex.y));\
            else a = vec2(ceil(tex.x), ceil(tex.y));\
            vec2 b = vec2(ceil(tex.x), floor(tex.y));\
            vec2 c = vec2(floor(tex.x), ceil(tex.y));\
            \
            vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);\
            vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);\
            vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);\
            vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);\
            \
            float alen = length(TEX - A);\
            float blen = length(TEX - B);\
            float clen = length(TEX - C);\
            \
            vec2 choice;\
            if (alen < blen) {\
                if (alen < clen) choice = a;\
                else choice = c;\
            } else {\
                if (blen < clen) choice = b;\
                else choice = c;\
            }\
            \
            choice.x += choice.y * 0.5;\
            choice.y *= 0.866025404;\
            choice *= scale / texSize;\
            gl_FragColor = texture2D(texture, choice + center / texSize);\
        }\
    ');

    simpleShader.call(this, gl.hexagonalPixelate, {
        center: [centerX, centerY],
        scale: scale,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/hopeposter.js
/**
 * @filter           Hope Poster
 * @description      Posterize the image using the colors in the famous Obama "hope" poster.
 */
function hopePoster(centerX, centerY, angle, radius, isInfinite) {
    gl.hopePoster = gl.hopePoster || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec2 dx = vec2(1.0 / texSize.x, 0.0);\
            vec2 dy = vec2(0.0, 1.0 / texSize.y);\
            vec4 color = texture2D(texture, texCoord);\
            float bigTotal = 0.0;\
            float smallTotal = 0.0;\
            vec3 bigAverage = vec3(0.0);\
            vec3 smallAverage = vec3(0.0);\
            for (float x = -2.0; x <= 2.0; x += 1.0) {\
                for (float y = -2.0; y <= 2.0; y += 1.0) {\
                    vec3 sample = texture2D(texture, texCoord + dx * x + dy * y).rgb;\
                    bigAverage += sample;\
                    bigTotal += 1.0;\
                    if (abs(x) + abs(y) < 2.0) {\
                        smallAverage += sample;\
                        smallTotal += 1.0;\
                    }\
                }\
            }\
            vec3 edges = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);\
            float edge = dot(edges, edges) * 10000.0;\
            edge = edge * 100.0 - 50.0;\
            \
            float gray = (color.r + color.g + color.b) / 3.0;\
            if (gray < 0.3 || edge > 0.5) color.rgb = vec3(0.0, 0.2, 0.3);\
            else if (gray < 0.35) color.rgb = vec3(0.85, 0.1, 0.13);\
            else if (gray < 0.5 || gray < 0.55 && fract(gl_FragCoord.y * 0.5) < 0.5) color.rgb = vec3(0.45, 0.59, 0.62);\
            else color.rgb = vec3(0.98, 0.9, 0.64);\
            \
            gl_FragColor = color;\
        }\
    ');

    triangleBlur.call(this, 3);
    simpleShader.call(this, gl.hopePoster, {
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/ink.js
/**
 * @filter         Ink
 * @description    Simulates outlining the image in ink by darkening edges stronger than a
 *                 certain threshold. The edge detection value is the difference of two
 *                 copies of the image, each blurred using a blur of a different radius.
 * @param strength The multiplicative scale of the ink edges. Values in the range 0 to 1
 *                 are usually sufficient, where 0 doesn't change the image and 1 adds lots
 *                 of black edges. Negative strength values will create white ink edges
 *                 instead of black ones.
 */
function ink(strength) {
    gl.ink = gl.ink || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float strength;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 dx = vec2(1.0 / texSize.x, 0.0);\
            vec2 dy = vec2(0.0, 1.0 / texSize.y);\
            vec4 color = texture2D(texture, texCoord);\
            float bigTotal = 0.0;\
            float smallTotal = 0.0;\
            vec3 bigAverage = vec3(0.0);\
            vec3 smallAverage = vec3(0.0);\
            for (float x = -2.0; x <= 2.0; x += 1.0) {\
                for (float y = -2.0; y <= 2.0; y += 1.0) {\
                    vec3 sample = texture2D(texture, texCoord + dx * x + dy * y).rgb;\
                    bigAverage += sample;\
                    bigTotal += 1.0;\
                    if (abs(x) + abs(y) < 2.0) {\
                        smallAverage += sample;\
                        smallTotal += 1.0;\
                    }\
                }\
            }\
            vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);\
            gl_FragColor = vec4(clamp(color.rgb - dot(edge, edge) * strength * 100000.0, 0.0, 1.0), color.a);\
        }\
    ');

    simpleShader.call(this, gl.ink, {
        strength: strength * strength * strength * strength * strength,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/invert.js
/**
 * @filter         Invert
 * @description    Inverts all color channels.
 */
function invert() {
    gl.invert = gl.invert || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            gl_FragColor = vec4(1.0 - color.rgb, color.a);\
        }\
    ');

    simpleShader.call(this, gl.invert);

    return this;
}

// src/filters/other/blend.js
/**
 * @filter        Blend
 * @description   Linearly interpolates between the current texture and the
 *                provided texture.
 * @param texture The other texture to blend with.
 * @param alpha   Specifies how much of each image to include. 0 means none of
 *                the provided texture and 1 means all of the provided texture.
 */
function blend(texture, alpha) {
    gl.blend = gl.blend || new Shader(null, '\
        uniform sampler2D texture;\
        uniform sampler2D other;\
        uniform float alpha;\
        varying vec2 texCoord;\
        void main() {\
            gl_FragColor = mix(texture2D(texture, texCoord), texture2D(other, texCoord), alpha);\
        }\
    ');

    (texture._ || texture).use(1);
    gl.blend.textures({ other: 1 });
    simpleShader.call(this, gl.blend, { alpha: alpha });

    return this;
}

// src/filters/other/common.js
function warpShader(uniforms, warp) {
    return new Shader(null, uniforms + '\
    uniform sampler2D texture;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
        vec2 coord = texCoord * texSize;\
        ' + warp + '\
        gl_FragColor = texture2D(texture, coord / texSize);\
        vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);\
        if (coord != clampedCoord) {\
            /* fade to transparent if we are outside the image */\
            gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));\
        }\
    }');
}

// returns a random number between 0 and 1
var randomShaderFunc = '\
    float random(vec3 scale, float seed) {\
        /* use the fragment position for a different seed per-pixel */\
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\
    }\
';

// src/filters/other/stamp.js
/**
 * @filter          Stamp
 * @description     Stamps an image on top of the current canvas contents in
 *                  potentially multiple positions. This call renders a batch
 *                  of sprites in a single call instead of only one stamp for
 *                  performance reasons.
 * @param positions An array of arrays where each inner array represents one
 *                  stamp and has the format [centerX, centerY, scaleX, scaleY,
 *                  rotation, alpha]. The rotation is in radians and the
 *                  alpha is from 0 to 1.
 * @param texture   A texture containing the image to be stamped.
 */
function stamp(positions, texture) {
    gl.stamp = gl.stamp || new Shader('\
        attribute vec2 vertex;\
        attribute vec3 _texCoord;\
        varying vec3 texCoord;\
        void main() {\
            texCoord = _texCoord;\
            gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);\
        }\
    ', '\
        uniform sampler2D texture;\
        uniform vec2 texSize;\
        varying vec3 texCoord;\
        void main() {\
            gl_FragColor = texture2D(texture, texCoord.xy) * vec4(vec3(1.0), texCoord.z);\
        }\
    ');

    var canvas = this;
    texture = texture._ || texture;
    gl.stamp.uniforms({ texSize: [this.width, this.height] });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this._.spareTexture.drawTo(function() {
        // Copy the current texture into spareTexture first
        canvas._.texture.use();
        Shader.getDefaultShader().drawRect();

        // Generate the geometry
        var vertices = [], coords = [];
        var w = texture.width, h = texture.height;
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
            var centerX = pos[0], centerY = pos[1], scaleX = pos[2], scaleY = pos[3], rotation = pos[4], alpha = pos[5];
            var s = Math.sin(rotation), c = Math.cos(rotation);
            for (var j = 0; j < 4; j++) {
                var x = j % 2, y = j / 2 | 0;
                coords.splice(coords.length, 0, x, y, alpha);
                x = (x - 0.5) * w * scaleX;
                y = (y - 0.5) * h * scaleY;
                vertices.splice(vertices.length, 0,
                    (centerX + x * c + y * s) / canvas.width,
                    (centerY + y * c - x * s) / canvas.height);
            }
        }

        // Bind the vertices
        if (gl.vertexBuffer == null) gl.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        if (gl.stamp.vertexAttribute == null) {
            gl.stamp.vertexAttribute = gl.getAttribLocation(gl.stamp.program, 'vertex');
            gl.enableVertexAttribArray(gl.stamp.vertexAttribute);
        }

        // Bind the texture coordinates (and alpha)
        if (gl.texCoordBuffer == null) gl.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
        if (gl.stamp.texCoordAttribute == null) {
            gl.stamp.texCoordAttribute = gl.getAttribLocation(gl.stamp.program, '_texCoord');
            gl.enableVertexAttribArray(gl.stamp.texCoordAttribute);
        }

        // Draw the stamps
        texture.use();
        gl.useProgram(gl.stamp.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.vertexAttribPointer(gl.stamp.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.vertexAttribPointer(gl.stamp.texCoordAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });
    gl.disable(gl.BLEND);
    this._.spareTexture.swapWith(this._.texture);

    return this;
}

// src/filters/video/chromelogo.js
/**
 * @filter           Chrome Logo
 * @description      Overlays the logo of the Chrome browser.
 * @param centerX    The x coordinate of the logo.
 * @param centerY    The y coordinate of the logo.
 * @param frame      The frame number of the swirling animation.
 * @param blueRadius The radius of the blue center.
 */
function chromeLogo(centerX, centerY, frame, blueRadius) {
    gl.chromeLogo = gl.chromeLogo || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        uniform float blueRadius;\
        uniform vec2 center;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        \
        const float twopi = 6.283185307179586;\
        \
        vec3 colorAt(vec2 coord, float twist) {\
            float radius = length(coord);\
            float offset = radius * 0.005;\
            float angle = fract((atan(coord.y, coord.x) - offset) / twopi + twist) * 3.0;\
            const vec3 red = vec3(1.0, 0.25, 0.0);\
            const vec3 green = vec3(0.5, 0.75, 0.25);\
            const vec3 yellow = vec3(1.0, 1.0, 0.25);\
            const vec3 blue = vec3(0.35, 0.6, 0.85);\
            vec3 color;\
            float t = 1.0 / (1.0 + exp(-100.0 * (fract(angle) - 0.5)));\
            if (angle < 1.0) color = mix(red, yellow, t);\
            else if (angle < 2.0) color = mix(yellow, green, t);\
            else color = mix(green, red, t);\
            color = mix(color, blue, 1.0 / (1.0 + exp(-50.0 * (1.0 - radius / blueRadius))));\
            return color;\
        }\
        \
        vec4 bulgySample(vec2 coord) {\
            float bulge = 1.5 * length(coord) / blueRadius;\
            return texture2D(texture, (coord / (1.0 + 5.0 / (exp(-bulge) + exp(bulge))) + center) / texSize);\
        }\
        \
        void main() {\
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            vec2 coord = texCoord * texSize - center;\
            float twist = 2.0 * (fract(frame * 0.005 + 0.5) - 0.5);\
            float reset = twist * twist;\
            reset *= reset * reset;\
            reset *= reset * reset;\
            reset *= reset * reset;\
            float sign = (twist > 0.0 ? 1.0 : -1.0);\
            float radius = length(coord);\
            vec2 tangent = vec2(-coord.y, coord.x) / radius;\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            for (float t = 0.0; t <= 20.0; t++) {\
                float percent = (t + offset) / 20.0;\
                float weight = percent - percent * percent;\
                float angle = (percent - 0.5) * 0.25 / (1.0 + exp(-10.0 * (radius / blueRadius - 1.075)));\
                angle -= twopi * twist / (1.0 + exp(-50.0 * (radius / blueRadius - 1.075)));\
                float s = sin(angle), c = cos(angle);\
                vec4 sample = bulgySample(vec2(dot(vec2(c, s), coord), dot(vec2(-s, c), coord)));\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            color /= total;\
            gl_FragColor = vec4(colorAt(coord, twist) * dot(vec3(0.2989, 0.5870, 0.1140), 0.25 + 0.75 * color.rgb), color.a);\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    simpleShader.call(this, gl.chromeLogo, {
        center: [centerX, centerY],
        frame: frame,
        blueRadius: blueRadius,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/video/oldfilm.js
/**
 * @filter      Old Film
 * @description Makes the image look like it was projected through an old projector.
 * @param frame The frame number of the animation (the random seed).
 */
function oldFilm(frame) {
    gl.oldFilm = gl.oldFilm || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        varying vec2 texCoord;\
        \
        float random(float scale, float seed) {\
            return fract(sin(seed * scale) * 43758.5453 + seed * 234.45574);\
        }\
        \
        void main() {\
            /* Base color */\
            vec2 offset = (vec2(random(34.534, frame), random(78678.45, frame)) - 0.5) * 0.001;\
            offset.y += 0.1 * pow(0.5 - 0.5 * cos(frame) * cos(frame * 3.178236) * cos(frame * 2.718672), 20.0);\
            vec4 color = texture2D(texture, texCoord + offset);\
            \
            /* Sepia */\
            color.rgb = vec3(\
                dot(color.rgb, vec3(0.393, 0.769, 0.189)),\
                dot(color.rgb, vec3(0.349, 0.686, 0.168)),\
                dot(color.rgb, vec3(0.272, 0.534, 0.131))\
            );\
            \
            /* Vignette */\
            offset = (vec2(random(345.34, frame), random(8204.86, frame)) - 0.5) * 0.01;\
            vec2 darken = abs(texCoord + offset - 0.5) * (2.25 + 0.02 * cos(frame * 0.3));\
            darken = max(vec2(0.0), 1.0 - pow(darken, vec2(5.0)));\
            color.rgb = mix(vec3(0.1), color.rgb, length(darken.x * darken.y));\
            \
            /* Brightness */\
            color.rgb *= 0.75 + 0.25 * cos(frame * 0.1 + cos(frame * 0.4)) * cos(frame / 26.0);\
            \
            /* Lines */\
            float x = (texCoord.x + offset.x) * 100.0;\
            color.rgb *= 1.0 - pow((0.5 - 0.5 * cos(0.025 * frame + 5.0 * x)) * (0.5 - 0.5 * cos(x) * cos(x * 3.178236) * cos(x * 2.718672) * cos(x * 5.728309)), 20.0);\
            \
            /* Specks */\
            vec2 center = vec2(random(6461.345, frame), random(234.2423, frame)) * 2.0;\
            float angle = random(13467.33, frame) * 6.283185307179586;\
            float s = sin(angle), c = cos(angle);\
            vec2 delta = texCoord - center;\
            delta = vec2(dot(vec2(c, s), delta), dot(vec2(-s, c), delta));\
            float shape = 0.9 * random(456.6575, frame);\
            delta.x /= 1.0 - shape;\
            float scale = 200.0 + 200.0 * random(765343.875, frame);\
            float t = scale * length(delta) - 2.0;\
            color.rgb *= smoothstep(0.0, 1.0, t);\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.oldFilm, {
        frame: frame,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/video/photocopy.js
/**
 * @filter       Photocopy
 * @description  Makes the image look like it was printed by a photocopier.
 * @param cutoff The brightness threshold for the black/white boundary (0 to 1).
 * @param frame  The frame number of the animation (the random seed).
 */
function photocopy(cutoff, frame) {
    gl.photocopy = gl.photocopy || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        uniform float cutoff;\
        varying vec2 texCoord;\
        \
        float random(float scale, float seed) {\
            return fract(sin(seed * scale) * 43758.5453 + seed * 234.45574);\
        }\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            /* Drum lines */\
            float y = texCoord.y * 300.0;\
            color.rgb *= 1.0 + 0.1 * sin(y) * sin(y * 1.1) + 0.1 * sin(y * 2.317) * sin(y * 1.3648) + 0.1 * sin(y * 0.3673) * sin(y * 0.7836);\
            \
            /* Brightness */\
            color.rgb *= 1.0 + 0.05 * cos(frame * 0.1 + cos(frame * 0.4)) * cos(frame / 26.0);\
            \
            /* Black and white with high contrast */\
            float gray = (color.r + color.g + color.b) / 3.0;\
            color.rgb = vec3(smoothstep(0.0, 1.0, gray * 6.0 - cutoff * 7.0 + 1.0));\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.photocopy, {
        frame: frame,
        cutoff: clamp(0, cutoff, 1),
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/video/quadcolor.js
/**
 * @filter       Quad Color
 * @description  Renders the image four times, each with a different color.
 * @param color1 An array with three values (0 to 1) for the top-left corner.
 * @param color2 An array with three values (0 to 1) for the top-right corner.
 * @param color3 An array with three values (0 to 1) for the bottom-left corner.
 * @param color4 An array with three values (0 to 1) for the bottom-right corner.
 */
function quadColor(color1, color2, color3, color4) {
    gl.quadColor = gl.quadColor || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec3 color1;\
        uniform vec3 color2;\
        uniform vec3 color3;\
        uniform vec3 color4;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec4 color = texture2D(texture, fract(texCoord * 2.0));\
            color.rgb = vec3((color.r + color.g + color.b) / 3.0);\
            if (texCoord.y < 0.5) {\
                if (texCoord.x < 0.5) color.rgb *= color1;\
                else color.rgb *= color2;\
            } else {\
                if (texCoord.x < 0.5) color.rgb *= color3;\
                else color.rgb *= color4;\
            }\
            gl_FragColor = vec4(color);\
        }\
    ');

    simpleShader.call(this, gl.quadColor, {
        color1: color1,
        color2: color2,
        color3: color3,
        color4: color4
    });

    return this;
}

// src/filters/video/quadrotate.js
/**
 * @filter       Quad Rotate
 * @description  Renders the image four times, each with a configurable orientation.
 * @param quad1  The q
 * @param color2 An array with three values (0 to 1) for the top-right corner.
 * @param color3 An array with three values (0 to 1) for the bottom-left corner.
 * @param color4 An array with three values (0 to 1) for the bottom-right corner.
 */
function quadRotate(dir1, dir2, dir3, dir4) {
    gl.quadRotate = gl.quadRotate || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec4 angles;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec2 coord = fract(texCoord * 2.0) - 0.5;\
            vec2 a = vec2(texCoord.x < 0.5, texCoord.y < 0.5), b = 1.0 - a;\
            float angle = dot(angles, vec4(a.x * a.y, b.x * a.y, a.x * b.y, b.x * b.y));\
            float s = sin(angle), c = cos(angle);\
            coord = vec2(dot(vec2(c, s), coord), dot(vec2(-s, c), coord));\
            gl_FragColor = vec4(texture2D(texture, coord + 0.5));\
        }\
    ');

    simpleShader.call(this, gl.quadRotate, {
        angles: [
            dir1 * Math.PI * 0.5,
            dir2 * Math.PI * 0.5,
            dir3 * Math.PI * 0.5,
            dir4 * Math.PI * 0.5
        ]
    });

    return this;
}

// src/filters/video/timestrips.js
/**
 * @filter         Time Strips
 * @description    Displays many horizontal slices of a video, each from a different frame.
 * @param textures An array containing a circular buffer of frames from a video.
 * @param frame    The index of the first texture in the circular buffer.
 */
function timeStrips(textures, frame) {
    gl.timeStrips = gl.timeStrips || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            gl_FragColor = texture2D(texture, texCoord);\
        }\
    ');

    var w = this.width, h = this.height;
    this._.spareTexture.drawTo(function() {
        for (var i = 0; i < textures.length; i++) {
            var texture = textures[(i + frame) % textures.length];
            (texture._ || texture).use();
            gl.timeStrips.drawRect(0, h * i / textures.length, w, h * (i + 1) / textures.length, true);
        }
    });
    this._.spareTexture.swapWith(this._.texture);

    return this;
}

// src/filters/video/vhs.js
/**
 * @filter      VHS
 * @description Makes the image look like it was captured on VHS.
 * @param frame The frame number of the animation (the random seed).
 */
function vhs(frame) {
    gl.vhs = gl.vhs || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        varying vec2 texCoord;\
        \
        float random(float scale, float seed) {\
            return fract(sin(seed * scale) * 43758.5453 + seed * 234.45574);\
        }\
        \
        void main() {\
            /* RGB to YCbCr */\
            vec4 color = texture2D(texture, texCoord);\
            vec3 rgb = color.rgb * 256.0;\
            vec3 ycbcr = vec3(\
                dot(vec3(0.299, 0.587, 0.114), rgb),\
                128.0 + dot(vec3(-0.1687, -0.3313, 0.5), rgb),\
                128.0 + dot(vec3(0.5, -0.4187, -0.0813), rgb)\
            );\
            \
            /* Color dimming */\
            ycbcr = mix(vec3(128.0), ycbcr, vec3(0.75, 0.5, 0.5));\
            \
            /* Scan lines */\
            float y = texCoord.y + frame * 0.005;\
            ycbcr.x *= 1.0 + 0.075 * sin(y * 300.0 + frame * 11.0) * sin(y * 70.0) * sin(y * 10.0);\
            \
            /* Phosphor pattern */\
            ycbcr.x *= 1.0 + 0.25 * sin(dot(vec2(3.0, 1.0), gl_FragCoord.xy));\
            \
            /* YCbCr to RGB */\
            rgb = vec3(\
                ycbcr.x + 1.402 * (ycbcr.z - 128.0),\
                ycbcr.x - 0.34414 * (ycbcr.y - 128.0) - 0.71414 * (ycbcr.z - 128.0),\
                ycbcr.x + 1.772 * (ycbcr.y - 128.0)\
            );\
            gl_FragColor = vec4(rgb / 256.0, color.a);\
        }\
    ');

    // VHS is low resolution and runs a sharpening filter
    triangleBlur.call(this, 5);
    unsharpMask.call(this, 5, 10);

    simpleShader.call(this, gl.vhs, {
        frame: frame,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/video/wettable.js
/**
 * @filter         Wet Table
 * @description    Uses the scene to generate an image of a wet table.
 */
function wetTable() {
    gl.wetTableGrayscale = gl.wetTableGrayscale || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float gray = dot(vec3(0.2989, 0.5870, 0.1140), color.rgb);\
            gl_FragColor = vec4(gray);\
        }\
    ');

    gl.wetTableThreshold = gl.wetTableThreshold || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            gl_FragColor = vec4(float(fract(color.r * 4.0) > 0.5));\
        }\
    ');

    gl.wetTableBlur = gl.wetTableBlur || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        void main() {\
            vec4 centerSample = texture2D(texture, texCoord);\
            float color = centerSample.r;\
            float total = 1.0;\
            for (float t = 1.5; t < 11.5; t += 2.0) {\
                float weight = 2.0 * exp(-t * t * 0.02);\
                color += texture2D(texture, texCoord + delta * t).r * weight;\
                color += texture2D(texture, texCoord - delta * t).r * weight;\
                total += 2.0 * weight;\
            }\
            gl_FragColor = vec4(color / total, centerSample.g, 0.0, 1.0);\
        }\
    ');

    gl.wetTable = gl.wetTable || new Shader(null, '\
        uniform sampler2D texture;\
        uniform sampler2D envMap;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec2 delta = texCoord / gl_FragCoord.xy;\
            vec4 data = texture2D(texture, texCoord);\
            vec4 xneg = texture2D(texture, texCoord - vec2(delta.x, 0.0));\
            vec4 xpos = texture2D(texture, texCoord + vec2(delta.x, 0.0));\
            vec4 yneg = texture2D(texture, texCoord - vec2(0.0, delta.y));\
            vec4 ypos = texture2D(texture, texCoord + vec2(0.0, delta.y));\
            float isOutside = clamp(15.0 * (data.r - 0.5), 0.0, 1.0);\
            float depth = 0.3;\
            vec3 normal = normalize(cross(vec3(depth, 0.0, xpos.r - xneg.r), vec3(0.0, depth, ypos.r - yneg.r)));\
            \
            float shadow = texture2D(texture, texCoord - vec2(0, delta.y * 5.0)).r;\
            vec2 coord = gl_FragCoord.xy * 0.02;\
            vec3 ray = refract(vec3(0.0, 0.0, -1.0), normal, 1.65);\
            coord += ray.xy / ray.z * (data.r - 0.5) * (1.0 - isOutside);\
            float pattern = (float(fract(coord.x) > 0.5) + float(fract(coord.y) > 0.5)) * 0.5;\
            vec3 outsideColor = mix(vec3(0.75, 0.25, 0.25), vec3(0.85), pattern);\
            \
            ray = reflect(vec3(0.0, 0.0, -1.0), normal);\
            vec2 roof = ray.xz / (ray.y + 0.00001);\
            float dist = min(min(length(roof - vec2(-2.0, 1.0)), length(roof - vec2(0.5, 1.0))),\
                             min(length(roof - vec2(1.0, 2.0)), length(roof - vec2(-1.0, 1.0))));\
            float light = 1.0 / (0.1 + 10.0 * dist);\
            vec3 insideColor = outsideColor * (0.25 + 0.85 * ray.z) + light;\
            insideColor += 0.125 - 0.125 / (1.0 + exp(-30.0 * (ray.x * 0.25 + ray.y + 0.5)));\
            insideColor += pow(max(0.0, ray.y), 10.0) * 0.5 - max(0.0, -ray.y) * 0.25;\
            \
            gl_FragColor = vec4(mix(insideColor, outsideColor * (0.5 + 0.5 * pow(shadow, 0.25)), isOutside), 1.0);\
        }\
    ');

    simpleShader.call(this, gl.wetTableGrayscale);
    simpleShader.call(this, gl.wetTableBlur, { delta: [1 / this.width, 0] });
    simpleShader.call(this, gl.wetTableBlur, { delta: [0, 1 / this.height] });
    simpleShader.call(this, gl.wetTableThreshold);
    simpleShader.call(this, gl.wetTableBlur, { delta: [1 / this.width, 0] });
    simpleShader.call(this, gl.wetTableBlur, { delta: [0, 1 / this.height] });
    simpleShader.call(this, gl.wetTable);

    return this;
}

// src/filters/warp/blockhead.js
/**
 * @filter         Blockhead
 * @description    Bulges or pinches the image in a rectangle.
 * @param centerX  The x coordinate of the center of the rectangle of effect.
 * @param centerY  The y coordinate of the center of the rectangle of effect.
 * @param width    The width of the rectangle of effect.
 * @param height   The height of the rectangle of effect.
 * @param strength -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */
function blockhead(centerX, centerY, width, height, strength) {
    gl.blockhead = gl.blockhead || warpShader('\
        uniform vec2 radius;\
        uniform float strength;\
        uniform vec2 center;\
        float warp(float coord) {\
            float percent = abs(coord);\
            if (percent < 1.0) {\
                float factor = mix(1.0, smoothstep(0.0, 1.0, percent), abs(strength) * 0.75);\
                if (strength > 0.0) coord *= factor;\
                else coord /= factor;\
            }\
            return coord;\
        }\
    ', '\
        coord = (coord - center) / radius;\
        coord.x = warp(coord.x);\
        coord.y = warp(coord.y);\
        coord = coord * radius + center;\
    ');

    simpleShader.call(this, gl.blockhead, {
        radius: [width / 2, height / 2],
        strength: clamp(-1, strength, 1),
        center: [centerX, centerY],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/bulgepinch.js
/**
 * @filter         Bulge / Pinch
 * @description    Bulges or pinches the image in a circle.
 * @param centerX  The x coordinate of the center of the circle of effect.
 * @param centerY  The y coordinate of the center of the circle of effect.
 * @param radius   The radius of the circle of effect.
 * @param strength -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */
function bulgePinch(centerX, centerY, radius, strength) {
    gl.bulgePinch = gl.bulgePinch || warpShader('\
        uniform float radius;\
        uniform float strength;\
        uniform vec2 center;\
    ', '\
        coord -= center;\
        float distance = length(coord);\
        if (distance < radius) {\
            float percent = distance / radius;\
            if (strength > 0.0) {\
                coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\
            } else {\
                coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\
            }\
        }\
        coord += center;\
    ');

    simpleShader.call(this, gl.bulgePinch, {
        radius: radius,
        strength: clamp(-1, strength, 1),
        center: [centerX, centerY],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/kaleidoscope.js
/**
 * @filter         Kaleidoscope
 * @description    Renders the image as if looked at through a kaleidoscope
 *                 (a tube with three mirrors inside arranged in a triangle).
 * @param centerX  The x coordinate of the center of the triangular pattern.
 * @param centerY  The y coordinate of the center of the triangular pattern.
 * @param size     The length of one side of a triangle.
 * @param angle    The rotation of the triangular pattern, in radians.
 */
function kaleidoscope(centerX, centerY, size, angle) {
    gl.kaleidoscope = gl.kaleidoscope || warpShader('\
        uniform float size;\
        uniform float angle;\
        uniform vec2 center;\
        bool xor(bool a, bool b) { return (int(a) + int(b)) == 1; }\
    ', '\
        float c = cos(angle);\
        float s = sin(angle);\
        \
        /* Convert to triangle coordinates */\
        coord = (coord - center) / size;\
        coord = vec2(dot(vec2(c, s), coord), dot(vec2(-s, c), coord));\
        coord.y /= 0.866025404;\
        coord.x -= coord.y * 0.5;\
        \
        /* Apply mirrored reflections */\
        coord = 3.0 * fract(coord / 3.0);\
        if (coord.x + coord.y > 3.0) coord = 3.0 - coord.yx;\
        if (coord.x + coord.y > 2.0) coord = 2.0 - coord.yx;\
        if (coord.x > 1.0) {\
            if (coord.y > 0.0) coord = vec2(2.0 - coord.x - coord.y, coord.x - 1.0);\
            else coord = vec2(2.0 - coord.x, coord.x + coord.y - 1.0);\
        }\
        else if (coord.y > 1.0) {\
            if (coord.x > 0.0) coord = vec2(coord.y - 1.0, 2.0 - coord.x - coord.y);\
            else coord = vec2(coord.x + coord.y - 1.0, 2.0 - coord.y);\
        }\
        else if (coord.x + coord.y > 1.0) coord = 1.0 - coord.yx;\
        \
        /* Convert from triangle coordinates */\
        coord.x += coord.y * 0.5;\
        coord.y *= 0.866025404;\
        coord = vec2(dot(vec2(c, -s), coord), dot(vec2(s, c), coord));\
        coord = coord * size + center;\
    ');

    simpleShader.call(this, gl.kaleidoscope, {
        size: size,
        angle: angle,
        center: [centerX, centerY],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/matrixwarp.js
/**
 * @filter                Matrix Warp
 * @description           Transforms an image by a 2x2 or 3x3 matrix. The coordinates used in
 *                        the transformation are (x, y) for a 2x2 matrix or (x, y, 1) for a
 *                        3x3 matrix, where x and y are in units of pixels.
 * @param matrix          A 2x2 or 3x3 matrix represented as either a list or a list of lists.
 *                        For example, the 3x3 matrix [[2,0,0],[0,3,0],[0,0,1]] can also be
 *                        represented as [2,0,0,0,3,0,0,0,1] or just [2,0,0,3].
 * @param inverse         A boolean value that, when true, applies the inverse transformation
 *                        instead. (optional, defaults to false)
 * @param useTextureSpace A boolean value that, when true, uses texture-space coordinates
 *                        instead of screen-space coordinates. Texture-space coordinates range
 *                        from -1 to 1 instead of 0 to width - 1 or height - 1, and are easier
 *                        to use for simple operations like flipping and rotating.
 */
function matrixWarp(matrix, inverse, useTextureSpace) {
    gl.matrixWarp = gl.matrixWarp || warpShader('\
        uniform mat3 matrix;\
        uniform float useTextureSpace;\
    ', '\
        if (useTextureSpace > 0.5) coord = coord / texSize * 2.0 - 1.0;\
        vec3 warp = matrix * vec3(coord, 1.0);\
        coord = warp.xy / warp.z;\
        if (useTextureSpace > 0.5) coord = (coord * 0.5 + 0.5) * texSize;\
    ');

    // Flatten all members of matrix into one big list
    matrix = Array.prototype.concat.apply([], matrix);

    // Extract a 3x3 matrix out of the arguments
    if (matrix.length == 4) {
        matrix = [
            matrix[0], matrix[1], 0,
            matrix[2], matrix[3], 0,
            0, 0, 1
        ];
    } else if (matrix.length != 9) {
        throw 'can only warp with 2x2 or 3x3 matrix';
    }

    simpleShader.call(this, gl.matrixWarp, {
        matrix: inverse ? getInverse(matrix) : matrix,
        texSize: [this.width, this.height],
        useTextureSpace: useTextureSpace | 0
    });

    return this;
}

// src/filters/warp/mirror.js
/**
 * @filter      Mirror
 * @description Mirrors the image about a line.
 * @param angle The angle of the line of symmetry, in radians.
 */
function mirror(angle) {
    gl.mirror = gl.mirror || warpShader('\
        uniform float angle;\
    ', '\
        coord -= texSize * 0.5;\
        vec2 dir = vec2(cos(angle), sin(angle));\
        float dist = dot(dir, coord);\
        if (dist < 0.0) coord -= dir * dist * 2.0;\
        coord += texSize * 0.5;\
    ');

    simpleShader.call(this, gl.mirror, {
        angle: angle,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/mirrortube.js
/**
 * @filter        Mirror Tube
 * @description   Mirrors everything around a circle back inside the circle.
 * @param centerX The x coordinate of the center of the circle.
 * @param centerY The y coordinate of the center of the circle.
 * @param radius  The radius of the circle.
 */
function mirrorTube(centerX, centerY, radius) {
    gl.mirrorTube = gl.mirrorTube || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float radius;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 coord = texCoord * texSize - center;\
            float t = length(coord) / radius;\
            coord *= smoothstep(0.0, t, 1.0 / t);\
            gl_FragColor = texture2D(texture, (coord + center) / texSize);\
        }\
    ');

    simpleShader.call(this, gl.mirrorTube, {
        center: [centerX, centerY],
        radius: radius,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/perspective.js
/**
 * @filter       Perspective
 * @description  Warps one quadrangle to another with a perspective transform. This can be used to
 *               make a 2D image look 3D or to recover a 2D image captured in a 3D environment.
 * @param before The x and y coordinates of four points before the transform in a flat list. This
 *               would look like [ax, ay, bx, by, cx, cy, dx, dy] for four points (ax, ay), (bx, by),
 *               (cx, cy), and (dx, dy).
 * @param after  The x and y coordinates of four points after the transform in a flat list, just
 *               like the other argument.
 */
function perspective(before, after) {
    var a = getSquareToQuad.apply(null, after);
    var b = getSquareToQuad.apply(null, before);
    var c = multiply(getInverse(a), b);
    return this.matrixWarp(c);
}

// src/filters/warp/swirl.js
/**
 * @filter        Swirl
 * @description   Warps a circular region of the image in a swirl.
 * @param centerX The x coordinate of the center of the circular region.
 * @param centerY The y coordinate of the center of the circular region.
 * @param radius  The radius of the circular region.
 * @param angle   The angle in radians that the pixels in the center of
 *                the circular region will be rotated by.
 */
function swirl(centerX, centerY, radius, angle) {
    gl.swirl = gl.swirl || warpShader('\
        uniform float radius;\
        uniform float angle;\
        uniform vec2 center;\
    ', '\
        coord -= center;\
        float distance = length(coord);\
        if (distance < radius) {\
            float percent = (radius - distance) / radius;\
            float theta = percent * percent * angle;\
            float s = sin(theta);\
            float c = cos(theta);\
            coord = vec2(\
                coord.x * c - coord.y * s,\
                coord.x * s + coord.y * c\
            );\
        }\
        coord += center;\
    ');

    simpleShader.call(this, gl.swirl, {
        radius: radius,
        center: [centerX, centerY],
        angle: angle,
        texSize: [this.width, this.height]
    });

    return this;
}

return exports;
})();

define("libs/webgl/glfx.min", function(){});

(function() {

  define('mylibs/preview/preview',['jQuery', 'Kendo', 'mylibs/utils/utils', 'libs/webgl/effects', 'libs/webgl/glfx.min'], function($, kendo, utils, effects) {
    var $container, canvas, draw, frame, height, paused, preview, pub, update, video, webgl, width;
    $container = {};
    canvas = {};
    webgl = {};
    video = {};
    paused = true;
    preview = {};
    width = 460;
    height = 340;
    frame = 0;
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    update = function() {
      var canvas2d;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        frame = frame === 200 ? 0 : ++frame;
        return preview.filter(preview.canvas, canvas, frame);
      }
    };
    return pub = {
      init: function(container, v) {
        var $footer, $header, $preview;
        $container = $("#" + container);
        $header = $container.find(".header");
        $preview = $container.find(".body");
        $footer = $container.find(".footer");
        video = v;
        canvas = document.createElement("canvas");
        webgl = fx.canvas();
        $preview.append(webgl);
        $.subscribe("/preview/show", function(e) {
          $.extend(preview, e);
          preview.canvas = webgl;
          paused = false;
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

define('text!mylibs/preview/views/preview.html',[],function () { return '<a href="#" class="preview">\n    # var canvas = fx.canvas(); # \n</a>\n\n\n<!--\npreview = {}\n                    $.extend(preview, value)\n\n                    preview.name = key\n                    preview.type = value.type\n\n                    preview.canvas = fx.canvas()\n\n                    preview.paramsArray = []\n                \n                    for effect, effectValue of value.params\n                        preview.paramsArray.push(effectValue)\n                                \n                    previews.push(preview)\n                \n                    $a = $("<a href=\'#\' class=\'preview\'></a>").append(preview.canvas).click(->\n                        paused = true\n                        $("footer").kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 200 })\n                        $container.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500 })\n                        $.publish("/preview/show", [preview])\n                    )\n                \n                    $container.append($a)\n\n                    -->';});

(function() {

  define('mylibs/preview/selectPreview',['jQuery', 'Kendo', 'libs/webgl/effects', 'mylibs/utils/utils', 'text!mylibs/preview/views/preview.html'], function($, kendo, effects, utils, template) {
    var $container, canvas, draw, frame, paused, previews, pub, update, video, webgl;
    paused = false;
    canvas = {};
    video = {};
    previews = [];
    $container = {};
    webgl = fx.canvas();
    frame = 0;
    update = function() {
      var canvas2d, preview, _i, _len, _results;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        _results = [];
        for (_i = 0, _len = previews.length; _i < _len; _i++) {
          preview = previews[_i];
          if (frame === 200) {
            frame = 0;
          } else {
            frame = frame + 1;
          }
          _results.push(preview.filter(preview.canvas, canvas, frame));
        }
        return _results;
      }
    };
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    return pub = {
      draw: function() {
        return draw();
      },
      init: function(container, c, v) {
        var $currentPage, $nextPage, ds;
        $.subscribe("/previews/show", function() {
          video.width = canvas.width = 200;
          video.height = canvas.height = 150;
          return $container.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
              return paused = false;
            }
          });
        });
        previews = [];
        canvas = document.createElement("canvas");
        video = v;
        $container = $("#" + container);
        video.width = canvas.width = 200;
        video.height = canvas.height = 150;
        $currentPage = {};
        $nextPage = {};
        ds = new kendo.data.DataSource({
          data: effects,
          pageSize: 6,
          change: function() {
            var item, _i, _len, _ref, _results;
            $currentPage = $container.find(".current-page");
            $nextPage = $container.find(".next-page");
            paused = true;
            previews = [];
            _ref = this.view();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results.push((function() {
                var $a, preview;
                preview = {};
                $.extend(preview, item);
                preview.name = item.name;
                preview.canvas = fx.canvas();
                previews.push(preview);
                $a = $("<a href='#' class='preview'></a>").append(preview.canvas).click(function() {
                  paused = true;
                  $("footer").kendoStop(true).kendoAnimate({
                    effects: "fadeOut",
                    hide: true,
                    duration: 200
                  });
                  $container.kendoStop(true).kendoAnimate({
                    effects: "zoomOut fadeOut",
                    hide: true,
                    duration: 500
                  });
                  return $.publish("/preview/show", [preview]);
                });
                $nextPage.append($a);
                $currentPage.kendoStop(true).kendoAnimate({
                  effects: "slide:down fadeOut",
                  duration: 500,
                  hide: true,
                  complete: function() {
                    $currentPage.removeClass("current-page").addClass("next-page");
                    return $currentPage.find("a").remove();
                  }
                });
                return $nextPage.kendoStop(true).kendoAnimate({
                  effects: "fadeIn",
                  duration: 500,
                  show: true,
                  complete: function() {
                    $nextPage.removeClass("next-page").addClass("current-page");
                    return paused = false;
                  }
                });
              })());
            }
            return _results;
          }
        });
        $container.on("click", ".more", function() {
          paused = true;
          if (ds.page() < ds.totalPages()) {
            return ds.page(ds.page() + 1);
          } else {
            return ds.page(1);
          }
        });
        return ds.read();
      },
      pause: function() {
        return paused = true;
      },
      resume: function() {
        return paused = false;
      },
      capture: function(callback) {
        return webgl.ToDataURL;
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/camera/camera',['jQuery', 'Kendo', 'mylibs/camera/normalize', 'mylibs/preview/selectPreview', 'mylibs/preview/preview'], function($, kendo, normalize, selectPreview, preview) {
    var $counter, countdown, paused, pub, setup, turnOn, utils;
    $counter = {};
    utils = {};
    paused = false;
    setup = function(callback) {
      var videoDiv;
      videoDiv = document.createElement('div');
      document.body.appendChild(videoDiv);
      videoDiv.appendChild(pub.video);
      videoDiv.setAttribute("style", "display:none;");
      pub.video.play();
      pub.video.width = 200;
      pub.video.height = 150;
      if (callback) return callback();
    };
    turnOn = function(callback, testing) {
      var errback, hollaback;
      if (testing) {
        pub.video.src = "burke.mp4";
        pub.video.loop = "loop";
        return setup(callback);
      } else {
        hollaback = function(stream) {
          var e;
          e = window.URL || window.webkitURL;
          pub.video.src = e ? e.createObjectURL(stream) : stream;
          $(pub.video).attr("src", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
          $(pub.video).attr("prop", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
          return setup(callback);
        };
        errback = function() {
          return console.log("Your thing is not a thing.");
        };
        if (navigator.getUserMedia) {
          return navigator.getUserMedia(normalize({
            video: true,
            audio: false
          }), hollaback, errback);
        } else {
          return $.publish("/camera/unsupported");
        }
      }
    };
    countdown = function(num, hollaback) {
      var counters, index;
      counters = $counter.find("span");
      index = counters.length - num;
      return $(counters[index]).css("opacity", "1").animate({
        opacity: .1
      }, 1000, function() {
        if (num > 1) {
          num--;
          return countdown(num, hollaback);
        } else {
          return hollaback();
        }
      });
    };
    return pub = {
      init: function(utilities, counter, callback) {
        utils = utilities;
        $counter = $("#" + counter);
        pub.video = document.createElement("video");
        pub.video.src = "burke.mp4";
        turnOn(callback, false);
        return $.subscribe("/camera/countdown", function(num, hollaback) {
          return countdown(num, hollaback);
        });
      },
      video: {}
    };
  });

}).call(this);

(function() {

  define('app',['jQuery', 'Kendo', 'mylibs/camera/camera', 'mylibs/snapshot/snapshot', 'mylibs/photobooth/photobooth', 'mylibs/controls/controls', 'mylibs/customize/customize', 'mylibs/effects/effects', 'mylibs/utils/utils', 'mylibs/file/file', 'mylibs/share/share', 'text!intro.html', 'mylibs/pictures/pictures', 'mylibs/preview/preview', 'mylibs/preview/selectPreview'], function($, kendo, camera, snapshot, photobooth, controls, customize, effects, utils, file, share, intro, pictures, preview, selectPreview) {
    var pub;
    return pub = {
      init: function() {
        utils.init();
        $.subscribe('/camera/unsupported', function() {
          return $('#pictures').append(intro);
        });
        return camera.init(utils, "countdown", function() {
          var $canvas;
          pictures.init("pictures");
          preview.init("camera", camera.video);
          selectPreview.init("previews", camera.canvas, camera.video);
          selectPreview.draw();
          snapshot.init(preview, "pictures");
          $canvas = $('#screen');
          photobooth.init(460, 340);
          controls.init("controls");
          customize.init("customize");
          effects.init();
          return file.init(50000);
        });
      }
    };
  });

}).call(this);

/*
 RequireJS order 1.0.5 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){function k(a){var b=a.currentTarget||a.srcElement,c;if(a.type==="load"||l.test(b.readyState)){a=b.getAttribute("data-requiremodule");j[a]=!0;for(a=0;c=g[a];a++)if(j[c.name])c.req([c.name],c.onLoad);else break;a>0&&g.splice(0,a);setTimeout(function(){b.parentNode.removeChild(b)},15)}}function m(a){var b,c;a.setAttribute("data-orderloaded","loaded");for(a=0;c=h[a];a++)if((b=i[c])&&b.getAttribute("data-orderloaded")==="loaded")delete i[c],require.addScriptToDom(b);else break;a>0&&h.splice(0,
a)}var f=typeof document!=="undefined"&&typeof window!=="undefined"&&document.createElement("script"),n=f&&(f.async||window.opera&&Object.prototype.toString.call(window.opera)==="[object Opera]"||"MozAppearance"in document.documentElement.style),o=f&&f.readyState==="uninitialized",l=/^(complete|loaded)$/,g=[],j={},i={},h=[],f=null;define('order',{version:"1.0.5",load:function(a,b,c,e){var d;b.nameToUrl?(d=b.nameToUrl(a,null),require.s.skipAsync[d]=!0,n||e.isBuild?b([a],c):o?(e=require.s.contexts._,!e.urlFetched[d]&&
!e.loaded[a]&&(e.urlFetched[d]=!0,require.resourcesReady(!1),e.scriptCount+=1,d=require.attach(d,e,a,null,null,m),i[a]=d,h.push(a)),b([a],c)):b.specified(a)?b([a],c):(g.push({name:a,req:b,onLoad:c}),require.attach(d,null,a,k,"script/cache"))):b([a],c)}})})();

/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
define("libs/jquery/jquery.min", function(){});

/*
* Kendo UI Complete v2012.1.515 (http://kendoui.com)
* Copyright 2012 Telerik AD. All rights reserved.
*
* Kendo UI Complete commercial licenses may be obtained at http://kendoui.com/complete-license
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function(a,b){function bj(d,e){var f={},g,h;for(g in e)h=bi(d,g),h!==b&&(be.test(g)&&(h=c.template(a("#"+h).html())),f[g]=h);return f}function bi(d,e){var f;e.indexOf("data")===0&&(e=e.substring(4),e=e.charAt(0).toLowerCase()+e.substring(1)),e=e.replace(bh,"-$1"),f=d.getAttribute("data-"+c.ns+e),f===null?f=b:f==="null"?f=null:f==="true"?f=!0:f==="false"?f=!1:isNaN(parseFloat(f))?bf.test(f)&&!bg.test(f)&&(f=a.parseJSON(f)):f=parseFloat(f);return f}function $(a){return(""+a).replace(X,"&amp;").replace(Y,"&lt;").replace(Z,"&gt;")}function W(a,b,c,d){b&&(b=b.split(" "),e(b,function(b,c){a.toggleClass(c,d)}));return a}function V(a,b,c,d,e,f){return S.transitionPromise(a,b,T(c,d,e,f))}function U(b,c,d,e,f){b.each(function(b,g){g=a(g),g.queue(function(){S.promise(g,T(c,d,e,f))})});return b}function T(a,b,c,e){typeof a===q&&(i(b)&&(e=b,b=400,c=!1),i(c)&&(e=c,c=!1),typeof b===u&&(c=b,b=400),a={effects:a,duration:b,reverse:c,complete:e});return d({effects:{},duration:400,reverse:!1,init:h,teardown:h,hide:!1,show:!1},a,{completeCallback:a.complete,complete:h})}function R(a){var b={};e(typeof a=="string"?a.split(" "):a,function(a){b[a]=this});return b}function P(a,b){b||(b="offset");var c=a[b](),d=m.mobileOS;if(m.touch&&d.ios&&d.flatVersion<410){var e=b=="offset"?c:a.offset(),f=c.left==e.left&&c.top==e.top;if(f)return{top:c.top-window.scrollY,left:c.left-window.scrollX}}return c}function O(b){return a.trim(a(b).contents().filter(function(){return this.nodeType!=8}).html())===""}function N(a){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}function M(a,b){var c,d,e,f;for(c in b)d=b[c],e=typeof d,e===s&&d!==null&&d.constructor!==Array?(f=a[c],typeof f===s?a[c]=f||{}:a[c]={},M(a[c],d)):e!==v&&(a[c]=d);return a}function L(a){var b=1,c=arguments.length;for(b=1;b<c;b++)M(a,arguments[b]);return a}function K(b){var d=a.browser;if(!b.parent().hasClass("k-animation-container")){var e=b.css(c.support.transitions.css+"box-shadow")||b.css("box-shadow"),f=e?e.match(o)||[0,0,0,0,0]:[0,0,0,0,0],g=j.max(+f[3],+(f[4]||0)),h=-f[1]+g,i=+f[1]+g,k=+f[2]+g;d.opera&&(h=i=k=5),b.wrap(a("<div/>").addClass("k-animation-container").css({width:b.outerWidth(),height:b.outerHeight(),marginLeft:-h,paddingLeft:h,paddingRight:i,paddingBottom:k}))}else{var l=b.parent(".k-animation-container");l.is(":hidden")&&l.show(),l.css({width:b.outerWidth(),height:b.outerHeight()})}d.msie&&j.floor(d.version)<=7&&b.css({zoom:1});return b.parent()}function J(a){return a<10?"0"+a:a}function C(a,b){if(b)return"'"+a.split("'").join("\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")+"'";var c=a.charAt(0),d=a.substring(1);return c==="="?"+("+d+")+":c===":"?"+e("+d+")+":";"+a+";o+="}function A(){}var c=window.kendo=window.kendo||{},d=a.extend,e=a.each,f=a.proxy,g=a.isArray,h=a.noop,i=a.isFunction,j=Math,k,l=window.JSON||{},m={},n=/\{(\d+)(:[^\}]+)?\}/g,o=/(\d+?)px\s*(\d+?)px\s*(\d+?)px\s*(\d+?)?/i,p="function",q="string",r="number",s="object",t="null",u="boolean",v="undefined",w={},x={},y=[].slice,z=window.Globalize;A.extend=function(a){var b=function(){},c,e=this,f=a&&a.init?a.init:function(){e.apply(this,arguments)},g;b.prototype=e.prototype,g=f.fn=f.prototype=new b;for(c in a)typeof a[c]!==s||a[c]instanceof Array||a[c]===null?g[c]=a[c]:g[c]=d(!0,{},b.prototype[c],a[c]);g.constructor=f,f.extend=e.extend;return f};var B=A.extend({init:function(){this._events={}},bind:function(a,b,c){var d=this,e,f=typeof a===q?[a]:a,g,h,i,j=typeof b===p,k;for(e=0,g=f.length;e<g;e++)a=f[e],i=j?b:b[a],i&&(c&&(h=i,i=function(){d.unbind(a,i),h.apply(d,arguments)}),k=d._events[a]=d._events[a]||[],k.push(i));return d},one:function(a,b){return this.bind(a,b,!0)},first:function(a,b){var c=this,d,e=typeof a===q?[a]:a,f,g,h=typeof b===p,i;for(d=0,f=e.length;d<f;d++)a=e[d],g=h?b:b[a],g&&(i=c._events[a]=c._events[a]||[],i.unshift(g));return c},trigger:function(a,b){var c=this,d=c._events[a],e,f=!1;if(d){b=b||{},b.sender=c,b.preventDefault=function(){f=!0},b.isDefaultPrevented=function(){return f};for(e=0;e<d.length;e++)d[e].call(c,b)}return f},unbind:function(a,b){var c=this,d=c._events[a],e,f;if(d)if(b)for(e=0,f=d.length;e<f;e++)d[e]===b&&d.splice(e,1);else c._events[a]=[];return c}}),D=/^\w+/,E=/\$\{([^}]*)\}/g,F=/\\\}/g,G=/__CURLY__/g,H=/\\#/g,I=/__SHARP__/g;k={paramName:"data",useWithBlock:!0,render:function(a,b){var c,d,e="";for(c=0,d=b.length;c<d;c++)e+=a(b[c]);return e},compile:function(b,e){var f=d({},this,e),g=f.paramName,h=g.match(D)[0],j=f.useWithBlock,k="var o,e=kendo.htmlEncode;",l,m;if(i(b)){if(b.length===2)return function(c){return b(a,{data:c}).join("")};return b}k+=j?"with("+g+"){":"",k+="o=",l=b.replace(F,"__CURLY__").replace(E,"#=e($1)#").replace(G,"}").replace(H,"__SHARP__").split("#");for(m=0;m<l.length;m++)k+=C(l[m],m%2===0);k+=j?";}":";",k+="return o;",k=k.replace(I,"#");try{return new Function(h,k)}catch(n){throw new Error(c.format("Invalid template:'{0}' Generated code:'{1}'",b,k))}}},function(){function h(a,d){var i,j,k,l,m=b,n,o=d[a],v;o&&typeof o===s&&typeof o.toJSON===p&&(o=o.toJSON(a)),typeof e===p&&(o=e.call(d,a,o)),v=typeof o;if(v===q)return g(o);if(v===r)return isFinite(o)?String(o):t;if(v===u||v===t)return String(o);if(v===s){if(!o)return t;b+=c,n=[];if(f.apply(o)==="[object Array]"){l=o.length;for(i=0;i<l;i++)n[i]=h(i,o)||t;k=n.length===0?"[]":b?"[\n"+b+n.join(",\n"+b)+"\n"+m+"]":"["+n.join(",")+"]",b=m;return k}if(e&&typeof e===s){l=e.length;for(i=0;i<l;i++)typeof e[i]===q&&(j=e[i],k=h(j,o),k&&n.push(g(j)+(b?": ":":")+k))}else for(j in o)Object.hasOwnProperty.call(o,j)&&(k=h(j,o),k&&n.push(g(j)+(b?": ":":")+k));k=n.length===0?"{}":b?"{\n"+b+n.join(",\n"+b)+"\n"+m+"}":"{"+n.join(",")+"}",b=m;return k}}function g(b){a.lastIndex=0;return a.test(b)?'"'+b.replace(a,function(a){var b=d[a];return typeof b===q?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+b+'"'}var a=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,b,c,d={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},e,f={}.toString;typeof Date.prototype.toJSON!==p&&(Date.prototype.toJSON=function(a){var b=this;return isFinite(b.valueOf())?b.getUTCFullYear()+"-"+J(b.getUTCMonth()+1)+"-"+J(b.getUTCDate())+"T"+J(b.getUTCHours())+":"+J(b.getUTCMinutes())+":"+J(b.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()}),typeof l.stringify!==p&&(l.stringify=function(a,d,f){var g;b="",c="";if(typeof f===r)for(g=0;g<f;g+=1)c+=" ";else typeof f===q&&(c=f);e=d;if(d&&typeof d!==p&&(typeof d!==s||typeof d.length!==r))throw new Error("JSON.stringify");return h("",{"":a})})}(),function(){function s(a,f){var j=c.cultures.current,n=j.numberFormat,p=n.groupSize[0],q=n[k],r=n[i],s=n.decimals,t=n.pattern[0],u=[],v,w,x,y,z,A=a<0,B,C,D,E,F=h,G=h,H,I,J,K,L,M,N,O,P=-1,Q;if(a===b)return h;if(!isFinite(a))return a;if(!f)return j.name.length?a.toLocaleString():a.toString();z=d.exec(f);if(z){f=z[1].toLowerCase(),w=f==="c",x=f==="p";if(w||x)n=w?n.currency:n.percent,p=n.groupSize[0],q=n[k],r=n[i],s=n.decimals,v=n.symbol,t=n.pattern[A?0:1];y=z[2],y&&(s=+y);if(f==="e")return y?a.toExponential(s):a.toExponential();x&&(a*=100),a=a.toFixed(s),a=a.split(i),B=a[0],C=a[1],A&&(B=B.substring(1)),G=B,D=B.length;if(D>=p){G=h;for(H=0;H<D;H++)H>0&&(D-H)%p===0&&(G+=q),G+=B.charAt(H)}C&&(G+=r+C);if(f==="n"&&!A)return G;a=h;for(H=0,I=t.length;H<I;H++)J=t.charAt(H),J==="n"?a+=G:J==="$"||J==="%"?a+=v:a+=J;return a}f=f.split(";");if(A&&f[1])a=-a,f=f[1];else if(a===0){f=f[2]||f[0];if(f.indexOf(l)==-1&&f.indexOf(m)==-1)return f}else f=f[0];if(f.indexOf("'")>-1||f.indexOf('"')>-1)f=f.replace(e,function(a){u.push(a);return o});w=f.indexOf("$")!=-1,x=f.indexOf("%")!=-1,x&&(a*=100);if(w||x)n=w?n.currency:n.percent,p=n.groupSize[0],q=n[k],r=n[i],s=n.decimals,v=n.symbol;K=f.indexOf(k)>-1,K&&(f=f.replace(g,h)),L=f.indexOf(i),I=f.length,L!=-1?(N=f.lastIndexOf(m),M=f.lastIndexOf(l),C=a.toString().split(i)[1]||h,M>N&&C.length>M-N?H=M:N!=-1&&N>=L&&(H=N),H&&(a=a.toFixed(H-L))):a=a.toFixed(0),M=f.indexOf(l),O=N=f.indexOf(m),M==-1&&N!=-1?P=N:M!=-1&&N==-1?P=M:P=M>N?N:M,M=f.lastIndexOf(l),N=f.lastIndexOf(m),M==-1&&N!=-1?Q=N:M!=-1&&N==-1?Q=M:Q=M>N?M:N,P==I&&(Q=P);if(P!=-1){G=a.toString().split(i),B=G[0],C=G[1]||h,D=B.length,E=C.length;if(K)if(D===p&&D<L-O)B=q+B;else if(D>p){G=h;for(H=0;H<D;H++)H>0&&(D-H)%p===0&&(G+=q),G+=B.charAt(H);B=G}a=f.substring(0,P);for(H=P;H<I;H++){J=f.charAt(H);if(L==-1){if(Q-H<D){a+=B;break}}else{N!=-1&&N<H&&(F=h),L-H<=D&&L-H>-1&&(a+=B,H=L);if(L===H){a+=(C?r:h)+C,H+=Q-L+1;continue}}J===m?(a+=J,F=J):J===l&&(a+=F)}Q>=P&&(a+=f.substring(Q+1));if(w||x){G=h;for(H=0,I=a.length;H<I;H++)J=a.charAt(H),G+=J==="$"||J==="%"?v:J;a=G}if(u[0]){I=u.length;for(H=0;H<I;H++)a=a.replace(o,u[H])}}return a}function q(d,e){var f=c.cultures.current.calendar,g=f.days,h=f.months;e=f.patterns[e]||e;return e.replace(a,function(a){var c;a==="d"?c=d.getDate():a==="dd"?c=J(d.getDate()):a==="ddd"?c=g.namesAbbr[d.getDay()]:a==="dddd"?c=g.names[d.getDay()]:a==="M"?c=d.getMonth()+1:a==="MM"?c=J(d.getMonth()+1):a==="MMM"?c=h.namesAbbr[d.getMonth()]:a==="MMMM"?c=h.names[d.getMonth()]:a==="yy"?c=J(d.getFullYear()%100):a==="yyyy"?c=d.getFullYear():a==="h"?c=d.getHours()%12||12:a==="hh"?c=J(d.getHours()%12||12):a==="H"?c=d.getHours():a==="HH"?c=J(d.getHours()):a==="m"?c=d.getMinutes():a==="mm"?c=J(d.getMinutes()):a==="s"?c=d.getSeconds():a==="ss"?c=J(d.getSeconds()):a==="f"?c=j.floor(d.getMilliseconds()/100):a==="ff"?c=j.floor(d.getMilliseconds()/10):a==="fff"?c=d.getMilliseconds():a==="tt"&&(c=d.getHours()<12?f.AM[0]:f.PM[0]);return c!==b?c:a.slice(1,a.length-1)})}var a=/dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|"[^"]*"|'[^']*'/g,d=/^(n|c|p|e)(\d*)$/i,e=/["'].*?["']/g,g=/\,/g,h="",i=".",k=",",l="#",m="0",o="??",p="en-US";c.cultures={"en-US":{name:p,numberFormat:{pattern:["-n"],decimals:2,",":",",".":".",groupSize:[3],percent:{pattern:["-n %","n %"],decimals:2,",":",",".":".",groupSize:[3],symbol:"%"},currency:{pattern:["($n)","$n"],decimals:2,",":",",".":".",groupSize:[3],symbol:"$"}},calendars:{standard:{days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December"],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},AM:["AM","am","AM"],PM:["PM","pm","PM"],patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",F:"dddd, MMMM dd, yyyy h:mm:ss tt",g:"M/d/yyyy h:mm tt",G:"M/d/yyyy h:mm:ss tt",m:"MMMM dd",M:"MMMM dd",s:"yyyy'-'MM'-'ddTHH':'mm':'ss",t:"h:mm tt",T:"h:mm:ss tt",u:"yyyy'-'MM'-'dd HH':'mm':'ss'Z'",y:"MMMM, yyyy",Y:"MMMM, yyyy"},"/":"/",":":":",firstDay:0}}}},c.culture=function(a){if(a===b)return c.cultures.current;var d=c.cultures,e=d[a]||d[p];e.calendar=e.calendars.standard,d.current=e},c.culture(p);var t=function(a,c){if(c){if(a instanceof Date)return q(a,c);if(typeof a===r)return s(a,c)}return a!==b?a:""};z&&(t=f(z.format,z)),c.format=function(a){var b=arguments;return a.replace(n,function(a,c,d){var e=b[parseInt(c,10)+1];return t(e,d?d.substring(1):"")})},c.toString=t}(),function(){function h(a,b,c){if(!a)return null;var d=function(a){var c=0;while(b[q]===a)c++,q++;c>0&&(q-=1);return c},f=function(b){var c=new RegExp("^\\d{1,"+b+"}"),d=a.substr(r,b).match(c);if(d){d=d[0],r+=d.length;return parseInt(d,10)}return null},g=function(b){var c=0,d=b.length,e,f;for(;c<d;c++){e=b[c],f=e.length;if(a.substr(r,f)==e){r+=f;return c+1}}return null},h=function(){a.charAt(r)==b[q]&&r++},i=c.calendar,j=null,k=null,l=null,m=null,n=null,o=null,p=null,q=0,r=0,s=!1,t=new Date,u=t.getFullYear(),v=30,w,x,y,z,A;b||(b="d"),A=i.patterns[b],A&&(b=A),b=b.split(""),z=b.length;for(;q<z;q++){w=b[q];if(s)w==="'"?s=!1:h();else if(w==="d"){x=d("d"),l=x<3?f(2):g(i.days[x==3?"namesAbbr":"names"]);if(l===null||e(l,1,31))return null}else if(w==="M"){x=d("M"),k=x<3?f(2):g(i.months[x==3?"namesAbbr":"names"]);if(k===null||e(k,1,12))return null;k-=1}else if(w==="y")x=d("y"),j=f(x<3?2:4),j===null&&(j=u),j<v&&(j=u-u%100+j);else if(w==="h"){d("h"),m=f(2),m==12&&(m=0);if(m===null||e(m,0,11))return null}else if(w==="H"){d("H"),m=f(2);if(m===null||e(m,0,23))return null}else if(w==="m"){d("m"),n=f(2);if(n===null||e(n,0,59))return null}else if(w==="s"){d("s"),o=f(2);if(o===null||e(o,0,59))return null}else if(w==="f"){x=d("f"),p=f(x);if(p===null||e(p,0,999))return null}else w==="t"?(x=d("t"),y=g(i.PM)):w==="'"?(h(),s=!0):h()}y&&m<12&&(m+=12),l===null&&(l=1);return new Date(j,k,l,m,n,o,p)}function e(a,b,c){return!(a>=b&&a<=c)}var a=/\u00A0/g,b=/[eE][\-+]?[0-9]+/,d=["G","g","d","F","D","y","m","T","t"];c.parseDate=function(a,b,e){if(a instanceof Date)return a;var f=0,i=null,j,k;e?typeof e===q&&(c.culture(e),e=c.culture()):e=c.culture();if(!b){b=[],k=e.calendar.patterns,j=d.length;for(;f<j;f++)b[f]=k[d[f]];b[f]="ddd MMM dd yyyy HH:mm:ss",f=0}b=g(b)?b:[b],j=b.length;for(;f<j;f++){i=h(a,b[f],e);if(i)return i}return i},c.parseInt=function(a,b){var d=c.parseFloat(a,b);d&&(d=d|0);return d},c.parseFloat=function(d,e){if(!d&&d!==0)return null;if(typeof d===r)return d;d=d.toString(),e=c.cultures[e]||c.cultures.current;var f=e.numberFormat,g=f.percent,h=f.currency,i=h.symbol,j=g.symbol,k=d.indexOf("-")>-1,l,m;if(b.test(d)){d=parseFloat(d),isNaN(d)&&(d=null);return d}d.indexOf(i)>-1?(f=h,l=f.pattern[0].replace("$",i).split("n"),d.indexOf(l[0])>-1&&d.indexOf(l[1])>-1&&(d=d.replace(l[0],"").replace(l[1],""),k=!0)):d.indexOf(j)>-1&&(m=!0,f=g,i=j),d=d.replace("-","").replace(i,"").replace(a," ").split(f[","].replace(a," ")).join("").replace(f["."],"."),d=parseFloat(d),isNaN(d)?d=null:k&&(d*=-1),d&&m&&(d/=100);return d},z&&(c.parseDate=f(z.parseDate,z),c.parseFloat=f(z.parseFloat,z))}(),function(){m.scrollbar=function(){var a=document.createElement("div"),b;a.style.cssText="overflow:scroll;overflow-x:hidden;zoom:1;clear:both",a.innerHTML="&nbsp;",document.body.appendChild(a),b=a.offsetWidth-a.scrollWidth,document.body.removeChild(a);return b};var a=document.createElement("table");try{a.innerHTML="<tr><td></td></tr>",m.tbodyInnerHtml=!0}catch(c){m.tbodyInnerHtml=!1}m.touch="ontouchstart"in window,m.pointers=navigator.msPointerEnabled;var d=m.transitions=!1,f=m.transforms=!1;m.hasHW3D="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix||"MozPerspective"in document.documentElement.style,m.hasNativeScrolling=typeof document.documentElement.style.webkitOverflowScrolling=="string",e(["Moz","webkit","O","ms"],function(){var b=this.toString(),c=typeof a.style[b+"Transition"]===q;if(c||typeof a.style[b+"Transform"]===q){var e=b.toLowerCase();f={css:"-"+e+"-",prefix:b,event:e==="o"||e==="webkit"?e:""},c&&(d=f,d.event=d.event?d.event+"TransitionEnd":"transitionend");return!1}}),m.transforms=f,m.transitions=d,m.detectOS=function(a){var b=!1,c,d=[],e={fire:/(Silk)\/(\d+)\.(\d+(\.\d+)?)/,android:/(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)\.(\d+(\.\d+)?)/,iphone:/(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,ipad:/(iPad).*OS\s+(\d+)[\._]([\d_]+)/,meego:/(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,webos:/(webOS)\/(\d+)\.(\d+(\.\d+)?)/,blackberry:/(BlackBerry).*?Version\/(\d+)\.(\d+(\.\d+)?)/,playbook:/(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,winphone:/(IEMobile)\/(\d+)\.(\d+(\.\d+)?)/,windows:/(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/},f={ios:/^i(phone|pad|pod)$/i,android:/^android|fire$/i,blackberry:/^blackberry|playbook/i,windows:/windows|winphone/},g={omini:/Opera\sMini/i,omobile:/Opera\sMobi/i,firefox:/Firefox|Fennec/i,webkit:/webkit/i,ie:/MSIE|Windows\sPhone/i},h=function(a){for(var b in f)if(f.hasOwnProperty(b)&&f[b].test(a))return b;return a},i=function(a){for(var b in g)if(g.hasOwnProperty(b)&&g[b].test(a))return b;return"default"};for(var j in e)if(e.hasOwnProperty(j)){d=a.match(e[j]);if(d){if(j=="windows"&&"plugins"in navigator)return!1;b={},b.device=j,b.browser=i(a),b.name=h(j),b[b.name]=!0,b.majorVersion=d[2],b.minorVersion=d[3].replace("_","."),c=b.minorVersion.replace(".","").substr(0,2),b.flatVersion=b.majorVersion+c+Array(3-(c.length<3?c.length:2)).join("0"),b.appMode=window.navigator.standalone||/file|local/.test(window.location.protocol)||typeof window.PhoneGap!==v;break}}return b},m.mobileOS=m.detectOS(navigator.userAgent),m.zoomLevel=function(){return m.touch?document.documentElement.clientWidth/window.innerWidth:1},m.devicePixelRatio=window.devicePixelRatio===b?1:window.devicePixelRatio,m.eventCapture=document.documentElement.addEventListener,m.placeholder="placeholder"in document.createElement("input"),m.stableSort=function(){var a=[0,1,2,3,4,5,6,7,8,9,10,11,12].sort(function(){return 0});return a[0]===0&&a[1]===1&&a[2]===2&&a[3]===3&&a[4]===4&&a[5]===5&&a[6]===6&&a[7]===7&&a[8]===8&&a[9]===9&&a[10]===10&&a[11]===11&&a[12]===12}()}();var Q={left:{reverse:"right"},right:{reverse:"left"},down:{reverse:"up"},up:{reverse:"down"},top:{reverse:"bottom"},bottom:{reverse:"top"},"in":{reverse:"out"},out:{reverse:"in"}},S={promise:function(a,b){b.show&&a.css({display:a.data("olddisplay")||"block"}).css("display"),b.hide&&a.data("olddisplay",a.css("display")).hide(),b.init&&b.init(),b.completeCallback&&b.completeCallback(a),a.dequeue()},transitionPromise:function(a,b,d){var e=c.wrap(a);e.append(b),a.hide(),b.show(),d.completeCallback&&d.completeCallback(a);return a}};d(a.fn,{kendoStop:function(a,b){return this.stop(a,b)},kendoAnimate:function(a,b,c,d){return U(this,a,b,c,d)},kendoAnimateTo:function(a,b,c,d,e){return V(this,a,b,c,d,e)}}),d(a.fn,{kendoAddClass:function(a,b){return W(this,a,b,!0)},kendoRemoveClass:function(a,b){return W(this,a,b,!1)},kendoToggleClass:function(a,b,c){return W(this,a,b,c)}});var X=/&/g,Y=/</g,Z=/>/g,_=function(a){return{idx:0,x:a.pageX,y:a.pageY}},ba=function(a){return a.target};m.touch&&(_=function(a,b){var c=a.changedTouches||a.originalEvent.changedTouches;if(b){var d=null;e(c,function(a,c){b==c.identifier&&(d={idx:c.identifier,x:c.pageX,y:c.pageY})});return d}return{idx:c[0].identifier,x:c[0].pageX,y:c[0].pageY}},ba=function(a){var b="originalEvent"in a?a.originalEvent.changedTouches:"changedTouches"in a?a.changedTouches:null;return b?document.elementFromPoint(b[0].clientX,b[0].clientY):null},e(["swipe","swipeLeft","swipeRight","swipeUp","swipeDown","doubleTap","tap"],function(b,c){a.fn[c]=function(a){return this.bind(c,a)}})),m.touch?(m.mousedown="touchstart",m.mouseup="touchend",m.mousemove="touchmove",m.mousecancel="touchcancel"):(m.mousemove="mousemove",m.mousedown="mousedown",m.mouseup="mouseup",m.mousecancel="mouseleave");var bb=function(a){var b="d",c,d,e,f,g=1;for(d=0,e=a.length;d<e;d++)f=a[d],f!==""&&(c=f.indexOf("["),c!==0&&(c==-1?f="."+f:(g++,f="."+f.substring(0,c)+" || {})"+f.substring(c))),g++,b+=f+(d<e-1?" || {})":")"));return Array(g).join("(")+b},bc=/^([a-z]+:)?\/\//i;d(c,{ui:c.ui||{},fx:c.fx||S,data:c.data||{},mobile:c.mobile||{},keys:{INSERT:45,DELETE:46,BACKSPACE:8,TAB:9,ENTER:13,ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,END:35,HOME:36,SPACEBAR:32,PAGEUP:33,PAGEDOWN:34,F10:121,F12:123},support:m,animate:U,ns:"",attr:function(a){return"data-"+c.ns+a},wrap:K,deepExtend:L,size:N,isNodeEmpty:O,getOffset:P,parseEffects:R,toggleClass:W,directions:Q,Observable:B,Class:A,Template:k,template:f(k.compile,k),render:f(k.render,k),stringify:f(l.stringify,l),touchLocation:_,eventTarget:ba,htmlEncode:$,isLocalUrl:function(a){return a&&!bc.test(a)},expr:function(a,b){a=a||"",a&&a.charAt(0)!=="["&&(a="."+a),b?a=bb(a.split(".")):a="d"+a;return a},getter:function(a,b){return w[a]=w[a]||new Function("d","return "+c.expr(a,b))},setter:function(a){return x[a]=x[a]||new Function("d,value","d."+a+"=value")},accessor:function(a){return{get:c.getter(a),set:c.setter(a)}},guid:function(){var a="",b,c;for(b=0;b<32;b++){c=j.random()*16|0;if(b==8||b==12||b==16||b==20)a+="-";a+=(b==12?4:b==16?c&3|8:c).toString(16)}return a},roleSelector:function(a){return a.replace(/(\S+)/g,"["+c.attr("role")+"=$1],").slice(0,-1)},logToConsole:function(a){var b=window.console;typeof b!="undefined"&&b.log&&b.log(a)}});var bd=B.extend({init:function(b,e){var f=this;f.element=a(b),B.fn.init.call(f),f.options=d(!0,{},f.options,e),f.element.attr(c.attr("role"))||f.element.attr(c.attr("role"),(f.options.name||"").toLowerCase()),f.element.data("kendo"+f.options.prefix+f.options.name,f),f.bind(f.events,f.options)},events:[],options:{prefix:""},setOptions:function(b){a.extend(this.options,b),this.bind(this.events,b)}});c.notify=h;var be=/template$/i,bf=/^(?:\{(?:.|\n)*\}|\[(?:.|\n)*\])$/,bg=/^\{(\d+)(:[^\}]+)?\}/,bh=/([A-Z])/g;c.initWidget=function(d,e,f){var g,h,i,j,k,l,m,n;d=d.nodeType?d:d[0],l=d.getAttribute("data-"+c.ns+"role");if(!!l){n=bi(d,"dataSource"),i=(f||c.ui).roles[l];if(!i)return;e=a.extend({},bj(d,i.fn.options),e),n&&(typeof n===q?e.dataSource=c.getter(n)(window):e.dataSource=n);for(j=0,k=i.fn.events.length;j<k;j++)h=i.fn.events[j],m=bi(d,h),m!==b&&(e[h]=c.getter(m)(window));g=a(d).data("kendo"+i.fn.options.name),g?g.setOptions(e):g=new i(d,e);return g}},c.init=function(b,d){a(b).find("[data-"+c.ns+"role]").andSelf().each(function(){c.initWidget(this,{},d)})},c.parseOptions=bj,d(c.ui,{Widget:bd,roles:{},progress:function(b,c){var d=b.find(".k-loading-mask");c?d.length||(d=a("<div class='k-loading-mask'><span class='k-loading-text'>Loading...</span><div class='k-loading-image'/><div class='k-loading-color'/></div>").width("100%").height("100%").prependTo(b).css({top:b.scrollTop(),left:b.scrollLeft()})):d&&d.remove()},plugin:function(d,e,f){var g=d.fn.options.name;e=e||c.ui,f=f||"",e[g]=d,e.roles[g.toLowerCase()]=d,g="kendo"+f+g,a.fn[g]=function(e){var f=this,h;typeof e===q?(h=y.call(arguments,1),this.each(function(){var d=a.data(this,g),i,j;if(!d)throw new Error(c.format("Cannot call method '{0}' of {1} before it is initialized",e,g));i=d[e];if(typeof i!==p)throw new Error(c.format("Cannot find method '{0}' of {1}",e,g));j=i.apply(d,h);if(j!==b){f=j;return!1}})):this.each(function(){new d(this,e)});return f}}});var bk=bd.extend({init:function(a,b){bd.fn.init.call(this,a,b),this.wrapper=this.element},options:{prefix:"Mobile"},events:[],viewShow:a.noop,viewInit:a.noop,view:function(){return this.element.closest(c.roleSelector("view")).data("kendoMobileView")}});d(c.mobile,{init:function(a){c.init(a,c.mobile.ui)},ui:{Widget:bk,roles:{},plugin:function(a){c.ui.plugin(a,c.mobile.ui,"Mobile")}}}),c.touchScroller=function(a,b){if(m.touch&&c.mobile.ui.Scroller){a.kendoMobileScroller(b);return a.data("kendoMobileScroller")}return!1},c.preventDefault=function(a){a.preventDefault()},c.widgetInstance=function(a,b){var d=b.roles[a.data(c.ns+"role")];if(d)return a.data("kendo"+d.fn.options.prefix+d.fn.options.name)}})(jQuery),function(a,b){function T(a,b){if(k){var c=a.css(J);if(c=="none")return b=="scale"?1:0;var d=c.match(new RegExp(b+"\\s*\\(([\\d\\w\\.]+)")),e=0;d?e=L(d[1]):(d=c.match(p)||[0,0,0,0],r.test(b)?e=L(d[2]):b.toLowerCase()=="translatey"?e=L(d[3]):b.toLowerCase()=="scale"&&(e=parseFloat(d[1])));return e}return a.css(b)}function S(a){var b=a.object;!a||(b.css(a.setup),b.css(I),b.data(F,setTimeout(function(){R(b),b.dequeue(),a.complete.call(b)},a.duration)),b.css(a.CSS))}function R(a){a.css(I,z),i.safari||a.css(C)}function Q(a){var b=[];for(var c in a)b.push(c);return b}function P(b){var d=b.effects,e;d==="zoom"&&(d="zoomIn fadeIn"),d==="slide"&&(d="slide:left"),d==="fade"&&(d="fadeIn"),d==="overlay"&&(d="slideIn:left"),/^overlay:(.+)$/.test(d)&&(d="slideIn:"+RegExp.$1),e=b.reverse&&/^(slide:)/.test(d),e&&delete b.reverse,b.effects=a.extend(c.parseEffects(d,e),{show:!0});return b}function O(a){a.effects.slideIn=a.effects.slide,delete a.effects.slide;return a}function N(a,b){var c={};if(b){if(document.defaultView&&document.defaultView.getComputedStyle){var d=document.defaultView.getComputedStyle(a,"");e(b,function(a,b){c[b]=d.getPropertyValue(b)})}else if(a.currentStyle){var f=a.currentStyle;e(b,function(a,b){c[b]=f[b.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()})]})}}else c=document.defaultView.getComputedStyle(a,"");return c}function M(a,b){return L(a.css(b))}function L(a){return parseInt(a,10)}var c=window.kendo,d=c.fx,e=a.each,f=a.extend,g=a.proxy,h=c.size,i=a.browser,j=c.support,k=j.transforms,l=j.transitions,m={scale:0,scaleX:0,scaleY:0,scale3d:0},n={translate:0,translateX:0,translateY:0,translate3d:0},o=typeof document.documentElement.style.zoom!="undefined"&&!l,p=/matrix3?d?\s*\(.*,\s*([\d\w\.\-]+),\s*([\d\w\.\-]+),\s*([\d\w\.\-]+)/,q=/^(-?[\d\.\-]+)?[\w\s]*,?\s*(-?[\d\.\-]+)?[\w\s]*/i,r=/translatex?$/i,s=/(zoom|fade|expand)(\w+)/,t=/(zoom|fade|expand)/,u=["perspective","rotate","rotateX","rotateY","rotateZ","rotate3d","scale","scaleX","scaleY","scaleZ","scale3d","skew","skewX","skewY","translate","translateX","translateY","translateZ","translate3d","matrix","matrix3d"],v=k.css,w=Math.round,x="",y="px",z="none",A="auto",B="width",C="height",D="hidden",E="origin",F="abortId",G="overflow",H="translate",I=v+"transition",J=v+"transform";c.directions={left:{reverse:"right",property:"left",transition:"translateX",vertical:!1,modifier:-1},right:{reverse:"left",property:"left",transition:"translateX",vertical:!1,modifier:1},down:{reverse:"up",property:"top",transition:"translateY",vertical:!0,modifier:1},up:{reverse:"down",property:"top",transition:"translateY",vertical:!0,modifier:-1},top:{reverse:"bottom"},bottom:{reverse:"top"},"in":{reverse:"out",modifier:-1},out:{reverse:"in",modifier:1}},f(a.fn,{kendoStop:function(a,b){return l?c.fx.stopQueue(this,a||!1,b||!1):this.stop(a,b)}}),a.fn.scale=function(b){if(typeof b=="undefined")return T(this,"scale");a(this).css(J,"scale("+b+")");return this};var K=a.fx.prototype.cur;a.fx.prototype.cur=function(){if(this.prop=="scale")return parseFloat(a(this.elem).scale());return K.apply(this,arguments)},a.fx.step.scale=function(b){a(b.elem).scale(b.now)},c.toggleClass=function(a,b,c,d){b&&(b=b.split(" "),l&&(c=f({exclusive:"all",duration:400,ease:"ease-out"},c),a.css(I,c.exclusive+" "+c.duration+"ms "+c.ease),setTimeout(function(){a.css(I,z).css(C)},c.duration)),e(b,function(b,c){a.toggleClass(c,d)}));return a},c.parseEffects=function(a,b){var d={};typeof a=="string"?e(a.split(" "),function(a,e){var f=!t.test(e),g=e.replace(s,function(a,b,c){return b+":"+c.toLowerCase()}),h=g.split(":"),i=h[1],j={};h.length>1&&(j.direction=b&&f?c.directions[i].reverse:i),d[h[0]]=j}):e(a,function(a){var e=this.direction;e&&b&&!t.test(a)&&(this.direction=c.directions[e].reverse),d[a]=this});return d},l&&f(c.fx,{transition:function(b,c,d){d=f({duration:200,ease:"ease-out",complete:null,exclusive:"all"},d),d.duration=a.fx?a.fx.speeds[d.duration]||d.duration:d.duration;var e=[],g={},h;for(h in c)u.indexOf(h)!=-1?e.push(h+"("+c[h]+")"):g[h]=c[h];e.length&&(g[J]=e.join(" "));var i={keys:Q(g),CSS:g,object:b,setup:{},duration:d.duration,complete:d.complete};i.setup[I]=d.exclusive+" "+d.duration+"ms "+d.ease;var j=b.data("keys")||[];a.merge(j,i.keys),b.data("keys",a.unique(j)),S(i)},stopQueue:function(a,b,c){a.data(F)&&(clearTimeout(a.data(F)),a.removeData(F));var d=this,e,f=a.data("keys"),g=c===!1&&f;g&&(e=N(a[0],f)),R(a),g&&a.css(e),a.removeData("keys"),d.complete&&d.complete.call(a),a.stop(b);return a}}),c.fx.promise=function(b,d){var g=[],i;i=c.parseEffects(d.effects),d.effects=i,b.data("animating",!0);var j={keep:[],restore:[]},l={},m={setup:[],teardown:[]},n={},o=a.Deferred(function(g){if(h(i)){var o=f({},d,{complete:g.resolve});e(i,function(g,h){var i=c.fx[g];if(i){var k=c.directions[h.direction];h.direction&&k&&(h.direction=d.reverse?k.reverse:h.direction,b.data(g,h)),o=f(!0,o,h),e(m,function(a){i[a]&&m[a].push(i[a])}),e(j,function(b){i[b]&&a.merge(j[b],i[b])}),i.css&&(l=f(l,i.css))}});if(m.setup.length){e(a.unique(j.keep),function(a,c){b.data(c)||b.data(c,b.css(c))}),d.show&&(l=f(l,{display:b.data("olddisplay")||"block"}));var p=l.transform;delete l.transform,k&&(l[J]=p),b.css(l),b.css("overflow"),e(m.setup,function(){n=f(n,this(b,o))}),c.fx.animate&&(d.init(),c.fx.animate(b,n,o));return}}else d.show&&(b.css({display:b.data("olddisplay")||"block"}).css("display"),d.init());g.resolve()}).promise();g.push(o),a.when.apply(null,g).then(function(){b.removeData("animating").dequeue(),d.hide&&b.data("olddisplay",b.css("display")).hide();if(h(i)){var c=function(){e(a.unique(j.restore),function(a,c){b.css(c,b.data(c))})};a.browser.msie?setTimeout(c,0):c(),e(m.teardown,function(){this(b,d)})}d.completeCallback&&d.completeCallback(b)})},c.fx.transitionPromise=function(a,b,d){c.fx.animateTo(a,b,d);return a},f(c.fx,{animate:function(c,g,h){var i=h.transition!==!1;delete h.transition,l&&"transition"in d&&i?d.transition(c,g,h):c.each(function(){var c=a(this),d={};e(u,function(a,e){var h,i=g?g[e]+" ":null;if(i){var j=g;if(e in m&&g[e]!==b){h=i.match(q);if(o){var l=(1-h[1])/2;f(j,{zoom:+h[1],marginLeft:c.width()*l,marginTop:c.height()*l})}else k&&f(j,{scale:+h[0]})}else if(e in n&&g[e]!==b){var p=c.css("position"),r=p=="absolute"||p=="fixed";c.data(H)||(r?c.data(H,{top:M(c,"top")||0,left:M(c,"left")||0,bottom:M(c,"bottom"),right:M(c,"right")}):c.data(H,{top:M(c,"marginTop")||0,left:M(c,"marginLeft")||0}));var s=c.data(H);h=i.match(q);if(h){var t=e==H+"Y"?+null:+h[1],u=e==H+"Y"?+h[1]:+h[2];r?(isNaN(s.right)?isNaN(t)||f(j,{left:s.left+t}):isNaN(t)||f(j,{right:s.right-t}),isNaN(s.bottom)?isNaN(u)||f(j,{top:s.top+u}):isNaN(u)||f(j,{bottom:s.bottom-u})):(isNaN(t)||f(j,{marginLeft:s.left+t}),isNaN(u)||f(j,{marginTop:s.top+u}))}}!k&&e!="scale"&&e in j&&delete j[e],j&&f(d,j)}}),a.browser.msie&&delete d.scale,c.animate(d,{queue:!1,show:!1,hide:!1,duration:h.duration,complete:h.complete})})},animateTo:function(b,c,d){function h(){c[0].style.cssText="",b[0].style.cssText="",f.css(G,g),d.completeCallback&&d.completeCallback()}var e,f=b.parents().filter(c.parents()).first(),g=f.css(G);d=P(d),f.css(G,"hidden"),a.each(d.effects,function(a,b){e=e||b.direction}),d.complete=a.browser.msie?function(){setTimeout(h)}:h,"slide"in d.effects?(b.kendoAnimate(d),c.kendoAnimate(O(d))):(d.reverse?b:c).kendoAnimate(d)},fade:{css:{opacity:function(){var c=a(this).data("fade"),d=c?c.direction=="in":!1;return d&&!this.style.opacity?0:b}},setup:function(a,b){return f({opacity:b.effects.fade.direction=="out"?0:1},b.properties)}},zoom:{css:{transform:function(){var c=a(this).data("zoom"),d=c?c.direction=="in":!1;return d&&l?"scale(.01)":b},zoom:function(){var c=a(this).data("zoom"),d=c?c.direction=="in":!1;return d&&o?".01":b}},setup:function(b,c){var d=c.effects.zoom.direction=="out";if(o){var e=a.browser.version,g=b[0].currentStyle,h=g.width.indexOf("%")!=-1?b.parent().width():b.width(),i=g.height.indexOf("%")!=-1?b.parent().height():parseInt(g.height,10),j=e<9&&c.effects.fade?0:(1-parseInt(b.css("zoom"),10)/100)/2;b.css({marginLeft:h*(e<8?0:j),marginTop:i*j})}return f({scale:d?.01:1},c.properties)}},slide:{setup:function(a,b){var d=c.directions[b.effects.slide.direction],e={},g,h=b.reverse,i=l&&b.transition!==!1?d.transition:d.property,j=b.divisor||1;if(!h){var k=a.data(E);g=d.modifier*(d.vertical?a.outerHeight():a.outerWidth())/j,!k&&k!==0&&a.data(E,parseFloat(T(a,i)))}e[i]=h?a.data(E)||0:(a.data(E)||0)+g+y;return f(e,b.properties)}},slideMargin:{setup:function(a,b){var c=a.data(E),d=b.offset,e,g={},h=b.reverse;!h&&!c&&c!==0&&a.data(E,parseInt(a.css("margin-"+b.axis),10)),e=a.data(E)||0,g["margin-"+b.axis]=h?e:e+d;return f(g,b.properties)}},slideTo:{setup:function(a,b){var c=(b.offset+"").split(","),d={},e=b.reverse;l&&b.transition!==!1?d.translate=e?0:c+y:(d.left=e?0:c[0],d.top=e?0:c[1]),a.css("left");return f(d,b.properties)}},slideIn:{setup:function(a,b){var d=c.directions[b.effects.slideIn.direction],e=b.reverse,g=e?c.directions[d.reverse]:d,h=-g.modifier*(g.vertical?a.outerHeight():a.outerWidth()),i={};l&&b.transition!==!1?(a.css(J,g.transition+"("+(e?0:h)+"px)"),i[g.transition]=e?h+y:0,a.css(J)):(e||a.css(g.property,h+y),i[g.property]=e?h+y:0,a.css(g.property));return f(i,b.properties)}},expand:{keep:[G],css:{overflow:D},restore:[G],setup:function(a,c){var d=c.reverse,e=c.effects.expand.direction,g=(e?e=="vertical":!0)?C:B,h=a[0].style[g],i=a.data(g),j=L(i||h)||w(a.css(g,A)[g]()),k={};k[g]=(d?0:j)+y,a.css(g,d?j:0).css(g),i===b&&a.data(g,h);return f(k,c.properties)},teardown:function(a,b){var c=b.effects.expand.direction,d=(c?c=="vertical":!0)?C:B,e=a.data(d);(e==A||e===x)&&setTimeout(function(){a.css(d,A).css(d)},0)}},simple:{setup:function(a,b){return b.properties}}}),c.fx.expandVertical=c.fx.expand;var U=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,1e3/60)},V=c.Class.extend({init:function(){var a=this;a._tickProxy=g(a._tick,a),a._started=!1},tick:a.noop,done:a.noop,onEnd:a.noop,onCancel:a.noop,start:function(){this._started=!0,U(this._tickProxy)},cancel:function(){this._started=!1,this.onCancel()},_tick:function(){var a=this;!a._started||(a.tick(),a.done()?(a._started=!1,a.onEnd()):U(a._tickProxy))}}),W=V.extend({init:function(a){var b=this;f(b,a),V.fn.init.call(b)},done:function(){return this.timePassed()>=this.duration},timePassed:function(){return Math.min(this.duration,+(new Date)-this.startDate)},moveTo:function(a){var b=this,c=b.movable;b.initial=c[b.axis],b.delta=a.location-b.initial,b.duration=a.duration||300,b.tick=b._easeProxy(a.ease),b.startDate=+(new Date),b.start()},_easeProxy:function(a){var b=this;return function(){b.movable.moveAxis(b.axis,a(b.timePassed(),b.initial,b.delta,b.duration))}}});f(W,{easeOutExpo:function(a,b,c,d){return a==d?b+c:c*(-Math.pow(2,-10*a/d)+1)+b},easeOutBack:function(a,b,c,d,e){e=1.70158;return c*((a=a/d-1)*a*((e+1)*a+e)+1)+b}}),d.Animation=V,d.Transition=W}(jQuery),function(a,b){function h(d){var f=[],g=d.logic||"and",i,j,k,l,m,n,o,p,q=d.filters;for(i=0,j=q.length;i<j;i++)d=q[i],k=d.field,o=d.value,n=d.operator,d.filters?d=h(d):(p=d.ignoreCase,k=k.replace(/\./g,"/"),d=e[n],d&&o!==b&&(l=a.type(o),l==="string"?(m="'{1}'",o=o.replace(/'/g,"''"),p===!0&&(k="tolower("+k+")")):l==="date"?m="datetime'{1:yyyy-MM-ddTHH:mm:ss}'":m="{1}",d.length>3?d!=="substringof"?m="{0}({2},"+m+")":m="{0}("+m+",{2})":m="{2} {0} "+m,d=c.format(m,d,o,k))),f.push(d);d=f.join(" "+g+" "),f.length>1&&(d="("+d+")");return d}var c=window.kendo,d=a.extend,e={eq:"eq",neq:"ne",gt:"gt",gte:"ge",lt:"lt",lte:"le",contains:"substringof",endswith:"endswith",startswith:"startswith"},f={pageSize:a.noop,page:a.noop,filter:function(a,b){b&&(a.$filter=h(b))},sort:function(b,c){var d=a.map(c,function(a){var b=a.field.replace(/\./g,"/");a.dir==="desc"&&(b+=" desc");return b}).join(",");d&&(b.$orderby=d)},skip:function(a,b){b&&(a.$skip=b)},take:function(a,b){b&&(a.$top=b)}},g={read:{dataType:"jsonp"}};d(!0,c.data,{schemas:{odata:{type:"json",data:function(a){return a.d.results||[a.d]},total:"d.__count"}},transports:{odata:{read:{cache:!0,dataType:"jsonp",jsonp:"$callback"},update:{cache:!0,dataType:"json",contentType:"application/json",type:"PUT"},create:{cache:!0,dataType:"json",contentType:"application/json",type:"POST"},destroy:{cache:!0,dataType:"json",type:"DELETE"},parameterMap:function(a,b){var d,e,h,i;a=a||{},b=b||"read",i=(this.options||g)[b],i=i?i.dataType:"json";if(b==="read"){d={$inlinecount:"allpages"},i!="json"&&(d.$format="json");for(h in a)f[h]?f[h](d,a[h]):d[h]=a[h]}else{if(i!=="json")throw new Error("Only json dataType can be used for "+b+" operation.");if(b!=="destroy"){for(h in a)e=a[h],typeof e=="number"&&(a[h]=e+"");d=c.stringify(a)}}return d}}}})}(jQuery),function(a,b){var c=window.kendo,d=a.isArray,e=a.isPlainObject,f=a.map,g=a.each,h=a.extend,i=c.getter,j=c.Class,k=j.extend({init:function(a){var b=this,i=a.total,j=a.model,k=a.data;if(j){if(e(j)){j.fields&&g(j.fields,function(a,c){e(c)&&c.field?c=h(c,{field:b.getter(c.field)}):c={field:b.getter(c)},j.fields[a]=c});var l=j.id;if(l){var m={};m[b.xpathToMember(l,!0)]={field:b.getter(l)},j.fields=h(m,j.fields),j.id=b.xpathToMember(l)}j=c.data.Model.define(j)}b.model=j}i&&(i=b.getter(i),b.total=function(a){return parseInt(i(a),10)}),k&&(k=b.xpathToMember(k),b.data=function(a){var c=b.evaluate(a,k),e;c=d(c)?c:[c];if(b.model&&j.fields){e=new b.model;return f(c,function(a){if(a){var b={},c;for(c in j.fields)b[c]=e._parse(c,j.fields[c].field(a));return b}})}return c})},total:function(a){return this.data(a).length},parseDOM:function(a){var c={},e,f,g,h,i,j,k=a.attributes,l=k.length,m;for(m=0;m<l;m++)j=k[m],c["@"+j.nodeName]=j.nodeValue;for(f=a.firstChild;f;f=f.nextSibling)g=f.nodeType,g===3||g===4?c["#text"]=f.nodeValue:g===1&&(e=this.parseDOM(f),h=f.nodeName,i=c[h],d(i)?i.push(e):i!==b?i=[i,e]:i=e,c[h]=i);return c},evaluate:function(a,b){var c=b.split("."),e,f,g,h,i;while(e=c.shift()){a=a[e];if(d(a)){f=[],b=c.join(".");for(i=0,g=a.length;i<g;i++)h=this.evaluate(a[i],b),h=d(h)?h:[h],f.push.apply(f,h);return f}}return a},parse:function(b){var c,d,e={};c=b.documentElement||a.parseXML(b).documentElement,d=this.parseDOM(c),e[c.nodeName]=d;return e},xpathToMember:function(a,b){if(!a)return"";a=a.replace(/^\//,"").replace(/\//g,".");if(a.indexOf("@")>=0)return a.replace(/\.?(@.*)/,b?"$1":'["$1"]');if(a.indexOf("text()")>=0)return a.replace(/(\.?text\(\))/,b?"#text":'["#text"]');return a},getter:function(a){return i(this.xpathToMember(a),!0)}});a.extend(!0,c.data,{XmlDataReader:k,readers:{xml:k}})}(jQuery),function(a,b){function br(b,c){var d=a(b)[0].tBodies[0],e=d?d.rows:[],f,g,h,i=c.length,j=[],k,l,m,n;for(f=0,g=e.length;f<g;f++){l={},n=!0,k=e[f].cells;for(h=0;h<i;h++)m=k[h],m.nodeName.toLowerCase()!=="th"&&(n=!1,l[c[h].field]=m.innerHTML);n||j.push(l)}return j}function bq(b,c){var d=a(b)[0].children,e,f,g=[],h,i=c[0],j=c[1],k,l;for(e=0,f=d.length;e<f;e++)h={},l=d[e],h[i.field]=l.text,k=l.attributes.value,k&&k.specified?k=l.value:k=l.text,h[j.field]=k,g.push(h);return g}function bo(a){var b,c,d=[];for(b=0,c=a.length;b<c;b++)a[b].hasSubgroups?d=d.concat(bo(a[b].items)):d=d.concat(a[b].items.toJSON());return d}function bj(a,b){b=b||{};var c=new Z(a),d=b.aggregate,e=b.filter;e&&(c=c.filter(e));return c.aggregate(d)}function bi(a,c){c=c||{};var d=new Z(a),e=c.group,f=bd(e||[]).concat($(c.sort||[])),g,h=c.filter,i=c.skip,j=c.take;h&&(d=d.filter(h),g=d.toArray().length),f&&(d=d.sort(f),e&&(a=d.toArray())),i!==b&&j!==b&&(d=d.range(i,j)),e&&(d=d.group(e,a));return{total:g,data:d.toArray()}}function bh(a){var b,c=a.length,d=Array(c);for(b=0;b<c;b++)d[b]=a[b].toJSON();return d}function bf(a,b,c,d,e){b=b||[];var f,g,h,i=b.length;for(f=0;f<i;f++){g=b[f],h=g.aggregate;var j=g.field;a[j]=a[j]||{},a[j][h]=bg[h.toLowerCase()](a[j][h],c,n.accessor(j),d,e)}}function be(a,b){if(a&&a.getTime&&b&&b.getTime)return a.getTime()===b.getTime();return a===b}function bd(a,c){var d=typeof a===q?{field:a,dir:c}:a,e=h(d)?d:d!==b?[d]:[];return k(e,function(a){return{field:a.field,dir:a.dir||"asc",aggregates:a.aggregates}})}function bc(a){return h(a)?a:[a]}function bb(a){if(a&&!g(a)){if(h(a)||!a.filters)a={logic:"and",filters:h(a)?a:[a]};ba(a);return a}}function ba(a){var b,c,d,e,f=a.filters;if(f)for(b=0,c=f.length;b<c;b++)d=f[b],e=d.operator,e&&typeof e===q&&(d.operator=_[e.toLowerCase()]||e),ba(d)}function $(a,c){if(a){var d=typeof a===q?{field:a,dir:c}:a,e=h(d)?d:d!==b?[d]:[];return i(e,function(a){return!!a.dir})}}function Z(a){this.data=a||[]}function S(b,c){if(b===c)return!0;var d=a.type(b),e=a.type(c),f;if(d!==e)return!1;if(d==="date")return b.getTime()===c.getTime();if(d!=="object"&&d!=="array")return!1;for(f in b)if(!S(b[f],c[f]))return!1;return!0}var c=a.extend,d=a.proxy,e=a.isFunction,f=a.isPlainObject,g=a.isEmptyObject,h=a.isArray,i=a.grep,j=a.ajax,k,l=a.each,m=a.noop,n=window.kendo,o=n.Observable,p=n.Class,q="string",r="function",s="create",t="read",u="update",v="destroy",w="change",x="get",y="error",z="requestStart",A=[s,t,u,v],B=function(a){return a},C=n.getter,D=n.stringify,E=Math,F=[].push,G=[].join,H=[].pop,I=[].splice,J=[].shift,K=[].slice,L=[].unshift,M={}.toString,N=n.support.stableSort,O=/^\/Date\((.*?)\)\/$/,P=/(?=['\\])/g,Q=o.extend({init:function(a,b){var c=this;c.type=b||R,o.fn.init.call(c),c.length=a.length,c.wrapAll(a,c)},toJSON:function(){return K.call(this)},parent:m,wrapAll:function(a,b){var c=this,d,e,f=function(){return c};b=b||[];for(d=0,e=a.length;d<e;d++)b[d]=c.wrap(a[d],f);return b},wrap:function(a,b){var c=this,d;a!==null&&M.call(a)==="[object Object]"&&(d=a instanceof c.type||a instanceof V,d||(a=a instanceof R?a.toJSON():a,a=new c.type(a)),a.parent=b,a.bind(w,function(a){c.trigger(w,{field:a.field,items:[this],action:"itemchange"})}));return a},push:function(){var a=this.length,b=this.wrapAll(arguments),c;c=F.apply(this,b),this.trigger(w,{action:"add",index:a,items:b});return c},slice:K,join:G,pop:function(){var a=this.length,b=H.apply(this);a&&this.trigger(w,{action:"remove",index:a-1,items:[b]});return b},splice:function(a,b,c){var d=this.wrapAll(K.call(arguments,2)),e;e=I.apply(this,[a,b].concat(d)),e.length&&this.trigger(w,{action:"remove",index:a,items:e}),c&&this.trigger(w,{action:"add",index:a,items:d});return e},shift:function(){var a=this.length,b=J.apply(this);a&&this.trigger(w,{action:"remove",index:0,items:[b]});return b},unshift:function(){var a=this.wrapAll(arguments),b;b=L.apply(this,a),this.trigger(w,{action:"add",index:0,items:a});return b},indexOf:function(a){var b=this,c,d;for(c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1}}),R=o.extend({init:function(a){var b=this,c,d,e=function(){return b},f;o.fn.init.call(this);for(d in a)c=a[d],d.charAt(0)!="_"&&(f=M.call(c),c=b.wrap(c,d,e)),b[d]=c;b.uid=n.guid()},shouldSerialize:function(a){return this.hasOwnProperty(a)&&a!=="_events"&&typeof this[a]!==r&&a!=="uid"},toJSON:function(){var a={},b;for(b in this)this.shouldSerialize(b)&&(a[b]=this[b]);return a},get:function(a){var b=this,c;b.trigger(x,{field:a}),a==="this"?c=b:c=n.getter(a,!0)(b);return c},_set:function(a,b){var c=this;if(a.indexOf(".")){var d=a.split("."),e="";while(d.length>1){e+=d.shift();var f=n.getter(e,!0)(c);if(f instanceof R){f.set(d.join("."),b);return}e+="."}}n.setter(a)(c,b)},set:function(a,b){var c=this,d=c[a],e=function(){return c};d!==b&&(c.trigger("set",{field:a,value:b})||(c._set(a,c.wrap(b,a,e)),c.trigger(w,{field:a})))},parent:m,wrap:function(a,b,c){var d=this,e=M.call(a),f=a instanceof Q;a===null||e!=="[object Object]"||a instanceof bp||!!f?a===null||e!=="[object Array]"&&!f?a!==null&&a instanceof bp&&(a._parent=c):(f||(a=new Q(a)),a.parent=c,function(b){a.bind(w,function(a){d.trigger(w,{field:b,index:a.index,items:a.items,action:a.action})})}(b)):(a instanceof R||(a=new R(a)),a.parent=c,function(b){a.bind(x,function(a){a.field=b+"."+a.field,d.trigger(x,a)}),a.bind(w,function(a){a.field=b+"."+a.field,d.trigger(w,a)})}(b));return a}}),T={number:function(a){return n.parseFloat(a)},date:function(a){if(typeof a===q){var b=O.exec(a);if(b)return new Date(parseInt(b[1],10))}return n.parseDate(a)},"boolean":function(a){if(typeof a===q)return a.toLowerCase()==="true";return!!a},string:function(a){return a+""},"default":function(a){return a}},U={string:"",number:0,date:new Date,"boolean":!1,"default":""},V=R.extend({init:function(c){var d=this;if(!c||a.isEmptyObject(c))c=a.extend({},d.defaults,c);R.fn.init.call(d,c),d.dirty=!1,d.idField&&(d.id=d.get(d.idField),d.id===b&&(d.id=d._defaultId))},shouldSerialize:function(a){return R.fn.shouldSerialize.call(this,a)&&a!=="uid"&&(this.idField==="id"||a!=="id")&&a!=="dirty"&&a!=="_accessors"},_parse:function(a,b){var c=this,d;a=(c.fields||{})[a],a&&(d=a.parse,!d&&a.type&&(d=T[a.type.toLowerCase()]));return d?d(b):b},editable:function(a){a=(this.fields||{})[a];return a?a.editable!==!1:!0},set:function(a,b,c){var d=this;d.editable(a)&&(b=d._parse(a,b),S(b,d.get(a))||(d.dirty=!0,R.fn.set.call(d,a,b,c)))},accept:function(a){var b=this;c(b,a),b.idField&&(b.id=b.get(b.idField)),b.dirty=!1},isNew:function(){return this.id===this._defaultId}});V.define=function(a){var d,e=c({},{defaults:{}},a),f=e.id;f&&(e.idField=f),e.id&&delete e.id,f&&(e.defaults[f]=e._defaultId="");for(var g in e.fields){var h=e.fields[g],i=h.type||"default",j=null;g=h.field||g,h.nullable||(j=e.defaults[g]=h.defaultValue!==b?h.defaultValue:U[i.toLowerCase()]),a.id===g&&(e._defaultId=j),e.defaults[g]=j,h.parse=h.parse||T[i]}d=V.extend(e),e.fields&&(d.fields=e.fields,d.idField=e.idField);return d};var W={selector:function(a){return e(a)?a:C(a)},asc:function(a){var b=this.selector(a);return function(a,c){a=b(a),c=b(c);return a>c?1:a<c?-1:0}},desc:function(a){var b=this.selector(a);return function(a,c){a=b(a),c=b(c);return a<c?1:a>c?-1:0}},create:function(a){return this[a.dir.toLowerCase()](a.field)},combine:function(a){return function(b,c){var d=a[0](b,c),e,f;for(e=1,f=a.length;e<f;e++)d=d||a[e](b,c);return d}}},X=c({},W,{asc:function(a){var b=this.selector(a);return function(a,c){var d=b(a),e=b(c);if(d===e)return a.__position-c.__position;return d>e?1:d<e?-1:0}},desc:function(a){var b=this.selector(a);return function(a,c){var d=b(a),e=b(c);if(d===e)return a.__position-c.__position;return d<e?1:d>e?-1:0}}});k=function(a,b){var c,d=a.length,e=Array(d);for(c=0;c<d;c++)e[c]=b(a[c],c,a);return e};var Y=function(){function b(b,c,d,e){var f;d!=null&&(typeof d===q&&(d=a(d),f=O.exec(d),f?d=new Date(+f[1]):e?(d="'"+d.toLowerCase()+"'",c=c+".toLowerCase()"):d="'"+d+"'"),d.getTime&&(c="("+c+"?"+c+".getTime():"+c+")",d=d.getTime()));return c+" "+b+" "+d}function a(a){return a.replace(P,"\\")}return{eq:function(a,c,d){return b("==",a,c,d)},neq:function(a,c,d){return b("!=",a,c,d)},gt:function(a,c,d){return b(">",a,c,d)},gte:function(a,c,d){return b(">=",a,c,d)},lt:function(a,c,d){return b("<",a,c,d)},lte:function(a,c,d){return b("<=",a,c,d)},startswith:function(b,c,d){d&&(b=b+".toLowerCase()",c&&(c=c.toLowerCase())),c&&(c=a(c));return b+".lastIndexOf('"+c+"', 0) == 0"},endswith:function(b,c,d){d&&(b=b+".toLowerCase()",c&&(c=c.toLowerCase())),c&&(c=a(c));return b+".lastIndexOf('"+c+"') == "+b+".length - "+(c||"").length},contains:function(b,c,d){d&&(b=b+".toLowerCase()",c&&(c=c.toLowerCase())),c&&(c=a(c));return b+".indexOf('"+c+"') >= 0"}}}();Z.filterExpr=function(a){var c=[],d={and:" && ",or:" || "},e,f,g,h,i=[],j=[],k,l,m=a.filters;for(e=0,f=m.length;e<f;e++)g=m[e],k=g.field,l=g.operator,g.filters?(h=Z.filterExpr(g),g=h.expression.replace(/__o\[(\d+)\]/g,function(a,b){b=+b;return"__o["+(j.length+b)+"]"}).replace(/__f\[(\d+)\]/g,function(a,b){b=+b;return"__f["+(i.length+b)+"]"}),j.push.apply(j,h.operators),i.push.apply(i,h.fields)):(typeof k===r?(h="__f["+i.length+"](d)",i.push(k)):h=n.expr(k),typeof l===r?(g="__o["+j.length+"]("+h+", "+g.value+")",j.push(l)):g=Y[(l||"eq").toLowerCase()](h,g.value,g.ignoreCase!==b?g.ignoreCase:!0)),c.push(g);return{expression:"("+c.join(d[a.logic])+")",fields:i,operators:j}};var _={"==":"eq",equals:"eq",isequalto:"eq",equalto:"eq",equal:"eq","!=":"neq",ne:"neq",notequals:"neq",isnotequalto:"neq",notequalto:"neq",notequal:"neq","<":"lt",islessthan:"lt",lessthan:"lt",less:"lt","<=":"lte",le:"lte",islessthanorequalto:"lte",lessthanequal:"lte",">":"gt",isgreaterthan:"gt",greaterthan:"gt",greater:"gt",">=":"gte",isgreaterthanorequalto:"gte",greaterthanequal:"gte",ge:"gte"};Z.normalizeFilter=bb,Z.prototype={toArray:function(){return this.data},range:function(a,b){return new Z(this.data.slice(a,a+b))},skip:function(a){return new Z(this.data.slice(a))},take:function(a){return new Z(this.data.slice(0,a))},select:function(a){return new Z(k(this.data,a))},orderBy:function(a){var b=this.data.slice(0),c=e(a)||!a?W.asc(a):a.compare;return new Z(b.sort(c))},orderByDescending:function(a){return new Z(this.data.slice(0).sort(W.desc(a)))},sort:function(a,b,c){var d,e,f=$(a,b),g=[];c=c||W;if(f.length){for(d=0,e=f.length;d<e;d++)g.push(c.create(f[d]));return this.orderBy({compare:c.combine(g)})}return this},filter:function(a){var b,c,d,e,f,g=this.data,h,i,j=[],k;a=bb(a);if(!a||a.filters.length===0)return this;e=Z.filterExpr(a),h=e.fields,i=e.operators,f=k=new Function("d, __f, __o","return "+e.expression);if(h.length||i.length)k=function(a){return f(a,h,i)};for(b=0,d=g.length;b<d;b++)c=g[b],k(c)&&j.push(c);return new Z(j)},group:function(a,b){a=bd(a||[]),b=b||this.data;var c=this,d=new Z(c.data),e;a.length>0&&(e=a[0],d=d.groupBy(e).select(function(c){var d=(new Z(b)).filter([{field:c.field,operator:"eq",value:c.value}]);return{field:c.field,value:c.value,items:a.length>1?(new Z(c.items)).group(a.slice(1),d.toArray()).toArray():c.items,hasSubgroups:a.length>1,aggregates:d.aggregate(e.aggregates)}}));return d},groupBy:function(a){if(g(a)||!this.data.length)return new Z([]);var b=a.field,c=this._sortForGrouping(b,a.dir||"asc"),d=n.accessor(b),e,f=d.get(c[0],b),h={field:b,value:f,items:[]},i,j,k,l=[h];for(j=0,k=c.length;j<k;j++)e=c[j],i=d.get(e,b),be(f,i)||(f=i,h={field:b,value:f,items:[]},l.push(h)),h.items.push(e);return new Z(l)},_sortForGrouping:function(a,b){var c,d,e=this.data;if(!N){for(c=0,d=e.length;c<d;c++)e[c].__position=c;e=(new Z(e)).sort(a,b,X).toArray();for(c=0,d=e.length;c<d;c++)delete e[c].__position;return e}return this.sort(a,b).toArray()},aggregate:function(a){var b,c,d={};if(a&&a.length)for(b=0,c=this.data.length;b<c;b++)bf(d,a,this.data[b],b,c);return d}};var bg={sum:function(a,b,c){return(a||0)+c.get(b)},count:function(a,b,c){return(a||0)+1},average:function(a,b,c,d,e){a=(a||0)+c.get(b),d==e-1&&(a=a/e);return a},max:function(a,b,c){var d=c.get(b);a=a||0,a<d&&(a=d);return a},min:function(a,b,c){var d=c.get(b);a=a||d,a>d&&(a=d);return a}},bk=p.extend({init:function(a){this.data=a.data},read:function(a){a.success(this.data)},update:function(a){a.success(a.data)},create:function(a){a.success(a.data)},destroy:m}),bl=p.extend({init:function(a){var b=this,d;a=b.options=c({},b.options,a),l(A,function(b,c){typeof a[c]===q&&(a[c]={url:a[c]})}),b.cache=a.cache?bm.create(a.cache):{find:m,add:m},d=a.parameterMap,b.parameterMap=e(d)?d:function(a){var b={};l(a,function(a,c){a in d&&(a=d[a],f(a)&&(c=a.value(c),a=a.key)),b[a]=c});return b}},options:{parameterMap:B},create:function(a){return j(this.setup(a,s))},read:function(c){var d=this,e,f,g,h=d.cache;c=d.setup(c,t),e=c.success||m,f=c.error||m,g=h.find(c.data),g!==b?e(g):(c.success=function(a){h.add(c.data,a),e(a)},a.ajax(c))},update:function(a){return j(this.setup(a,u))},destroy:function(a){return j(this.setup(a,v))},setup:function(a,b){a=a||{};var d=this,f,g=d.options[b],h=e(g.data)?g.data():g.data;a=c(!0,{},g,a),f=c(h,a.data),a.data=d.parameterMap(f,b),e(a.url)&&(a.url=a.url(f));return a}}),bm=p.extend({init:function(){this._store={}},add:function(a,c){a!==b&&(this._store[D(a)]=c)},find:function(a){return this._store[D(a)]},clear:function(){this._store={}},remove:function(a){delete this._store[D(a)]}});bm.create=function(a){var b={inmemory:function(){return new bm}};if(f(a)&&e(a.find))return a;if(a===!0)return new bm;return b[a]()};var bn=p.extend({init:function(a){var b=this,c,d,e;a=a||{};for(c in a)d=a[c],b[c]=typeof d===q?C(d):d;if(f(b.model)){b.model=e=n.data.Model.define(b.model);var h=b.data,i={};e.fields&&l(e.fields,function(a,b){f(b)&&b.field?i[b.field]=C(b.field):i[a]=C(a)}),b.data=function(a){var c,d,e,f,j=new b.model;a=h(a);if(a&&!g(i)){M.call(a)!=="[object Array]"&&!(a instanceof Q)&&(a=[a]);for(e=0,f=a.length;e<f;e++){c=a[e];for(d in i)c[d]=j._parse(d,i[d](c))}}return a||[]}}},parse:B,data:B,total:function(a){return a.length},groups:B,status:function(a){return a.status},aggregates:function(){return{}}}),bp=o.extend({init:function(a){var d=this,f,g,h;a=d.options=c({},d.options,a),c(d,{_map:{},_prefetch:{},_data:[],_ranges:[],_view:[],_pristine:[],_destroyed:[],_pageSize:a.pageSize,_page:a.page||(a.pageSize?1:b),_sort:$(a.sort),_filter:bb(a.filter),_group:bd(a.group),_aggregate:a.aggregate}),o.fn.init.call(d),h=a.transport,h?(h.read=typeof h.read===q?{url:h.read}:h.read,a.type&&(h=c(!0,{},n.data.transports[a.type],h),a.schema=c(!0,{},n.data.schemas[a.type],a.schema)),d.transport=e(h.read)?h:new bl(h)):d.transport=new bk({data:a.data}),d.reader=new n.data.readers[a.schema.type||"json"](a.schema),g=d.reader.model||{},d._data=d._observe(d._data),f=g.id,f&&(d.id=function(a){return f(a)}),d.bind([y,w,z],a)},options:{data:[],schema:{},serverSorting:!1,serverPaging:!1,serverFiltering:!1,serverGrouping:!1,serverAggregates:!1,sendAllFields:!0,batch:!1},_flatData:function(a){if(this.options.serverGrouping)return bo(a);return a},get:function(a){var b,c,d=this._flatData(this._data);for(b=0,c=d.length;b<c;b++)if(d[b].id==a)return d[b]},getByUid:function(a){var b,c,d=this._flatData(this._data);for(b=0,c=d.length;b<c;b++)if(d[b].uid==a)return d[b]},sync:function(){var b=this,c,d,e=[],f=[],g=b._destroyed,h=b._data;if(!!b.reader.model){for(c=0,d=h.length;c<d;c++)h[c].isNew()?e.push(h[c]):h[c].dirty&&f.push(h[c]);var i=b._send("create",e);i.push.apply(i,b._send("update",f)),i.push.apply(i,b._send("destroy",g)),a.when.apply(null,i).then(function(){var a,c;for(a=0,c=arguments.length;a<c;a++)b._accept(arguments[a]);b._change()})}},_accept:function(b){var d=this,e=b.models,f=b.response,g=0,h=d.reader.data(d._pristine),i=b.type,j;f?(f=d.reader.parse(f),f=d.reader.data(f),a.isArray(f)||(f=[f])):f=a.map(e,function(a){return a.toJSON()}),i==="destroy"&&(d._destroyed=[]);for(g=0,j=e.length;g<j;g++)i!=="destroy"?(e[g].accept(f[g]),i==="create"?h.push(e[g]):i==="update"&&c(h[d._pristineIndex(e[g])],f[g])):h.splice(d._pristineIndex(e[g]),1)},_pristineIndex:function(a){var b=this,c,d,e=b.reader.data(b._pristine);for(c=0,d=e.length;c<d;c++)if(e[c][a.idField]===a.id)return c;return-1},_promise:function(b,d,e){var f=this,g=f.transport;return a.Deferred(function(a){g[e].call(g,c({success:function(b){a.resolve({response:b,models:d,type:e})},error:function(b){a.reject(b),f.trigger(y,b)}},b))}).promise()},_send:function(a,b){var c=this,d,e,f=[];if(c.options.batch)b.length&&f.push(c._promise({data:{models:bh(b)}},b,a));else for(d=0,e=b.length;d<e;d++)f.push(c._promise({data:b[d].toJSON()},[b[d]],a));return f},add:function(a){return this.insert(this._data.length,a)},insert:function(a,b){b||(b=a,a=0),b instanceof V||(this.reader.model?b=new this.reader.model(b):b=new R(b)),this._data.splice(a,0,b);return b},cancelChanges:function(a){var b=this,d,e=b.reader.data(b._pristine),f;a instanceof n.data.Model?(f=b.indexOf(a),d=b._pristineIndex(a),f!=-1&&(d!=-1&&!a.isNew()?c(!0,b._data[f],e[d]):b._data.splice(f,1))):(b._destroyed=[],b._data=b._observe(e),b._change())},read:function(a){var b=this,c=b._params(a);b._queueRequest(c,function(){b.trigger(z),b._ranges=[],b.transport.read({data:c,success:d(b.success,b),error:d(b.error,b)})})},indexOf:function(a){var b,c,d=this._data;if(a)for(b=0,c=d.length;b<c;b++)if(d[b].uid==a.uid)return b;return-1},_params:function(a){var b=this,d=c({take:b.take(),skip:b.skip(),page:b.page(),pageSize:b.pageSize(),sort:b._sort,filter:b._filter,group:b._group,aggregate:b._aggregate},a);b.options.serverPaging||(delete d.take,delete d.skip,delete d.page,delete d.pageSize);return d},_queueRequest:function(a,c){var e=this;e._requestInProgress?e._pending={callback:d(c,e),options:a}:(e._requestInProgress=!0,e._pending=b,c())},_dequeueRequest:function(){var a=this;a._requestInProgress=!1,a._pending&&a._queueRequest(a._pending.options,a._pending.callback)},remove:function(a){var b,c,d=this._data;for(b=0,c=d.length;b<c;b++)if(d[b].uid==a.uid){a=d[b],d.splice(b,1);return a}},error:function(a,b,c){this._dequeueRequest(),this.trigger(y,{xhr:a,status:b,errorThrown:c})},_parent:m,success:function(b){var c=this,d=c.options,e=d.serverGrouping===!0&&c._group&&c._group.length>0;b=c.reader.parse(b),c._pristine=f(b)?a.extend(!0,{},b):b.slice(0),c._total=c.reader.total(b),c._aggregate&&d.serverAggregates&&(c._aggregateResult=c.reader.aggregates(b)),e?b=c.reader.groups(b):b=c.reader.data(b),c._data=c._observe(b);var g=c._skip||0,h=g+c._data.length;c._ranges.push({start:g,end:h,data:c._data}),c._ranges.sort(function(a,b){return a.start-b.start}),c._dequeueRequest(),c._process(c._data)},_observe:function(a){var b=this,c=b.reader.model,e=!1;c&&a.length&&(e=!(a[0]instanceof c)),a instanceof Q?e&&(a.type=b.reader.model,a.wrapAll(a,a)):(a=new Q(a,b.reader.model),a.parent=function(){return b._parent()});return a.bind(w,d(b._change,b))},_change:function(a){var b=this,c,d,e=a?a.action:"";if(e==="remove")for(c=0,d=a.items.length;c<d;c++)(!a.items[c].isNew||!a.items[c].isNew())&&b._destroyed.push(a.items[c]);if(!b.options.autoSync||e!=="add"&&e!=="remove"&&e!=="itemchange"){var f=b._total||b.reader.total(b._pristine);e==="add"?f++:e==="remove"?f--:e!=="itemchange"&&!b.options.serverPaging&&(f=b.reader.total(b._pristine)),b._total=f,b._process(b._data,a)}else b.sync()},_process:function(a,c){var d=this,e={},f;d.options.serverPaging!==!0&&(e.skip=d._skip,e.take=d._take||d._pageSize,e.skip===b&&d._page!==b&&d._pageSize!==b&&(e.skip=(d._page-1)*d._pageSize)),d.options.serverSorting!==!0&&(e.sort=d._sort),d.options.serverFiltering!==!0&&(e.filter=d._filter),d.options.serverGrouping!==!0&&(e.group=d._group),d.options.serverAggregates!==!0&&(e.aggregate=d._aggregate,d._aggregateResult=bj(a,e)),f=bi(a,e),d._view=f.data,f.total!==b&&!d.options.serverFiltering&&(d._total=f.total),d.trigger(w,c)},at:function(a){return this._data[a]},data:function(a){var c=this;if(a!==b)c._data=this._observe(a),c._total=c._data.length,c._process(c._data);else return c._data},view:function(){return this._view},query:function(a){var c=this,d,e=c.options.serverSorting||c.options.serverPaging||c.options.serverFiltering||c.options.serverGrouping||c.options.serverAggregates;a!==b&&(c._pageSize=a.pageSize,c._page=a.page,c._sort=a.sort,c._filter=a.filter,c._group=a.group,c._aggregate=a.aggregate,c._skip=a.skip,c._take=a.take,c._skip===b&&(c._skip=c.skip(),a.skip=c.skip()),c._take===b&&c._pageSize!==b&&(c._take=c._pageSize,a.take=c._take),a.sort&&(c._sort=a.sort=$(a.sort)),a.filter&&(c._filter=a.filter=bb(a.filter)),a.group&&(c._group=a.group=bd(a.group)),a.aggregate&&(c._aggregate=a.aggregate=bc(a.aggregate))),e||c._data===b||c._data.length===0?c.read(a):(c.trigger(z),d=bi(c._data,a),c.options.serverFiltering||(d.total!==b?c._total=d.total:c._total=c._data.length),c._view=d.data,c._aggregateResult=bj(c._data,a),c.trigger(w))},fetch:function(a){var b=this;a&&e(a)&&b.one(w,a),b._query()},_query:function(a){var b=this;b.query(c({},{page:b.page(),pageSize:b.pageSize(),sort:b.sort(),filter:b.filter(),group:b.group(),aggregate:b.aggregate()},a))},next:function(){var a=this,b=a.page(),c=a.total();!b||(c?a.page(b+1):(a._skip=b*a.take(),a._query({page:b+1})))},prev:function(){var a=this,b=a.page(),c=a.total();!!b&&b!==1&&(c?a.page(b-1):(a._skip=a._skip-a.take(),a._query({page:b-1})))},page:function(a){var c=this,d;if(a!==b)a=E.max(E.min(E.max(a,1),c.totalPages()),1),c._query({page:a});else{d=c.skip();return d!==b?E.round((d||0)/(c.take()||1))+1:b}},pageSize:function(a){var c=this;if(a!==b)c._query({pageSize:a});else return c.take()},sort:function(a){var c=this;if(a!==b)c._query({sort:a});else return c._sort},filter:function(a){var c=this;if(a===b)return c._filter;c._query({filter:a,page:1})},group:function(a){var c=this;if(a!==b)c._query({group:a});else return c._group},total:function(){return this._total||0},aggregate:function(a){var c=this;if(a!==b)c._query({aggregate:a});else return c._aggregate},aggregates:function(){return this._aggregateResult},totalPages:function(){var a=this,b=a.pageSize()||a.total();return E.ceil((a.total()||0)/b)},inRange:function(a,b){var c=this,d=E.min(a+b,c.total());if(!c.options.serverPaging&&c.data.length>0)return!0;return c._findRange(a,d).length>0},range:function(a,c){a=E.min(a||0,this.total());var d=this,e=E.max(E.floor(a/c),0)*c,f=E.min(e+c,d.total()),g;g=d._findRange(a,E.min(a+c,d.total()));if(g.length){d._skip=a>d.skip()?E.min(f,(d.totalPages()-1)*d.take()):e,d._take=c;var h=d.options.serverPaging,i=d.options.serverSorting;try{d.options.serverPaging=!0,d.options.serverSorting=!0,h&&(d._data=g=d._observe(g)),d._process(g)}finally{d.options.serverPaging=h,d.options.serverSorting=i}}else c!==b&&(d._rangeExists(e,f)?e<a&&d.prefetch(f,c,function(){d.range(a,c)}):d.prefetch(e,c,function(){a>e&&f<d.total()&&!d._rangeExists(f,E.min(f+c,d.total()))?d.prefetch(f,c,function(){d.range(a,c)}):d.range(a,c)}))},_findRange:function(a,c){var d=this,e=d._ranges,f,g=[],h,i,j,k,l,m,n,o=d.options,p=o.serverSorting||o.serverPaging||o.serverFiltering||o.serverGrouping||o.serverAggregates,q;for(h=0,q=e.length;h<q;h++){f=e[h];if(a>=f.start&&a<=f.end){var r=0;for(i=h;i<q;i++){f=e[i];if(f.data.length&&a+r>=f.start){l=f.data,m=f.end,p||(n=bi(f.data,{sort:d.sort(),filter:d.filter()}),l=n.data,n.total!==b&&(m=n.total)),j=0,a+r>f.start&&(j=a+r-f.start),k=l.length,m>c&&(k=k-(m-c)),r+=k-j,g=g.concat(l.slice(j,k));if(c<=f.end&&r==c-a)return g}}break}}return[]},skip:function(){var a=this;if(a._skip===b)return a._page!==b?(a._page-1)*(a.take()||1):b;return a._skip},take:function(){var a=this;return a._take||a._pageSize},prefetch:function(a,b,c){var d=this,e=E.min(a+b,d.total()),f={start:a,end:e,data:[]},g={take:b,skip:a,page:a/b+1,pageSize:b,sort:d._sort,filter:d._filter,group:d._group,aggregate:d._aggregate};d._rangeExists(a,e)?c&&c():(clearTimeout(d._timeout),d._timeout=setTimeout(function(){d._queueRequest(g,function(){d.transport.read({data:g,success:function(b){d._dequeueRequest();var e=!1;for(var g=0,h=d._ranges.length;g<h;g++)if(d._ranges[g].start===a){e=!0,f=d._ranges[g];break}e||d._ranges.push(f),b=d.reader.parse(b),f.data=d._observe(d.reader.data(b)),f.end=f.start+f.data.length,d._ranges.sort(function(a,b){return a.start-b.start}),d._total=d.reader.total(b),c&&c()}})})},100))},_rangeExists:function(a,b){var c=this,d=c._ranges,e,f;for(e=0,f=d.length;e<f;e++)if(d[e].start<=a&&d[e].end>=b)return!0;return!1}});bp.create=function(a){a=a&&a.push?{data:a}:a;var b=a||{},d=b.data,e=b.fields,f=b.table,h=b.select,i,j,k={},l;!d&&e&&!b.transport&&(f?d=br(f,e):h&&(d=bq(h,e)));if(n.data.Model&&e&&(!b.schema||!b.schema.model)){for(i=0,j=e.length;i<j;i++)l=e[i],l.type&&(k[l.field]=l);g(k)||(b.schema=c(!0,b.schema,{model:{fields:k}}))}b.data=d;return b instanceof bp?b:new bp(b)},c(!0,n.data,{readers:{json:bn},Query:Z,DataSource:bp,ObservableObject:R,ObservableArray:Q,LocalTransport:bk,RemoteTransport:bl,Cache:bm,DataReader:bn,Model:V})}(jQuery),function(a,b){function F(a,b){var c=a.element,d=c[0].kendoBindingTarget;d&&B(c,d.source,b)}function E(b){var c,d;b=a(b);for(c=0,d=b.length;c<d;c++)D(b[c])}function D(a){var b,c,d=a.children;C(a);if(d)for(b=0,c=d.length;b<c;b++)D(d[b])}function C(b){var c=b.kendoBindingTarget;c&&(c.destroy(),a.support.deleteExpando?delete b.kendoBindingTarget:b.removeAttribute?b.removeAttribute("kendoBindingTarget"):b.kendoBindingTarget=null)}function B(b,d,e){var f,g;d=c.observable(d),b=a(b);for(f=0,g=b.length;f<g;f++)A(b[f],d,e)}function A(a,b,d){var e=a.getAttribute("data-"+c.ns+"role"),f,g=a.getAttribute("data-"+c.ns+"bind"),h=a.children,i=!0,j,k={},l;d||(d=c.ui),(e||g)&&C(a),e&&(l=v(e,a,d)),g&&(g=y(g.replace(x,"")),l||(k=c.parseOptions(a,{textField:"",valueField:"",template:"",valueUpdate:n}),l=new s(a,k)),l.source=b,j=z(g,b,o),k.template&&(j.template=new q(b,"",k.template)),j.click&&(g.events=g.events||{},g.events.click=g.click,delete j.click),j.source&&(i=!1),g.attr&&(j.attr=z(g.attr,b,o)),g.style&&(j.style=z(g.style,b,o)),g.events&&(j.events=z(g.events,b,p)),l.bind(j)),l&&(a.kendoBindingTarget=l);if(i&&h)for(f=0;f<h.length;f++)A(h[f],b,d)}function z(a,b,c){var d,e={};for(d in a)e[d]=new c(b,a[d]);return e}function y(a){var b={},c,d,e,f,g,h,i;i=a.match(w);for(c=0,d=i.length;c<d;c++)e=i[c],f=e.indexOf(":"),g=e.substring(0,f),h=e.substring(f+1),h.charAt(0)=="{"&&(h=y(h)),b[g]=h;return b}function v(a,b,d){var e=d.roles[a];if(e)return new t(c.initWidget(b,e.options,d))}function u(a){var b,c,d=[];for(b=0,c=a.length;b<c;b++)a[b].hasSubgroups?d=d.concat(u(a[b].items)):d=d.concat(a[b].items);return d}var c=window.kendo,d=c.Observable,e=c.data.ObservableObject,f=c.data.ObservableArray,g={}.toString,h={},i=c.Class,j,k=a.proxy,l="value",m="checked",n="change";(function(){var a=document.createElement("a");a.innerText!==undefined?j="innerText":a.textContent!==undefined&&(j="textContent")})();var o=d.extend({init:function(a,b){var c=this;d.fn.init.call(c),c.source=a,c.path=b,c.dependencies={},c.dependencies[b]=!0,c.observable=c.source instanceof d,c._access=function(a){c.dependencies[a.field]=!0},c.observable&&(c._change=function(a){c.change(a)},c.source.bind(n,c._change))},change:function(a){var b,c,d,e=this;if(e.path==="this")e.trigger(n,a);else for(b in e.dependencies){c=b.indexOf(a.field);if(c===0){d=b.charAt(a.field.length);if(!d||d==="."||d==="["){e.trigger(n,a);break}}}},start:function(){this.observable&&this.source.bind("get",this._access)},stop:function(){this.observable&&this.source.unbind("get",this._access)},get:function(){var a=this,b=a.source,c,d=a.path,f=b;a.start();if(a.observable){f=b.get(d);while(f===undefined&&b)b=b.parent(),b instanceof e&&(f=b.get(d));typeof f=="function"&&(c=d.lastIndexOf("."),c>0&&(b=b.get(d.substring(0,c))),f=k(f,b),f=f(a.source))}a.stop();return f},set:function(a){this.source.set(this.path,a)},destroy:function(){this.observable&&this.source.unbind(n,this._change)}}),p=o.extend({get:function(){var a=this.source,b=this.path,c;c=a.get(b);while(!c&&a)a=a.parent(),a instanceof e&&(c=a.get(b));return k(c,a)}}),q=o.extend({init:function(a,b,c){var d=this;o.fn.init.call(d,a,b),d.template=c},render:function(a){var b;this.start(),b=c.render(this.template,a),this.stop();return b}}),r=i.extend({init:function(a,b,c){this.element=a,this.bindings=b,this.options=c},bind:function(a,b){var c=this;a=b?a[b]:a,a.bind(n,function(a){c.refresh(b||a)}),c.refresh(b)},destroy:function(){}});h.attr=r.extend({refresh:function(a){this.element.setAttribute(a,this.bindings.attr[a].get())}}),h.style=r.extend({refresh:function(a){this.element.style[a]=this.bindings.style[a].get()}}),h.enabled=r.extend({refresh:function(){this.bindings.enabled.get()?this.element.removeAttribute("disabled"):this.element.setAttribute("disabled","disabled")}}),h.disabled=r.extend({refresh:function(){this.bindings.disabled.get()?this.element.setAttribute("disabled","disabled"):this.element.removeAttribute("disabled")}}),h.events=r.extend({init:function(a,b,c){r.fn.init.call(this,a,b,c),this.handlers={}},refresh:function(b){var c=this.bindings.events[b],d=this.handlers[b]=c.get();a(this.element).bind(b,c.source,d)},destroy:function(){var b=a(this.element),c;for(c in this.handlers)b.unbind(c,this.handlers[c])}}),h.text=r.extend({refresh:function(){var a=this.bindings.text.get();a==null&&(a=""),this.element[j]=a}}),h.visible=r.extend({refresh:function(){this.bindings.visible.get()?this.element.style.display="":this.element.style.display="none"}}),h.invisible=r.extend({refresh:function(){this.bindings.invisible.get()?this.element.style.display="none":this.element.style.display=""}}),h.html=r.extend({refresh:function(){this.element.innerHTML=this.bindings.html.get()}}),h.value=r.extend({init:function(b,c,d){r.fn.init.call(this,b,c,d),this._change=k(this.change,this),this.eventName=d.valueUpdate||n,a(this.element).bind(this.eventName,this._change),this._initChange=!1},change:function(){this._initChange=this.eventName!=n,this.bindings[l].set(this.element.value)},refresh:function(){if(!this._initChange){var a=this.bindings[l].get();a==null&&(a=""),this.element.value=a}this._initChange=!1},destroy:function(){a(this.element).unbind(this.eventName,this._change)}}),h.source=r.extend({init:function(a,b,c){r.fn.init.call(this,a,b,c)},refresh:function(a){var b=this,c=b.bindings.source.get();c instanceof f?(a=a||{},a.action=="add"?b.add(a.index,a.items):a.action=="remove"?b.remove(a.index,a.items):a.action!="itemchange"&&b.render()):b.render()},container:function(){var a=this.element;a.nodeName.toLowerCase()=="table"&&(a.tBodies[0]||a.appendChild(document.createElement("tbody")),a=a.tBodies[0]);return a},template:function(){var a=this.options,b=a.template,d=this.container().nodeName.toLowerCase();b||(d=="select"?a.valueField||a.textField?b=c.format('<option value="#:{0}#">#:{1}#</option>',a.valueField||a.textField,a.textField||a.valueField):b="<option>#:data#</option>":d=="tbody"?b="<tr><td>#:data#</td></tr>":d=="ul"||d=="ol"?b="<li>#:data#</li>":b="#:data#",b=c.template(b));return b},destroy:function(){var a=this.bindings.source.get();a.unbind(n,this._change)},add:function(b,d){var e=this.container(),f,g,h,i=e.cloneNode(!1),j=e.children[b];a(i).html(c.render(this.template(),d));if(i.children.length)for(f=0,g=d.length;f<g;f++)h=i.children[0],e.insertBefore(h,j||null),A(h,d[f])},remove:function(a,b){var c,d=this.container();for(c=0;c<b.length;c++)d.removeChild(d.children[a])},render:function(){var b=this.bindings.source.get(),d,e,h=this.container(),i=this.template(),j;!(b instanceof f)&&g.call(b)!=="[object Array]"&&(b.parent&&(j=b.parent),b=new f([b]),b.parent&&(b.parent=j));if(this.bindings.template){a(h).html(this.bindings.template.render(b));if(h.children.length)for(d=0,e=b.length;d<e;d++)A(h.children[d],b[d])}else a(h).html(c.render(i,b))}}),h.input={checked:r.extend({init:function(b,c,d){r.fn.init.call(this,b,c,d),this._change=k(this.change,this),a(this.element).change(this._change)},change:function(){var a=this.element,b=this.value();if(a.type=="radio")this.bindings[m].set(b);else if(a.type=="checkbox"){var c=this.bindings[m].get(),d;c instanceof f?b!==!1&&b!==!0&&(d=c.indexOf(b),d>-1?c.splice(d,1):c.push(b)):this.bindings[m].set(b)}},refresh:function(){var a=this.bindings[m].get(),b=this.element;b.type=="checkbox"?(a instanceof f&&a.indexOf(this.value(b))>=0&&(a=!0),b.checked=a===!0):b.type=="radio"&&a!=null&&b.value===a.toString()&&(b.checked=!0)},value:function(){var a=this.element,b=a.value;a.type=="checkbox"&&(b=="on"||b=="off")&&(b=a.checked);return b},destroy:function(){a(this.element).unbind(n,this._change)}})},h.select={value:r.extend({init:function(b,c,d){r.fn.init.call(this,b,c,d),this._change=k(this.change,this),a(this.element).change(this._change)},change:function(){var a=[],b=this.element,c,d=this.options.valueField||this.options.textField,g,h,i,j,k;for(j=0,k=b.options.length;j<k;j++)g=b.options[j],g.selected&&(i=g.attributes.value,i&&i.specified?i=g.value:i=g.text,a.push(i));if(d){c=this.bindings.source.get();for(h=0;h<a.length;h++)for(j=0,k=c.length;j<k;j++)if(c[j].get(d)==a[h]){a[h]=c[j];break}}i=this.bindings[l].get(),i instanceof f?i.splice.apply(i,[0,i.length].concat(a)):i instanceof e||!d?this.bindings[l].set(a[0]):this.bindings[l].set(a[0].get(d))},refresh:function(){var a,b=this.element,c=b.options,d=this.bindings[l].get(),g=d,h=this.options.valueField||this.options.textField,i;g instanceof f||(g=new f([d]));for(var j=0;j<g.length;j++){d=g[j],h&&d instanceof e&&(d=d.get(h));for(a=0;a<c.length;a++)i=c[a].value,i===""&&d!==""&&(i=c[a].text),i==d&&(c[a].selected=!0)}},destroy:function(){a(this.element).unbind(n,this._change)}})},h.widget={events:r.extend({init:function(a,b,c){r.fn.init.call(this,a.element[0],b,c),this.widget=a,this.handlers={}},refresh:function(a){var b=this.bindings.events[a],c=b.get();this.handlers[a]=function(a){a.data=b.source,c(a)},this.widget.bind(a,this.handlers[a])},destroy:function(){var a;for(a in this.handlers)this.widget.unbind(a,this.handlers[a])}}),checked:r.extend({init:function(a,b,c){r.fn.init.call(this,a.element[0],b,c),this.widget=a,this._change=k(this.change,this),this.widget.bind(n,this._change)},change:function(){this.bindings[m].set(this.value())},refresh:function(){this.widget.check(this.bindings[m].get()===!0)},value:function(){var a=this.element,b=a.value;if(b=="on"||b=="off")b=a.checked;return b},destroy:function(){this.widget.unbind(n,this._change)}}),visible:r.extend({init:function(a,b,c){r.fn.init.call(this,a.element[0],b,c),this.widget=a},refresh:function(){var a=this.bindings.visible.get();this.widget.wrapper[0].style.display=a?"":"none"}}),invisible:r.extend({init:function(a,b,c){r.fn.init.call(this,a.element[0],b,c),this.widget=a},refresh:function(){var a=this.bindings.invisible.get();this.widget.wrapper[0].style.display=a?"none":""}}),enabled:r.extend({init:function(a,b,c){r.fn.init.call(this,a.element[0],b,c),this.widget=a},refresh:function(){this.widget.enable&&this.widget.enable(this.bindings.enabled.get())}}),disabled:r.extend({init:function(a,b,c){r.fn.init.call(this,a.element[0],b,c),this.widget=a},refresh:function(){this.widget.enable&&this.widget.enable(!this.bindings.disabled.get())}}),source:r.extend({init:function(a,b,c){var d=this;r.fn.init.call(d,a.element[0],b,c),d.widget=a,d._dataBinding=k(d.dataBinding,d),d._dataBound=k(d.dataBound,d),d._itemChange=k(d.itemChange,d)},itemChange:function(a){A(a.item[0],a.data,a.ns||c.ui)},dataBinding:function(){var a,b,c=this.widget,d=c.items();for(a=0,b=d.length;a<b;a++)D(d[a])},dataBound:function(a){var b,d,e=this.widget,f=e.items(),g=e.dataSource,h=g.view(),i=a.ns||c.ui,j=g.group()||[];if(f.length){j.length&&(h=u(h));for(b=0,d=h.length;b<d;b++)A(f[b],h[b],i)}},refresh:function(a){var b=this,d,e=b.widget;a=a||{},a.action||(b.destroy(),e.bind("dataBinding",b._dataBinding),e.bind("dataBound",b._dataBound),e.bind("itemChange",b._itemChange),e.dataSource instanceof c.data.DataSource&&(d=b.bindings.source.get(),d instanceof c.data.DataSource?e.setDataSource(d):e.dataSource.data(d)))},destroy:function(){var a=this.widget;a.unbind("dataBinding",this._dataBinding),a.unbind("dataBound",this._dataBound),a.unbind("itemChange",this._itemChange)}}),value:r.extend({init:function(b,c,d){r.fn.init.call(this,b.element[0],c,d),this.widget=b,this._change=a.proxy(this.change,this),this.widget.first(n,this._change);var f=this.bindings.value.get();this._valueIsObservableObject=f==null||f instanceof e},change:function(){var a=this.widget.value(),b,d,e=this.options.dataValueField||this.options.dataTextField;if(e){var f,g=this._valueIsObservableObject;this.bindings.source&&(f=this.bindings.source.get());if(a===""&&g)a=null;else{if(!f||f instanceof c.data.DataSource)f=this.widget.dataSource.view();for(b=0,d=f.length;b<d;b++)if(f[b].get(e)==a){g?a=f[b]:a=f[b].get(e);break}}}this.bindings.value.set(a)},refresh:function(){var a=this.options.dataValueField||this.options.dataTextField,b=this.bindings.value.get();a&&b instanceof e&&(b=b.get(a)),this.widget.value(b)},destroy:function(){this.widget.unbind(n,this._change)}})};var s=i.extend({init:function(a,b){this.target=a,this.options=b,this.toDestroy=[]},bind:function(a){var b=this.target.nodeName.toLowerCase(),c,d=h[b]||{};for(c in a)this.applyBinding(c,a,d)},applyBinding:function(a,b,c){var d=c[a]||h[a],e=this.toDestroy,f,g=b[a];if(d){d=new d(this.target,b,this.options),e.push(d);if(g instanceof o)d.bind(g),e.push(g);else for(f in g)d.bind(g,f),e.push(g[f])}else if(a!=="template")throw new Error("The "+a+" binding is not supported by the "+this.target.nodeName.toLowerCase()+" element")},destroy:function(){var a,b,c=this.toDestroy;for(a=0,b=c.length;a<b;a++)c[a].destroy()}}),t=s.extend({bind:function(a){var b=this,c,d=!1,e=!1;for(c in a)c==l?d=!0:c=="source"?e=!0:b.applyBinding(c,a);e&&b.applyBinding("source",a),d&&b.applyBinding(l,a)},applyBinding:function(a,b){var c=h.widget[a],d=this.toDestroy,e,f=b[a];if(!c)throw new Error("The "+a+" binding is not supported by the "+this.target.options.name+" widget");c=new c(this.target,b,this.target.options),d.push(c);if(f instanceof o)c.bind(f),d.push(f);else for(e in f)c.bind(f,e),d.push(f[e])}}),w=/[A-Za-z0-9_\-]+:(\{([^}]*)\}|[^,}]+)/g,x=/\s/g;c.unbind=E,c.bind=B,c.data.binders=h,c.data.Binder=r,c.notify=F,c.observable=function(a){a instanceof e||(a=new e(a));return a}}(jQuery),function(a,b){var c=window.kendo,d=c.ui.Widget,e="k-invalid-msg",f="k-invalid",g=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,h=/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,i=":input:not(:button,[type=submit],[type=reset])",j="[type=number],[type=range]",k="blur",l="name",m="form",n="novalidate",o=a.proxy,p=function(a,b){typeof b=="string"&&(b=new RegExp("^(?:"+b+")$"));return b.test(a)},q=function(a,b,c){var d=a.val();if(a.filter(b).length&&d!=="")return p(d,c);return!0},r=function(a,c){if(a.length)return a[0].attributes[c]!==b;return!1},s=/(\[|\]|\$|\.|\:|\+)/g,t=d.extend({init:function(a,b){var e=this;d.fn.init.call(e,a,b),e._errorTemplate=c.template(e.options.errorTemplate),e.element.is(m)&&e.element.attr(n,n),e._errors={},e._attachEvents()},options:{name:"Validator",errorTemplate:'<span class="k-widget k-tooltip k-tooltip-validation"><span class="k-icon k-warning"> </span> ${message}</span>',messages:{required:"{0} is required",pattern:"{0} is not valid",min:"{0} should be greater than or equal to {1}",max:"{0} should be smaller than or equal to {1}",step:"{0} is not valid",email:"{0} is not valid email",url:"{0} is not valid URL",date:"{0} is not valid date"},rules:{required:function(a){var b=a.filter("[type=checkbox]").length&&a.attr("checked")!=="checked",c=a.val();return!r(a,"required")||c!==""&&!!c&&!b},pattern:function(a){if(a.filter("[type=text],[type=email],[type=url],[type=tel],[type=search]").filter("[pattern]").length&&a.val()!=="")return p(a.val(),a.attr("pattern"));return!0},min:function(a){if(a.filter(j+",["+c.attr("type")+"=number]").filter("[min]").length&&a.val()!==""){var b=parseFloat(a.attr("min"))||0,d=parseFloat(a.val());return b<=d}return!0},max:function(a){if(a.filter(j+",["+c.attr("type")+"=number]").filter("[max]").length&&a.val()!==""){var b=parseFloat(a.attr("max"))||0,d=parseFloat(a.val());return b>=d}return!0},step:function(a){if(a.filter(j+",["+c.attr("type")+"=number]").filter("[step]").length&&a.val()!==""){var b=parseFloat(a.attr("min"))||0,d=parseFloat(a.attr("step"))||0,e=parseFloat(a.val());return(e-b)*10%(d*10)/100===0}return!0},email:function(a){return q(a,"[type=email],["+c.attr("type")+"=email]",g)},url:function(a){return q(a,"[type=url],["+c.attr("type")+"=url]",h)},date:function(a){if(a.filter("[type^=date],["+c.attr("type")+"=date]").length&&a.val()!=="")return c.parseDate(a.val(),a.attr(c.attr("format")))!==null;return!0}},validateOnBlur:!0},_submit:function(a){if(!this.validate()){a.stopPropagation(),a.stopImmediatePropagation(),a.preventDefault();return!1}return!0},_attachEvents:function(){var b=this;b.element.is(m)&&b.element.submit(o(b._submit,b)),b.options.validateOnBlur&&(b.element.is(i)?b.element.bind(k,function(){b.validateInput(b.element)}):b.element.delegate(i,k,function(){b.validateInput(a(this))}))},validate:function(){var a=this,b,c,d=!1,e;a._errors={};if(!a.element.is(i)){b=a.element.find(i);for(c=0,e=b.length;c<e;c++)a.validateInput(b.eq(c))||(d=!0);return!d}return a.validateInput(a.element)},validateInput:function(b){b=a(b);var d=this,g=d._errorTemplate,h=d._checkValidity(b),i=h.valid,j="."+e,k=b.attr(l)||"",m=c.attr("for"),n=d.element.find(j+"["+m+"="+k.replace(s,"\\$1")+"]").add(b.next(j)).hide(),o;if(!i){o=d._extractMessage(b,h.key),d._errors[k]=o;var p=a(g({message:o})).addClass(e).attr(m,k||"");n.replaceWith(p).length||p.insertAfter(b),p.show()}b.toggleClass(f,!i);return i},_extractMessage:function(b,d){var e=this,f=e.options.messages[d],g=b.attr(l);f=a.isFunction(f)?f(b):f;return c.format(b.attr(c.attr(d+"-msg"))||b.attr("validationMessage")||b.attr("title")||f||"",g,b.attr(d))},_checkValidity:function(a){var b=this.options.rules,c;for(c in b)if(!b[c](a))return{valid:!1,key:c};return{valid:!0}},errors:function(){var a=[],b=this._errors,c;for(c in b)a.push(b[c]);return a}});c.ui.plugin(t)}(jQuery),function(a,b){function M(b){b.preventDefault(),a(f.body).trigger(b.type)}function L(a,b){return a.replace(/ /g,b+" ")}function K(a){return f.elementFromPoint(a.x.client,a.y.client)}function J(b,c){try{return a.contains(b,c)||b==c}catch(d){return!1}}var c=window.kendo,d=c.support,e=d.pointers,f=window.document,g=a(f.documentElement),h=c.Class,i=c.ui.Widget,j=c.Observable,k=a.proxy,l=a.extend,m=c.getOffset,n={},o={},p,q="resize",r=d.mobileOS&&d.mobileOS.android,s="mousedown",t="mousemove",u="mouseup mouseleave",v="keyup",w="change",x="dragstart",y="drag",z="dragend",A="dragcancel",B="dragenter",C="dragleave",D="drop",E="start",F="move",G="end",H="cancel",I="tap";d.touch&&(q="orientationchange",s="touchstart",t="touchmove",u="touchend touchcancel"),e&&(q="orientationchange resize",s="MSPointerDown",t="MSPointerMove",u="MSPointerUp MSPointerCancel");var N=h.extend({init:function(a){this.axis=a},start:function(a,b){var c=this,d=a["page"+c.axis];c.startLocation=c.location=d,c.client=a["client"+c.axis],c.velocity=c.delta=0,c.timeStamp=b},move:function(a,b){var c=this,d=a["page"+c.axis];if(!!d||!r)c.delta=d-c.location,c.location=d,c.client=a["client"+c.axis],c.initialDelta=d-c.startLocation,c.velocity=c.delta/(b-c.timeStamp),c.timeStamp=b}}),O=j.extend({init:function(b,e){var f=this,h={},i,m,n="."+c.guid();e=e||{},i=f.filter=e.filter,f.threshold=e.threshold||0,b=a(b),j.fn.init.call(f),h={},h[L(t,n)]=k(f._move,f),h[L(u,n)]=k(f._end,f),l(f,{x:new N("X"),y:new N("Y"),element:b,surface:e.global?g:b,stopPropagation:e.stopPropagation,pressed:!1,eventMap:h,ns:n}),b.on(s,i,k(f._start,f)).on("dragstart",i,c.preventDefault);if(!e.allowSelection){var o=["mousedown selectstart",i,M];i instanceof a&&o.splice(2,0,null),b.on.apply(b,o)}d.eventCapture&&(m=function(a){f.moved&&a.preventDefault()},f.surface[0].addEventListener(d.mouseup,m,!0)),f.bind([I,E,F,G,H],e)},capture:function(){O.captured=!0},cancel:function(){this._cancel(),this.trigger(H)},skip:function(){this._cancel()},_cancel:function(){var a=this;a.moved=a.pressed=!1,a.surface.off(a.ns)},_start:function(b){var c=this,f=c.filter,g=b.originalEvent,h,i=b;if(!c.pressed){f?c.target=a(b.target).is(f)?a(b.target):a(b.target).closest(f):c.target=c.element;if(!c.target.length)return;c.stopPropagation&&b.stopPropagation(),c.pressed=!0,c.moved=!1,d.touch&&(h=g.changedTouches[0],c.touchID=h.identifier,i=h),e&&(c.touchID=g.pointerId,i=g),c._perAxis(E,i,b.timeStamp),c.surface.off(c.eventMap).on(c.eventMap),O.captured=!1}},_move:function(a){var b=this,c,d,e;!b.pressed||b._withEvent(a,function(f){b._perAxis(F,f,a.timeStamp);if(!b.moved){c=b.x.initialDelta,d=b.y.initialDelta,e=Math.sqrt(c*c+d*d);if(e<=b.threshold)return;if(!O.captured)b._trigger(E,a),b.moved=!0;else return b._cancel()}b.pressed&&b._trigger(F,a)})},_end:function(a){var b=this;!b.pressed||b._withEvent(a,function(){b.moved?(b._trigger(G,a),b.moved=!1):b._trigger(I,a),b._cancel()})},_perAxis:function(a,b,c){this.x[a](b,c),this.y[a](b,c)},_trigger:function(a,b){var c={x:this.x,y:this.y,target:this.target,event:b};this.trigger(a,c)&&b.preventDefault()},_withEvent:function(a,b){var c=this,f=c.touchID,g=a.originalEvent,h,i;if(d.touch){h=g.changedTouches,i=h.length;while(i){i--;if(h[i].identifier===f)return b(h[i])}}else{if(!e)return b(a);if(f===g.pointerId)return b(g)}}}),P=j.extend({init:function(b,c){var d=this,e=b[0];d.capture=!1,e.addEventListener(s,k(d._press,d),!0),a.each(u.split(" "),function(){e.addEventListener(this,k(d._release,d),!0)}),j.fn.init.call(d),d.bind(["press","release"],c||{})},_press:function(a){var b=this;b.trigger("press"),b.capture&&a.preventDefault()},_release:function(a){var b=this;b.trigger("release"),b.capture&&(a.preventDefault(),b.cancelCapture())},captureNext:function(){this.capture=!0},cancelCapture:function(){this.capture=!1}}),Q=j.extend({init:function(b){var c=this;j.fn.init.call(c),a.extend(c,b),c.max=0,c.horizontal?(c.measure="width",c.scrollSize="scrollWidth",c.axis="x"):(c.measure="height",c.scrollSize="scrollHeight",c.axis="y")},outOfBounds:function(a){return a>this.max||a<this.min},present:function(){return this.max-this.min},update:function(a){var b=this;b.size=b.container[b.measure](),b.total=b.element[0][b.scrollSize],b.min=Math.min(b.max,b.size-b.total),a||b.trigger(w,b)}}),R=j.extend({init:function(b){var c=this,e=k(c.refresh,c),f=e;j.fn.init.call(c),d.mobileOS.android&&(f=function(){setTimeout(e,200)}),c.x=new Q(l({horizontal:!0},b)),c.y=new Q(l({horizontal:!1},b)),c.bind(w,b),a(window).bind(q,f)},refresh:function(){this.x.update(),this.y.update(),this.trigger(w)}}),S=j.extend({init:function(a){var b=this;l(b,a),j.fn.init.call(b)},dragMove:function(a){var b=this,c=b.dimension,d=b.axis,e=b.movable,f=e[d]+a;if(!!c.present()){if(f<c.min&&a<0||f>c.max&&a>0)a*=b.resistance;e.translateAxis(d,a),b.trigger(w,b)}}}),T=h.extend({init:function(a){var b=this,c,d,e;l(b,{elastic:!0},a),e=b.elastic?.5:0,b.x=c=new S({axis:"x",dimension:b.dimensions.x,resistance:e,movable:b.movable}),b.y=d=new S({axis:"y",dimension:b.dimensions.y,resistance:e,movable:b.movable}),b.drag.bind(["move","end"],{move:function(a){c.dimension.present()||d.dimension.present()?(c.dragMove(a.x.delta),d.dragMove(a.y.delta),a.preventDefault()):b.drag.skip()},end:function(a){a.preventDefault()}})}}),U=d.transitions.prefix+"Transform",V=Math.round,W;d.hasHW3D?W=function(a,b){return"translate3d("+V(a)+"px,"+V(b)+"px,0)"}:W=function(a,b){return"translate("+V(a)+"px,"+V(b)+"px)"};var X=j.extend({init:function(b){var c=this;j.fn.init.call(c),c.element=a(b),c.x=0,c.y=0,c._saveCoordinates(W(c.x,c.y))},translateAxis:function(a,b){this[a]+=b,this.refresh()},translate:function(a){this.x+=a.x,this.y+=a.y,this.refresh()},moveAxis:function(a,b){this[a]=b,this.refresh()},moveTo:function(a){l(this,a),this.refresh()},refresh:function(){var a=this,b=W(a.x,a.y);b!=a.coordinates&&(a.element[0].style[U]=b,a._saveCoordinates(b),a.trigger(w))},_saveCoordinates:function(a){this.coordinates=a}}),Y=i.extend({init:function(a,b){var c=this;i.fn.init.call(c,a,b);var d=c.options.group;d in o?o[d].push(c):o[d]=[c]},events:[B,C,D],options:{name:"DropTarget",group:"default"},_trigger:function(a,b){var c=this,d=n[c.options.group];if(d)return c.trigger(a,l({},b.event,{draggable:d}))},_over:function(a){this._trigger(B,a)},_out:function(a){this._trigger(C,a)},_drop:function(a){var b=this,c=n[b.options.group];c&&(c.dropped=!b._trigger(D,a))}}),Z=i.extend({init:function(a,b){var d=this;i.fn.init.call(d,a,b),d.drag=new O(d.element,{global:!0,stopPropagation:!0,filter:d.options.filter,threshold:d.options.distance,start:k(d._start,d),move:k(d._drag,d),end:k(d._end,d),cancel:k(d._cancel,d)}),d.destroy=k(d._destroy,d),d.captureEscape=function(a){a.keyCode===c.keys.ESC&&(d._trigger(A,{event:a}),d.drag.cancel())}},events:[x,y,z,A],options:{name:"Draggable",distance:5,group:"default",cursorOffset:null,dropped:!1},_start:function(b){var c=this,d=c.options,e=d.hint;c.currentTarget=c.drag.target,c.currentTargetOffset=m(c.currentTarget);if(e){c.hint=a.isFunction(e)?a(e(c.currentTarget)):e;var g=m(c.currentTarget);c.hintOffset=g,c.hint.css({position:"absolute",zIndex:2e4,left:g.x,top:g.y}).appendTo(f.body)}n[d.group]=c,c.dropped=!1,c._trigger(x,b)&&(c.drag.cancel(),c.destroy()),a(f).on(v,c.captureEscape)},updateHint:function(a){var b=this,c,d=b.options.cursorOffset;d?c={left:a.x.location+d.left,top:a.y.location+d.top}:(b.hintOffset.left+=a.x.delta,b.hintOffset.top+=a.y.delta,c=b.hintOffset),b.hint.css(c)},_drag:function(a){var b=this;a.preventDefault(),b._withDropTarget(a,function(b){if(!b)p&&(p._trigger(C,a),p=null);else{if(p){if(b.element[0]===p.element[0])return;p._trigger(C,a)}b._trigger(B,a),p=b}}),b._trigger(y,a),b.hint&&b.updateHint(a)},_end:function(a){var b=this;b._withDropTarget(a,function(b){b&&(b._drop(a),p=null)}),b._trigger(z,a),b._cancel(a.event)},_cancel:function(a){var b=this;b.hint&&!b.dropped?b.hint.animate(b.currentTargetOffset,"fast",b.destroy):b.destroy()},_trigger:function(a,b){var c=this;return c.trigger(a,l({},b.event,{x:b.x,y:b.y,currentTarget:c.currentTarget}))},_withDropTarget:function(b,c){var d=this,e,f,g=d.options,h=o[g.group];h&&h.length&&(e=K(b),d.hint&&J(d.hint,e)&&(d.hint.hide(),e=K(b),d.hint.show()),a.each(h,function(){var a=this,b=a.element[0];if(J(b,e)){f=a;return!1}}),c(f))},_destroy:function(){var b=this;b.hint&&b.hint.remove(),delete n[b.options.group],b.trigger("destroy"),a(f).off(v,b.captureEscape)}});c.ui.plugin(Y),c.ui.plugin(Z),c.Drag=O,c.Tap=P,l(c.ui,{Pane:T,PaneDimensions:R,Movable:X})}(jQuery),function(a,b){var c=window.kendo,d=c.mobile,e=c.fx,f=d.ui,g=a.proxy,h=a.extend,i=f.Widget,j=c.Class,k=c.ui.Movable,l=c.ui.Pane,m=c.ui.PaneDimensions,n=e.Transition,o=e.Animation,p=500,q=.7,r=.93,s=.5,t="km-scroller-release",u="km-scroller-refresh",v="pull",w="change",x="resize",y="scroll",z=o.extend({init:function(a){var b=this;o.fn.init.call(b),h(b,a,{transition:new n({axis:a.axis,movable:a.movable,onEnd:function(){b._end()}})}),b.tap.bind("press",function(){b.cancel()}),b.drag.bind("end",g(b.start,b)),b.drag.bind("tap",g(b.onEnd,b))},onCancel:function(){this.transition.cancel()},freeze:function(a){var b=this;b.cancel(),b._moveTo(a)},onEnd:function(){var a=this;a._outOfBounds()?a._snapBack():a._end()},done:function(){return Math.abs(this.velocity)<1},start:function(){var a=this;!a.dimension.present()||(a._outOfBounds()?a._snapBack():(a.velocity=a.drag[a.axis].velocity*16,a.velocity&&(a.tap.captureNext(),o.fn.start.call(a))))},tick:function(){var a=this,b=a.dimension,c=a._outOfBounds()?s:r,d=a.velocity*=c,e=a.movable[a.axis]+d;!a.elastic&&b.outOfBounds(e)&&(e=Math.max(Math.min(e,b.max),b.min),a.velocity=0),a.movable.moveAxis(a.axis,e)},_end:function(){this.tap.cancelCapture(),this.end()},_outOfBounds:function(){return this.dimension.outOfBounds(this.movable[this.axis])},_snapBack:function(){var a=this,b=a.dimension,c=a.movable[a.axis]>b.max?b.max:b.min;a._moveTo(c)},_moveTo:function(a){this.transition.moveTo({location:a,duration:p,ease:n.easeOutExpo})}}),A=j.extend({init:function(b){var c=this,d=b.axis==="x",e=a('<div class="km-touch-scrollbar km-'+(d?"horizontal":"vertical")+'-scrollbar" />');h(c,b,{element:e,elementSize:0,movable:new k(e),scrollMovable:b.movable,size:d?"width":"height"}),c.scrollMovable.bind(w,g(c._move,c)),c.container.append(e)},_move:function(){var a=this,b=a.axis,c=a.dimension,d=c.size,e=a.scrollMovable,f=d/c.total,g=Math.round(-e[b]*f),h=Math.round(d*f);g+h>d?h=d-g:g<0&&(h+=g,g=0),a.elementSize!=h&&(a.element.css(a.size,h+"px"),a.elementSize=h),a.movable.moveAxis(b,g)},show:function(){this.element.css({opacity:q,visibility:"visible"})},hide:function(){this.element.css({opacity:0})}}),B=i.extend({init:function(a,b){var d=this;i.fn.init.call(d,a,b),a=d.element,a.css("overflow","hidden").addClass("km-scroll-wrapper").wrapInner('<div class="km-scroll-container"/>');var e=a.children().first(),f=new c.Tap(a),g=new k(e),j=new m({element:e,container:a,change:function(){d.trigger(x)}}),n=new c.Drag(a,{allowSelection:!0,start:function(a){j.refresh(),n.capture()}}),o=new l({movable:g,dimensions:j,drag:n,elastic:d.options.elastic});g.bind(w,function(){d.scrollTop=-g.y,d.scrollLeft=-g.x,d.trigger(y,{scrollTop:d.scrollTop,scrollLeft:d.scrollLeft})}),h(d,{movable:g,dimensions:j,drag:n,pane:o,tap:f,pulled:!1,scrollElement:e}),d._initAxis("x"),d._initAxis("y"),j.refresh(),d.options.pullToRefresh&&d._initPullToRefresh()},scrollHeight:function(){return this.scrollElement[0].scrollHeight},scrollWidth:function(){return this.scrollElement[0].scrollWidth},options:{name:"Scroller",pullOffset:140,elastic:!0,pullTemplate:"Pull to refresh",releaseTemplate:"Release to refresh",refreshTemplate:"Refreshing"},events:[v,y,x],setOptions:function(a){var b=this;i.fn.setOptions.call(b,a),a.pullToRefresh&&b._initPullToRefresh()},reset:function(){this.movable.moveTo({x:0,y:0})},scrollTo:function(a,b){this.movable.moveTo({x:a,y:b})},pullHandled:function(){var a=this;a.refreshHint.removeClass(u),a.hintContainer.html(a.pullTemplate({})),a.yinertia.onEnd(),a.xinertia.onEnd()},_initPullToRefresh:function(){var a=this;a.pullTemplate=c.template(a.options.pullTemplate),a.releaseTemplate=c.template(a.options.releaseTemplate),a.refreshTemplate=c.template(a.options.refreshTemplate),a.scrollElement.prepend('<span class="km-scroller-pull"><span class="km-icon"></span><span class="km-template">'+a.pullTemplate({})+"</span></span>"),a.refreshHint=a.scrollElement.children().first(),a.hintContainer=a.refreshHint.children(".km-template"),a.pane.y.bind("change",g(a._paneChange,a)),a.drag.bind("end",g(a._dragEnd,a))},_dragEnd:function(){var a=this;!a.pulled||(a.pulled=!1,a.refreshHint.removeClass(t).addClass(u),a.hintContainer.html(a.refreshTemplate({})),a.trigger("pull"),a.yinertia.freeze(a.options.pullOffset/2))},_paneChange:function(){var a=this;a.movable.y/s>a.options.pullOffset?a.pulled||(a.pulled=!0,a.refreshHint.removeClass(u).addClass(t),a.hintContainer.html(a.releaseTemplate({}))):a.pulled&&(a.pulled=!1,a.refreshHint.removeClass(t),a.hintContainer.html(a.pullTemplate({})))},_initAxis:function(a){var b=this,c=b.movable,d=b.dimensions[a],e=b.tap,f=new A({axis:a,movable:c,dimension:d,container:b.element}),g=new z({axis:a,movable:c,tap:e,drag:b.drag,dimension:d,elastic:b.options.elastic,end:function(){f.hide()}});b[a+"inertia"]=g,b.pane[a].bind(w,function(){f.show()})}});f.plugin(B)}(jQuery),function(a,b){function k(a){return a.position().top+3}var c=window.kendo,d=c.ui.Widget,e=a.proxy,f="Drag a column header and drop it here to group by that column",g=c.template('<div class="k-group-indicator" data-#=data.ns#field="${data.field}" data-#=data.ns#title="${data.title || ""}" data-#=data.ns#dir="${data.dir || "asc"}"><a href="\\#" class="k-link"><span class="k-icon k-arrow-${(data.dir || "asc") == "asc" ? "up" : "down"}-small">(sorted ${(data.dir || "asc") == "asc" ? "ascending": "descending"})</span>${data.title ? data.title: data.field}</a><a class="k-button k-button-icon k-button-bare"><span class="k-icon k-group-delete"></span></a></div>',{useWithBlock:!1}),h=function(b){return a('<div class="k-header k-drag-clue" />').css({width:b.width(),paddingLeft:b.css("paddingLeft"),paddingRight:b.css("paddingRight"),lineHeight:b.height()+"px",paddingTop:b.css("paddingTop"),paddingBottom:b.css("paddingBottom")}).html(b.attr(c.attr("title"))||b.attr(c.attr("field"))).prepend('<span class="k-icon k-drag-status k-denied" />')},i=a('<div class="k-grouping-dropclue"/>'),j=/(\[|\]|\$|\.|\:|\+)/g,l=d.extend({init:function(b,f){var g=this,j,l=c.guid(),m=e(g._intializePositions,g),n,o=g._dropCuePositions=[];d.fn.init.call(g,b,f),n=g.options.draggable||new c.ui.Draggable(g.element,{filter:g.options.filter,hint:h,group:l}),j=g.groupContainer=a(g.options.groupContainer,g.element).kendoDropTarget({group:n.options.group,dragenter:function(a){g._canDrag(a.draggable.currentTarget)&&(a.draggable.hint.find(".k-drag-status").removeClass("k-denied").addClass("k-add"),i.css({top:k(j),left:0}).appendTo(j))},dragleave:function(a){a.draggable.hint.find(".k-drag-status").removeClass("k-add").addClass("k-denied"),i.remove()},drop:function(b){var d=b.draggable.currentTarget,e=d.attr(c.attr("field")),f=d.attr(c.attr("title")),h=g.indicator(e),j=g._dropCuePositions,k=j[j.length-1],l;if(!!d.hasClass("k-group-indicator")||!!g._canDrag(d))k?(l=g._dropCuePosition(i.offset().left+parseInt(k.element.css("marginLeft"),10)+parseInt(k.element.css("marginRight"),10)),l&&g._canDrop(a(h),l.element,l.left)&&(l.before?l.element.before(h||g.buildIndicator(e,f)):l.element.after(h||g.buildIndicator(e,f)),g._change())):(g.groupContainer.append(g.buildIndicator(e,f)),g._change())}}).kendoDraggable({filter:"div.k-group-indicator",hint:h,group:n.options.group,dragcancel:e(g._dragCancel,g),dragstart:function(a){var b=a.currentTarget,c=parseInt(b.css("marginLeft"),10),d=b.position().left-c;m(),i.css({top:k(j),left:d}).appendTo(j),this.hint.find(".k-drag-status").removeClass("k-denied").addClass("k-add")},dragend:function(){g._dragEnd(this)},drag:e(g._drag,g)}).delegate(".k-button","click",function(b){b.preventDefault(),g._removeIndicator(a(this).parent())}).delegate(".k-link","click",function(b){var d=a(this).parent(),e=g.buildIndicator(d.attr(c.attr("field")),d.attr(c.attr("title")),d.attr(c.attr("dir"))=="asc"?"desc":"asc");d.before(e).remove(),g._change(),b.preventDefault()}),n.bind(["dragend","dragcancel","dragstart","drag"],{dragend:function(){g._dragEnd(this)},dragcancel:e(g._dragCancel,g),dragstart:function(a){var b,c,d;!g.options.allowDrag&&!g._canDrag(a.currentTarget)?a.preventDefault():(m(),o.length?(b=o[o.length-1].element,c=parseInt(b.css("marginRight"),10),d=b.position().left+b.outerWidth()+c):d=0)},drag:e(g._drag,g)}),g.dataSource=g.options.dataSource,g.dataSource&&(g._refreshHandler=e(g.refresh,g),g.dataSource.bind("change",g._refreshHandler))},refresh:function(){var b=this,d=b.dataSource;b.groupContainer.empty().append(a.map(d.group()||[],function(a){var d=a.field.replace(j,"\\$1"),e=b.element.find(b.options.filter).filter("["+c.attr("field")+"="+d+"]");return b.buildIndicator(a.field,e.attr(c.attr("title")),a.dir)}).join("")),b._invalidateGroupContainer()},destroy:function(){var a=this;a.dataSource&&a._refreshHandler&&a.dataSource.unbind("change",a._refreshHandler)},options:{name:"Groupable",filter:"th"},indicator:function(b){var d=a(".k-group-indicator",this.groupContainer);return a.grep(d,function(d){return a(d).attr(c.attr("field"))===b})[0]},buildIndicator:function(a,b,d){return g({field:a,dir:d,title:b,ns:c.ns})},descriptors:function(){var b=this,d=a(".k-group-indicator",b.groupContainer),e,f,g,h,i;e=b.element.find(b.options.filter).map(function(){var b=a(this),d=b.attr(c.attr("aggregates")),e=b.attr(c.attr("field"));if(d&&d!==""){f=d.split(","),d=[];for(h=0,i=f.length;h<i;h++)d.push({field:e,aggregate:f[h]})}return d}).toArray();return a.map(d,function(b){b=a(b),g=b.attr(c.attr("field"));return{field:g,dir:b.attr(c.attr("dir")),aggregates:e||[]}})},_removeIndicator:function(a){var b=this;a.remove(),b._invalidateGroupContainer(),b._change()},_change:function(){var a=this;a.dataSource&&a.dataSource.group(a.descriptors())},_dropCuePosition:function(b){var c=this._dropCuePositions;if(!!i.is(":visible")&&c.length!==0){b=Math.ceil(b);var d=c[c.length-1],e=d.right,f=parseInt(d.element.css("marginLeft"),10),g=parseInt(d.element.css("marginRight"),10);b>=e?b={left:d.element.position().left+d.element.outerWidth()+g,element:d.element,before:!1}:(b=a.grep(c,function(a){return a.left<=b&&b<=a.right})[0],b&&(b={left:b.element.position().left-f,element:b.element,before:!0}));return b}},_drag:function(a){var b=c.touchLocation(a),d=this._dropCuePosition(b.x);d&&i.css({left:d.left})},_canDrag:function(a){return a.attr(c.attr("groupable"))!="false"&&!this.indicator(a.attr(c.attr("field")))},_canDrop:function(a,b,c){var d=a.next();return a[0]!==b[0]&&(!d[0]||b[0]!==d[0]||c>d.position().left)},_dragEnd:function(b){var d=this,e=b.currentTarget.attr(c.attr("field")),f=d.indicator(e);b!==d.options.draggable&&!b.dropped&&f&&d._removeIndicator(a(f)),d._dragCancel()},_dragCancel:function(){i.remove(),this._dropCuePositions=[]},_intializePositions:function(){var b=this,c=a(".k-group-indicator",b.groupContainer),d;b._dropCuePositions=a.map(c,function(b){b=a(b),d=b.offset().left;return{left:parseInt(d,10),right:parseInt(d+b.outerWidth(),10),element:b}})},_invalidateGroupContainer:function(){var a=this.groupContainer;a.is(":empty")&&a.html(f)}});c.ui.plugin(l)}(jQuery),function(a,b){function g(b,c){b=a(b),c?b.find(".k-drag-status").removeClass("k-add").addClass("k-denied"):b.find(".k-drag-status").removeClass("k-denied").addClass("k-add")}var c=window.kendo,d=c.ui.Widget,e="change",f="k-reorderable",h=d.extend({init:function(b,h){var i=this,j,k=c.guid()+"-reorderable";d.fn.init.call(i,b,h),b=i.element.addClass(f),h=i.options,j=h.draggable||new c.ui.Draggable(b,{group:k,filter:h.filter,hint:h.hint}),i.reorderDropCue=a('<div class="k-reorder-cue"><div class="k-icon k-arrow-down"></div><div class="k-icon k-arrow-up"></div></div>'),b.find(j.options.filter).kendoDropTarget({group:j.options.group,dragenter:function(a){if(!!i._draggable){var c=this.element,d=c[0]===i._draggable[0];g(a.draggable.hint,d),d||i.reorderDropCue.css({height:c.outerHeight(),top:b.offset().top,left:c.offset().left+(c.index()>i._draggable.index()?c.outerWidth():0)}).appendTo(document.body)}},dragleave:function(a){g(a.draggable.hint,!0),i.reorderDropCue.remove()},drop:function(){if(!!i._draggable){var a=i._draggable[0],c=this.element[0],d;a!==c&&(d=b.find(j.options.filter),i.trigger(e,{element:i._draggable,oldIndex:d.index(a),newIndex:d.index(c)}))}}}),j.bind(["dragcancel","dragend","dragstart"],{dragcancel:function(){i.reorderDropCue.remove(),i._draggable=null},dragend:function(){i.reorderDropCue.remove(),i._draggable=null},dragstart:function(a){i._draggable=a.currentTarget}})},options:{name:"Reorderable",filter:"*"},events:[e]});c.ui.plugin(h)}(jQuery),function(a,b){var c=window.kendo,d=c.ui,e=d.Widget,f=a.proxy,g=a.isFunction,h=a.extend,i="horizontal",j="vertical",k="start",l="resize",m="resizeend",n=e.extend({init:function(a,b){var c=this;e.fn.init.call(c,a,b),c.orientation=c.options.orientation.toLowerCase()!=j?i:j,c._positionMouse=c.orientation==i?"pageX":"pageY",c._position=c.orientation==i?"left":"top",c._sizingDom=c.orientation==i?"outerWidth":"outerHeight",new d.Draggable(a,{distance:0,filter:b.handle,drag:f(c._resize,c),dragstart:f(c._start,c),dragend:f(c._stop,c)})},events:[l,m,k],options:{name:"Resizable",orientation:i},_max:function(a){var c=this,d=c.hint?c.hint[c._sizingDom]():0,e=c.options.max;return g(e)?e(a):e!==b?c._initialElementPosition+e-d:e},_min:function(a){var c=this,d=c.options.min;return g(d)?d(a):d!==b?c._initialElementPosition+d:d},_start:function(b){var c=this,d=c.options.hint,e=a(b.currentTarget);c._initialMousePosition=b[c._positionMouse],c._initialElementPosition=e.position()[c._position],d&&(c.hint=g(d)?a(d(e)):d,c.hint.css({position:"absolute"}).css(c._position,c._initialElementPosition).appendTo(c.element)),c.trigger(k,b),c._maxPosition=c._max(b),c._minPosition=c._min(b),a(document.body).css("cursor",e.css("cursor"))},_resize:function(c){var d=this,e=a(c.currentTarget),f=d._maxPosition,g=d._minPosition,i=d._initialElementPosition+(c[d._positionMouse]-d._initialMousePosition),j;j=g!==b?Math.max(g,i):i,d.position=j=f!==b?Math.min(f,j):j,d.hint&&d.hint.toggleClass(d.options.invalidClass||"",j==f||j==g).css(d._position,j),d.trigger(l,h(c,{position:j}))},_stop:function(b){var c=this;c.hint&&c.hint.remove(),c.trigger(m,h(b,{position:c.position})),a(document.body).css("cursor","")}});c.ui.plugin(n)}(jQuery),function(a,b){var c=window.kendo,d=a.proxy,e="dir",f="asc",g="single",h="field",i="desc",j=".k-link",k=c.ui.Widget,l=k.extend({init:function(a,b){var c=this,e;k.fn.init.call(c,a,b),c.dataSource=c.options.dataSource.bind("change",d(c.refresh,c)),e=c.element.find(j),e[0]||(e=c.element.wrapInner('<a class="k-link" href="#"/>').find(j)),c.link=e,c.element.click(d(c._click,c))},options:{name:"Sortable",mode:g,allowUnsort:!0},refresh:function(){var b=this,c=b.dataSource.sort()||[],d,g,j,k,l=b.element,m=l.data(h);l.removeData(e);for(d=0,g=c.length;d<g;d++)j=c[d],m==j.field&&l.data(e,j.dir);k=l.data(e),l.find(".k-arrow-up,.k-arrow-down").remove(),k===f?a('<span class="k-icon k-arrow-up" />').appendTo(b.link):k===i&&a('<span class="k-icon k-arrow-down" />').appendTo(b.link)},_click:function(a){var c=this,d=c.element,j=d.data(h),k=d.data(e),l=c.options,m=c.dataSource.sort()||[],n,o;k===f?k=i:k===i&&l.allowUnsort?k=b:k=f;if(l.mode===g)m=[{field:j,dir:k}];else if(l.mode==="multiple"){for(n=0,o=m.length;n<o;n++)if(m[n].field===j){m.splice(n,1);break}m.push({field:j,dir:k})}a.preventDefault(),c.dataSource.sort(m)}});c.ui.plugin(l)}(jQuery),function(a,b){var c=window.kendo,d=c.support.touch,e=c.ui.Widget,f=a.proxy,g=d?"touchend":"mouseup",h=d?"touchstart":"mousedown",i=d?"touchmove":"mousemove",j="k-state-selected",k="k-state-selecting",l="k-selectable",m="selectstart",n=a(document),o="change",p="k-state-unselecting",q=e.extend({init:function(b,c){var d=this;e.fn.init.call(d,b,c),d._marquee=a("<div class='k-marquee'></div>"),d._lastActive=null,d._moveDelegate=f(d._move,d),d._upDelegate=f(d._up,d),d.element.addClass(l),d.element.delegate("."+l+" "+d.options.filter,h,f(d._down,d))},events:[o],options:{name:"Selectable",filter:">*",multiple:!1},_collide:function(a,b){var c=a.offset(),d={left:c.left,top:c.top,right:c.left+a.outerWidth(),bottom:c.top+a.outerHeight()};return!(d.left>b.right||d.right<b.left||d.top>b.bottom||d.bottom<b.top)},_position:function(a){var b=this._originalPosition,c=b.x,d=b.y,e=a.pageX,f=a.pageY,g;c>e&&(g=e,e=c,c=g),d>f&&(g=f,f=d,d=g);return{top:d,right:e,left:c,bottom:f}},_down:function(b){var d=this,e,f=b.ctrlKey,h=b.shiftKey,o=!d.options.multiple;d._downTarget=a(b.currentTarget),d._shiftPressed=h;d._downTarget.closest("."+l)[0]===d.element[0]&&(n.unbind(g,d._upDelegate).bind(g,d._upDelegate),d._originalPosition={x:b.pageX,y:b.pageY},!o&&a(b.target).is(":not(:input)")&&(n.unbind(i,d._moveDelegate).bind(i,d._moveDelegate).unbind(m,!1).bind(m,!1),c.support.touch||b.preventDefault()),o||(a("body").append(d._marquee),d._marquee.css({left:b.clientX+1,top:b.clientY+1,width:0,height:0})),e=d._downTarget.hasClass(j),(o||!f&&!h)&&d.element.find(d.options.filter+"."+j).not(d._downTarget).removeClass(j),f&&(d._lastActive=d._downTarget),e&&(f||h)?(d._downTarget.addClass(j),h||d._downTarget.addClass(p)):(!c.support.touch||!o)&&d._downTarget.addClass(k))},_move:function(b){var c=this,d=c._position(b),e=b.ctrlKey,f,g;c._marquee.css({left:d.left,top:d.top,width:d.right-d.left,height:d.bottom-d.top}),c.element.find(c.options.filter).each(function(){f=a(this),g=c._collide(f,d),g?f.hasClass(j)?c._downTarget[0]!==f[0]&&e&&f.removeClass(j).addClass(p):!f.hasClass(k)&&!f.hasClass(p)&&f.addClass(k):f.hasClass(k)?f.removeClass(k):e&&f.hasClass(p)&&f.removeClass(p).addClass(j)})},_up:function(a){var b=this,d=b.options,e=!d.multiple;n.unbind(m,!1).unbind(i,b._moveDelegate).unbind(g,b._upDelegate),e||b._marquee.remove(),c.support.touch&&e&&b._downTarget.addClass(k),!e&&b._shiftPressed===!0?b.selectRange(b._firstSelectee(),b._downTarget):(b.element.find(d.filter+"."+p).removeClass(p).removeClass(j),b.value(b.element.find(d.filter+"."+k))),b._shiftPressed||(b._lastActive=b._downTarget),b._downTarget=null,b._shiftPressed=!1},value:function(a){var b=this,c=f(b._selectElement,b);if(a)a.each(function(){c(this)}),b.trigger(o,{});else return b.element.find(b.options.filter+"."+j)},_firstSelectee:function(){var a=this,b;if(a._lastActive!==null)return a._lastActive;b=a.value();return b.length>0?b[0]:a.element.find(a.options.filter)},_selectElement:function(b){var c=a(b),d=this.trigger("select",{element:b});c.removeClass(k),d||c.addClass(j)},clear:function(){var a=this;a.element.find(a.options.filter+"."+j).removeClass(j)},selectRange:function(b,c){var d=this,e=!1,g=f(d._selectElement,d),h;b=a(b)[0],c=a(c)[0],d.element.find(d.options.filter).each(function(){h=a(this);if(e)g(this),e=this!==c;else if(this===b)e=b!==c,g(this);else if(this===c){var d=b;b=c,c=d,e=!0,g(this)}else h.removeClass(j)}),d.trigger(o,{})}});c.ui.plugin(q)}(jQuery),function(a,b){function g(a,b,d,e){return a({idx:b,text:d,ns:c.ns,numeric:e})}var c=window.kendo,d=c.ui,e=d.Widget,f=a.proxy,h=e.extend({init:function(b,d){var g=this;e.fn.init.call(g,b,d),d=g.options,g.dataSource=d.dataSource,g.linkTemplate=c.template(g.options.linkTemplate),g.selectTemplate=c.template(g.options.selectTemplate),g._refreshHandler=f(g.refresh,g),g.dataSource.bind("change",g._refreshHandler),g.list=a('<ul class="k-pager k-reset k-numeric" />').appendTo(g.element),g._clickHandler=f(g._click,g),g.element.delegate("a","click",g._clickHandler),g.refresh()},destroy:function(){var a=this;a.element.undelegate("a","click",a._clickHandler),a.dataSource.unbind("change",a._refreshHandler)},events:["change"],options:{name:"Pager",selectTemplate:'<li><span class="k-state-active">#=text#</span></li>',linkTemplate:'<li><a href="\\#" class="k-link" data-#=ns#page="#=idx#">#=text#</a></li>',buttonCount:10},refresh:function(){var a=this,b,c,d=1,e="",f,h=a.page(),i=a.totalPages(),j=a.linkTemplate,k=a.options.buttonCount;h>k&&(f=h%k,d=f===0?h-k+1:h-f+1),c=Math.min(d+k-1,i),d>1&&(e+=g(j,d-1,"...",!1));for(b=d;b<=c;b++)e+=g(b==h?a.selectTemplate:j,b,b,!0);c<i&&(e+=g(j,b,"...",!1)),e===""&&(e=a.selectTemplate({text:1})),a.list.empty().append(e)},_click:function(b){var d=a(b.currentTarget).attr(c.attr("page"));b.preventDefault(),this.dataSource.page(d),this.trigger("change",{index:d})},totalPages:function(){return Math.ceil((this.dataSource.total()||0)/this.pageSize())},pageSize:function(){return this.dataSource.pageSize()||this.dataSource.total()},page:function(){return this.dataSource.page()||1}});d.plugin(h)}(jQuery),function(a,b){function L(b,c){return b===c||a.contains(b,c)}var c=window.kendo,d=c.ui,e=d.Widget,f=c.support,g=f.touch,h=c.getOffset,i=a.browser.msie&&a.browser.version<9,j="open",k="close",l="closed",m="center",n="left",o="right",p="top",q="bottom",r="absolute",s="hidden",t="body",u="location",v="position",w="visible",x="fitted",y="effects",z="k-state-active",A="k-state-border",B=".k-picker-wrap, .k-dropdown-wrap, .k-link",C=g?"touchstart":"mousedown",D=a(document),E=a(window),F=a(document.documentElement),G="resize scroll",H=f.transitions.css,I=H+"transform",J=a.extend,K=["font-family","font-size","font-stretch","font-style","font-weight","line-height"],M=e.extend({init:function(b,d){var f=this;e.fn.init.call(f,b,d),b=f.element,d=f.options,f.collisions=d.collision?d.collision.split(" "):[],f.collisions.length===1&&f.collisions.push(f.collisions[0]),f.element.hide().addClass("k-popup k-group k-reset").css({position:r}).appendTo(a(d.appendTo)).bind("mouseenter mouseleave",function(a){f._hovered=a.type==="mouseenter"}),f.wrapper=a(),d.animation===!1&&(d.animation={open:{show:!0,effects:{}},close:{hide:!0,effects:{}}}),J(d.animation.open,{complete:function(){f.wrapper.css({overflow:w})}}),J(d.animation.close,{complete:function(){f.wrapper.hide();var e=f.wrapper.data(u),g=a(d.anchor),h,i;e&&f.wrapper.css(e),d.anchor!=t&&(h=g.hasClass(A+"-down")?"down":"up",i=A+"-"+h,g.removeClass(i).children(B).removeClass(z).removeClass(i),b.removeClass(A+"-"+c.directions[h].reverse)),f._closing=!1,f.trigger(l)}}),f._mousedownProxy=function(a){f._mousedown(a)},f._currentWidth=D.width(),f._resizeProxy=function(a){f._resize(a)},d.toggleTarget&&a(d.toggleTarget).bind(d.toggleEvent,a.proxy(f.toggle,f))},events:[j,k,l],options:{name:"Popup",toggleEvent:"click",origin:q+" "+n,position:p+" "+n,anchor:t,appendTo:t,collision:"flip fit",animation:{open:{effects:"slideIn:down",transition:!0,duration:200,show:!0},close:{duration:100,show:!1,hide:!0}}},open:function(b,d){var e=this,h={isFixed:!isNaN(parseInt(d,10)),x:b,y:d},i=e.element,k=e.options,l="down",m,n,o=a(k.anchor),q,u;if(!e.visible()){for(u=0;u<K.length;u++)q=K[u],i.css(q,o.css(q));if(i.data("animating")||e.trigger(j))return;F.unbind(C,e._mousedownProxy).bind(C,e._mousedownProxy),g||E.unbind(G,e._resizeProxy).bind(G,e._resizeProxy),e.wrapper=n=c.wrap(i).css({overflow:s,display:"block",position:r}),f.mobileOS.android&&n.add(o).css(I,"translatez(0)"),n.css(v),k.appendTo==t&&n.css(p,"-10000px"),m=J(!0,{},k.animation.open),m.effects=c.parseEffects(m.effects,e._position(window,h)),l=m.effects.slideIn?m.effects.slideIn.direction:l;if(k.anchor!=t){var w=A+"-"+l;i.addClass(A+"-"+c.directions[l].reverse),o.addClass(w).children(B).addClass(z).addClass(w)}i.data(y,m.effects).kendoStop(!0).kendoAnimate(m)}},toggle:function(){var a=this;a[a.visible()?k:j]()},visible:function(){return this.element.is(":"+w)},close:function(){var a=this,b=a.options,d,e,f;if(a.visible()){if(a._closing||a.trigger(k))return;F.unbind(C,a._mousedownProxy),E.unbind(G,a._resizeProxy),d=J(!0,{},b.animation.close),e=a.element.data(y),f=d.effects,a.wrapper=c.wrap(a.element).css({overflow:s}),!f&&!c.size(f)&&e&&c.size(e)&&(d.effects=e,d.reverse=!0),a._closing=!0,a.element.kendoStop(!0).kendoAnimate(d)}},_resize:function(a){var b=this;if(i){var c=D.width();if(c==b._currentWidth)return;b._currentWidth=c}b._hovered||b.close()},_mousedown:function(b){var d=this,e=d.element[0],f=d.options,g=a(f.anchor)[0],h=f.toggleTarget,i=c.eventTarget(b),j=a(i).closest(".k-popup")[0];(!j||j===d.element[0])&&!L(e,i)&&!L(g,i)&&(!h||!L(a(h)[0],i))&&d.close()},_fit:function(a,b,c){var d=0;a+b>c&&(d=c-(a+b)),a<0&&(d=-a);return d},_flip:function(a,b,c,d,e,f,g){var h=0;g=g||b,f!==e&&f!==m&&e!==m&&(a+g>d&&(h+=-(c+b)),a+h<0&&(h+=c+b));return h},_position:function(b,c){b=a(b);var d=this,e=d.element,g=d.wrapper,i=d.options,j=a(i.anchor),k=i.origin.toLowerCase().split(" "),l=i.position.toLowerCase().split(" "),m=d.collisions,n=f.zoomLevel(),o=10002,p=j.parents().filter(g.siblings());if(p[0]){var q=Number(a(p).css("zIndex"));q&&(o=q+1)}g.css("zIndex",o),c&&c.isFixed?g.css({left:c.x,top:c.y}):g.css(d._align(k,l));var r=h(g,v),s=h(g),t=j.offsetParent().parent(".k-animation-container");t.length&&t.data(x)&&(r=h(g,v),s=h(g)),s={top:s.top-(window.pageYOffset||document.documentElement.scrollTop||0),left:s.left-(window.pageXOffset||document.documentElement.scrollLeft||0)},d.wrapper.data(u)||g.data(u,J({},r));var w=J({},s),y=J({},r);m[0]==="fit"&&(y.top+=d._fit(w.top,g.outerHeight(),b.height()/n)),m[1]==="fit"&&(y.left+=d._fit(w.left,g.outerWidth(),b.width()/n)),y.left!=r.left||y.top!=r.top?g.data(x,!0):g.removeData(x);var z=J({},y);m[0]==="flip"&&(y.top+=d._flip(w.top,e.outerHeight(),j.outerHeight(),b.height()/n,k[0],l[0],g.outerHeight())),m[1]==="flip"&&(y.left+=d._flip(w.left,e.outerWidth(),j.outerWidth(),b.width()/n,k[1],l[1],g.outerWidth())),g.css(y);return y.left!=z.left||y.top!=z.top},_align:function(b,c){var d=this,e=d.wrapper,f=a(d.options.anchor),g=b[0],i=b[1],j=c[0],k=c[1],l=h(f),n=a(d.options.appendTo),p,r=e.outerWidth(),s=e.outerHeight(),t=f.outerWidth(),u=f.outerHeight(),v=l.top,w=l.left,x=Math.round;n[0]!=document.body&&(p=h(n),v-=p.top,w-=p.left),g===q&&(v+=u),g===m&&(v+=x(u/2)),j===q&&(v-=s),j===m&&(v-=x(s/2)),i===o&&(w+=t),i===m&&(w+=x(t/2)),k===o&&(w-=r),k===m&&(w-=x(r/2));return{top:v,left:w}}});d.plugin(M)}(jQuery),function(a,b){var c=window.kendo,d=c.ui,e=d.Widget,f=c.keys,g=c.support.touch,h="id",i="li",j=g?"touchend":"click",k="change",l="character",m="k-state-focused",n="k-state-hover",o="k-loading",p="open",q="close",r="select",s=a.extend,t=a.proxy,u=a.browser.msie&&parseInt(a.browser.version,10)<9,v=/"/g,w=e.extend({init:function(b,d){var f=this,g,k;e.fn.init.call(f,b,d),f._template(),f.ul=a('<ul unselectable="on" class="k-list k-reset"/>').css({overflow:c.support.touch?"":"auto"}).delegate(i,"mouseenter",function(){a(this).addClass(n)}).delegate(i,"mouseleave",function(){a(this).removeClass(n)}).delegate(i,j,t(f._click,f)),f.list=k=a("<div class='k-list-container'/>").append(f.ul).mousedown(function(a){a.preventDefault()}),g=f.element.attr(h),g&&k.attr(h,g+"-list"),a(document.documentElement).bind("mousedown",t(f._mousedown,f))},items:function(){return this.ul[0].children},current:function(a){var c=this;if(a!==b)c._current&&c._current.removeClass(m),a&&(a.addClass(m),c._scroll(a)),c._current=a;else return c._current},dataItem:function(a){var c=this;a===b&&(a=c.selectedIndex);return c._data()[a]},_accessors:function(){var a=this,b=a.element,d=a.options,e=c.getter,f=b.attr(c.attr("text-field")),g=b.attr(c.attr("value-field"));f&&(d.dataTextField=f),g&&(d.dataValueField=g),a._text=e(d.dataTextField),a._value=e(d.dataValueField)},_blur:function(){var a=this;a._change(),a.close()},_change:function(){var a=this,c=a.selectedIndex,d=a.value(),e;d!==a._old?e=!0:c!==b&&c!==a._oldIndex&&(e=!0),e&&(a._old=d,a._oldIndex=c,a.trigger(k),a.element.trigger(k))},_click:function(b){b.isDefaultPrevented()||this._accept(a(b.currentTarget))},_data:function(){return this.dataSource.view()},_enable:function(){var a=this,b=a.options;a.element.prop("disabled")&&(b.enable=!1),a.enable(b.enable)},_focus:function(a){var b=this;b.popup.visible()&&b.trigger(r,{item:a})?b.close():(b._select(a),b._blur())},_height:function(a){if(a){var b=this,c=b.list,d=b.popup.visible(),e=b.options.height;c=c.add(c.parent(".k-animation-container")).show().height(b.ul[0].scrollHeight>e?e:"auto"),d||c.hide()}},_adjustListWidth:function(){var b=this.list,c=b[0].style.width,d=this.wrapper,e,f;c||(e=window.getComputedStyle?window.getComputedStyle(d[0],null):0,f=e?parseFloat(e.width):d.outerWidth(),e&&(a.browser.mozilla||a.browser.msie)&&(f+=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight)+parseFloat(e.borderLeftWidth)+parseFloat(e.borderRightWidth)),c=f-(b.outerWidth()-b.width())),b.css({fontFamily:d.css("font-family"),width:c});return!0},_popup:function(){var a=this,b=a.list,e=a.options,f=a.wrapper,g=!1;a.popup=new d.Popup(b,s({},e.popup,{anchor:f,open:function(b){g||(g=a._adjustListWidth()),a.trigger(p)&&b.preventDefault()},close:function(b){a.trigger(q)&&b.preventDefault()},animation:e.animation})),a._touchScroller=c.touchScroller(a.popup.element)},_makeUnselectable:function(a){u&&this.list.find("*").attr("unselectable","on")},_toggleHover:function(b){g||a(b.currentTarget).toggleClass(n,b.type==="mouseenter")},_toggle:function(a){var c=this;a=a!==b?a:!c.popup.visible(),!g&&c._focused[0]!==document.activeElement&&c._focused.focus(),c[a?p:q]()},_scroll:function(a){if(!!a){a[0]&&(a=a[0]);var b=this.ul[0],c=a.offsetTop,d=a.offsetHeight,e=b.scrollTop,f=b.clientHeight,g=c+d;b.scrollTop=e>c?c:g>e+f?g-f:e}},_template:function(){var a=this,b=a.options,d=b.template,e=b.dataSource;a.element.is(r)&&a.element[0].length&&(e||(b.dataTextField=b.dataTextField||"text",b.dataValueField=b.dataValueField||"value")),d?(d=c.template(d),a.template=function(a){return'<li unselectable="on" class="k-item">'+d(a)+"</li>"}):a.template=c.template('<li unselectable="on" class="k-item">${data'+(b.dataTextField?".":"")+b.dataTextField+"}</li>",{useWithBlock:!1})}});s(w,{caret:function(a){var b,c=a.ownerDocument.selection;c?b=Math.abs(c.createRange().moveStart(l,-a.value.length)):b=a.selectionStart;return b},selectText:function(a,b,c){if(a.createTextRange){var d=a.createTextRange();d.collapse(!0),d.moveStart(l,b),d.moveEnd(l,c-b),d.select()}else a.setSelectionRange(b,c)},inArray:function(a,b){var c,d,e=b.children;if(!a||a.parentNode!==b)return-1;for(c=0,d=e.length;c<d;c++)if(a===e[c])return c;return-1}}),c.ui.List=w,d.Select=w.extend({init:function(a,b){w.fn.init.call(this,a,b)},setDataSource:function(a){this.options.dataSource=a,this._dataSource(),this.options.autoBind&&this._selectItem()},close:function(){this.popup.close()},_accessor:function(a,c){var d=this.element,e=d.is(r),f,g;d=d[0];if(a===b){e?(g=d.selectedIndex,g>-1&&(f=d.options[g],f&&(a=f.value))):a=d.value;return a}e?d.selectedIndex=c:d.value=a},_hideBusy:function(){var a=this;clearTimeout(a._busy),a._arrow.removeClass(o)},_showBusy:function(){var a=this;a._busy||(a._busy=setTimeout(function(){a._arrow.addClass(o)},100))},_dataSource:function(){var b=this,d=b.element,e=b.options,f=e.dataSource||{},g;f=a.isArray(f)?{data:f}:f,d.is(r)&&(g=d[0].selectedIndex,g>-1&&(e.index=g),f.select=d,f.fields=[{field:e.dataTextField},{field:e.dataValueField}]),b.dataSource&&b._refreshHandler?b.dataSource.unbind(k,b._refreshHandler).unbind("requestStart",b._requestStartHandler):(b._refreshHandler=t(b.refresh,b),b._requestStartHandler=t(b._showBusy,b)),b.dataSource=c.data.DataSource.create(f).bind(k,b._refreshHandler).bind("requestStart",b._requestStartHandler)},_index:function(a){var c=this,d,e,f=c._data(),g;for(d=0,e=f.length;d<e;d++){g=c._value(f[d]),g===b&&(g=c._text(f[d]));if(g==a)return d}return-1},_get:function(b){var c=this,d=c._data(),e,f;if(typeof b=="function")for(e=0,f=d.length;e<f;e++)if(b(d[e])){b=e;break}if(typeof b=="number"){if(b<0)return a();b=a(c.ul[0].children[b])}b&&b.nodeType&&(b=a(b));return b},_move:function(a){var b=this,c=a.keyCode,d=b.ul[0],e=b._current,g=c===f.DOWN,h;c===f.UP||g?(a.altKey?b.toggle(g):g?(b._select(e?e[0].nextSibling:d.firstChild),a.preventDefault()):(b._select(e?e[0].previousSibling:d.lastChild),a.preventDefault()),h=!0):c===f.ENTER||c===f.TAB?(b.popup.visible()&&a.preventDefault(),b._accept(e),h=!0):c===f.ESC&&(b.close(),h=!0);return h},_valueOnFetch:function(a){var b=this;if(!b.ul[0].firstChild&&!b._fetch){b.dataSource.one(k,function(){b._fetch=!0,b.value(a)}).fetch();return!0}b._fetch=!1},_options:function(a,c){var d=this,e=d.element,f=e[0].selectedIndex,g=a.length,h="",i,j,k,l,m=0;c&&(h=c,m=1);for(;m<g;m++)i="<option",j=a[m],k=d._text(j),l=d._value(j),l!==b&&(l+="",l.indexOf('"')!==-1&&(l=l.replace(v,"&quot;")),i+=' value="'+l+'"'),i+=">",k!==b&&(i+=k),i+="</option>",h+=i;e.html(h),e[0].selectedIndex=f},_reset:function(){var a=this,b=a.element;b.closest("form").bind("reset",function(){setTimeout(function(){a.value(b[0].value)})})}})}(jQuery),function(a,b){function Y(a){m&&a.find("*").attr("unselectable","on")}function X(a){var d=L[a.start],e=L[a.depth],f=a.format||c.culture().calendar.patterns.d;isNaN(d)&&(d=0,a.start=r);if(e===b||e>d)a.depth=r;f.slice(0,3)==="{0:"&&(f=f.slice(3,f.length-1)),a.format=f}function W(a){a.preventDefault()}function V(){a(this).removeClass(w)}function U(){a(this).addClass(w)}function T(a,b,c){b=b instanceof K?b.getFullYear():a.getFullYear()+c*b,a.setFullYear(b)}function S(a,b){return a.slice(b).concat(a.slice(0,b))}function R(a,b,c){return+a>=+b&&+a<=+c}function Q(a,b,c){var d=new K;d=new K(d.getFullYear(),d.getMonth(),d.getDate()),a&&(d=new K(a)),b>d?d=new K(b):c<d&&(d=new K(c));return d}function P(a,b,c){var d=a.getFullYear(),e=b.getFullYear(),f=e,g=0;c&&(e=e-e%c,f=e-e%c+c-1),d>f?g=1:d<e&&(g=-1);return g}function O(a){var b=0,c,d=a.min,e=a.max,f=a.start,g=a.setter,h=a.build,i=a.cells||12,j=a.perRow||4,m=a.content||k,n=a.empty||l,o=a.html||'<table class="k-content k-meta-view" cellspacing="0"><tbody><tr>';for(;b<i;b++)b>0&&b%j===0&&(o+="</tr><tr>"),c=h(f,b),o+=R(f,d,e)?m(c):n(c),g(f,1);return o+"</tr></tbody></table>"}var c=window.kendo,d=c.ui,e=d.Widget,f=c.parseDate,g=c.template,h=c.support.touch,i=c.support.transitions,j=i?i.css+"transform-origin":"",k=g('<td#=data.cssClass#><a class="k-link" href="\\#" data-#=data.ns#value="#=data.dateString#">#=data.value#</a></td>',{useWithBlock:!1}),l=g("<td>&nbsp;</td>",{useWithBlock:!1}),m=a.browser.msie&&parseInt(a.browser.version,10)<9,n=h?"touchend":"click",o="min",p="left",q="slide",r="month",s="century",t="change",u="navigate",v="value",w="k-state-hover",x="k-state-disabled",y="k-other-month",z=' class="'+y+'"',A="k-nav-today",B="td:has(.k-link)",C=h?"touchstart":"mouseenter",D=h?"touchend":"mouseleave",E=6e4,F=864e5,G="_prevArrow",H="_nextArrow",I=a.proxy,J=a.extend,K=Date,L={month:0,year:1,decade:2,century:3},M=e.extend({init:function(a,b){var d=this,f;e.fn.init.call(d,a,b),a=d.wrapper=d.element,b=d.options,a.addClass("k-widget k-calendar"),d._templates(),d._header(),d._footer(d.footer),a.delegate(B,C,U).delegate(B,D,V).delegate(B,n,I(d._click,d)),f=b.value,X(b),d._index=L[b.start],d._current=new K(Q(f,b.min,b.max)),d.value(f),c.notify(d)},options:{name:"Calendar",value:null,min:new K(1900,0,1),max:new K(2099,11,31),footer:'#= kendo.toString(data,"D") #',format:"",month:{},start:r,depth:r,animation:{horizontal:{effects:q,duration:500,divisor:2},vertical:{effects:"zoomIn",duration:400}}},events:[t,u],setOptions:function(a){X(a),e.fn.setOptions.call(this,a)},min:function(a){return this._option(o,a)},max:function(a){return this._option("max",a)},navigateToPast:function(){this._navigate(G,-1)},navigateToFuture:function(){this._navigate(H,1)},navigateUp:function(){var a=this,b=a._index;a._title.hasClass(x)||a.navigate(a._current,++b)},navigateDown:function(a){var b=this,c=b._index,d=b.options.depth;if(!!a){if(c===L[d]){+b._value!=+a&&(b.value(a),b.trigger(t));return}b.navigate(a,--c)}},navigate:function(c,d){d=isNaN(d)?L[d]:d;var e=this,f=e.options,g=f.min,h=f.max,i=e._title,j=e._table,k=e._value,l=e._current,m=c&&+c>+l,n=d!==b&&d!==e._index,o,p,q;if(!j||!j.parent().data("animating")){c?e._current=c=new K(Q(c,g,h)):c=l,d===b?d=e._index:e._index=d,e._view=p=N.views[d],q=p.compare,i.toggleClass(x,d===L[s]),e[G].toggleClass(x,q(c,g)<1),e[H].toggleClass(x,q(c,h)>-1);if(!j||e._changeView)i.html(p.title(c)),e._table=o=a(p.content(J({min:g,max:h,date:c},e[p.name]))),Y(o),e._animate({from:j,to:o,vertical:n,future:m}),e.trigger(u);d===L[f.depth]&&k&&e._class("k-state-selected",p.toDateString(k)),e._changeView=!0}},value:function(a){var c=this,d=c._view,e=c.options,g=e.min,h=e.max;if(a===b)return c._value;a=f(a,e.format),a!==null&&(a=new K(a),R(a,g,h)||(a=null)),c._value=a,c._changeView=!a||d&&d.compare(a,c._current)!==0,c.navigate(a)},_animate:function(a){var b=this,c=a.from,d=a.to;c?!c.is(":visible")||b.options.animation===!1?(d.insertAfter(c),c.remove()):b[a.vertical?"_vertical":"_horizontal"](c,d,a.future):d.insertAfter(b.element[0].firstChild)},_horizontal:function(a,b,c){var d=this,e=d.options.animation.horizontal,f=e.effects,g=a.outerWidth();f&&f.indexOf(q)!=-1&&(a.add(b).css({width:g}),a.wrap("<div/>"),a.parent().css({position:"relative",width:g*2,"float":p,left:c?0:-g}),b[c?"insertAfter":"insertBefore"](a),J(e,{effects:q+":"+(c?p:"right"),complete:function(){a.remove(),b.unwrap()}}),a.parent().kendoStop(!0,!0).kendoAnimate(e))},_vertical:function(a,b){var c=this,d=c.options.animation.vertical,e=d.effects,f,g;e&&e.indexOf("zoom")!=-1&&(b.css({position:"absolute",top:a.prev().outerHeight(),left:0}).insertBefore(a),j&&(f=c._cellByDate(c._view.toDateString(c._current)),g=f.position(),g=g.left+parseInt(f.width()/2,10)+"px"+" "+(g.top+parseInt(f.height()/2,10)+"px"),b.css(j,g)),a.kendoStop(!0,!0).kendoAnimate({effects:"fadeOut",duration:600,complete:function(){a.remove(),b.css({position:"static",top:0,left:0})}}),b.kendoStop(!0,!0).kendoAnimate(d))},_cellByDate:function(b){return this._table.find("td:not(."+y+")").filter(function(){return a(this.firstChild).attr(c.attr(v))===b})},_class:function(b,d){this._table.find("td:not(."+y+")").removeClass(b).filter(function(){return a(this.firstChild).attr(c.attr(v))===d}).addClass(b)},_click:function(b){var d=this,e=d.options,f=d._current,g=a(b.currentTarget.firstChild),h=g.attr(c.attr(v)).split("/");h=new K(h[0],h[1],h[2]),b.preventDefault(),g.parent().hasClass(y)?f=h:d._view.setDate(f,h),d.navigateDown(Q(f,e.min,e.max))},_focus:function(a){var b=this,c=b._view;c.compare(a,b._current)!==0?b.navigate(a):b._current=a,b._class("k-state-focused",c.toDateString(a))},_footer:function(b){var d=this,e=d.element,f=new K,g=e.find(".k-footer");b?(g[0]||(g=a('<div class="k-footer"><a href="#" class="k-link k-nav-today"></a></div>').appendTo(e)),d._today=g.show().find(".k-link").html(b(f)).attr("title",c.toString(f,"D")),d._toggle()):(d._toggle(!1),g.hide())},_header:function(){var a=this,b=a.element,c;b.find(".k-header")[0]||b.html('<div class="k-header"><a href="#" class="k-link k-nav-prev"><span class="k-icon k-arrow-prev"></span></a><a href="#" class="k-link k-nav-fast"></a><a href="#" class="k-link k-nav-next"><span class="k-icon k-arrow-next"></span></a></div>'),c=b.find(".k-link").bind(C,U).bind(D,V).click(!1),a._title=c.eq(1).bind(n,I(a.navigateUp,a)),a[G]=c.eq(0).bind(n,I(a.navigateToPast,a)),a[H]=c.eq(2).bind(n,I(a.navigateToFuture,a))},_navigate:function(a,b){var c=this,d=c._index+1,e=new K(c._current);a=c[a],a.hasClass(x)||(d>3?e.setFullYear(e.getFullYear()+100*b):N.views[d].setDate(e,b),c.navigate(e))},_option:function(a,c){var d=this,e=d.options,g=+d._value,h,i;if(c===b)return e[a];c=f(c,e.format);!c||(e[a]=new K(c),i=d._view.compare(c,d._current),a===o?(h=+c>g,i=i>-1):(h=g>+c,i=i<1),h?d.value(null):i&&d.navigate(),d._toggle())},_toggle:function(a){var c=this,d=c.options,e=c._today;a===b&&(a=R(new K,d.min,d.max)),e&&(e.unbind(n),a?e.addClass(A).removeClass(x).bind(n,I(c._todayClick,c)):e.removeClass(A).addClass(x).bind(n,W))},_todayClick:function(a){var b=this,c=L[b.options.depth],d=new K;a.preventDefault(),b._view.compare(b._current,d)===0&&b._index==c&&(b._changeView=!1),b._value=d,b.navigate(d,c),b.trigger(t)},_templates:function(){var a=this,b=a.options,d=b.footer,e=b.month,f=e.content,h=e.empty;a.month={content:g('<td#=data.cssClass#><a class="k-link" href="\\#" '+c.attr("value")+'="#=data.dateString#" title="#=data.title#">'+(f||"#=data.value#")+"</a></td>",{useWithBlock:!!f}),empty:g("<td>"+(h||"&nbsp;")+"</td>",{useWithBlock:!!h})},d&&(a.footer=g(d,{useWithBlock:!1}))}});d.plugin(M);var N={firstDayOfMonth:function(a){return new K(a.getFullYear(),a.getMonth(),1)},firstVisibleDay:function(a){var b=c.culture().calendar.firstDay,d=new K(a.getFullYear(),a.getMonth(),0,a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds());while(d.getDay()!=b)N.setTime(d,-1*F);return d},setTime:function(a,b){var c=a.getTimezoneOffset(),d=new K(a.getTime()+b),e=d.getTimezoneOffset()-c;a.setTime(d.getTime()+e*E)},views:[{name:r,title:function(a){return c.culture().calendar.months.names[a.getMonth()]+" "+a.getFullYear()},content:function(a){var b=this,d=0,e=a.min,f=a.max,g=a.date,h=c.culture().calendar,i=h.firstDay,j=h.days,k=S(j.names,i),l=S(j.namesShort,i),m=N.firstVisibleDay(g),n=b.first(g),o=b.last(g),p=b.toDateString,q=new K,r='<table class="k-content" cellspacing="0"><thead><tr>';for(;d<7;d++)r+='<th scope="col" title="'+k[d]+'">'+l[d]+"</th>";q=+(new K(q.getFullYear(),q.getMonth(),q.getDate()));return O({cells:42,perRow:7,html:r+="</tr></thead><tbody><tr>",start:new K(m.getFullYear(),m.getMonth(),m.getDate()),min:new K(e.getFullYear(),e.getMonth(),e.getDate()),max:new K(f.getFullYear(),f.getMonth(),f.getDate()),content:a.content,empty:a.empty,setter:b.setDate,build:function(a,b){var d=[],e=a.getDay();(a<n||a>o)&&d.push(y),+a===q&&d.push("k-today"),(e===0||e===6)&&d.push("k-weekend");return{date:a,ns:c.ns,title:c.toString(a,"D"),value:a.getDate(),dateString:p(a),cssClass:d[0]?' class="'+d.join(" ")+'"':""}}})},first:function(a){return N.firstDayOfMonth(a)},last:function(a){return new K(a.getFullYear(),a.getMonth()+1,0)},compare:function(a,b){var c,d=a.getMonth(),e=a.getFullYear(),f=b.getMonth(),g=b.getFullYear();e>g?c=1:e<g?c=-1:c=d==f?0:d>f?1:-1;return c},setDate:function(a,b){b instanceof K?a.setFullYear(b.getFullYear(),b.getMonth(),b.getDate()):N.setTime(a,b*F)},toDateString:function(a){return a.getFullYear()+"/"+a.getMonth()+"/"+a.getDate()}},{name:"year",title:function(a){return a.getFullYear()},content:function(a){var b=c.culture().calendar.months.namesAbbr,d=this.toDateString,e=a.min,f=a.max;return O({min:new K(e.getFullYear(),e.getMonth(),1),max:new K(f.getFullYear(),f.getMonth(),1),start:new K(a.date.getFullYear(),0,1),setter:this.setDate,build:function(a){return{value:b[a.getMonth()],ns:c.ns,dateString:d(a),cssClass:""}}})},first:function(a){return new K(a.getFullYear(),0,a.getDate())},last:function(a){return new K(a.getFullYear(),11,a.getDate())},compare:function(a,b){return P(a,b)},setDate:function(a,b){if(b instanceof K)a.setFullYear(b.getFullYear(),b.getMonth(),a.getDate());else{var c=a.getMonth()+b;a.setMonth(c),c>11&&(c-=12),c>0&&a.getMonth()!=c&&a.setDate(0)}},toDateString:function(a){return a.getFullYear()+"/"+a.getMonth()+"/1"}},{name:"decade",title:function(a){var b=a.getFullYear();b=b-b%10;return b+"-"+(b+9)},content:function(a){var b=a.date.getFullYear(),d=this.toDateString;return O({start:new K(b-b%10-1,0,1),min:new K(a.min.getFullYear(),0,1),max:new K(a.max.getFullYear(),0,1),setter:this.setDate,build:function(a,b){return{value:a.getFullYear(),ns:c.ns,dateString:d(a),cssClass:b===0||b==11?z:""}}})},first:function(a){var b=a.getFullYear();return new K(b-b%10,a.getMonth(),a.getDate())},last:function(a){var b=a.getFullYear();return new K(b-b%10+9,a.getMonth(),a.getDate())},compare:function(a,b){return P(a,b,10)},setDate:function(a,b){T(a,b,1)},toDateString:function(a){return a.getFullYear()+"/0/1"}},{name:s,title:function(a){var b=a.getFullYear();b=b-b%100;return b+"-"+(b+99)},content:function(a){var b=a.date.getFullYear(),d=a.min.getFullYear(),e=a.max.getFullYear(),f=this.toDateString;d=d-d%10,e=e-e%10,e-d<10&&(e=d+9);return O({start:new K(b-b%100-10,0,1),min:new K(d,0,1),max:new K(e,0,1),setter:this.setDate,build:function(a,b){var d=a.getFullYear();return{value:d+" - "+(d+9),ns:c.ns,dateString:f(a),cssClass:b===0||b==11?z:""}}})},first:function(a){var b=a.getFullYear();return new K(b-b%100,a.getMonth(),a.getDate())},last:function(a){var b=a.getFullYear();return new K(b-b%100+99,a.getMonth(),a.getDate())},compare:function(a,b){return P(a,b,100)},setDate:function(a,b){T(a,b,10)},toDateString:function(a){var b=a.getFullYear();return b-b%10+"/0/1"}}]};N.makeUnselectable=Y,N.restrictValue=Q,N.isInRange=R,N.validate=X,N.viewsEnum=L,c.calendar=N}(jQuery),function(a,b){var c=window.kendo,d=c.ui,e=c.support.touch,f=d.Widget,g=c.parseDate,h=c.keys,i=c.template,j="<div />",k="<span />",l=e?"touchend":"click",m=l+".datepicker",n="open",o="close",p="change",q="navigate",r="dateView",s="disabled",t="k-state-default",u="k-state-focused",v="k-state-selected",w="k-state-disabled",x="k-state-hover",y="mouseenter mouseleave",z=e?"touchstart":"mousedown",A="min",B="max",C="month",D="first",E=c.calendar,F=E.isInRange,G=E.restrictValue,H=a.extend,I=a.proxy,J=Date,K=function(b){var c=this,e=document.body,f=L.sharedCalendar;f||(f=L.sharedCalendar=new d.Calendar(a(j).hide().appendTo(e)),E.makeUnselectable(f.element)),c.calendar=f,c.options=b=b||{},c.popup=new d.Popup(a(j).addClass("k-calendar-container").appendTo(e),H(b.popup,b)),c._templates(),c.value(b.value)};K.prototype={_calendar:function(){var a=this,b=a.popup,c=a.options,d=a.calendar,f=d.element;f.data(r)!==a&&(f.appendTo(b.element).data(r,a).undelegate(m).delegate("td:has(.k-link)",m,I(a._click,a)).unbind(z).bind(z,function(a){a.preventDefault()}).show(),d.unbind(p).bind(p,c),e||d.unbind(q).bind(q,I(a._navigate,a)),d.month=a.month,d.options.depth=c.depth,d._footer(a.footer),d.min(c.min),d.max(c.max),d.navigate(a._value,c.start),a.value(a._value))},open:function(){var a=this;a._calendar(),a.popup.open()},close:function(){this.popup.close()},min:function(a){this._option(A,a)},max:function(a){this._option(B,a)},toggle:function(){var a=this;a[a.popup.visible()?o:n]()},move:function(a){var b=this,c=b.options,d=new J(b._current),e=b.calendar,f=e._index,g=e._view,i=a.keyCode,j,k,l;if(i==h.ESC)b.close();else{if(a.altKey){i==h.DOWN?(b.open(),k=!0):i==h.UP&&(b.close(),k=!0);return}if(!b.popup.visible()||e._table.parent().data("animating"))return;if(a.ctrlKey)i==h.RIGHT?(e.navigateToFuture(),k=!0):i==h.LEFT?(e.navigateToPast(),k=!0):i==h.UP?(e.navigateUp(),k=!0):i==h.DOWN&&(b._navigateDown(),k=!0);else{i==h.RIGHT?(j=1,k=!0):i==h.LEFT?(j=-1,k=!0):i==h.UP?(j=f===0?-7:-4,k=!0):i==h.DOWN?(j=f===0?7:4,k=!0):i==h.ENTER?(b._navigateDown(),k=!0):i==h.HOME||i==h.END?(l=i==h.HOME?D:"last",d=g[l](d),k=!0):i==h.PAGEUP?(k=!0,e.navigateToPast()):i==h.PAGEDOWN&&(k=!0,e.navigateToFuture());if(j||l)l||g.setDate(d,j),b._current=d=G(d,c.min,c.max),e._focus(d)}k&&a.preventDefault()}},value:function(a){var b=this,c=b.calendar,d=b.options;b._value=a,b._current=new J(G(a,d.min,d.max)),c.element.data(r)===b&&(c._focus(b._current),c.value(a))},_click:function(a){a.currentTarget.className.indexOf(v)!==-1&&this.close()},_navigate:function(){var a=this,b=a.calendar;a._current=new J(b._current),b._focus(b._current)},_navigateDown:function(){var a=this,b=a.calendar,d=b._current,e=b._table.find("."+u),f=e.children(":"+D).attr(c.attr("value")).split("/");f=new J(f[0],f[1],f[2]);!e[0]||e.hasClass(v)?a.close():(b._view.setDate(d,f),b.navigateDown(d))},_option:function(a,b){var c=this,d=c.options,e=c.calendar;d[a]=b,e.element.data(r)===c&&e[a](b)},_templates:function(){var a=this,b=a.options,d=b.footer,e=b.month||{},f=e.content,g=e.empty;a.month={content:i('<td#=data.cssClass#><a class="k-link" href="\\#" '+c.attr("value")+'="#=data.dateString#" title="#=data.title#">'+(f||"#=data.value#")+"</a></td>",{useWithBlock:!!f}),empty:i("<td>"+(g||"&nbsp;")+"</td>",{useWithBlock:!!g})},d&&(a.footer=i(d,{useWithBlock:!1}))}},c.DateView=K;var L=f.extend({init:function(a,b){var d=this,e;f.fn.init.call(d,a,b),a=d.element,b=d.options,E.validate(b),d._wrapper(),d.dateView=e=new K(H({},b,{anchor:d.wrapper,change:function(){d._change(this.value()),d.close()},close:function(a){d.trigger(o)&&a.preventDefault()},open:function(a){d.trigger(n)&&a.preventDefault()}})),d._icon(),a.addClass("k-input").bind({keydown:I(d._keydown,d),focus:function(a){d._inputWrapper.addClass(u)},blur:I(d._blur,d)}).closest("form").bind("reset",function(){d.value(a[0].defaultValue)}),d.enable(!a.is("[disabled]")),d.value(b.value||d.element.val()),c.notify(d)},events:[n,o,p],options:{name:"DatePicker",value:null,format:"",min:new Date(1900,0,1),max:new Date(2099,11,31),footer:'#= kendo.toString(data,"D") #',start:C,depth:C,animation:{},month:{}},setOptions:function(a){var b=this;f.fn.setOptions.call(b,a),E.validate(b.options),H(b.dateView.options,b.options)},enable:function(a){var b=this,c=b._icon.unbind(l+" "+z),d=b._inputWrapper.unbind(y),e=b.element;a===!1?(d.removeClass(t).addClass(w),e.attr(s,s)):(d.addClass(t).removeClass(w).bind(y,b._toggleHover),e.removeAttr(s),c.bind(l,I(b._click,b)).bind(z,function(a){a.preventDefault()}))},open:function(){this.dateView.open()},close:function(){this.dateView.close()},min:function(a){return this._option(A,a)},max:function(a){return this._option(B,a)},value:function(a){var c=this;if(a===b)return c._value;c._old=c._update(a)},_toggleHover:function(b){e||a(b.currentTarget).toggleClass(x,b.type==="mouseenter")},_blur:function(){var a=this;a.close(),a._change(a.element.val()),a._inputWrapper.removeClass(u)},_click:function(){var a=this,b=a.element;!e&&b[0]!==document.activeElement&&b.focus(),a.dateView.toggle()},_change:function(a){var b=this;a=b._update(a),+b._old!=+a&&(b._old=a,b.trigger(p),b.element.trigger(p))},_keydown:function(a){var b=this,c=b.dateView;!c.popup.visible()&&a.keyCode==h.ENTER?b._change(b.element.val()):c.move(a)},_icon:function(){var b=this,c=b.element,d;d=c.next("span.k-select"),d[0]||(d=a('<span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-icon-calendar">select</span></span>').insertAfter(c)),b._icon=d},_option:function(a,c){var d=this,e=d.options;if(c===b)return e[a];c=g(c,e.format);!c||(e[a]=new J(c),d.dateView[a](c))},_update:function(a){var b=this,d=b.options,e=d.format,f=g(a,e);F(f,d.min,d.max)||(f=null),b._value=f,b.dateView.value(f),b.element.val(f?c.toString(f,e):a);return f},_wrapper:function(){var b=this,c=b.element,d;d=c.parents(".k-datepicker"),d[0]||(d=c.wrap(k).parent().addClass("k-picker-wrap k-state-default"),d=d.wrap(k).parent()),d[0].style.cssText=c[0].style.cssText,c.css({width:"100%",height:c[0].style.height}),b.wrapper=d.addClass("k-widget k-datepicker k-header"),b._inputWrapper=a(d[0].firstChild)}});d.plugin(L)}(jQuery),function(a,b){function x(a){var b=a.value.length;s(a,b,b)}function w(a,b,c,d){var e=b.split(d);e.splice(u(a,b,d),1,c),d&&e[e.length-1]!==""&&e.push("");return e.join(d)}function v(a,b,c){return b.split(c)[u(a,b,c)]}function u(a,b,c){return c?b.substring(0,a).split(c).length-1:0}var c=window.kendo,d=c.support,e=d.placeholder,f=c.ui,g=c.keys,h=c.data.DataSource,i=f.List,j="change",k="k-state-default",l="disabled",m="k-state-focused",n="k-state-selected",o="k-state-disabled",p="k-state-hover",q="mouseenter mouseleave",r=i.caret,s=i.selectText,t=a.proxy,y=i.extend({init:function(b,d){var f=this,g;d=a.isArray(d)?{dataSource:d}:d,i.fn.init.call(f,b,d),b=f.element,d=f.options,d.placeholder=d.placeholder||b.attr("placeholder"),e&&b.attr("placeholder",d.placeholder),f._wrapper(),f._accessors(),f._dataSource(),b[0].type="text",g=f.wrapper,b.attr("autocomplete","off").addClass("k-input").bind({keydown:t(f._keydown,f),paste:t(f._search,f),focus:function(){f._prev=f.value(),f._placeholder(!1),g.addClass(m),clearTimeout(f._bluring)},blur:function(){f._change(),f._placeholder(),g.removeClass(m)}}),f._enable(),f._popup(),f._old=f.value(),f._placeholder(),c.notify(f)},options:{name:"AutoComplete",suggest:!1,template:"",dataTextField:"",minLength:1,delay:200,height:200,filter:"startswith",ignoreCase:!0,highlightFirst:!1,separator:null,placeholder:"",animation:{}},_dataSource:function(){var a=this;a.dataSource&&a._refreshHandler?a.dataSource.unbind(j,a._refreshHandler):a._refreshHandler=t(a.refresh,a),a.dataSource=h.create(a.options.dataSource).bind(j,a._refreshHandler)},setDataSource:function(a){this.options.dataSource=a,this._dataSource()},events:["open","close",j,"select","dataBinding","dataBound"],setOptions:function(a){i.fn.setOptions.call(this,a),this._template(),this._accessors()},enable:function(a){var b=this,c=b.element,d=b.wrapper;a===!1?(d.removeClass(k).addClass(o).unbind(q),c.attr(l,l)):(d.removeClass(o).addClass(k).bind(q,b._toggleHover),c.removeAttr(l))},close:function(){var a=this;a._current=null,a.popup.close()},refresh:function(){var b=this,d=b.ul[0],e=b.popup,f=b.options,g=b._data(),h=g.length;b.trigger("dataBinding"),d.innerHTML=c.render(b.template,g),b._height(h),h&&(f.highlightFirst&&b.current(a(d.firstChild)),f.suggest&&b.suggest(a(d.firstChild))),b._open&&(b._open=!1,e[h?"open":"close"]()),b._touchScroller&&b._touchScroller.reset(),b._makeUnselectable(),b.trigger("dataBound")},select:function(a){this._select(a)},search:function(a){var b=this,c=b.options,d=c.ignoreCase,e=c.separator,f;a=a||b.value(),b._current=null,clearTimeout(b._typing),e&&(a=v(r(b.element[0]),a,e)),f=a.length,f?f>=b.options.minLength&&(b._open=!0,b.dataSource.filter({value:d?a.toLowerCase():a,operator:c.filter,field:c.dataTextField,ignoreCase:d})):b.popup.close()},suggest:function(a){var c=this,d=c._last,e=c.value(),f=c.element[0],h=r(f),j=c.options.separator,k=e.split(j),l=u(h,e,j),m=h,n;d==g.BACKSPACE||d==g.DELETE?c._last=b:(a=a||"",typeof a!="string"&&(n=i.inArray(a[0],c.ul[0]),n>-1?a=c._text(c._data()[n]):a=""),h<=0&&(h=e.toLowerCase().indexOf(a.toLowerCase())+1),n=e.substring(0,h).lastIndexOf(j),n=n>-1?h-(n+j.length):h,e=k[l].substring(0,n),a&&(n=a.toLowerCase().indexOf(e.toLowerCase()),n>-1&&(a=a.substring(n+e.length),m=h+a.length,e+=a),j&&k[k.length-1]!==""&&k.push("")),k[l]=e,c.value(k.join(j||"")),s(f,h,m))},value:function(a){var c=this,d=c.element[0];if(a!==b)d.value=a;else{a=d.value;if(d.className.indexOf("k-readonly")>-1)return a===c.options.placeholder?"":a;return a}},_accept:function(a){var b=this;b._focus(a),x(b.element[0])},_keydown:function(b){var c=this,d=c.ul[0],e=b.keyCode,f=c._current,h=c.popup.visible();c._last=e,e===g.DOWN?(h&&c._move(f?f.next():a(d.firstChild)),b.preventDefault()):e===g.UP?(h&&c._move(f?f.prev():a(d.lastChild)),b.preventDefault()):e===g.ENTER||e===g.TAB?(c.popup.visible()&&b.preventDefault(),c._accept(f)):e===g.ESC?c.close():c._search()},_move:function(a){var b=this;a=a[0]?a:null,b.current(a),b.options.suggest&&b.suggest(a)},_placeholder:function(a){if(!e){var c=this,d=c.element,f=c.options.placeholder,g;if(f){g=d.val(),a===b&&(a=!g),a||(g!==f?f=g:f="");if(g===c._old&&!a)return;d.toggleClass("k-readonly",a).val(f)}}},_search:function(){var a=this;clearTimeout(a._typing),a._typing=setTimeout(function(){a._prev!==a.value()&&(a._prev=a.value(),a.search())},a.options.delay)},_select:function(b){var c=this,d=c.options.separator,e=c._data(),f,g;b=a(b),b[0]&&!b.hasClass(n)&&(g=i.inArray(b[0],c.ul[0]),g>-1&&(e=e[g],f=c._text(e),d&&(f=w(r(c.element[0]),c.value(),f,d)),c.value(f),c.current(b.addClass(n))))},_toggleHover:function(b){d.touch||a(b.currentTarget).toggleClass(p,b.type==="mouseenter")},_wrapper:function(){var a=this,b=a.element,c=b[0],d;d=b.parent(),d.is("span.k-widget")||(d=b.wrap("<span />").parent()),d[0].style.cssText=c.style.cssText,b.css({width:"100%",height:c.style.height}),a._focused=a.element,a.wrapper=d.addClass("k-widget k-autocomplete k-header").addClass(c.className)}});f.plugin(y)}(jQuery),function(a,b){function r(a,b,c){var d=0,e=b.length-1,f;for(;d<e;++d)f=b[d],f in a||(a[f]={}),a=a[f];a[b[e]]=c}var c=window.kendo,d=c.ui,e=d.Select,f=c.support.mobileOS,g="disabled",h="change",i="select",j="k-state-focused",k="k-state-default",l="k-state-disabled",m="k-state-selected",n="mouseenter mouseleave",o=/^\s/,p=a.proxy,q=e.extend({init:function(b,d){var f=this;d=a.isArray(d)?{dataSource:d}:d,e.fn.init.call(f,b,d),d=f.options,b=f.element.focus(function(){f.wrapper.focus()}),f._reset(),f._word="",f._wrapper(),f._span(),f._popup(),f._mobile(),f._accessors(),f._dataSource(),f._enable(),f.selectedIndex=-1,d.autoBind?f._selectItem():(b.is(i)&&f.text(b.children(":selected").text()),!f.text().replace(o,"")&&d.optionLabel&&f.text(d.optionLabel)),c.notify(f)},options:{name:"DropDownList",enable:!0,index:0,autoBind:!0,template:"",delay:500,height:200,dataTextField:"",dataValueField:"",optionLabel:"",ignoreCase:!0,animation:{}},events:["open","close",h,"select","dataBinding","dataBound"],setOptions:function(a){e.fn.setOptions.call(this,a),this._template(),this._accessors()},enable:function(a){var b=this,c=b.element,d=b.wrapper.unbind(".dropdownlist"),e=b._inputWrapper.unbind(n);a===!1?(c.attr(g,g),e.removeClass(k).addClass(l)):(c.removeAttr(g,g),e.addClass(k).removeClass(l).bind(n,b._toggleHover),d.bind({"click.dropdownlist":function(a){a.preventDefault(),b.toggle()},"keydown.dropdownlist":p(b._keydown,b),"keypress.dropdownlist":p(b._keypress,b),"focusin.dropdownlist":function(){e.addClass(j)},"focusout.dropdownlist":function(a){b._blur(),e.removeClass(j)}}))},open:function(){var a=this;a.ul[0].firstChild?(a.popup.open(),a._scroll(a._current)):(a._open=!0,a._selectItem())},toggle:function(a){this._toggle(a)},refresh:function(){var a=this,b=a._data(),d=b.length,e=a.options.optionLabel;a.trigger("dataBinding"),a._current&&a.current(null),a.ul[0].innerHTML=c.render(a.template,b),a._height(d),a.element.is(i)&&(e&&d&&(e='<option value="">'+e+"</option>"),a._options(b,e)),a._open&&(a._open=!1,a.toggle(!!d)),a._hideBusy(),a._makeUnselectable(),a.trigger("dataBound")},search:function(a){if(a){var c=this,d=c.options.ignoreCase;d&&(a=a.toLowerCase()),c._select(function(e){var f=c._text(e);if(f!==b){f=f+"",d&&(f=f.toLowerCase());return f.indexOf(a)===0}})}},select:function(a){var c=this;if(a===b)return c.selectedIndex;c._select(a),c._old=c._accessor(),c._oldIndex=c.selectedIndex},text:function(a){var c=this.span;if(a!==b)c.text(a);else return c.text()},value:function(a){var c=this,d;if(a===b)return c._accessor();if(!a||!c._valueOnFetch(a))d=c._index(a),c.select(d>-1?d:0)},_selectItem:function(){var a=this;a.dataSource.one(h,function(){var b=a.value();b?a.value(b):a.select(a.options.index)}).fetch()},_accept:function(a){this._focus(a)},_data:function(){var a=this,b=a.options,d=b.optionLabel,e=b.dataTextField,f=b.dataValueField,g=a.dataSource.view(),h=g.length,i=d,j=0;if(d&&h){e&&(i={},e=e.split("."),f=f.split("."),r(i,f,""),r(i,e,d)),i=new c.data.ObservableArray([i]);for(;j<h;j++)i.push(g[j]);g=i}return g},_keydown:function(a){var b=this,d=a.keyCode,e=c.keys,f=b.ul[0];b._move(a),d===e.HOME?(a.preventDefault(),b._select(f.firstChild)):d===e.END&&(a.preventDefault(),b._select(f.lastChild))},_keypress:function(a){var b=this;setTimeout(function(){b._word+=String.fromCharCode(a.keyCode||a.charCode),b._search()})},_popup:function(){e.fn._popup.call(this),this.popup.one("open",function(){this.wrapper=c.wrap(this.element).addClass("km-popup")})},_search:function(){var a=this;clearTimeout(a._typing),a._typing=setTimeout(function(){a._word=""},a.options.delay),a.search(a._word)},_select:function(a){var c=this,e=c._current,f=c._data(),g,h,i;a=c._get(a),a&&a[0]&&!a.hasClass(m)&&(e&&e.removeClass(m),i=d.List.inArray(a[0],c.ul[0]),i>-1&&(f=f[i],h=c._text(f),g=c._value(f),c.selectedIndex=i,c.text(h),c._accessor(g!==b?g:h,i),c.current(a.addClass(m))))},_mobile:function(){var a=this,b=a.popup,c=b.element.parents(".km-root").eq(0);c.length&&f&&(b.options.animation.open.effects=f.android||f.meego?"fadeIn":f.ios?"slideIn:up":b.options.animation.open.effects)},_span:function(){var b=this,c=b.wrapper,d=".k-input",e;e=c.find(d),e[0]||(c.append('<span unselectable="on" class="k-dropdown-wrap k-state-default"><span unselectable="on" class="k-input">&nbsp;</span><span class="k-select"><span class="k-icon k-arrow-down">select</span></span></span>').append(b.element),e=c.find(d)),b.span=e,b._inputWrapper=a(c[0].firstChild),b._arrow=c.find(".k-icon").mousedown(function(a){a.preventDefault()})},_wrapper:function(){var a=this,b=a.element,c=b[0],d="tabIndex",e;e=b.parent(),e.is("span.k-widget")||(e=b.wrap("<span />").parent()),e.attr(d)||e.attr(d,0),e[0].style.cssText=c.style.cssText,b.hide(),a._focused=a.wrapper=e.attr("unselectable","on").addClass("k-widget k-dropdown k-header").addClass(c.className)}});d.plugin(q)}(jQuery),function(a,b){function y(b,c){b.filters&&(b.filters=a.grep(b.filters,function(a){y(a,c);return a.filters?a.filters.length:a.field!=c}))}var c=window.kendo,d=c.ui,e=d.List,f=d.Select,g=c.support,h=g.placeholder,i=c.keys,j=g.touch?"touchend":"click",k="disabled",l="change",m="k-state-default",n="k-state-disabled",o="k-state-focused",p="mousedown",q="select",r="k-state-selected",s="filter",t="accept",u="mouseenter mouseleave",v=null,w=a.proxy,x=f.extend({init:function(b,d){var e=this,g;d=a.isArray(d)?{dataSource:d}:d,f.fn.init.call(e,b,d),d=e.options,b=e.element.focus(function(){e.input.focus()}),d.placeholder=d.placeholder||b.attr("placeholder"),e._reset(),e._wrapper(),e._input(),e._popup(),e._accessors(),e._dataSource(),e._enable(),g=e._inputWrapper,e.input.bind({keydown:w(e._keydown,e),focus:function(){g.addClass(o),e._placeholder(!1)},blur:function(){g.removeClass(o),clearTimeout(e._typing),e.text(e.text()),e._placeholder(),e._blur()}}),e._oldIndex=e.selectedIndex=-1,e._old=e.value(),d.autoBind?e._selectItem():b.is(q)&&e.input.val(b.children(":selected").text()),e._placeholder(),c.notify(e)},options:{name:"ComboBox",enable:!0,index:-1,autoBind:!0,delay:200,dataTextField:"",dataValueField:"",minLength:0,height:200,highlightFirst:!0,template:"",filter:"none",placeholder:"",suggest:!1,ignoreCase:!0,animation:{}},events:["open","close",l,"select","dataBinding","dataBound"],setOptions:function(a){f.fn.setOptions.call(this,a),this._template(),this._accessors()},current:function(a){var c=this,d=c._current;if(a===b)return d;d&&d.removeClass(r),f.fn.current.call(c,a)},enable:function(a){var b=this,c=b.input.add(b.element),d=b._inputWrapper.unbind(u),e=b._arrow.parent().unbind(j+" "+p);a===!1?(d.removeClass(m).addClass(n),c.attr(k,k)):(d.removeClass(n).addClass(m).bind(u,b._toggleHover),c.removeAttr(k),e.bind(j,function(){b.toggle()}).bind(p,function(a){a.preventDefault()}))},open:function(){var a=this,b=a.dataSource.options.serverFiltering;a.popup.visible()||(!a.ul[0].firstChild||a._state===t&&!b?(a._open=!0,a._state="",a._selectItem()):(a.popup.open(),a._scroll(a._current)))},refresh:function(){var b=this,d=b.ul[0],e=b.options,f=b._data(),g=f.length;b.trigger("dataBinding"),d.innerHTML=c.render(b.template,f),b._height(g),b.element.is(q)&&b._options(f),g&&(e.highlightFirst&&b.current(a(d.firstChild)),e.suggest&&b.input.val()&&b.suggest(a(d.firstChild))),b._open&&(b._open=!1,b.toggle(!!g)),b._touchScroller&&b._touchScroller.reset(),b._makeUnselectable(),b._hideBusy(),b.trigger("dataBound")},select:function(a){var c=this;if(a===b)return c.selectedIndex;c._select(a),c._old=c._accessor(),c._oldIndex=c.selectedIndex},search:function(a){a=typeof a=="string"?a:this.text();var b=this,c=a.length,d=b.options,e=d.ignoreCase,f=d.filter,g=d.dataTextField,h,i;clearTimeout(b._typing),c>=d.minLength&&(f==="none"?b._filter(a):(b._open=!0,b._state=s,i=b.dataSource.filter()||{},y(i,g),h=i.filters||[],h.push({value:e?a.toLowerCase():a,field:g,operator:f,ignoreCase:e}),b.dataSource.filter(h)))},suggest:function(a){var c=this,d=c.input[0],f=c.text(),g=e.caret(d),h=c._last,j;if(h==i.BACKSPACE||h==i.DELETE)c._last=b;else{a=a||"",typeof a!="string"&&(j=e.inArray(a[0],c.ul[0]),j>-1?a=c._text(c.dataSource.view()[j]):a=""),g<=0&&(g=f.toLowerCase().indexOf(a.toLowerCase())+1),a?(j=a.toLowerCase().indexOf(f.toLowerCase()),j>-1&&(f+=a.substring(j+f.length))):f=f.substring(0,g);if(f.length!==g||!a)d.value=f,e.selectText(d,g,f.length)}},text:function(a){a=a===null?"":a;var c=this,d=c._text,e=c.input[0],f=c.options.ignoreCase,g=a,h;if(a===b)return e.value;h=c.dataItem();if(!h||d(h)!==a)f&&(g=g.toLowerCase()),c._select(function(a){a=d(a),f&&(a=(a+"").toLowerCase());return a===g}),c.selectedIndex<0&&(c._custom(a),e.value=a)},toggle:function(a){var b=this;b._toggle(a)},value:function(a){var c=this,d;if(a===b)return c._accessor();if(!a||!c._valueOnFetch(a))d=c._index(a),d>-1?c.select(d):(c.current(v),c._custom(a),c.text(a)),c._old=c._accessor(),c._oldIndex=c.selectedIndex},_accept:function(a){var b=this;a&&b.popup.visible()?(b._state===s&&(b._state=t),b._focus(a)):(b.text(b.text()),b._change())},_custom:function(b){var c=this,d=c.element,e=c._option;d.is(q)?(e||(e=c._option=a("<option/>"),d.append(e)),e.text(b),e[0].selected=!0):d.val(b)},_filter:function(a){var c=this,d=c.options,e=c.dataSource,f=d.ignoreCase,g=function(d){var e=c._text(d);if(e!==b){e=e+"";if(e!==""&&a==="")return!1;f&&(e=e.toLowerCase());return e.indexOf(a)===0}};f&&(a=a.toLowerCase());c.ul[0].firstChild?(c._highlight(g)!==-1&&(d.suggest&&c._current&&c.suggest(c._current),c.open()),c._hideBusy()):e.one(l,function(){c.search(a)}).fetch()},_highlight:function(c){var d=this,f;if(c===b||c===null)return-1;c=d._get(c),f=e.inArray(c[0],d.ul[0]),f==-1&&(d.options.highlightFirst&&!d.text()?c=a(d.ul[0].firstChild):c=v),d.current(c);return f},_input:function(){var b=this,c=b.element[0],d=b.wrapper,e=".k-input",f;f=d.find(e),f[0]||(d.append('<span unselectable="on" class="k-dropdown-wrap k-state-default"><input class="k-input" type="text" autocomplete="off"/><span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-arrow-down">select</span></span></span>').append(b.element),f=d.find(e)),f[0].style.cssText=c.style.cssText,f.addClass(c.className).val(c.value).css({width:"100%",height:c.style.height}).show(),h&&f.attr("placeholder",b.options.placeholder),b._focused=b.input=f,b._arrow=d.find(".k-icon"),b._inputWrapper=a(d[0].firstChild)},_keydown:function(a){var b=this,c=a.keyCode,d=b.input;b._last=c,clearTimeout(b._typing),c==i.TAB?(b.text(d.val()),b._state===s&&b.selectedIndex>-1&&(b._state=t)):b._move(a)||b._search()},_placeholder:function(a){if(!h){var c=this,d=c.input,e=c.options.placeholder,f;if(e){f=c.value(),a===b&&(a=!f),d.toggleClass("k-readonly",a);if(!a)if(!f)e="";else return;d.val(e)}}},_search:function(){var a=this;a._typing=setTimeout(function(){var b=a.text();a._prev!==b&&(a._prev=b,a.search(b))},a.options.delay)},_select:function(a){var c=this,d,e,f=c._highlight(a),g=c._data();c.selectedIndex=f,f!==-1&&(c._current.addClass(r),g=g[f],d=c._text(g),e=c._value(g),c._prev=c.input[0].value=d,c._accessor(e!==b?e:d,f),c._placeholder())},_selectItem:function(){var a=this,b=a.dataSource,c=b.filter()||{};y(c,a.options.dataTextField),a.dataSource.one(l,function(){var b=a.value();b?a.value(b):a.select(a.options.index)}).filter(c)},_wrapper:function(){var a=this,b=a.element,c;c=b.parent(),c.is("span.k-widget")||(c=b.hide().wrap("<span />").parent()),c[0].style.cssText=b[0].style.cssText,a.wrapper=c.addClass("k-widget k-combobox k-header").addClass(b[0].className).show()}});d.plugin(x)}(jQuery),function(a,b){function bc(a,b){var c,d,e;if(typeof a===Q)return a===b;if(m(a))for(c=0,d=a.length;c<d;c++){e=a[c];if(typeof e===Q&&e===b||e.name===b)return!0}return!1}function ba(a,b,c){var d=a.eq(b),e=a.eq(c);d[b>c?"insertBefore":"insertAfter"](e)}function _(a){var b,c,d={};if(!p(a))if(m(a))for(b=0,c=a.length;b<c;b++)d[a[b].field]={};else d[a.field]={};return d}function $(b,c){a("th, th .k-grid-filter, th .k-link",b).add(document.body).css("cursor",c)}function Z(b){var c=0;a("> .k-grouping-header, > .k-grid-toolbar",b).each(function(){c+=this.offsetHeight});return c}function X(a){return Array(a+1).join('<td class="k-group-cell">&nbsp;</td>')}var c=window.kendo,d=c.ui,e=c.data.DataSource,f=d.Groupable,g=c.support.tbodyInnerHtml,h=d.Widget,i=c.keys,j=a.isPlainObject,k=a.extend,l=a.map,m=a.isArray,n=a.proxy,o=a.isFunction,p=a.isEmptyObject,q=Math,r="requestStart",s="error",t="tbody>tr:not(.k-grouping-row,.k-detail-row,.k-group-footer):visible",u=":not(.k-group-cell,.k-hierarchy-cell):visible",v="tbody>tr:not(.k-grouping-row,.k-detail-row,.k-group-footer) > td:not(.k-group-cell,.k-hierarchy-cell)",w=t+">td"+u,x=w+":first",y="edit",z="save",A="remove",B="detailInit",C="change",D="saveChanges",E="dataBound",F="detailExpand",G="detailCollapse",H="k-state-focused",I="k-focusable",J="k-state-selected",K="columnResize",L="columnReorder",M="click",N="height",O="tabIndex",P="function",Q="string",R="Are you sure you want to delete this record?",S=/\}/ig,T=3,U=/#/ig,V='<a class="k-button k-button-icontext #=className#" #=attr# href="\\#"><span class="#=iconClass# #=imageClass#"></span>#=text#</a>',W=h.extend({init:function(a,b){var c=this;h.fn.init.call(c,a,b),c._refreshHandler=n(c.refresh,c),c.setDataSource(b.dataSource),c.wrap()},setDataSource:function(a){var b=this;b.dataSource&&b.dataSource.unbind(C,b._refreshHandler),b.dataSource=a,b.dataSource.bind(C,b._refreshHandler)},options:{name:"VirtualScrollable",itemHeight:a.noop},wrap:function(){var b=this,d=c.support.scrollbar()+1,e=b.element;e.css({width:"auto",paddingRight:d,overflow:"hidden"}),b.content=e.children().first(),b.wrapper=b.content.wrap('<div class="k-virtual-scrollable-wrap"/>').parent().bind("DOMMouseScroll",n(b._wheelScroll,b)).bind("mousewheel",n(b._wheelScroll,b)),c.support.touch&&(b.drag=new c.Drag(b.wrapper,{global:!0,move:function(a){b.verticalScrollbar.scrollTop(b.verticalScrollbar.scrollTop()-a.y.delta),a.preventDefault()}})),b.verticalScrollbar=a('<div class="k-scrollbar k-scrollbar-vertical" />').css({width:d}).appendTo(e).bind("scroll",n(b._scroll,b))},_wheelScroll:function(b){var c=this,d=c.verticalScrollbar.scrollTop(),e=b.originalEvent,f;b.preventDefault(),e.wheelDelta?f=e.wheelDelta:e.detail?f=-e.detail*10:a.browser.opera&&(f=-e.wheelDelta),c.verticalScrollbar.scrollTop(d+ -f)},_scroll:function(a){var b=this,c=a.currentTarget.scrollTop,d=b.dataSource,e=b.itemHeight,f=d.skip()||0,g=b._rangeStart||f,h=b.element.innerHeight(),i=!!(b._scrollbarTop&&b._scrollbarTop>c),j=q.max(q.floor(c/e),0),k=q.max(j+q.floor(h/e),0);b._scrollTop=c-g*e,b._scrollbarTop=c,b._fetch(j,k,i)||(b.wrapper[0].scrollTop=b._scrollTop)},_fetch:function(a,b,c){var d=this,e=d.dataSource,f=d.itemHeight,g=e.take(),h=d._rangeStart||e.skip()||0,i=q.floor(a/g)*g,j=!1,k=.33;a<h?(j=!0,h=q.max(0,b-g),d._scrollTop=(a-h)*f,d._page(h,g)):b>=h+g&&!c?(j=!0,h=a,d._scrollTop=f,d._page(h,g)):d._fetching||(a<i+g-g*k&&a>g&&e.prefetch(i-g,g),b>i+g*k&&e.prefetch(i+g,g));return j},_page:function(a,b){var d=this,e=d.dataSource;clearTimeout(d._timeout),d._fetching=!0,d._rangeStart=a,e.inRange(a,b)?e.range(a,b):(c.ui.progress(d.wrapper.parent(),!0),d._timeout=setTimeout(function(){e.range(a,b)},100))},refresh:function(){var a=this,b="",d=25e4,e=a.dataSource,f=a._rangeStart,g=c.support.scrollbar(),h=a.wrapper[0],i,j,k;c.ui.progress(a.wrapper.parent(),!1),clearTimeout(a._timeout),k=a.itemHeight=a.options.itemHeight()||0;var l=h.scrollWidth>h.offsetWidth?g:0;i=e.total()*k+l;for(j=0;j<q.floor(i/d);j++)b+='<div style="width:1px;height:'+d+'px"></div>';i%d&&(b+='<div style="width:1px;height:'+i%d+'px"></div>'),a.verticalScrollbar.html(b),h.scrollTop=a._scrollTop,a.drag&&a.drag.cancel(),f&&!a._fetching&&(a._rangeStart=e.skip()),a._fetching=!1}}),Y={create:{text:"Add new record",imageClass:"k-add",className:"k-grid-add",iconClass:"k-icon"},cancel:{text:"Cancel changes",imageClass:"k-cancel",className:"k-grid-cancel-changes",iconClass:"k-icon"},save:{text:"Save changes",imageClass:"k-update",className:"k-grid-save-changes",iconClass:"k-icon"},destroy:{text:"Delete",imageClass:"k-delete",className:"k-grid-delete",iconClass:"k-icon"},edit:{text:"Edit",imageClass:"k-edit",className:"k-grid-edit",iconClass:"k-icon"},update:{text:"Update",imageClass:"k-update",className:"k-grid-update",iconClass:"k-icon"},canceledit:{text:"Cancel",imageClass:"k-cancel",className:"k-grid-cancel",iconClass:"k-icon"}},bb=h.extend({init:function(a,b){var d=this;b=m(b)?{dataSource:b}:b,h.fn.init.call(d,a,b),d._element(),d._columns(d.options.columns),d._dataSource(),d._tbody(),d._pageable(),d._toolbar(),d._thead(),d._groupable(),d._templates(),d._navigatable(),d._selectable(),d._details(),d._editable(),d.options.autoBind&&d.dataSource.fetch(),c.notify(d)},events:[C,"dataBinding",E,F,G,B,y,z,A,D,K,L],setDataSource:function(a){var b=this;b.options.dataSource=a,b._dataSource(),b._pageable(),b.options.groupable&&b._groupable(),b._thead(),b.virtualScrollable&&b.virtualScrollable.setDataSource(b.options.dataSource),b.options.autoBind&&a.fetch()},options:{name:"Grid",columns:[],toolbar:null,autoBind:!0,filterable:!1,scrollable:!0,sortable:!1,selectable:!1,navigatable:!1,pageable:!1,editable:!1,groupable:!1,rowTemplate:"",altRowTemplate:"",dataSource:{},height:null,resizable:!1,reorderable:!1},setOptions:function(a){var b=this;h.fn.setOptions.call(this,a),b._templates()},items:function(){return this.tbody.children(":not(.k-grouping-row,.k-detail-row,.k-group-footer)")},_element:function(){var b=this,c=b.element;c.is("table")||(c=a("<table />").appendTo(b.element)),b.table=c.attr("cellspacing",0),b._wrapper()},positionColumnResizeHandles:function(){var b=this,c=0,d,e=b.options.scrollable,f=e?b.wrapper.find(".k-grid-header-wrap"):b.wrapper;b.options.resizable&&(f.find("> .k-resize-handle").remove(),b.thead.find("th").each(function(){c+=this.offsetWidth,d=a(this),d.is(":not(.k-group-cell,.k-hierarchy-cell)")&&a('<div class="k-resize-handle" />').css({left:c-T,top:e?0:Z(b.wrapper),width:T*2}).appendTo(f).data("th",d)}))},_resizable:function(){var b=this,d=b.options,e,f,g,h,i;d.resizable&&(e=d.scrollable?b.wrapper.find(".k-grid-header-wrap"):b.wrapper,b.positionColumnResizeHandles(),e.kendoResizable({handle:".k-resize-handle",hint:function(c){return a('<div class="k-grid-resize-indicator" />').css({height:c.data("th").outerHeight()+b.tbody.attr("clientHeight")})},start:function(c){var e=a(c.currentTarget).data("th"),j=a.inArray(e[0],e.parent().children(":visible")),k=b.tbody.parent(),l=b.footer||a();$(b.wrapper,e.css("cursor")),d.scrollable?i=b.thead.parent().find("col:eq("+j+")").add(k.children("colgroup").find("col:eq("+j+")")).add(l.find("colgroup").find("col:eq("+j+")")):i=k.children("colgroup").find("col:eq("+j+")"),f=c.pageX,g=e.outerWidth(),h=b.tbody.outerWidth()},resize:function(c){var e=g+c.pageX-f,j=b.footer||a(),k=0;e>10&&(i.css("width",e),d.scrollable&&(b._footerWidth=h+c.pageX-f,b.tbody.parent().add(b.thead.parent()).add(j.find("table")).css("width",b._footerWidth)),a(".k-resize-handle",b.wrapper).each(function(){k+=a(this).data("th").outerWidth(),a(this).css("left",k-T)}))},resizeend:function(d){var e=a(d.currentTarget).data("th"),f=e.outerWidth(),h;$(b.wrapper,""),g!=f&&(h=b.columns[e.parent().find("th:not(.k-group-cell,.k-hierarchy-cell)").index(e)],h.width=f,b.trigger(K,{column:h,oldWidth:g,newWidth:f})),b.positionColumnResizeHandles(),b._hasDetails()&&b.tbody.find(">tr.k-detail-row ["+c.attr("role")+"=grid]").kendoGrid("positionColumnResizeHandles")}}))},_draggable:function(){var b=this;b.options.reorderable&&(b._draggableInstance=b.thead.kendoDraggable({group:c.guid(),filter:".k-header:not(.k-group-cell,.k-hierarchy-cell)["+c.attr("field")+"]",hint:function(b){return a('<div class="k-header k-drag-clue" />').css({width:b.width(),paddingLeft:b.css("paddingLeft"),paddingRight:b.css("paddingRight"),lineHeight:b.height()+"px",paddingTop:b.css("paddingTop"),paddingBottom:b.css("paddingBottom")}).html(b.attr(c.attr("title"))||b.attr(c.attr("field"))).prepend('<span class="k-icon k-drag-status k-denied" />')}}).data("kendoDraggable"))},_reorderable:function(){var a=this;a.options.reorderable&&a.thead.kendoReorderable({draggable:a._draggableInstance,change:function(b){var c=a.columns[b.oldIndex];a.trigger(L,{newIndex:b.newIndex,oldIndex:b.oldIndex,column:c}),a.reorderColumn(b.newIndex,c)}})},reorderColumn:function(b,d){var e=this,f=a.inArray(d,e.columns),g,h,i;if(f!==b){e.columns.splice(f,1),e.columns.splice(b,0,d),e._templates(),ba(e.thead.prev().find("col:not(.k-group-col,.k-hierarchy-col)"),f,b),e.options.scrollable&&ba(e.tbody.prev().find("col:not(.k-group-col,.k-hierarchy-col)"),f,b),ba(e.thead.find(".k-header:not(.k-group-cell,.k-hierarchy-cell)"),f,b),e.footer&&(ba(e.footer.find(".k-grid-footer-wrap>table>colgroup>col:not(.k-group-col,.k-hierarchy-col)"),f,b),ba(e.footer.find(".k-footer-template>td:not(.k-group-cell,.k-hierarchy-cell)"),f,b)),g=e.tbody.children(":not(.k-grouping-row,.k-detail-row)");for(h=0,i=g.length;h<i;h+=1)ba(g.eq(h).find(">td:not(.k-group-cell,.k-hierarchy-cell)"),f,b);e.options.resizable&&(e.positionColumnResizeHandles(),e._hasDetails()&&e.tbody.find(">tr.k-detail-row ["+c.attr("role")+"=grid]").kendoGrid("positionColumnResizeHandles"))}},cellIndex:function(b){return a(b).parent().find("td:not(.k-group-cell,.k-hierarchy-cell)").index(b)},_modelForContainer:function(a){!a.is("tr")&&this._editMode()!=="popup"&&(a=a.closest("tr"));var b=a.attr(c.attr("uid"));return this.dataSource.getByUid(b)},_editable:function(){var b=this,c=b.options.editable,d=function(){var c=document.activeElement,d=b._editContainer;d&&!a.contains(d[0],c)&&d[0]!==c&&!a(c).closest(".k-animation-container").length&&b.editable.end()&&b.closeCell()};if(c){var e=b._editMode();e==="incell"?c.update!==!1&&(b.wrapper.delegate("tr:not(.k-grouping-row) > td:not(.k-hierarchy-cell,.k-detail-cell,.k-group-cell,.k-edit-cell,:has(a.k-grid-delete))",M,function(c){var d=a(this);d.closest("tbody")[0]===b.tbody[0]&&!a(c.target).is(":input")&&(b.editable?b.editable.end()&&(b.closeCell(),b.editCell(d)):b.editCell(d))}),b.wrapper.bind("focusin",function(a){clearTimeout(b.timer),b.timer=null}),b.wrapper.bind("focusout",function(a){b.timer=setTimeout(d,1)})):c.update!==!1&&b.wrapper.delegate("tbody>tr:not(.k-detail-row,.k-grouping-row):visible a.k-grid-edit",M,function(c){c.preventDefault(),b.editRow(a(this).closest("tr"))}),c.destroy!==!1&&b.wrapper.delegate("tbody>tr:not(.k-detail-row,.k-grouping-row):visible a.k-grid-delete",M,function(c){c.preventDefault(),b.removeRow(a(this).closest("tr"))})}},editCell:function(a){var b=this,c=b.columns[b.cellIndex(a)],d=b._modelForContainer(a);d&&(!d.editable||d.editable(c.field))&&!c.command&&c.field&&(b._attachModelChange(d),b._editContainer=a,b.editable=a.addClass("k-edit-cell").kendoEditable({fields:{field:c.field,format:c.format,editor:c.editor},model:d,change:function(c){b.trigger(z,{values:c.values,container:a,model:d})&&c.preventDefault()}}).data("kendoEditable"),a.parent().addClass("k-grid-edit-row"),b.trigger(y,{container:a,model:d}))},_destroyEditable:function(){var a=this;a.editable&&(a._detachModelChange(),a.editable.destroy(),delete a.editable,a._editMode()==="popup"&&a._editContainer.data("kendoWindow").close(),a._editContainer=null)},_attachModelChange:function(a){var b=this;b._modelChangeHandler=function(a){b._modelChange({field:a.field,model:this})},a.bind("change",b._modelChangeHandler)},_detachModelChange:function(){var a=this,b=a._editContainer,c=a._modelForContainer(b);c&&c.unbind(C,a._modelChangeHandler)},closeCell:function(){var b=this,d=b._editContainer.removeClass("k-edit-cell"),e=d.closest("tr").attr(c.attr("uid")),f=b.columns[b.cellIndex(d)],g=b.dataSource.getByUid(e);d.parent().removeClass("k-grid-edit-row"),b._destroyEditable(),b._displayCell(d,f,g),d.hasClass("k-dirty-cell")&&a('<span class="k-dirty"/>').prependTo(d)},_displayCell:function(a,b,d){var e=this,f={storage:{},count:0},g=k({},c.Template,e.options.templateSettings),h=c.template(e._cellTmpl(b,f),g);f.count>0&&(h=n(h,f.storage)),a.empty().html(h(d))},removeRow:function(b){var c=this,d,e;!c._confirmation()||(b=a(b).hide(),d=c._modelForContainer(b),d&&!c.trigger(A,{row:b,model:d})&&(c.dataSource.remove(d),e=c._editMode(),(e==="inline"||e==="popup")&&c.dataSource.sync()))},_editMode:function(){var a="incell",b=this.options.editable;b!==!0&&(a=b.mode||b);return a},editRow:function(a){var b=this,c=b._modelForContainer(a),d;b.cancelRow(),c&&(b._attachModelChange(c),b._editMode()==="popup"?b._createPopupEditor(c):b._createInlineEditor(a,c),d=b._editContainer,d.delegate("a.k-grid-cancel",M,function(a){a.preventDefault(),b.cancelRow()}),d.delegate("a.k-grid-update",M,function(a){a.preventDefault(),b.saveRow()}))},_createPopupEditor:function(b){var d=this,e="<div "+c.attr("uid")+'="'+b.uid+'"><div class="k-edit-form-container">',f,g=[],h,i,l,m=d.options.editable,o=j(m)?m.window:{},p=k({},c.Template,d.options.templateSettings);if(m.template)e+=c.template(m.template,p)(b);else for(h=0,i=d.columns.length;h<i;h++){f=d.columns[h];if(!f.command){e+='<div class="k-edit-label"><label for="'+f.field+'">'+(f.title||f.field||"")+"</label></div>";if((!b.editable||b.editable(f.field))&&f.field)g.push({field:f.field,format:f.format,editor:f.editor}),e+="<div "+c.attr("container-for")+'="'+f.field+'" class="k-edit-field"></div>';else{var q={storage:{},count:0};l=c.template(d._cellTmpl(f,q),p),q.count>0&&(l=n(l,q.storage)),e+='<div class="k-edit-field">'+l(b)+"</div>"}}}e+=d._createButton("update")+d._createButton("canceledit"),e+="</div></div>";var r=d._editContainer=a(e).appendTo(d.wrapper).kendoWindow(k({modal:!0,resizable:!1,draggable:!0,title:"Edit",visible:!1},o)),s=r.data("kendoWindow");s.wrapper.delegate(".k-close","click",function(){d.cancelRow()}),d.editable=d._editContainer.kendoEditable({fields:g,model:b,clearContainer:!1}).data("kendoEditable"),s.center().open(),d.trigger(y,{container:r,model:b})},_createInlineEditor:function(b,c){var d=this,e,f,g=[];b.children(":not(.k-group-cell,.k-hierarchy-cell)").each(function(){f=a(this),e=d.columns[d.cellIndex(f)],!e.command&&e.field&&(!c.editable||c.editable(e.field))?(g.push({field:e.field,format:e.format,editor:e.editor}),f.attr("data-container-for",e.field),f.empty()):e.command&&bc(e.command,"edit")&&(f.empty(),a(d._createButton("update")+d._createButton("canceledit")).appendTo(f))}),d._editContainer=b,d.editable=b.addClass("k-grid-edit-row").kendoEditable({fields:g,model:c,clearContainer:!1}).data("kendoEditable"),d.trigger(y,{container:b,model:c})},cancelRow:function(){var a=this,b=a._editContainer,d;b&&(d=a._modelForContainer(b),a.dataSource.cancelChanges(d),a._editMode()!=="popup"?a._displayRow(b):a._displayRow(a.items().filter("["+c.attr("uid")+"="+d.uid+"]")),a._destroyEditable())},saveRow:function(){var a=this,b=a._editContainer,c=a._modelForContainer(b),d=a.editable;b&&d&&d.end()&&!a.trigger(z,{container:b,model:c})&&(a._editMode()!=="popup"&&a._displayRow(b),a._destroyEditable(),a.dataSource.sync())},_displayRow:function(b){var c=this,d=c._modelForContainer(b);d&&b.replaceWith(a((b.hasClass("k-alt")?c.altRowTemplate:c.rowTemplate)(d)))},_showMessage:function(a){return window.confirm(a)},_confirmation:function(){var a=this,b=a.options.editable,c=b===!0||typeof b===Q?R:b.confirmation;return c!==!1&&c!=null?a._showMessage(c):!0},cancelChanges:function(){this.dataSource.cancelChanges()},saveChanges:function(){var a=this;(a.editable&&a.editable.end()||!a.editable)&&!a.trigger(D)&&a.dataSource.sync()},addRow:function(){var a=this,b,d=a.dataSource;if(a.editable&&a.editable.end()||!a.editable){b=d.indexOf((d.view()||[])[0]),b<0&&(b=0);var e=d.insert(b,{}),f=e.uid,g=a._editMode(),h=a.table.find("tr["+c.attr("uid")+"="+f+"]"),i=h.children("td:not(.k-group-cell,.k-hierarchy-cell)").first();g!=="inline"&&g!=="popup"||!h.length?i.length&&a.editCell(i):a.editRow(h)}},_toolbar:function(){var b=this,d=b.wrapper,e=b.options.toolbar,f;e&&(e=o(e)?e({}):typeof e===Q?e:b._toolbarTmpl(e).replace(U,"\\#"),f=n(c.template(e),b),a('<div class="k-toolbar k-grid-toolbar" />').html(f({})).prependTo(d).delegate(".k-grid-add",M,function(a){a.preventDefault(),b.addRow()}).delegate(".k-grid-cancel-changes",M,function(a){a.preventDefault(),b.cancelChanges()}).delegate(".k-grid-save-changes",M,function(a){a.preventDefault(),b.saveChanges()}))},_toolbarTmpl:function(a){var b=this,c,d,e="";if(m(a))for(c=0,d=a.length;c<d;c++)e+=b._createButton(a[c]);return e},_createButton:function(a){var b=a.template||V,d=typeof a===Q?a:a.name,e={className:"",text:d,imageClass:"",attr:"",iconClass:""};j(a)?e=k(!0,e,Y[d],a):e=k(!0,e,Y[d]);return c.template(b)(e)},_groupable:function(){var b=this,c=b.wrapper,d=b.options.groupable;b.groupable||b.table.delegate(".k-grouping-row .k-collapse, .k-grouping-row .k-expand",M,function(c){var d=a(this),e=d.closest("tr");d.hasClass("k-collapse")?b.collapseGroup(e):b.expandGroup(e),c.preventDefault(),c.stopPropagation()}),d&&(c.has("div.k-grouping-header")[0]||a("<div />").addClass("k-grouping-header").html("&nbsp;").prependTo(c),b.groupable&&b.groupable.destroy(),b.groupable=new f(c,{draggable:b._draggableInstance,groupContainer:"div.k-grouping-header",dataSource:b.dataSource,allowDrag:b.options.reorderable}))},_selectable:function(){var a=this,b,d,e=a.options.selectable;e&&(b=typeof e===Q&&e.toLowerCase().indexOf("multiple")>-1,d=typeof e===Q&&e.toLowerCase().indexOf("cell")>-1,a.selectable=new c.ui.Selectable(a.table,{filter:">"+(d?v:"tbody>tr:not(.k-grouping-row,.k-detail-row,.k-group-footer)"),multiple:b,change:function(){a.trigger(C)}}),a.options.navigatable&&a.wrapper.keydown(function(c){var e=a.current();c.keyCode===i.SPACEBAR&&c.target==a.wrapper[0]&&!e.hasClass("k-edit-cell")&&(c.preventDefault(),c.stopPropagation(),e=d?e:e.parent(),b?c.ctrlKey?e.hasClass(J)&&(e.removeClass(J),e=null):a.selectable.clear():a.selectable.clear(),a.selectable.value(e))}))},clearSelection:function(){var a=this;a.selectable.clear(),a.trigger(C)},select:function(b){var c=this,d=c.selectable;b=a(b);if(b.length)d.options.multiple||(d.clear(),b=b.first()),d.value(b);else return d.value()},current:function(a){var c=this,d=c.options.scrollable,e=c._current;a!==b&&a.length&&(!e||e[0]!==a[0])&&(a.addClass(H),e&&e.removeClass(H),c._current=a,a.length&&d&&(c._scrollTo(a.parent()[0],c.content[0]),d.virtual?c._scrollTo(a[0],c.content.find(">.k-virtual-scrollable-wrap")[0]):c._scrollTo(a[0],c.content[0])));return c._current},_scrollTo:function(a,b){var c=a.tagName.toLowerCase()==="td",d=a[c?"offsetLeft":"offsetTop"],e=a[c?"offsetWidth":"offsetHeight"],f=b[c?"scrollLeft":"scrollTop"],g=b[c?"clientWidth":"clientHeight"],h=d+e;b[c?"scrollLeft":"scrollTop"]=f>d?d:h>f+g?h-g:f},_navigatable:function(){var b=this,c=b.wrapper,d=b.table.addClass(I),e=n(b.current,b),f="."+I+" "+w,g=a.browser,h=function(d){var f=a(d.currentTarget);f.closest("tbody")[0]===b.tbody[0]&&(e(f),a(d.target).is(":button,a,:input,a>.k-icon,textarea,span.k-icon,.k-input")||setTimeout(function(){c.focus()}),d.stopPropagation())};b.options.navigatable&&(c.bind({focus:function(){var a=b._current;a&&a.is(":visible")?a.addClass(H):e(b.table.find(x))},focusout:function(a){b._current&&b._current.removeClass(H),a.stopPropagation()},keydown:function(f){var h=f.keyCode,j=b.current(),k=f.shiftKey,l=b.dataSource,m=b.options.pageable,n=!a(f.target).is(":button,a,:input,a>.t-icon"),o=b._editMode()=="incell",p,q,r=!1;n&&i.UP===h?(e(j?j.parent().prevAll(t).last().children(":eq("+j.index()+"),:eq(0)").last():d.find(x)),r=!0):n&&i.DOWN===h?(e(j?j.parent().nextAll(t).first().children(":eq("+j.index()+"),:eq(0)").last():d.find(x)),r=!0):n&&i.LEFT===h?(e(j?j.prevAll(u+":first"):d.find(x)),r=!0):n&&i.RIGHT===h?(e(j?j.nextAll(":visible:first"):d.find(x)),r=!0):n&&m&&i.PAGEDOWN==h?(b._current=null,l.page(l.page()+1),r=!0):n&&m&&i.PAGEUP==h?(b._current=null,l.page(l.page()-1),r=!0):b.options.editable&&(j=j?j:d.find(x),i.ENTER==h||i.F12==h?(b._handleEditing(j),r=!0):i.TAB==h&&o?(q=k?j.prevAll(u+":first"):j.nextAll(":visible:first"),q.length||(q=j.parent()[k?"prevAll":"nextAll"]("tr:not(.k-grouping-row,.k-detail-row):visible").children(u+(k?":last":":first"))),q.length&&(b._handleEditing(j,q),r=!0)):i.ESC==h&&b._editContainer&&(b._editContainer.has(j[0])||j[0]===b._editContainer[0])&&(o?b.closeCell():(p=b.items().index(j.parent()),document.activeElement.blur(),b.cancelRow(),p>=0&&b.current(b.items().eq(p).children().filter(u).first())),g.msie&&parseInt(g.version,10)<9&&document.body.focus(),c.focus(),r=!0)),r&&(f.preventDefault(),f.stopPropagation())}}),c.delegate(f,"mousedown",h))},_handleEditing:function(b,c){var d=this,e=d._editMode(),f=d._editContainer,g,h;e=="incell"?h=b.hasClass("k-edit-cell"):h=b.parent().hasClass("k-grid-edit-row");if(d.editable){a.contains(f[0],document.activeElement)&&a(document.activeElement).blur();if(d.editable.end())e=="incell"?d.closeCell():(b.parent()[0]===f[0]?g=d.items().index(b.parent()):g=d.items().index(f),d.saveRow(),d.current(d.items().eq(g).children().filter(u).first()),h=!0);else{e=="incell"?d.current(f):d.current(f.children().filter(u).first()),f.find(":input:visible:first").focus();return}}c&&d.current(c),d.wrapper.focus();if(!h&&!c||c)e=="incell"?d.editCell(d.current()):d.editRow(d.current().parent())},_wrapper:function(){var a=this,b=a.table,c=a.options.height,d=a.element;d.is("div")||(d=d.wrap("<div/>").parent()),a.wrapper=d.addClass("k-grid k-widget").attr(O,q.max(b.attr(O)||0,0)),b.removeAttr(O),c&&(a.wrapper.css(N,c),b.css(N,"auto"))},_tbody:function(){var b=this,c=b.table,d;d=c.find(">tbody"),d.length||(d=a("<tbody/>").appendTo(c)),b.tbody=d},_scrollable:function(){var b=this,d,e,f=b.options,g=f.scrollable,h=c.support.scrollbar();if(g){d=b.wrapper.children(".k-grid-header"),d[0]||(d=a('<div class="k-grid-header" />').insertBefore(b.table)),d.css("padding-right",g.virtual?h+1:h),e=a('<table cellspacing="0" />'),e.append(b.thead),d.empty().append(a('<div class="k-grid-header-wrap" />').append(e)),b.content=b.table.parent(),b.content.is(".k-virtual-scrollable-wrap")&&(b.content=b.content.parent()),b.content.is(".k-grid-content, .k-virtual-scrollable-wrap")||(b.content=b.table.wrap('<div class="k-grid-content" />').parent(),g!==!0&&g.virtual&&(b.virtualScrollable=new W(b.content,{dataSource:b.dataSource,itemHeight:n(b._averageRowHeight,b)}))),b.scrollables=d.children(".k-grid-header-wrap");if(g.virtual)b.content.find(">.k-virtual-scrollable-wrap").bind("scroll",function(){b.scrollables.scrollLeft(this.scrollLeft)});else{b.content.bind("scroll",function(){b.scrollables.scrollLeft(this.scrollLeft)});var i=c.touchScroller(b.content);i&&i.movable&&i.movable.bind("change",function(a){b.scrollables.scrollLeft(-a.sender.x)})}}},_setContentHeight:function(){var a=this,b=a.options,d=a.wrapper.innerHeight(),e=a.wrapper.children(".k-grid-header"),f=c.support.scrollbar();if(b.scrollable){d-=e.outerHeight(),a.pager&&(d-=a.pager.element.outerHeight()),b.groupable&&(d-=a.wrapper.children(".k-grouping-header").outerHeight()),b.toolbar&&(d-=a.wrapper.children(".k-grid-toolbar").outerHeight()),a.footerTemplate&&(d-=a.wrapper.children(".k-grid-footer").outerHeight());var g=function(a){var b,c;if(a[0].style.height)return!0;b=a.height(),a.height("auto"),c=a.height();if(b!=c){a.height("");return!0}a.height("");return!1};g(a.wrapper)&&(d>f*2?a.content.height(d):a.content.height(f*2+1))}},_averageRowHeight:function(){var a=this,b=a._rowHeight;a._rowHeight||(a._rowHeight=b=a.table.outerHeight()/a.table[0].rows.length,a._sum=b,a._measures=1);var c=a.table.outerHeight()/a.table[0].rows.length;b!==c&&(a._measures++,a._sum+=c,a._rowHeight=a._sum/a._measures);return b},_dataSource:function(){var a=this,c=a.options,d,f=c.dataSource;f=m(f)?{data:f}:f,j(f)&&(k(f,{table:a.table,fields:a.columns}),d=c.pageable,j(d)&&d.pageSize!==b&&(f.pageSize=d.pageSize)),a.dataSource&&a._refreshHandler?a.dataSource.unbind(C,a._refreshHandler).unbind(r,a._requestStartHandler).unbind(s,a._errorHandler):(a._refreshHandler=n(a.refresh,a),a._requestStartHandler=n(a._requestStart,a),a._errorHandler=n(a._error,a)),a.dataSource=e.create(f).bind(C,a._refreshHandler).bind(r,a._requestStartHandler).bind(s,a._errorHandler)},_error:function(){this._progress(!1)},_requestStart:function(){this._progress(!0)},_modelChange:function(b){var e=this,f=b.model,g=e.tbody.find("tr["+c.attr("uid")+"="+f.uid+"]"),h,i,j=g.hasClass("k-alt"),k,l,m;if(g.children(".k-edit-cell").length&&!e.options.rowTemplate)g.children(":not(.k-group-cell,.k-hierarchy-cell)").each(function(){h=a(this),i=e.columns[e.cellIndex(h)],i.field===b.field&&(h.hasClass("k-edit-cell")?h.addClass("k-dirty-cell"):(e._displayCell(h,i,f),a('<span class="k-dirty"/>').prependTo(h)))});else if(!g.hasClass("k-grid-edit-row")){k=a((j?e.altRowTemplate:e.rowTemplate)(f)),g.replaceWith(k);for(l=0,m=e.columns.length;l<m;l++)i=e.columns[l],i.field===b.field&&(h=k.children(":not(.k-group-cell,.k-hierarchy-cell)").eq(l),a('<span class="k-dirty"/>').prependTo(h));e.trigger("itemChange",{item:k,data:f,ns:d})}},_pageable:function(){var b=this,d,e=b.options.pageable;e&&(d=b.wrapper.children("div.k-grid-pager").empty(),d.length||(d=a('<div class="k-pager-wrap k-grid-pager"/>').appendTo(b.wrapper)),b.pager&&b.pager.destroy(),typeof e=="object"&&e instanceof c.ui.Pager?b.pager=e:b.pager=new c.ui.Pager(d,k({},e,{dataSource:b.dataSource})))},_footer:function(){var b=this,c=b.dataSource.aggregates(),d="",e=b.footerTemplate,f=b.options;if(e){c=p(c)?_(b.dataSource.aggregate()):c,d=a(b._wrapFooter(e(c)));if(b.footer){var g=d;b.footer.replaceWith(g),b.footer=g}else f.scrollable?(b.footer=f.pageable?d.insertBefore(b.wrapper.children("div.k-grid-pager")):d.appendTo(b.wrapper),b.scrollables=b.scrollables.add(b.footer.children(".k-grid-footer-wrap"))):b.footer=d.insertBefore(b.tbody);f.resizable&&b._footerWidth&&b.footer.find("table").css("width",b._footerWidth),b._setContentHeight()}},_wrapFooter:function(b){var c=this,d="";if(c.options.scrollable){d=a('<div class="k-grid-footer"><div class="k-grid-footer-wrap"><table cellspacing="0"><tbody>'+b+"</tbody></table></div></div>"),c._appendCols(d.find("table"));return d}return'<tfoot class="k-grid-footer">'+b+"</tfoot>"},_filterable:function(){var b=this,c=b.columns,d=b.options.filterable;d&&b.thead.find("th:not(.k-hierarchy-cell)").each(function(e){c[e].filterable!==!1&&a(this).kendoFilterMenu(k(!0,{},d,c[e].filterable,{dataSource:b.dataSource}))})},_sortable:function(){var b=this,c=b.columns,d,e=b.options.sortable;e&&b.thead.find("th:not(.k-hierarchy-cell)").each(function(f){d=c[f],d.sortable!==!1&&!d.command&&a(this).kendoSortable(k({},e,{dataSource:b.dataSource}))})},_columns:function(b){var d=this,e=d.table,f,g=e.find("col"),h=d.options.dataSource;b=b.length?b:l(e.find("th"),function(b,d){b=a(b);var e=b.attr(c.attr("sortable")),f=b.attr(c.attr("filterable")),h=b.attr(c.attr("type")),i=b.attr(c.attr("groupable")),j=b.attr(c.attr("field"));j||(j=b.text().replace(/\s|[^A-z0-9]/g,""));return{field:j,type:h,sortable:e!=="false",filterable:f!=="false",groupable:i!=="false",template:b.attr(c.attr("template")),width:g.eq(d).css("width")}}),f=!(d.table.find("tbody tr").length>0&&(!h||!h.transport)),d.columns=l(b,function(a){a=typeof a===Q?{field:a}:a;return k({encoded:f},a)})},_tmpl:function(a,b){var d=this,e=k({},c.Template,d.options.templateSettings),f,g=d.columns.length,h,i={storage:{},count:0},j,l,m=d._hasDetails(),o=[],p=d.dataSource.group().length;if(!a){a="<tr",b&&o.push("k-alt"),m&&o.push("k-master-row"),o.length&&(a+=' class="'+o.join(" ")+'"'),g&&(a+=" "+c.attr("uid")+'="#=uid#"'),a+=">",p>0&&(a+=X(p)),m&&(a+='<td class="k-hierarchy-cell"><a class="k-icon k-plus" href="\\#"></a></td>');for(f=0;f<g;f++)j=d.columns[f],h=j.template,l=typeof h,a+="<td>",a+=d._cellTmpl(j,i),a+="</td>";a+="</tr>"}a=c.template(a,e);if(i.count>0)return n(a,i.storage);return a},_cellTmpl:function(a,b){var d=this,e=k({},c.Template,d.options.templateSettings),f=a.template,g=e.paramName,h="",i,j,l=a.format,n=typeof f;if(a.command){if(m(a.command)){for(i=0,j=a.command.length;i<j;i++)h+=d._createButton(a.command[i]);return h.replace(U,"\\#")}return d._createButton(a.command).replace(U,"\\#")}n===P?(b.storage["tmpl"+b.count]=f,h+="#=this.tmpl"+b.count+"("+g+")#",b.count++):n===Q?h+=f:(h+=a.encoded?"${":"#=",l&&(h+='kendo.format("'+l.replace(S,"\\}")+'",'),e.useWithBlock||(h+=g+"."),h+=a.field,l&&(h+=")"),h+=a.encoded?"}":"#");return h},_templates:function(){var b=this,c=b.options,d=b.dataSource,e=d.group(),f=d.aggregate();b.rowTemplate=b._tmpl(c.rowTemplate),b.altRowTemplate=b._tmpl(c.altRowTemplate||c.rowTemplate,!0),b._hasDetails()&&(b.detailTemplate=b._detailTmpl(c.detailTemplate||""));if(!p(f)||a.grep(b.columns,function(a){return a.footerTemplate}).length)b.footerTemplate=b._footerTmpl(f,"footerTemplate","k-footer-template");e.length&&a.grep(b.columns,function(a){return a.groupFooterTemplate}).length&&(f=a.map(e,function(a){return a.aggregates}),b.groupFooterTemplate=b._footerTmpl(f,"groupFooterTemplate","k-group-footer"))},_footerTmpl:function(a,b,d){var e=this,f=k({},c.Template,e.options.templateSettings),g=f.paramName,h="",i,j,l=e.columns,m,o,p={},q=0,r={},s=e.dataSource,t=s.group().length,u=_(a),v;h+='<tr class="'+d+'">',t>0&&(h+=X(t)),e._hasDetails()&&(h+='<td class="k-hierarchy-cell">&nbsp;</td>');for(i=0,j=e.columns.length;i<j;i++)v=l[i],m=v[b],o=typeof m,h+="<td>",m?(o!==P&&(r=u[v.field]?k({},f,{paramName:g+"."+v.field}):{},m=c.template(m,r)),p["tmpl"+q]=m,h+="#=this.tmpl"+q+"("+g+")#",q++):h+="&nbsp;",h+="</td>";h+="</tr>",h=c.template(h,f);if(q>0)return n(h,p);return h},_detailTmpl:function(a){var b=this,d="",e=k({},c.Template,b.options.templateSettings),f=e.paramName,g={},h=0,i=b.dataSource.group().length,j=b.columns.length,l=typeof a;d+='<tr class="k-detail-row">',i>0&&(d+=X(i)),d+='<td class="k-hierarchy-cell"></td><td class="k-detail-cell"'+(j?' colspan="'+j+'"':"")+">",l===P?(g["tmpl"+h]=a,d+="#=this.tmpl"+h+"("+f+")#",h++):d+=a,d+="</td></tr>",d=c.template(d,e);if(h>0)return n(d,g);return d},_hasDetails:function(){var a=this;return a.options.detailTemplate!==b||(a._events[B]||[]).length},_details:function(){var b=this;b.table.delegate(".k-hierarchy-cell .k-plus, .k-hierarchy-cell .k-minus",M,function(c){var d=a(this),e=d.hasClass("k-plus"),f=d.closest("tr.k-master-row"),g,h=b.detailTemplate,i,j=b._hasDetails();d.toggleClass("k-plus",!e).toggleClass("k-minus",e),j&&!f.next().hasClass("k-detail-row")&&(i=b.dataItem(f),a(h(i)).insertAfter(f),b.trigger(B,{masterRow:f,detailRow:f.next(),data:i,detailCell:f.next().find(".k-detail-cell")})),g=f.next(),b.trigger(e?F:G,{masterRow:f,detailRow:g}),g.toggle(e),c.preventDefault();return!1})},dataItem:function(b){return this._data[this.tbody.find("> tr:not(.k-grouping-row,.k-detail-row,.k-group-footer)").index(a(b))]},expandRow:function(b){a(b).find("> td .k-plus, > td .k-expand").click()},collapseRow:function(b){a(b).find("> td .k-minus, > td .k-collapse").click()},_thead:function(){var d=this,e=d.columns,f=d._hasDetails()&&e.length,g,h,i="",j=d.table.find("thead"),k,l;j.length||(j=a("<thead/>").insertBefore(d.tbody)),k=d.table.find("tr").filter(":has(th)"),k.length||(k=j.children().first(),k.length||(k=a("<tr/>")));if(!k.children().length){f&&(i+='<th class="k-hierarchy-cell">&nbsp;</th>');for(g=0,h=e.length;g<h;g++)l=e[g],l.command?i+="<th>"+(l.title||"")+"</th>":(i+="<th "+c.attr("field")+"='"+l.field+"' ",l.title&&(i+=c.attr("title")+'="'+l.title.replace(/'/g,"'")+'" '),l.groupable!==b&&(i+=c.attr("groupable")+"='"+l.groupable+"' "),l.aggregates&&(i+=c.attr("aggregates")+"='"+l.aggregates+"'"),i+=">"+(l.title||l.field||"")+"</th>");k.html(i)}else f&&k.prepend('<th class="k-hierarchy-cell">&nbsp;</th>');k.find("th").addClass("k-header"),d.options.scrollable||j.addClass("k-grid-header"),k.appendTo(j),d.thead=j,d._sortable(),d._filterable(),d._scrollable(),d._updateCols(),d._setContentHeight(),d._resizable(),d._draggable(),d._reorderable()},_updateCols:function(){var a=this;a._appendCols(a.thead.parent().add(a.table))},_appendCols:function(b){var d=this,e=b.find("colgroup"),f,g=l(d.columns,function(a){f=a.width;if(f&&parseInt(f,10)!==0)return c.format('<col style="width:{0}"/>',typeof f===Q?f:f+"px");return"<col />"}),h=d.dataSource.group().length;d._hasDetails()&&g.splice(0,0,'<col class="k-hierarchy-col" />'),e.length&&e.remove(),e=a("<colgroup/>").append(a(Array(h+1).join('<col class="k-group-col">')+g.join(""))),b.prepend(e)},_autoColumns:function(a){if(a&&a.toJSON){var b=this,c;a=a.toJSON();for(c in a)b.columns.push({field:c});b._thead(),b._templates()}},_rowsHtml:function(a){var b=this,c="",d,e,f=b.rowTemplate,g=b.altRowTemplate;for(d=0,e=a.length;d<e;d++)d%2?c+=g(a[d]):c+=f(a[d]),b._data.push(a[d]);return c},_groupRowHtml:function(b,d,e){var f=this,g="",h,i,j=b.field,l=a.grep(f.columns,function(a){return a.field==j})[0]||{},m=l.format?c.format(l.format,b.value):b.value,n=l.groupHeaderTemplate,o=(l.title||j)+": "+m,p=k({},{field:b.field,value:b.value},b.aggregates[b.field]),q=b.items;n&&(o=typeof n===P?n(p):c.template(n)(p)),g+='<tr class="k-grouping-row">'+X(e)+'<td colspan="'+d+'">'+'<p class="k-reset">'+'<a class="k-icon k-collapse" href="#"></a>'+o+"</p></td></tr>";if(b.hasSubgroups)for(h=0,i=q.length;h<i;h++)g+=f._groupRowHtml(q[h],d-1,e+1);else g+=f._rowsHtml(q);f.groupFooterTemplate&&(g+=f.groupFooterTemplate(b.aggregates));return g},collapseGroup:function(b){b=a(b).find(".k-icon").addClass("k-expand").removeClass("k-collapse").end();var c=b.find(".k-group-cell").length,d=1,e,f;b.nextAll("tr").each(function(){f=a(this),e=f.find(".k-group-cell").length,f.hasClass("k-group-row")?d++:f.hasClass("k-group-footer")&&d--;if(e<=c||f.hasClass("k-group-footer")&&d<0)return!1;f.hide()})},expandGroup:function(b){b=a(b).find(".k-icon").addClass("k-collapse").removeClass("k-expand").end();var c=this,d=b.find(".k-group-cell").length;b.nextAll("tr").each(function(){var b=a(this),e=b.find(".k-group-cell").length;if(e<=d)return!1;e==d+1&&!b.hasClass("k-detail-row")&&(b.show(),b.hasClass("k-grouping-row")&&b.find(".k-icon").hasClass("k-collapse")&&c.expandGroup(b),b.hasClass("k-master-row")&&b.find(".k-icon").hasClass("k-minus")&&b.next().show())})},_updateHeader:function(b){var c=this,d=c.thead.find("th.k-group-cell"),e=d.length;b>e?a(Array(b-e+1).join('<th class="k-group-cell k-header">&nbsp;</th>')).prependTo(c.thead.find("tr")):b<e&&(e=e-b,a(a.grep(d,function(a,b){return e>b})).remove())},_firstDataItem:function(a,b){a&&b&&(a.hasSubgroups?a=this._firstDataItem(a.items[0],b):a=a.items[0]);return a},_progress:function(a){var b=this,d=b.element.is("table")?b.element.parent():b.content&&b.content.length?b.content:b.element;c.ui.progress(d,a)},refresh:function(b){var c=this,d,e,f="",h=c.dataSource.view(),i,j,k,l=c.current(),m=(c.dataSource.group()||[]).length,n=m+c.columns.length;if(!b||b.action!=="itemchange"||!c.editable){c.trigger("dataBinding"),l&&l.hasClass("k-state-focused")&&(k=c.items().index(l.parent())),c._destroyEditable(),c._progress(!1),c._data=[],c.columns.length||(c._autoColumns(c._firstDataItem(h[0],m)),n=m+c.columns.length),c._group=m>0||c._group,c._group&&(c._templates(),c._updateCols(),c._updateHeader(m),c._group=m>0);if(m>0){c.detailTemplate&&n++;for(e=0,d=h.length;e<d;e++)f+=c._groupRowHtml(h[e],n,0)}else f+=c._rowsHtml(h);g?c.tbody[0].innerHTML=f:(j=document.createElement("div"),j.innerHTML="<table><tbody>"+f+"</tbody></table>",i=j.firstChild.firstChild,c.table[0].replaceChild(i,c.tbody[0]),c.tbody=a(i)),c._footer(),k>=0&&c.current(c.items().eq(k).children().filter(u).first()),c.options.resizable&&c.positionColumnResizeHandles(),c.trigger(E)}}});d.plugin(bb),d.plugin(W)}(jQuery),function(a,b){var c=window.kendo,d="change",e="dataBound",f="dataBinding",g=c.ui.Widget,h=c.keys,i=">*",j="requestStart",k="error",l="k-state-focused",m="k-focusable",n="k-state-selected",o="k-edit-item",p="string",q="edit",r="remove",s=a.proxy,t=c.ui.progress,u=c.data.DataSource,v=g.extend({init:function(b,d){var e=this;d=a.isArray(d)?{dataSource:d}:d,g.fn.init.call(e,b,d),d=e.options,e.wrapper=e.element,e._element(),e._dataSource(),e.template=c.template(d.template||""),e.altTemplate=c.template(d.altTemplate||d.template),e.editTemplate=c.template(d.editTemplate||""),e._navigatable(),e._selectable(),e.options.autoBind&&e.dataSource.fetch(),c.notify(e)},events:[d,f,e,q,r],options:{name:"ListView",autoBind:!0,selectable:!1,navigatable:!1,template:"",altTemplate:"",editTemplate:""},items:function(){return this.element.find(i)},setDataSource:function(a){this.options.dataSource=a,this._dataSource(),this.options.autoBind&&a.fetch()},_dataSource:function(){var a=this;a.dataSource&&a._refreshHandler?a.dataSource.unbind(d,a._refreshHandler).unbind(j,a._requestStartHandler).unbind(k,a._errorHandler):(a._refreshHandler=s(a.refresh,a),a._requestStartHandler=s(a._requestStart,a),a._errorHandler=s(a._error,a)),a.dataSource=u.create(a.options.dataSource).bind(d,a._refreshHandler).bind(j,a._requestStartHandler).bind(k,a._errorHandler)},_requestStart:function(){t(this.element,!0)},_error:function(){t(this.element,!1)},_element:function(){this.element.addClass("k-widget k-listview")},refresh:function(b){var c=this,d=c.dataSource.view(),g,h,i="",j,k,l=c.template,m=c.altTemplate;if(b&&b.action==="itemchange")c.editable||(g=b.items[0],j=d.indexOf(g),j>=0&&(h=a(l(g)),c.items().eq(j).replaceWith(h),c.trigger("itemChange",{item:h,data:g})));else{c.trigger(f),c._destroyEditable();for(j=0,k=d.length;j<k;j++)j%2?i+=m(d[j]):i+=l(d[j]);c.element.html(i),c.trigger(e)}},_selectable:function(){var a=this,b,e,f=a.options.selectable,g=a.options.navigatable;f&&(b=typeof f===p&&f.toLowerCase().indexOf("multiple")>-1,a.selectable=new c.ui.Selectable(a.element,{multiple:b,filter:i,change:function(){a.trigger(d)}}),g&&a.element.keydown(function(c){c.keyCode===h.SPACEBAR&&(e=a.current(),c.preventDefault(),b?c.ctrlKey?e.hasClass(n)&&(e.removeClass(n),e=null):a.selectable.clear():a.selectable.clear(),a.selectable.value(e))}))},current:function(a){var c=this,d=c._current;a!==b&&a.length&&(!d||d[0]!==a[0])&&(a.addClass(l),d&&d.removeClass(l),c._current=a);return c._current},_navigatable:function(){var b=this,c=b.options.navigatable,d=b.element,e=s(b.current,b),f=function(b){e(a(b.currentTarget)),a(b.target).is(":button,a,:input,a>.k-icon,textarea")||d.focus()};c&&(d.attr("tabIndex",Math.max(d.attr("tabIndex")||0,0)),d.bind({focus:function(){var a=b._current;a&&a.is(":visible")?a.addClass(l):e(d.find(i).first())},focusout:function(){b._current&&b._current.removeClass(l)},keydown:function(a){var c=a.keyCode,e=b.current();h.UP===c?b.current(e?e.prev():d.find(i).first()):h.DOWN===c?b.current(e?e.next():d.find(i).first()):h.PAGEUP==c?(b._current=null,b.dataSource.page(b.dataSource.page()-1)):h.PAGEDOWN==c&&(b._current=null,b.dataSource.page(b.dataSource.page()+1))}}),d.addClass(m).delegate("."+m+i,"mousedown",f))},clearSelection:function(){var a=this;a.selectable.clear(),a.trigger(d)},select:function(b){var c=this,d=c.selectable;b=a(b);if(b.length)d.options.multiple||(d.clear(),b=b.first()),d.value(b);else return d.value()},_destroyEditable:function(){var a=this;a.editable&&(a.editable.destroy(),delete a.editable)},_closeEditable:function(b){var c=this,d=c.editable,e,f,g=!0;d&&(b&&(g=d.end()),g&&(e=c.dataSource.view()[d.element.index()],f=a(c.template(e)),c._destroyEditable(),d.element.replaceWith(f)));return g},edit:function(b){var c=this,d=c.dataSource.view()[b.index()],e=a(c.editTemplate(d)).addClass(o);c.cancel(),b.replaceWith(e),c.editable=e.kendoEditable({model:d,clearContainer:!1,errorTemplate:!1}).data("kendoEditable"),c.trigger(q,{model:d,item:e})},save:function(){this._closeEditable(!0)&&this.dataSource.sync()},remove:function(a){var b=this,c=b.dataSource,d=c.view()[a.index()];b.trigger(r,{model:d,item:a})||(a.hide(),c.remove(d),c.sync())},add:function(){var a=this,b=a.dataSource,c=b.indexOf((b.view()||[])[0]);c<0&&(c=0),a.cancel(),b.insert(c,{}),a.edit(a.element.children().first())},cancel:function(){var a=this,b=a.dataSource,c,d=-1;a.editable&&(d=a.editable.element.index()),d!=-1&&(c=b.view()[d],b.cancelChanges(c),a._closeEditable(!1))}});c.ui.plugin(v)}(jQuery),function(a,b){var c=window.kendo,d=c.Class,e=c.ui.Widget,f=a.extend,g=c.deepExtend,h=c.keys,i=d.extend({init:function(a){var b=this;b.options=a},getHtml:function(){var a=this.options;return c.template(a.template)({cssClass:a.cssClass,tooltip:a.title,initialValue:a.initialValue})}}),j={select:function(a){a.trigger("select",{})},editorWrapperTemplate:'<table cellspacing="4" cellpadding="0" class="k-widget k-editor k-header"><tbody><tr><td class="k-editor-toolbar-wrap"><ul class="k-editor-toolbar"></ul></td></tr><tr><td class="k-editable-area"></td></tr></tbody></table>',buttonTemplate:'<li class="k-editor-button"><a href="" class="k-tool-icon #= cssClass #" unselectable="on" title="#= tooltip #">#= tooltip #</a></li>',colorPickerTemplate:'<li class="k-editor-colorpicker"><div class="k-widget k-colorpicker k-header #= cssClass #"><span class="k-tool-icon"><span class="k-selected-color"></span></span><span class="k-icon k-arrow-down"></span></div></li>',comboBoxTemplate:'<li class="k-editor-combobox"><select title="#= tooltip #" class="#= cssClass #"></select></li>',dropDownListTemplate:'<li class="k-editor-selectbox"><select title="#= tooltip #" class="#= cssClass #"></select></li>',focusable:".k-colorpicker,a.k-tool-icon:not(.k-state-disabled),.k-selectbox, .k-combobox .k-input",wrapTextarea:function(b){var c=b.width(),d=b.height(),e=j.editorWrapperTemplate,f=a(e).insertBefore(b).width(c).height(d),g=f.find(".k-editable-area");b.appendTo(g).addClass("k-content k-raw-content").hide();return b.closest(".k-editor")},renderTools:function(b,d){var e={},g,h,i,k=b._nativeTools,l,m,n=a(b.element).closest(".k-editor").find(".k-editor-toolbar");if(d)for(i=0;i<d.length;i++)g=d[i],a.isPlainObject(g)?(m=f({cssClass:"k-custom",type:"button",tooltip:""},g),m.name&&(m.cssClass="k-"+m.name),m.template||m.type=="button"&&(m.template=j.buttonTemplate)):b._tools[g]&&(e[g]=b._tools[g],m=e[g].options),l=m.template,l&&(l.getHtml?l=l.getHtml():(a.isFunction(l)||(l=c.template(l)),l=l(m)),h=a(l).appendTo(n),m.type=="button"&&m.exec&&h.find(".k-tool-icon").click(a.proxy(m.exec,b.element[0])));for(i=0;i<k.length;i++)e[k[i]]=b._tools[k[i]];b.options.tools=e},createContentElement:function(b,c){var d,e,f,g=b.closest(".k-rtl").length?"direction:rtl;":"";b.hide(),d=a("<iframe />",{src:'javascript:"<html></html>"',frameBorder:"0"}).css("display","").addClass("k-content").insertBefore(b)[0],e=d.contentWindow||d,f=e.document||d.contentDocument,f.designMode="On",f.open(),f.write("<!DOCTYPE html><html><head><meta charset='utf-8' /><style>html,body{padding:0;margin:0;font-family:Verdana,Geneva,sans-serif;background:#fff;}html{font-size:100%}body{font-size:.75em;line-height:1.5;padding-top:1px;margin-top:-1px;"+g+"}"+"h1{font-size:2em;margin:.67em 0}h2{font-size:1.5em}h3{font-size:1.16em}h4{font-size:1em}h5{font-size:.83em}h6{font-size:.7em}"+"p{margin:0 0 1em;padding:0 .2em}.k-marker{display:none;}.k-paste-container{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}"+"ul,ol{padding-left:2.5em}"+"a{color:#00a}"+"code{font-size:1.23em}"+"</style>"+a.map(c,function(a){return"<link rel='stylesheet' href='"+a+"'>"}).join("")+"</head><body spellcheck='false'></body></html>"),f.close();return e},initializeContentElement:function(b){var c=!0;b.window=j.createContentElement(a(b.textarea),b.options.stylesheets),b.document=b.window.contentDocument||b.window.document,b.body=b.document.body,a(b.document).bind({keydown:function(a){if(a.keyCode===h.F10)setTimeout(function(){var a="tabIndex",c=b.wrapper,d=c.attr(a);c.attr(a,d||0).focus().find("li:has("+l+")").first().focus(),!d&&d!==0&&c.removeAttr(a)},100),a.preventDefault();else{var d=b.keyboard.toolFromShortcut(b.options.tools,a);if(d){a.preventDefault(),/undo|redo/.test(d)||b.keyboard.endTyping(!0),b.exec(d);return!1}if(b.keyboard.isTypingKey(a)&&b.pendingFormats.hasPending())if(c)c=!1;else{var e=b.getRange();b.pendingFormats.apply(e),b.selectRange(e)}b.keyboard.clearTimeout(),b.keyboard.keydown(a)}},keyup:function(d){var e=[8,9,33,34,35,36,37,38,39,40,40,45,46];a.browser.mozilla&&d.keyCode==h.BACKSPACE&&p(b,d);if(a.inArray(d.keyCode,e)>-1||d.keyCode==65&&d.ctrlKey&&!d.altKey&&!d.shiftKey)b.pendingFormats.clear(),k(b);if(b.keyboard.isTypingKey(d)){if(b.pendingFormats.hasPending()){var f=b.getRange();b.pendingFormats.apply(f),b.selectRange(f)}}else c=!0;b.keyboard.keyup(d)},mousedown:function(c){b.pendingFormats.clear();var d=a(c.target);!a.browser.gecko&&c.which==2&&d.is("a[href]")&&window.open(d.attr("href"),"_new")},mouseup:function(){k(b)}}),a(b.window).bind("blur",function(){var a=b.textarea.value,c=b.encodedValue();b.update(),c!=a&&b.trigger("change")}),a(b.body).bind("cut paste",function(a){b.clipboard["on"+a.type](a)})},fixBackspace:function(a,b){var d=a.getRange(),e=d.startContainer,f=c.ui.editor.Dom,g=e.childNodes.length;if(!(e==a.body.firstChild||!f.isBlock(e)||g>0&&(g!=1||!f.is(e.firstChild,"br")))){var h=e.previousSibling;while(h&&!f.isBlock(h))h=h.previousSibling;if(!h)return;var i=a.document.createTreeWalker(h,window.NodeFilter.SHOW_TEXT,null,!1),j;for(;;){j=i.nextNode();if(j)h=j;else break}d.setStart(h,f.isDataNode(h)?h.nodeValue.length:0),d.collapse(!0),c.ui.editor.RangeUtils.selectRange(d),f.remove(e),b.preventDefault()}},formatByName:function(b,c){for(var d=0;d<c.length;d++)if(a.inArray(b,c[d].tags)>=0)return c[d]},registerTool:function(a,b){var c=s.fn._tools;c[a]=b,c[a].options&&c[a].options.template&&(c[a].options.template.options.cssClass="k-"+a)},registerFormat:function(a,b){c.ui.Editor.fn.options.formats[a]=b}},k=j.select,l=j.focusable,m=j.wrapTextarea,n=j.renderTools,o=j.initializeContentElement,p=j.fixBackspace,q={bold:"Bold",italic:"Italic",underline:"Underline",strikethrough:"Strikethrough",superscript:"Superscript",subscript:"Subscript",justifyCenter:"Center text",justifyLeft:"Align text left",justifyRight:"Align text right",justifyFull:"Justify",insertUnorderedList:"Insert unordered list",insertOrderedList:"Insert ordered list",indent:"Indent",outdent:"Outdent",createLink:"Insert hyperlink",unlink:"Remove hyperlink",insertImage:"Insert image",insertHtml:"Insert HTML",fontName:"Select font family",fontNameInherit:"(inherited font)",fontSize:"Select font size",fontSizeInherit:"(inherited size)",formatBlock:"Format",style:"Styles",emptyFolder:"Empty Folder",uploadFile:"Upload",orderBy:"Arrange by:",orderBySize:"Size",orderByName:"Name",invalidFileType:'The selected file "{0}" is not valid. Supported file types are {1}.',deleteFile:'Are you sure you want to delete "{0}"?',overwriteFile:'A file with name "{0}" already exists in the current directory. Do you want to overwrite it?',directoryNotFound:"A directory with this name was not found."},r=!c.support.mobileOS||c.support.mobileOS.ios&&c.support.mobileOS.majorVersion>=5,s=e.extend({init:function(b,d){function t(a,b){if(!b.key)return a;var c=a+" (";b.ctrl&&(c+="Ctrl + "),b.shift&&(c+="Shift + "),b.alt&&(c+="Alt + "),c+=b.key+")";return c}function s(b){var c=a.grep(b.className.split(" "),function(a){return!/^k-(widget|tool-icon|state-hover|header|combobox|dropdown|selectbox|colorpicker)$/i.test(a)});return c[0]?c[0].substring(2):"custom"}if(!!r){var f=this,i,j,k=c.ui.editor;e.fn.init.call(f,b,d),f.options=g({},f.options,d),b=a(b),b.closest("form").bind("submit",function(){f.update()});for(var p in f._tools)f._tools[p].name=p.toLowerCase();f.textarea=b.attr("autocomplete","off")[0],i=f.wrapper=m(b),n(f,f.options.tools),o(f),f.keyboard=new k.Keyboard([new k.TypingHandler(f),new k.SystemHandler(f)]),f.clipboard=new k.Clipboard(this),f.pendingFormats=new k.PendingFormats(this),f.undoRedoStack=new k.UndoRedoStack,d&&d.value?j=d.value:j=b.val().replace(/[\r\n\v\f\t ]+/ig," "),f.value(j);var u=".k-editor-toolbar > li > *, .k-editor-toolbar > li select",v=".k-editor-button .k-tool-icon",w=v+":not(.k-state-disabled)",x=v+".k-state-disabled";i.find(".k-combobox .k-input").keydown(function(b){var c=a(this).closest(".k-combobox").data("kendoComboBox"),d=b.keyCode;d==h.RIGHT||d==h.LEFT?c.close():d==h.DOWN&&(c.dropDown.isOpened()||(b.stopImmediatePropagation(),c.open()))}),i.delegate(w,"mouseenter",function(){a(this).addClass("k-state-hover")}).delegate(w,"mouseleave",function(){a(this).removeClass("k-state-hover")}).delegate(v,"mousedown",!1).delegate(l,"keydown",function(b){var c=a(this).closest("li"),d="li:has("+l+")",e,g=b.keyCode;if(g==h.RIGHT)e=c.nextAll(d).first().find(l);else if(g==h.LEFT)e=c.prevAll(d).last().find(l);else if(g==h.ESC)e=f;else if(g==h.TAB&&!b.ctrlKey&&!b.altKey)if(b.shiftKey){e=c.prevAll(d).last().find(l);if(e.length)b.preventDefault();else return}else b.preventDefault(),e=c.nextAll(d).first().find(l),e.length||(e=f);e&&e.focus()}).delegate(w,"click",function(a){a.preventDefault(),a.stopPropagation(),f.exec(s(this))}).delegate(x,"click",function(a){a.preventDefault()}).find(u).each(function(){var b=s(this),c=f.options,d=c.tools[b],e=c.localization[b],g=a(this);if(!!d){if(b=="fontSize"||b=="fontName"){var h=c.localization[b+"Inherit"]||q[b+"Inherit"];c[b][0].Text=h,g.find("input").val(h).end().find("span.k-input").text(h).end()}d.initialize(g,{title:t(e,d),editor:f})}}),f.bind("select",function(){var b=f.getRange(),c=k.RangeUtils.textNodes(b);c.length||(c=[b.startContainer]),i.find(u).each(function(){var b=f.options.tools[s(this)];b&&b.update(a(this),c,f.pendingFormats)})}),a(document).bind("DOMNodeInserted",function(b){var c=f.wrapper;if(a.contains(b.target,c[0])||c[0]==b.target)f.textarea.value=f.value(),c.find("iframe").remove(),o(f)}).bind("mousedown",function(a){try{f.keyboard.isTypingInProgress()&&f.keyboard.endTyping(!0),f.selectionRestorePoint||(f.selectionRestorePoint=new k.RestorePoint(f.getRange()))}catch(a){}}),c.notify(f)}},events:["select","change","execute","error","paste"],options:{name:"Editor",localization:q,formats:{},encoded:!0,stylesheets:[],dialogOptions:{modal:!0,resizable:!1,draggable:!0,animation:!1},fontName:[{Text:q.fontNameInherit,Value:"inherit"},{Text:"Arial",Value:"Arial,Helvetica,sans-serif"},{Text:"Courier New",Value:"'Courier New',Courier,monospace"},{Text:"Georgia",Value:"Georgia,serif"},{Text:"Impact",Value:"Impact,Charcoal,sans-serif"},{Text:"Lucida Console",Value:"'Lucida Console',Monaco,monospace"},{Text:"Tahoma",Value:"Tahoma,Geneva,sans-serif"},{Text:"Times New Roman",Value:"'Times New Roman',Times,serif"},{Text:"Trebuchet MS",Value:"'Trebuchet MS',Helvetica,sans-serif"},{Text:"Verdana",Value:"Verdana,Geneva,sans-serif"}],fontSize:[{Text:q.fontSizeInherit,Value:"inherit"},{Text:"1 (8pt)",Value:"xx-small"},{Text:"2 (10pt)",Value:"x-small"},{Text:"3 (12pt)",Value:"small"},{Text:"4 (14pt)",Value:"medium"},{Text:"5 (18pt)",Value:"large"},{Text:"6 (24pt)",Value:"x-large"},{Text:"7 (36pt)",Value:"xx-large"}],formatBlock:[{Text:"Paragraph",Value:"p"},{Text:"Quotation",Value:"blockquote"},{Text:"Heading 1",Value:"h1"},{Text:"Heading 2",Value:"h2"},{Text:"Heading 3",Value:"h3"},{Text:"Heading 4",Value:"h4"},{Text:"Heading 5",Value:"h5"},{Text:"Heading 6",Value:"h6"}],tools:["bold","italic","underline","strikethrough","fontName","fontSize","foreColor","backColor","justifyLeft","justifyCenter","justifyRight","justifyFull","insertUnorderedList","insertOrderedList","indent","outdent","formatBlock","createLink","unlink","insertImage"]},_nativeTools:["insertLineBreak","insertParagraph","redo","undo"],_tools:{undo:{options:{key:"Z",ctrl:!0}},redo:{options:{key:"Y",ctrl:!0}}},value:function(d){var e=this.body,f=c.ui.editor.Dom;if(d===b)return c.ui.editor.Serializer.domToXhtml(e);this.pendingFormats.clear(),d=(d||"").replace(/<!\[CDATA\[(.*)?\]\]>/g,"<!--[CDATA[$1]]-->").replace(/<script([^>]*)>(.*)?<\/script>/ig,"<telerik:script $1>$2</telerik:script>").replace(/(<\/?img[^>]*>)[\r\n\v\f\t ]+/ig,"$1"),a.browser.msie||(d=d.replace(/<p([^>]*)>(\s*)?<\/p>/ig,'<p $1><br _moz_dirty="" /></p>'));if(a.browser.msie&&parseInt(a.browser.version,10)<9){d="<br/>"+d;var g="originalsrc",h="originalhref";d=d.replace(/href\s*=\s*(?:'|")?([^'">\s]*)(?:'|")?/,h+'="$1"'),d=d.replace(/src\s*=\s*(?:'|")?([^'">\s]*)(?:'|")?/,g+'="$1"'),e.innerHTML=d,f.remove(e.firstChild),a(e).find("telerik\\:script,script,link,img,a").each(function(){var a=this;a[h]&&(a.setAttribute("href",a[h]),a.removeAttribute(h)),a[g]&&(a.setAttribute("src",a[g]),a.removeAttribute(g))})}else e.innerHTML=d,a.browser.msie&&f.normalize(e);this.selectionRestorePoint=null,this.update()},focus:function(){this.window.focus()},update:function(a){this.textarea.value=a||this.options.encoded?this.encodedValue():this.value()},encodedValue:function(){return c.ui.editor.Dom.encode(this.value())},createRange:function(a){return c.ui.editor.RangeUtils.createRange(a||this.document)},getSelection:function(){return c.ui.editor.SelectionUtils.selectionFromDocument(this.document)},selectRange:function(a){this.focus();var b=this.getSelection();b.removeAllRanges(),b.addRange(a)},getRange:function(){var a=this.getSelection(),b=a.rangeCount>0?a.getRangeAt(0):this.createRange(),c=this.document;b.startContainer==c&&b.endContainer==c&&!b.startOffset&&!b.endOffset&&(b.setStart(this.body,0),b.collapse(!0));return b},selectedHtml:function(){return c.ui.editor.Serializer.domToXhtml(this.getRange().cloneContents())},paste:function(a){this.clipboard.paste(a)},exec:function(b,c){var d=this,e,g,h,i="",j;b=b.toLowerCase(),d.keyboard.isTypingInProgress()||(d.focus(),e=d.getRange(),g=d.document.body);for(h in d.options.tools)if(h.toLowerCase()==b){i=d.options.tools[h];break}if(i){e=d.getRange();if(!/undo|redo/i.test(b)&&i.willDelayExecution(e)){j=a.extend({},i),a.extend(j.options,{params:c}),d.pendingFormats.toggle(j),k(d);return}var l=i.command?i.command(f({range:e},c)):null;d.trigger("execute",{name:b,command:l});if(/undo|redo/i.test(b))d.undoRedoStack[b]();else if(l){l.managesUndoRedo||d.undoRedoStack.push(l),l.editor=d,l.exec();if(l.async){l.change=a.proxy(function(){k(d)},d);return}}k(d)}}});c.ui.plugin(s);var t=d.extend({init:function(a){this.options=a},initialize:function(a,b){a.attr({unselectable:"on",title:b.title})},command:function(a){return new this.options.command(a)},update:function(){},willDelayExecution:function(){return!1}});t.exec=function(a,b,c){a.exec(b,{value:c})};var u=t.extend({init:function(a){t.fn.init.call(this,a)},command:function(a){var b=this;return new c.ui.editor.FormatCommand(f(a,{formatter:b.options.formatter}))},update:function(a,b,c){var d=c.isPending(this.name),e=this.options.finder.isFormatted(b),f=d?!e:e;a.toggleClass("k-state-active",f)}});f(c.ui,{editor:{ToolTemplate:i,EditorUtils:j,Tool:t,FormatTool:u}})}(jQuery),function(a){function k(a){var b={},c,d;for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var b=window.kendo,c=a.map,d=a.extend,e="style",f="float",g="cssFloat",h="styleFloat",i="class",j="k-marker",l=k("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed".split(",")),m="div,p,h1,h2,h3,h4,h5,h6,address,applet,blockquote,button,center,dd,dir,dl,dt,fieldset,form,frameset,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,pre,script,table,tbody,td,tfoot,th,thead,tr,ul".split(","),n=k(m),o="span,em,a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,strike,strong,sub,sup,textarea,tt,u,var".split(","),p=k(o),q=k("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected".split(",")),r=function(a){a.nodeType==1&&a.normalize()};a.browser.msie&&parseInt(a.browser.version,10)>=8&&(r=function(a){if(a.nodeType==1&&a.firstChild){var b=a.firstChild,c=b;for(;;){c=c.nextSibling;if(!c)break;c.nodeType==3&&b.nodeType==3&&(c.nodeValue=b.nodeValue+c.nodeValue,A.remove(b)),b=c}}});var s=/^\s+$/,t=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,u=/&/g,v=/</g,w=/>/g,x=/\u00a0/g,y=/\ufeff/g,z="color,padding-left,padding-right,padding-top,padding-bottom,background-color,background-attachment,background-image,background-position,background-repeat,border-top-style,border-top-width,border-top-color,border-bottom-style,border-bottom-width,border-bottom-color,border-left-style,border-left-width,border-left-color,border-right-style,border-right-width,border-right-color,font-family,font-size,font-style,font-variant,font-weight,line-height".split(","),A={findNodeIndex:function(a){var b=0;for(;;){a=a.previousSibling;if(!a)break;b++}return b},isDataNode:function(a){return a&&a.nodeValue!==null&&a.data!==null},isAncestorOf:function(b,c){try{return!A.isDataNode(b)&&(a.contains(b,A.isDataNode(c)?c.parentNode:c)||c.parentNode==b)}catch(d){return!1}},isAncestorOrSelf:function(a,b){return A.isAncestorOf(a,b)||a==b},findClosestAncestor:function(a,b){if(A.isAncestorOf(a,b))while(b&&b.parentNode!=a)b=b.parentNode;return b},getNodeLength:function(a){return A.isDataNode(a)?a.length:a.childNodes.length},splitDataNode:function(a,b){var c=a.cloneNode(!1);a.deleteData(b,a.length),c.deleteData(0,b),A.insertAfter(c,a)},attrEquals:function(b,c){for(var d in c){var e=b[d];d==f&&(e=b[a.support.cssFloat?g:h]);if(typeof e=="object"){if(!A.attrEquals(e,c[d]))return!1}else if(e!=c[d])return!1}return!0},blockParentOrBody:function(a){return A.parentOfType(a,m)||a.ownerDocument.body},blockParents:function(b){var c=[],d,e;for(d=0,e=b.length;d<e;d++){var f=A.parentOfType(b[d],A.blockElements);f&&a.inArray(f,c)<0&&c.push(f)}return c},windowFromDocument:function(a){return a.defaultView||a.parentWindow},normalize:r,blockElements:m,inlineElements:o,empty:l,fillAttrs:q,toHex:function(a){var b=t.exec(a);if(!b)return a;return"#"+c(b.slice(1),function(a){a=parseInt(a,10).toString(16);return a.length>1?a:"0"+a}).join("")},encode:function(a){return a.replace(u,"&amp;").replace(v,"&lt;").replace(w,"&gt;").replace(x,"&nbsp;")},name:function(a){return a.nodeName.toLowerCase()},significantChildNodes:function(b){return a.grep(b.childNodes,function(a){return a.nodeType!=3||!A.isWhitespace(a)})},lastTextNode:function(a){var b=null;if(a.nodeType==3)return a;for(var c=a.lastChild;c;c=c.previousSibling){b=A.lastTextNode(c);if(b)return b}return b},is:function(a,b){return A.name(a)==b},isMarker:function(a){return a.className==j},isWhitespace:function(a){return s.test(a.nodeValue)},isBlock:function(a){return n[A.name(a)]},isEmpty:function(a){return l[A.name(a)]},isInline:function(a){return p[A.name(a)]},scrollTo:function(b){b.ownerDocument.body.scrollTop=a(A.isDataNode(b)?b.parentNode:b).offset().top},insertAt:function(a,b,c){a.insertBefore(b,a.childNodes[c]||null)},insertBefore:function(a,b){return b.parentNode?b.parentNode.insertBefore(a,b):b},insertAfter:function(a,b){return b.parentNode.insertBefore(a,b.nextSibling)},remove:function(a){a.parentNode.removeChild(a)},trim:function(a){for(var b=a.childNodes.length-1;b>=0;b--){var c=a.childNodes[b];A.isDataNode(c)?(c.nodeValue.replace(y,"").length||A.remove(c),A.isWhitespace(c)&&A.insertBefore(c,a)):c.className!=j&&(A.trim(c),!c.childNodes.length&&!A.isEmpty(c)&&A.remove(c))}return a},parentOfType:function(a,b){do a=a.parentNode;while(a&&!A.ofType(a,b));return a},ofType:function(b,c){return a.inArray(A.name(b),c)>=0},changeTag:function(a,b){var c=A.create(a.ownerDocument,b),d=a.attributes,f,g,h,j,k;for(f=0,g=d.length;f<g;f++)k=d[f],k.specified&&(h=k.nodeName,j=k.nodeValue,h==i?c.className=j:h==e?c.style.cssText=a.style.cssText:c.setAttribute(h,j));while(a.firstChild)c.appendChild(a.firstChild);A.insertBefore(c,a),A.remove(a);return c},wrap:function(a,b){A.insertBefore(b,a),b.appendChild(a);return b},unwrap:function(a){var b=a.parentNode;while(a.firstChild)b.insertBefore(a.firstChild,a);b.removeChild(a)},create:function(a,b,c){return A.attr(a.createElement(b),c)},attr:function(a,b){b=d({},b),b&&e in b&&(A.style(a,b.style),delete b.style);return d(a,b)},style:function(b,c){a(b).css(c||{})},unstyle:function(b,c){for(var d in c)d==f&&(d=a.support.cssFloat?g:h),b.style[d]="";b.style.cssText===""&&b.removeAttribute(e)},inlineStyle:function(b,d,e){var f=a(A.create(b,d,e)),g;b.body.appendChild(f[0]),g=c(z,function(b){return a.browser.msie&&b=="line-height"&&f.css(b)=="1px"?"line-height:1.5":b+":"+f.css(b)}).join(";"),f.remove();return g},removeClass:function(b,c){var d=" "+b.className+" ",e=c.split(" "),f,g;for(f=0,g=e.length;f<g;f++)d=d.replace(" "+e[f]+" "," ");d=a.trim(d),d.length?b.className=d:b.removeAttribute(i)},commonAncestor:function(){var a=arguments.length,b=[],c=Infinity,d=null,e,f,g,h,i;if(!a)return null;if(a==1)return arguments[0];for(e=0;e<a;e++){f=[],g=arguments[e];while(g)f.push(g),g=g.parentNode;b.push(f.reverse()),c=Math.min(c,f.length)}if(a==1)return b[0][0];for(e=0;e<c;e++){h=b[0][e];for(i=1;i<a;i++)if(h!=b[i][e])return d;d=h}return d}};b.ui.editor.Dom=A}(jQuery),function(a,b){var c=window.kendo,d=c.ui.editor,e=d.Dom,f=a.extend,g="xx-small,x-small,small,medium,large,x-large,xx-large".split(","),h=/"/g,i=/<br[^>]*>/i,j=/<p><\/p>/i,k={domToXhtml:function(c){function m(b,c){var g=b.nodeType,h,i,j,m,n;if(g==1){h=e.name(b);if(!h||b.attributes._moz_dirty&&e.is(b,"br"))return;i=f[h];if(i){i.start(b),l(b),i.end(b);return}d.push("<"),d.push(h),k(b),e.empty[h]?d.push(" />"):(d.push(">"),l(b,c||e.is(b,"pre")),d.push("</"),d.push(h),d.push(">"))}else if(g==3){m=b.nodeValue;if(!c&&a.support.leadingWhitespace){j=b.parentNode,n=b.previousSibling,n||(n=(e.isInline(j)?j:b).previousSibling);if(!n||n.innerHTML===""||e.isBlock(n))m=m.replace(/^[\r\n\v\f\t ]+/,"");m=m.replace(/ +/," ")}d.push(e.encode(m))}else g==4?(d.push("<![CDATA["),d.push(b.data),d.push("]]>")):g==8&&(b.data.indexOf("[CDATA[")<0?(d.push("<!--"),d.push(b.data),d.push("-->")):(d.push("<!"),d.push(b.data),d.push(">")))}function l(a,b){for(var c=a.firstChild;c;c=c.nextSibling)m(c,b)}function k(c){var f=[],g=c.attributes,i,j,k,l=a.trim;if(e.is(c,"img")){var m=c.style.width,n=c.style.height,o=a(c);m&&(o.attr("width",parseInt(m,10)),e.unstyle(c,{width:b})),n&&(o.attr("height",parseInt(n,10)),e.unstyle(c,{height:b}))}for(j=0,k=g.length;j<k;j++){i=g[j];var p=i.nodeName;(i.specified||p=="value"&&!c.value||p=="type"&&i.nodeValue=="text")&&p.indexOf("_moz")<0&&p!="complete"&&f.push(i)}if(!!f.length){f.sort(function(a,b){return a.nodeName>b.nodeName?1:a.nodeName<b.nodeName?-1:0});for(j=0,k=f.length;j<k;j++){i=f[j];var q=i.nodeName,r=i.nodeValue;d.push(" "),d.push(q),d.push('="');if(q=="style"){var s=l(r||c.style.cssText).split(";");for(var t=0,u=s.length;t<u;t++){var v=s[t];if(v.length){var w=v.split(":"),x=l(w[0].toLowerCase()),y=l(w[1]);if(x=="font-size-adjust"||x=="font-stretch")continue;x.indexOf("color")>=0&&(y=e.toHex(y)),x.indexOf("font")>=0&&(y=y.replace(h,"'")),d.push(x),d.push(":"),d.push(y),d.push(";")}}}else q=="src"||q=="href"?d.push(c.getAttribute(q,2)):d.push(e.fillAttrs[q]?q:r);d.push('"')}}}var d=[],f={"telerik:script":{start:function(a){d.push("<script"),k(a),d.push(">")},end:function(){d.push("</script>")}},b:{start:function(){d.push("<strong>")},end:function(){d.push("</strong>")}},i:{start:function(){d.push("<em>")},end:function(){d.push("</em>")}},u:{start:function(){d.push('<span style="text-decoration:underline;">')},end:function(){d.push("</span>")}},font:{start:function(a){d.push('<span style="');var b=a.getAttribute("color"),c=g[a.getAttribute("size")],f=a.getAttribute("face");b&&(d.push("color:"),d.push(e.toHex(b)),d.push(";")),f&&(d.push("font-face:"),d.push(f),d.push(";")),c&&(d.push("font-size:"),d.push(c),d.push(";")),d.push('">')},end:function(a){d.push("</span>")}}};l(c),d=d.join("");if(d.replace(i,"").replace(j,"")==="")return"";return d}};f(d,{Serializer:k})}(jQuery),function(a){function t(a,b,c){var d=f.create(b.ownerDocument,"a"),e=a.duplicate();e.collapse(c);var g=e.parentElement();do g.insertBefore(d,d.previousSibling),e.moveToElementText(d);while(e.compareEndPoints(c?"StartToStart":"StartToEnd",a)>0&&d.previousSibling);e.setEndPoint(c?"EndToStart":"EndToEnd",a);var i=d.nextSibling;i?(f.remove(d),h(i)?b[c?"setStart":"setEnd"](i,e.text.length):b[c?"setStartBefore":"setEndBefore"](i)):(i=d.previousSibling,i&&h(i)?(b.setEnd(i,i.nodeValue.length),f.remove(d)):(b.selectNodeContents(g),f.remove(d),b.endOffset-=1))}function s(a,b,c){var d=b[c?"startContainer":"endContainer"],e=b[c?"startOffset":"endOffset"],g=0,i=h(d)?d:d.childNodes[e]||null,j=h(d)?d.parentNode:d;if(d.nodeType==3||d.nodeType==4)g=e;var k=j.insertBefore(f.create(b.ownerDocument,"a"),i),l=b.ownerDocument.body.createTextRange();l.moveToElementText(k),f.remove(k),l[c?"moveStart":"moveEnd"]("character",g),l.collapse(!1),a.setEndPoint(c?"StartToStart":"EndToStart",l)}function p(a){a.collapsed=a.startContainer==a.endContainer&&a.startOffset==a.endOffset;var b=a.startContainer;while(b&&b!=a.endContainer&&!f.isAncestorOf(b,a.endContainer))b=b.parentNode;a.commonAncestorContainer=b}function o(a,b){function c(a){try{return n(a.startContainer,a.endContainer,a.startOffset,a.endOffset)<0}catch(b){return!0}}c(a)&&(b?(a.commonAncestorContainer=a.endContainer=a.startContainer,a.endOffset=a.startOffset):(a.commonAncestorContainer=a.startContainer=a.endContainer,a.startOffset=a.endOffset),a.collapsed=!0)}function n(a,b,c,d){if(a==b)return d-c;var e=b;while(e&&e.parentNode!=a)e=e.parentNode;if(e)return g(e)-c;e=a;while(e&&e.parentNode!=b)e=e.parentNode;if(e)return d-g(e)-1;var h=f.commonAncestor(a,b),i=a;while(i&&i.parentNode!=h)i=i.parentNode;i||(i=h);var j=b;while(j&&j.parentNode!=h)j=j.parentNode;j||(j=h);if(i==j)return 0;return g(j)-g(i)}var b=window.kendo,c=b.Class,d=a.extend,e=b.ui.editor,f=e.Dom,g=f.findNodeIndex,h=f.isDataNode,i=f.findClosestAncestor,j=f.getNodeLength,k=f.normalize,l={selectionFromWindow:function(b){if(a.browser.msie&&a.browser.version<9)return new r(b.document);return b.getSelection()},selectionFromRange:function(a){var b=y.documentFromRange(a);return l.selectionFromDocument(b)},selectionFromDocument:function(a){return l.selectionFromWindow(f.windowFromDocument(a))}},m=c.extend({init:function(b){a.extend(this,{ownerDocument:b,startContainer:b,endContainer:b,commonAncestorContainer:b,startOffset:0,endOffset:0,collapsed:!0})},setStart:function(a,b){this.startContainer=a,this.startOffset=b,p(this),o(this,!0)},setEnd:function(a,b){this.endContainer=a,this.endOffset=b,p(this),o(this,!1)},setStartBefore:function(a){this.setStart(a.parentNode,g(a))},setStartAfter:function(a){this.setStart(a.parentNode,g(a)+1)},setEndBefore:function(a){this.setEnd(a.parentNode,g(a))},setEndAfter:function(a){this.setEnd(a.parentNode,g(a)+1)},selectNode:function(a){this.setStartBefore(a),this.setEndAfter(a)},selectNodeContents:function(a){this.setStart(a,0),this.setEnd(a,a[a.nodeType===1?"childNodes":"nodeValue"].length)},collapse:function(a){var b=this;a?b.setEnd(b.startContainer,b.startOffset):b.setStart(b.endContainer,b.endOffset)},deleteContents:function(){var a=this,b=a.cloneRange();a.startContainer!=a.commonAncestorContainer&&a.setStartAfter(i(a.commonAncestorContainer,a.startContainer)),a.collapse(!0),function c(a){while(a.next())a.hasPartialSubtree()?c(a.getSubtreeIterator()):a.remove()}(new q(b))},cloneContents:function(){var a=y.documentFromRange(this);return function b(c){var d,e=a.createDocumentFragment();while(d=c.next())d=d.cloneNode(!c.hasPartialSubtree()),c.hasPartialSubtree()&&d.appendChild(b(c.getSubtreeIterator())),e.appendChild(d);return e}(new q(this))},extractContents:function(){var a=this,b=a.cloneRange();a.startContainer!=a.commonAncestorContainer&&a.setStartAfter(i(a.commonAncestorContainer,a.startContainer)),a.collapse(!0);var c=y.documentFromRange(a);return function d(b){var e,f=c.createDocumentFragment();while(e=b.next())b.hasPartialSubtree()?(e=e.cloneNode(!1),e.appendChild(d(b.getSubtreeIterator()))):b.remove(a.originalRange),f.appendChild(e);return f}(new q(b))},insertNode:function(a){var b=this;h(b.startContainer)?(b.startOffset!=b.startContainer.nodeValue.length&&f.splitDataNode(b.startContainer,b.startOffset),f.insertAfter(a,b.startContainer)):f.insertAt(b.startContainer,a,b.startOffset),b.setStart(b.startContainer,b.startOffset)},cloneRange:function(){return a.extend(new m(this.ownerDocument),{startContainer:this.startContainer,endContainer:this.endContainer,commonAncestorContainer:this.commonAncestorContainer,startOffset:this.startOffset,endOffset:this.endOffset,collapsed:this.collapsed,originalRange:this})},toString:function(){var a=this.startContainer.nodeName,b=this.endContainer.nodeName;return[a=="#text"?this.startContainer.nodeValue:a,"(",this.startOffset,") : ",b=="#text"?this.endContainer.nodeValue:b,"(",this.endOffset,")"].join("")}}),q=c.extend({init:function(b){a.extend(this,{range:b,_current:null,_next:null,_end:null});if(!b.collapsed){var c=b.commonAncestorContainer;this._next=b.startContainer==c&&!h(b.startContainer)?b.startContainer.childNodes[b.startOffset]:i(c,b.startContainer),this._end=b.endContainer==c&&!h(b.endContainer)?b.endContainer.childNodes[b.endOffset]:i(c,b.endContainer).nextSibling}},hasNext:function(){return!!this._next},next:function(){var a=this,b=a._current=a._next;a._next=a._current&&a._current.nextSibling!=a._end?a._current.nextSibling:null,h(a._current)&&(a.range.endContainer==a._current&&(b=b.cloneNode(!0),b.deleteData(a.range.endOffset,b.length-a.range.endOffset)),a.range.startContainer==a._current&&(b=b.cloneNode(!0),b.deleteData(0,a.range.startOffset)));return b},traverse:function(a){function d(){b._current=b._next,b._next=b._current&&b._current.nextSibling!=b._end?b._current.nextSibling:null;return b._current}var b=this,c;while(c=d())b.hasPartialSubtree()?b.getSubtreeIterator().traverse(a):a(c);return c},remove:function(a){var b=this,c=b.range.startContainer==b._current,d=b.range.endContainer==b._current,e,i,j;if(h(b._current)&&(c||d))e=c?b.range.startOffset:0,i=d?b.range.endOffset:b._current.length,j=i-e,a&&(c||d)&&(b._current==a.startContainer&&e<=a.startOffset&&(a.startOffset-=j),b._current==a.endContainer&&i<=a.endOffset&&(a.endOffset-=j)),b._current.deleteData(e,j);else{var k=b._current.parentNode;if(a&&(b.range.startContainer==k||b.range.endContainer==k)){var l=g(b._current);k==a.startContainer&&l<=a.startOffset&&(a.startOffset-=1),k==a.endContainer&&l<a.endOffset&&(a.endOffset-=1)}f.remove(b._current)}},hasPartialSubtree:function(){return!h(this._current)&&(f.isAncestorOrSelf(this._current,this.range.startContainer)||f.isAncestorOrSelf(this._current,this.range.endContainer))},getSubtreeIterator:function(){var a=this,b=a.range.cloneRange();b.selectNodeContents(a._current),f.isAncestorOrSelf(a._current,a.range.startContainer)&&b.setStart(a.range.startContainer,a.range.startOffset),f.isAncestorOrSelf(a._current,a.range.endContainer)&&b.setEnd(a.range.endContainer,a.range.endOffset);return new q(b)}}),r=c.extend({init:function(a){this.ownerDocument=a,this.rangeCount=1},addRange:function(a){var b=this.ownerDocument.body.createTextRange();s(b,a,!1),s(b,a,!0),b.select()},removeAllRanges:function(){this.ownerDocument.selection.empty()},getRangeAt:function(){var a,b=new m(this.ownerDocument),c=this.ownerDocument.selection,d;try{a=c.createRange(),d=a.item?a.item(0):a.parentElement();if(d.ownerDocument!=this.ownerDocument)return b}catch(e){return b}if(c.type=="Control")b.selectNode(a.item(0));else{t(a,b,!0),t(a,b,!1),b.startContainer.nodeType==9&&b.setStart(b.endContainer,b.startOffset),b.endContainer.nodeType==9&&b.setEnd(b.startContainer,b.endOffset),a.compareEndPoints("StartToEnd",a)===0&&b.collapse(!1);var f=b.startContainer,i=b.endContainer,k=this.ownerDocument.body;if(!b.collapsed&&b.startOffset===0&&b.endOffset==j(b.endContainer)&&(f!=i||!h(f)||f.parentNode!=k)){var l=!1,n=!1;while(g(f)===0&&f==f.parentNode.firstChild&&f!=k)f=f.parentNode,l=!0;while(g(i)==j(i.parentNode)-1&&i==i.parentNode.lastChild&&i!=k)i=i.parentNode,n=!0;f==k&&i==k&&l&&n&&(b.setStart(f,0),b.setEnd(i,j(k)))}}return b}}),u=c.extend({init:function(a){this.enumerate=function(){function c(a){if(f.is(a,"img")||a.nodeType==3&&!f.isWhitespace(a))b.push(a);else{a=a.firstChild;while(a)c(a),a=a.nextSibling}}var b=[];(new q(a)).traverse(c);return b}}}),v=c.extend({init:function(a){var b=this;b.range=a,b.rootNode=y.documentFromRange(a),b.body=b.rootNode.body,b.html=b.body.innerHTML,b.startContainer=b.nodeToPath(a.startContainer),b.endContainer=b.nodeToPath(a.endContainer),b.startOffset=b.offset(a.startContainer,a.startOffset),b.endOffset=b.offset(a.endContainer,a.endOffset)},index:function(a){var b=0,c=a.nodeType;while(a=a.previousSibling){var d=a.nodeType;(d!=3||c!=d)&&b++,c=d}return b},offset:function(a,b){if(a.nodeType==3)while((a=a.previousSibling)&&a.nodeType==3)b+=a.nodeValue.length;return b},nodeToPath:function(a){var b=[];while(a!=this.rootNode)b.push(this.index(a)),a=a.parentNode;return b},toRangePoint:function(a,b,c,d){var e=this.rootNode,f=c.length,g=d;while(f--)e=e.childNodes[c[f]];while(e.nodeType==3&&e.nodeValue.length<g)g-=e.nodeValue.length,e=e.nextSibling;a[b?"setStart":"setEnd"](e,g)},toRange:function(){var a=this,b=a.range.cloneRange();a.toRangePoint(b,!0,a.startContainer,a.startOffset),a.toRangePoint(b,!1,a.endContainer,a.endOffset);return b}}),w=c.extend({init:function(){this.caret=null},addCaret:function(a){var b=this;b.caret=f.create(y.documentFromRange(a),"span",{className:"k-marker"}),a.insertNode(b.caret),a.selectNode(b.caret);return b.caret},removeCaret:function(b){var c=this,d=c.caret.previousSibling,e=0;d&&(e=h(d)?d.nodeValue.length:g(d));var i=c.caret.parentNode,j=d?g(d):0;f.remove(c.caret),k(i);var l=i.childNodes[j];if(h(l))b.setStart(l,e);else if(l){var m=f.lastTextNode(l);m?b.setStart(m,m.nodeValue.length):b[d?"setStartAfter":"setStartBefore"](l)}else!a.browser.msie&&!i.innerHTML&&(i.innerHTML='<br _moz_dirty="" />'),b.selectNodeContents(i);b.collapse(!0)},add:function(a,b){var c=this;b&&a.collapsed&&(c.addCaret(a),a=y.expand(a));var d=a.cloneRange();d.collapse(!1),c.end=f.create(y.documentFromRange(a),"span",{className:"k-marker"}),d.insertNode(c.end),d=a.cloneRange(),d.collapse(!0),c.start=c.end.cloneNode(!0),d.insertNode(c.start),a.setStartBefore(c.start),a.setEndAfter(c.end),k(a.commonAncestorContainer);return a},remove:function(a){var b=this,c=b.start,d=b.end,e,i,j;k(a.commonAncestorContainer);while(!c.nextSibling&&c.parentNode)c=c.parentNode;while(!d.previousSibling&&d.parentNode)d=d.parentNode;e=c.previousSibling&&c.previousSibling.nodeType==3&&c.nextSibling&&c.nextSibling.nodeType==3,i=d.previousSibling&&d.previousSibling.nodeType==3&&d.nextSibling&&d.nextSibling.nodeType==3,j=e&&i,c=c.nextSibling,d=d.previousSibling;var l=!1,m=!1;c==b.end&&(m=!!b.start.previousSibling,c=d=b.start.previousSibling||b.end.nextSibling,l=!0),f.remove(b.start),f.remove(b.end);if(!c||!d)a.selectNodeContents(a.commonAncestorContainer),a.collapse(!0);else{var n=l?h(c)?c.nodeValue.length:c.childNodes.length:0,o=h(d)?d.nodeValue.length:d.childNodes.length;if(c.nodeType==3)while(c.previousSibling&&c.previousSibling.nodeType==3)c=c.previousSibling,n+=c.nodeValue.length;if(d.nodeType==3)while(d.previousSibling&&d.previousSibling.nodeType==3)d=d.previousSibling,o+=d.nodeValue.length;var p=g(c),q=c.parentNode,r=g(d),s=d.parentNode;for(var t=c;t.previousSibling;t=t.previousSibling)t.nodeType==3&&t.previousSibling.nodeType==3&&p--;for(var u=d;u.previousSibling;u=u.previousSibling)u.nodeType==3&&u.previousSibling.nodeType==3&&r--;k(q),c.nodeType==3&&(c=q.childNodes[p]),k(s),d.nodeType==3&&(d=s.childNodes[r]),l?(c.nodeType==3?a.setStart(c,n):a[m?"setStartAfter":"setStartBefore"](c),a.collapse(!0)):(c.nodeType==3?a.setStart(c,n):a.setStartBefore(c),d.nodeType==3?a.setEnd(d,o):a.setEndAfter(d)),b.caret&&b.removeCaret(a)}}}),x=/[\u0009-\u000d]|\u0020|\u00a0|\ufeff|\.|,|;|:|!|\(|\)|\?/,y={nodes:function(a){var b=y.textNodes(a);b.length||(a.selectNodeContents(a.commonAncestorContainer),b=y.textNodes(a),b.length||(b=f.significantChildNodes(a.commonAncestorContainer)));return b},textNodes:function(a){return(new u(a)).enumerate()},documentFromRange:function(a){var b=a.startContainer;return b.nodeType==9?b:b.ownerDocument},createRange:function(b){if(a.browser.msie&&a.browser.version<9)return new m(b);return b.createRange()},selectRange:function(a){var b=y.image(a);b&&(a.setStartAfter(b),a.setEndAfter(b));var c=l.selectionFromRange(a);c.removeAllRanges(),c.addRange(a)},split:function(a,b,c){function d(d){var e=a.cloneRange();e.collapse(d),e[d?"setStartBefore":"setEndAfter"](b);var g=e.extractContents();c&&(g=f.trim(g)),f[d?"insertBefore":"insertAfter"](g,b)}d(!0),d(!1)},getMarkers:function(a){var b=[];(new q(a)).traverse(function(a){a.className=="k-marker"&&b.push(a)});return b},image:function(a){var b=[];(new q(a)).traverse(function(a){f.is(a,"img")&&b.push(a)});if(b.length==1)return b[0]},expand:function(a){var b=a.cloneRange(),c=b.startContainer.childNodes[b.startOffset===0?0:b.startOffset-1],d=b.endContainer.childNodes[b.endOffset];if(!h(c)||!h(d))return b;var e=c.nodeValue,f=d.nodeValue;if(!e||!f)return b;var g=e.split("").reverse().join("").search(x),i=f.search(x);if(!g||!i)return b;i=i==-1?f.length:i,g=g==-1?0:e.length-g,b.setStart(c,g),b.setEnd(d,i);return b},isExpandable:function(a){var b=a.startContainer,c=y.documentFromRange(a);if(b==c||b==c.body)return!1;var d=a.cloneRange(),e=b.nodeValue;if(!e)return!1;var f=e.substring(0,d.startOffset),g=e.substring(d.startOffset),h=0,i=0;f&&(h=f.split("").reverse().join("").search(x)),g&&(i=g.search(x));return h&&i}};d(e,{SelectionUtils:l,W3CRange:m,RangeIterator:q,W3CSelection:r,RangeEnumerator:u,RestorePoint:v,Marker:w,RangeUtils:y})}(jQuery),function(a){var b=window.kendo,c=b.Class,d=b.ui.editor,e=d.EditorUtils,f=e.registerTool,g=d.Dom,h=d.RangeUtils,i=h.selectRange,j=d.Tool,k=d.ToolTemplate,l=d.RestorePoint,m=d.Marker,n=a.extend,o=c.extend({init:function(a){var b=this;b.options=a,b.restorePoint=new l(a.range),b.marker=new m,b.formatter=a.formatter},getRange:function(){return this.restorePoint.toRange()},lockRange:function(a){return this.marker.add(this.getRange(),a)},releaseRange:function(a){this.marker.remove(a),i(a)},undo:function(){var a=this.restorePoint;a.body.innerHTML=a.html,i(a.toRange())},redo:function(){this.exec()},exec:function(){var a=this,b=a.lockRange(!0);a.formatter.editor=a.editor,a.formatter.toggle(b),a.releaseRange(b)}}),p=c.extend({init:function(a,b){this.body=a.body,this.startRestorePoint=a,this.endRestorePoint=b},redo:function(){this.body.innerHTML=this.endRestorePoint.html,i(this.endRestorePoint.toRange())},undo:function(){this.body.innerHTML=this.startRestorePoint.html,i(this.startRestorePoint.toRange())}}),q=o.extend({init:function(a){o.fn.init.call(this,a),this.managesUndoRedo=!0},exec:function(){var a=this.editor,b=a.getRange(),c=new l(b);a.clipboard.paste(this.options.value||""),a.undoRedoStack.push(new p(c,new l(a.getRange()))),a.focus()}}),r=j.extend({initialize:function(a,b){var c=b.editor;new d.SelectBox(a,{dataSource:c.options.insertHtml||[],dataTextField:"text",dataValueField:"value",change:function(a){j.exec(c,"insertHtml",this.value())},title:c.options.localization.insertHtml,highlightFirst:!1})},command:function(a){return new q(a)},update:function(a,b){var c=a.data("kendoSelectBox")||a.find("select").data("kendoSelectBox");c.close(),c.value(c.options.title)}}),s=c.extend({init:function(){this.stack=[],this.currentCommandIndex=-1},push:function(a){var b=this;b.stack=b.stack.slice(0,b.currentCommandIndex+1),b.currentCommandIndex=b.stack.push(a)-1},undo:function(){this.canUndo()&&this.stack[this.currentCommandIndex--].undo()},redo:function(){this.canRedo()&&this.stack[++this.currentCommandIndex].redo()},canUndo:function(){return this.currentCommandIndex>=0},canRedo:function(){return this.currentCommandIndex!=this.stack.length-1}}),t=c.extend({init:function(a){this.editor=a},keydown:function(a){var b=this,c=b.editor,d=c.keyboard,e=d.isTypingKey(a);if(e&&!d.isTypingInProgress()){var f=c.getRange();b.startRestorePoint=new l(f),d.startTyping(function(){c.selectionRestorePoint=b.endRestorePoint=new l(c.getRange()),c.undoRedoStack.push(new p(b.startRestorePoint,b.endRestorePoint))});return!0}return!1},keyup:function(a){var b=this.editor.keyboard;if(b.isTypingInProgress()){b.endTyping();return!0}return!1}}),u=c.extend({init:function(a){this.editor=a,this.systemCommandIsInProgress=!1},createUndoCommand:function(){var a=this;a.endRestorePoint=new l(a.editor.getRange()),a.editor.undoRedoStack.push(new p(a.startRestorePoint,a.endRestorePoint)),a.startRestorePoint=a.endRestorePoint},changed:function(){if(this.startRestorePoint)return this.startRestorePoint.html!=this.editor.body.innerHTML;return!1},keydown:function(a){var b=this,c=b.editor,d=c.keyboard;if(d.isModifierKey(a)){d.isTypingInProgress()&&d.endTyping(!0),b.startRestorePoint=new l(c.getRange());return!0}if(d.isSystem(a)){b.systemCommandIsInProgress=!0,b.changed()&&(b.systemCommandIsInProgress=!1,b.createUndoCommand());return!0}return!1},keyup:function(a){var b=this;if(b.systemCommandIsInProgress&&b.changed()){b.systemCommandIsInProgress=!1,b.createUndoCommand(a);return!0}return!1}}),v=c.extend({init:function(a){this.handlers=a,this.typingInProgress=!1},isCharacter:function(a){return a>=48&&a<=90||a>=96&&a<=111||a>=186&&a<=192||a>=219&&a<=222},toolFromShortcut:function(b,c){var d=String.fromCharCode(c.keyCode),e,f;for(e in b){f=a.extend({ctrl:!1,alt:!1,shift:!1},b[e].options);if((f.key==d||f.key==c.keyCode)&&f.ctrl==c.ctrlKey&&f.alt==c.altKey&&f.shift==c.shiftKey)return e}},isTypingKey:function(a){var b=a.keyCode;return this.isCharacter(b)&&!a.ctrlKey&&!a.altKey||b==32||b==13||b==8||b==46&&!a.shiftKey&&!a.ctrlKey&&!a.altKey},isModifierKey:function(a){var b=a.keyCode;return b==17&&!a.shiftKey&&!a.altKey||b==16&&!a.ctrlKey&&!a.altKey||b==18&&!a.ctrlKey&&!a.shiftKey},isSystem:function(a){return a.keyCode==46&&a.ctrlKey&&!a.altKey&&!a.shiftKey},startTyping:function(a){this.onEndTyping=a,this.typingInProgress=!0},stopTyping:function(){this.typingInProgress=!1,this.onEndTyping&&this.onEndTyping()},endTyping:function(b){var c=this;c.clearTimeout(),b?c.stopTyping():c.timeout=window.setTimeout(a.proxy(c.stopTyping,c),1e3)},isTypingInProgress:function(){return this.typingInProgress},clearTimeout:function(){window.clearTimeout(this.timeout)},notify:function(a,b){var c,d=this.handlers;for(c=0;c<d.length;c++)if(d[c][b](a))break},keydown:function(a){this.notify(a,"keydown")},keyup:function(a){this.notify(a,"keyup")}}),w=c.extend({init:function(a){this.editor=a,this.cleaners=[new x]},htmlToFragment:function(a){var b=this.editor,c=b.document,d=g.create(c,"div"),e=c.createDocumentFragment();d.innerHTML=a;while(d.firstChild)e.appendChild(d.firstChild);return e},isBlock:function(a){return/<(div|p|ul|ol|table|h[1-6])/i.test(a)},oncut:function(a){var b=this.editor,c=new l(b.getRange());setTimeout(function(){b.undoRedoStack.push(new p(c,new l(b.getRange())))})},onpaste:function(b){var c=this.editor,e=c.getRange(),f="﻿",h=new l(e),j=g.create(c.document,"div",{className:"k-paste-container",innerHTML:f});c.body.appendChild(j);if(c.body.createTextRange){b.preventDefault();var k=c.createRange();k.selectNodeContents(j),c.selectRange(k);var m=c.body.createTextRange();m.moveToElementText(j),a(c.body).unbind("paste"),m.execCommand("Paste"),a(c.body).bind("paste",a.proxy(arguments.callee,this))}else{var n=c.createRange();n.selectNodeContents(j),i(n)}setTimeout(function(){var a,b={html:""};i(e),g.remove(j),j.lastChild&&g.is(j.lastChild,"br")&&g.remove(j.lastChild),a=j.innerHTML,a!=f&&(b.html=a),c.trigger("paste",b),c.clipboard.paste(b.html,!0),c.undoRedoStack.push(new p(h,new l(c.getRange()))),d.EditorUtils.select(c)})},splittableParent:function(a,b){var c,d;if(a)return g.parentOfType(b,["p","ul","ol"])||b.parentNode;c=b.parentNode,d=b.ownerDocument.body;if(g.isInline(c))while(c.parentNode!=d&&!g.isBlock(c.parentNode))c=c.parentNode;return c},paste:function(a,b){var c=this.editor,d,e;for(d=0,e=this.cleaners.length;d<e;d++)this.cleaners[d].applicable(a)&&(a=this.cleaners[d].clean(a));b&&(a=a.replace(/(<br>(\s|&nbsp;)*)+(<\/?(div|p|li|col|t))/ig,"$3"),a=a.replace(/<(a|span)[^>]*><\/\1>/ig,"")),a=a.replace(/^<li/i,"<ul><li").replace(/li>$/g,"li></ul>");var f=this.isBlock(a),j=c.getRange();j.deleteContents(),j.startContainer==c.document&&j.selectNodeContents(c.body);var k=new m,l=k.addCaret(j),n=this.splittableParent(f,l),o=!1;!/body|td/.test(g.name(n))&&(f||g.isInline(n))&&(j.selectNode(l),h.split(j,n,!0),o=!0);var p=this.htmlToFragment(a);if(p.firstChild&&p.firstChild.className==="k-paste-container"){var q=[];for(d=0,e=p.childNodes.length;d<e;d++)q.push(p.childNodes[d].innerHTML);p=this.htmlToFragment(q.join("<br />"))}j.insertNode(p),n=this.splittableParent(f,l);if(o){while(l.parentNode!=n)g.unwrap(l.parentNode);g.unwrap(l.parentNode)}g.normalize(j.commonAncestorContainer),l.style.display="inline",g.scrollTo(l),k.removeCaret(j),i(j)}}),x=c.extend({init:function(){this.replacements=[/<\?xml[^>]*>/gi,"",/<!--(.|\n)*?-->/g,"",/&quot;/g,"'",/(?:<br>&nbsp;[\s\r\n]+|<br>)*(<\/?(h[1-6]|hr|p|div|table|tbody|thead|tfoot|th|tr|td|li|ol|ul|caption|address|pre|form|blockquote|dl|dt|dd|dir|fieldset)[^>]*>)(?:<br>&nbsp;[\s\r\n]+|<br>)*/g,"$1",/<br><br>/g,"<BR><BR>",/<br>/g," ",/<table([^>]*)>(\s|&nbsp;)+<t/gi,"<table$1><t",/<tr[^>]*>(\s|&nbsp;)*<\/tr>/gi,"",/<tbody[^>]*>(\s|&nbsp;)*<\/tbody>/gi,"",/<table[^>]*>(\s|&nbsp;)*<\/table>/gi,"",/<BR><BR>/g,"<br>",/^\s*(&nbsp;)+/gi,"",/(&nbsp;|<br[^>]*>)+\s*$/gi,"",/mso-[^;"]*;?/ig,"",/<(\/?)b(\s[^>]*)?>/ig,"<$1strong$2>",/<(\/?)i(\s[^>]*)?>/ig,"<$1em$2>",/<\/?(meta|link|style|o:|v:|x:)[^>]*>((?:.|\n)*?<\/(meta|link|style|o:|v:|x:)[^>]*>)?/ig,"",/style=(["|'])\s*\1/g,""]},applicable:function(a){return/class="?Mso|style="[^"]*mso-/i.test(a)},listType:function(a){if(/^[\u2022\u00b7\u00a7\u00d8o]\u00a0+/.test(a))return"ul";if(/^\s*\w+[\.\)]\u00a0{2,}/.test(a))return"ol"},lists:function(b){var c=g.create(document,"div",{innerHTML:b}),d=a(g.blockElements.join(","),c),e=-1,f,h={ul:{},ol:{}},i=c;for(var j=0;j<d.length;j++){var k=d[j];b=k.innerHTML.replace(/<\/?\w+[^>]*>/g,"").replace(/&nbsp;/g," ");var l=this.listType(b);if(!l||g.name(k)!="p"){k.innerHTML?(h={ul:{},ol:{}},i=c,e=-1):g.remove(k);continue}var m=parseFloat(k.style.marginLeft||0),n=h[l][m];if(m>e||!n)n=g.create(document,l),i==c?g.insertBefore(n,k):i.appendChild(n),h[l][m]=n;if(f!=l)for(var o in h)for(var p in h[o])a.contains(n,h[o][p])&&delete h[o][p];g.remove(k.firstChild),i=g.create(document,"li",{innerHTML:k.innerHTML}),n.appendChild(i),g.remove(k),e=m,f=l}return c.innerHTML},stripEmptyAnchors:function(a){return a.replace(/<a([^>]*)>\s*<\/a>/ig,function(a,b){if(!b||b.indexOf("href")<0)return"";return a})},clean:function(a){var b=this,c=b.replacements,d,e;for(d=0,e=c.length;d<e;d+=2)a=a.replace(c[d],c[d+1]);a=b.stripEmptyAnchors(a),a=b.lists(a),a=a.replace(/\s+class="?[^"\s>]*"?/ig,"");return a}});n(d,{Command:o,GenericCommand:p,InsertHtmlCommand:q,InsertHtmlTool:r,UndoRedoStack:s,TypingHandler:t,SystemHandler:u,Keyboard:v,Clipboard:w,MSWordFormatCleaner:x}),f("insertHtml",new r({template:new k({template:e.dropDownListTemplate,title:"Insert HTML",initialValue:"Insert HTML"})}))}(jQuery),function(a){function t(a){return a.collapsed&&!k.isExpandable(a)}var b=window.kendo,c=b.Class,d=b.ui.editor,e=b.ui.Editor.fn.options.formats,f=d.EditorUtils,g=d.Tool,h=d.ToolTemplate,i=d.FormatTool,j=d.Dom,k=d.RangeUtils,l=a.extend,m=d.EditorUtils.registerTool,n=d.EditorUtils.registerFormat,o="k-marker",p=c.extend({init:function(a){this.format=a},numberOfSiblings:function(a){var b=0,c=0,d=0,e=a.parentNode,f;for(f=e.firstChild;f;f=f.nextSibling)f!=a&&(f.className==o?d++:f.nodeType==3?b++:c++);return d>1&&e.firstChild.className==o&&e.lastChild.className==o?0:c+b},findSuitable:function(a,b){if(!b&&this.numberOfSiblings(a)>0)return null;return j.parentOfType(a,this.format[0].tags)},findFormat:function(a){var b=this.format,c=j.attrEquals,d,e,f,g,h;for(d=0,e=b.length;d<e;d++){f=a,g=b[d].tags,h=b[d].attr;if(f&&j.ofType(f,g)&&c(f,h))return f;while(f){f=j.parentOfType(f,g);if(f&&c(f,h))return f}}return null},isFormatted:function(a){var b,c;for(b=0,c=a.length;b<c;b++)if(this.findFormat(a[b]))return!0;return!1}}),q=c.extend({init:function(a,b){var c=this;c.finder=new p(a),c.attributes=l({},a[0].attr,b),c.tag=a[0].tags[0]},wrap:function(a){return j.wrap(a,j.create(a.ownerDocument,this.tag,this.attributes))},activate:function(a,b){var c=this;c.finder.isFormatted(b)?(c.split(a),c.remove(b)):c.apply(b)},toggle:function(a){var b=k.textNodes(a);b.length>0&&this.activate(a,b)},apply:function(a){var b=this,c=[],d,e,f,g;for(d=0,e=a.length;d<e;d++)f=a[d],g=b.finder.findSuitable(f),g?j.attr(g,b.attributes):g=b.wrap(f),c.push(g);b.consolidate(c)},remove:function(a){var b=this,c,d,e;for(c=0,d=a.length;c<d;c++)e=b.finder.findFormat(a[c]),e&&(b.attributes&&b.attributes.style?(j.unstyle(e,b.attributes.style),e.style.cssText||j.unwrap(e)):j.unwrap(e))},split:function(a){var b=k.textNodes(a),c=b.length,d,e;if(c>0)for(d=0;d<c;d++)e=this.finder.findFormat(b[d]),e&&k.split(a,e,!0)},consolidate:function(a){var b,c;while(a.length>1){b=a.pop(),c=a[a.length-1],b.previousSibling&&b.previousSibling.className==o&&c.appendChild(b.previousSibling);if(b.tagName==c.tagName&&b.previousSibling==c&&b.style.cssText==c.style.cssText){while(b.firstChild)c.appendChild(b.firstChild);j.remove(b)}}}}),r=p.extend({init:function(a,b){var c=this;c.format=a,c.greedyProperty=b,p.fn.init.call(c,a)},getInlineCssValue:function(b){var c=b.attributes,d=a.trim,e,f,g,h,i,k,l,m,n,o,p,q;if(!!c){for(e=0,f=c.length;e<f;e++){g=c[e],h=g.nodeName,i=g.nodeValue;if(g.specified&&h=="style"){k=d(i||b.style.cssText).split(";");for(m=0,n=k.length;m<n;m++){l=k[m];if(l.length){o=l.split(":"),p=d(o[0].toLowerCase()),q=d(o[1]);if(p!=this.greedyProperty)continue;return p.indexOf("color")>=0?j.toHex(q):q}}}}return}},getFormatInner:function(b){var c=a(j.isDataNode(b)?b.parentNode:b),d=c.parents().andSelf(),e,f,g;for(e=0,f=d.length;e<f;e++){g=this.greedyProperty=="className"?d[e].className:this.getInlineCssValue(d[e]);if(g)return g}return"inherit"},getFormat:function(a){var b=this.getFormatInner(a[0]),c,d;for(c=1,d=a.length;c<d;c++)if(b!=this.getFormatInner(a[c]))return"";return b},isFormatted:function(a){return this.getFormat(a)!==""}}),s=q.extend({init:function(a,b,c){var d=this;q.fn.init.call(d,a,b),d.greedyProperty=c,d.values=b,d.finder=new r(a,c)},activate:function(a,b){var c=this;c.split(a);if(c.greedyProperty){var d=c.greedyProperty.replace(/-([a-z])/,function(a,b){return b.toUpperCase()});c[c.values.style[d]=="inherit"?"remove":"apply"](b)}else c.apply(b)}}),u=i.extend({init:function(a){i.fn.init.call(this,l(a,{finder:new p(a.format),formatter:function(){return new q(a.format)}})),this.willDelayExecution=t}}),v=g.extend({init:function(c){var d=this;g.fn.init.call(d,c),d.options=c,d.type=a.browser.msie||b.support.touch?"kendoDropDownList":"kendoComboBox",d.format=[{tags:["span"]}],d.finder=new r(d.format,c.cssAttr)},command:function(a){var b=this.options,c=this.format,e={};return new d.FormatCommand(l(a,{formatter:function(){e[b.domAttr]=a.value;return new s(c,{style:e},b.cssAttr)}}))},willDelayExecution:t,update:function(a,b,c){var d=this,e=a.data(d.type),f=c.getPending(d.name),g=f&&f.params?f.params.value:d.finder.getFormat(b);e.close(),e.value(g)},initialize:function(a,b){var c=b.editor,d=this.options.name;a[this.type]({dataTextField:"Text",dataValueField:"Value",dataSource:c.options[d],change:function(a){g.exec(c,d,this.value())},highlightFirst:!1}),a.closest(".k-widget").removeClass("k-"+d).find("*").andSelf().attr("unselectable","on"),a.data(this.type).value("inherit")}}),w=g.extend({init:function(a){g.fn.init.call(this,a),this.options=a,this.format=[{tags:j.inlineElements}]},update:function(a){a.data("kendoColorPicker").close()},command:function(a){var b=this.options,c=this.format,e={};return new d.FormatCommand(l(a,{formatter:function(){e[b.domAttr]=a.value;return new s(c,{style:e},b.cssAttr)}}))},willDelayExecution:t,initialize:function(a,b){var c=b.editor,e=this.name;new d.ColorPicker(a,{value:"#000000",change:function(a){g.exec(c,e,a.value)}})}}),x=g.extend({init:function(a){var b=this;g.fn.init.call(b,a),b.format=[{tags:["span"]}],b.finder=new r(b.format,"className")},command:function(a){return new d.FormatCommand(l(a,{formatter:function(){return new s(this.format,{className:a.value})}}))},update:function(a,b){var c=a.data("kendoDropDownList");c.close(),c.value(this.finder.getFormat(b))},initiliaze:function(a,b){var c=b.editor;a.kendoDropDownList({data:c.style,title:c.options.localization.style,itemCreate:function(a){var b=j.inlineStyle(c.document,"span",{className:a.dataItem.Value});a.html='<span unselectable="on" style="display:block;'+b+'">'+a.html+"</span>"},change:function(a){g.exec(c,"style",a.value)}})}});l(d,{InlineFormatFinder:p,InlineFormatter:q,GreedyInlineFormatFinder:r,GreedyInlineFormatter:s,InlineFormatTool:u,FontTool:v,ColorTool:w,StyleTool:x}),m("style",new d.StyleTool({template:new h({template:f.dropDownListTemplate,title:"Indent",initialValue:"Styles"})})),n("bold",[{tags:["strong"]},{tags:["span"],attr:{style:{fontWeight:"bold"}}}]),m("bold",new u({key:"B",ctrl:!0,format:e.bold,template:new h({template:f.buttonTemplate,title:"Bold"})})),n("italic",[{tags:["em"]},{tags:["span"],attr:{style:{fontStyle:"italic"}}}]),m("italic",new u({key:"I",ctrl:!0,format:e.italic,template:new h({template:f.buttonTemplate,title:"Italic"})})),n("underline",[{tags:["span"],attr:{style:{textDecoration:"underline"}}}]),m("underline",new u({key:"U",ctrl:!0,format:e.underline,template:new h({template:f.buttonTemplate,title:"Underline"})})),n("strikethrough",[{tags:["del"]},{tags:["span"],attr:{style:{textDecoration:"line-through"}}}]),m("strikethrough",new u({format:e.strikethrough,template:new h({template:f.buttonTemplate,title:"Strikethrough"})})),n("superscript",[{tags:["sup"]}]),m("superscript",new u({format:e.superscript,template:new h({template:f.buttonTemplate,title:"Superscript"})})),n("subscript",[{tags:["sub"]}]),m("subscript",new u({format:e.subscript,template:new h({template:f.buttonTemplate,title:"Subscript"})})),m("foreColor",new w({cssAttr:"color",domAttr:"color",name:"foreColor",template:new h({template:f.colorPickerTemplate,title:"Color"})})),m("backColor",new w({cssAttr:"background-color",domAttr:"backgroundColor",name:"backColor",template:new h({template:f.colorPickerTemplate,title:"Background Color"})})),m("fontName",new v({cssAttr:"font-family",domAttr:"fontFamily",name:"fontName",template:new h({template:f.comboBoxTemplate,title:"Font Name",initialValue:"(inherited font)"})})),m("fontSize",new v({cssAttr:"font-size",domAttr:"fontSize",name:"fontSize",template:new h({template:f.comboBoxTemplate,title:"Font Size",initialValue:"(inherited size)"})}))}(jQuery),function(a){var b=window.kendo,c=b.Class,d=a.extend,e=b.ui.editor,f=b.ui.Editor.fn.options.formats,g=e.Dom,h=e.Command,i=e.Tool,j=e.ToolTemplate,k=e.FormatTool,l=e.EditorUtils,m=l.registerTool,n=l.registerFormat,o=e.RangeUtils,p=c.extend({init:function(a){this.format=a},contains:function(a,b){var c,d,e;for(c=0,d=b.length;c<d;c++){e=b[c];if(!e||!g.isAncestorOrSelf(a,e))return!1}return!0},findSuitable:function(b){var c=this.format,d=[],e,f,h;for(e=0,f=b.length;e<f;e++){h=g.ofType(b[e],c[0].tags)?b[e]:g.parentOfType(b[e],c[0].tags);if(!h)return[];a.inArray(h,d)<0&&d.push(h)}for(e=0,f=d.length;e<f;e++)if(this.contains(d[e],d))return[d[e]];return d},findFormat:function(a){var b=this.format,c,d,e,f,h;for(c=0,d=b.length;c<d;c++){e=a,f=b[c].tags,h=b[c].attr;while(e){if(g.ofType(e,f)&&g.attrEquals(e,h))return e;e=e.parentNode}}return null},getFormat:function(a){var b=this,c=function(a){return b.findFormat(g.isDataNode(a)?a.parentNode:a)},d=c(a[0]),e,f;if(!d)return"";for(e=1,f=a.length;e<f;e++)if(d!=c(a[e]))return"";return d.nodeName.toLowerCase()},isFormatted:function(a){for(var b=0,c=a.length;b<c;b++)if(!this.findFormat(a[b]))return!1;return!0}}),q=c.extend({init:function(a,b){this.format=a,this.values=b,this.finder=new p(a)},wrap:function(a,b,c){var d=c.length==1?g.blockParentOrBody(c[0]):g.commonAncestor.apply(null,c);g.isInline(d)&&(d=g.blockParentOrBody(d));var e=g.significantChildNodes(d),f=g.findNodeIndex(e[0]),h=g.create(d.ownerDocument,a,b),i,j;for(i=0;i<e.length;i++){j=e[i];if(g.isBlock(j)){g.attr(j,b),h.childNodes.length&&(g.insertBefore(h,j),h=h.cloneNode(!1)),f=g.findNodeIndex(j)+1;continue}h.appendChild(j)}h.firstChild&&g.insertAt(d,h,f)},apply:function(a){var b=this,c=g.is(a[0],"img")?[a[0]]:b.finder.findSuitable(a),e=c.length?l.formatByName(g.name(c[0]),b.format):b.format[0],f=e.tags[0],h=d({},e.attr,b.values),i,j;if(c.length)for(i=0,j=c.length;i<j;i++)g.attr(c[i],h);else b.wrap(f,h,a)},remove:function(a){var b,c,d,e;for(b=0,c=a.length;b<c;b++)d=this.finder.findFormat(a[b]),d&&(g.ofType(d,["p","img","li"])?(e=l.formatByName(g.name(d),this.format),e.attr.style&&g.unstyle(d,e.attr.style),e.attr.className&&g.removeClass(d,e.attr.className)):g.unwrap(d))},toggle:function(a){var b=this,c=o.nodes(a);b.finder.isFormatted(c)?b.remove(c):b.apply(c)}}),r=c.extend({init:function(a,b){var c=this;c.format=a,c.values=b,c.finder=new p(a)},apply:function(a){var b=this.format,c=g.blockParents(a),d=b[0].tags[0],f,h,i,j,k;if(c.length)for(f=0,h=c.length;f<h;f++)g.is(c[f],"li")?(i=c[f].parentNode,j=new e.ListFormatter(i.nodeName.toLowerCase(),d),k=this.editor.createRange(),k.selectNode(c[f]),j.toggle(k)):g.changeTag(c[f],d);else(new q(b,this.values)).apply(a)},toggle:function(a){var b=o.textNodes(a);b.length||(a.selectNodeContents(a.commonAncestorContainer),b=o.textNodes(a),b.length||(b=g.significantChildNodes(a.commonAncestorContainer))),this.apply(b)}}),s=h.extend({init:function(a){a.formatter=a.formatter(),h.fn.init.call(this,a)}}),t=k.extend({init:function(a){k.fn.init.call(this,d(a,{finder:new p(a.format),formatter:function(){return new q(a.format)}}))}}),u=i.extend({init:function(a){i.fn.init.call(this,a),this.finder=new p([{tags:g.blockElements}])},command:function(a){return new s(d(a,{formatter:function(){return new r([{tags:[a.value]}],{})}}))},update:function(a,b){var c;a.is("select")?c=a.data("kendoSelectBox"):c=a.find("select").data("kendoSelectBox"),c.close(),c.value(this.finder.getFormat(b))},initialize:function(a,b){var c=b.editor,d="formatBlock";new e.SelectBox(a,{dataTextField:"Text",dataValueField:"Value",dataSource:c.options.formatBlock,title:c.options.localization.formatBlock,change:function(a){i.exec(c,d,this.value())},highlightFirst:!1}),a.closest(".k-widget").removeClass("k-"+d).find("*").andSelf().attr("unselectable","on")}});d(e,{BlockFormatFinder:p,BlockFormatter:q,GreedyBlockFormatter:r,FormatCommand:s,BlockFormatTool:t,FormatBlockTool:u}),m("formatBlock",new u({template:new j({template:l.dropDownListTemplate,title:"Format Block",initialValue:"Select Block Type"})})),n("justifyLeft",[{tags:g.blockElements,attr:{style:{textAlign:"left"}}},{tags:["img"],attr:{style:{"float":"left"}}}]),m("justifyLeft",new t({format:f.justifyLeft,template:new j({template:l.buttonTemplate,title:"Justify Left"})})),n("justifyCenter",[{tags:g.blockElements,attr:{style:{textAlign:"center"}}},{tags:["img"],attr:{style:{display:"block",marginLeft:"auto",marginRight:"auto"}}}]),m("justifyCenter",new t({format:f.justifyCenter,template:new j({template:l.buttonTemplate,title:"Justify Center"})})),n("justifyRight",[{tags:g.blockElements,attr:{style:{textAlign:"right"}}},{tags:["img"],attr:{style:{"float":"right"}}}]),m("justifyRight",new t({format:f.justifyRight,template:new j({template:l.buttonTemplate,title:"Justify Right"})})),n("justifyFull",[{tags:g.blockElements,attr:{style:{textAlign:"justify"}}}]),m("justifyFull",new t({format:f.justifyFull,template:new j({template:l.buttonTemplate,title:"Justify Full"})}))}(jQuery),function(a){var b=window.kendo,c=a.extend,d=b.ui.editor,e=d.Dom,f=d.Command,g=d.Tool,h=d.BlockFormatter,i=e.normalize,j=d.RangeUtils,k=d.EditorUtils.registerTool,l=f.extend({init:function(a){this.options=a,f.fn.init.call(this,a)},exec:function(){function v(a){a.firstChild&&e.is(a.firstChild,"br")&&e.remove(a.firstChild),e.isDataNode(a)&&!a.nodeValue&&(a=a.parentNode);if(a&&!e.is(a,"img")){while(a.firstChild&&a.firstChild.nodeType==1)a=a.firstChild;a.innerHTML||(a.innerHTML=l)}}var b=this.getRange(),c=j.documentFromRange(b),d,f,g,k,l=a.browser.msie?"":'<br _moz_dirty="" />',m,n,o,p,q,r="p,h1,h2,h3,h4,h5,h6".split(","),s=e.parentOfType(b.startContainer,r),t=e.parentOfType(b.endContainer,r),u=s&&!t||!s&&t;b.deleteContents(),n=e.create(c,"a"),b.insertNode(n),n.parentNode||(k=b.commonAncestorContainer,k.innerHTML="",k.appendChild(n)),i(n.parentNode),o=e.parentOfType(n,["li"]),p=e.parentOfType(n,"h1,h2,h3,h4,h5,h6".split(",")),o?(q=b.cloneRange(),q.selectNode(o),j.textNodes(q).length||(m=e.create(c,"p"),o.nextSibling&&j.split(q,o.parentNode),e.insertAfter(m,o.parentNode),e.remove(o.parentNode.childNodes.length==1?o.parentNode:o),m.innerHTML=l,g=m)):p&&!n.nextSibling&&(m=e.create(c,"p"),e.insertAfter(m,p),m.innerHTML=l,e.remove(n),g=m),g||(!o&&!p&&(new h([{tags:["p"]}])).apply([n]),b.selectNode(n),d=e.parentOfType(n,[o?"li":p?e.name(p):"p"]),j.split(b,d,u),f=d.previousSibling,e.is(f,"li")&&f.firstChild&&!e.is(f.firstChild,"br")&&(f=f.firstChild),g=d.nextSibling,e.is(g,"li")&&g.firstChild&&!e.is(g.firstChild,"br")&&(g=g.firstChild),e.remove(d),v(f),v(g),i(f)),i(g);if(e.is(g,"img"))b.setStartBefore(g);else{b.selectNodeContents(g);var w=j.textNodes(b)[0];w&&b.selectNodeContents(w)}b.collapse(!0),e.scrollTo(g),j.selectRange(b)}}),m=f.extend({init:function(a){this.options=a,f.fn.init.call(this,a)},exec:function(){var b=this.getRange();b.deleteContents();var c=e.create(j.documentFromRange(b),"br");b.insertNode(c),i(c.parentNode);if(!a.browser.msie&&(!c.nextSibling||e.isWhitespace(c.nextSibling))){var d=c.cloneNode(!0);d.setAttribute("_moz_dirty",""),e.insertAfter(d,c)}b.setStartAfter(c),b.collapse(!0),j.selectRange(b)}});c(d,{ParagraphCommand:l,NewLineCommand:m}),k("insertLineBreak",new g({key:13,shift:!0,command:m})),k("insertParagraph",new g({key:13,command:l}))}(jQuery),function(a){var b=window.kendo,c=b.Class,d=a.extend,e=b.ui.editor,f=e.Dom,g=e.RangeUtils,h=e.EditorUtils,i=e.Command,j=e.ToolTemplate,k=e.FormatTool,l=e.BlockFormatFinder,m=g.textNodes,n=e.EditorUtils.registerTool,o=l.extend({init:function(a){this.tag=a;var b=this.tags=[a=="ul"?"ol":"ul",a];l.fn.init.call(this,[{tags:b}])},isFormatted:function(a){var b=[],c;for(var d=0;d<a.length;d++)(c=this.findFormat(a[d]))&&f.name(c)==this.tag&&b.push(c);if(b.length<1)return!1;if(b.length!=a.length)return!1;for(d=0;d<b.length;d++){if(b[d].parentNode!=c.parentNode)break;if(b[d]!=c)return!1}return!0},findSuitable:function(a){var b=f.parentOfType(a[0],this.tags);if(b&&f.name(b)==this.tag)return b;return null}}),p=c.extend({init:function(a,b){var c=this;c.finder=new o(a),c.tag=a,c.unwrapTag=b},wrap:function(a,b){var c=f.create(a.ownerDocument,"li"),d,e;for(d=0;d<b.length;d++){e=b[d];if(f.is(e,"li")){a.appendChild(e);continue}if(f.is(e,"ul")||f.is(e,"ol")){while(e.firstChild)a.appendChild(e.firstChild);continue}if(f.is(e,"td")){while(e.firstChild)c.appendChild(e.firstChild);a.appendChild(c),e.appendChild(a),a=a.cloneNode(!1),c=c.cloneNode(!1);continue}c.appendChild(e),f.isBlock(e)&&(a.appendChild(c),f.unwrap(e),c=c.cloneNode(!1))}c.firstChild&&a.appendChild(c)},containsAny:function(a,b){for(var c=0;c<b.length;c++)if(f.isAncestorOrSelf(a,b[c]))return!0;return!1},suitable:function(a,b){if(a.className=="k-marker"){var c=a.nextSibling;if(c&&f.isBlock(c))return!1;c=a.previousSibling;if(c&&f.isBlock(c))return!1}return this.containsAny(a,b)||f.isInline(a)||a.nodeType==3},split:function(b){var c=m(b),d,e;if(c.length){d=f.parentOfType(c[0],["li"]),e=f.parentOfType(c[c.length-1],["li"]),b.setStartBefore(d),b.setEndAfter(e);for(var h=0,i=c.length;h<i;h++){var j=this.finder.findFormat(c[h]);if(j){var k=a(j).parents("ul,ol");k[0]?g.split(b,k.last()[0],!0):g.split(b,j,!0)}}}},merge:function(a,b){var c=b.previousSibling,d;while(c&&(c.className=="k-marker"||c.nodeType==3&&f.isWhitespace(c)))c=c.previousSibling;if(c&&f.name(c)==a){while(b.firstChild)c.appendChild(b.firstChild);f.remove(b),b=c}d=b.nextSibling;while(d&&(d.className=="k-marker"||d.nodeType==3&&f.isWhitespace(d)))d=d.nextSibling;if(d&&f.name(d)==a){while(b.lastChild)d.insertBefore(b.lastChild,d.firstChild);f.remove(b)}},applyOnSection:function(b,c){function j(){g.push(this)}var d=this.tag,e;c.length==1?e=f.parentOfType(c[0],["ul","ol"]):e=f.commonAncestor.apply(null,c),e||(e=f.parentOfType(c[0],["td"])||c[0].ownerDocument.body),f.isInline(e)&&(e=f.blockParentOrBody(e));var g=[],h=this.finder.findSuitable(c);h||(h=(new o(d=="ul"?"ol":"ul")).findSuitable(c));var i=f.significantChildNodes(e);i.length||(i=c),/table|tbody/.test(f.name(e))&&(i=a.map(c,function(a){return f.parentOfType(a,["td"])}));for(var k=0;k<i.length;k++){var l=i[k],m=f.name(l);this.suitable(l,c)&&(!h||!f.isAncestorOrSelf(h,l))&&(!h||m!="ul"&&m!="ol"?g.push(l):(a.each(l.childNodes,j),f.remove(l)))}g.length==i.length&&e!=c[0].ownerDocument.body&&!/table|tbody|tr|td/.test(f.name(e))&&(g=[e]),h||(h=f.create(e.ownerDocument,d),f.insertBefore(h,g[0])),this.wrap(h,g),f.is(h,d)||f.changeTag(h,d),this.merge(d,h)},apply:function(a){var b=0,c=[],d,e,g;do g=f.parentOfType(a[b],["td","body"]),!d||g!=d?(d&&c.push({section:d,nodes:e}),e=[a[b]],d=g):e.push(a[b]),b++;while(b<a.length);c.push({section:d,nodes:e});for(b=0;b<c.length;b++)this.applyOnSection(c[b].section,c[b].nodes)},unwrap:function(b){var c=b.ownerDocument.createDocumentFragment(),d=this.unwrapTag,e,g,h,i;for(g=b.firstChild;g;g=g.nextSibling){h=f.create(b.ownerDocument,d||"p");while(g.firstChild)i=g.firstChild,f.isBlock(i)?(h.firstChild&&(c.appendChild(h),h=f.create(b.ownerDocument,d||"p")),c.appendChild(i)):h.appendChild(i);h.firstChild&&c.appendChild(h)}e=a(b).parents("ul,ol"),e[0]?(f.insertAfter(c,e.last()[0]),e.last().remove()):f.insertAfter(c,b),f.remove(b)},remove:function(a){var b;for(var c=0,d=a.length;c<d;c++)b=this.finder.findFormat(a[c]),b&&this.unwrap(b)},toggle:function(a){var b=this,c=m(a),d=a.commonAncestorContainer;if(!c.length){a.selectNodeContents(d),c=m(a);if(!c.length){var e=d.ownerDocument.createTextNode("");a.startContainer.appendChild(e),c=[e],a.selectNode(e.parentNode)}}b.finder.isFormatted(c)?(b.split(a),b.remove(c)):b.apply(c)}}),q=i.extend({init:function(a){a.formatter=new p(a.tag),i.fn.init.call(this,a)}}),r=k.extend({init:function(a){this.options=a,k.fn.init.call(this,d(a,{finder:new o(a.tag)}))},command:function(a){return new q(d(a,{tag:this.options.tag}))}});d(e,{ListFormatFinder:o,ListFormatter:p,ListCommand:q,ListTool:r}),n("insertUnorderedList",new r({tag:"ul",template:new j({template:h.buttonTemplate,title:"Remove Link"})})),n("insertOrderedList",new r({tag:"ol",template:new j({template:h.buttonTemplate,title:"Remove Link"})}))}(jQuery),function(a,b){var c=window.kendo,d=c.Class,e=a.extend,f=c.ui.editor,g=f.Dom,h=f.RangeUtils,i=f.EditorUtils,j=f.Command,k=f.Tool,l=f.ToolTemplate,m=f.InlineFormatter,n=f.InlineFormatFinder,o=h.textNodes,p=f.EditorUtils.registerTool,q=d.extend({findSuitable:function(a){return g.parentOfType(a,["a"])}}),r=d.extend({init:function(){this.finder=new q},apply:function(a,b){var c=o(a);if(b.innerHTML){var d=h.getMarkers(a),e=h.documentFromRange(a);a.deleteContents();var f=g.create(e,"a",b);a.insertNode(f),d.length>1&&(g.insertAfter(d[d.length-1],f),g.insertAfter(d[1],f),g[c.length>0?"insertBefore":"insertAfter"](d[0],f))}else{var i=new m([{tags:["a"]}],b);i.finder=this.finder,i.apply(c)}}}),s=j.extend({init:function(a){a.formatter={toggle:function(a){(new m([{tags:["a"]}])).remove(o(a))}},this.options=a,j.fn.init.call(this,a)}}),t=j.extend({init:function(a){var b=this;b.options=a,j.fn.init.call(b,a),b.attributes=null,b.async=!0,b.formatter=new r},exec:function(){function j(a){a.preventDefault(),n.destroy(),g.windowFromDocument(h.documentFromRange(b)).focus(),f.releaseRange(b)}function i(c){var d=a("#k-editor-link-url",n.element).val();if(d&&d!="http://"){f.attributes={href:d};var g=a("#k-editor-link-title",n.element).val();g&&(f.attributes.title=g);var h=a("#k-editor-link-text",n.element).val();h!==e&&(f.attributes.innerHTML=h||d);var i=a("#k-editor-link-target",n.element).is(":checked");i&&(f.attributes.target="_blank"),f.formatter.apply(b,f.attributes)}j(c),f.change&&f.change()}var b=this.getRange(),c=b.collapsed;b=this.lockRange(!0);var d=o(b),e=null,f=this,k=d.length?f.formatter.finder.findSuitable(d[0]):null,l=d.length<=1||d.length==2&&c,m='<div class="k-editor-dialog"><ol><li class="k-form-text-row"><label for="k-editor-link-url">Web address</label><input type="text" class="k-input" id="k-editor-link-url"/></li>'+(l?'<li class="k-form-text-row"><label for="k-editor-link-text">Text</label><input type="text" class="k-input" id="k-editor-link-text"/></li>':"")+'<li class="k-form-text-row"><label for="k-editor-link-title">Tooltip</label><input type="text" class="k-input" id="k-editor-link-title"/></li>'+'<li class="k-form-checkbox-row"><input type="checkbox" id="k-editor-link-target"/><label for="k-editor-link-target">Open link in new window</label></li>'+"</ol>"+'<div class="k-button-wrapper">'+'<button class="k-dialog-insert k-button">Insert</button>'+"&nbsp;or&nbsp;"+'<a href="#" class="k-dialog-close k-link">Close</a>'+"</div>"+"</div>",n=a(m).appendTo(document.body).kendoWindow(a.extend({},this.editor.options.dialogOptions,{title:"Insert link",close:j})).hide().find(".k-dialog-insert").click(i).end().find(".k-dialog-close").click(j).end().find(".k-form-text-row input").keydown(function(a){a.keyCode==13?i(a):a.keyCode==27&&j(a)}).end().find("#k-editor-link-url").val(k?k.getAttribute("href",2):"http://").end().find("#k-editor-link-text").val(d.length>0?d.length==1?d[0].nodeValue:d[0].nodeValue+d[1].nodeValue:"").end().find("#k-editor-link-title").val(k?k.title:"").end().find("#k-editor-link-target").attr("checked",k?k.target=="_blank":!1).end().show().data("kendoWindow").center();l&&d.length>0&&(e=a("#k-editor-link-text",n.element).val()),a("#k-editor-link-url",n.element).focus().select()},redo:function(){var a=this,b=a.lockRange(!0);a.formatter.apply(b,a.attributes),a.releaseRange(b)}}),u=k.extend({init:function(b){this.options=b,this.finder=new n([{tags:["a"]}]),k.fn.init.call(this,a.extend(b,{command:s}))},initialize:function(a){a.attr("unselectable","on").addClass("k-state-disabled")},update:function(a,b){a.toggleClass("k-state-disabled",!this.finder.isFormatted(b)).removeClass("k-state-hover")}});e(c.ui.editor,{LinkFormatFinder:q,LinkFormatter:r,UnlinkCommand:s,LinkCommand:t,UnlinkTool:u}),p("createLink",new k({key:"K",ctrl:!0,command:t,template:new l({template:i.buttonTemplate,title:"Create Link"})})),p("unlink",new u({key:"K",ctrl:!0,shift:!0,template:new l({template:i.buttonTemplate,title:"Remove Link"})}))}(jQuery),function(a,b){var c=window.kendo,d=a.extend,e=c.ui.editor,f=e.EditorUtils,g=e.Dom,h=f.registerTool,i=e.ToolTemplate,j=e.RangeUtils,k=e.Command,l=c.keys,m="Insert Image",n="#k-editor-image-url",o="#k-editor-image-title",p=k.extend({init:function(a){var b=this;k.fn.init.call(b,a),b.async=!0,b.attributes={}},insertImage:function(a,b){var c=this.attributes;if(c.src&&c.src!="http://"){if(!a){a=g.create(j.documentFromRange(b),"img",c),a.onload=a.onerror=function(){a.removeAttribute("complete"),a.removeAttribute("width"),a.removeAttribute("height")},b.deleteContents(),b.insertNode(a),b.setStartAfter(a),b.setEndAfter(a),j.selectRange(b);return!0}g.attr(a,c)}return!1},redo:function(){var a=this,b=a.lockRange();a.insertImage(j.image(b),b)||a.releaseRange(b)},exec:function(){function q(a){a.keyCode==l.ENTER?k(a):a.keyCode==l.ESC&&p(a)}function p(a){a.preventDefault(),i.destroy(),g.windowFromDocument(j.documentFromRange(c)).focus(),e||b.releaseRange(c)}function k(d){b.attributes={src:a(n,i.element).val(),alt:a(o,i.element).val()},e=b.insertImage(f,c),p(d),b.change&&b.change()}var b=this,c=b.lockRange(),e=!1,f=j.image(c),h,i;h='<div class="k-editor-dialog"><ol><li class="k-form-text-row"><label for="k-editor-image-url">Web address</label><input type="text" class="k-input" id="k-editor-image-url"/></li><li class="k-form-text-row"><label for="k-editor-image-title">Tooltip</label><input type="text" class="k-input" id="k-editor-image-title"/></li></ol><div class="k-button-wrapper"><button class="k-dialog-insert k-button">Insert</button>&nbsp;or&nbsp;<a href="#" class="k-dialog-close k-link">Close</a></div></div>',i=a(h).appendTo(document.body).kendoWindow(d({},b.editor.options.dialogOptions,{title:m,close:p,activate:function(){}})).hide().find(".k-dialog-insert").click(k).end().find(".k-dialog-close").click(p).end().find(".k-form-text-row input").keydown(q).end().find(n).val(f?f.getAttribute("src",2):"http://").end().find(o).val(f?f.alt:"").end().show().data("kendoWindow").center(),a(n,i.element).focus().select()}});c.ui.editor.ImageCommand=p,h("insertImage",new e.Tool({command:p,template:new i({template:f.buttonTemplate,title:m})}))}(jQuery),function(a,b){var c=window.kendo,d=c.ui.Widget,e=c.ui.DropDownList,f=c.ui.editor,g=f.Dom,h="change",i="k-state-selected",j="."+i,k=".k-selected-color",l="unselectable",m="background-color",n=c.keys,o=c.template('<div class="k-colorpicker-popup"><ul class="k-reset"># for(var i = 0; i < colors.length; i++) { #<li class="k-item #= colors[i] == value ? "k-state-selected" : "" #"><div style="background-color:\\##= colors[i] #"></div></li># } #</ul></div>'),p=d.extend({init:function(b,c){var e=this;d.fn.init.call(e,b,c),b=e.element,c=e.options,e._value=c.value,e.popup=a(o({colors:c.colors,value:c.value.substring(1)})).kendoPopup({anchor:b,toggleTarget:b.find(".k-icon")}).delegate(".k-item","click",function(b){e.select(a(b.currentTarget).find("div").css(m))}).find("*").attr(l,"on").end().data("kendoPopup"),b.attr("tabIndex",0).keydown(function(a){e.keydown(a)}).focus(function(){b.css("outline","1px dotted #000")}).blur(function(){b.css("outline","")}).delegate(".k-tool-icon","click",function(){e.select()}).find("*").attr(l,"on"),e._value&&b.find(k).css(m,e._value)},options:{name:"ColorPicker",colors:"000000,7f7f7f,880015,ed1c24,ff7f27,fff200,22b14c,00a2e8,3f48cc,a349a4,ffffff,c3c3c3,b97a57,ffaec9,ffc90e,efe4b0,b5e61d,99d9ea,7092be,c8bfe7".split(","),value:null},events:[h],select:function(a){var b=this;a?(a=g.toHex(a),b.trigger(h,{value:a})||(b.value(a),b.close())):b.trigger(h,{value:b._value})},open:function(){this.popup.open()},close:function(){this.popup.close()},toggle:function(){this.popup.toggle()},keydown:function(a){var b=this,c=b.popup.element,d=b.popup.visible(),e,f,g,h=!1,k=a.keyCode;k==n.DOWN?(d?(e=c.find(j),e[0]?f=e.next():f=c.find("li:first"),f[0]&&(e.removeClass(i),f.addClass(i))):b.open(),h=!0):k==n.UP?(d&&(e=c.find(j),g=e.prev(),g[0]&&(e.removeClass(i),g.addClass(i))),h=!0):k==n.TAB||k==n.RIGHT||k==n.LEFT?b.close():k==n.ENTER&&(c.find(j).click(),h=!0),h&&a.preventDefault()},value:function(a){var c=this;if(a===b)return c._value;a=g.toHex(a),c._value=a,c.element.find(k).css(m,a)}}),q=e.extend({init:function(a,b){var c=this;e.fn.init.call(c,a,b),c.value(c.options.title)},options:{name:"SelectBox"},value:function(a){var c=this,d=e.fn.value.call(c,a);if(a===b)return d;a!==e.fn.value.call(c)&&(c.text(c.options.title),c._current.removeClass("k-state-selected"),c.current(null),c._oldIndex=c.selectedIndex=-1)}});c.ui.editor.ColorPicker=p,c.ui.editor.SelectBox=q}(jQuery),function(a,b){function q(a,c){var d=g.name(a)!="td"?"marginLeft":"paddingLeft";if(c===b)return a.style[d]||0;c>0?a.style[d]=c+"px":(a.style[d]="",a.style.cssText||a.removeAttribute("style"))}var c=window.kendo,d=c.Class,e=a.extend,f=c.ui.editor,g=f.Dom,h=f.EditorUtils,i=h.registerTool,j=f.Command,k=f.Tool,l=f.ToolTemplate,m=f.RangeUtils,n=g.blockElements,o=f.BlockFormatFinder,p=f.BlockFormatter,r=d.extend({init:function(){this.finder=new o([{tags:g.blockElements}])},apply:function(b){var c=this.finder.findSuitable(b),d=[],e,f,h,i,j;if(c.length){for(e=0,f=c.length;e<f;e++)g.is(c[e],"li")?a(c[e]).index()?a.inArray(c[e].parentNode,d)<0&&d.push(c[e]):d.push(c[e].parentNode):d.push(c[e]);while(d.length){h=d.shift();if(g.is(h,"li")){i=h.parentNode,j=a(h).prev("li");var k=j.find("ul,ol").last(),l=a(h).children("ul,ol")[0];if(l&&j[0])k[0]?(k.append(h),k.append(a(l).children()),g.remove(l)):(j.append(l),l.insertBefore(h,l.firstChild));else{l=j.children("ul,ol")[0],l||(l=g.create(h.ownerDocument,g.name(i)),j.append(l));while(h&&h.parentNode==i)l.appendChild(h),h=d.shift()}}else{var m=parseInt(q(h),10)+30;q(h,m);for(var n=0;n<d.length;n++)a.contains(h,d[n])&&d.splice(n,1)}}}else{var o=new p([{tags:"p"}],{style:{marginLeft:30}});o.apply(b)}},remove:function(b){var c=this.finder.findSuitable(b),d,e,f,g,h,i,j,k;for(e=0,f=c.length;e<f;e++){j=a(c[e]);if(j.is("li")){g=j.parent(),h=g.parent();if(h.is("li,ul,ol")&&!q(g[0])){if(d&&a.contains(d,h[0]))continue;i=j.nextAll("li"),i.length&&a(g[0].cloneNode(!1)).appendTo(j).append(i),h.is("li")?j.insertAfter(h):j.appendTo(h),g.children("li").length||g.remove();continue}if(d==g[0])continue;d=g[0]}else d=c[e];k=parseInt(q(d),10)-30,q(d,k)}}}),s=j.extend({init:function(a){a.formatter={toggle:function(a){(new r).apply(m.nodes(a))}},j.fn.init.call(this,a)}}),t=j.extend({init:function(a){a.formatter={toggle:function(a){(new r).remove(m.nodes(a))}},j.fn.init.call(this,a)}}),u=k.extend({init:function(a){k.fn.init.call(this,e(a,{command:t})),this.finder=new o([{tags:n}])},initialize:function(a){a.attr("unselectable","on").addClass("k-state-disabled")},update:function(b,c){var d=this.finder.findSuitable(c),e,f,h,i;for(h=0,i=d.length;h<i;h++){e=q(d[h]),e||(f=a(d[h]).parents("ul,ol").length,e=g.is(d[h],"li")&&(f>1||q(d[h].parentNode))||g.ofType(d[h],["ul","ol"])&&f>0);if(e){b.removeClass("k-state-disabled");return}}b.addClass("k-state-disabled").removeClass("k-state-hover")}});e(f,{IndentFormatter:r,IndentCommand:s,OutdentCommand:t,OutdentTool:u}),i("indent",new k({command:s,template:new l({template:h.buttonTemplate,title:"Indent"})})),i("outdent",new u({template:new l({template:h.buttonTemplate,title:"Outdent"})}))}(jQuery),function(a){var b=window.kendo,c=b.Class,d=a.extend,e=b.ui.editor,f=e.RangeUtils,g=e.Marker,h=c.extend({init:function(a){this.editor=a,this.formats=[]},apply:function(a){if(!!this.hasPending()){var b=new g;b.addCaret(a);var c=a.startContainer.childNodes[a.startOffset],e=c.previousSibling;e.nodeValue||(e=e.previousSibling),a.setStart(e,e.nodeValue.length-1),b.add(a);if(!f.textNodes(a).length){b.remove(a),a.collapse(!0),this.editor.selectRange(a);return}var h=b.end.previousSibling.previousSibling,i,j=this.formats;for(var k=0;k<j.length;k++){i=j[k];var l=i.command(d({range:a},i.options.params));l.editor=this.editor,l.exec(),a.selectNode(h)}b.remove(a),h.parentNode&&(a.setStart(h,1),a.collapse(!0)),this.clear(),this.editor.selectRange(a)}},hasPending:function(){return this.formats.length>0},isPending:function(a){return!!this.getPending(a)},getPending:function(a){var b=this.formats;for(var c=0;c<b.length;c++)if(b[c].name==a)return b[c];return},toggle:function(a){var b=this.formats;for(var c=0;c<b.length;c++)if(b[c].name==a.name){b[c].params&&b[c].params.value!=a.params.value?b[c].params.value=a.params.value:b.splice(c,1);return}b.push(a)},clear:function(){this.formats=[]}});d(e,{PendingFormats:h})}(jQuery),function(a,b){function C(c,d){var e,f=d!==b;if(document.selection){a(c).is(":visible")&&c.focus(),e=document.selection.createRange();if(f)e.move("character",d),e.select();else{var g=c.createTextRange(),h=g.duplicate();g.moveToBookmark(e.getBookmark()),h.setEndPoint("EndToStart",g),d=h.text.length}}else c.selectionStart!==b&&(f?(c.focus(),c.setSelectionRange(d,d)):d=c.selectionStart);return d}function B(a,b){return'<span unselectable="on" class="k-link"><span unselectable="on" class="k-icon k-arrow-'+a+'" title="'+b+'">'+b+"</span></span>"}var c=window.kendo,d=c.keys,e=c.ui,f=e.Widget,g=c.parseFloat,h=c.support.touch,i="change",j="disabled",k="k-input",l="spin",m="touchend",n=h?"touchstart":"mousedown",o=h?"touchmove "+m:"mouseup mouseleave",p="k-state-default",q="k-state-focused",r="k-state-hover",s="mouseenter mouseleave",t=".",u="k-state-selected",v="k-state-disabled",w=h?"number":"text",x=null,y=a.proxy,z={190:".",188:","},A=f.extend({init:function(a,d){var e=this,h=d&&d.step!==b,i,j,l,m,n;f.fn.init.call(e,a,d),d=e.options,a=e.element.addClass(k).bind({keydown:y(e._keydown,e),paste:y(e._paste,e),blur:y(e._focusout,e)}),a.closest("form").bind("reset",function(){setTimeout(function(){e.value(a[0].value)})}),e._wrapper(),e._arrows(),e._input(),e._text.focus(y(e._click,e)),i=g(a.attr("min")),j=g(a.attr("max")),l=g(a.attr("step")),d.min===x&&i!==x&&(d.min=i),d.max===x&&j!==x&&(d.max=j),!h&&l!==x&&(d.step=l),n=d.format,n.slice(0,3)==="{0:"&&(d.format=n.slice(3,n.length-1)),m=d.value,e.value(m!==x?m:a.val()),e.enable(!a.is("[disabled]")),c.notify(e)},options:{name:"NumericTextBox",decimals:x,min:x,max:x,value:x,step:1,format:"n",placeholder:"",upArrowText:"Increase value",downArrowText:"Decrease value"},events:[i,l],enable:function(a){var b=this,c=b._text.add(b.element),d=b._inputWrapper.unbind(s),e=b._upArrow.unbind(n),f=b._downArrow.unbind(n);b._toggleText(!0),a===!1?(d.removeClass(p).addClass(v),c.attr(j,j)):(d.addClass(p).removeClass(v).bind(s,b._toggleHover),c.removeAttr(j),e.bind(n,function(a){a.preventDefault(),b._spin(1),b._upArrow.addClass(u)}),f.bind(n,function(a){a.preventDefault(),b._spin(-1),b._downArrow.addClass(u)}))},value:function(a){var c=this,d;if(a===b)return c._value;a=g(a),d=c._adjust(a);a===d&&(c._update(a),c._old=c._value)},_adjust:function(a){var b=this,c=b.options,d=c.min,e=c.max;d!==x&&a<d?a=d:e!==x&&a>e&&(a=e);return a},_arrows:function(){var b=this,d,e=b.options,f=b.element;d=f.siblings(".k-icon"),d[0]||(d=a(B("up",e.upArrowText)+B("down",e.downArrowText)).insertAfter(f),d.wrapAll('<span class="k-select"/>')),d.bind(o,function(a){(!h||c.eventTarget(a)!=a.currentTarget||a.type===m)&&clearTimeout(b._spinning),d.removeClass(u)}),b._upArrow=d.eq(0),b._downArrow=d.eq(1)},_blur:function(){var a=this;a._toggleText(!0),a._change(a.element.val())},_click:function(a){var b=this;clearTimeout(b._focusing),b._focusing=setTimeout(function(){var c=a.target,d=C(c),e=c.value.substring(0,d),f=b._format(b.options.format),g=f[","],h=new RegExp("\\"+g,"g"),i=new RegExp("([\\d\\"+g+"]+)(\\"+f[t]+")?(\\d+)?"),j=i.exec(e),k=0;j&&(k=j[0].replace(h,"").length,e.indexOf("(")!=-1&&b._value<0&&k++),b._focusin(),C(b.element[0],k)})},_change:function(a){var b=this;b._update(a),a=b._value,b._old!=a&&(b._old=a,b.trigger(i),b.element.trigger(i))},_focusin:function(){var a=this;a._toggleText(!1),a.element.focus(),a._inputWrapper.addClass(q)},_focusout:function(){var a=this;clearTimeout(a._focusing),a._inputWrapper.removeClass(q),a._blur()},_format:function(a){var b=c.culture().numberFormat;a.toLowerCase().indexOf("c")>-1?b=b.currency:a.toLowerCase().indexOf("p")>-1&&(b=b.percent);return b},_input:function(){var b=this,c="k-formatted-value",d=b.element.show()[0],e=b.wrapper,f;f=e.find(t+c),f[0]||(f=a("<input />").insertBefore(d).addClass(c)),d.type=w,f[0].type="text",f[0].style.cssText=d.style.cssText,b._text=f.attr("readonly",!0).addClass(d.className)},_keydown:function(a){var b=this,c=a.keyCode;c==d.DOWN?b._step(-1):c==d.UP?b._step(1):c==d.ENTER&&b._change(b.element.val()),b._prevent(c)&&!a.ctrlKey&&a.preventDefault()},_paste:function(a){var b=this,c=a.target,d=c.value;setTimeout(function(){g(c.value)===x&&b._update(d)})},_prevent:function(a){var b=this,c=b.element[0],e=c.value,f=b.options,g=f.min,h=b._format(f.format),i=h[t],j=f.decimals,k=C(c),l=!0,m;j===x&&(j=h.decimals),a>16&&a<21||a>32&&a<37||a>47&&a<58||a>95&&a<106||a==d.INSERT||a==d.DELETE||a==d.LEFT||a==d.RIGHT||a==d.TAB||a==d.BACKSPACE||a==d.ENTER?l=!1:z[a]===i&&j>0&&e.indexOf(i)==-1?l=!1:!(g===x||g<0)||e.indexOf("-")!=-1||a!=189&&a!=109||k!==0?a==110&&j>0&&e.indexOf(i)==-1&&(m=e.substring(k),c.value=e.substring(0,k)+i+m):l=!1;return l},_spin:function(a,b){var c=this;b=b||500,clearTimeout(c._spinning),c._spinning=setTimeout(function(){c._spin(a,50)},b),c._step(a)},_step:function(a){var b=this,c=b.element,d=g(c.val())||0;document.activeElement!=c[0]&&b._focusin(),d+=b.options.step*g(a),b._update(b._adjust(d)),b.trigger(l)},_toggleHover:function(b){h||a(b.currentTarget).toggleClass(r,b.type==="mouseenter")},_toggleText:function(a){var b=this;a=!!a,b._text.toggle(a),b.element.toggle(!a)},_update:function(a){var b=this,d=b.options,e=d.format,f=d.decimals,h=b._format(e),i;f===x&&(f=h.decimals),a=g(a),i=a!==x,i&&(a=parseFloat(a.toFixed(f))),b._value=a=b._adjust(a),b._text.val(i?c.toString(a,e):d.placeholder),b.element.val(i?a.toString().replace(t,h[t]):"")},_wrapper:function(){var b=this,c=b.element,d;d=c.parents(".k-numerictextbox"),d.is("span.k-numerictextbox")||(d=c.hide().wrap('<span class="k-numeric-wrap k-state-default" />').parent(),d=d.wrap("<span/>").parent()),d[0].style.cssText=c[0].style.cssText,c[0].style.width="",b.wrapper=d.addClass("k-widget k-numerictextbox").show(),b._inputWrapper=a(d[0].firstChild)}});e.plugin(A)}(jQuery),function(a,b){function O(b){b=a(b),b.filter(".k-first:not(:first-child)").removeClass(t),b.filter(".k-last:not(:last-child)").removeClass(p),b.filter(":first-child").addClass(t),b.filter(":last-child").addClass(p)}function N(b){b=a(b),b.find(".k-icon").remove(),b.filter(":has(.k-group)").children(".k-link:not(:has([class*=k-arrow]))").each(function(){var b=a(this),c=b.parent().parent();b.append("<span class='k-icon "+(c.hasClass(n+"-horizontal")?"k-arrow-down":"k-arrow-next")+"'/>")})}function M(b){b=a(b),b.addClass("k-item").children(l).addClass(u),b.children("a").addClass(o).children(l).addClass(u),b.filter(":not([disabled])").addClass(A),b.filter(".k-separator:empty").append("&nbsp;"),b.filter("li[disabled]").addClass(B).removeAttr("disabled"),b.children("a:focus").parent().addClass("k-state-active"),b.children("."+o).length||b.contents().filter(function(){return!this.nodeName.match(k)&&(this.nodeType!=3||!!a.trim(this.nodeValue))}).wrapAll("<span class='"+o+"'/>"),N(b),O(b)}function L(b,c){try{return a.contains(b,c)}catch(d){return!1}}function K(a,b){a=a.split(" ")[!b+0]||a;var d={origin:["bottom","left"],position:["top","left"]},e=/left|right/.test(a);e?(d.origin=["top",a],d.position[1]=c.directions[a].reverse):(d.origin[0]=a,d.position[0]=c.directions[a].reverse),d.origin=d.origin.join(" "),d.position=d.position.join(" ");return d}function J(a,b){a=a.split(" ")[!b+0]||a;return a.replace("top","up").replace("bottom","down")}var c=window.kendo,d=c.ui,e=c.support.touch,f=a.extend,g=a.proxy,h=a.each,i=c.template,j=d.Widget,k=/^(ul|a|div)$/i,l="img",m="open",n="k-menu",o="k-link",p="k-last",q="close",r=e?"touchend":"click",s="timer",t="k-first",u="k-image",v="select",w="zIndex",x="mouseenter",y="mouseleave",z="kendoPopup",A="k-state-default",B="k-state-disabled",C=".k-group",D=".k-item",E=".k-item.k-state-disabled",F=".k-item:not(.k-state-disabled)",G=".k-item:not(.k-state-disabled) > .k-link",H={content:i("<div class='k-content k-group'>#= content(item) #</div>"),group:i("<ul class='#= groupCssClass(group) #'#= groupAttributes(group) #>#= renderItems(data) #</ul>"),itemWrapper:i("<#= tag(item) # class='#= textClass(item) #'#= textAttributes(item) #>#= image(item) ##= sprite(item) ##= text(item) ##= arrow(data) #</#= tag(item) #>"),item:i("<li class='#= wrapperCssClass(group, item) #'>#= itemWrapper(data) ## if (item.items) { ##= subGroup({ items: item.items, menu: menu, group: { expanded: item.expanded } }) ## } #</li>"),image:i("<img class='k-image' alt='' src='#= imageUrl #' />"),arrow:i("<span class='#= arrowClass(item, group) #'></span>"),sprite:i("<span class='k-sprite #= spriteCssClass #'></span>"),empty:i("")},I={wrapperCssClass:function(a,b){var c="k-item",d=b.index;b.enabled===!1?c+=" k-state-disabled":c+=" k-state-default",a.firstLevel&&d===0&&(c+=" k-first"),d==a.length-1&&(c+=" k-last");return c},textClass:function(a){return o},textAttributes:function(a){return a.url?" href='"+a.url+"'":""},arrowClass:function(a,b){var c="k-icon";b.horizontal?c+=" k-arrow-down":c+=" k-arrow-right";return c},text:function(a){return a.encoded===!1?a.text:c.htmlEncode(a.text)},tag:function(a){return a.url?"a":"span"},groupAttributes:function(a){return a.expanded!==!0?" style='display:none'":""},groupCssClass:function(a){return"k-group"},content:function(a){return a.content?a.content:"&nbsp;"}},P=j.extend({init:function(b,d){var f=this;j.fn.init.call(f,b,d),b=f.wrapper=f.element,d=f.options,d.dataSource&&(f.element.empty(),f.append(d.dataSource,b)),f._updateClasses(),d.animation===!1&&(d.animation={open:{show:!0,effects:{}},close:{hide:!0,effects:{}}}),f.nextItemZIndex=100,b.delegate(E,r,!1).delegate(F,r,g(f._click,f)),e?(d.openOnClick=!0,b.delegate(G,"touchstart touchend",f._toggleHover)):b.delegate(F,x,g(f._mouseenter,f)).delegate(F,y,g(f._mouseleave,f)).delegate(G,x+" "+y,f._toggleHover),a(document).click(g(f._documentClick,f)),f.clicked=!1,c.notify(f)},events:[m,q,v],options:{name:"Menu",animation:{open:{duration:200,show:!0},close:{duration:100}},orientation:"horizontal",direction:"default",openOnClick:!1,closeOnClick:!0,hoverDelay:100},enable:function(a,b){this._toggleDisabled(a,b!==!1);return this},disable:function(a){this._toggleDisabled(a,!1);return this},append:function(b,c){c=this.element.find(c);var d=this._insert(b,c,c.length?c.find("> .k-group, .k-animation-container > .k-group"):null);h(d.items,function(b){d.group.append(this);var c=d.contents[b];c&&a(this).append(c),N(this)}),N(c),O(d.group.find(".k-first, .k-last").add(d.items));return this},insertBefore:function(b,c){c=this.element.find(c);var d=this._insert(b,c,c.parent());h(d.items,function(b){c.before(this);var e=d.contents[b];e&&a(this).append(e),N(this),O(this)}),O(c);return this},insertAfter:function(b,c){c=this.element.find(c);var d=this._insert(b,c,c.parent());h(d.items,function(b){c.after(this);var e=d.contents[b];e&&a(this).append(e),N(this),O(this)}),O(c);return this},_insert:function(b,c,d){var e=this,g,h,i=[];if(!c||!c.length)d=e.element;var j=a.isPlainObject(b),k={firstLevel:d.hasClass(n),horizontal:d.hasClass(n+"-horizontal"),expanded:!0,length:d.children().length};c&&!d.length&&(d=a(P.renderGroup({group:k})).appendTo(c)),j||a.isArray(b)?(g=a.map(j?[b]:b,function(b,c){return typeof b=="string"?a(b):a(P.renderItem({group:k,item:f(b,{index:c})}))}),i=a.map(j?[b]:b,function(b,c){return b.content||b.contentUrl?a(P.renderContent({item:f(b,{index:c})})):!1})):(g=a(b),h=g.find("> ul").addClass("k-group"),g=g.filter("li"),g.add(h.find("> li")).each(function(){M(this)}));return{items:g,group:d,contents:i}},remove:function(a){a=this.element.find(a);var b=this,c=a.parentsUntil(b.element,D),d=a.parent("ul");a.remove();if(d&&!d.children(D).length){var e=d.parent(".k-animation-container");e.length?e.remove():d.remove()}c.length&&(c=c.eq(0),N(c),O(c));return b},open:function(c){var d=this,e=d.options,g=e.orientation=="horizontal",h=e.direction;c=d.element.find(c),/^(top|bottom|default)$/.test(h)&&(h=g?(h+" right").replace("default","bottom"):"right"),c.each(function(){var c=a(this);clearTimeout(c.data(s)),c.data(s,setTimeout(function(){var a=c.find(".k-group:first:hidden"),i;if(a[0]&&d.trigger(m,{item:c[0]})===!1){c.data(w,c.css(w)),c.css(w,d.nextItemZIndex++),i=a.data(z);var j=c.parent().hasClass(n),k=j&&g,l=K(h,j),o=e.animation.open.effects,p=o!==b?o:"slideIn:"+J(h,j);i?(i=a.data(z),i.options.origin=l.origin,i.options.position=l.position,i.options.animation.open.effects=p):i=a.kendoPopup({origin:l.origin,position:l.position,collision:e.popupCollision!==b?e.popupCollision:k?"fit":"fit flip",anchor:c,appendTo:c,animation:{open:f(!0,{effects:p},e.animation.open),close:e.animation.close}}).data(z),i.open()}},d.options.hoverDelay))});return d},close:function(b){var c=this;b=c.element.find(b),b.each(function(){var b=a(this);clearTimeout(b.data(s)),b.data(s,setTimeout(function(){var a=b.find(".k-group:first:visible"),d;a[0]&&c.trigger(q,{item:b[0]})===!1&&(b.css(w,b.data(w)),b.removeData(w),d=a.data(z),d.close())},c.options.hoverDelay))});return c},_toggleDisabled:function(b,c){b=this.element.find(b),b.each(function(){a(this).toggleClass(A,c).toggleClass(B,!c)})},_toggleHover:function(b){var d=a(c.eventTarget(b)).closest(D);d.parents("li."+B).length||d.toggleClass("k-state-hover",b.type==x||b.type=="touchstart")},_updateClasses:function(){var a=this;a.element.addClass("k-widget k-reset k-header "+n).addClass(n+"-"+a.options.orientation);var b=a.element.find("li > ul").addClass("k-group").end().find("> li,.k-group > li");b.each(function(){M(this)})},_mouseenter:function(b){var c=this,d=a(b.currentTarget),e=d.children(".k-animation-container").length||d.children(C).length;(!c.options.openOnClick||c.clicked)&&!L(b.currentTarget,b.relatedTarget)&&e&&c.open(d),c.options.openOnClick&&c.clicked&&d.siblings().each(g(function(a,b){c.close(b)},c))},_mouseleave:function(b){var c=this,d=a(b.currentTarget),e=d.children(".k-animation-container").length||d.children(C).length;!c.options.openOnClick&&!L(b.currentTarget,b.relatedTarget)&&e&&c.close(d)},_click:function(b){var d=this,f,h=a(c.eventTarget(b)),i=h.closest("."+o),j=i.attr("href"),k=h.closest(D),l=!!j&&j.charAt(j.length-1)!="#";if(k.hasClass(B))b.preventDefault();else{e&&k.siblings().each(g(function(a,b){d.close(b)},d)),b.handled||d.trigger(v,{item:k[0]}),b.handled=!0,d.options.closeOnClick&&!(j&&j.length>0)&&!k.children(C+",.k-animation-container").length&&d.close(i.parentsUntil(d.element,D));if((!k.parent().hasClass(n)||!d.options.openOnClick)&&!e)return;l||b.preventDefault(),d.clicked=!0,f=k.children(".k-animation-container, .k-group").is(":visible")?q:m,d[f](k)}},_documentClick:function(a){var b=this;L(b.element[0],a.target)||b.clicked&&(b.clicked=!1,b.close(b.element.find(".k-item>.k-animation-container:visible").parent()))}});f(P,{renderItem:function(a){a=f({menu:{},group:{}},a);var b=H.empty,c=a.item;return H.item(f(a,{image:c.imageUrl?H.image:b,sprite:c.spriteCssClass?H.sprite:b,itemWrapper:H.itemWrapper,arrow:c.items||c.content?H.arrow:b,subGroup:P.renderGroup},I))},renderGroup:function(a){return H.group(f({renderItems:function(a){var b="",c=0,d=a.items,e=d?d.length:0,g=f({length:e},a.group);for(;c<e;c++)b+=P.renderItem(f(a,{group:g,item:f({index:c},d[c])}));return b}},a,I))},renderContent:function(a){return H.content(f(a,I))}}),c.ui.plugin(P)}(jQuery),function(a,b){function n(a){var b=(a.model.fields||a.model)[a.field],d=m(b),e=b.validation,f,j=c.attr("type"),k=c.attr("bind"),n,o={name:a.field};for(f in e)n=e[f],i(f,l)>=0?o[j]=f:g(n)||(o[f]=h(n)?n.value||f:n),o[c.attr(f+"-msg")]=n.message;i(d,l)>=0&&(o[j]=d),o[k]=(d==="boolean"?"checked:":"value:")+a.field;return o}function m(b){return b.type||a.type(b)||"string"}var c=window.kendo,d=c.ui,e=d.Widget,f=a.extend,g=a.isFunction,h=a.isPlainObject,i=a.inArray,j='<div class="k-widget k-tooltip k-tooltip-validation" style="margin:0.5em"><span class="k-icon k-warning"> </span>${message}<div class="k-callout k-callout-n"></div></div>',k="change",l=["url","email","number","date","boolean"],o={number:function(b,d){var e=n(d);a('<input type="text"/>').attr(e).appendTo(b).kendoNumericTextBox({format:d.format}),a("<span "+c.attr("for")+'="'+d.field+'" class="k-invalid-msg"/>').hide().appendTo(b)},date:function(b,d){var e=n(d);e[c.attr("format")]=d.format,a('<input type="text"/>').attr(e).appendTo(b).kendoDatePicker({format:d.format}),a("<span "+c.attr("for")+'="'+d.field+'" class="k-invalid-msg"/>').hide().appendTo(b)},string:function(b,c){var d=n(c);a('<input type="text" class="k-input k-textbox"/>').attr(d).appendTo(b)},"boolean":function(b,c){var d=n(c);a('<input type="checkbox" />').attr(d).appendTo(b)}},p=e.extend({init:function(b,c){var d=this;e.fn.init.call(d,b,c),d._validateProxy=a.proxy(d._validate,d),d.refresh()},events:[k],options:{name:"Editable",editors:o,clearContainer:!0,errorTemplate:j},editor:function(b,d){var e=this,g=e.options.editors,i=h(b),j=i?b.field:b,k=e.options.model||{},l=m(d),n=i&&b.editor,o=n?b.editor:g[l],p=e.element.find("[data-container-for="+j+"]");o=o?o:g.string,d&&(p=p.length?p:e.element,o(p,f(!0,{},i?b:{field:j},{model:k})),n&&p.find(":input:not(:button), select").each(function(){var b=c.attr("bind"),d=this.getAttribute(b)||"";d.indexOf("value:")===-1&&(d+=",value:"+j,a(this).attr(b,d))}))},_validate:function(b){var d=this,e=typeof b.value=="boolean",f,g=d._validationEventInProgress,h={};h[b.field]=b.value,f=a(":input["+c.attr("bind")+'="'+(e?"checked:":"value:")+b.field+'"]',d.element);try{d._validationEventInProgress=!0,(!d.validatable.validateInput(f)||!g&&d.trigger(k,{values:h}))&&b.preventDefault()}finally{d._validationEventInProgress=!1}},end:function(){return this.validatable.validate()},destroy:function(){this.options.model.unbind("set",this._validateProxy),c.unbind(this.element),this.element.removeData("kendoValidator").removeData("kendoEditable")},refresh:function(){var d=this,e,f,i=d.options.fields||[],j=d.options.clearContainer?d.element.empty():d.element,k=d.options.model||{},l={};a.isArray(i)||(i=[i]);for(e=0,f=i.length;e<f;e++){var m=i[e],n=h(m),o=n?m.field:m,p=(k.fields||k)[o],q=p?p.validation||{}:{};for(var r in q)g(q[r])&&(l[r]=q[r]);d.editor(m,p)}c.bind(j,d.options.model),d.options.model.bind("set",d._validateProxy),d.validatable=j.kendoValidator({validateOnBlur:!1,errorTemplate:d.options.errorTemplate||b,rules:l}).data("kendoValidator"),j.find(":input:visible:first").focus()}});d.plugin(p)}(jQuery),function(a,b){function r(b){var c={},d,e,f,g,h,i,j,k,l;for(d=0,e=b.length;d<e;d++){g=b[d].name.split(/[\.\[\]]+/),g=a.grep(g,q),i=b[d].value,j=c,l=c;for(h=0;h<g.length-1;h++)f=g[h],isNaN(f)||(k=g[h-1],a.isArray(l[k])||(j=l[k]=[])),l=j,j=j[f]=j[f]||{};j[g[h]]=i}return c}function q(a){return a}function p(a,b){var c=a.data(e)||a.data(f)||a.data(g);c?c.value(b):a.is(":radio")?a.filter("[value="+b+"]").attr("checked","checked"):a.val(b)}function o(b,c){b.filters&&(b.filters=a.grep(b.filters,function(a){o(a,c);return a.filters?a.filters.length:a.field!=c}))}var c=window.kendo,d=c.ui,e="kendoDropDownList",f="kendoNumericTextBox",g="kendoDatePicker",h=a.proxy,i="kendoPopup",j="Is equal to",k="Is not equal to",l=d.Widget,m='<div><input type="hidden" name="filters[0].field" value="#=field#"/><input type="hidden" name="filters[0].operator" value="eq"/><div class="k-filter-help-text">#=messages.info#</div><label>#=messages.isTrue#<input type="radio" name="filters[0].value" value="true"/></label><label>#=messages.isFalse#<input type="radio" name="filters[0].value" value="false"/></label><button type="submit" class="k-button">#=messages.filter#</button><button type="reset" class="k-button">#=messages.clear#</button></div>',n='<div><input type="hidden" name="filters[0].field" value="#=field#"/>#if(extra){#<input type="hidden" name="filters[1].field" value="#=field#"/>#}#<div class="k-filter-help-text">#=messages.info#</div><select name="filters[0].operator">#for(var op in operators){#<option value="#=op#">#=operators[op]#</option>#}#</select><input name="filters[0].value" class="k-textbox" type="text" data-#=ns#type="#=type#"/>#if(extra){#<select name="logic" class="k-filter-and"><option value="and">And</option><option value="or">Or</option></select><select name="filters[1].operator">#for(var op in operators){#<option value="#=op#">#=operators[op]#</option>#}#</select><input name="filters[1].value" class="k-textbox" type="text" data-#=ns#type="#=type#"/>#}#<button type="submit" class="k-button">#=messages.filter#</button><button type="reset" class="k-button">#=messages.clear#</button></div>',s=l.extend({init:function(b,d){var j=this,k="string",o,p,q;l.fn.init.call(j,b,d),q=d.operators||{},b=j.element,d=j.options,o=b.addClass("k-filterable").find("k-grid-filter"),o[0]||(o=b.prepend('<a class="k-grid-filter" href="#"><span class="k-icon k-filter"/></a>').find(".k-grid-filter")),o.click(h(j._click,j)),j.dataSource=d.dataSource.bind("change",h(j.refresh,j)),j.field=b.attr(c.attr("field")),j.model=j.dataSource.reader.model,j._parse=function(a){return a+""},j.model&&j.model.fields&&(p=j.model.fields[j.field],p&&(k=p.type,j._parse=h(p.parse,p))),q=q[k]||d.operators[k],j.form=a('<form class="k-filter-menu k-group"/>'),j.form.html(c.template(k==="boolean"?m:n)({field:j.field,ns:c.ns,messages:d.messages,extra:d.extra,operators:q,type:k})),j.popup=j.form[i]({anchor:o,open:h(j._open,j)}).data(i),j.link=o,j.form.bind({submit:h(j._submit,j),reset:h(j._reset,j)}).find("select")[e]().end().find("["+c.attr("type")+"=number]")[f]().parent().children().removeClass("k-textbox").end().end().end().find("["+c.attr("type")+"=date]")[g]().removeClass("k-textbox"),j.refresh()},refresh:function(){var a=this,b=a.dataSource.filter()||{filters:[],logic:"and"};a._populateForm(b)?a.link.addClass("k-state-active"):a.link.removeClass("k-state-active")},_populateForm:function(a){var b=this,c=a.filters,d,e,f=b.form,g=!1,h=0,i;for(d=0,e=c.length;d<e;d++)i=c[d],i.field==b.field?(p(f.find("[name='filters["+h+"].value']"),b._parse(i.value)),p(f.find("[name='filters["+h+"].operator']"),i.operator),p(f.find("[name=logic]"),a.logic),h++,g=!0):i.filters&&(g=g||b._populateForm(i));return g},_merge:function(b){var c=this,d=b.logic||"and",e=b.filters,f,g=c.dataSource.filter()||{filters:[],logic:"and"},h,i;o(g,c.field),e=a.grep(e,function(a){return a.value!==""});for(h=0,i=e.length;h<i;h++)f=e[h],f.value=c._parse(f.value);e.length&&(g.filters.length?(b.filters=e,g.logic!=="and"&&(g.filters=[{logic:g.logic,filters:g.filters}],g.logic="and"),e.length>1?g.filters.push(b):g.filters.push(e[0])):(g.filters=e,g.logic=d));return g},filter:function(a){a=this._merge(a),a.filters.length&&this.dataSource.filter(a)},clear:function(){var b=this,c=b.dataSource.filter()||{filters:[]};c.filters=a.grep(c.filters,function(c){if(c.filters){c.filters=a.grep(c.filters,function(a){return a.field!=b.field});return c.filters.length}return c.field!=b.field}),c.filters.length||(c=null),b.dataSource.filter(c)},_submit:function(a){var b=this;a.preventDefault(),b.filter(r(b.form.serializeArray())),b.popup.close()},_reset:function(a){this.clear(),this.popup.close()},_click:function(a){a.preventDefault(),a.stopPropagation(),this.popup.toggle()},_open:function(){a(".k-filter-menu").not(this.form).each(function(){a(this).data(i).close()})},options:{name:"FilterMenu",extra:!0,type:"string",operators:{string:{eq:j,neq:k,startswith:"Starts with",contains:"Contains",endswith:"Ends with"},number:{eq:j,neq:k,gte:"Is greater than or equal to",gt:"Is greater than",lte:"Is less than or equal to",lt:"Is less than"},date:{eq:j,neq:k,gte:"Is after or equal to",gt:"Is after",lte:"Is before or equal to",lt:"Is before"}},messages:{info:"Show rows with value that:",isTrue:"is true",isFalse:"is false",filter:"Filter",clear:"Clear"}}});d.plugin(s)}(jQuery),function(a,b){function R(b){b=a(b),b.filter(".k-first:not(:first-child)").removeClass(r),b.filter(".k-last:not(:last-child)").removeClass(l),b.filter(":first-child").addClass(r),b.filter(":last-child").addClass(l)}function Q(b){b=a(b),b.children(".k-link").children(".k-icon").remove(),b.filter(":has(.k-panel),:has(.k-content)").children(".k-link:not(:has([class*=k-arrow]))").each(function(){var b=a(this),c=b.parent();b.append("<span class='k-icon "+(c.hasClass(B.substr(1))?"k-arrow-up k-panelbar-collapse":"k-arrow-down k-panelbar-expand")+"'/>")})}function P(b,c){b=a(b).addClass("k-item"),b.children(j).addClass(q),b.children("a").addClass(m).children(j).addClass(q),b.filter(":not([disabled]):not([class*=k-state])").addClass("k-state-default"),b.filter("li[disabled]").addClass("k-state-disabled").removeAttr("disabled"),b.filter(":not([class*=k-state])").children("a:focus").parent().addClass(B.substr(1)),b.find(">div").addClass(u).css({display:"none"}),b.each(function(){var b=a(this);b.children("."+m).length||b.contents().filter(function(){return!this.nodeName.match(i)&&(this.nodeType!=3||!!a.trim(this.nodeValue))}).wrapAll("<span class='"+m+"'/>")}),c.find(" > li > ."+m).addClass("k-header")}var c=window.kendo,d=c.ui,e=a.extend,f=a.each,g=c.template,h=d.Widget,i=/^(ul|a|div)$/i,j="img",k="href",l="k-last",m="k-link",n="error",o="click",p=".k-item",q="k-image",r="k-first",s="expand",t="select",u="k-content",v="activate",w="collapse",x="contentUrl",y="mouseenter",z="mouseleave",A="contentLoad",B=".k-state-active",C="> .k-panel",D="> .k-content",E=".k-state-selected",F=".k-state-disabled",G=".k-state-highlighted",H=p+":not(.k-state-disabled) .k-link",I=p+".k-state-disabled .k-link",J="k-state-default",K=":visible",L=":empty",M="single",N={content:g("<div class='k-content'#= contentAttributes(data) #>#= content(item) #</div>"),group:g("<ul class='#= groupCssClass(group) #'#= groupAttributes(group) #>#= renderItems(data) #</ul>"),itemWrapper:g("<#= tag(item) # class='#= textClass(item, group) #'#= contentUrl(item) ##= textAttributes(item) #>#= image(item) ##= sprite(item) ##= text(item) ##= arrow(data) #</#= tag(item) #>"),item:g("<li class='#= wrapperCssClass(group, item) #'>#= itemWrapper(data) ## if (item.items) { ##= subGroup({ items: item.items, panelBar: panelBar, group: { expanded: item.expanded } }) ## } #</li>"),image:g("<img class='k-image' alt='' src='#= imageUrl #' />"),arrow:g("<span class='#= arrowClass(item) #'></span>"),sprite:g("<span class='k-sprite #= spriteCssClass #'></span>"),empty:g("")},O={wrapperCssClass:function(a,b){var c="k-item",d=b.index;b.enabled===!1?c+=" k-state-disabled":b.expanded===!0?c+=" k-state-active":c+=" k-state-default",d===0&&(c+=" k-first"),d==a.length-1&&(c+=" k-last");return c},textClass:function(a,b){var c=m;b.firstLevel&&(c+=" k-header");return c},textAttributes:function(a){return a.url?" href='"+a.url+"'":""},arrowClass:function(a){var b="k-icon";b+=a.expanded?" k-arrow-up k-panelbar-collapse":" k-arrow-down k-panelbar-expand";return b},text:function(a){return a.encoded===!1?a.text:c.htmlEncode(a.text)},tag:function(a){return a.url?"a":"span"},groupAttributes:function(a){return a.expanded!==!0?" style='display:none'":""},groupCssClass:function(a){return"k-group k-panel"},contentAttributes:function(a){return a.item.expanded!==!0?" style='display:none'":""},content:function(a){return a.content?a.content:a.contentUrl?"":"&nbsp;"},contentUrl:function(a){return a.contentUrl?c.attr("content-url")+'="'+a.contentUrl+'"':""}},S=h.extend({init:function(b,d){var e=this,f;h.fn.init.call(e,b,d),b=e.wrapper=e.element,d=e.options,d.dataSource&&(e.element.empty(),e.append(d.dataSource,b)),e._updateClasses(),d.animation===!1&&(d.animation={expand:{show:!0,effects:{}},collapse:{hide:!0,effects:{}}}),b.delegate(H,o,a.proxy(e._click,e)).delegate(H,y+" "+z,e._toggleHover).delegate(I,o,!1),d.contentUrls&&b.find("> .k-item").each(function(b,c){a(c).find("."+m).data(x,d.contentUrls[b])}),f=b.find("li"+B+" > ."+u),f.length>0&&e.expand(f.parent(),!1),c.notify(e)},events:[s,w,t,v,n,A],options:{name:"PanelBar",animation:{expand:{effects:"expand:vertical",duration:200,show:!0},collapse:{duration:200}},expandMode:"multiple"},expand:function(b,c){var d=this,e={};c=c!==!1,b=this.element.find(b),b.each(function(f,g){g=a(g);var h=g.find(C).add(g.find(D));if(!g.hasClass(F)&&h.length>0){if(d.options.expandMode==M&&d._collapseAllExpanded(g))return d;b.find(G).removeClass(G.substr(1)),g.addClass(G.substr(1)),c||(e=d.options.animation,d.options.animation={expand:{show:!0,effects:{}},collapse:{hide:!0,effects:{}}}),d._triggerEvent(s,g)||d._toggleItem(g,!1,null),c||(d.options.animation=e)}});return d},collapse:function(b,c){var d=this,e={};c=c!==!1,b=d.element.find(b),b.each(function(b,f){f=a(f);var g=f.find(C).add(f.find(D));!f.hasClass(F)&&g.is(K)&&(f.removeClass(G.substr(1)),c||(e=d.options.animation,d.options.animation={expand:{show:!0,effects:{}},collapse:{hide:!0,effects:{}}}),d._triggerEvent(w,f)||d._toggleItem(f,!0,null),c||(d.options.animation=e))});return d},_toggleDisabled:function(a,b){a=this.element.find(a),a.toggleClass(J,b).toggleClass(F.substr(1),!b)},select:function(b){var c=this;b=c.element.find(b);if(arguments.length===0)return c.element.find(".k-item > "+E).parent();b.each(function(b,d){d=a(d);var e=d.children("."+m);if(d.is(F))return c;a(E,c.element).removeClass(E.substr(1)),a(G,c.element).removeClass(G.substr(1)),e.addClass(E.substr(1)),e.parentsUntil(c.element,p).filter(":has(.k-header)").addClass(G.substr(1))});return c},enable:function(a,b){this._toggleDisabled(a,b!==!1);return this},disable:function(a){this._toggleDisabled(a,!1);return this},append:function(b,c){c=this.element.find(c);var d=this._insert(b,c,c.length?c.find(C):null);f(d.items,function(b){d.group.append(this);var c=d.contents[b];c&&a(this).append(c),R(this)}),Q(c),R(d.group.find(".k-first, .k-last")),d.group.height("auto");return this},insertBefore:function(b,c){c=this.element.find(c);var d=this._insert(b,c,c.parent());f(d.items,function(b){c.before(this);var e=d.contents[b];e&&a(this).append(e),R(this)}),R(c),d.group.height("auto");return this},insertAfter:function(b,c){c=this.element.find(c);var d=this._insert(b,c,c.parent());f(d.items,function(b){c.after(this);var e=d.contents[b];e&&a(this).append(e),R(this)}),R(c),d.group.height("auto");return this},remove:function(a){a=this.element.find(a);var b=this,c=a.parentsUntil(b.element,p),d=a.parent("ul");a.remove(),d&&!d.hasClass("k-panelbar")&&!d.children(p).length&&d.remove(),c.length&&(c=c.eq(0),Q(c),R(c));return b},reload:function(b){var c=this;b=c.element.find(b),b.each(function(){var b=a(this);c._ajaxRequest(b,b.children("."+u),!b.is(K))})},_insert:function(b,c,d){var f=this,g,h=[];if(!c||!c.length)d=f.element;var i=a.isPlainObject(b),j={firstLevel:d.hasClass("k-panelbar"),expanded:d.parent().hasClass("k-state-active"),length:d.children().length};c&&!d.length&&(d=a(S.renderGroup({group:j})).appendTo(c)),i||a.isArray(b)?(g=a.map(i?[b]:b,function(b,c){return typeof b=="string"?a(b):a(S.renderItem({group:j,item:e(b,{index:c})}))}),h=a.map(i?[b]:b,function(b,c){return b.content||b.contentUrl?a(S.renderContent({item:e(b,{index:c})})):!1})):(g=a(b),P(g,f.element));return{items:g,group:d,contents:h}},_toggleHover:function(b){var c=a(b.currentTarget);c.parents("li"+F).length||c.toggleClass("k-state-hover",b.type==y)},_updateClasses:function(){var b=this;b.element.addClass("k-widget k-reset k-header k-panelbar");var c=b.element.find("li > ul").not(function(){return a(this).parentsUntil(".k-panelbar","div").length}).addClass("k-group k-panel").add(b.element),d=c.find("> li:not("+B+") > ul").css({display:"none"}).end().find("> li");d.each(function(){P(this,b.element)}),Q(d),R(d)},_click:function(b){var c=this,d=a(b.currentTarget),e=c.element;if(!d.parents("li"+F).length){if(d.closest(".k-widget")[0]!=e[0])return;var f=d.closest("."+m),g=f.closest(p);a(E,e).removeClass(E.substr(1)),a(G,e).removeClass(G.substr(1)),f.addClass(E.substr(1)),f.parentsUntil(c.element,p).filter(":has(.k-header)").addClass(G.substr(1));var h=g.find(C).add(g.find(D)),i=f.attr(k),j=f.data(x)||i&&(i.charAt(i.length-1)=="#"||i.indexOf("#"+c.element[0].id+"-")!=-1);if(h.data("animating"))return;c._triggerEvent(t,g)&&b.preventDefault();if(j||h.length)b.preventDefault();else return;if(c.options.expandMode==M&&c._collapseAllExpanded(g))return;if(h.length){var l=h.is(K);c._triggerEvent(l?w:s,g)||c._toggleItem(g,l,b)}}},_toggleItem:function(a,b,c){var d=this,e=a.find(C);if(e.length)this._toggleGroup(e,b),c&&c.preventDefault();else{var f=a.find("> ."+u);f.length&&(c&&c.preventDefault(),f.is(L)?d._ajaxRequest(a,f,b):d._toggleGroup(f,b))}},_toggleGroup:function(a,b){var c=this,d=c.options.animation,f=d.expand,g=e({},d.collapse),h=g&&"effects"in g;a.is(K)==b&&(b&&a.css("height",a.height()),a.css("height"),a.parent().toggleClass(J,b).toggleClass(B.substr(1),!b).find("> .k-link > .k-icon").toggleClass("k-arrow-up",!b).toggleClass("k-panelbar-collapse",!b).toggleClass("k-arrow-down",b).toggleClass("k-panelbar-expand",b),b?f=e(h?g:e({reverse:!0},f),{show:!1,hide:!0}):f=e({complete:function(a){c._triggerEvent(v,a.closest(p))}},f),a.kendoStop(!0,!0).kendoAnimate(f))},_collapseAllExpanded:function(b){var c=this,d,e=!1;if(b.find("> ."+m).hasClass("k-header")){var f=b.find(C).add(b.find(D));f.is(K)&&(e=!0),!f.is(K)&&f.length!==0&&(d=a(c.element).children(),d.find(C).add(d.find(D)).filter(function(){return a(this).is(K)}).each(function(b,d){d=a(d),e=c._triggerEvent(w,d.closest(p)),e||c._toggleGroup(d,!0)}));return e}},_ajaxRequest:function(b,c,d){var e=this,f=b.find(".k-panelbar-collapse, .k-panelbar-expand"),g=b.find("."+m),h=setTimeout(function(){f.addClass("k-loading")},100),i={};a.ajax({type:"GET",cache:!1,url:g.data(x)||g.attr(k),dataType:"html",data:i,error:function(a,b){f.removeClass("k-loading"),e.trigger(n,{xhr:a,status:b})&&this.complete()},complete:function(){clearTimeout(h),f.removeClass("k-loading")},success:function(a,f){c.html(a),e._toggleGroup(c,d),e.trigger(A,{item:b[0],contentElement:c[0]})}})},_triggerEvent:function(a,b){var c=this;return c.trigger(a,{item:b[0]})}});e(S,{renderItem:function(a){a=e({panelBar:{},group:{}},a);var b=N.empty,c=a.item;return N.item(e(a,{image:c.imageUrl?N.image:b,sprite:c.spriteCssClass?N.sprite:b,itemWrapper:N.itemWrapper,arrow:c.items||c.content||c.contentUrl?N.arrow:b,subGroup:S.renderGroup},O))},renderGroup:function(a){return N.group(e({renderItems:function(a){var b="",c=0,d=a.items,f=d?d.length:0,g=e({length:f},a.group);for(;c<f;c++)b+=S.renderItem(e(a,{group:g,item:e({index:c},d[c])}));return b}},a,O))},renderContent:function(a){return N.content(e(a,O))}}),c.ui.plugin(S)}(jQuery),function(a,b){function M(a){var b=a.children(".k-item");b.filter(".k-first:not(:first-child)").removeClass(t),b.filter(".k-last:not(:last-child)").removeClass(o),b.filter(":first-child").addClass(t),b.filter(":last-child").addClass(o)}function L(b){b.children(l).addClass(s),b.children("a").addClass(n).children(l).addClass(s),b.filter(":not([disabled]):not([class*=k-state-disabled])").addClass(F),b.filter("li[disabled]").addClass(E).removeAttr("disabled"),b.filter(":not([class*=k-state])").children("a:focus").parent().addClass(G+" "+I),b.each(function(){var b=a(this);b.children("."+n).length||b.contents().filter(function(){return!this.nodeName.match(k)&&(this.nodeType!=3||!!g(this.nodeValue))}).wrapAll("<a class='"+n+"'/>")})}var c=window.kendo,d=c.ui,e=a.map,f=a.each,g=a.trim,h=a.extend,i=c.template,j=d.Widget,k=/^(a|div)$/i,l="img",m="href",n="k-link",o="k-last",p="click",q="error",r=":empty",s="k-image",t="k-first",u="select",v="activate",w="k-content",x="contentUrl",y="mouseenter",z="mouseleave",A="contentLoad",B=".k-tabstrip-items > .k-item:not(.k-state-disabled)",C=".k-tabstrip-items > .k-item:not(.k-state-disabled):not(.k-state-active)",D=".k-tabstrip-items > .k-state-disabled .k-link",E="k-state-disabled",F="k-state-default",G="k-state-active",H="k-state-hover",I="k-tab-on-top",J={content:i("<div class='k-content'#= contentAttributes(data) #>#= content(item) #</div>"),itemWrapper:i("<#= tag(item) # class='k-link'#= contentUrl(item) ##= textAttributes(item) #>#= image(item) ##= sprite(item) ##= text(item) #</#= tag(item) #>"),item:i("<li class='#= wrapperCssClass(group, item) #'>#= itemWrapper(data) #</li>"),image:i("<img class='k-image' alt='' src='#= imageUrl #' />"),sprite:i("<span class='k-sprite #= spriteCssClass #'></span>"),empty:i("")},K={wrapperCssClass:function(a,b){var c="k-item",d=b.index;b.enabled===!1?c+=" k-state-disabled":c+=" k-state-default",d===0&&(c+=" k-first"),d==a.length-1&&(c+=" k-last");return c},textAttributes:function(a){return a.url?" href='"+a.url+"'":""},text:function(a){return a.encoded===!1?a.text:c.htmlEncode(a.text)},tag:function(a){return a.url?"a":"span"},contentAttributes:function(a){return a.active!==!0?" style='display:none'":""},content:function(a){return a.content?a.content:a.contentUrl?"":"&nbsp;"},contentUrl:function(a){return a.contentUrl?c.attr("content-url")+'="'+a.contentUrl+'"':""}},N=j.extend({init:function(b,d){var e=this;e._animations(d),j.fn.init.call(e,b,d),e.element.is("ul")?e.wrapper=e.element.wrapAll("<div />").parent():e.wrapper=e.element,d=e.options,e.wrapper.delegate(B,p,a.proxy(e._click,e)).delegate(C,y+" "+z,e._toggleHover).delegate(D,p,!1),e._updateClasses(),e._dataSource(),d.dataSource&&e.dataSource.fetch(),e.options.contentUrls&&e.wrapper.find(".k-tabstrip-items > .k-item").each(function(b,c){a(c).find(">."+n).data(x,e.options.contentUrls[b])});var f=e.wrapper.find("li."+G),g=a(e.contentElement(f.parent().children().index(f)));g.length>0&&g[0].childNodes.length===0&&e.activateTab(f.eq(0)),c.notify(e)},_dataSource:function(){var b=this;b.dataSource&&b._refreshHandler?b.dataSource.unbind("change",b._refreshHandler):b._refreshHandler=a.proxy(b.refresh,b),b.dataSource=c.data.DataSource.create(b.options.dataSource).bind("change",b._refreshHandler)},setDataSource:function(a){this.options.dataSource=a,this._dataSource(),a.fetch()},_animations:function(a){a&&"animation"in a&&!a.animation&&(a.animation={open:{effects:{},show:!0},close:{effects:{}}})},refresh:function(a){var b=this,d=b.options,e=c.getter(d.dataTextField),f=c.getter(d.dataContentField),g=c.getter(d.dataContentUrlField),h=c.getter(d.dataImageUrlField),i=c.getter(d.dataUrlField),j=c.getter(d.dataSpriteCssClass),k,l=[],m,n,o=b.dataSource.view(),p;a=a||{},n=a.action,n&&(o=a.items);for(k=0,p=o.length;k<p;k++)m={text:e(o[k])},d.dataContentField&&(m.content=f(o[k])),d.dataContentUrlField&&(m.contentUrl=g(o[k])),d.dataUrlField&&(m.url=i(o[k])),d.dataImageUrlField&&(m.imageUrl=h(o[k])),d.dataSpriteCssClass&&(m.spriteCssClass=j(o[k])),l[k]=m;if(a.action=="add")a.index<b.tabGroup.children().length?b.insertBefore(l,b.tabGroup.children().eq(a.index)):b.append(l);else if(a.action=="remove")for(k=0;k<o.length;k++)b.remove(a.index);else a.action=="itemchange"?(k=b.dataSource.view().indexOf(o[0]),a.field===d.dataTextField&&b.tabGroup.children().eq(k).find(".k-link").text(o[0].get(a.field))):(b.trigger("dataBinding"),b.append(l),b.trigger("dataBound"))},value:function(c){var d=this;if(c!==b)c!=d.value()&&d.tabGroup.children().each(function(){a.trim(a(this).text())==c&&d.select(this)});else return d.select().text()},items:function(){return this.tabGroup[0].children},setOptions:function(a){var b=this.options.animation;this._animations(a),a.animation=h(!0,b,a.animation),j.fn.setOptions.call(this,a)},events:[u,v,q,A,"change","dataBinding","dataBound"],options:{name:"TabStrip",dataTextField:"",dataContentField:"",dataImageUrlField:"",dataUrlField:"",dataSpriteCssClass:"",dataContentUrlField:"",animation:{open:{effects:"expand:vertical fadeIn",duration:200,show:!0},close:{duration:200}},collapsible:!1},select:function(b){var c=this;if(arguments.length===0)return c.wrapper.find("li."+G);isNaN(b)||(b=c.tabGroup.children().get(b)),b=c.element.find(b),a(b).each(function(b,d){d=a(d),!d.hasClass(G)&&!c.trigger(u,{item:d[0],contentElement:c.contentElement(d.index())})&&c.activateTab(d)});return c},enable:function(a,b){this._toggleDisabled(a,b!==!1);return this},disable:function(a){this._toggleDisabled(a,!1);return this},reload:function(b){b=this.tabGroup.find(b);var c=this;b.each(function(){var b=a(this),d=b.find("."+n).data(x);d&&c.ajaxRequest(b,a(c.contentElement(b.index())),null,d)});return c},append:function(a){var b=this,c=b._create(a);f(c.tabs,function(a){b.tabGroup.append(this),b.wrapper.append(c.contents[a])}),M(b.tabGroup),b._updateContentElements();return b},insertBefore:function(b,c){var d=this,e=d._create(b),g=a(d.contentElement(c.index()));f(e.tabs,function(a){c.before(this),g.before(e.contents[a])}),M(d.tabGroup),d._updateContentElements();return d},insertAfter:function(b,c){var d=this,e=d._create(b),g=a(d.contentElement(c.index()));f(e.tabs,function(a){c.after(this),g.after(e.contents[a])}),M(d.tabGroup),d._updateContentElements();return d},remove:function(b){var c=this,d=typeof b,e;d==="string"?b=c.tabGroup.find(b):d==="number"&&(b=c.tabGroup.children().eq(b)),e=a(c.contentElement(b.index())),e.remove(),b.remove(),c._updateContentElements();return c},_create:function(b){var c=a.isPlainObject(b),d=this,f,g;c||a.isArray(b)?(b=a.isArray(b)?b:[b],f=e(b,function(b,c){return a(N.renderItem({group:d.tabGroup,item:h(b,{index:c})}))}),g=e(b,function(b,c){if(b.content||b.contentUrl)return a(N.renderContent({item:h(b,{index:c})}))})):(f=a(b),g=a("<div class='"+w+"'/>"),L(f));return{tabs:f,contents:g}},_toggleDisabled:function(b,c){b=this.tabGroup.find(b),b.each(function(){a(this).toggleClass(F,c).toggleClass(E,!c)})},_updateClasses:function(){var c=this,d,e,f;c.wrapper.addClass("k-widget k-header k-tabstrip"),c.tabGroup=c.wrapper.children("ul").addClass("k-tabstrip-items k-reset"),c.tabGroup[0]||(c.tabGroup=a("<ul class='k-tabstrip-items k-reset'/>").appendTo(c.wrapper)),d=c.tabGroup.find("li").addClass("k-item"),d.length&&(e=d.filter("."+G).index(),f=e>=0?e:b,c.tabGroup.contents().filter(function(){return this.nodeType==3&&!g(this.nodeValue)}).remove()),d.eq(e).addClass(I),c.contentElements=c.wrapper.children("div"),c.contentElements.addClass(w).eq(f).addClass(G).css({display:"block"}),d.length&&(L(d),M(c.tabGroup),c._updateContentElements())},_updateContentElements:function(){var b=this,d=b.options.contentUrls||[],e=b.element.attr("id"),f=b.wrapper.children("div");b.tabGroup.find(".k-item").each(function(c){var g=f.eq(c),h=e+"-"+(c+1);!g.length&&d[c]?a("<div id='"+h+"' class='"+w+"'/>").appendTo(b.wrapper):g.attr("id",h)}),b.contentElements=b.contentAnimators=b.wrapper.children("div"),c.support.touch&&c.mobile.ui.Scroller&&(c.touchScroller(b.contentElements),b.contentElements=b.contentElements.children(".km-scroll-container"))},_toggleHover:function(b){a(b.currentTarget).toggleClass(H,b.type==y)},_click:function(b){var c=this,d=a(b.currentTarget),e=d.find("."+n),f=e.attr(m),g=c.options.collapsible,h=a(c.contentElement(d.index()));if(d.closest(".k-widget")[0]==c.wrapper[0]){if(d.is("."+E+(g?"":",."+G))){b.preventDefault();return}if(c.tabGroup.children("[data-animating], [data-in-request]").length)return;if(c.trigger(u,{item:d[0],contentElement:h[0]}))b.preventDefault();else{var i=e.data(x)||f&&(f.charAt(f.length-1)=="#"||f.indexOf("#"+c.element[0].id+"-")!=-1);if(!f||i)b.preventDefault();else return;if(g&&d.is("."+G)){c.deactivateTab(d),b.preventDefault();return}c.activateTab(d)&&b.preventDefault()}}},deactivateTab:function(a){var b=this,d=b.options.animation,e=d.open,f=h({},d.close),g=f&&"effects"in f;a=b.tabGroup.find(a),f=h(g?f:h({reverse:!0},e),{show:!1,hide:!0}),c.size(e.effects)?(a.kendoAddClass(F,{duration:e.duration}),a.kendoRemoveClass(G,{duration:e.duration})):(a.addClass(F),a.removeClass(G)),b.contentAnimators.filter("."+G).kendoStop(!0,!0).kendoAnimate(f).removeClass(G)},activateTab:function(b){b=this.tabGroup.find(b);var d=this,e=d.options.animation,f=e.open,g=h({},e.close),i=g&&"effects"in g,j=b.parent().children(),k=j.filter("."+G),l=j.index(b);g=h(i?g:h({reverse:!0},f),{show:!1,hide:!0}),c.size(f.effects)?(k.kendoRemoveClass(G,{duration:g.duration}),b.kendoRemoveClass(H,{duration:g.duration})):(k.removeClass(G),b.removeClass(H));var m=d.contentAnimators;if(m.length===0){k.removeClass(I),b.addClass(I).css("z-index"),b.addClass(G),d.trigger("change");return!1}var o=m.filter("."+G),p=a(d.contentElement(l));if(p.length===0){o.removeClass(G).kendoStop(!0,!0).kendoAnimate(g);return!1}b.attr("data-animating",!0);var q=(b.children("."+n).data(x)||!1)&&p.is(r),s=function(){k.removeClass(I),b.addClass(I).css("z-index"),c.size(f.effects)?(k.kendoAddClass(F,{duration:f.duration}),b.kendoAddClass(G,{duration:f.duration})):(k.addClass(F),b.addClass(G)),p.closest(".k-content").addClass(G).kendoStop(!0,!0).kendoAnimate(h({init:function(){d.trigger(v,{item:b[0],contentElement:p[0]})}},f,{complete:function(){b.removeAttr("data-animating")}}))},t=function(){q?d.ajaxRequest(b,p,function(){s(),d.trigger("change")}):(s(),d.trigger("change"))};o.removeClass(G),o.length?o.kendoStop(!0,!0).kendoAnimate(h({complete:t},g)):t();return!0},contentElement:function(a){if(!isNaN(a-0)){var b=this.contentElements,c=new RegExp("-"+(a+1)+"$");for(var d=0,e=b.length;d<e;d++)if(c.test(b.closest(".k-content")[d].id))return b[d]}},ajaxRequest:function(b,c,d,e){b=this.tabGroup.find(b);if(!b.find(".k-loading").length){var f=this,g=b.find("."+n),h={},i=null,j=setTimeout(function(){i=a("<span class='k-icon k-loading'/>").prependTo(g)},100);b.attr("data-in-request",!0),a.ajax({type:"GET",cache:!1,url:e||g.data(x)||g.attr(m),dataType:"html",data:h,error:function(a,c){b.removeAttr("data-animating"),f.trigger("error",{xhr:a,status:c})&&this.complete()},complete:function(){b.removeAttr("data-in-request"),clearTimeout(j),i!==null&&i.remove()},success:function(a,e){c.html(a),d&&d.call(f,c),f.trigger(A,{item:b[0],contentElement:c[0]})}})}}});h(N,{renderItem:function(a){a=h({tabStrip:{},group:{}},a);var b=J.empty,c=a.item;return J.item(h(a,{image:c.imageUrl?J.image:b,sprite:c.spriteCssClass?J.sprite:b,itemWrapper:J.itemWrapper},K))},renderContent:function(a){return J.content(h(a,K))}}),c.ui.plugin(N)}(jQuery),function(a,b){function F(a,b,c){var d=E(b),e=E(c),f;if(!a||d==e)return!0;f=E(a),d>f&&(f+=u),e<d&&(e+=u);return f>=d&&f<=e}function E(a){return a.getHours()*60*t+a.getMinutes()*t+a.getSeconds()*1e3+a.getMilliseconds()}function D(){var a=new z,b=new z(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0),c=new z(a.getFullYear(),a.getMonth(),a.getDate(),12,0,0);return-1*(b.getTimezoneOffset()-c.getTimezoneOffset())}function C(a,b,c){var d=a.getTimezoneOffset(),e;a.setTime(a.getTime()+b),c||(e=a.getTimezoneOffset()-d,a.setTime(a.getTime()+e*t))}var c=window.kendo,d=c.support.touch,e=c.keys,f=c.ui,g=f.Widget,h="open",i="close",j="change",k=d?"touchend":"click",l="k-state-default",m="disabled",n="li",o="<span/>",p="k-state-focused",q="k-state-hover",r="mouseenter mouseleave",s="mousedown",t=6e4,u=864e5,v="k-state-selected",w="k-state-disabled",x=a.extend,y=a.proxy,z=Date,A=new z;A=new z(A.getFullYear(),A.getMonth(),A.getDate(),0,0,0);var B=function(b){var d=this;d.options=b,d.ul=a('<ul unselectable="on" class="k-list k-reset"/>').css({overflow:c.support.touch?"":"auto"}).delegate(n,k,y(d._click,d)).delegate(n,"mouseenter",function(){a(this).addClass(q)}).delegate(n,"mouseleave",function(){a(this).removeClass(q)}),d.list=a("<div class='k-list-container'/>").append(d.ul).mousedown(function(a){a.preventDefault()}),d._popup(),d.template=c.template('<li class="k-item" unselectable="on">#=data#</li>',{useWithBlock:!1})};B.prototype={current:function(c){var d=this;if(c!==b)d._current&&d._current.removeClass(v),c&&(c=a(c),c.addClass(v),d.scroll(c[0])),d._current=c;else return d._current},close:function(){this.popup.close()},open:function(){var a=this;a.ul[0].firstChild||a.refresh(),a.popup.open(),a._current&&a.scroll(a._current[0])},refresh:function(){var a=this,b=a.options,d=b.format,e=D(),f=e<0,g=b.min,h=b.max,i=E(g),j=E(h),k=b.interval*t,l=c.toString,m=a.template,n=new z(g),o=0,p,q="";f?p=(u+e*t)/k:p=u/k,i!=j&&(i>j&&(j+=u),p=(j-i)/k+1);for(;o<p;o++)o&&C(n,k,f),j&&E(n)>j&&(n=new z(h)),q+=m(l(n,d));a.ul[0].innerHTML=q,a._height(p),a.select(a._value)},scroll:function(a){if(!!a){var b=this.ul[0],c=a.offsetTop,d=a.offsetHeight,e=b.scrollTop,f=b.clientHeight,g=c+d;b.scrollTop=e>c?c:g>e+f?g-f:e}},select:function(b){var c=this,d=c._current;typeof b=="string"&&(!d||d.text()!==b?(b=a.grep(c.ul[0].childNodes,function(a){return(a.textContent||a.innerText)==b}),b=b[0]?b:null):b=d),c.current(b)},toggle:function(){var a=this;a.popup.visible()?a.close():a.open()},value:function(a){var b=this;b._value=a,b.ul[0].firstChild&&b.select(a)},_click:function(b){var c=this,d=a(b.currentTarget);b.isDefaultPrevented()||(c.select(d),c.options.change(d.text(),!0),c.close())},_height:function(a){if(a){var b=this,c=b.list,d=c.parent(".k-animation-container"),e=b.options.height;c.add(d).show().height(b.ul[0].scrollHeight>e?e:"auto").hide()}},_popup:function(){var a=this,b=a.list,d=a.options,e=d.anchor,g;a.popup=new f.Popup(b,x(d.popup,{anchor:e,open:d.open,close:d.close,animation:d.animation})),g=e.outerWidth()-(b.outerWidth()-b.width()),b.css({fontFamily:e.css("font-family"),width:g}),c.touchScroller(a.popup.element)},move:function(a){var b=this,c=a.keyCode,d=b.ul[0],f=b._current,g=c===e.DOWN;if(c===e.UP||g){if(a.altKey){b.toggle(g);return}g?f=f?f[0].nextSibling:d.firstChild:f=f?f[0].previousSibling:d.lastChild,f&&b.select(f),b.options.change(b._current.text()),a.preventDefault()}else if(c===e.ENTER||c===e.TAB||c===e.ESC)a.preventDefault(),b.close()}},c.TimeView=B;var G=g.extend({init:function(a,b){var d=this;g.fn.init.call(d,a,b),a=d.element,b=d.options,b.format=b.format||c.culture().calendar.patterns.t,d._wrapper(),d.timeView=new B(x({},b,{anchor:d.wrapper,format:b.format,change:function(b,c){c?d._change(b):a.val(b)},open:function(a){d.trigger(h)&&a.preventDefault()},close:function(a){d.trigger(i)&&a.preventDefault()}})),d._icon(),a.addClass("k-input").bind({keydown:y(d._keydown,d),focus:function(a){d._inputWrapper.addClass(p)},blur:y(d._blur,d)}).closest("form").bind("reset",function(){d.value(a[0].defaultValue)}),d.enable(!a.is("[disabled]")),d.value(b.value||a.val()),c.notify(d)},options:{name:"TimePicker",min:A,max:A,format:"",value:null,interval:30,height:200,animation:{}},events:[h,i,j],setOptions:function(a){g.fn.setOptions.call(this,a),x(this.timeView.options,a),this.timeView.refresh()},enable:function(a){var b=this,c=b.element,d=b._arrow.unbind(k+" "+s),e=b._inputWrapper.unbind(r);a===!1?(e.removeClass(l).addClass(w),c.attr(m,m)):(e.removeClass(w).addClass(l).bind(r,b._toggleHover),c.removeAttr(m),d.bind(k,y(b._click,b)).bind(s,function(a){a.preventDefault()}))},close:function(){this.timeView.close()},open:function(){this.timeView.open()},min:function(a){return this._option("min",a)},max:function(a){return this._option("max",a)},value:function(a){var c=this;if(a===b)return c._value;c._old=c._update(a)},_blur:function(){var a=this;a.close(),a._change(a.element.val()),a._inputWrapper.removeClass(p)},_click:function(){var a=this,b=a.element;!d&&b[0]!==document.activeElement&&b.focus(),a.timeView.toggle()},_change:function(a){var b=this;a=b._update(a),+b._old!=+a&&(b._old=a,b.trigger(j),b.element.trigger(j))},_icon:function(){var b=this,c=b.element,d;d=c.next("span.k-select"),d[0]||(d=a('<span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-icon-clock">select</span></span>').insertAfter(c)),b._arrow=d},_keydown:function(a){var b=this,c=a.keyCode,d=c==e.ENTER,f=b.timeView;(f.popup.visible()||a.altKey||d)&&f.move(a),d&&b._change(b.element.val())},_option:function(a,c){var d=this,e=d.options;if(c===b)return e[a];c=d._parse(c);!c||(c=new z(c),e[a]=c,d.timeView.options[a]=c,d.timeView.refresh())},_parse:function(a){var b=this,d=b._value||A;if(a instanceof z)return a;a=c.parseDate(a,b.options.format),a&&(a=new z(d.getFullYear(),d.getMonth(),d.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds()));return a},_toggleHover:function(b){d||a(b.currentTarget).toggleClass(q,b.type==="mouseenter")},_update:function(a){var b=this,d=b.options,e=b._parse(a),f=c.toString(e,d.format);F(e,d.min,d.max)||(e=null),b._value=e,b.element.val(e?f:a),b.timeView.value(f);return e},_wrapper:function(){var b=this,c=b.element,d;d=c.parents(".k-timepicker"),d[0]||(d=c.wrap(o).parent().addClass("k-picker-wrap k-state-default"),d=d.wrap(o).parent()),d[0].style.cssText=c[0].style.cssText,c.css({width:"100%",height:c[0].style.height}),b.wrapper=d.addClass("k-widget k-timepicker k-header"),b._inputWrapper=a(d[0].firstChild)}});f.plugin(G)}(jQuery),function(a,b){function D(a){var b=this;b.treeview=a,b._draggable=new d.Draggable(a.element,{filter:"div:not(.k-state-disabled) .k-in",hint:function(a){return v.dragClue({text:a.text()})},cursorOffset:{left:10,top:c.support.touch?-40/c.support.zoomLevel():10},dragstart:h(b.dragstart,b),dragcancel:h(b.dragcancel,b),drag:h(b.drag,b),dragend:h(b.dragend,b)})}function C(a,b,c){var d=a.children("div"),e=a.children("ul");a.hasClass("k-treeview")||(c||(c={expanded:e.css("display")!="none",index:a.index(),enabled:!d.children(".k-in").hasClass("k-state-disabled")}),b||(b={firstLevel:a.parent().parent().hasClass(s),length:a.parent().children().length}),a.removeClass("k-first k-last").addClass(w.wrapperCssClass(b,c)),d.removeClass("k-top k-mid k-bot").addClass(w.cssClass(b,c)),e.length&&(d.children(".k-icon").removeClass("k-plus k-minus k-plus-disabled k-minus-disabled").addClass(w.toggleButtonClass(c)),e.addClass("k-group")))}function B(b){var c=b.children("div"),d=b.children("ul"),e=c.children(".k-icon"),f=c.children(".k-in"),g,h;if(!b.hasClass("k-treeview")){c.length||(c=a("<div />").prependTo(b));if(!e.length&&d.length)e=a("<span class='k-icon' />").prependTo(c);else if(!d.length||!d.children().length)e.remove(),d.remove();if(!f.length){f=a("<span class='k-in' />").appendTo(c)[0],g=c[0].nextSibling,f=c.find(".k-in")[0];while(g&&g.nodeName.toLowerCase()!="ul")h=g,g=g.nextSibling,h.nodeType==3&&(h.nodeValue=a.trim(h.nodeValue)),f.appendChild(h)}}}function A(a){return function(b){var c=b.children(".k-animation-container");c.length||(c=b);return c.children(a)}}var c=window.kendo,d=c.ui,e=a.extend,f=c.template,g=d.Widget,h=a.proxy,i="select",j="expand",k="collapse",l="dragstart",m="drag",n="drop",o="dragend",p="click",q="visibility",r="k-state-hover",s="k-treeview",t=":visible",u=".k-item",v,w,x,y,z;y=A(".k-group"),z=A(".k-group,.k-content"),v={dragClue:f("<div class='k-header k-drag-clue'><span class='k-icon k-drag-status'></span>#= text #</div>"),group:f("<ul class='#= groupCssClass(group) #'#= groupAttributes(group) #>#= renderItems(data) #</ul>"),itemWrapper:f("<div class='#= cssClass(group, item) #'>#= toggleButton(data) ##= checkbox(data) #<#= tag(item) # class='#= textClass(item) #'#= textAttributes(item) #>#= image(item) ##= sprite(item) ##= treeview.template ? template(treeview, item) : text(item) #</#= tag(item) #></div>"),item:f("<li class='#= wrapperCssClass(group, item) #'>#= itemWrapper(data) ## if (item.items) { ##= subGroup(treeview, group, item) ## } #</li>"),checkbox:f("# if (treeview.checkboxTemplate) { #<span class='k-checkbox'>#= checkboxTemplate(treeview, group, item) #</span># } #"),image:f("<img class='k-image' alt='' src='#= imageUrl #' />"),toggleButton:f("<span class='#= toggleButtonClass(item) #'></span>"),sprite:f("<span class='k-sprite #= spriteCssClass #'></span>"),empty:f("")},x=g.extend({init:function(b,c){var d=this,e=".k-in:not(.k-state-selected,.k-state-disabled)",i="mouseenter",j;a.isArray(c)&&(j=!0,c={dataSource:c}),g.prototype.init.call(d,b,c),b=d.element,c=d.options,d._animation(),c.template&&typeof c.template=="string"&&(c.template=f(c.template)),b.hasClass(s)?(d.wrapper=b,d.root=b.children("ul").eq(0)):(d._wrapper(),d.root.length?d._group(d.wrapper):d.root=d.wrapper.html(x.renderGroup({items:c.dataSource,group:{firstLevel:!0,expanded:!0},treeview:c})).children("ul")),d.wrapper.on(i,".k-in.k-state-selected",function(a){a.preventDefault()}).on(i,e,function(){a(this).addClass(r)}).on("mouseleave",e,function(){a(this).removeClass(r)}).on(p,e,h(d._nodeClick,d)).on("dblclick","div:not(.k-state-disabled) .k-in",h(d._toggleButtonClick,d)).on(p,".k-plus,.k-minus",h(d._toggleButtonClick,d)),c.dragAndDrop&&(d.dragging=new D(d))},_animation:function(){var a=this.options;a.animation===!1&&(a.animation={expand:{show:!0,effects:{}},collapse:{hide:!0,effects:{}}})},events:[l,m,n,o,j,k,i],options:{name:"TreeView",dataSource:{},animation:{expand:{effects:"expand:vertical",duration:200,show:!0},collapse:{duration:100}},dragAndDrop:!1},setOptions:function(a){var b=this;"dragAndDrop"in a&&a.dragAndDrop&&!b.options.dragAndDrop&&(b.dragging=new D(b)),g.fn.setOptions.call(b,a),b._animation()},_trigger:function(a,b){return this.trigger(a,{node:b.closest(u)[0]})},_toggleButtonClick:function(b){this.toggle(a(b.target).closest(u))},_nodeClick:function(b){var c=this,d=a(b.target),e=z(d.closest(u)),f=d.attr("href"),g;f?g=f=="#"||f.indexOf("#"+this.element.id+"-")>=0:g=e.length&&!e.children().length,g&&b.preventDefault(),!d.hasClass(".k-state-selected")&&!c._trigger("select",d)&&c.select(d)},_wrapper:function(){var a=this,b=a.element,c,d,e="k-widget k-treeview k-reset";b.is("div")?(c=b,d=c.children("ul").eq(0)):(c=b.wrap("<div />").parent(),d=b),a.wrapper=c.addClass(e),a.root=d},_group:function(a){var b=this,d=a.hasClass(s),e={firstLevel:d,expanded:d||a.attr(c.attr("expanded"))==="true"},f=a.children("ul");f.addClass(w.groupCssClass(e)).css("display",e.expanded?"":"none"),b._nodes(f,e)},_nodes:function(b,d){var f=this,g=b.children("li"),h;d=e({length:g.length},d),g.each(function(b,e){e=a(e),h={index:b,expanded:e.attr(c.attr("expanded"))==="true"},B(e),C(e,d,h),f._group(e)})},_processNodes:function(b,c){var d=this;d.element.find(b).each(function(b,e){c.call(d,b,a(e).closest(u))})},expand:function(a){this._processNodes(a,function(a,b){var c=z(b);c.length>0&&!c.is(t)&&this.toggle(b)})},collapse:function(a){this._processNodes(a,function(a,b){var c=z(b);c.length>0&&c.is(t)&&this.toggle(b)})},enable:function(a,b){b=arguments.length==2?!!b:!0,this._processNodes(a,function(a,c){var d=!z(c).is(t);b||(this.collapse(c),d=!0),c.children("div").children(".k-in").toggleClass("k-state-default",b).toggleClass("k-state-disabled",!b).end().children(".k-icon").toggleClass("k-plus",d&&b).toggleClass("k-plus-disabled",d&&!b).toggleClass("k-minus",!d&&b).toggleClass("k-minus-disabled",!d&&!b)})},select:function(b){var c=this.element;if(!arguments.length)return c.find(".k-state-selected").closest(u);b=a(b,c).closest(u),b.length&&(c.find(".k-in").removeClass("k-state-hover k-state-selected"),b.find(".k-in:first").addClass("k-state-selected"))},toggle:function(b){b=a(b);if(!!b.find(".k-minus,.k-plus").length){if(b.find("> div > .k-state-disabled").length)return;var c=this,d=z(b),f=!d.is(t),g=c.options.animation||{},h=g.expand,i=e({},g.collapse),j=i&&"effects"in i;if(d.data("animating"))return;f||(h=e(j?i:e({reverse:!0},h),{show:!1,hide:!0})),d.children().length>0&&(c._trigger(f?"expand":"collapse",b)||(b.find("> div > .k-icon").toggleClass("k-minus",f).toggleClass("k-plus",!f),f||d.css("height",d.height()).css("height"),d.kendoStop(!0,!0).kendoAnimate(e(h,{complete:function(){f&&d.css("height","")}}))))}},text:function(b){return a(b).closest(u).find(">div>.k-in").text()},_insertNode:function(b,c,d,f,g){function p(a,b){return x.renderItem({treeview:h.options,group:l,item:e(a,{index:b})})}var h=this,i=f.children().length+1,j,k,l={firstLevel:d.hasClass(s),expanded:!0,length:i},m,n,o="";b.toJSON&&(b=b.toJSON()),j=a.isArray(b),k=j||a.isPlainObject(b);if(k){if(j)for(n=0;n<b.length;n++)o+=p(b[n],c+n);else o=p(b,c);m=a(o)}else{m=a(b);if(f.children()[c-1]==m[0])return m;m.closest(".k-treeview")[0]==h.wrapper[0]&&h.detach(m)}f.length||(f=a(x.renderGroup({group:l})).appendTo(d)),g(m,f),d.hasClass("k-item")&&(B(d),C(d)),k||C(m),C(m.prev()),C(m.next());return m},insertAfter:function(a,b){var c=b.parent();return this._insertNode(a,b.index()+1,c.parent(),c,function(a,c){a.insertAfter(b)})},insertBefore:function(a,b){var c=b.parent();return this._insertNode(a,b.index(),c.parent(),c,function(a,c){a.insertBefore(b)})},append:function(a,b){b=b||this.element;var c=y(b);return this._insertNode(a,c.children().length,b,c,function(a,b){a.appendTo(b)})},_remove:function(b,c){var d,e,f;b=a(b,this.element),d=b.parent().parent(),e=b.prev(),f=b.next(),b[c?"detach":"remove"](),d.hasClass("k-item")&&(B(d),C(d)),C(e),C(f);return b},remove:function(a){return this._remove(a,!1)},detach:function(a){return this._remove(a,!0)},findByText:function(b){return a(this.element).find(".k-in").filter(function(c,d){return a(d).text()==b}).closest(u)}}),D.prototype={_hintStatus:function(b){var c=this._draggable.hint.find(".k-drag-status")[0];if(b)c.className="k-icon k-drag-status "+b;else return a.trim(c.className.replace(/k-(icon|drag-status)/g,""))},dragstart:function(b){var c=this,d=c.treeview,e=c.sourceNode=b.currentTarget.closest(u);d.trigger(l,{sourceNode:e[0]})&&b.preventDefault(),c.dropHint=a("<div class='k-drop-hint' />").css(q,"hidden").appendTo(d.element)},drag:function(b){var d=this,e=d.treeview,f=d.sourceNode,g=d.dropTarget=a(c.eventTarget(b)),h,i,j,k,l,n,o,p,s,t;g.closest(".k-treeview").length?a.contains(f[0],g[0])?h="k-denied":(h="k-insert-middle",d.dropHint.css(q,"visible"),i=g.closest(".k-top,.k-mid,.k-bot"),i.length>0?(k=i.outerHeight(),l=i.offset().top,n=g.closest(".k-in"),o=k/(n.length>0?4:2),p=b.pageY<l+o,s=l+k-o<b.pageY,t=n.length>0&&!p&&!s,n.toggleClass(r,t),d.dropHint.css(q,t?"hidden":"visible"),t?h="k-add":(j=i.position(),j.top+=p?0:k,d.dropHint.css(j)[p?"prependTo":"appendTo"](g.closest(u).children("div:first")),p&&i.hasClass("k-top")&&(h="k-insert-top"),s&&i.hasClass("k-bot")&&(h="k-insert-bottom"))):g[0]!=d.dropHint[0]&&(h="k-denied")):h="k-denied",e.trigger(m,{sourceNode:f[0],dropTarget:g[0],pageY:b.pageY,pageX:b.pageX,statusClass:h.substring(2),setStatusClass:function(a){h=a}}),h.indexOf("k-insert")!==0&&d.dropHint.css(q,"hidden"),d._hintStatus(h)},dragcancel:function(a){this.dropHint.remove()},dragend:function(a){var b=this,c=b.treeview,d="over",e=b.sourceNode,f,g=b.dropHint,h,i;g.css(q)=="visible"?(d=g.prevAll(".k-in").length>0?"after":"before",f=g.closest(u)):b.dropTarget&&(f=b.dropTarget.closest(u)),h=b._hintStatus()!="k-denied",i=c.trigger(n,{sourceNode:e[0],destinationNode:f[0],valid:h,setValid:function(a){h=a},dropTarget:a.target,dropPosition:d}),g.remove();!h||i?b._draggable.dropped=h:(b._draggable.dropped=!0,d=="over"?(c.append(e,f),c.expand(f)):d=="before"?c.insertBefore(e,f):d=="after"&&c.insertAfter(e,f),c.trigger(o,{sourceNode:e[0],destinationNode:f[0],dropPosition:d}))}},e(x,{renderItem:function(a){a=e({treeview:{},group:{}},a);var b=v.empty,c=a.item,d=a.treeview;return v.item(e(a,{image:c.imageUrl?v.image:b,sprite:c.spriteCssClass?v.sprite:b,itemWrapper:v.itemWrapper,toggleButton:c.items?v.toggleButton:b,checkbox:d.checkboxTemplate?v.checkbox:b,subGroup:function(a,b,c){return x.renderGroup({items:c.items,treeview:a,group:{expanded:c.expanded}})}},w))},renderGroup:function(a){return v.group(e({renderItems:function(a){var b="",c=0,d=a.items,f=d?d.length:0,g=e({length:f},a.group);for(;c<f;c++)b+=x.renderItem(e(a,{group:g,item:e({index:c},d[c])}));return b}},a,w))}}),w={wrapperCssClass:function(a,b){var c="k-item",d=b.index;a.firstLevel&&d===0&&(c+=" k-first"),d==a.length-1&&(c+=" k-last");return c},cssClass:function(a,b){var c="",d=b.index,e=a.length-1;a.firstLevel&&d===0&&(c+="k-top "),d===0&&d!=e?c+="k-top":d==e?c+="k-bot":c+="k-mid";return c},textClass:function(a){var b="k-in";a.enabled===!1&&(b+=" k-state-disabled"),a.selected===!0&&(b+=" k-state-selected");return b},textAttributes:function(a){return a.url?" href='"+a.url+"'":""},toggleButtonClass:function(a){var b="k-icon";a.expanded!==!0?b+=" k-plus":b+=" k-minus",a.enabled===!1&&(b+="-disabled");return b},text:function(a){return a.encoded===!1?a.text:c.htmlEncode(a.text)},template:function(a,b){return a.template(e({item:b},w))},checkboxTemplate:function(a,b,c){return a.checkboxTemplate(e({treeview:a,group:b,item:c},w))},tag:function(a){return a.url?"a":"span"},groupAttributes:function(a){return a.expanded!==!0?" style='display:none'":""},groupCssClass:function(a){var b="k-group";a.firstLevel&&(b+=" k-treeview-lines");return b}},d.plugin(x)}(jQuery),function(a,b){function O(a,c){return h(a.getAttribute(c))||b}function N(a){a=parseFloat(a,10);var b=k.pow(10,D||0);return k.round(a*b)/b}function M(a){return(a+"").replace(".",c.cultures.current.numberFormat["."])}function L(a){return function(){return a}}function K(a){return function(b){return b+a}}function J(a){var b=a.is("input")?1:2;return"<div class='k-slider-track'><div class='k-slider-selection'><!-- --></div><a href='#' class='k-draghandle' title='Drag'>Drag</a>"+(b>1?"<a href='#' class='k-draghandle' title='Drag'>Drag</a>":"")+"</div>"}function I(a,b){var c="<ul class='k-reset k-slider-items'>",d=k.floor(N(b/a.smallStep))+1,e;for(e=0;e<d;e++)c+="<li class='k-tick'>&nbsp;</li>";c+="</ul>";return c}function H(a,b,c){var d="";b=="increase"?d=c?"k-arrow-next":"k-arrow-up":d=c?"k-arrow-prev":"k-arrow-down";return"<a class='k-button k-button-"+b+"'><span class='k-icon "+d+"' title='"+a[b+"ButtonTitle"]+"'>"+a[b+"ButtonTitle"]+"</span></a>"}function G(a,b,c){var d=c?" k-slider-horizontal":" k-slider-vertical",e=a.style?a.style:b.attr("style"),f=b.attr("class")?" "+b.attr("class"):"",g="";a.tickPlacement=="bottomRight"?g=" k-slider-bottomright":a.tickPlacement=="topLeft"&&(g=" k-slider-topleft"),e=e?" style='"+e+"'":"";return"<div class='k-widget k-slider"+d+f+"'"+e+">"+"<div class='k-slider-wrap"+(a.showButtons?" k-slider-buttons":"")+g+"'></div></div>"}var c=window.kendo,d=c.ui.Widget,e=c.ui.Draggable,f=a.extend,g=c.format,h=c.parseFloat,i=a.proxy,j=a.isArray,k=Math,l=c.support,m=l.touch,n=l.pointers,o="change",p="slide",q=m?"touchstart":"mousedown",r=n?"MSPointerDown":"mousedown",s=m?"touchend":"mouseup",t="moveSelection",u="keydown",v="click",w="mouseover",x=".k-draghandle",y=".k-slider-track",z=".k-tick",A="k-state-selected",B="k-state-default",C="k-state-disabled",D=3,E="disabled",F=d.extend({init:function(a,b){var e=this;d.fn.init.call(e,a,b),b=e.options,e._distance=b.max-b.min,e._isHorizontal=b.orientation=="horizontal",e._position=e._isHorizontal?"left":"bottom",e._size=e._isHorizontal?"width":"height",e._outerSize=e._isHorizontal?"outerWidth":"outerHeight",b.tooltip.format=b.tooltip.enabled?b.tooltip.format||"{0}":"{0}",e._createHtml(),e.wrapper=e.element.closest(".k-slider"),e._trackDiv=e.wrapper.find(y),e._setTrackDivWidth(),e._maxSelection=e._trackDiv[e._size]();var f=e._maxSelection/((b.max-b.min)/b.smallStep),g=e._calculateItemsWidth(k.floor(e._distance/b.smallStep));b.tickPlacement!="none"&&f>=2&&(e._trackDiv.before(I(b,e._distance)),e._setItemsWidth(g),e._setItemsTitle(),e._setItemsLargeTick()),e._calculateSteps(g),e[b.enabled?"enable":"disable"](),e._keyMap={37:K(-b.smallStep),40:K(-b.smallStep),39:K(+b.smallStep),38:K(+b.smallStep),35:L(b.max),36:L(b.min),33:K(+b.largeStep),34:K(-b.largeStep)},c.notify(e)},events:[o,p],options:{enabled:!0,min:0,max:10,smallStep:1,largeStep:5,orientation:"horizontal",tickPlacement:"both",tooltip:{enabled:!0,format:"{0}"}},_setTrackDivWidth:function(){var a=this,b=parseFloat(a._trackDiv.css(a._position),10)*2;a._trackDiv[a._size](a.wrapper[a._size]()-2-b)},_setItemsWidth:function(b){var c=this,d=c.options,e=0,f=b.length-1,g=c.wrapper.find(z),h,i=0,j=2,k=g.length,l=0;for(h=0;h<k-2;h++)a(g[h+1])[c._size](b[h]);c._isHorizontal?(a(g[e]).addClass("k-first")[c._size](b[f-1]),a(g[f]).addClass("k-last")[c._size](b[f])):(a(g[f]).addClass("k-first")[c._size](b[f]),a(g[e]).addClass("k-last")[c._size](b[f-1]));if(c._distance%d.smallStep!==0&&!c._isHorizontal){for(h=0;h<b.length;h++)l+=b[h];i=c._maxSelection-l,i+=parseFloat(c._trackDiv.css(c._position),10)+j,c.wrapper.find(".k-slider-items").css("padding-top",i)}},_setItemsTitle:function(){var b=this,c=b.options,d=b.wrapper.find(z),e=c.min,f=d.length,h=b._isHorizontal?0:f-1,i=b._isHorizontal?f:-1,j=b._isHorizontal?1:-1;for(;h-i!==0;h+=j)a(d[h]).attr("title",g(c.tooltip.format,N(e))),e+=c.smallStep},_setItemsLargeTick:function(){var b=this,c=b.options,d,e=b.wrapper.find(z),f={},g=N(c.largeStep/c.smallStep);if(1e3*c.largeStep%(1e3*c.smallStep)===0)if(b._isHorizontal)for(d=0;d<e.length;d=N(d+g))f=a(e[d]),f.addClass("k-tick-large").html("<span class='k-label'>"+f.attr("title")+"</span>");else for(d=e.length-1;d>=0;d=N(d-g))f=a(e[d]),f.addClass("k-tick-large").html("<span class='k-label'>"+f.attr("title")+"</span>"),d!==0&&d!==e.length-1&&f.css("line-height",f[b._size]()+"px")},_calculateItemsWidth:function(a){var b=this,c=b.options,d=parseFloat(b._trackDiv.css(b._size))+1,e=d/b._distance,f,g,h;b._distance/c.smallStep-k.floor(b._distance/c.smallStep)>0&&(d-=b._distance%c.smallStep*e),f=d/a,g=[];for(h=0;h<a-1;h++)g[h]=f;g[a-1]=g[a]=f/2;return b._roundWidths(g)},_roundWidths:function(a){var b=0,c=a.length,d;for(d=0;d<c;d++)b+=a[d]-k.floor(a[d]),a[d]=k.floor(a[d]);b=k.round(b);return this._addAdditionalSize(b,a)},_addAdditionalSize:function(a,b){if(a===0)return b;var c=parseFloat(b.length-1)/parseFloat(a==1?a:a-1),d;for(d=0;d<a;d++)b[parseInt(k.round(c*d),10)]+=1;return b},_calculateSteps:function(a){var b=this,c=b.options,d=c.min,e=0,f=k.ceil(b._distance/c.smallStep),g=1,h;f+=b._distance/c.smallStep%1===0?1:0,a.splice(0,0,a[f-2]*2),a.splice(f-1,1,a.pop()*2),b._pixelSteps=[e],b._values=[d];if(f!==0){while(g<f)e+=(a[g-1]+a[g])/2,b._pixelSteps[g]=e,b._values[g]=d+=c.smallStep,g++;h=b._distance%c.smallStep===0?f-1:f,b._pixelSteps[h]=b._maxSelection,b._values[h]=c.max}},_getValueFromPosition:function(a,b){var c=this,d=c.options,e=k.max(d.smallStep*(c._maxSelection/c._distance),0),f=0,g=e/2,h;c._isHorizontal?f=a-b.startPoint:f=b.startPoint-a;if(c._maxSelection-(parseInt(c._maxSelection%e,10)-3)/2<f)return d.max;for(h=0;h<c._pixelSteps.length;h++)if(k.abs(c._pixelSteps[h]-f)-1<=g)return N(c._values[h])},_getDragableArea:function(){var a=this,b=a._trackDiv.offset().left,c=a._trackDiv.offset().top;return{startPoint:a._isHorizontal?b:c+a._maxSelection,endPoint:a._isHorizontal?b+a._maxSelection:c}},_createHtml:function(){var a=this,b=a.element,c=a.options,d=b.find("input");d.length==2?(d.eq(0).val(c.selectionStart),d.eq(1).val(c.selectionEnd)):b.val(c.value),b.wrap(G(c,b,a._isHorizontal)).hide(),c.showButtons&&b.before(H(c,"increase",a._isHorizontal)).before(H(c,"decrease",a._isHorizontal)),b.before(J(b))}}),P=function(a){return{idx:0,x:a.pageX,y:a.pageY}};l.pointers&&(P=function(a){return{idx:0,x:a.originalEvent.clientX,y:a.originalEvent.clientY}}),l.touch&&(P=function(b,c){var d=b.changedTouches||b.originalEvent.changedTouches;if(c){var e=null;a.each(d,function(a,b){c==b.identifier&&(e={idx:b.identifier,x:b.pageX,y:b.pageY})});return e}return{idx:d[0].identifier,x:d[0].pageX,y:d[0].pageY}});var Q=F.extend({init:function(c,d){var e=this,g;c.type="text",c=a(c),d=f({},{value:O(c[0],"value"),min:O(c[0],"min"),max:O(c[0],"max"),smallStep:O(c[0],"step")},d),d&&d.enabled===b&&(d.enabled=!c.is("[disabled]")),F.fn.init.call(e,c,d),d=e.options,e._setValueInRange(d.value),g=e.wrapper.find(x),new Q.Selection(g,e,d),e._drag=new Q.Drag(g,"",e,d)},options:{name:"Slider",value:0,showButtons:!0,increaseButtonTitle:"Increase",decreaseButtonTitle:"Decrease",tooltip:{format:"{0}"}},enable:function(b){var d=this,e=d.options,f,g;d.disable();if(b!==!1){d.wrapper.removeClass(C).addClass(B),d.wrapper.find("input").removeAttr(E),f=function(b){var c=P(b),e=d._isHorizontal?c.x:c.y,f=d._getDragableArea(),g=a(b.target);g.hasClass("k-draghandle")?g.addClass(A):(d._update(d._getValueFromPosition(e,f)),d._drag.dragstart(b))},d.wrapper.find(z+", "+y).bind(r,f).end().bind(r,function(){a(document.documentElement).one("selectstart",c.preventDefault)}),d.wrapper.find(x).bind(s,function(b){a(b.target).removeClass(A)}).bind(v,function(a){a.preventDefault()}),g=i(function(a){d._setValueInRange(d._nextValueByIndex(d._valueIndex+a*1))},d);if(e.showButtons){var h=i(function(a,b){if(a.which===1||m&&a.which===0)g(b),this.timeout=setTimeout(i(function(){this.timer=setInterval(function(){g(b)},60)},this),200)},d);d.wrapper.find(".k-button").bind(s,i(function(a){this._clearTimer()},d)).bind(w,function(b){a(b.currentTarget).addClass("k-state-hover")}).bind("mouseout",i(function(b){a(b.currentTarget).removeClass("k-state-hover"),this._clearTimer()},d)).eq(0).bind(q,i(function(a){h(a,1)},d)).click(!1).end().eq(1).bind(q,i(function(a){h(a,-1)},d)).click(!1)}d.wrapper.find(x).bind(u,i(this._keydown,d)),e.enabled=!0}},disable:function(){var b=this;b.wrapper.removeClass(B).addClass(C),a(b.element).attr(E,E),b.wrapper.find(".k-button").unbind(q).bind(q,!1).unbind(s).bind(s,!1).unbind("mouseleave").bind("mouseleave",!1).unbind(w).bind(w,!1),b.wrapper.find(z+", "+y).unbind(r),b.wrapper.find(x).unbind(s).unbind(u).unbind(v).bind(u,!1),b.options.enabled=!1},_update:function(a){var b=this,c=b.value()!=a;b.value(a),c&&b.trigger(o,{value:b.options.value})},value:function(a){var b=this,c=b.options;a=N(a);if(isNaN(a))return c.value;a>=c.min&&a<=c.max&&c.value!=a&&(b.element.attr("value",M(a)),c.value=a,b._refresh())},_refresh:function(){this.trigger(t,{value:this.options.value})},_clearTimer:function(a){clearTimeout(this.timeout),clearInterval(this.timer)},_keydown:function(a){var b=this;a.keyCode in b._keyMap&&(b._setValueInRange(b._keyMap[a.keyCode](b.options.value)),a.preventDefault())},_setValueInRange:function(a){var b=this,c=b.options;a=N(a);isNaN(a)?b._update(c.min):(a=k.max(k.min(a,c.max),c.min),b._update(a))},_nextValueByIndex:function(a){var b=this._values.length;return this._values[k.max(0,k.min(a,b-1))]}});Q.Selection=function(a,b,c){function d(d){var e=d-c.min,f=b._valueIndex=k.ceil(N(e/c.smallStep)),g=parseInt(b._pixelSteps[f],10),h=b._trackDiv.find(".k-slider-selection"),i=parseInt(a[b._outerSize]()/2,10);h[b._size](g),a.css(b._position,g-i)}d(c.value),b.bind([o,p,t],function(a){d(parseFloat(a.value,10))})},Q.Drag=function(a,b,c,d){var f=this;f.owner=c,f.options=d,f.dragHandle=a,f.dragHandleSize=a[c._outerSize](),f.type=b,f.draggable=new e(a,{threshold:0,dragstart:i(f._dragstart,f),drag:i(f.drag,f),dragend:i(f.dragend,f),dragcancel:i(f.dragcancel,f)}),a.click(!1)},Q.Drag.prototype={dragstart:function(a){this.draggable.drag._start(a)},_dragstart:function(b){var d=this,e=d.owner,f=d.options,h=f.tooltip,i="",j,l,m;f.enabled?(e.element.unbind(w),d.dragHandle.addClass(A),d.dragableArea=e._getDragableArea(),d.step=k.max(f.smallStep*(e._maxSelection/e._distance),0),d.type?(d.selectionStart=f.selectionStart,d.selectionEnd=f.selectionEnd,e._setZIndex(d.type)):d.oldVal=d.val=f.value,h.enabled&&(h.template&&(j=d.tooltipTemplate=c.template(h.template)),d.tooltipDiv=a("<div class='k-widget k-tooltip'><!-- --></div>").appendTo(document.body),d.type?d.tooltipTemplate?i=j({selectionStart:d.selectionStart,selectionEnd:d.selectionEnd}):(l=g(h.format,d.selectionStart),m=g(h.format,d.selectionEnd),i=l+" - "+m):(d.tooltipInnerDiv="<div class='k-callout k-callout-"+(e._isHorizontal?"s":"e")+"'><!-- --></div>",d.tooltipTemplate?i=j({value:d.val}):i=g(h.format,d.val),i+=d.tooltipInnerDiv),d.tooltipDiv.html(i),d.moveTooltip())):b.preventDefault()},drag:function(a){var b=this,c=b.owner,d=b.options,e=a.x.location,f=a.y.location,h=b.dragableArea.startPoint,i=b.dragableArea.endPoint,j=d.tooltip,k="",l=b.tooltipTemplate,m,n,o;a.preventDefault(),c._isHorizontal?b.val=b.constrainValue(e,h,i,e>=i):b.val=b.constrainValue(f,i,h,f<=i),b.oldVal!=b.val&&(b.oldVal=b.val,b.type?(b.type=="firstHandle"?b.val<b.selectionEnd?b.selectionStart=b.val:b.selectionStart=b.selectionEnd=b.val:b.val>b.selectionStart?b.selectionEnd=b.val:b.selectionStart=b.selectionEnd=b.val,m={values:[b.selectionStart,b.selectionEnd],value:[b.selectionStart,b.selectionEnd]}):m={value:b.val},c.trigger(p,m),j.enabled&&(b.type?b.tooltipTemplate?k=l({selectionStart:b.selectionStart,selectionEnd:b.selectionEnd}):(n=g(j.format,b.selectionStart),o=g(j.format,b.selectionEnd),k=n+" - "+o):(b.tooltipTemplate?k=l({value:b.val}):k=g(j.format,b.val),k+=b.tooltipInnerDiv),b.tooltipDiv.html(k),b.moveTooltip()))},dragcancel:function(a){this.owner._refresh();return this._end()},dragend:function(a){var b=this,c=b.owner;b.type?c._update(b.selectionStart,b.selectionEnd):c._update(b.val);return b._end()},_end:function(){var a=this,b=a.owner;b.options.tooltip.enabled&&b.options.enabled&&a.tooltipDiv.remove(),a.dragHandle.removeClass(A),b.element.bind(w);return!1},moveTooltip:function(){var a=this,b=a.owner,c=0,d=0,e=a.dragHandle.offset(),f=4,g=a.tooltipDiv.find(".k-callout"),h,i,j;a.type?(h=b.wrapper.find(x),i=h.eq(0).offset(),j=h.eq(1).offset(),b._isHorizontal?(c=j.top,d=i.left+(j.left-i.left)/2):(c=i.top+(j.top-i.top)/2,d=j.left)):(c=e.top,d=e.left),b._isHorizontal?(d-=parseInt((a.tooltipDiv.outerWidth()-a.dragHandle[b._outerSize]())/2,10),c-=a.tooltipDiv.outerHeight()+g.height()+f):(c-=parseInt((a.tooltipDiv.outerHeight()-a.dragHandle[b._outerSize]())/2,10),d-=a.tooltipDiv.outerWidth()+g.width()+f),a.tooltipDiv.css({top:c,left:d})},constrainValue:function(a,b,c,d){var e=this,f=0;b<a&&a<c?f=e.owner._getValueFromPosition(a,e.dragableArea):d?f=e.options.max:f=e.options.min;return f}},c.ui.plugin(Q);var R=F.extend({init:function(c,d){var e=this,g=a(c).find("input"),h=g.eq(0)[0],i=g.eq(1)[0];h.type="text",i.type="text",d=f({},{selectionStart:O(h,"value"),min:O(h,"min"),max:O(h,"max"),smallStep:O(h,"step")},{selectionEnd:O(i,"value"),min:O(i,"min"),max:O(i,"max"),smallStep:O(i,"step")},d),d&&d.enabled===b&&(d.enabled=!g.is("[disabled]")),F.fn.init.call(e,c,d),d=e.options,e._setValueInRange(d.selectionStart,d.selectionEnd);var j=e.wrapper.find(x);new R.Selection(j,e,d),e._firstHandleDrag=new Q.Drag(j.eq(0),"firstHandle",e,d),e._lastHandleDrag=new Q.Drag(j.eq(1),"lastHandle",e,d)},options:{name:"RangeSlider",selectionStart:0,selectionEnd:10,tooltip:{format:"{0}"}},enable:function(b){var d=this,e=d.options,f;d.disable();b!==!1&&(d.wrapper.removeClass(C).addClass(B),d.wrapper.find("input").removeAttr(E),f=function(b){var c=P(b),f=d._isHorizontal?c.x:c.y,g=d._getDragableArea(),h=d._getValueFromPosition(f,g),i=a(b.target);i.hasClass("k-draghandle")?i.addClass(A):h<e.selectionStart?(d._setValueInRange(h,e.selectionEnd),d._firstHandleDrag.dragstart(b)):h>d.selectionEnd?(d._setValueInRange(e.selectionStart,h),d._lastHandleDrag.dragstart(b)):h-e.selectionStart<=e.selectionEnd-h?(d._setValueInRange(h,e.selectionEnd),d._firstHandleDrag.dragstart(b)):(d._setValueInRange(e.selectionStart,h),d._lastHandleDrag.dragstart(b))},d.wrapper.find(z+", "+y).bind(r,f).end().bind(r,function(){a(document.documentElement).one("selectstart",c.preventDefault)}),d.wrapper.find(x).bind(s,function(b){a(b.target).removeClass(A)}).bind(v,function(a){a.preventDefault()}),d.wrapper.find(x).eq(0).bind(u,i(function(a){this._keydown(a,"firstHandle")},d)).end().eq(1).bind(u,i(function(a){this._keydown(a,"lastHandle")},d)),d.options.enabled=!0)},disable:function(){var a=this;a.wrapper.removeClass(B).addClass(C),a.wrapper.find("input").attr(E,E),a.wrapper.find(z+", "+y).unbind(r),a.wrapper.find(x).unbind(s).unbind(u).unbind(v).bind(u,!1),a.options.enabled=!1},_keydown:function(a,b){var c=this,d=c.options.selectionStart,e=c.options.selectionEnd;a.keyCode in c._keyMap&&(b=="firstHandle"?(d=c._keyMap[a.keyCode](d),d>e&&(e=d)):(e=c._keyMap[a.keyCode](e),d>e&&(d=e)),c._setValueInRange(d,e),a.preventDefault())},_update:function(a,b){var c=this,d=c.value(),e=d[0]!=a||d[1]!=b;c.value([a,b]),e&&c.trigger(o,{values:[a,b],value:[a,b]})},value:function(a){return a&&a.length?this._value(a[0],a[1]):this._value()},_value:function(a,b){var c=this,d=c.options,e=d.selectionStart,f=d.selectionEnd;if(isNaN(a)&&isNaN(b))return[e,f];a=N(a),b=N(b),a>=d.min&&a<=d.max&&b>=d.min&&b<=d.max&&a<=b&&(e!=a||f!=b)&&(c.element.find("input").eq(0).attr("value",M(a)).end().eq(1).attr("value",M(b)),d.selectionStart=a,d.selectionEnd=b,c._refresh())},values:function(a,b){return j(a)?this._value(a[0],a[1]):this._value(a,b)},_refresh:function(){var a=this,b=a.options;a.trigger(t,{values:[b.selectionStart,b.selectionEnd],value:[b.selectionStart,b.selectionEnd]}),b.selectionStart==b.max&&b.selectionEnd==b.max&&a._setZIndex("firstHandle")},_setValueInRange:function(a,b){var c=this.options;a=k.max(k.min(a,c.max),c.min),b=k.max(k.min(b,c.max),c.min),a==c.max&&b==c.max&&this._setZIndex("firstHandle"),this._update(k.min(a,b),k.max(a,b))},_setZIndex:function(b){this.wrapper.find(x).each(function(c){a(this).css("z-index",b=="firstHandle"?1-c:c)})}});R.Selection=function(a,b,c){function e(a,c){var d=0,e=0,f=b._trackDiv.find(".k-slider-selection");d=k.abs(a-c),e=a<c?a:c,f[b._size](d),f.css(b._position,e-1)}function d(d){d=d||[];var f=d[0]-c.min,g=d[1]-c.min,h=k.ceil(N(f/c.smallStep)),i=k.ceil(N(g/c.smallStep)),j=b._pixelSteps[h],l=b._pixelSteps[i],m=parseInt(a.eq(0)[b._outerSize]()/2,10);a.eq(0).css(b._position,j-m).end().eq(1).css(b._position,l-m),e(j,l)}d(b.value()),b.bind([o,p,t],function(a){d(a.values)})},c.ui.plugin(R)}(jQuery),function(a,b){function D(a){var b=this,d=a.orientation;b.owner=a,b._element=a.element,b.orientation=d,e(b,d===o?C:B),b._resizable=new c.ui.Resizable(a.element,{orientation:d,handle:a.element.children(".k-splitbar-draggable-"+d),hint:f(b._createHint,b),start:f(b._start,b),max:f(b._max,b),min:f(b._min,b),invalidClass:"k-restricted-size-"+d,resizeend:f(b._stop,b)})}function z(b,c){return function(d,e){var f=a(d).data(s);if(arguments.length==1)return f[b];f[b]=e;if(c){var g=this.element.data("kendoSplitter");g.trigger(m)}}}function y(a){return!w(a)&&!x(a)}function x(a){return h.test(a)}function w(a){return i.test(a)}var c=window.kendo,d=c.ui,e=a.extend,f=a.proxy,g=d.Widget,h=/^\d+(\.\d+)?px$/i,i=/^\d+(\.\d+)?%$/i,j="expand",k="collapse",l="contentLoad",m="resize",n="layoutChange",o="horizontal",p="vertical",q="mouseenter",r="click",s="pane",t="mouseleave",u="k-"+s,v="."+u,A=g.extend({init:function(b,c){var d=this,e=function(){d.trigger(m)};g.fn.init.call(d,b,c),d.wrapper=d.element,d.orientation=d.options.orientation.toLowerCase()!=p?o:p,d.bind(m,f(d._resize,d)),d._initPanes(),d._attachEvents(),a(window).resize(e),d.resizing=new D(d)},events:[j,k,l,m,n],_attachEvents:function(){var b=this,c=b.options.orientation,d=".k-splitbar-draggable-"+c,e=".k-splitbar .k-icon:not(.k-resize-handle)",g=function(){b.trigger(m)};b.element.delegate(d,q,function(){a(this).addClass("k-splitbar-"+b.orientation+"-hover")}).delegate(d,t,function(){a(this).removeClass("k-splitbar-"+b.orientation+"-hover")}).delegate(d,"mousedown",function(){b._contentFrames(this).after("<div class='k-overlay' />")}).delegate(d,"mouseup",function(){b._contentFrames(this).next(".k-overlay").remove()}).delegate(e,q,function(){a(this).addClass("k-state-hover")}).delegate(e,t,function(){a(this).removeClass("k-state-hover")}).delegate(".k-splitbar .k-collapse-next, .k-splitbar .k-collapse-prev",r,b._arrowClick(k)).delegate(".k-splitbar .k-expand-next, .k-splitbar .k-expand-prev",r,b._arrowClick(j)).delegate(".k-splitbar","dblclick",f(b._dbclick,b)).parent().closest(".k-splitter").each(function(){a(this).data("kendoSplitter").bind(m,g)})},options:{name:"Splitter",orientation:o},_initPanes:function(){var b=this,c=b.options.panes||[];b.element.addClass("k-widget").addClass("k-splitter").children().addClass(u).each(function(d,e){var f=c&&c[d];e=a(e),e.data(s,f?f:{}).toggleClass("k-scrollable",f?f.scrollable!==!1:!0),b.ajaxRequest(e)}).end(),b.trigger(m)},ajaxRequest:function(b,d,e){b=a(b);var f=this,g=b.data(s);d=d||g.contentUrl,d&&(b.append("<span class='k-icon k-loading k-pane-loading' />"),c.isLocalUrl(d)?a.ajax({url:d,data:e||{},type:"GET",dataType:"html",success:function(a){b.html(a),f.trigger(l,{pane:b[0]})}}):b.removeClass("k-scrollable").html("<iframe src='"+d+"' frameborder='0' class='k-content-frame'>"+"This page requires frames in order to show content"+"</iframe>"))},_triggerAction:function(a,b){this.trigger(a,{pane:b[0]})||this[a](b[0])},_dbclick:function(b){var c=this,d=a(b.target),e;if(d.closest(".k-splitter")[0]==c.element[0]){e=d.children(".k-icon:not(.k-resize-handle)");if(e.length!==1)return;e.is(".k-collapse-prev")?c._triggerAction(k,d.prev()):e.is(".k-collapse-next")?c._triggerAction(k,d.next()):e.is(".k-expand-prev")?c._triggerAction(j,d.prev()):e.is(".k-expand-next")&&c._triggerAction(j,d.next())}},_arrowClick:function(b){var c=this;return function(d){var e=a(d.target),f;e.closest(".k-splitter")[0]==c.element[0]&&(e.is(".k-"+b+"-prev")?f=e.parent().prev():f=e.parent().next(),c._triggerAction(b,f))}},_updateSplitBar:function(a,b,c){var d=function(a,b){return b?"<div class='k-icon "+a+"' />":""},e=this.orientation,f=b.resizable!==!1&&c.resizable!==!1,g=b.collapsible,h=b.collapsed,i=c.collapsible,j=c.collapsed;a.addClass("k-splitbar k-state-default k-splitbar-"+e).removeClass("k-splitbar-"+e+"-hover").toggleClass("k-splitbar-draggable-"+e,f&&!h&&!j).toggleClass("k-splitbar-static-"+e,!f&&!g&&!i).html(d("k-collapse-prev",g&&!h&&!j)+d("k-expand-prev",g&&h&&!j)+d("k-resize-handle",f)+d("k-collapse-next",i&&!j&&!h)+d("k-expand-next",i&&j&&!h))},_updateSplitBars:function(){var b=this;this.element.children(".k-splitbar").each(function(){var c=a(this),d=c.prev(v).data(s),e=c.next(v).data(s);!e||b._updateSplitBar(c,d,e)})},_contentFrames:function(b){return a(b).siblings(v).find("> .k-content-frame")},_resize:function(){var b=this,c=b.element,d=c.children(":not(.k-splitbar)"),e=b.orientation==o,f=c.children(".k-splitbar"),g=f.length,h=e?"width":"height",i=c[h]();g===0?(g=d.length-1,d.slice(0,g).after("<div class='k-splitbar' />"),b._updateSplitBars(),f=c.children(".k-splitbar")):b._updateSplitBars(),f.each(function(){i-=this[e?"offsetWidth":"offsetHeight"]});var j=0,k=0,l=a();d.css({position:"absolute",top:0})[h](function(){var b=a(this).data(s)||{},c;if(b.collapsed)c=0;else{if(y(b.size)){l=l.add(this);return}c=parseInt(b.size,10),w(b.size)&&(c=Math.floor(c*i/100))}k++,j+=c;return c}),i-=j;var m=l.length,p=Math.floor(i/m);l.slice(0,m-1).css(h,p).end().eq(m-1).css(h,i-(m-1)*p);var q=0,r=e?"height":"width",t=e?"left":"top",u=e?"offsetWidth":"offsetHeight";if(m===0){var v=d.filter(function(){return!(a(this).data(s)||{}).collapsed}).last();v[h](i+v[0][u])}c.children().css(r,c[r]()).each(function(a,b){b.style[t]=Math.floor(q)+"px",q+=b[u]}),b.trigger(n)},toggle:function(c,d){var e;c=a(c),e=c.data(s),arguments.length==1&&(d=e.collapsed===b?!1:e.collapsed),e.collapsed=!d,this.trigger(m)},collapse:function(a){this.toggle(a,!1)},expand:function(a){this.toggle(a,!0)},size:z("size",!0),min:z("min"),max:z("max")});d.plugin(A);var B={sizingProperty:"height",sizingDomProperty:"offsetHeight",alternateSizingProperty:"width",positioningProperty:"top",mousePositioningProperty:"pageY"},C={sizingProperty:"width",sizingDomProperty:"offsetWidth",alternateSizingProperty:"height",positioningProperty:"left",mousePositioningProperty:"pageX"};D.prototype={_createHint:function(b){var c=this;return a("<div class='k-ghost-splitbar k-ghost-splitbar-"+c.orientation+" k-state-default' />").css(c.alternateSizingProperty,b[c.alternateSizingProperty]())},_start:function(b){var c=this,d=a(b.currentTarget),e=d.prev(),f=d.next(),g=e.data(s),h=f.data(s),i=parseInt(e[0].style[c.positioningProperty],10),j=parseInt(f[0].style[c.positioningProperty],10)+f[0][c.sizingDomProperty]-d[0][c.sizingDomProperty],k=c._element.css(c.sizingProperty),l=function(a){var b=parseInt(a,10);return(x(a)?b:k*b/100)||0},m=l(g.min),n=l(g.max)||j-i,o=l(h.min),p=l(h.max)||j-i;c.previousPane=e,c.nextPane=f,c._maxPosition=Math.min(j-o,i+n),c._minPosition=Math.max(i+m,j-p)},_max:function(a){return this._maxPosition},_min:function(a){return this._minPosition},_stop:function(b){var d=this,e=a(b.currentTarget),f=d.owner;f._contentFrames(e).next(".k-overlay").remove();if(b.keyCode!==c.keys.ESC){var g=b.position,h=e.prev(),i=e.next(),j=h.data(s),k=i.data(s),l=g-parseInt(h[0].style[d.positioningProperty],10),n=parseInt(i[0].style[d.positioningProperty],10)+i[0][d.sizingDomProperty]-g-e[0][d.sizingDomProperty],o=d._element.children(v).filter(function(){return y(a(this).data(s).size)}).length;if(!y(j.size)||o>1)y(j.size)&&o--,j.size=l+"px";if(!y(k.size)||o>1)k.size=n+"px";f.trigger(m)}return!1}}}(jQuery),function(a,b){function E(){var c={},d=a("meta[name=csrf-token]").attr("content"),e=a("meta[name=csrf-param]").attr("content");a("input[name^='__RequestVerificationToken']").each(function(){c[this.name]=this.value}),e!==b&&d!==b&&(c[e]=d);return c}function D(b){return a(b.target).closest(".k-file")}function C(a){return a.children(".k-icon").is(".k-loading, .k-success, .k-fail")}function B(a,b,c){var d,e;a.bind("dragenter",function(a){b(),e=new Date,d||(d=setInterval(function(){var a=new Date-e;a>100&&(c(),clearInterval(d),d=null)},100))}).bind("dragover",function(a){e=new Date})}function A(a){a.stopPropagation(),a.preventDefault()}function z(b,c,d){try{var e=a.parseJSON(b);c(e)}catch(f){d()}}function y(b,c,d){if(!!c._supportsRemove()){var f=b.data("fileNames"),g=a.map(f,function(a){return a.name});c._submitRemove(g,d,function(a,d,e){c._removeFileEntry(b),c.trigger(i,{operation:"remove",files:f,response:a,XMLHttpRequest:e})},function(a,b,b){var d=c.trigger(j,{operation:"remove",files:f,XMLHttpRequest:a});e("Server response: "+a.responseText),d||c._alert("Error! Remove operation failed. Unexpected response - see console.")})}}function x(a){var b=a.lastIndexOf("\\");return b!=-1?a.substr(b+1):a}function w(a){var b=a.match(f);return b?b[0]:""}function v(a){var b=a.name||a.fileName;return{name:b,extension:w(b),size:a.size||a.fileSize,rawFile:a}}function u(b){return a.map(b,function(a){return v(a)})}function t(a){var b=a[0];return b.files?u(b.files):[{name:x(b.value),extension:w(b.value),size:null}]}function s(b){return a.map(t(b),function(a){return a.name}).join(", ")}var c=window.kendo,d=c.ui.Widget,e=c.logToConsole,f=/\.([^\.]+)$/,g="select",h="upload",i="success",j="error",k="complete",l="cancel",m="load",n="remove",o=d.extend({init:function(c,e){var f=this;d.fn.init.call(f,c,e),f.name=c.name,f.multiple=f.options.multiple,f.localization=f.options.localization;var g=f.element;f.wrapper=g.closest(".k-upload"),f.wrapper.length==0&&(f.wrapper=f._wrapInput(g)),f._activeInput(g),f.toggle(f.options.enabled),g.closest("form").bind({submit:a.proxy(f._onParentFormSubmit,f),reset:a.proxy(f._onParentFormReset,f)}),f.options.async.saveUrl!=b?f._module=f._supportsFormData()?new r(f):new q(f):f._module=new p(f),f._supportsDrop()&&f._setupDropZone(),f.wrapper.delegate(".k-upload-action","click",a.proxy(f._onFileAction,f)).delegate(".k-upload-selected","click",a.proxy(f._onUploadSelected,f)).delegate(".k-file","t:progress",a.proxy(f._onFileProgress,f)).delegate(".k-file","t:upload-success",a.proxy(f._onUploadSuccess,f)).delegate(".k-file","t:upload-error",a.proxy(f._onUploadError,f))},events:[g,h,i,j,k,l,n],options:{name:"Upload",enabled:!0,multiple:!0,showFileList:!0,async:{removeVerb:"POST",autoUpload:!0},localization:{select:"Select...",cancel:"Cancel",retry:"Retry",remove:"Remove",uploadSelectedFiles:"Upload files",dropFilesHere:"drop files here to upload",statusUploading:"uploading",statusUploaded:"uploaded",statusFailed:"failed"}},setOptions:function(a){var b=this,c=b.element;d.fn.setOptions.call(b,a),b.multiple=b.options.multiple,c.attr("multiple",b._supportsMultiple()?b.multiple:!1),b.toggle(b.options.enabled)},enable:function(a){a=typeof a=="undefined"?!0:a,this.toggle(a)},disable:function(){this.toggle(!1)},toggle:function(a){a=typeof a=="undefined"?a:!a,this.wrapper.toggleClass("k-state-disabled",a)},_addInput:function(b){var c=this;b.insertAfter(c.element).data("kendoUpload",c),a(c.element).hide().removeAttr("id"),c._activeInput(b)},_activeInput:function(b){var c=this,d=c.wrapper;c.element=b,b.attr("multiple",c._supportsMultiple()?c.multiple:!1).attr("autocomplete","off").click(function(a){d.hasClass("k-state-disabled")&&a.preventDefault()}).change(a.proxy(c._onInputChange,c))},_onInputChange:function(b){var c=this,d=a(b.target),e=c.trigger(g,{files:t(d)});e?(c._addInput(d.clone().val("")),d.remove()):d.trigger("t:select")},_onDrop:function(b){var c=b.originalEvent.dataTransfer,d=this,e=c.files;A(b);if(e.length>0){var f=d.trigger(g,{files:u(e)});f||a(".k-dropzone",d.wrapper).trigger("t:select",[e])}},_enqueueFile:function(b,c){var d=this,e,f,g=a(".k-upload-files",d.wrapper);g.length==0&&(g=a("<ul class='k-upload-files k-reset'></ul>").appendTo(d.wrapper),d.options.showFileList||g.hide()),e=a(".k-file",g),f=a("<li class='k-file'><span class='k-icon'></span><span class='k-filename' title='"+b+"'>"+b+"</span></li>").appendTo(g).data(c),d.multiple||e.trigger("t:remove");return f},_removeFileEntry:function(b){var c=b.closest(".k-upload-files"),d;b.remove(),d=a(".k-file",c),d.find("> .k-fail").length===d.length&&this._hideUploadButton(),d.length==0&&c.remove()},_fileAction:function(a,b){var c={remove:"k-delete",cancel:"k-cancel",retry:"k-retry"};!c.hasOwnProperty(b)||(this._clearFileAction(a),a.append(this._renderAction(c[b],this.localization[b]).addClass("k-upload-action")))},_fileState:function(a,b){var c=this.localization,d={uploading:{cssClass:"k-loading",text:c.statusUploading},uploaded:{cssClass:"k-success",text:c.statusUploaded},failed:{cssClass:"k-fail",text:c.statusFailed}},e=d[b];if(e){var f=a.children(".k-icon").text(e.text);f[0].className="k-icon "+e.cssClass}},_renderAction:function(b,c){return b!=""?a("<button type='button' class='k-button k-button-icontext'><span class='k-icon "+b+"'></span>"+c+"</button>"):a("<button type='button' class='k-button'>"+c+"</button>")},_clearFileAction:function(a){a.find(".k-upload-action").remove()},_onFileAction:function(b){var c=this;if(!c.wrapper.hasClass("k-state-disabled")){var d=a(b.target).closest(".k-upload-action"),e=d.find(".k-icon"),f=d.closest(".k-file"),g={files:f.data("fileNames")};e.hasClass("k-delete")?c.trigger(n,g)||f.trigger("t:remove",g.data):e.hasClass("k-cancel")?(c.trigger(l,g),f.trigger("t:cancel"),this._checkAllComplete()):e.hasClass("k-retry")&&f.trigger("t:retry")}return!1},_onUploadSelected:function(){this.wrapper.trigger("t:saveSelected");return!1},_onFileProgress:function(b,c){var d=a(".k-progress-status",b.target);d.length==0&&(d=a("<span class='k-progress'><span class='k-progress-status' style='width: 0;'></span></span>").appendTo(a(".k-filename",b.target)).find(".k-progress-status")),d.width(c+"%")},_onUploadSuccess:function(a,b,c){var d=D(a);this._fileState(d,"uploaded"),this.trigger(i,{files:d.data("fileNames"),response:b,operation:"upload",XMLHttpRequest:c}),this._supportsRemove()?this._fileAction(d,n):this._clearFileAction(d),this._checkAllComplete()},_onUploadError:function(a,b){var c=D(a);this._fileState(c,"failed"),this._fileAction(c,"retry");var d=this.trigger(j,{operation:"upload",files:c.data("fileNames"),XMLHttpRequest:b});e("Server response: "+b.responseText),d||this._alert("Error! Upload failed. Unexpected server response - see console."),this._checkAllComplete()},_showUploadButton:function(){var b=a(".k-upload-selected",this.wrapper);b.length==0&&(b=this._renderAction("",this.localization.uploadSelectedFiles).addClass("k-upload-selected")),this.wrapper.append(b)},_hideUploadButton:function(){a(".k-upload-selected",this.wrapper).remove()},_onParentFormSubmit:function(){var b=this,c=b.element;c.trigger("t:abort");if(!c.value){var d=a(c);d.attr("disabled","disabled"),window.setTimeout(function(){d.removeAttr("disabled")},0)}},_onParentFormReset:function(){a(".k-upload-files",this.wrapper).remove()},_supportsFormData:function(){if(a.browser.safari)return!1;return typeof FormData!="undefined"},_supportsMultiple:function(){return!a.browser.opera},_supportsDrop:function(){var a=this._userAgent().toLowerCase(),c=/chrome/.test(a),d=!c&&/safari/.test(a),e=d&&/windows/.test(a);return!e&&this._supportsFormData()&&this.options.async.saveUrl!=b},_userAgent:function(){return navigator.userAgent},_setupDropZone:function(){a(".k-upload-button",this.wrapper).wrap("<div class='k-dropzone'></div>");var b=a(".k-dropzone",this.wrapper).append(a("<em>"+this.localization.dropFilesHere+"</em>")).bind({dragenter:A,dragover:function(a){a.preventDefault()},drop:a.proxy(this._onDrop,this)});B(b,function(){b.addClass("k-dropzone-hovered")},function(){b.removeClass("k-dropzone-hovered")}),B(a(document),function(){b.addClass("k-dropzone-active")},function(){b.removeClass("k-dropzone-active")})},_supportsRemove:function(){return this.options.async.removeUrl!=b},_submitRemove:function(b,c,d,e){var f=this,g=f.options.async.removeField||"fileNames",h=a.extend(c,E());h[g]=b,a.ajax({type:this.options.async.removeVerb,dataType:"json",url:this.options.async.removeUrl,traditional:!0,data:h,success:d,error:e})},_alert:function(a){alert(a)},_wrapInput:function(a){a.wrap("<div class='k-widget k-upload'><div class='k-button k-upload-button'></div></div>"),a.closest(".k-button").append("<span>"+this.localization.select+"</span>");return a.closest(".k-upload")},_checkAllComplete:function(){a(".k-file .k-icon.k-loading",this.wrapper).length==0&&this.trigger(k)}}),p=function(b){this.name="syncUploadModule",this.element=b.wrapper,this.upload=b,this.element.bind("t:select",a.proxy(this.onSelect,this)).bind("t:remove",a.proxy(this.onRemove,this)).closest("form").attr("enctype","multipart/form-data").attr("encoding","multipart/form-data")};p.prototype={onSelect:function(b){var c=this.upload,d=a(b.target);c._addInput(d.clone().val(""));var e=c._enqueueFile(s(d),{relatedInput:d,fileNames:t(d)});c._fileAction(e,n)},onRemove:function(a){var b=D(a);b.data("relatedInput").remove(),this.upload._removeFileEntry(b)}};var q=function(b){this.name="iframeUploadModule",this.element=b.wrapper,this.upload=b,this.iframes=[],this.element.bind("t:select",a.proxy(this.onSelect,this)).bind("t:cancel",a.proxy(this.onCancel,this)).bind("t:retry",a.proxy(this.onRetry,this)).bind("t:remove",a.proxy(this.onRemove,this)).bind("t:saveSelected",a.proxy(this.onSaveSelected,this)).bind("t:abort",a.proxy(this.onAbort,this))};o._frameId=0,q.prototype={onSelect:function(b){var c=this.upload,d=a(b.target),e=this.prepareUpload(d);c.options.async.autoUpload?this.performUpload(e):(c._supportsRemove()&&this.upload._fileAction(e,n),c._showUploadButton())},prepareUpload:function(b){var c=this.upload,d=a(c.element),e=c.options.async.saveField||b.attr("name");c._addInput(b.clone().val("")),b.attr("name",e);var f=this.createFrame(c.name+"_"+o._frameId++);this.registerFrame(f);var g=this.createForm(c.options.async.saveUrl,f.attr("name")).append(d),h=c._enqueueFile(s(b),{frame:f,relatedInput:d,fileNames:t(b)});f.data({form:g,file:h});return h},performUpload:function(b){var c={files:b.data("fileNames")},d=b.data("frame"),e=this.upload;if(!e.trigger(h,c)){e._hideUploadButton(),d.appendTo(document.body);var f=d.data("form").appendTo(document.body);c.data=a.extend({},c.data,E());for(var g in c.data){var i=f.find("input[name='"+g+"']");i.length==0&&(i=a("<input>",{type:"hidden",name:g}).appendTo(f)),i.val(c.data[g])}e._fileAction(b,l),e._fileState(b,"uploading"),d.one("load",a.proxy(this.onIframeLoad,this)),f[0].submit()}else e._removeFileEntry(d.data("file")),this.cleanupFrame(d),this.unregisterFrame(d)},onSaveSelected:function(b){var c=this;a(".k-file",this.element).each(function(){var b=a(this),d=C(b);d||c.performUpload(b)})},onIframeLoad:function(b){var c=a(b.target);try{var d=c.contents().text()}catch(b){d="Error trying to get server response: "+b}this.processResponse(c,d)},processResponse:function(b,c){var d=b.data("file"),e=this,f={responseText:c};z(c,function(c){a.extend(f,{statusText:"OK",status:"200"}),d.trigger("t:upload-success",[c,f]),e.cleanupFrame(b),e.unregisterFrame(b)},function(){a.extend(f,{statusText:"error",status:"500"}),d.trigger("t:upload-error",[f])})},onCancel:function(b){var c=a(b.target).data("frame");this.stopFrameSubmit(c),this.cleanupFrame(c),this.unregisterFrame(c),this.upload._removeFileEntry(c.data("file"))},onRetry:function(a){var b=D(a);this.performUpload(b)},onRemove:function(a,b){var c=D(a),d=c.data("frame");d?(this.unregisterFrame(d),this.upload._removeFileEntry(c),this.cleanupFrame(d)):y(c,this.upload,b)},onAbort:function(){var b=this.element,c=this;a.each(this.iframes,function(){a("input",this.data("form")).appendTo(b),c.stopFrameSubmit(this[0]),this.data("form").remove(),this.remove()}),this.iframes=[]},createFrame:function(b){return a("<iframe name='"+b+"'"+" id='"+b+"'"+" style='display:none;' />")},createForm:function(b,c){return a("<form enctype='multipart/form-data' method='POST' action='"+b+"'"+" target='"+c+"'"+"/>")},stopFrameSubmit:function(a){typeof a.stop!="undefined"?a.stop():a.document&&(a.document.execCommand("Stop"),a.contentWindow.location.href=a.contentWindow.location.href)},registerFrame:function(a){this.iframes.push(a)},unregisterFrame:function(b){this.iframes=a.grep(this.iframes,function(a){return a.attr("name")!=b.attr("name")})},cleanupFrame:function(a){var b=a.data("form");a.data("file").data("frame",null),setTimeout(function(){b.remove(),a.remove()},1)}};var r=function(b){this.name="formDataUploadModule",this.element=b.wrapper,this.upload=b,this.element.bind("t:select",a.proxy(this.onSelect,this)).bind("t:cancel",a.proxy(this.onCancel,this)).bind("t:remove",a.proxy(this.onRemove,this)).bind("t:retry",a.proxy(this.onRetry,this)).bind("t:saveSelected",a.proxy(this.onSaveSelected,this)).bind("t:abort",a.proxy(this.onAbort,this))};r.prototype={onSelect:function(b,c){var d=this.upload,e=this,f=a(b.target),g=c?u(c):this.inputFiles(f),h=this.prepareUpload(f,g);a.each(h,function(){d.options.async.autoUpload?e.performUpload(this):(d._supportsRemove()&&d._fileAction(this,n),d._showUploadButton())})},prepareUpload:function(b,c){var d=this.enqueueFiles(c);b.is("input")&&(a.each(d,function(){a(this).data("relatedInput",b)}),b.data("relatedFileEntries",d),this.upload._addInput(b.clone().val("")));return d},enqueueFiles:function(a){var b=this.upload;fileEntries=[];for(var c=0;c<a.length;c++){var d=a[c],e=d.name,f=b._enqueueFile(e,{fileNames:[d]});f.data("formData",this.createFormData(a[c])),fileEntries.push(f)}return fileEntries},inputFiles:function(a){return t(a)},performUpload:function(b){var c=this.upload,d=b.data("formData"),e={files:b.data("fileNames")};if(!c.trigger(h,e)){c._fileAction(b,l),c._hideUploadButton();if(!b.data("dataAppended")){e.data=a.extend({},e.data,E());for(var f in e.data)d.append(f,e.data[f]);b.data("dataAppended",!0)}c._fileState(b,"uploading"),this.postFormData(this.upload.options.async.saveUrl,d,b)}else this.removeFileEntry(b)},onSaveSelected:function(b){var c=this;a(".k-file",this.element).each(function(){var b=a(this),d=C(b);d||c.performUpload(b)})},onCancel:function(a){var b=D(a);this.stopUploadRequest(b),this.removeFileEntry(b)},onRetry:function(a){var b=D(a);this.performUpload(b)},onRemove:function(a,b){var c=D(a);c.children(".k-icon").is(".k-success")?y(c,this.upload,b):this.removeFileEntry(c)},postFormData:function(a,b,c){var d=new XMLHttpRequest,e=this;c.data("request",d),d.addEventListener("load",function(a){e.onRequestSuccess.call(e,a,c)},!1),d.addEventListener(j,function(a){e.onRequestError.call(e,a,c)},!1),d.upload.addEventListener("progress",function(a){e.onRequestProgress.call(e,a,c)},!1),d.open("POST",a),d.send(b)},createFormData:function(a){var b=new FormData,c=this.upload;b.append(c.options.async.saveField||c.name,a.rawFile);return b},onRequestSuccess:function(a,b){var c=a.target,d=this;z(c.responseText,function(a){b.trigger("t:upload-success",[a,c]),b.trigger("t:progress",[100]),d.cleanupFileEntry(b)},function(){b.trigger("t:upload-error",[c])})},onRequestError:function(a,b){var c=a.target;b.trigger("t:upload-error",[c])},cleanupFileEntry:function(b){var c=b.data("relatedInput"),d=!0;c&&(a.each(c.data("relatedFileEntries"),function(){this.parent().length>0&&this[0]!=b[0]&&(d=d&&this.children(".k-icon").is(".k-success"))}),d&&c.remove()),b.data("formData",null)},removeFileEntry:function(a){this.cleanupFileEntry(a),this.upload._removeFileEntry(a)},onRequestProgress:function(a,b){var c=Math.round(a.loaded*100/a.total);b.trigger("t:progress",[c])},stopUploadRequest:function(a){a.data("request").abort()}},c.ui.plugin(o)}(jQuery),function(a,b){function P(a){var b=this;b.owner=a,b._draggable=new e(a.wrapper,{filter:n,group:a.wrapper.id+"-moving",dragstart:g(b.dragstart,b),drag:g(b.drag,b),dragend:g(b.dragend,b),dragcancel:g(b.dragcancel,b)})}function O(a){var b=this;b.owner=a,b._draggable=new e(a.wrapper,{filter:p,group:a.wrapper.id+"-resizing",dragstart:g(b.dragstart,b),drag:g(b.drag,b),dragend:g(b.dragend,b)})}function M(a,b){return function(){var a=this,c=a.wrapper,d=c[0].style,e=a.options;if(!e.isMaximized&&!e.isMinimized){a.restoreOptions={width:d.width,height:d.height},c.find(p).hide().end().find(H).parent().hide().eq(0).before(l.action({name:"Restore"})),b.call(a);return a}}}function L(){return a(m).filter(function(){var b=a(this);return b.is(u)&&K(b).options.modal}).sort(function(b,c){return+a(b).css("zIndex")- +a(c).css("zIndex")})}function K(a){return a.children(o).data("kendoWindow")}function J(a,b,c){return Math.max(Math.min(a,c),b)}var c=window.kendo,d=c.ui.Widget,e=c.ui.Draggable,f=a.isPlainObject,g=a.proxy,h=a.extend,i=a.each,j=c.template,k="body",l,m=".k-window",n=".k-window-titlebar",o=".k-window-content",p=".k-resize-handle",q=".k-overlay",r="k-content-frame",s="k-loading",t="k-state-hover",u=":visible",v="cursor",w="open",x="activate",y="deactivate",z="close",A="refresh",B="resize",C="dragstart",D="dragend",E="error",F="overflow",G="zIndex",H=".k-window-actions .k-minimize,.k-window-actions .k-maximize",I=c.isLocalUrl,N=d.extend({init:function(b,e){var h=this,j,k,o,p,q=!1,r;d.fn.init.call(h,b,e),e=h.options,b=h.element,r=e.content,h.appendTo=a(e.appendTo||document.body),h._animations(),f(r)||(r=e.content={url:r}),b.parent().is(h.appendTo)||(b.is(u)?(k=b.offset(),q=!0):(o=b.css("visibility"),p=b.css("display"),b.css({visibility:"hidden",display:""}),k=b.offset(),b.css({visibility:o,display:p}))),j=h.wrapper=b.closest(m);if(!b.is(".k-content")||!j[0])b.addClass("k-window-content k-content"),h._createWindow(b,e),j=h.wrapper=b.closest(m),h._dimensions();k&&(q?j.css({top:k.top,left:k.left}):j.css({top:k.top,left:k.left,visibility:"visible",display:"none"})),r&&h.refresh(r),h.toFront(),e.modal&&h._overlay(j.is(u)).css({opacity:.5}),j.on({mouseenter:function(){a(this).addClass(t)},mouseleave:function(){a(this).removeClass(t)},click:g(h._windowActionHandler,h)},".k-window-titlebar .k-window-action"),e.resizable&&(j.on("dblclick",n,g(h.toggleMaximization,h)),i("n e s w se sw ne nw".split(" "),function(a,b){j.append(l.resizeHandle(b))}),h.resizing=new O(h)),e.draggable&&(h.dragging=new P(h)),j.add(j.find(".k-resize-handle,.k-window-titlebar")).on("mousedown",g(h.toFront,h)),h.touchScroller=c.touchScroller(b),a(window).resize(g(h._onDocumentResize,h)),j.is(u)&&(h.trigger(w),h.trigger(x)),c.notify(h)},_dimensions:function(){var a=this,b=a.wrapper,c=a.element,d=a.options;a.title(d.title),d.width&&b.width(d.width),d.height&&b.height(d.height),i(["minWidth","minHeight","maxWidth","maxHeight"],function(a,b){var e=d[b];e&&e!=Infinity&&c.css(b,e)}),d.visible||b.hide()},_animations:function(){var a=this.options;a.animation===!1&&(a.animation={open:{show:!0,effects:{}},close:{hide:!0,effects:{}}})},setOptions:function(a){d.fn.setOptions.call(this,a),this._animations(),this._dimensions()},events:[w,x,y,z,A,B,C,D,E],options:{name:"Window",animation:{open:{effects:{zoom:{direction:"in"},fade:{direction:"in"}},duration:350,show:!0},close:{effects:{zoom:{direction:"out",properties:{scale:.7}},fade:{direction:"out"}},duration:350,hide:!0}},title:"",actions:["Close"],modal:!1,resizable:!0,draggable:!0,minWidth:90,minHeight:50,maxWidth:Infinity,maxHeight:Infinity,visible:!0},_overlay:function(b){var c=this.appendTo.children(".k-overlay"),d=this.wrapper;c.length||(c=a("<div class='k-overlay' />")),c.insertBefore(d[0]).toggle(b).css(G,parseInt(d.css(G),10)-1);return c},_windowActionHandler:function(b){var c=a(b.target).closest(".k-window-action").find(".k-icon"),d=this;i({"k-close":d.close,"k-maximize":d.maximize,"k-minimize":d.minimize,"k-restore":d.restore,"k-refresh":d.refresh},function(a,e){if(c.hasClass(a)){b.preventDefault(),e.call(d);return!1}})},center:function(){var b=this.wrapper,c=a(window);b.css({left:c.scrollLeft()+Math.max(0,(c.width()-b.width())/2),top:c.scrollTop()+Math.max(0,(c.height()-b.height())/2)});return this},title:function(a){var b=this,c=b.wrapper,d=b.options,e=c.find(n),f=e.children(".k-window-title"),g=e.outerHeight();if(!arguments.length)return f.text();a===!1?(c.addClass("k-window-titleless"),e.remove()):(e.length||c.prepend(l.titlebar(h(l,d))),c.css("padding-top",g),e.css("margin-top",-g)),f.text(a);return b},content:function(a){var b=this.wrapper.children(o);if(!a)return b.html();b.html(a);return this},open:function(){var b=this,c=b.wrapper,d=b.options.animation.open,e=c.children(o),f=e.css(F);if(!b.trigger(w)){b.toFront();if(b.options.modal){var g=b._overlay(!1);d.duration?g.kendoStop().kendoAnimate({effects:{fade:{direction:"out",properties:{opacity:.5}}},duration:d.duration,show:!0}):g.css("opacity",.5).show()}c.is(u)||(e.css(F,"hidden"),c.show().kendoStop().kendoAnimate({effects:d.effects,duration:d.duration,complete:function(){b.trigger(x),e.css(F,f)}}))}b.options.isMaximized&&a("html, body").css(F,"hidden");return b},close:function(){var c=this,d=c.wrapper,e=c.options,f=e.animation.open,g=e.animation.close,h,i,j;d.is(u)&&!c.trigger(z)&&(h=L(),i=e.modal&&h.length==1,j=e.modal?c._overlay(!0):a(b),i?g.duration?j.kendoStop().kendoAnimate({effects:{fadeOut:{properties:{opacity:0}}},duration:g.duration,hide:!0}):j.hide():h.length&&K(h.eq(h.length-2))._overlay(!0),d.kendoStop().kendoAnimate({effects:g.effects||f.effects,reverse:g.reverse===!0,duration:g.duration,complete:function(){d.hide(),c.trigger(y)}})),c.options.isMaximized&&a("html, body").css(F,"");return c},toFront:function(){var b=this,c=b.wrapper,d=c[0],e=+c.css(G),f=e;a(m).each(function(b,c){var f=a(c),g=f.css(G),h=f.find(o);isNaN(g)||(e=Math.max(+g,e)),c!=d&&h.find("> ."+r).length>0&&h.append(l.overlay)});if(e==10001||f<e)c.css(G,e+2),b.element.find("> .k-overlay").remove();return b},toggleMaximization:function(){return this[this.options.isMaximized?"restore":"maximize"]()},restore:function(){var b=this,c=b.options,d=b.restoreOptions;if(!!c.isMaximized||!!c.isMinimized){b.wrapper.css({position:"absolute",left:d.left,top:d.top,width:d.width,height:d.height}).find(".k-window-content,.k-resize-handle").show().end().find(".k-window-titlebar .k-restore").parent().remove().end().end().find(H).parent().show(),a("html, body").css(F,""),c.isMaximized=c.isMinimized=!1,b.trigger(B);return b}},maximize:M("maximize",function(){var b=this,c=b.wrapper,d=c.position();h(b.restoreOptions,{left:d.left,top:d.top}),c.css({left:0,top:0,position:"fixed"}),a("html, body").css(F,"hidden"),b.options.isMaximized=!0,b._onDocumentResize()}),minimize:M("minimize",function(){var a=this;a.wrapper.css("height",""),a.element.hide(),a.options.isMinimized=!0}),_onDocumentResize:function(){var b=this,c=b.wrapper,d=a(window);!b.options.isMaximized||(c.css({width:d.width(),height:d.height()-parseInt(c.css("padding-top"),10)}),b.trigger(B))},refresh:function(b){var c=this,d=c.options,e=a(c.element),g,i=d.iframe,k;f(b)||(b={url:b}),b=h({},d.content,b),k=b.url,k?(typeof i=="undefined"&&(i=!I(k)),i?(g=e.find("."+r)[0],g?g.src=k||g.src:e.html(l.contentFrame(h({},d,{content:b})))):c._ajaxRequest(b)):b.template&&c.content(j(b.template)({}));return c},_ajaxRequest:function(b){var c=this,d=b.template,e=c.wrapper.find(".k-window-titlebar .k-refresh"),f=setTimeout(function(){e.addClass(s)},100);a.ajax(h({type:"GET",dataType:"html",cache:!1,error:g(function(a,b){c.trigger(E)},c),complete:function(){clearTimeout(f),e.removeClass(s)},success:g(function(a,b){d&&(a=j(d)(a||{})),c.element.html(a),c.trigger(A)},c)},b))},destroy:function(){var a=this,b,c;a.wrapper.remove(),b=L(),c=a.options.modal&&!b.length,c?a._overlay(!1).remove():b.length>0&&K(b.eq(b.length-2))._overlay(!0)},_createWindow:function(){var b=this,c=b.element,d=b.options,e,f;d.scrollable===!1&&c.attr("style","overflow:hidden;"),d.iframe&&c.html(l.contentFrame(d)),f=a(l.wrapper(d)),d.title!==!1&&f.append(l.titlebar(h(l,d))),f.toggleClass("k-rtl",!!b.element.closest(".k-rtl").length),e=c.find("iframe").map(function(a){var b=this.getAttribute("src");this.src="";return b}),f.appendTo(b.appendTo).append(c).find("iframe").each(function(a){this.src=e[a]})}});l={wrapper:j("<div class='k-widget k-window' />"),action:j("<a href='\\#' class='k-window-action k-link'><span class='k-icon k-#= name.toLowerCase() #'>#= name #</span></a>"),titlebar:j("<div class='k-window-titlebar k-header'>&nbsp;<span class='k-window-title'>#= title #</span><div class='k-window-actions k-header'># for (var i = 0; i < actions.length; i++) { ##= action({ name: actions[i] }) ## } #</div></div>"),overlay:"<div class='k-overlay' />",contentFrame:j("<iframe src='#= content.url #' title='#= title #' frameborder='0' class='"+r+"'>"+"This page requires frames in order to show content"+"</iframe>"),resizeHandle:j("<div class='k-resize-handle k-resize-#= data #'></div>")},O.prototype={dragstart:function(b){var c=this,d=c.owner,e=d.wrapper;c.elementPadding=parseInt(d.wrapper.css("padding-top"),10),c.initialCursorPosition=e.offset(),c.resizeDirection=b.currentTarget.prop("className").replace("k-resize-handle k-resize-","").split(""),c.initialSize={width:e.width(),height:e.height()},c.containerOffset=d.appendTo.offset(),e.append(l.overlay).find(p).not(b.currentTarget).hide(),a(k).css(v,b.currentTarget.css(v))},drag:function(a){var b=this,c=b.owner,d=c.wrapper,e=c.options,f=b.resizeDirection,g=b.containerOffset,h=b.initialCursorPosition,i=b.initialSize,j,k,l,m,n=a.x.location,o=a.y.location;f.indexOf("e")>=0?(j=n-h.left,d.width(J(j,e.minWidth,e.maxWidth))):f.indexOf("w")>=0&&(m=h.left+i.width,j=J(m-n,e.minWidth,e.maxWidth),d.css({left:m-j-g.left,width:j})),f.indexOf("s")>=0?(k=o-h.top-b.elementPadding,d.height(J(k,e.minHeight,e.maxHeight))):f.indexOf("n")>=0&&(l=h.top+i.height,k=J(l-o,e.minHeight,e.maxHeight),d.css({top:l-k-g.top,height:k})),c.trigger(B)},dragend:function(b){var c=this,d=c.owner,e=d.wrapper;e.find(q).remove().end().find(p).not(b.currentTarget).show(),a(k).css(v,""),d.touchScroller&&d.touchScroller.reset(),b.keyCode==27&&e.css(c.initialCursorPosition).css(c.initialSize);return!1}},P.prototype={dragstart:function(b){var c=this.owner,d=c.element,e=d.find(".k-window-actions"),f=c.appendTo.offset();c.trigger(C),c.initialWindowPosition=c.wrapper.position(),c.startPosition={left:b.x.client-c.initialWindowPosition.left,top:b.y.client-c.initialWindowPosition.top},e.length>0?c.minLeftPosition=e.outerWidth()+parseInt(e.css("right"),10)-d.outerWidth():c.minLeftPosition=20-d.outerWidth(),c.minLeftPosition-=f.left,c.minTopPosition=-f.top,c.wrapper.append(l.overlay).find(p).hide(),a(k).css(v,b.currentTarget.css(v))},drag:function(b){var c=this.owner,d={left:Math.max(b.x.client-c.startPosition.left,c.minLeftPosition),top:Math.max(b.y.client-c.startPosition.top,c.minTopPosition)};a(c.wrapper).css(d)},dragcancel:function(b){var c=this.owner;c.wrapper.find(p).show().end().find(q).remove(),a(k).css(v,""),b.currentTarget.closest(m).css(c.initialWindowPosition)},dragend:function(b){var c=this.owner;c.wrapper.find(p).show().end().find(q).remove(),a(k).css(v,""),c.trigger(D);return!1}},c.ui.plugin(N)}(jQuery),function(a,b){function bO(a,b,c){var d,e=a.length;for(d=0;d<e;d++)a[d][b]=c}function bN(a,b){return a-b}function bM(a){return typeof a!==R}function bL(a,b,c){return bK(a+(b-a)*c,v)}function bK(a,b){var c=l.pow(10,b||0);return l.round(a*c)/c}function bJ(a,b){return bK(l.floor(a/b)*b,z)}function bI(a,b){return bK(l.ceil(a/b)*b,z)}function bH(a,b){[].push.apply(a,b)}function bG(a){return a[a.length-1]}function bF(a,b){return k(a,b)!=-1}function bD(){return c.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}function bC(b,c){if(b.x1==c.x1&&b.y1==c.y1&&b.x2==c.x2&&b.y2==c.y2)return c;var d=l.min(b.x1,c.x1),e=l.max(b.x1,c.x1),f=l.min(b.x2,c.x2),g=l.max(b.x2,c.x2),h=l.min(b.y1,c.y1),i=l.max(b.y1,c.y1),j=l.min(b.y2,c.y2),k=l.max(b.y2,c.y2),m=[];m[0]=new $(e,h,f,i),m[1]=new $(d,i,e,j),m[2]=new $(f,i,g,j),m[3]=new $(e,j,f,k),b.x1==d&&b.y1==h||c.x1==d&&c.y1==h?(m[4]=new $(d,h,e,i),m[5]=new $(f,j,g,k)):(m[4]=new $(f,h,g,i),m[5]=new $(d,j,e,k));return a.grep(m,function(a){return a.height()>0&&a.width()>0})[0]}function bB(a,b,c,d,e){var f=e*B;return{x:c+(a-c)*l.cos(f)+(b-d)*l.sin(f),y:d-(a-c)*l.sin(f)+(b-d)*l.cos(f)}}function bz(a){var b=[];for(var c in a)b.push(c+a[c]);return b.sort().join(" ")}function by(a,b){var c=b-a;if(c===0){if(b===0)return.1;c=l.abs(b)}var d=l.pow(10,l.floor(l.log(c)/l.log(10))),e=bK(c/d,z),f=1;e<1.904762?f=.2:e<4.761904?f=.5:e<9.523809?f=1:f=2;return bK(d*f,z)}function bx(b,d,e){var f=bz(d),g=b+f+e,h=bx.cache[g];if(h)return h;var i=bx.measureBox,j=bx.baselineMarker.cloneNode(!1);i||(i=bx.measureBox=a("<div style='position: absolute; top: -4000px; left: -4000px;line-height: normal; visibility: hidden;' />").appendTo(c.body)[0]);for(var k in d)i.style[k]=d[k];i.innerHTML=b,i.appendChild(j);var m={width:i.offsetWidth-r,height:i.offsetHeight,baseline:j.offsetTop+r};if(e){var n=m.width,o=m.height,p=n/2,q=o/2,s=bB(0,0,p,q,e),t=bB(n,0,p,q,e),u=bB(n,o,p,q,e),v=bB(0,o,p,q,e);m.normalWidth=n,m.normalHeight=o,m.width=l.max(s.x,t.x,u.x,v.x)-l.min(s.x,t.x,u.x,v.x),m.height=l.max(s.y,t.y,u.y,v.y)-l.min(s.y,t.y,u.y,v.y)}bx.cache[g]=m;return m}function bu(a,b){return f.extend({init:function(a){this.view=a},decorate:function(c){var d=this,e=d.view,f=c.options.animation,g;f&&f.type===a&&e.options.transitions&&(g=c._animation=new b(c,f),e.animations.push(g));return c}})}function Y(a){var b={top:0,right:0,bottom:0,left:0};typeof a=="number"?b[Q]=b[O]=b[t]=b[G]=a:(b[Q]=a[Q]||0,b[O]=a[O]||0,b[t]=a[t]||0,b[G]=a[G]||0);return b}var c=document,d=window.kendo,e=d.dataviz={},f=d.Class,g=d.template,h=d.format,i=a.map,j=a.noop,k=a.inArray,l=Math,m=d.deepExtend,n=function(a){return g(a,{useWithBlock:!1,paramName:"d"})},o="k-",p=10,q="axisLabelClick",r=1,s="#000",t="bottom",u="center",v=3,w="clip",x="12px sans-serif",y=400,z=6,A=600,B=l.PI/180,C="fadeIn",D="height",E="k",F=600,G="left",H="linear",I=Number.MAX_VALUE,J=-Number.MAX_VALUE,K="none",L="onMinorTicks",M="outside",N="radial",O="right",P="swing",Q="top",R="undefined",S=/([A-Z])/g,T="width",U="#fff",V="x",W="y",X=.2,Z=f.extend({init:function(a,b){var c=this;c.x=bK(a||0,v),c.y=bK(b||0,v)}}),$=f.extend({init:function(a,b,c,d){var e=this;e.x1=a||0,e.x2=c||0,e.y1=b||0,e.y2=d||0},width:function(){return this.x2-this.x1},height:function(){return this.y2-this.y1},translate:function(a,b){var c=this;c.x1+=a,c.x2+=a,c.y1+=b,c.y2+=b;return c},move:function(a,b){var c=this,d=c.height(),e=c.width();c.x1=a,c.y1=b,c.x2=c.x1+e,c.y2=c.y1+d;return c},wrap:function(a){var b=this;b.x1=l.min(b.x1,a.x1),b.y1=l.min(b.y1,a.y1),b.x2=l.max(b.x2,a.x2),b.y2=l.max(b.y2,a.y2);return b},wrapPoint:function(a){this.wrap(new $(a.x,a.y,a.x,a.y));return this},snapTo:function(a,b){var c=this;if(b==V||!b)c.x1=a.x1,c.x2=a.x2;if(b==W||!b)c.y1=a.y1,c.y2=a.y2;return c},alignTo:function(a,b){var c=this,d=c.height(),e=c.width(),f=b==Q||b==t?W:V,g=f==W?d:e;b==Q||b==G?c[f+1]=a[f+1]-g:c[f+1]=a[f+2],c.x2=c.x1+e,c.y2=c.y1+d;return c},shrink:function(a,b){var c=this;c.x2-=a,c.y2-=b;return c},expand:function(a,b){this.shrink(-a,-b);return this},pad:function(a){var b=this,c=Y(a);b.x1-=c.left,b.x2+=c.right,b.y1-=c.top,b.y2+=c.bottom;return b},unpad:function(a){var b=this,c=Y(a);c.left=-c.left,c.top=-c.top,c.right=-c.right,c.bottom=-c.bottom;return b.pad(c)},clone:function(){var a=this;return new $(a.x1,a.y1,a.x2,a.y2)},center:function(){var a=this;return{x:a.x1+a.width()/2,y:a.y1+a.height()/2}},containsPoint:function(a,b){var c=this;return a>=c.x1&&a<=c.x2&&b>=c.y1&&b<=c.y2},points:function(){var a=this;return[new Z(a.x1,a.y1),new Z(a.x2,a.y1),new Z(a.x2,a.y2),new Z(a.x1,a.y2)]},getHash:function(){var a=this;return[a.x1,a.y1,a.x2,a.y2].join(",")}}),_=f.extend({init:function(a,b,c,d,e){var f=this;f.c=a,f.ir=b,f.r=c,f.startAngle=d,f.angle=e},clone:function(){var a=this;return new _(a.c,a.ir,a.r,a.startAngle,a.angle)},middle:function(){return this.startAngle+this.angle/2},radius:function(a,b){var c=this;b?c.ir=a:c.r=a;return c},point:function(a,b){var c=this,d=a*B,e=l.cos(d),f=l.sin(d),g=b?c.ir:c.r,h=c.c.x-e*g,i=c.c.y-f*g;return new Z(h,i)},getBBox:function(){var a=this,b=new $(I,I,J,J),c=bK(a.startAngle%360),d=bK((c+a.angle)%360),e=a.ir,f=[0,90,180,270,c,d].sort(bN),g=k(c,f),h=k(d,f),i,j,l;c==d?i=f:g<h?i=f.slice(g,h+1):i=[].concat(f.slice(0,h+1),f.slice(g,f.length));for(j=0;j<i.length;j++)l=a.point(i[j]),b.wrapPoint(l),b.wrapPoint(l,e);e||b.wrapPoint(a.c);return b}}),ba=_.extend({init:function(a,b,c,d){_.fn.init.call(this,a,0,b,c,d)},expand:function(a){this.r+=a;return this},clone:function(){var a=this;return new ba(a.c,a.r,a.startAngle,a.angle)},radius:function(a){return _.fn.radius.call(this,a)},point:function(a){return _.fn.point.call(this,a)}}),bb=f.extend({init:function(a){m(this,{height:40,rotation:90,radius:10,arcAngle:10},a)}}),bc=f.extend({init:function(a){var b=this;b.children=[],b.options=m({},b.options,a)},reflow:function(a){var b=this,c=b.children,d,e,f;for(e=0;e<c.length;e++)f=c[e],f.reflow(a),d=d?d.wrap(f.box):f.box.clone();b.box=d},getViewElements:function(a){var b=this,c=b.options,d=c.modelId,e=[],f,g=b.children,h,i,j=g.length;for(h=0;h<j;h++)i=g[h],i.discoverable||(i.options=m(i.options,{modelId:d})),e.push.apply(e,i.getViewElements(a));b.discoverable&&(f=b.getRoot(),f&&(f.modelMap[d]=b));return e},makeDiscoverable:function(){var a=this,b=a.options;b.modelId=bA(),a.discoverable=!0},getRoot:function(){var a=this.parent;return a?a.getRoot():null},translateChildren:function(a,b){var c=this,d=c.children,e=d.length,f;for(f=0;f<e;f++)d[f].box.translate(a,b)},append:function(){var a=this,b,c=arguments.length;bH(a.children,arguments);for(b=0;b<c;b++)arguments[b].parent=a}}),bd=bc.extend({init:function(a){var b=this;b.modelMap={},bc.fn.init.call(b,a)},options:{width:A,height:y,background:U,border:{color:s,width:0},margin:Y(5),zIndex:-1},reflow:function(){var a=this,b=a.options,c=a.children,d=new $(0,0,b.width,b.height);a.box=d.unpad(b.margin);for(var e=0;e<c.length;e++)c[e].reflow(d),d=bC(d,c[e].box)},getViewElements:function(a){var b=this,c=b.options,d=c.border||{},e=b.box.clone().pad(c.margin).unpad(d.width),f=[a.createRect(e,{stroke:d.width?d.color:"",strokeWidth:d.width,dashType:d.dashType,fill:c.background,zIndex:c.zIndex})];return f.concat(bc.fn.getViewElements.call(b,a))},getRoot:function(){return this}}),be=bc.extend({init:function(a){bc.fn.init.call(this,a)},options:{align:G,vAlign:Q,margin:{},padding:{},border:{color:s,width:0},background:"",width:0,height:0,visible:!0},reflow:function(a){var b=this,c,d,e=b.options,f=b.children,g=Y(e.margin),h=Y(e.padding),i=e.border,j=i.width;bc.fn.reflow.call(b,a),f.length===0?c=b.box=new $(0,0,e.width,e.height):c=b.box,d=b.contentBox=c.clone(),c.pad(h).pad(j).pad(g),b.align(a,V,e.align),b.align(a,W,e.vAlign),b.paddingBox=c.clone().unpad(g).unpad(j),b.translateChildren(c.x1-d.x1+g.left+j+h.left,c.y1-d.y1+g.top+j+h.top)},align:function(a,b,c){var d=this,e=d.box,f=b+1,g=b+2,h=b===V?T:D,i=e[h]();bF(c,[G,Q])?(e[f]=a[f],e[g]=e[f]+i):bF(c,[O,t])?(e[g]=a[g],e[f]=e[g]-i):c==u&&(e[f]=a[f]+(a[h]()-i)/2,e[g]=e[f]+i)},hasBox:function(){var a=this.options;return a.border.width||a.background},getViewElements:function(a,b){var c=this,d=c.options;if(!d.visible)return[];var e=d.border||{},f=[];c.hasBox()&&f.push(a.createRect(c.paddingBox,m({id:d.id,stroke:e.width?e.color:"",strokeWidth:e.width,dashType:e.dashType,strokeOpacity:d.opacity,fill:d.background,fillOpacity:d.opacity,animation:d.animation,zIndex:d.zIndex,data:{modelId:d.modelId}},b)));return f.concat(bc.fn.getViewElements.call(c,a))}}),bf=bc.extend({init:function(a,b){var c=this;bc.fn.init.call(c,b),c.content=a,c.reflow(new $)},options:{font:x,color:s,align:G,vAlign:""},reflow:function(a){var b=this,c=b.options,d,e;d=c.size=bx(b.content,{font:c.font},c.rotation),b.baseline=d.baseline,c.align==G?b.box=new $(a.x1,a.y1,a.x1+d.width,a.y1+d.height):c.align==O?b.box=new $(a.x2-d.width,a.y1,a.x2,a.y1+d.height):c.align==u&&(e=(a.width()-d.width)/2,b.box=new $(bK(a.x1+e,v),a.y1,bK(a.x2-e,v),a.y1+d.height)),c.vAlign==u?(e=(a.height()-d.height)/2,b.box=new $(b.box.x1,a.y1+e,b.box.x2,a.y2-e)):c.vAlign==t?b.box=new $(b.box.x1,a.y2-d.height,b.box.x2,a.y2):c.vAlign==Q&&(b.box=new $(b.box.x1,a.y1,b.box.x2,a.y1+d.height))},getViewElements:function(a){var b=this,c=b.options;bc.fn.getViewElements.call(this,a);return[a.createText(b.content,m({},c,{x:b.box.x1,y:b.box.y1,baseline:b.baseline,data:{modelId:c.modelId}}))]}}),bg=be.extend({init:function(a,b){var c=this,d;be.fn.init.call(c,b),b=c.options,b.template||(a=b.format?h(b.format,a):a),d=new bf(a,m({},b,{align:G,vAlign:Q})),c.append(d),c.hasBox()&&(d.options.id=bA()),c.reflow(new $)}}),bh=bc.extend({init:function(a){var b=this;bc.fn.init.call(b,a),b.append(new bg(b.options.text,m({},b.options,{vAlign:b.options.position})))},options:{text:"",color:s,position:Q,align:u,margin:Y(5),padding:Y(5)},reflow:function(a){var b=this;bc.fn.reflow.call(b,a),b.box.snapTo(a,V)}}),bi=bg.extend({init:function(a,b,c,d){var e=this,f=a;d.template&&(e.template=g(d.template),f=e.template({value:a,dataItem:c})),e.text=f,e.value=a,e.index=b,e.dataItem=c,e.options.id=bA(),bg.fn.init.call(e,f,d),e.makeDiscoverable()},click:function(b,c){var d=this;b.trigger(q,{element:a(c.target),value:d.value,text:d.text,index:d.index,dataItem:d.dataItem,axis:d.parent.options})}}),bj=bc.extend({init:function(a){var b=this;bc.fn.init.call(b,a),b.options.visible||(b.options=m({},b.options,{labels:{visible:!1},line:{visible:!1},margin:0,majorTickSize:0,minorTickSize:0})),b.options.minorTicks=m({},{color:b.options.line.color,width:b.options.line.width,visible:b.options.minorTickType!=K},b.options.minorTicks,{size:b.options.minorTickSize,align:b.options.minorTickType}),b.options.majorTicks=m({},{color:b.options.line.color,width:b.options.line.width,visible:b.options.majorTickType!=K},b.options.majorTicks,{size:b.options.majorTickSize,align:b.options.majorTickType}),b.createLabels(),b.createTitle()},options:{labels:{visible:!0,rotation:0,mirror:!1,step:1,skip:0},line:{width:1,color:s,visible:!0},title:{visible:!0,position:u},majorTicks:{align:M,size:4},minorTicks:{align:M,size:3},axisCrossingValue:0,majorTickType:M,minorTickType:K,minorGridLines:{visible:!1,width:1,color:s},margin:5,visible:!0,_align:!0},createLabels:function(){var a=this,b=a.options,c=b.vertical?O:u,d=m({},b.labels,{align:c,zIndex:b.zIndex,modelId:b.modelId}),e=d.step;a.labels=[];if(d.visible){var f=a.labelsCount(),g,h;for(h=d.skip;h<f;h+=e)g=a.createAxisLabel(h,d),a.append(g),a.labels.push(g)}},lineBox:function(){var a=this,b=a.options,c=a.box,d=b.vertical,e=b.labels.mirror,f=e?c.x1:c.x2,g=e?c.y2:c.y1;if(d)return new $(f,c.y1,f,c.y2);return new $(c.x1,g,c.x2,g)},createTitle:function(){var a=this,b=a.options,c=m({rotation:b.vertical?-90:0,text:"",zIndex:1},b.title),d;c.visible&&c.text&&(d=new bg(c.text,c),a.append(d),a.title=d)},renderTicks:function(a){function k(k,l,m,n,o){var p=o/l,q,r=k.length;if(n)for(q=0;q<r;q++){if(q%p===0)continue;g=f?e.x2:e.x2-m.size,h=f?e.y1-m.size:e.y1,i=k[q],j={strokeWidth:m.width,stroke:m.color,align:b.shouldAlign()},d.vertical?c.push(a.createLine(g,i,g+m.size,i,j)):c.push(a.createLine(i,h,i,h+m.size,j))}}var b=this,c=[],d=b.options,e=b.lineBox(),f=d.labels.mirror,g,h,i,j;k(b.getMajorTickPositions(),d.majorUnit,d.majorTicks,d.majorTicks.visible),k(b.getMinorTickPositions(),d.minorUnit,d.minorTicks,d.minorTicks.visible,d.majorTicks.visible?d.majorUnit:0);return c},shouldAlign:function(){return!0},getActualTickSize:function(){var a=this,b=a.options,c=0;b.majorTicks.visible&&b.minorTicks.visible?c=l.max(b.majorTicks.size,b.minorTicks.size):b.majorTicks.visible?c=b.majorTicks.size:b.minorTicks.visible&&(c=b.minorTicks.size);return c},renderPlotBands:function(a){var b=this,c=b.options,d=c.plotBands||[],e=c.vertical,f=[],g=b.parent,h,j,k,m;d.length&&(f=i(d,function(b){k=bM(b.from)?b.from:J,m=bM(b.to)?b.to:I,b.from=l.min(k,m),b.to=l.max(k,m),h=e?g.axisX.lineBox():g.axisX.getSlot(b.from,b.to),j=e?g.axisY.getSlot(b.from,b.to):g.axisY.lineBox();return a.createRect(new $(h.x1,j.y1,h.x2,j.y2),{fill:b.color,fillOpacity:b.opacity,zIndex:-1})}));return f},reflowAxis:function(a,b){var c=this,d=c.options,e=d.vertical,f=c.labels,g=f.length,h=c.getActualTickSize()+d.margin,i=0,j=0,k=c.title,m,n;for(n=0;n<g;n++)m=f[n],i=l.max(i,m.box.height()),j=l.max(j,m.box.width());k&&(e?j+=k.box.width():i+=k.box.height()),e?c.box=new $(a.x1,a.y1,a.x1+j+h,a.y2):c.box=new $(a.x1,a.y1,a.x2,a.y1+i+h),c.arrangeTitle(),c.arrangeLabels(j,i,b)},arrangeLabels:function(a,b,c){var d=this,e=d.options,f=e.labels,g=d.labels,h=e.vertical,i=d.lineBox(),j=e.labels.mirror,k=d.getMajorTickPositions(),l=d.getActualTickSize()+e.margin,m,n,o;for(o=0;o<g.length;o++){var p=g[o],q=f.skip+f.step*o,r=h?p.box.height():p.box.width(),s=k[q]-r/2,t,u,v,w;h?(c==L&&(t=k[q],u=k[q+1],v=t+(u-t)/2,s=v-r/2),w=i.x2,j?w+=l:w-=l+p.box.width(),m=p.box.move(w,s)):(c==L?(t=k[q],u=k[q+1]):(t=s,u=s+r),n=i.y1,j?n-=l+p.box.height():n+=l,m=new $(t,n,u,n+p.box.height())),p.reflow(m)}},arrangeTitle:function(){var a=this,b=a.options,c=b.labels.mirror,d=b.vertical,e=a.title;e&&(d?(e.options.align=c?O:G,e.options.vAlign=e.options.position):(e.options.align=e.options.position,e.options.vAlign=c?Q:t),e.reflow(a.box))}}),bk=bj.extend({init:function(a,b,c){var d=this,e=d.initDefaults(a,b,c);e.minorUnit=bM(c.minorUnit)?c.minorUnit:e.majorUnit/5,bj.fn.init.call(d,e)},options:{min:0,max:1,vertical:!0,majorGridLines:{visible:!0,width:1,color:s},zIndex:1},initDefaults:function(a,b,c){var d=this,e=d.autoAxisMin(a,b),f=d.autoAxisMax(a,b),g=by(e,f),h={majorUnit:g},i;e<0&&(e-=g),f>0&&(f+=g),h.min=bJ(e,g),h.max=bI(f,g),c&&(i=bM(c.min)||bM(c.max),i&&c.min===c.max&&(c.min>0?c.min=0:c.max=1),c.majorUnit?(h.min=bJ(h.min,c.majorUnit),h.max=bI(h.max,c.majorUnit)):i&&(c=m(h,c),h.majorUnit=by(c.min,c.max)));return m(h,c)},range:function(){var a=this.options;return{min:a.min,max:a.max}},reflow:function(a){this.reflowAxis(a)},getViewElements:function(a){var b=this,c=b.options,d=c.line,e=bc.fn.getViewElements.call(b,a),f=b.lineBox(),g;d.width>0&&d.visible&&(g={strokeWidth:d.width,stroke:d.color,dashType:d.dashType,zIndex:c.zIndex,align:b.shouldAlign()},c.vertical?e.push(a.createLine(f.x1,f.y1,f.x1,f.y2,g)):e.push(a.createLine(f.x1,f.y1,f.x2,f.y1,g)),bH(e,b.renderTicks(a)),bH(e,b.renderPlotBands(a)));return e},autoAxisMax:function(a,b){if(!a&&!b)return 1;var c;if(a<=0&&b<=0){b=a==b?0:b;var d=l.abs((b-a)/b);if(d>X)return 0;c=b-(a-b)/2}else a=a==b?0:a,c=b;return c},autoAxisMin:function(a,b){if(!a&&!b)return 0;var c;if(a>=0&&b>=0){a=a==b?0:a;var d=(b-a)/b;if(d>X)return 0;c=a-(b-a)/2}else b=a==b?0:b,c=a;return c},getDivisions:function(a){var b=this.options,c=b.max-b.min;return l.floor(bK(c/a,v))+1},getTickPositions:function(a){var b=this,c=b.options,d=c.vertical,e=c.reverse,f=b.lineBox(),g=d?f.height():f.width(),h=c.max-c.min,i=g/h,j=a*i,k=b.getDivisions(a),l=(d?-1:1)*(e?-1:1),m=l===1?1:2,n=f[(d?W:V)+m],o=[],p;for(p=0;p<k;p++)o.push(bK(n,v)),n=n+j*l;return o},getMajorTickPositions:function(){var a=this;return a.getTickPositions(a.options.majorUnit)},getMinorTickPositions:function(){var a=this;return a.getTickPositions(a.options.minorUnit)},lineBox:function(){var a=this,b=a.options,c=b.vertical,d=c?"height":"width",e=a.labels,f=bj.fn.lineBox.call(a),g=0,h=0;e.length>1&&(g=e[0].box[d]()/2,h=bG(e).box[d]()/2);return c?new $(f.x1,f.y1+g,f.x1,f.y2-h):new $(f.x1+g,f.y1,f.x2-h,f.y1)},getSlot:function(a,b){var c=this,d=c.options,e=d.reverse,f=d.vertical,g=f?W:V,h=c.lineBox(),i=h[g+(e?2:1)],j=f?h.height():h.width(),k=e?-1:1,m=k*(j/(d.max-d.min)),n,o,p=new $(h.x1,h.y1,h.x1,h.y1);a=bM(a)?a:d.axisCrossingValue,b=bM(b)?b:d.axisCrossingValue,a=l.max(l.min(a,d.max),d.min),b=l.max(l.min(b,d.max),d.min),f?(n=d.max-l.max(a,b),o=d.max-l.min(a,b)):(n=l.min(a,b)-d.min,o=l.max(a,b)-d.min),p[g+1]=i+m*(e?o:n),p[g+2]=i+m*(e?n:o);return p},labelsCount:function(){return this.getDivisions(this.options.majorUnit)},createAxisLabel:function(a,b){var c=this,d=c.options,e=bK(d.min+a*d.majorUnit,z);return new bi(e,a,null,b)}}),bl=f.extend({init:function(a){var b=this;b.children=[],b.options=m({},b.options,a)},render:function(){return this.template(this)},renderContent:function(){var a=this,b="",c=a.sortChildren(),d=c.length,e;for(e=0;e<d;e++)b+=c[e].render();return b},sortChildren:function(){var a=this,b=a.children,c,d;for(d=0,c=b.length;d<c;d++)b[d]._childIndex=d;return b.slice(0).sort(a.compareChildren)},refresh:a.noop,compareChildren:function(a,b){var c=a.options.zIndex||0,d=b.options.zIndex||0;if(c!==d)return c-d;return a._childIndex-b._childIndex},renderAttr:function(a,b){return bM(b)?" "+a+"='"+b+"' ":""},renderDataAttributes:function(){var a=this,b=a.options.data,c,d,e="";for(c in b)d="data-"+c.replace(S,"-$1").toLowerCase(),e+=a.renderAttr(d,b[c]);return e}}),bm=bl.extend({init:function(a){var b=this;bl.fn.init.call(b,a),b.definitions={},b.decorators=[],b.animations=[]},renderDefinitions:function(){var a=this.definitions,b,c="";for(b in a)a.hasOwnProperty(b)&&(c+=a[b].render());return c},decorate:function(a){var b=this.decorators,c,d=b.length,e;for(c=0;c<d;c++)e=b[c],this._decorateChildren(e,a),a=e.decorate.call(e,a);return a},_decorateChildren:function(a,b){var c=this,d=b.children,e,f=d.length;for(e=0;e<f;e++)c._decorateChildren(a,d[e]),d[e]=a.decorate.call(a,d[e])},setupAnimations:function(){var a=this.animations,b,c=a.length;for(b=0;b<c;b++)a[b].setup()},playAnimations:function(){var a=this.animations;while(a.length>0)a.shift().play()},buildGradient:function(a){var b=this,c=b._gradientCache,d,f,g;c||(c=b._gradientCache=[]),a&&(d=bz(a),f=c[d],g=e.Gradients[a.gradient],!f&&g&&(f=m({id:bA()},g,a),c[d]=f));return f}});e.Gradients={glass:{type:H,rotation:0,stops:[{offset:0,color:U,opacity:0},{offset:.1,color:U,opacity:0},{offset:.25,color:U,opacity:.3},{offset:.92,color:U,opacity:0},{offset:1,color:U,opacity:0}]},sharpBevel:{type:N,stops:[{offset:0,color:U,opacity:.55},{offset:.65,color:U,opacity:0},{offset:.95,color:U,opacity:0},{offset:.95,color:U,opacity:.25}]},roundedBevel:{type:N,stops:[{offset:.33,color:U,opacity:.06},{offset:.83,color:U,opacity:.2},{offset:.95,color:U,opacity:0}]}};var bn=f.extend({init:function(a,b){var c=this;c.options=m({},c.options,b),c.element=a},options:{duration:F,easing:P},play:function(){var b=this,d=b.options,e=b.element,f=d.delay||0,g=+(new Date)+f,h=d.duration,i=g+h,j=c.getElementById(e.options.id),k=a.easing[d.easing],m,n,o,p;setTimeout(function(){var a=function(){b._stopped||(m=+(new Date),n=l.min(m-g,h),o=n/h,p=k(o,n,0,1,h),b.step(p),e.refresh(j),m<i&&bE(a,j))};a()},f)},abort:function(){this._stopped=!0},setup:j,step:j}),bo=bn.extend({options:{duration:200,easing:H},setup:function(){var a=this,b=a.element.options;a.targetFillOpacity=b.fillOpacity,a.targetStrokeOpacity=b.strokeOpacity,b.fillOpacity=b.strokeOpacity=0},step:function(a){var b=this,c=b.element.options;c.fillOpacity=a*b.targetFillOpacity,c.strokeOpacity=a*b.targetStrokeOpacity}}),bp=bn.extend({options:{size:0,easing:H},setup:function(){var a=this.element.points;a[1].x=a[2].x=a[0].x},step:function(a){var b=this.options,c=bL(0,b.size,a),d=this.element.points;d[1].x=d[2].x=d[0].x+c}}),bq=bn.extend({options:{easing:H,duration:900},setup:function(){var a=this,b=a.element,c=b.options,d=a.options,e=d.center,f,g;c.rotation&&(f=d.startAngle,g=c.rotation[0],d.duration=l.max(l.abs(f-g)/d.speed*1e3,1),a.endState=g,c.rotation=[f,e.x,e.y])},step:function(a){var b=this,c=b.element;c.options.rotation&&(c.options.rotation[0]=bL(b.options.startAngle,b.endState,a))}}),br=bn.extend({options:{easing:P},setup:function(){var a=this,b=a.element,c=b.points,d=b.options,e=d.vertical?W:V,f=d.stackBase,g=d.aboveAxis,h,i=a.endState={top:c[0].y,right:c[1].x,bottom:c[3].y,left:c[0].x};e===W?h=bM(f)?f:i[g?t:Q]:h=bM(f)?f:i[g?G:O],a.startPosition=h,bO(c,e,h)},step:function(a){var b=this,c=b.startPosition,d=b.endState,e=b.element,f=e.points;e.options.vertical?(f[0].y=f[1].y=bL(c,d.top,a),f[2].y=f[3].y=bL(c,d.bottom,a)):(f[0].x=f[3].x=bL(c,d.left,a),f[1].x=f[2].x=bL(c,d.right,a))}}),bs=bn.extend({options:{easing:P,duration:1e3},setup:function(){var a=this,b=a.element,c=b.points,d=b.options.animation,e=d.vertical,f=d.reverse,g=a.axis=e?"y":"x",h,i,j,k=a.options.endPosition,m=a.initialState={top:c[0].y,right:c[1].x,bottom:c[3].y,left:c[0].x},n=!bM(a.options.endPosition);e?(j=f?"y2":"y1",h=m[n&&!f?t:Q],i=n?m[f?t:Q]:k[j]):(j=f?"x1":"x2",h=m[n&&!f?G:O],i=n?m[f?G:O]:k[j]),a.start=h,a.end=i,n?bO(c,g,a.start):d.speed&&(a.options.duration=l.max(l.abs(a.start-a.end)/d.speed*1e3,1))},step:function(a){var b=this,c=b.start,d=b.end,e=b.element,f=e.points,g=b.axis;e.options.animation.vertical?f[0][g]=f[1][g]=bL(c,d,a):f[1][g]=f[2][g]=bL(c,d,a)}}),bt=bn.extend({options:{easing:P,duration:1e3},setup:function(){var a=this,b=a.element,c=b.points,d=b.options.animation,e=d.vertical,f=e?"y":"x",g=d.startPosition[e?"y2":"x1"],h=d.size/2,i=c.length,j=!bM(a.options.endPosition),k=h,n,o,p;a.axis=f,a.endPositions=[],a.startPositions=[],j||(g=c[1][f],o=a.options.endPosition[e?"y1":"x2"],d.speed&&(a.options.duration=l.max(l.abs(g-o)/d.speed*1e3,1)));for(p=0;p<i;p++)n=m({},c[p]),j?(a.endPositions[p]=n[f],c[p][f]=g-k):a.endPositions[p]=o-k,a.startPositions[p]=c[p][f],k-=h},step:function(a){var b=this,c=b.startPositions,d=b.endPositions,e=b.element,f=e.points,g=b.axis,h=f.length,i;for(i=0;i<h;i++)f[i][g]=bL(c[i],d[i],a)}}),bv=bu(C,bo),bw=function(a){var b=this,c=bw.formats,d,e,f,g,h;if(arguments.length===1){a=b.resolveColor(a);for(g=0;g<c.length;g++)d=c[g].re,e=c[g].process,f=d.exec(a),f&&(h=e(f),b.r=h[0],b.g=h[1],b.b=h[2])}else b.r=arguments[0],b.g=arguments[1],b.b=arguments[2];b.r=b.normalizeByte(b.r),b.g=b.normalizeByte(b.g),b.b=b.normalizeByte(b.b)};bw.prototype={toHex:function(){var a=this,b=a.padDigit,c=a.r.toString(16),d=a.g.toString(16),e=a.b.toString(16);return"#"+b(c)+b(d)+b(e)},resolveColor:function(a){a=a||s,a.charAt(0)=="#"&&(a=a.substr(1,6)),a=a.replace(/ /g,""),a=a.toLowerCase(),a=bw.namedColors[a]||a;return a},normalizeByte:function(a){return a<0||isNaN(a)?0:a>255?255:a},padDigit:function(a){return a.length===1?"0"+a:a},brightness:function(a){var b=this,c=l.round;b.r=c(b.normalizeByte(b.r*a)),b.g=c(b.normalizeByte(b.g*a)),b.b=c(b.normalizeByte(b.b*a));return b}},bw.formats=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,process:function(a){return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10)]}},{re:/^(\w{2})(\w{2})(\w{2})$/,process:function(a){return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,process:function(a){return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)]}}],bw.namedColors={aqua:"00ffff",azure:"f0ffff",beige:"f5f5dc",black:"000000",blue:"0000ff",brown:"a52a2a",coral:"ff7f50",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgray:"a9a9a9",darkgreen:"006400",darkorange:"ff8c00",darkred:"8b0000",dimgray:"696969",fuchsia:"ff00ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lightblue:"add8e6",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumblue:"0000cd",navy:"000080",olive:"808000",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",pink:"ffc0cb",plum:"dda0dd",purple:"800080",red:"ff0000",royalblue:"4169e1",salmon:"fa8072",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",steelblue:"4682b4",tan:"d2b48c",teal:"008080",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"},bx.cache={},bx.baselineMarker=a("<div class='"+o+"baseline-marker' "+"style='display: inline-block; vertical-align: baseline;"+"width: "+r+"px; height: "+r+"px;"+"overflow: hidden;' />")[0];var bA=function(){var a=1;return function(){a=(a>>>1^-(a&1)&3489660929)>>>0;return E+a.toString(16)}}(),bE=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a,b){setTimeout(a,p)};m(d.dataviz,{init:function(a){d.init(a,d.dataviz.ui)},ui:{roles:{},themes:{},views:[],defaultView:function(){var a,b=e.ui.views,c=b.length;for(a=0;a<c;a++)if(b[a].available())return b[a];d.logToConsole("Warning: KendoUI DataViz cannot render. Possible causes:\n- The browser does not support SVG or VML. User agent: "+navigator.userAgent+"\n"+"- The kendo.dataviz.svg.js or kendo.dataviz.vml.js scripts are not loaded")},registerView:function(a){var b=e.ui.views[0];!b||a.preference>b.preference?e.ui.views.unshift(a):e.ui.views.push(a)},plugin:function(a){d.ui.plugin(a,e.ui)}},AXIS_LABEL_CLICK:q,COORD_PRECISION:v,DEFAULT_PRECISION:z,DEFAULT_WIDTH:A,DEFAULT_HEIGHT:y,DEFAULT_FONT:x,INITIAL_ANIMATION_DURATION:F,CLIP:w,Axis:bj,AxisLabel:bi,Box2D:$,BoxElement:be,ChartElement:bc,Color:bw,ElementAnimation:bn,ExpandAnimation:bp,ArrowAnimation:bt,BarAnimation:br,BarIndicatorAnimatin:bs,FadeAnimation:bo,FadeAnimationDecorator:bv,NumericAxis:bk,Point2D:Z,Ring:_,Pin:bb,RootElement:bd,RotationAnimation:bq,Sector:ba,Text:bf,TextBox:bg,Title:bh,ViewBase:bm,ViewElement:bl,animationDecorator:bu,append:bH,autoMajorUnit:by,defined:bM,getSpacing:Y,inArray:bF,interpolateValue:bL,last:bG,measureText:bx,rotatePoint:bB,round:bK,supportsSVG:bD,renderTemplate:n,uniqueId:bA})}(jQuery),function(){var a=window.kendo,b=a.dataviz,c=a.deepExtend,d="#000",e="Arial,Helvetica,sans-serif",f="11px "+e,g="12px "+e,h="16px "+e,i="#fff",j={title:{font:h},legend:{labels:{font:g}},seriesDefaults:{labels:{font:f}},axisDefaults:{labels:{font:g},title:{font:h,margin:5}},tooltip:{font:g}},k={black:c({},j,{title:{color:i},legend:{labels:{color:i}},seriesDefaults:{labels:{color:i},pie:{highlight:{opacity:.6,color:"#3d3d3d",border:{width:.5,opacity:.9,color:d}},overlay:{gradient:"sharpBevel"}},line:{markers:{background:"#3d3d3d"}},scatter:{markers:{background:"#3d3d3d"}},scatterLine:{markers:{background:"#3d3d3d"}},area:{opacity:.4,markers:{visible:!1,size:6}}},chartArea:{background:"#3d3d3d"},seriesColors:["#0081da","#3aafff","#99c900","#ffeb3d","#b20753","#ff4195"],categoryAxis:{majorGridLines:{visible:!0}},axisDefaults:{line:{color:"#8e8e8e"},labels:{color:i},majorGridLines:{color:"#545454"},minorGridLines:{color:"#454545"},title:{color:i}},tooltip:{background:"#3d3d3d",color:i,opacity:.8}}),"default":c({},j,{title:{color:"#8e8e8e"},legend:{labels:{color:"#232323"}},seriesDefaults:{labels:{color:d,background:i,opacity:.5},area:{opacity:.4,markers:{visible:!1,size:6}}},seriesColors:["#ff6800","#a0a700","#ff8d00","#678900","#ffb53c","#396000"],categoryAxis:{majorGridLines:{visible:!0}},axisDefaults:{line:{color:"#8e8e8e"},labels:{color:"#232323"},minorGridLines:{color:"#f0f0f0"},majorGridLines:{color:"#dfdfdf"},title:{color:"#232323"}},tooltip:{background:i,color:d,opacity:.8}}),blueopal:c({},j,{title:{color:"#293135"},legend:{labels:{color:"#293135"}},seriesDefaults:{labels:{color:d,background:i,opacity:.5},area:{opacity:.4,markers:{visible:!1,size:6}}},seriesColors:["#0069a5","#0098ee","#7bd2f6","#ffb800","#ff8517","#e34a00"],categoryAxis:{majorGridLines:{visible:!0}},axisDefaults:{line:{color:"#9aabb2"},labels:{color:"#293135"},majorGridLines:{color:"#c4d0d5"},minorGridLines:{color:"#edf1f2"},title:{color:"#293135"}},tooltip:{background:i,color:d,opacity:.8}}),silver:c({},j,{title:{color:"#4e5968"},legend:{labels:{color:"#4e5968"}},seriesDefaults:{labels:{color:"#293135",background:"#eaeaec",opacity:.5},line:{markers:{background:"#eaeaec"}},scatter:{markers:{background:"#eaeaec"}},scatterLine:{markers:{background:"#eaeaec"}},pie:{connectors:{color:"#A6B1C0"}},area:{opacity:.4,markers:{visible:!1,size:6}}},chartArea:{background:"#eaeaec"},seriesColors:["#007bc3","#76b800","#ffae00","#ef4c00","#a419b7","#430B62"],categoryAxis:{majorGridLines:{visible:!0}},axisDefaults:{line:{color:"#a6b1c0"},labels:{color:"#4e5968"},majorGridLines:{color:"#dcdcdf"},minorGridLines:{color:"#eeeeef"},title:{color:"#4e5968"}},tooltip:{background:i,color:"#4e5968",opacity:.8}}),metro:c({},j,{title:{color:"#777777"},legend:{labels:{color:"#777777"}},seriesDefaults:{labels:{color:d},area:{opacity:.4,markers:{visible:!1,size:6}}},seriesColors:["#25a0da","#309b46","#8ebc00","#ff6900","#e61e26","#d8e404","#16aba9","#7e51a1","#313131","#ed1691"],categoryAxis:{majorGridLines:{visible:!0}},axisDefaults:{line:{color:"#c7c7c7"},labels:{color:"#777777"},minorGridLines:{color:"#c7c7c7"},majorGridLines:{color:"#c7c7c7"},title:{color:"#777777"}},tooltip:{background:i,color:d}})};for(var l in k){var m=k[l].seriesDefaults;m.verticalLine=c({},m.line),m.verticalArea=c({},m.area)}var n={scale:{labels:{font:g}}},o={black:c({},n,{pointer:{color:"#0070e4"},scale:{rangePlaceholderColor:"#1d1d1d",labels:{color:i},minorTicks:{color:i},majorTicks:{color:i},line:{color:i}}}),blueopal:c({},n,{pointer:{color:"#005c83"},scale:{rangePlaceholderColor:"#daecf4",labels:{color:"#293135"},minorTicks:{color:"#293135"},majorTicks:{color:"#293135"},line:{color:"#293135"}}}),"default":c({},n,{pointer:{color:"#ea7001"},scale:{rangePlaceholderColor:"#dedede",labels:{color:"#2e2e2e"},minorTicks:{color:"#2e2e2e"},majorTicks:{color:"#2e2e2e"},line:{color:"#2e2e2e"}}}),metro:c({},n,{pointer:{color:"#8ebc00"},scale:{rangePlaceholderColor:"#e6e6e6",labels:{color:"#777"},minorTicks:{color:"#777"},majorTicks:{color:"#777"},line:{color:"#777"}}}),silver:c({},n,{pointer:{color:"#0879c0"},scale:{rangePlaceholderColor:"#f3f3f4",labels:{color:"#515967"},minorTicks:{color:"#515967"},majorTicks:{color:"#515967"},line:{color:"#515967"}}})};c(b.ui.themes,{chart:k,gauge:o})}(jQuery),function(a,b){function cO(a,b){if(b===null)return null;var c=cO.cache[a]=cO.cache[a]||q(a,!0);return c(b)}function cN(a){return a*a}function cM(a){var b=a.length,c=0,d;for(d=0;d<b;d++)c=f.max(c,a[d].data.length);return c}function cL(a,b,c){a[b]=(a[b]||0)+c}function cK(a,b){cJ(a,b),cG(a,b)}function cJ(b,d){var e=o({},(d||{}).axisDefaults);c(["category","value","x","y"],function(){var c=this+"Axis",d=[].concat(b[c]);d=a.map(d,function(a){var d=(a||{}).color;return o({},e,e[c],b.axisDefaults,{line:{color:d},labels:{color:d},title:{color:d}},a)}),b[c]=d.length>1?d:d[0]})}function cI(a){var b=a.series,c,d=b.length,e=a.seriesColors||[];for(c=0;c<d;c++)b[c].color=b[c].color||e[c%e.length]}function cH(a){delete a.bar,delete a.column,delete a.line,delete a.verticalLine,delete a.pie,delete a.area,delete a.verticalArea,delete a.scatter,delete a.scatterLine}function cG(a,b){var c=a.series,d,e=c.length,f,g=a.seriesDefaults,h=o({},a.seriesDefaults),i=b?o({},b.seriesDefaults):{},j=o({},i);cH(h),cH(j);for(d=0;d<e;d++)f=c[d].type||a.seriesDefaults.type,c[d]=o({},j,i[f],{tooltip:a.tooltip},h,g[f],c[d])}function cF(a,b,c,d){var e,f=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x),g=(d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y),h;g!==0&&(h=f/g,e=new B(a.x+h*(b.x-a.x),a.y+h*(b.y-a.y)));return e}function cE(a){var b=bv,c=bw,d,e=a.length,g;for(d=0;d<e;d++)g=a[d],J(g)&&(b=f.min(b,g),c=f.max(c,g));return{min:b,max:c}}function cD(a){return cE(a).max}function cC(a){return cE(a).min}var c=a.each,d=a.grep,e=a.map,f=Math,g=a.extend,h=a.proxy,i=document,j=window.kendo,k=j.Class,l=j.data.DataSource,m=j.ui.Widget,n=j.template,o=j.deepExtend,p=j.format,q=j.getter,r=j.dataviz,s=r.Axis,t=r.AxisLabel,u=r.BarAnimation,v=r.Box2D,w=r.BoxElement,x=r.ChartElement,y=r.Color,z=r.ElementAnimation,A=r.NumericAxis,B=r.Point2D,C=r.RootElement,D=r.Sector,E=r.Text,F=r.TextBox,G=r.Title,H=r.animationDecorator,I=r.append,J=r.defined,K=r.getSpacing,L=r.inArray,M=r.interpolateValue,N=r.last,O=r.round,P=r.renderTemplate,Q=r.uniqueId,R="k-",S="above",T="area",U=r.AXIS_LABEL_CLICK,V="bar",W=.8,X=1.5,Y=.4,Z="below",$="#000",_="bottom",ba="center",bb="change",bc="circle",bd="click",be=r.CLIP,bf="column",bg=r.COORD_PRECISION,bh="dataBound",bi=r.DEFAULT_FONT,bj=r.DEFAULT_HEIGHT,bk=r.DEFAULT_PRECISION,bl=r.DEFAULT_WIDTH,bm="fadeIn",bn="glass",bo=r.INITIAL_ANIMATION_DURATION,bp="insideBase",bq="insideEnd",br="interpolate",bs="left",bt="line",bu=8,bv=Number.MAX_VALUE,bw=-Number.MAX_VALUE,bx="mousemove.tracking",by="mouseover",bz="onMinorTicks",bA="outsideEnd",bB="_outline",bC="pie",bD=70,bE="primary",bF="right",bG="roundedBevel",bH="scatter",bI="scatterLine",bJ="seriesClick",bK="seriesHover",bL="string",bM="top",bN=150,bO=5,bP=100,bQ="triangle",bR="verticalLine",bS="verticalArea",bT="#fff",bU="x",bV="y",bW="zero",bX=[V,bf,bt,bR,T,bS],bY=[bH,bI],bZ=m.extend({init:function(a,b){var c=this,d,e,f=r.ui.themes.chart||{},g=(b||{}).dataSource,i;m.fn.init.call(c,a),d=o({},c.options,b),i=d.theme,e=i?f[i]||f[i.toLowerCase()]:{},cK(d,e),c.options=o({},e,d),cI(c.options),c.bind(c.events,c.options),c.element.addClass("k-chart"),c.wrapper=c.element,c._dataChangeHandler=h(c._onDataChanged,c),c.dataSource=l.create(g).bind(bb,c._dataChangeHandler),g&&d.autoBind&&c.dataSource.fetch(),c._redraw(),c._attachEvents(),j.notify(c,r.ui)},setDataSource:function(a){var b=this;b.dataSource&&b.dataSource.unbind(bb,b._dataChangeHandler),b.dataSource=a,a.bind(bb,b._dataChangeHandler),b.options.autoBind&&a.fetch()},events:[bh,bJ,bK,U],items:function(){return a()},options:{name:"Chart",theme:"default",chartArea:{},title:{visible:!0},legend:{visible:!0},valueAxis:{type:"Numeric"},categoryAxis:{type:"Category",categories:[]},autoBind:!0,seriesDefaults:{type:bf,data:[],groupNameTemplate:"#= group.value + (kendo.dataviz.defined(series.name) ? ': ' + series.name : '') #",bar:{gap:X,spacing:Y},column:{gap:X,spacing:Y},line:{width:4},scatterLine:{width:1},labels:{}},series:[],tooltip:{visible:!1},transitions:!0},refresh:function(){var a=this;cK(a.options),a.dataSource?a.dataSource.read():a._redraw()},redraw:function(){var a=this;cK(a.options),a._redraw()},_redraw:function(){var a=this,b=a.options,c=a.element,d=a._model=a._getModel(),e=r.ui.defaultView(),f;a._plotArea=d._plotArea,e&&(f=a._view=e.fromModel(d),c.css("position","relative"),a._viewElement=f.renderTo(c[0]),a._tooltip=new cB(c,b.tooltip),a._highlight=new cA(f,a._viewElement))},svg:function(){var a=this._getModel(),b=r.SVGView.fromModel(a);return b.render()},_getModel:function(){var a=this,b=a.options,c=a.element,d=new C(o({width:c.width()||bl,height:c.height()||bj,transitions:b.transitions},b.chartArea)),e;b.title&&b.title.visible&&b.title.text&&d.append(new G(b.title)),e=d._plotArea=a._createPlotArea(),b.legend.visible&&d.append(new b_(e.options.legend)),d.append(e),d.reflow();return d},_createPlotArea:function(){var a=this,b=a.options,c=b.series,d,e=c.length,f,g=[],h=[],i=[],j;for(d=0;d<e;d++)f=c[d],L(f.type,bX)?g.push(f):L(f.type,bY)?h.push(f):f.type===bC&&i.push(f);i.length>0?j=new cw(i,b):h.length>0?j=new cv(h,b):j=new ct(g,b);return j},_attachEvents:function(){var a=this,b=a.element;b.bind(bd,h(a._click,a)),b.bind(by,h(a._mouseOver,a))},_getChartElement:function(b){var c=a(b.target).data("modelId"),d=this._model,e;c&&(e=d.modelMap[c]);return e},_eventCoordinates:function(b){var c=this.element,d=c.offset(),e=parseInt(c.css("paddingLeft"),10),f=parseInt(c.css("paddingTop"),10),g=a(window);return{x:b.clientX-d.left-e+g.scrollLeft(),y:b.clientY-d.top-f+g.scrollTop()}},_click:function(a){var b=this,c=b._getChartElement(a);c&&c.click&&c.click(this,a)},_mouseOver:function(b){var c=this,d=c._tooltip,e=c._highlight,f,g;!!e&&e.element!==b.target&&(g=c._getChartElement(b),g&&g.hover&&(g.hover(c,b),c._activePoint=g,f=o({},c.options.tooltip,g.options.tooltip),f.visible&&d.show(g),e.show(g),a(i.body).bind(bx,h(c._mouseMove,c))))},_mouseMove:function(b){var c=this,d=c._tooltip,e=c._highlight,f=c._eventCoordinates(b),g=c._activePoint,h,j,k;c._plotArea.box.containsPoint(f.x,f.y)?g&&g.series&&(g.series.type===bt||g.series.type===T)&&(j=g.parent,k=j.getNearestPoint(f.x,f.y,g.seriesIx),k&&k!=g&&(k.hover(c,b),c._activePoint=k,h=o({},c.options.tooltip,g.options.tooltip),h.visible&&d.show(k),e.show(k))):(a(i.body).unbind(bx),delete c._activePoint,d.hide(),e.hide())},_onDataChanged:function(){var a=this,b=a.options,c=a._sourceSeries||b.series,d,e=c.length,f=a.dataSource.view(),g=(a.dataSource.group()||[]).length>0,h=[],i;for(d=0;d<e;d++)i=c[d],i.field||i.xField&&i.yField?(i.data=[],i.dataItems=f,[].push.apply(h,g?a._createGroupedSeries(i,f):[i])):h.push(i);a._sourceSeries=c,b.series=h,cI(a.options),a._bindSeries(),a._bindCategories(g?f[0].items:f),a.trigger(bh),a._redraw()},_createGroupedSeries:function(a,c){var d=[],e,f,g,h=c.length,i;a.groupNameTemplate&&(e=n(a.groupNameTemplate));for(g=0;g<h;g++)i=o({},a),i.color=b,d.push(i),f=c[g],i.dataItems=f.items,e&&(i.name=e({series:i,group:f}));return d},_bindSeries:function(){var a=this,c=a.options.series,d=c.length,e,f,g,h,i,j,k;for(e=0;e<d;e++){f=c[e],g=f.dataItems||[],i=g.length;for(h=0;h<i;h++)j=g[h],f.field?k=cO(f.field,j):f.xField&&f.yField?k=[cO(f.xField,j),cO(f.yField,j)]:k=b,h===0?(f.data=[k],f.dataItems=[j]):(f.data.push(k),f.dataItems.push(j))}},_bindCategories:function(a){var b=this.options.categoryAxis,c,d,e,f=a.length;if(b.field)for(c=0;c<f;c++)e=a[c],d=cO(b.field,e),c===0?(b.categories=[d],b.dataItems=[e]):(b.categories.push(d),b.dataItems.push(e))}}),b$=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.append(new F(a,c.options))},options:{position:bA,margin:K(3),padding:K(4),color:$,background:"",border:{width:1,color:""},aboveAxis:!0,vertical:!1,animation:{type:bm,delay:bo},zIndex:1},reflow:function(a){var b=this,c=b.options,d=c.vertical,e=c.aboveAxis,f=b.children[0],g=f.box,h=f.options.padding;f.options.align=d?ba:bs,f.options.vAlign=d?bM:ba,c.position==bq?d?(f.options.vAlign=bM,!e&&g.height()<a.height()&&(f.options.vAlign=_)):f.options.align=e?bF:bs:c.position==ba?(f.options.vAlign=ba,f.options.align=ba):c.position==bp?d?f.options.vAlign=e?_:bM:f.options.align=e?bs:bF:c.position==bA&&(d?e?a=new v(a.x1,a.y1-g.height(),a.x2,a.y1):a=new v(a.x1,a.y2,a.x2,a.y2+g.height()):(f.options.align=ba,e?a=new v(a.x2+g.width(),a.y1,a.x2,a.y2):a=new v(a.x1-g.width(),a.y1,a.x1,a.y2))),d?h.left=h.right=(a.width()-f.contentBox.width())/2:h.top=h.bottom=(a.height()-f.contentBox.height())/2,f.reflow(a)}}),b_=x.extend({init:function(a){var b=this;x.fn.init.call(b,a),b.createLabels()},options:{position:bF,items:[],labels:{},offsetX:0,offsetY:0,margin:K(10),padding:K(5),border:{color:$,width:0},background:"",zIndex:1},createLabels:function(){var a=this,b=a.options.items,c=b.length,d,e,f;for(f=0;f<c;f++)e=b[f].name,d=new E(e,a.options.labels),a.append(d)},reflow:function(a){var b=this,c=b.options,d=b.children.length;if(d===0)b.box=a.clone();else{if(c.position=="custom"){b.customLayout(a);return}c.position==bM||c.position==_?b.horizontalLayout(a):b.verticalLayout(a)}},getViewElements:function(a){var b=this,c=b.children,d=b.options,e=d.items,f=e.length,g=b.markerSize(),h=a.createGroup({zIndex:d.zIndex}),i=d.border||{},j,k,l,m,n,o,p;I(h.children,x.fn.getViewElements.call(b,a));for(p=0;p<f;p++)m=e[p].color,n=c[p],k=new v,o=n.box,l=l?l.wrap(o):o.clone(),k.x1=o.x1-g*2,k.x2=k.x1+g,d.position==bM||d.position==_?k.y1=o.y1+g/2:k.y1=o.y1+(o.height()-g)/2,k.y2=k.y1+g,h.children.push(a.createRect(k,{fill:m,stroke:m}));c.length>0&&(j=K(d.padding),j.left+=g*2,l.pad(j),h.children.unshift(a.createRect(l,{stroke:i.width?i.color:"",strokeWidth:i.width,dashType:i.dashType,fill:d.background})));return[h]},verticalLayout:function(a){var b=this,c=b.options,d=b.children,e=d.length,g=d[0].box.clone(),h,i,j=K(c.margin),k=b.markerSize()*2,l,m;for(m=1;m<e;m++)l=b.children[m],l.box.alignTo(b.children[m-1].box,_),g.wrap(l.box);c.position==bs?(h=a.x1+k+j.left,i=(a.y2-g.height())/2,g.x2+=k+j.left+j.right):(h=a.x2-g.width()-j.right,i=(a.y2-g.height())/2,g.translate(h,i),g.x1-=k+j.left),b.translateChildren(h+c.offsetX,i+c.offsetY);var n=g.width();g.x1=f.max(a.x1,g.x1),g.x2=g.x1+n,g.y1=a.y1,g.y2=a.y2,b.box=g},horizontalLayout:function(a){var b=this,c=b.options,d=b.children,e=d.length,f=d[0].box.clone(),g=b.markerSize()*3,h,i,j=K(c.margin),k=d[0].box.width()+g,l=a.width(),m,n=0,o;for(o=1;o<e;o++)m=d[o],k+=m.box.width()+g,k>l-g?(m.box=new v(f.x1,f.y2,f.x1+m.box.width(),f.y2+m.box.height()),k=m.box.width()+g,n=m.box.y1):(m.box.alignTo(d[o-1].box,bF),m.box.y2=n+m.box.height(),m.box.y1=n,m.box.translate(g,0)),f.wrap(m.box);h=(a.width()-f.width()+g)/2,c.position===bM?(i=a.y1+j.top,f.y2=a.y1+f.height()+j.top+j.bottom,f.y1=a.y1):(i=a.y2-f.height()-j.bottom,f.y1=a.y2-f.height()-j.top-j.bottom,f.y2=a.y2),b.translateChildren(h+c.offsetX,i+c.offsetY),f.x1=a.x1,f.x2=a.x2,b.box=f},customLayout:function(a){var b=this,c=b.options,d=b.children,e=d.length,f=d[0].box.clone(),g=b.markerSize()*2,h;for(h=1;h<e;h++)f=b.children[h].box,f.alignTo(b.children[h-1].box,_),f.wrap(f);b.translateChildren(c.offsetX+g,c.offsetY),b.box=a},markerSize:function(){var a=this,b=a.children;return b.length>0?b[0].box.height()/2:0}}),ca=s.extend({options:{categories:[],vertical:!1,majorGridLines:{visible:!1,width:1,color:$},zIndex:1},range:function(){return{min:0,max:this.options.categories.length}},reflow:function(a){this.reflowAxis(a,bz)},getViewElements:function(a){var b=this,c=b.options,d=c.line,e=b.lineBox(),f=x.fn.getViewElements.call(b,a),g;d.width>0&&d.visible&&(g={strokeWidth:d.width,stroke:d.color,dashType:d.dashType,zIndex:d.zIndex},f.push(a.createLine(e.x1,e.y1,e.x2,e.y2,g)),I(f,b.renderTicks(a)),I(f,b.renderPlotBands(a)));return f},getTickPositions:function(a){var b=this,c=b.options,d=c.vertical,e=d?b.box.height():b.box.width(),f=e/a,g=d?b.box.y1:b.box.x1,h=[],i;for(i=0;i<a;i++)h.push(O(g,bg)),g+=f;h.push(d?b.box.y2:b.box.x2);return c.reverse?h.reverse():h},getMajorTickPositions:function(){var a=this;return a.getTickPositions(a.options.categories.length)},getMinorTickPositions:function(){var a=this;return a.getTickPositions(a.options.categories.length*2)},getSlot:function(a,b){var c=this,d=c.options,e=d.reverse,g=d.vertical,h=g?bV:bU,i=c.lineBox(),j=new v(i.x1,i.y1,i.x1,i.y1),k=i[h+(e?2:1)],l=g?i.height():i.width(),m=f.max(1,d.categories.length),n=(e?-1:1)*(l/m),o,p,q;a=f.min(f.max(0,a),m),b=J(b)?b:a,b=f.max(f.min(m,b),a),o=k+a*n,p=o+n,q=b-a;if(q>0||a==b&&m==a)p=o+q*n;j[h+1]=e?p:o,j[h+2]=e?o:p;return j},labelsCount:function(){return this.options.categories.length},createAxisLabel:function(a,b){var c=this,d=c.options,e=d.dataItems?d.dataItems[a]:null,f=J(d.categories[a])?d.categories[a]:"";return new t(f,a,e,b)}}),cb=x.extend({init:function(a){var b=this;x.fn.init.call(b,a)},options:{vertical:!1,gap:0,spacing:0},reflow:function(a){var b=this,c=b.options,d=c.vertical,e=d?bV:bU,f=b.children,g=c.gap,h=c.spacing,i=f.length,j=i+g+h*(i-1),k=(d?a.height():a.width())/j,l=a[e+1]+k*(g/2),m,n;for(n=0;n<i;n++)m=(f[n].box||a).clone(),m[e+1]=l,m[e+2]=l+k,f[n].reflow(m),n<i-1&&(l+=k*h),l+=k}}),cc=x.extend({init:function(a){var b=this;x.fn.init.call(b,a)},options:{vertical:!0,isReversed:!1},reflow:function(a){var b=this,c=b.options,d=c.vertical,e=d?bU:bV,f=d?bV:bU,g=a[f+2],h=b.children,i=b.box=new v,j=h.length,k,l;c.isReversed?k=d?_:bs:k=d?bM:bF;for(l=0;l<j;l++){var m=h[l],n=m.box.clone();n.snapTo(a,e),m.options&&(m.options.stackBase=g),l===0?i=b.box=n.clone():n.alignTo(h[l-1].box,k),m.reflow(n),i.wrap(n)}}}),cd={click:function(b,c){var d=this;b.trigger(bJ,{value:d.value,category:d.category,series:d.series,dataItem:d.dataItem,element:a(c.target)})},hover:function(b,c){var d=this;b.trigger(bK,{value:d.value,category:d.category,series:d.series,dataItem:d.dataItem,element:a(c.target)})}},ce=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.value=a,c.options.id=Q(),c.makeDiscoverable()},options:{color:bT,border:{width:1},vertical:!0,overlay:{gradient:bn},aboveAxis:!0,labels:{visible:!1},animation:{type:V},opacity:1},render:function(){var a=this,b=a.value,c=a.options,d=c.labels,e=b,f;a._rendered||(a._rendered=!0,d.visible&&b&&(d.template&&(f=n(d.template),e=f({dataItem:a.dataItem,category:a.category,value:a.value,series:a.series})),a.append(new b$(e,o({vertical:c.vertical,id:Q()},c.labels)))))},reflow:function(a){this.render();var b=this,c=b.options,d=b.children,e=d[0];b.box=a,e&&(e.options.aboveAxis=c.aboveAxis,e.reflow(a))},getViewElements:function(a){var b=this,c=b.options,d=c.vertical,e=c.border.width>0?{stroke:b.getBorderColor(),strokeWidth:c.border.width,dashType:c.border.dashType}:{},f=b.box,g=o({id:c.id,fill:c.color,fillOpacity:c.opacity,strokeOpacity:c.opacity,vertical:c.vertical,aboveAxis:c.aboveAxis,stackBase:c.stackBase,animation:c.animation,data:{modelId:c.modelId}},e),h=[];c.overlay&&(g.overlay=o({rotation:d?0:90},c.overlay)),h.push(a.createRect(f,g)),I(h,x.fn.getViewElements.call(b,a));return h},getOutlineElement:function(a,b){var c=this,d=c.box;b=o({data:{modelId:c.options.modelId}},b);return a.createRect(d,b)},getBorderColor:function(){var a=this,b=a.options,c=b.color,d=b.border.color;J(d)||(d=(new y(c)).brightness(W).toHex());return d},tooltipAnchor:function(a,b){var c=this,d=c.options,e=c.box,f=d.vertical,g=d.aboveAxis,h,i;f?(h=e.x2+bO,i=g?e.y1:e.y2-b):d.isStacked?(h=e.x2-a,i=e.y1-b-bO):(h=e.x2+bO,i=e.y1);return new B(h,i)},formatPointValue:function(a){var b=this;return b.owner.formatPointValue(b.value,a)}});o(ce.fn,cd);var cf=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.plotArea=a,c.valueAxisRanges={},c.points=[],c.categoryPoints=[],c.seriesPoints=[],c.render()},options:{series:[],invertAxes:!1,isStacked:!1},render:function(){var a=this;a.traverseDataPoints(h(a.addValue,a))},addValue:function(a,b,c,d,e){var f=this,g,h=f.categoryPoints[c],i=f.seriesPoints[e];h||(f.categoryPoints[c]=h=[]),i||(f.seriesPoints[e]=i=[]),f.updateRange(a,c,d),g=f.createPoint(a,b,c,d,e),g&&(g.category=b,g.series=d,g.seriesIx=e,g.owner=f,g.dataItem=d.dataItems?d.dataItems[c]:{value:a}),f.points.push(g),i.push(g),h.push(g)},updateRange:function(a,b,c){var d=this,e=c.axis||bE,g=d.valueAxisRanges[e];J(a)&&(g=d.valueAxisRanges[e]=g||{min:bv,max:bw},g.min=f.min(g.min,a),g.max=f.max(g.max,a))},seriesValueAxis:function(a){return this.plotArea.namedValueAxes[(a||{}).axis||bE]},reflow:function(a){var b=this,c=b.options,d=c.invertAxes,e=b.plotArea,f=0,g=b.categorySlots=[],h=b.points,i=e.categoryAxis,j,k,l;b.traverseDataPoints(function(a,c,e,m){j=b.seriesValueAxis(m),k=j.options.axisCrossingValue,l=h[f++],l&&l.plotValue&&(a=l.plotValue);var n=b.categorySlot(i,e,j),o=b.valueSlot(j,a),p=d?o:n,q=d?n:o,r=new v(p.x1,q.y1,p.x2,q.y2),s=j.options.reverse?a<k:a>=k;l&&(l.options.aboveAxis=s,l.reflow(r)),g[e]||(g[e]=n)}),b.reflowCategories(g),b.box=a},reflowCategories:function(){},valueSlot:function(a,b){return a.getSlot(b)},categorySlot:function(a,b){return a.getSlot(b)},traverseDataPoints:function(a){var b=this,c=b.options,d=c.series,e=b.plotArea.options.categoryAxis.categories||[],f=cM(d),g,h,i,j,k;for(g=0;g<f;g++)for(h=0;h<d.length;h++)j=e[g],k=d[h],i=k.data[g],a(i,j,g,k,h)},formatPointValue:function(a,b){return p(b,a)}}),cg=cf.extend({init:function(a,b){var c=this;c._groupTotals={},c._groups=[],cf.fn.init.call(c,a,b)},render:function(){var a=this;cf.fn.render.apply(a),a.computeAxisRanges()},createPoint:function(a,b,c,d,e){var f=this,g=f.options,h=f.children,i=f.options.isStacked,j=o({},d.labels),k,l;i&&j.position==bA&&(j.position=bq),k=new ce(a,o({},{vertical:!g.invertAxes,overlay:d.overlay,labels:j,isStacked:i},d)),l=h[c],l||(l=new cb({vertical:g.invertAxes,gap:g.gap,spacing:g.spacing}),f.append(l));if(i){var m=f.getStackWrap(d,l),n,p;m.children.length===0?(n=new cc({vertical:!g.invertAxes}),p=new cc({vertical:!g.invertAxes,isReversed:!0}),m.append(n,p)):(n=m.children[0],p=m.children[1]),a>0?n.append(k):p.append(k)}else l.append(k);return k},getStackWrap:function(a,b){var c=b.children,d=a.stack,e,f,g=c.length;if(typeof d===bL){for(f=0;f<g;f++)if(c[f]._stackGroup===d){e=c[f];break}}else e=c[0];e||(e=new x,e._stackGroup=d,b.append(e));return e},updateRange:function(a,b,c){var d=this,e=d.options.isStacked,f=d.groupTotals(c.stack),g=f.positive,h=f.negative;J(a)&&(e?cL(a>0?g:h,b,a):cf.fn.updateRange.apply(d,arguments))},computeAxisRanges:function(){var a=this,b=a.options.isStacked,c,d;b&&(c=a.options.series[0].axis||bE,d=a.categoryTotals(),a.valueAxisRanges[c]={min:cC(d.negative.concat(0)),max:cD(d.positive.concat(0))})},seriesValueAxis:function(a){var b=this,c=b.options;return cf.fn.seriesValueAxis.call(b,c.isStacked?b.options.series[0]:a)},valueSlot:function(a,c){return a.getSlot(c,this.options.isStacked?0:b)},categorySlot:function(a,b,c){var d=this,e=d.options,f=a.getSlot(b),g,h;e.isStacked&&(h=c.getSlot(0,0),g=e.invertAxes?bU:bV,f[g+1]=f[g+2]=h[g+1]);return f},reflowCategories:function(a){var b=this,c=b.children,d=c.length,e;for(e=0;e<d;e++)c[e].reflow(a[e])},groupTotals:function(a){var b=this,c=typeof a===bL?a:"default",d=b._groupTotals[c];d||(d=b._groupTotals[c]={positive:[],negative:[]},b._groups.push(c));return d},categoryTotals:function(){var a=this,b=a._groups,c=a._groupTotals,d,e,f={positive:[],negative:[]},g,h=b.length;for(g=0;g<h;g++)d=b[g],e=c[d],I(f.positive,e.positive),I(f.negative,e.negative);return f}}),ch=w.extend({init:function(a){var b=this;w.fn.init.call(b,a)},options:{type:bc,align:ba,vAlign:ba},getViewElements:function(a,b){var c=this,d=c.options,e=d.type,f=c.paddingBox,g=w.fn.getViewElements.call(c,a,b)[0],h=f.width()/2;if(!g)return[];e===bQ?g=a.createPolyline([new B(f.x1+h,f.y1),new B(f.x1,f.y2),new B(f.x2,f.y2)],!0,g.options):e===bc&&(g=a.createCircle([O(f.x1+h,bg),O(f.y1+f.height()/2,bg)],h,g.options));return[g]}}),ci=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.value=a,c.options.id=Q(),c.makeDiscoverable()},options:{aboveAxis:!0,vertical:!0,markers:{visible:!0,background:bT,size:bu,type:bc,border:{width:2},opacity:1},labels:{visible:!1,position:S,margin:K(3),padding:K(4),animation:{type:bm,delay:bo}}},render:function(){var a=this,b=a.options,c=b.markers,d=b.labels,e=c.background,f=o({},c.border),g=a.value;if(!a._rendered){a._rendered=!0,J(f.color)||(f.color=(new y(e)).brightness(W).toHex()),a.marker=new ch({id:a.options.id,visible:c.visible,type:c.type,width:c.size,height:c.size,background:e,border:f,opacity:c.opacity}),a.append(a.marker);if(d.visible){if(d.template){var h=n(d.template);g=h({dataItem:a.dataItem,category:a.category,value:a.value,series:a.series})}else d.format&&(g=a.formatPointValue(d.format));a.label=new F(g,o({id:Q(),align:ba,vAlign:ba,margin:{left:5,right:5}},d,{format:""})),a.append(a.label)}}},markerBox:function(){return this.marker.box},reflow:function(a){var b=this,c=b.options,d=c.vertical,e=c.aboveAxis,f;b.render(),b.box=a,f=a.clone(),d?e?f.y1-=f.height():f.y2+=f.height():e?f.x1+=f.width():f.x2-=f.width(),b.marker.reflow(f),b.reflowLabel(f)},reflowLabel:function(a){var b=this,c=b.options,d=b.marker,e=b.label,f=c.labels.position;e&&(f=f===S?bM:f,f=f===Z?_:f,e.reflow(a),e.box.alignTo(d.box,f),e.reflow(e.box))},getOutlineElement:function(a,b){var c=this,d=c.marker;b=o({data:{modelId:c.options.modelId}},b);return d.getViewElements(a,o(b,{fill:d.options.border.color,fillOpacity:1,strokeOpacity:0}))[0]},tooltipAnchor:function(a,b){var c=this,d=c.marker.box,e=c.options.aboveAxis;return new B(d.x2+bO,e?d.y1-b:d.y2)},formatPointValue:function(a){var b=this;return b.owner.formatPointValue(b.value,a)}});o(ci.fn,cd);var cj=x.extend({init:function(a,b,c){var d=this;x.fn.init.call(d),d.linePoints=a,d.series=b,d.seriesIx=c,d.options.id=Q(),d.makeDiscoverable()},options:{},points:function(a){var b=this,c=b.linePoints.concat(a||[]),d=[],e,f=c.length,g;for(e=0;e<f;e++)g=c[e].markerBox().center(),d.push(new B(g.x,g.y));return d},getViewElements:function(a){var b=this,c=b.series;x.fn.getViewElements.call(b,a);return[a.createPolyline(b.points(),!1,{id:b.options.id,stroke:c.color,strokeWidth:c.width,strokeOpacity:c.opacity,fill:"",dashType:c.dashType,data:{modelId:b.options.modelId},zIndex:-1})]},click:function(a,b){var c=this,d=a._eventCoordinates(b),e=c.seriesIx,f=c.parent.getNearestPoint(d.x,d.y,e);f.click(a,b)},hover:function(a,b){var c=this,d=a._eventCoordinates(b),e=c.seriesIx,f=c.parent.getNearestPoint(d.x,d.y,e);f.hover(a,b)}}),ck={renderSegments:function(){var a=this,b=a.options,c=b.series,d=a.seriesPoints,e,f,g=d.length,h,i,j,k,l,m=[];for(f=0;f<g;f++){h=d[f],l=h.length,e=c[f],i=[];for(k=0;k<l;k++)j=h[k],j?i.push(j):e.missingValues!==br&&(i.length>1&&m.push(a.createSegment(i,e,f,N(m))),i=[]);i.length>1&&m.push(a.createSegment(i,e,f,N(m)))}a._segments=m,a.append.apply(a,m)},createSegment:function(a,b,c){return new cj(a,b,c)},getNearestPoint:function(a,b,c){var d=this,e=d.options.invertAxes,g=e?bV:bU,h=e?b:a,i=d.seriesPoints[c],j=bv,k=i.length,l,m,n,o,p;for(p=0;p<k;p++)l=i[p],l&&J(l.value)&&l.value!==null&&(m=l.box,n=f.abs(m.center()[g]-h),n<j&&(o=l,j=n));return o}},cl=cf.extend({init:function(a,b){var c=this;c._stackAxisRange={min:bv,max:bw},c._categoryTotals=[],c.makeDiscoverable(),cf.fn.init.call(c,a,b)},render:function(){var a=this;cf.fn.render.apply(a),a.computeAxisRanges(),a.renderSegments()},createPoint:function(a,b,c,d,e){var f=this,g=f.options,h=g.isStacked,i=f.categoryPoints[c],j,k=0;if(!J(a)||a===null)if(h||d.missingValues===bW)a=0;else return null;var l=new ci(a,o({vertical:!g.invertAxes,markers:{border:{color:d.color}}},d));h&&(j=N(i),j&&(k=j.plotValue),l.plotValue=a+k),f.append(l);return l},updateRange:function(a,b,c){var d=this,e=d.options.isStacked,g=d._stackAxisRange,h=d._categoryTotals;J(a)&&(e?(cL(h,b,a),g.min=f.min(g.min,cC(h)),g.max=f.max(g.max,cD(h))):cf.fn.updateRange.apply(d,arguments))},computeAxisRanges:function(){var a=this,b=a.options.isStacked,c;b&&(c=a.options.series[0].axis||bE,a.valueAxisRanges[c]=a._stackAxisRange)},getViewElements:function(a){var b=this,c=cf.fn.getViewElements.call(b,a),d=a.createGroup({animation:{type:be}});d.children=c;return[d]}});o(cl.fn,ck);var cm=cj.extend({init:function(a,b,c,d){var e=this;e.stackPoints=b,cj.fn.init.call(e,a,c,d)},points:function(){var a=this,b=a.parent,c=b.options.isStacked&&a.seriesIx>0,d=b.plotArea,e=b.options.invertAxes,f=d.categoryAxis.lineBox(),g=e?f.x1:f.y1,h=a.stackPoints,i=cj.fn.points.call(a,h),j,k;!c&&i.length>1&&(j=i[0],k=N(i),e?(i.unshift(new B(g,j.y)),i.push(new B(g,k.y))):(i.unshift(new B(j.x,g)),i.push(new B(k.x,g))));return i},getViewElements:function(a){var b=this,c=b.series,d=o({color:c.color,opacity:c.opacity},c.line);x.fn.getViewElements.call(b,a);return[a.createPolyline(b.points(),!0,{id:b.options.id,stroke:d.color,strokeWidth:d.width,strokeOpacity:d.opacity,dashType:d.dashType,fillOpacity:c.opacity,fill:c.color,stack:c.stack,data:{modelId:b.options.modelId},zIndex:-1})]}}),cn=cl.extend({createSegment:function(a,b,c,d){var e=this,f=e.options,g;f.isStacked&&c>0&&(g=d.linePoints.slice(0).reverse());return new cm(a,g,b,c)}}),co=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.plotArea=a,c.xAxisRanges={},c.yAxisRanges={},c.points=[],c.seriesPoints=[],c.render()},options:{series:[],tooltip:{format:"{0}, {1}"},labels:{format:"{0}, {1}"}},render:function(){var a=this;a.traverseDataPoints(h(a.addValue,a))},addValue:function(a,b){var c=this,d,e=b.seriesIx,f=c.seriesPoints[e];c.updateRange(a,b.series),d=c.createPoint(a,b.series,e),d&&g(d,b),c.points.push(d),f.push(d)},updateRange:function(a,b){var c=this,d=a.x,e=a.y,g=b.xAxis||bE,h=b.yAxis||bE,i=c.xAxisRanges[g],j=c.yAxisRanges[h];J(d)&&d!==null&&(i=c.xAxisRanges[g]=i||{min:bv,max:bw},i.min=f.min(i.min,d),i.max=f.max(i.max,d)),J(e)&&e!==null&&(j=c.yAxisRanges[h]=j||{min:bv,max:bw},j.min=f.min(j.min,e),j.max=f.max(j.max,e))},createPoint:function(a,b,c){var d=this,e,f=a.x,g=a.y;if(!J(f)||f===null||!J(g)||g===null)return null;e=new ci(a,o({markers:{border:{color:b.color},opacity:b.opacity},tooltip:{format:d.options.tooltip.format},labels:{format:d.options.labels.format}},b)),d.append(e);return e},seriesAxes:function(a){var b=this.plotArea,c=a.xAxis||bE,d=a.yAxis||bE;return{x:b.namedXAxes[c],y:b.namedYAxes[d]}},reflow:function(a){var b=this,c=b.points,d=0,e,f;b.traverseDataPoints(function(a,g){e=c[d++],f=b.seriesAxes(g.series);var h=f.x.getSlot(a.x,a.x),i=f.y.getSlot(a.y,a.y),j=new v(h.x1,i.y1,h.x2,i.y2);e&&e.reflow(j)}),b.box=a},getViewElements:function(a){var b=this,c=x.fn.getViewElements.call(b,a),d=a.createGroup({animation:{type:be}});d.children=c;return[d]},traverseDataPoints:function(a){var b=this,c=b.options,d=c.series,e=b.seriesPoints,f=0,g,h,i,j,k,l;for(g=0;g<d.length;g++){h=d[g],i=e[g],i||(e[g]=[]);for(f=0;f<h.data.length;f++)l=h.data[f]||[],j=h.dataItems,k={x:l[0],y:l[1]},a(k,{pointIx:f,series:h,seriesIx:g,dataItem:j?j[f]:k,owner:b})}},formatPointValue:function(a,b){return p(b,a.x,a.y)}}),cp=co.extend({render:function(){var a=this;co.fn.render.call(a),a.renderSegments()},getViewElements:function(a){var b=this,c=co.fn.getViewElements.call(b,a),d=a.createGroup({animation:{type:be}});d.children=c;return[d]}});o(cp.fn,ck);var cq=x.extend({init:function(a,b,c){var d=this;d.value=a,d.sector=b,d.makeDiscoverable(),x.fn.init.call(d,c)},options:{color:bT,overlay:{gradient:bG},border:{width:.5},labels:{visible:!1,distance:35,font:bi,margin:K(.5),align:bc,zIndex:1,position:bA},animation:{type:bC},highlight:{visible:!0,border:{width:1}}},render:function(){var a=this,b=a.options,c=b.labels,d=a.value,e;a._rendered||(a._rendered=!0,c.template&&(e=n(c.template),d=e({dataItem:a.dataItem,category:a.category,value:a.value,series:a.series,percentage:a.percentage})),c.visible&&(a.label=new F(d,o({},c,{id:Q(),align:ba,vAlign:"",animation:{type:bm,delay:a.categoryIx*bD}})),a.append(a.label)))},reflow:function(a){var b=this;b.render(),b.box=a,a.clone(),b.reflowLabel()},reflowLabel:function(){var a=this,b=a.sector.clone(),c=a.options,d=a.label,e=c.labels,g=e.distance,h,i,j=b.middle(),k,l;d&&(l=d.box.height(),k=d.box.width(),e.position==ba?(b.r=f.abs((b.r-l)/2)+l,h=b.point(j),d.reflow(new v(h.x,h.y-l/2,h.x,h.y))):e.position==bq?(b.r=b.r-l/2,h=b.point(j),d.reflow(new v(h.x,h.y-l/2,h.x,h.y))):(h=b.clone().expand(g).point(j),h.x>=b.c.x?(i=h.x+k,d.orientation=bF):(i=h.x-k,d.orientation=bs),d.reflow(new v(i,h.y-l,h.x,h.y))))},getViewElements:function(a){var b=this,c=b.sector,d=b.options,e=d.border||{},f=e.width>0?{stroke:e.color,strokeWidth:e.width,dashType:e.dashType}:{},g=[],h=d.overlay;h&&(h=o({},d.overlay,{r:c.r,cx:c.c.x,cy:c.c.y,bbox:c.getBBox()})),b.value!==0&&g.push(a.createSector(c,o({id:d.id,fill:d.color,overlay:h,fillOpacity:d.opacity,strokeOpacity:d.opacity,animation:o(d.animation,{delay:b.categoryIx*bD}),data:{modelId:d.modelId}},f))),I(g,x.fn.getViewElements.call(b,a));return g},getOutlineElement:function(a,b){var c=this,d=c.options.highlight||{},e=d.border||{},f=c.options.id+bB,g;b=o({},b,{id:f}),c.value!==0&&(g=a.createSector(c.sector,o({},b,{fill:d.color,fillOpacity:d.opacity,strokeOpacity:e.opacity,strokeWidth:e.width,stroke:e.color,data:{modelId:c.options.modelId}})));return g},tooltipAnchor:function(a,b){var c=a/2,d=b/2,e=f.sqrt(c*c+d*d),g=this.sector.clone().expand(e+bO),h=g.point(g.middle());return new B(h.x-c,h.y-d)},formatPointValue:function(a){var b=this;return b.owner.formatPointValue(b.value,a)}});o(cq.fn,cd);var cr=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.plotArea=a,c.segments=[],c.seriesPoints=[],c.render()},options:{startAngle:90,connectors:{width:1,color:"#939393",padding:4}},render:function(){var a=this;a.traverseDataPoints(h(a.addValue,a))},traverseDataPoints:function(a){var b=this,c=b.options,d=b.plotArea.options.seriesColors||[],e=c.startAngle,f=d.length,g=c.series,h,i,j,k,l,m,n,o,p,q,r;for(k=0;k<g.length;k++){i=g[k],h=i.dataItems,m=i.data,q=b.pointsTotal(m),n=360/q;for(r=0;r<m.length;r++)j=b.pointData(i,r),o=j.value,l=O(o*n,bk),p=m.length!=1&&!!j.explode,i.color=j.color?j.color:d[r%f],a(o,new D(null,0,e,l),{owner:b,category:j.category||"",categoryIx:r,series:i,seriesIx:k,dataItem:h?h[r]:j,percentage:o/q,explode:p,visibleInLegend:j.visibleInLegend}),e+=l}},addValue:function(a,b,c){var d=this,e;e=new cq(a,b,c.series),e.options.id=Q(),g(e,c),d.append(e),d.segments.push(e)},pointValue:function(a){return J(a.value)?a.value:a},pointData:function(a,b){var c=this,d=a.data[b],e=["category","color","explode","visibleInLegend"],f=e.length,g,h,i={},j;for(j=0;j<f;j++)h=e[j],g=c.pointGetter(a,b,h),g!==""&&(i[h]=g);i.value=c.pointValue(d);return i},pointGetter:function(a,b,c){var d=a[c+"Field"],e=a.data[b],f=e[c];return d&&a.dataItems?cO(d,a.dataItems[b]):J(f)?f:""},pointsTotal:function(a){var b=this,c=a.length,d=0,e;for(e=0;e<c;e++)d+=b.pointValue(a[e]);return d},reflow:function(a){var b=this,c=b.options,d=a.clone(),e=5,g=f.min(d.width(),d.height()),h=g/2,i=g-g*.85,j=J(c.padding)?c.padding:i,k=new v(d.x1,d.y1,d.x1+g,d.y1+g),l=k.center(),m=d.center(),n=b.segments,o=n.length,p=[],q=[],r,s,t,u;j=j>h-e?h-e:j,k.translate(m.x-l.x,m.y-l.y);for(u=0;u<o;u++)s=n[u],t=s.sector,t.r=h-j,t.c=new B(t.r+k.x1+j,t.r+k.y1+j),s.explode&&(t.c=t.clone().radius(t.r*.15).point(t.middle())),s.reflow(k),r=s.label,r&&r.options.position===bA&&(r.orientation===bF?q.push(r):p.push(r));p.length>0&&(p.sort(b.labelComparator(!0)),b.leftLabelsReflow(p)),q.length>0&&(q.sort(b.labelComparator(!1)),b.rightLabelsReflow(q)),b.box=k},leftLabelsReflow:function(a){var b=this,c=b.distanceBetweenLabels(a);b.distributeLabels(c,a)},rightLabelsReflow:function(a){var b=this,c=b.distanceBetweenLabels(a);b.distributeLabels(c,a)},distanceBetweenLabels:function(a){var b=this,c=b.segments[0],d=c.sector,e=a[0].box,f,g=a.length-1,h=[],i,j=d.r+c.options.labels.distance,k;i=O(e.y1-(d.c.y-j-e.height()-e.height()/2)),h.push(i);for(k=0;k<g;k++)e=a[k].box,f=a[k+1].box,i=O(f.y1-e.y2),h.push(i);i=O(d.c.y+j-a[g].box.y2-a[g].box.height()/2),h.push(i);return h},distributeLabels:function(a,b){var c=this,d=a.length,e,f,g,h;for(h=0;h<d;h++){f=g=h,e=-a[h];while(e>0&&(f>=0||g<d))e=c._takeDistance(a,h,--f,e),e=c._takeDistance(a,h,++g,e)}c.reflowLabels(a,b)},_takeDistance:function(a,b,c,d){if(a[c]>0){var e=f.min(a[c],d);d-=e,a[c]-=e,a[b]+=e}return d},reflowLabels:function(a,b){var c=this,d=c.segments,e=d[0],f=e.sector,g=b.length,h=e.options.labels,i=h.distance,j=f.c.y-(f.r+i)-b[0].box.height(),k,l,m,n;a[0]+=2;for(n=0;n<g;n++)k=b[n],j+=a[n],m=k.box,l=c.hAlignLabel(m.x2,f.clone().expand(i),j,j+m.height(),k.orientation==bF),k.orientation==bF?(h.align!==bc&&(l=f.r+f.c.x+i),k.reflow(new v(l+m.width(),j,l,j))):(h.align!==bc&&(l=f.c.x-f.r-i),k.reflow(new v(l-m.width(),j,l,j))),j+=m.height()},getViewElements:function(a){var b=this,c=b.options,d=c.connectors,e=b.segments,g,h,i=e.length,j=4,k,l=[],m,n,o,p,q;for(q=0;q<i;q++){n=e[q],h=n.sector,k=h.middle(),p=n.label,o={seriesId:n.seriesIx};if(p){m=[];if(p.options.position===bA&&n.value!==0){var r=p.box,s=h.c,t=h.point(k),u=new B(r.x1,r.center().y),v,w,y;t=h.clone().expand(d.padding).point(k),m.push(t),p.orientation==bF?(w=new B(r.x1-d.padding,r.center().y),y=cF(s,t,u,w),u=new B(w.x-j,w.y),y=y||u,y.x=f.min(y.x,u.x),b.pointInCircle(y,h.c,h.r+j)||y.x<h.c.x?(v=h.c.x+h.r+j,n.options.labels.align!==bf?v<u.x?m.push(new B(v,t.y)):m.push(new B(t.x+j*2,t.y)):m.push(new B(v,t.y)),m.push(new B(u.x,w.y))):(y.y=w.y,m.push(y))):(w=new B(r.x2+d.padding,r.center().y),y=cF(s,t,u,w),u=new B(w.x+j,w.y),y=y||u,y.x=f.max(y.x,u.x),b.pointInCircle(y,h.c,h.r+j)||y.x>h.c.x?(v=h.c.x-h.r-j,n.options.labels.align!==bf?v>u.x?m.push(new B(v,t.y)):m.push(new B(t.x-j*2,t.y)):m.push(new B(v,t.y)),m.push(new B(u.x,w.y))):(y.y=w.y,m.push(y))),m.push(w),g=a.createPolyline(m,!1,{id:Q(),stroke:d.color,strokeWidth:d.width,animation:{type:bm,delay:n.categoryIx*bD},data:{modelId:n.options.modelId}}),l.push(g)}}}I(l,x.fn.getViewElements.call(b,a));return l},labelComparator:function(a){a=a?-1:1;return function(b,c){b=(b.parent.sector.middle()+270)%360,c=(c.parent.sector.middle()+270)%360;return(b-c)*a}},hAlignLabel:function(a,b,c,d,e){var g=b.c.x,h=b.c.y,i=b.r,j=f.min(f.abs(h-c),f.abs(h-d));return j>i?a:g+f.sqrt(i*i-j*j)*(e?1:-1)},pointInCircle:function(a,b,c){return cN(b.x-a.x)+cN(b.y-a.y)<cN(c)},formatPointValue:function(a,b){return p(b,a)}}),cs=x.extend({init:function(a,b){var c=this;x.fn.init.call(c,b),c.series=a,c.charts=[],c.options.legend.items=[],c.axes=[],c.render()},options:{series:[],plotArea:{margin:{}},background:"",border:{color:$,width:0},legend:{}},appendChart:function(a){var b=this;b.charts.push(a),b.addToLegend(a),b.append(a)},addToLegend:function(a){var b=a.options.series,c=b.length,d=[],e,f;for(e=0;e<c;e++)f=b[e],f.visibleInLegend!==!1&&d.push({name:f.name||"",color:f.color});I(this.options.legend.items,d)},reflow:function(a){var b=this,c=b.options.plotArea,d=K(c.margin);b.box=a.clone(),b.box.unpad(d),b.axes.length>0&&(b.reflowAxes(),b.box=b.axisBox()),b.reflowCharts()},axisCrossingValues:function(a,b){var c=a.options,d=[].concat(c.axisCrossingValue),e=b.length-d.length,f=d[0]||0,g;for(g=0;g<e;g++)d.push(f);return d},alignAxisTo:function(a,b,c,d){var e=a.getSlot(c,c),f=a.options.reverse?2:1,g=b.getSlot(d,d),h=b.options.reverse?2:1;a.reflow(a.box.translate(g[bU+h]-e[bU+f],g[bV+h]-e[bV+f]))},alignAxes:function(a,b){var c=this,d=a[0],e=b[0],f=c.axisCrossingValues(d,b),g=c.axisCrossingValues(e,a),h,i,j,k,l,m;for(m=0;m<b.length;m++)l=b[m],c.alignAxisTo(l,d,g[m],f[m]),l.lineBox().x1===d.lineBox().x1&&(h&&l.reflow(l.box.alignTo(h.box,bs).translate(-l.options.margin,0)),h=l),l.lineBox().x2===d.lineBox().x2&&(l._mirrored||(l.options.labels.mirror=!l.options.labels.mirror,l._mirrored=!0),c.alignAxisTo(l,d,g[m],f[m]),i&&l.reflow(l.box.alignTo(i.box,bF).translate(l.options.margin,0)),i=l);for(m=0;m<a.length;m++)l=a[m],c.alignAxisTo(l,e,f[m],g[m]),l.lineBox().y1===e.lineBox().y1&&(l._mirrored||(l.options.labels.mirror=!l.options.labels.mirror,l._mirrored=!0),c.alignAxisTo(l,e,f[m],g[m]),j&&l.reflow(l.box.alignTo(j.box,bM).translate(0,-l.options.margin)),j=l),l.lineBox().y2===e.lineBox().y2&&(k&&l.reflow(l.box.alignTo(k.box,_).translate(0,l.options.margin)),k=l)},axisBox:function(){var a=this,b=a.axes,c=b[0].box.clone(),d,e=b.length;for(d=1;d<e;d++)c.wrap(b[d].box);return c},shrinkAxes:function(){var a=this,b=a.box,c=a.axisBox(),d=c.height()-b.height(),e=c.width()-b.width(),f=a.axes,g,h,i,j=f.length;for(i=0;i<j;i++)g=f[i],h=g.options.vertical,g.reflow(g.box.shrink(h?0:e,h?d:0))},shrinkAdditionalAxes:function(a,b){var c=this,d=c.axes,e=a[0],g=b[0],h=e.lineBox().clone().wrap(g.lineBox()),i,j,k,l,m,n,o=d.length;for(n=0;n<o;n++)k=d[n],l=k.options.vertical,m=k.lineBox(),i=f.max(0,m.x2-h.x2)+f.max(0,h.x1-m.x1),j=f.max(0,m.y2-h.y2)+f.max(0,h.y1-m.y1),k.reflow(k.box.shrink(l?0:i,l?j:0))},fitAxes:function(){var a=this,b=a.axes,c=a.box,d=a.axisBox(),e=c.x1-d.x1,f=c.y1-d.y1,g,h,i=b.length;for(h=0;h<i;h++)g=b[h],g.reflow(g.box.translate(e,f))},reflowAxes:function(){var a=this,b=a.axes,c=d(b,function(a){return!a.options.vertical}),e=d(b,function(a){return a.options.vertical}),f,g=b.length;for(f=0;f<g;f++)b[f].reflow(a.box);a.alignAxes(c,e),a.shrinkAdditionalAxes(c,e),a.alignAxes(c,e),a.shrinkAxes(),a.alignAxes(c,e),a.fitAxes()},reflowCharts:function(){var a=this,b=a.charts,c=b.length,d=a.box,e;for(e=0;e<c;e++)b[e].reflow(d);a.box=d},renderGridLines:function(a,b,c){var d=b.options,f=d.vertical,g=b.getSlot(d.axisCrossingValue),h=O(g[f?"y1":"x1"]),i=c.lineBox(),j=i[f?"x1":"y1"],k=i[f?"x2":"y2"],l=b.getMajorTickPositions(),m=[],n=function(a,b){return{pos:a,options:b}};d.majorGridLines.visible&&(m=e(l,function(a){return n(a,d.majorGridLines)})),d.minorGridLines.visible&&(m=m.concat(e(b.getMinorTickPositions(),function(a){if(!d.majorGridLines.visible)return n(a,d.minorGridLines);if(!L(a,l))return n(a,d.minorGridLines)})));return e(m,function(b){var d={strokeWidth:b.options.width,stroke:b.options.color,dashType:b.options.dashType},e=O(b.pos);if(h===e&&c.options.line.visible)return null;return f?a.createLine(j,e,k,e,d):a.createLine(e,j,e,k,d)})},getViewElements:function(a){var b=this,c=b.options.plotArea,d=b.axisY,e=b.axisX,f=d?b.renderGridLines(a,d,e):[],g=e?b.renderGridLines(a,e,d):[],h=x.fn.getViewElements.call(b,a),i=c.border||{},j=[a.createRect(b.box,{fill:c.background,zIndex:-1}),a.createRect(b.box,{stroke:i.width?i.color:"",strokeWidth:i.width,fill:"",zIndex:0,dashType:i.dashType})];return[].concat(f,g,h,j)}}),ct=cs.extend({init:function(a,b){var c=this,d=o({},c.options,b);c.namedValueAxes={},c.valueAxisRangeTracker=new cu(d.valueAxis),a.length>0&&(c.invertAxes=L(a[0].type,[V,bR,bS])),cs.fn.init.call(c,a,b)},options:{categoryAxis:{categories:[]},valueAxis:{}},render:function(){var a=this,b=a.series;a.createAreaChart(d(b,function(a){return L(a.type,[T,bS])})),a.createBarChart(d(b,function(a){return L(a.type,[V,bf])})),a.createLineChart(d(b,function(a){return L(a.type,[bt,bR])})),a.createAxes()},appendChart:function(a){var b=this,c=b.options,d=a.options.series,e=c.categoryAxis.categories,g=f.max(0,cM(d)-e.length);I(e,Array(g)),b.valueAxisRangeTracker.update(a.valueAxisRanges),cs.fn.appendChart.call(b,a)},createBarChart:function(a){if(a.length!==0){var b=this,c=a[0],d=new cg(b,{series:a,invertAxes:b.invertAxes,isStacked:c.stack&&a.length>1,gap:c.gap,spacing:c.spacing});b.appendChart(d)}},createLineChart:function(a){if(a.length!==0){var b=this,c=a[0],d=new cl(b,{invertAxes:b.invertAxes,isStacked:c.stack&&a.length>1,series:a});b.appendChart(d)}},createAreaChart:function(a){if(a.length!==0){var b=this,c=a[0],d=new cn(b,{invertAxes:b.invertAxes,isStacked:c.stack&&a.length>1,series:a});b.appendChart(d)}},createAxes:function(){var a=this,b=a.options,d,e=a.invertAxes,f=b.categoryAxis.categories.length,g=new ca(o({vertical:e,axisCrossingValue:e?f:0},b.categoryAxis)),h,i,j=a.namedValueAxes,k=[].concat(b.valueAxis),l;c(k,function(){i=this.name||bE,d=a.valueAxisRangeTracker.query(i),h=j[i]=new A(d.min,d.max,o({vertical:!e},this)),a.axes.push(h),a.append(h)}),l=j[bE]||a.axes[0],a.axisX=e?l:g,a.axisY=e?g:l,a.categoryAxis=g,a.axes.push(g),a.append(a.categoryAxis)}}),cu=k.extend({init:function(a){var b=this;b.axisRanges={},b.axisOptions=[].concat(a),b.defaultRange={min:0,max:1}},update:function(a){var b=this,c=b.axisRanges,d=b.axisOptions,e,g,h,i,j,k=d.length;if(!!a)for(h=0;h<k;h++)i=d[h],j=i.name||bE,e=c[j],g=a[j],g&&(c[j]=e=e||{min:bv,max:bw},e.min=f.min(e.min,g.min),e.max=f.max(e.max,g.max))},query:function(a){var b=this;return b.axisRanges[a]||o({},b.defaultRange)}}),cv=cs.extend({init:function(a,b){var c=this,d=o({},c.options,b);c.namedXAxes={},c.namedYAxes={},c.xAxisRangeTracker=new cu(d.xAxis),c.yAxisRangeTracker=new cu(d.yAxis),cs.fn.init.call(c,a,b)},options:{xAxis:{},yAxis:{}},render:function(){var a=this,b=a.series;a.createScatterChart(d(b,function(a){return a.type===bH})),a.createScatterLineChart(d(b,function(a){return a.type===bI})),a.createAxes()},appendChart:function(a){var b=this;b.xAxisRangeTracker.update(a.xAxisRanges),b.yAxisRangeTracker.update(a.yAxisRanges),cs.fn.appendChart.call(b,a)},createScatterChart:function(a){var b=this;a.length>0&&b.appendChart(new co(b,{series:a}))},createScatterLineChart:function(a){var b=this;a.length>0&&b.appendChart(new cp(b,{series:a}))},createXYAxis:function(a,b){var c=this,d=a.name||bE,e=b?c.namedYAxes:c.namedXAxes,f=b?c.yAxisRangeTracker:c.xAxisRangeTracker,g=f.query(d),h=o({},a,{vertical:b}),i=new A(g.min,g.max,h);e[d]=i,c.append(i),c.axes.push(i)},createAxes:function(){var a=this,b=a.options,d=[].concat(b.xAxis),e=[].concat(b.yAxis);c(d,function(){a.createXYAxis(this,!1)}),c(e,function(){a.createXYAxis(this,!0)}),a.axisX=a.namedXAxes.primary||a.namedXAxes[d[0].name],a.axisY=a.namedYAxes.primary||a.namedYAxes[e[0].name]}}),cw=cs.extend({render:function(){var a=this,b=a.series;a.createPieChart(b)},createPieChart:function(a){var b=this,c=a[0],d=new cr(b,{series:a,padding:c.padding,startAngle:c.startAngle,connectors:c.connectors});b.appendChart(d)},addToLegend:function(a){var b=this,c=b.options,d=a.segments,e=d.length,f,g;for(f=0;f<e;f++)g=d[f],g.visibleInLegend!==!1&&c.legend.items.push({name:g.category,color:g.options.color})}}),cx=z.extend({options:{easing:"easeOutElastic",duration:bo},setup:function(){var a=this.element.config;this.endRadius=a.r,a.r=0},step:function(a){var b=this.endRadius,c=this.element.config;c.r=M(0,b,a)}}),cy=H(V,u),cz=H(bC,cx),cA=k.extend({init:function(a,b,c){var d=this;d.options=o({},d.options,c),d.view=a,d.viewElement=b},options:{fill:bT,fillOpacity:.2,stroke:bT,strokeWidth:1,strokeOpacity:.2},show:function(a){var b=this,c=b.view,d=b.viewElement,e,f;b.hide(),a.getOutlineElement&&(e=a.getOutlineElement(c,b.options),e&&(f=c.renderElement(e),d.appendChild(f),b.element=f,b.visible=!0))},hide:function(){var a=this,b=a.element;b&&(b.parentNode&&b.parentNode.removeChild(b),delete a.element,a.visible=!1)}}),cB=k.extend({init:function(b,c){var d=this;d.options=o({},d.options,c),c=d.options,d.chartElement=b,d.chartPadding={top:parseInt(b.css("paddingTop"),10),left:parseInt(b.css("paddingLeft"),10)},d.template=cB.template,d.template||(d.template=cB.template=P("<div class='"+R+"tooltip' "+"style='display:none; position: absolute; font: #= d.font #;"+"border: #= d.border.width #px solid;"+"opacity: #= d.opacity #; filter: alpha(opacity=#= d.opacity * 100 #);'>"+"</div>")),d.element=a(d.template(d.options)).appendTo(b)},options:{background:$,color:bT,border:{width:3},opacity:1,animation:{duration:bN}},show:function(a){var b=this;b.point=a,b.showTimeout=setTimeout(h(b._show,b),bP)},_show:function(){var a=this,b=a.point,c=a.element,d=a.options,e=a.chartPadding,f,g,h,i,j,k;!b||(h=b.value.toString(),i=o({},a.options,b.options.tooltip),i.template?(g=n(i.template),h=g({value:b.value,category:b.category,series:b.series,dataItem:b.dataItem,percentage:b.percentage})):i.format&&(h=b.formatPointValue(i.format)),c.html(h),f=b.tooltipAnchor(c.outerWidth(),c.outerHeight()),j=O(f.y+e.top)+"px",k=O(f.x+e.left)+"px",a.visible||a.element.css({top:j,left:k}),a.element.css({backgroundColor:i.background,borderColor:i.border.color||b.options.color,color:i.color,opacity:i.opacity,borderWidth:i.border.width}).stop(!0,!0).show().animate({left:k,top:j},d.animation.duration),a.visible=!0)},hide:function(){var a=this;clearTimeout(a.showTimeout),a.visible&&(a.element.fadeOut(),a.point=null,a.visible=!1)}});g(a.easing,{easeOutElastic:function(a,b,c,d){var e=1.70158,g=0,h=d;if(a===0)return c;if(a===1)return c+d;g||(g=.5),h<f.abs(d)?(h=d,e=g/4):e=g/(2*f.PI)*f.asin(d/h);return h*f.pow(2,-10*a)*f.sin((a*1-e)*1.1*f.PI/g)+d+c}}),cO.cache={},r.ui.plugin(bZ),o(r,{AreaChart:cn,Bar:ce,BarAnimationDecorator:cy,BarChart:cg,BarLabel:b$,CategoricalPlotArea:ct,CategoryAxis:ca,ClusterLayout:cb,Highlight:cA,Legend:b_,LineChart:cl,LinePoint:ci,PieAnimation:cx,PieAnimationDecorator:cz,PieChart:cr,PiePlotArea:cw,PieSegment:cq,ScatterChart:co,ScatterLineChart:cp,ShapeElement:ch,StackLayout:cc,Tooltip:cB,XYPlotArea:cv,categoriesCount:cM})}(jQuery),function(a,b){function bd(a,b,c){var e=w(a.from)?a.from:J,f=w(a.to)?a.to:I;a.from=d.max(d.min(f,e),b),a.to=d.min(d.max(f,e),c);return a}var c=document,d=Math,e=window.kendo,f=e.ui.Widget,g=e.deepExtend,h=e.dataviz,i=h.Axis,j=h.Box2D,k=h.ChartElement,l=h.NumericAxis,m=h.Pin,n=h.Ring,o=h.RootElement,p=h.RotationAnimation,q=h.BarIndicatorAnimatin,r=h.ArrowAnimation,s=h.append,t=h.animationDecorator,u=h.autoMajorUnit,v=h.getSpacing,w=h.defined,x=h.rotatePoint,y=h.Point2D,z=h.round,A=h.uniqueId,B=150,C="arrow",D="arrowPointer",E="barIndicator",F="#000",G=.05,H=h.COORD_PRECISION,I=Number.MAX_VALUE,J=-Number.MAX_VALUE,K=200,L=.5,M=200,N=60,O=60,P=d.PI/180,Q="inside",R="needle",S="outside",T="radialPointer",U=90,V=k.extend({init:function(a,b){var c=this,e=a.options;k.fn.init.call(c,b),b=c.options,b.id||(b.id=A()),b.fill=b.color,c.scale=a,w(b.value)?b.value=d.min(d.max(b.value,e.min),e.max):b.value=e.min},options:{color:F},value:function(a){var b=this,c=b.options,e=c.value,f=b.scale.options;if(arguments.length===0)return e;c._oldValue=c.value,c.value=d.min(d.max(a,f.min),f.max),b.repaint()}}),W=V.extend({options:{shape:R,cap:{size:G},arrow:{width:16,height:14},animation:{type:T,speed:B}},reflow:function(){var a=this,b=a.options,c=a.scale,d=c.ring,e=d.c,f=d.r*b.cap.size;a.box=new j(e.x-f,e.y-f,e.x+f,e.y+f)},repaint:function(){var a=this,b=a.scale,d=a.options,e=a.elements[0],f=d.animation,h=b.slotAngle(b.options.min),i=b.slotAngle(d._oldValue)-h,j=e._animation;e.options.rotation[0]=b.slotAngle(d.value)-h,j&&j.abort(),f===!1?e.refresh(c.getElementById(d.id)):(j=e._animation=new p(e,g(f,{startAngle:i,reverse:b.options.reverse})),j.setup(),j.play())},_renderNeedle:function(a,b,c,d){var e=this,f=e.options,g=e.scale,h=g.ring.r*f.cap.size;return[a.createPolyline([x((b.x1+b.x2)/2,b.y1+g.options.minorTicks.size,c.x,c.y,d),x(c.x-h/2,c.y,c.x,c.y,d),x(c.x+h/2,c.y,c.x,c.y,d)],!0,f),a.createCircle([c.x,c.y],h,{fill:f.cap.color||f.color})]},_renderArrow:function(a,b,c,d){var e=this,f=e.options,g=e.scale,h=g.ring.clone(),i=5,j=f.arrow,k=j.height;h.ir=h.r-i;return[a.createPin(new m({origin:x((b.x1+b.x2)/2,b.y1+k,c.x,c.y,d),height:j.height,radius:i,rotation:d,arcAngle:180}),f),a.createRing(h,{fill:f.color})]},renderPointer:function(a){var b=this,c=b.scale,d=c.ring,e=d.c,f=d.r,h,i=b.options,k=new j(e.x-f,e.y-f,e.x+f,e.y+f),l=k.center(),m=c.slotAngle(c.options.min),n=U-m;i.animation!==!1&&g(i.animation,{startAngle:0,center:l,reverse:c.options.reverse}),g(i,{rotation:[c.slotAngle(i.value)-m,l.x,l.y]}),i.shape==C?h=b._renderArrow(a,k,l,n):h=b._renderNeedle(a,k,l,n);return h},getViewElements:function(a){var b=this,c=b.renderPointer(a);b.elements=c;return c}}),X=l.extend({init:function(a){var b=this,c=b.options;c.majorUnit=u(b.options.min,b.options.max),i.fn.init.call(b,a),b.options.minorUnit=b.options.minorUnit||b.options.majorUnit/10},options:{min:0,max:100,majorTicks:{size:15,align:Q,color:F,width:L},minorTicks:{size:10,align:Q,color:F,width:L},startAngle:-30,endAngle:210,labels:{position:Q,padding:2}},reflow:function(a){var b=this,c=b.options,e=a.center(),f=d.min(a.height(),a.width())/2,g=b.ring||new h.Ring(e,f-c.majorTicks.size,f,c.startAngle,c.endAngle-c.startAngle);b.ring=g,b.box=g.getBBox(),b.arrangeLabels()},slotAngle:function(a){var b=this.options,c=b.startAngle,d=b.reverse,e=b.endAngle-c,f=b.min,g=b.max,h;d?h=b.endAngle-(a-f)/(g-f)*e:h=(a-f)/(g-f)*e+c;return h},renderTicks:function(a){function h(d,e,f,g){var h=b.tickAngles(d,e),i,j,k,l=g/e,m=h.length;for(i=0;i<m;i++){if(i%l===0)continue;k=d.point(h[i]),j=d.point(h[i],!0),c.push(a.createLine(j.x,j.y,k.x,k.y,{align:!1,stroke:f.color,strokeWidth:f.width}))}}var b=this,c=[],d=b.ring,e=d.clone(),f=b.options,g=f.minorTicks.size;h(d,f.majorUnit,f.majorTicks),f.labels.position==Q?e.radius(e.r-g,!0):e.radius(e.ir+g),h(e,f.minorUnit,f.minorTicks,f.majorUnit);return c},arrangeLabels:function(){var a=this,b=a.options,c=a.ring.clone(),e=a.tickAngles(c,b.majorUnit),f=a.labels,g=f.length,h=b.labels,i=h.padding,k=a.options.rangeDistance=c.r*.05,l=a.options.rangeSize=c.r*.1,m=b.ranges||[],n,o,p,q,r,s,t,u,v,w;h.position===Q&&m.length&&(c.r-=l+k,c.ir-=l+k);for(t=0;t<g;t++)r=f[t],n=r.box.width()/2,o=r.box.height()/2,q=e[t],p=q*P,w=h.position===Q,s=c.point(q,w),u=s.x+d.cos(p)*(n+i)*(w?1:-1),v=s.y+d.sin(p)*(o+i)*(w?1:-1),r.reflow(new j(u-n,v-o,u+n,v+o)),a.box.wrap(r.box)},tickAngles:function(a,b){var c=this,d=c.options,e=d.reverse,f=d.max-d.min,g=a.angle,h=a.startAngle,i=f/b,j=g/i,k=[],l;e&&(h+=g,j=-j);for(l=0;l<i;l++)k.push(z(h,H)),h+=j;k.push(h);return k},renderRanges:function(a){var b=this,c=[],d,e,f=b.rangeSegments(),g=f.length,h=b.options.reverse,i,j,k;if(g){j=b.getRadius();for(k=0;k<g;k++)i=f[k],d=b.slotAngle(i[h?"to":"from"]),e=b.slotAngle(i[h?"from":"to"]),e-d!==0&&c.push(a.createRing(new n(b.ring.c,j.inner,j.outer,d,e-d),{fill:i.color,fillOpacity:i.opacity,zIndex:-1}))}return c},rangeSegments:function(){function n(a,b,c){return{from:a,to:b,color:c}}var a=this,b=a.options,c=b.ranges||[],d=c.length,e,f,g=b.rangePlaceholderColor,h=[],i,j=b.min,k=b.max,l,m;if(d){h.push(n(j,k,g));for(l=0;l<d;l++){e=bd(c[l],j,k),f=h.length;for(m=0;m<f;m++){i=h[m];if(i.from<=e.from&&e.from<=i.to){h.push(n(e.from,e.to,e.color)),i.from<=e.to&&e.to<=i.to&&h.push(n(e.to,i.to,g)),i.to=e.from;break}}}}return h},getRadius:function(){var a=this,b=a.options,c=b.rangeSize,d=b.rangeDistance,e=a.ring,f,g;b.labels.position===S?(g=e.ir-d,f=g-c):(g=e.r,f=g-c,e.r-=c+d,e.ir-=c+d);return{inner:f,outer:g}},getViewElements:function(a){var b=this,c=k.fn.getViewElements.call(b,a);s(c,b.renderRanges(a)),s(c,b.renderTicks(a));return c}}),Y=k.extend({init:function(a){k.fn.init.call(this,a),this.render()},options:{margin:{},background:"",border:{color:F,width:0},minorTicks:{align:Q}},reflow:function(a){var b=this,c=b.scale,d=b.pointer,e;c.reflow(a),e=c.box.clone(),d.scale=c,d.reflow(),e.wrap(d.box),b.box=e,b.fitScale(a),b.alignScale(a)},alignScale:function(a){var b=this,c=b.box.center(),d=a.center(),e=c.x-d.x,f=c.y-d.y,g=b.scale,h=b.pointer;g.ring.c.x-=e,g.ring.c.y-=f,g.reflow(a),h.reflow(),b.box=g.box.clone().wrap(h.box)},fitScale:function(a){var b=this,c=b.scale,e=c.ring,f=b.box,g=d.abs(b.getDiff(f,a)),h=z(g,H),i=z(-g,H),j,k,l,m,n=0;while(n<100){n++;if(h!=m){j=b.getPlotBox(h,a,e);if(0<=j&&j<=2)break}if(i!=m){l=b.getPlotBox(i,a,e);if(0<=l&&l<=2)break}j>0&&l>0?m=h*2:j<0&&l<0?m=i*2:m=z((h+i)/2||1,H),k=b.getPlotBox(m,a,e);if(0<=k&&k<=2)break;k>0?(i=m,l=k):(h=m,j=k)}},getPlotBox:function(a,b,c){var d=this,e=d.scale,f=d.pointer;c=c.clone(),c.r+=a,c.ir+=a,e.ring=c,e.reflow(b),f.scale=e,f.reflow(),d.box=e.box.clone().wrap(f.box);return d.getDiff(d.box,b)},getDiff:function(a,b){return d.min(b.width()-a.width(),b.height()-a.height())},render:function(){var a=this,b=a.options,c;c=a.scale=new X(b.scale),a.append(a.scale),a.pointer=new W(c,b.pointer),a.append(a.pointer)}}),Z=l.extend({init:function(a){var b=this,c=b.options;c.majorUnit=u(b.options.min,b.options.max),a=g({},c,a),a=g({},a,{labels:{mirror:a.mirror}}),l.fn.init.call(b,0,1,a)},options:{min:0,max:50,minorUnit:1,majorTicks:{size:15,align:Q,color:F,width:L,visible:!0},minorTicks:{size:10,align:Q,color:F,width:L,visible:!0},line:{width:L},labels:{position:Q,padding:2},mirror:!1},shouldAlign:function(){return!1},renderRanges:function(a){var b=this,c=b.options,d=c.min,e=c.max,f=c.ranges||[],g=c.vertical,h=c.labels.mirror,i=[],k=f.length,l,m,n,o,p=c.minorTicks.size/2,q;if(k)for(o=0;o<k;o++)l=bd(f[o],d,e),q=b.getSlot(l.from,l.to),m=g?b.lineBox():q,n=g?q:b.lineBox(),g?m.x1-=p*(h?-1:1):n.y2+=p*(h?-1:1),i.push(a.createRect(new j(m.x1,n.y1,m.x2,n.y2),{fill:l.color,fillOpacity:l.opacity}));return i},getViewElements:function(a){var b=this,c=l.fn.getViewElements.call(b,a);s(c,b.renderRanges(a));return c}}),$=V.extend({init:function(a,b){var c=this;V.fn.init.call(c,a,b),c.options=g({size:c.pointerSize(),track:{visible:w(b.track)}},c.options)},options:{shape:E,track:{border:{width:1}},color:F,border:{width:1},opacity:1,margin:v(3),animation:{type:E},visible:!0},repaint:function(){var a=this,b=a.scale,d=a.options,e=a.element,f=e._animation;f&&f.abort(),d.animation===!1&&e?e.refresh(c.getElementById(d.id)):(d.animation=g({},d.animation,{endPosition:b.getSlot(b.options.min,d.value),reverse:b.options.reverse}),d.shape===C?f=e._animation=new r(e,d.animation):f=e._animation=new q(e,d.animation),f.setup(),f.play())},reflow:function(a){var b=this,c=b.options,d=b.scale,e=d.lineBox(),f=c.track.size||c.size,g=c.size/2,h=d.options.mirror,i=v(c.margin),k=d.options.vertical,l=k?i[h?"left":"right"]:i[h?"bottom":"top"],m,n,o;l=h?-l:l,k?(o=new j(e.x1+l,e.y1,e.x1+l,e.y2),h?o.x1-=f:o.x2+=f,c.shape!==E&&(n=new j(e.x2+l,e.y1-g,e.x2+l,e.y2+g),m=n)):(o=new j(e.x1,e.y1-l,e.x2,e.y1-l),h?o.y2+=f:o.y1-=f,c.shape!==E&&(n=new j(e.x1-g,e.y1-l,e.x2+g,e.y1-l),m=n)),b.trackBox=o,b.pointerRangeBox=n,b.box=m||o.clone().pad(c.border.width)},renderPointer:function(a){var b=this,c=b.scale,d=b.options,e=w(d.border)?{stroke:d.border.width?d.border.color||d.color:"",strokeWidth:d.border.width,dashType:d.border.dashType}:{},f,h=g({fill:d.color,fillOpacity:d.opacity,animation:g(d.animation,{startPosition:c.getSlot(c.options.min,d.value),size:d.size,vertical:c.options.vertical,reverse:c.options.reverse}),id:d.id,zIndex:2,align:!1},e),i=b.pointerShape(d.value);d.shape===C?(h.animation.type=D,f=a.createPolyline(i,!0,h)):f=a.createRect(i,h);return f},pointerShape:function(a){var b=this,c=b.options,d=b.scale,e=d.getSlot(a,d.options.min),f=c.size,g=b.pointerRangeBox,h=d.options.vertical,i=f/2,k,l=d.options.mirror?-1:1,m;c.shape==C?h?k=[new y(g.x1,e.y1-i),new y(g.x1-l*f,e.y1),new y(g.x1,e.y1+i)]:k=[new y(e.x2-i,g.y2),new y(e.x2,g.y2+l*f),new y(e.x2+i,g.y2)]:(m=b.trackBox,h?k=new j(m.x1,e.y1,m.x1+f,e.y2):k=new j(e.x1,m.y1,e.x2,m.y1+f));return k},pointerSize:function(a){var b=this,c=b.options,d=b.scale,e=d.options.majorTicks.size,f;c.shape===C?f=e*.6:f=e*.3;return z(f)},renderTrack:function(a){var b=this,c=b.options,d=c.track,e=d.border||{},f=b.trackBox.clone().pad(e.width||0);return a.createRect(f,{fill:d.color,fillOpacity:d.opacity,stroke:e.width?e.color||d.color:"",strokeWidth:e.width,dashType:e.dashType,align:!1})},getViewElements:function(a){var b=this,c=b.options,d=[];b.element=b.renderPointer(a),d.push(b.element),c.track.visible&&(c.shape===E||c.shape==="")&&d.push(b.renderTrack(a)),s(d,V.fn.getViewElements.call(b,a));return d}}),_=k.extend({init:function(a){k.fn.init.call(this,a),this.render()},options:{plotArea:{margin:{},background:"",border:{color:F,width:0}},pointer:{},scale:{}},reflow:function(a){var b=this,c=b.scale,d=b.pointer;c.reflow(a),d.reflow(a),b.box=b.getBox(a),b.alignElements(),b.shrinkElements()},shrinkElements:function(){var a=this,b=a.scale,c=a.pointer,e=b.box.clone(),f=c.box,g=b.options.vertical?"y":"x";e[g+1]+=d.max(e[g+1]-f[g+1],0),e[g+2]-=d.max(f[g+2]-e[g+2],0),b.reflow(e),c.reflow(a.box)},getBox:function(a){var b=this,c=b.scale,d=b.pointer,e=a.center(),f=d.box.clone().wrap(c.box),g;c.options.vertical?(g=f.width()/2,f=new j(e.x-g,a.y1,e.x+g,a.y2)):(g=f.height()/2,f=new j(a.x1,e.y-g,a.x2,e.y+g));return f},alignElements:function(){var a=this,b=a.scale,c=a.pointer,d=b.box,e=c.box.clone().wrap(b.box),f=a.box,g;b.options.vertical?(g=f.center().x-e.center().x,b.reflow(new j(d.x1+g,f.y1,d.x2+g,f.y2))):(g=f.center().y-e.center().y,b.reflow(new j(f.x1,d.y1+g,f.x2,d.y2+g))),c.reflow(a.box)},render:function(){var a=this,b=a.options,c;c=a.scale=new Z(b.scale),a.append(a.scale),a.pointer=new $(c,b.pointer),a.append(a.pointer)},getViewElements:function(a){var b=this,c=b.options.plotArea,d=k.fn.getViewElements.call(b,a),e=c.border||{},f=[a.createRect(b.box,{fill:c.background,stroke:e.width?e.color:"",strokeWidth:e.width,dashType:e.dashType})];s(f,d);return f}}),ba=f.extend({init:function(a,b){var c=this,d,e,i,j=h.ui.themes.gauge||{};f.fn.init.call(c,a),c.wrapper=c.element,d=g({},c.options,b),i=d.theme,e=i?j[i]||j[i.toLowerCase()]:{},c.options=g({},e,d),c.element.addClass("k-gauge"),c.redraw()},options:{plotArea:{},name:"Gauge"},value:function(a){if(arguments.length===0)return this._pointers[0].value();this._pointers[0].value(a)},redraw:function(){var a=this,b=a.element,c=a._model=a._getModel(),d=h.ui.defaultView(),e;a._plotArea=c._plotArea,d&&(e=a._view=d.fromModel(c),b.css("position","relative"),a._viewElement=e.renderTo(b[0]))},svg:function(){var a=this._getModel(),b=h.SVGView.fromModel(a);return b.render()},_createModel:function(){var a=this,b=a.options,c=a._getSize();return new o(g({width:c.width,height:c.height,transitions:b.transitions},b.gaugeArea))},_getSize:function(){var a=this,b=a.element,c=b.width(),d=b.height();c||(c=M),d||(d=K);return{width:c,height:d}}}),bb=ba.extend({init:function(a,b){var c=this;ba.fn.init.call(c,a,b),e.notify(c,h.ui)},options:{name:"RadialGauge",transitions:!0,gaugeArea:{background:""}},_getModel:function(){var a=this,b=a.options,c=a._createModel(),d;d=c._plotArea=new Y(b),a._pointers=[d.pointer],c.append(d),c.reflow();return c}}),bc=ba.extend({init:function(a,b){var c=this;ba.fn.init.call(c,a,b),e.notify(c,h.ui)},options:{name:"LinearGauge",transitions:!0,gaugeArea:{background:""},scale:{vertical:!0}},_getModel:function(){var a=this,b=a.options,c=a._createModel(),d;d=c._plotArea=new _(b),a._pointers=[d.pointer],c.append(d),c.reflow();return c},_getSize:function(){var a=this,b=a.element,c=b.width(),d=b.height(),e=a.options.scale.vertical;c||(c=e?N:M),d||(d=e?K:O);return{width:c,height:d}}}),be=t(T,p),bf=t(D,r),bg=t(E,q);h.ui.plugin(bb),h.ui.plugin(bc),g(h,{Gauge:ba,RadialGaugePlotArea:Y,LinearGaugePlotArea:_,RadialPointer:W,LinearPointer:$,LinearScale:Z,RadialScale:X,RadialPointerAnimationDecorator:be,ArrowPointerAnimationDecorator:bf,BarIndicatorAnimationDecorator:bg})}(jQuery),function(){function W(a,b){var c=[],d,e;a=a?a.toLowerCase():null;if(a&&a!=z&&b){d=C[a];for(e=0;e<d.length;e++)c.push(d[e]*b);return"stroke-dasharray='"+c.join(" ")+"' "}return""}function V(a){return c.round(a)+.5}function T(a){this.view=a}function S(a){this.view=a}var a=jQuery,b=document,c=Math,d=window.kendo,e=d.Class,f=d.dataviz,g=f.Box2D,h=f.ExpandAnimation,i=f.Point2D,j=f.ViewBase,k=f.ViewElement,l=d.deepExtend,m=f.defined,n=f.round,o=f.renderTemplate,p=f.rotatePoint,q=f.uniqueId,r="butt",s=f.CLIP,t=f.COORD_PRECISION,u=f.DEFAULT_WIDTH,v=f.DEFAULT_HEIGHT,w=f.DEFAULT_FONT,x="none",y="radial",z="solid",A="square",B="http://www.w3.org/2000/svg",C={dot:[1.5,3.5],dash:[4,3.5],longdash:[8,3.5],dashdot:[3.5,3.5,1.5,3.5],longdashdot:[8,3.5,1.5,3.5],longdashdotdot:[8,3.5,1.5,3.5,1.5,3.5]},D="transparent",E="undefined",F=j.extend({init:function(a){var b=this;j.fn.init.call(b,a),b.decorators.push(new S(b),new T(b)),f.ui.Chart&&b.decorators.push(new f.BarAnimationDecorator(b),new f.PieAnimationDecorator(b)),b.decorators.push(new U(b),new f.FadeAnimationDecorator(b)),f.Gauge&&b.decorators.push(new f.RadialPointerAnimationDecorator(b),new f.ArrowPointerAnimationDecorator(b),new f.BarIndicatorAnimationDecorator(b)),b.template=F.template,b.template||(b.template=F.template=o("<?xml version='1.0' ?><svg xmlns='"+B+"' version='1.1' "+"width='#= d.options.width #px' height='#= d.options.height #px' "+"style='position: relative; display: block;'>"+"#= d.renderDefinitions() #"+"#= d.renderContent() #</svg>"))},options:{width:u,height:v,idPrefix:""},renderTo:function(a){var b=this,c;b.setupAnimations(),X(a,b.render()),c=a.firstChild.nextSibling,b.alignToScreen(c),b.playAnimations();return c},renderDefinitions:function(){var a=this,b=j.fn.renderDefinitions.call(a);return b.length>0?"<defs>"+b+"</defs>":""},renderElement:function(a){var c=b.createElement("div"),d;X(c,"<?xml version='1.0' ?><svg xmlns='"+B+"' version='1.1'>"+a.render()+"</svg>"),d=c.firstChild.nextSibling.firstChild;return d},createGroup:function(a){return this.decorate(new N(a))},createText:function(a,b){return this.decorate(new G(a,b))},createRect:function(a,b){return this.decorate(new I(a.points(),!0,b))},createLine:function(a,b,c,d,e){return this.decorate(new I([new i(a,b),new i(c,d)],!1,e))},createPolyline:function(a,b,c){return this.decorate(new I(a,b,c))},createCircle:function(a,b,c){return this.decorate(new M(a,b,c))},createSector:function(a,b){return this.decorate(new L(a,b))},createRing:function(a,b){return this.decorate(new J(a,b))},createPin:function(a,b){return this.decorate(new K(a,b))},createGradient:function(a){return a.type===y?new R(a):new Q(a)},alignToScreen:function(a){var b;try{b=a.getScreenCTM?a.getScreenCTM():null}catch(c){}if(b){var d=-b.e%1,e=-b.f%1,f=a.style;if(d!==0||e!==0)f.left=d+"px",f.top=e+"px"}}});F.fromModel=function(a){var b=new F(a.options);[].push.apply(b.children,a.getViewElements(b));return b},F.available=f.supportsSVG,F.preference=100,f.ui.registerView(F);var G=k.extend({init:function(a,b){var c=this;k.fn.init.call(c,b),c.content=a,c.template=G.template,c.template||(c.template=G.template=o("<text #= d.renderAttr(\"id\", d.options.id) # #= d.renderDataAttributes() # x='#= Math.round(d.options.x) #' y='#= Math.round(d.options.y + d.options.baseline) #' fill-opacity='#= d.options.fillOpacity #' #= d.options.rotation ? d.renderRotation() : '' # style='font: #= d.options.font #' fill='#= d.options.color #'>#= d.content #</text>"))},options:{x:0,y:0,baseline:0,font:w,size:{width:0,height:0},fillOpacity:1},refresh:function(b){var c=this.options;a(b).attr({"fill-opacity":c.fillOpacity})},clone:function(){var a=this;return new G(a.content,l({},a.options))},renderRotation:function(){var a=this,b=a.options,c=b.size,d=n(b.x+c.normalWidth/2,t),e=n(b.y+c.normalHeight/2,t),f=n(b.x+c.width/2,t),g=n(b.y+c.height/2,t),h=n(f-d,t),i=n(g-e,t);return"transform='translate("+h+","+i+") "+"rotate("+b.rotation+","+d+","+e+")'"}}),H=k.extend({init:function(a){var b=this;k.fn.init.call(b,a),b.template=H.template,b.template||(b.template=H.template=o("<path #= d.renderAttr(\"id\", d.options.id) ##= d.renderDataAttributes() # d='#= d.renderPoints() #' #= d.renderAttr(\"stroke\", d.options.stroke) # #= d.renderAttr(\"stroke-width\", d.options.strokeWidth) ##= d.renderDashType() # stroke-linecap='#= d.renderLinecap() #' stroke-linejoin='round' fill-opacity='#= d.options.fillOpacity #' stroke-opacity='#= d.options.strokeOpacity #' fill='#= d.renderFill() #'></path>"))},options:{fill:"",fillOpacity:1,strokeOpacity:1,rotation:[0,0,0]},refresh:function(b){var c=this.options;a(b).attr({d:this.renderPoints(),"fill-opacity":c.fillOpacity,"stroke-opacity":c.strokeOpacity})},clone:function(){var a=this;return new H(l({},a.options))},renderPoints:function(){},renderDashType:function(){var a=this,b=a.options;return W(b.dashType,b.strokeWidth)},renderLinecap:function(){var a=this.options.dashType;return a&&a!=z?r:A},renderFill:function(){var a=this.options.fill;if(a&&a!==D)return a;return x}}),I=H.extend({init:function(a,b,c){var d=this;H.fn.init.call(d,c),d.points=a,d.closed=b},renderPoints:function(){var a=this,b=a.points,c,d=b.length,e=function(b){var c=a.options.rotation;return p(b.x,b.y,c[1],c[2],-c[0])},f="M"+a._print(e(b[0]));for(c=1;c<d;c++)f+=" "+a._print(e(b[c]));a.closed&&(f+=" z");return f},clone:function(){var a=this;return new I(l([],a.points),a.closed,l({},a.options))},_print:function(a){var b=this,c=b.options,d=c.strokeWidth,e=c.align!==!1&&d&&d%2!==0,f=e?V:n;return f(a.x,t)+" "+f(a.y,t)}}),J=H.extend({init:function(a,b){var c=this;H.fn.init.call(c,b),c.pathTemplate=J.pathTemplate,c.pathTemplate||(c.pathTemplate=J.pathTemplate=o("M #= d.firstOuterPoint.x # #= d.firstOuterPoint.y # A#= d.r # #= d.r # 0 #= d.isReflexAngle ? '1' : '0' #,1 #= d.secondOuterPoint.x # #= d.secondOuterPoint.y # L #= d.secondInnerPoint.x # #= d.secondInnerPoint.y # A#= d.ir # #= d.ir # 0 #= d.isReflexAngle ? '1' : '0' #,0 #= d.firstInnerPoint.x # #= d.firstInnerPoint.y # z")),c.config=a||{}},renderPoints:function(){var a=this,b=a.config,d=b.startAngle,e=b.angle+d,f=e-d>180,g=c.max(b.r,0),h=c.max(b.ir,0),i=b.c,j=b.point(d),k=b.point(d,!0),l,m;e=e-d===360?e-.001:e,l=b.point(e),m=b.point(e,!0);return a.pathTemplate({firstOuterPoint:j,secondOuterPoint:l,isReflexAngle:f,r:g,ir:h,cx:i.x,cy:i.y,firstInnerPoint:k,secondInnerPoint:m})}}),K=H.extend({init:function(a,b){var c=this;H.fn.init.call(c,b),c.pathTemplate=K.pathTemplate,c.pathTemplate||(c.pathTemplate=K.pathTemplate=o("M #= d.origin.x # #= d.origin.y # #= d.as.x # #= d.as.y # A#= d.r # #= d.r # 0 #= d.isReflexAngle ? '1' : '0' #,0 #= d.ae.x # #= d.ae.y # z")),c.config=a||new f.Pin},renderPoints:function(){var a=this,b=a.config,d=b.radius,e=c.PI/180,f=b.arcAngle,g=d*c.sin(f*e/2),h=b.height-d*(1-c.cos(f*e/2)),i=b.origin,j={x:i.x+g,y:i.y-h},k={x:i.x-g,y:i.y-h},l=function(c,d){var e=a.options.rotation,f=b.rotation;c=p(c.x,c.y,e[1],e[2],-e[0]),d&&(c=p(c.x,c.y,i.x,i.y,f));return c};i=l(i);return a.pathTemplate({origin:i,as:l(j,!0),ae:l(k,!0),r:d,isReflexAngle:f>180})}}),L=J.extend({init:function(a,b){var c=this;J.fn.init.call(c,a,b),c.pathTemplate=L.pathTemplate,c.pathTemplate||(c.pathTemplate=L.pathTemplate=o("M #= d.firstOuterPoint.x # #= d.firstOuterPoint.y # A#= d.r # #= d.r # 0 #= d.isReflexAngle ? '1' : '0' #,1 #= d.secondOuterPoint.x # #= d.secondOuterPoint.y # L #= d.cx # #= d.cy # z"))},options:{fill:"",fillOpacity:1,strokeOpacity:1,strokeLineCap:A},clone:function(){var a=this;return new L(l({},a.config),l({},a.options))}}),M=k.extend({init:function(a,b,c){var d=this;k.fn.init.call(d,c),d.center=a,d.radius=b,d.template=M.template,d.template||(d.template=M.template=o("<circle #= d.renderAttr(\"id\", d.options.id) # #= d.renderDataAttributes() #cx='#= d.center[0] #' cy='#= d.center[1] #' r='#= d.radius #' #= d.renderAttr(\"stroke\", d.options.stroke) # #= d.renderAttr(\"stroke-width\", d.options.strokeWidth) #fill-opacity='#= d.options.fillOpacity #' stroke-opacity='#= d.options.strokeOpacity #'  fill='#= d.options.fill || \"none\" #'></circle>"))},options:{fill:"",fillOpacity:1,strokeOpacity:1}}),N=k.extend({init:function(a){var b=this;k.fn.init.call(b,a),b.template=N.template,b.template||(b.template=N.template=o('<g#= d.renderAttr("id", d.options.id) ##= d.renderDataAttributes() ##= d.renderAttr("clip-path", d.options.clipPath) #>#= d.renderContent() #</g>'))}}),O=k.extend({init:function(a){var b=this;k.fn.init.call(b,a),b.template=O.template,b.template||(b.template=O.template=o('<clipPath#= d.renderAttr("id", d.options.id) #>#= d.renderContent() #</clipPath>'))}}),P=k.extend({init:function(a){var b=this;k.fn.init.call(b,a)},options:{id:""},renderStops:function(){var a=this,b=a.options.stops,c=a.stopTemplate,d,e=b.length,f,g="";for(d=0;d<e;d++)f=b[d],g+=c(f);return g}}),Q=P.extend({init:function(a){var b=this;P.fn.init.call(b,a),b.template=Q.template,b.stopTemplate=Q.stopTemplate,b.template||(b.template=Q.template=o("<linearGradient id='#= d.options.id #' gradientTransform='rotate(#= d.options.rotation #)'> #= d.renderStops() #</linearGradient>"),b.stopTemplate=Q.stopTemplate=o("<stop offset='#= Math.round(d.offset * 100) #%' style='stop-color:#= d.color #;stop-opacity:#= d.opacity #' />"))},options:{rotation:0}}),R=P.extend({init:function(a){var b=this;P.fn.init.call(b,a),b.template=R.template,b.stopTemplate=R.stopTemplate,b.template||(b.template=R.template=o("<radialGradient id='#= d.options.id #' cx='#= d.options.cx #' cy='#= d.options.cy #' fx='#= d.options.cx #' fy='#= d.options.cy #' r='#= d.options.r #' gradientUnits='userSpaceOnUse'>#= d.renderStops() #</radialGradient>"),b.stopTemplate=R.stopTemplate=o("<stop offset='#= Math.round(d.offset * 100) #%' style='stop-color:#= d.color #;stop-opacity:#= d.opacity #' />"))}});S.prototype={decorate:function(a){var b=this,c=b.view,d=a.options,e=d.id,f,g;if(d.overlay){a.options.id=q(),f=c.createGroup(),g=a.clone(),f.children.push(a,g),g.options.id=e,g.options.fill=d.overlay;return f}return a}},T.prototype={decorate:function(a){var b=this,c=a.options;c.fill=b.getPaint(c.fill);return a},getPaint:function(a){var b=this,c=b.view,d=b.baseUrl(),e=c.definitions,f,g,h;if(a&&m(a.gradient)){f=c.buildGradient(a);if(f){g=f.id,h=e[g],h||(h=c.createGradient(f),e[g]=h);return"url("+d+"#"+h.options.id+")"}return x}return a},baseUrl:function(){var c=b.getElementsByTagName("base")[0],d="",e=b.location.href,f=e.indexOf("#");c&&!a.browser.msie&&(f!==-1&&(e=e.substring(0,f)),d=e);return d}};var U=e.extend({init:function(a){this.view=a,this.clipId=q()},decorate:function(a){var b=this,c=b.view,d=b.clipId,e=c.options,f=a.options.animation,i=c.definitions,j=i[d],k;f&&f.type===s&&e.transitions&&(j||(j=new O({id:d}),k=c.createRect(new g(0,0,e.width,e.height),{id:q()}),j.children.push(k),i[d]=j,c.animations.push(new h(k,{size:e.width}))),a.options.clipPath="url(#"+d+")");return a}}),X=function(a,b){a.innerHTML=b};(function(){var a="<svg xmlns='"+B+"'></svg>",c=b.createElement("div"),d=typeof DOMParser!=E;c.innerHTML=a,d&&c.firstChild.namespaceURI!=B&&(X=function(a,c){var d=new DOMParser,e=d.parseFromString(c,"text/xml"),f=b.adoptNode(e.documentElement);a.innerHTML="",a.appendChild(f)})})(),l(f,{SVGCircle:M,SVGClipAnimationDecorator:U,SVGClipPath:O,SVGGradientDecorator:T,SVGGroup:N,SVGLine:I,SVGLinearGradient:Q,SVGOverlayDecorator:S,SVGPath:H,SVGRadialGradient:R,SVGRing:J,SVGSector:L,SVGText:G,SVGView:F})}(jQuery),function(){function Y(a,b){var c=b.stops,d=c.length,e=f({},b),g,h,i;e.stops=[];for(g=0;g<d;g++)h=c[g],i=e.stops[g]=f({},c[g]),i.color=W(a,h.color,h.opacity),i.opacity=0;return e}function X(a,b,d){return c.round(d*b+(1-d)*a)}function W(a,b,c){var d=new h(a),e=new h(b),f=X(d.r,e.r,c),g=X(d.g,e.g,c),i=X(d.b,e.b,c);return(new h(f,g,i)).toHex()}function V(){return a.browser.msie&&!s()&&typeof window.performance!="undefined"}function T(a){this.view=a}function S(a){this.view=a}var a=jQuery,b=document,c=Math,d=window.kendo,e=d.Class,f=d.deepExtend,g=d.dataviz,h=g.Color,i=g.Box2D,j=g.Point2D,k=g.ExpandAnimation,l=g.ViewBase,m=g.ViewElement,n=g.defined,o=g.renderTemplate,p=g.uniqueId,q=g.rotatePoint,r=g.round,s=g.supportsSVG,t="#000",u=g.CLIP,v=g.COORD_PRECISION,w=g.DEFAULT_WIDTH,x=g.DEFAULT_HEIGHT,y=g.DEFAULT_FONT,z="object",A="linear",B="radial",C="transparent",D=l.extend({init:function(a){var b=this;l.fn.init.call(b,a),b.decorators.push(new S(b),new T(b)),g.ui.Chart&&b.decorators.push(new g.BarAnimationDecorator(b),new g.PieAnimationDecorator(b)),b.decorators.push(new U(b)),V()||b.decorators.push(new g.FadeAnimationDecorator(b)),g.Gauge&&b.decorators.push(new g.RadialPointerAnimationDecorator(b),new g.ArrowPointerAnimationDecorator(b),new g.BarIndicatorAnimationDecorator(b)),b.template=D.template,b.template||(b.template=D.template=o("<div style='width:#= d.options.width #px; height:#= d.options.height #px; position: relative;'>#= d.renderContent() #</div>"))},options:{width:w,height:x},renderTo:function(a){var c=this;b.namespaces&&b.namespaces.add("kvml","urn:schemas-microsoft-com:vml","#default#VML"),c.setupAnimations(),a.innerHTML=c.render(),c.playAnimations();return a.firstChild},renderElement:function(a){var c=b.createElement("div"),d;c.style.display="none",b.body.appendChild(c),c.innerHTML=a.render(),d=c.firstChild,b.body.removeChild(c);return d},createText:function(a,b){return this.decorate(b&&b.rotation?new F(a,b):new E(a,b))},createRect:function(a,b){return this.decorate(new J(a.points(),!0,b))},createLine:function(a,b,c,d,e){return this.decorate(new J([new j(a,b),new j(c,d)],!1,e))},createPolyline:function(a,b,c){return this.decorate(new J(a,b,c))},createCircle:function(a,b,c){return this.decorate(new M(a,b,c))},createSector:function(a,b){return this.decorate(new L(a,b))},createRing:function(a,b){return this.decorate(new K(a,b))},createGroup:function(a){return this.decorate(new N(a))},createGradient:function(a){var b=n(a.cx)&&n(a.cy)&&n(a.bbox);return a.type===B&&b?new R(a):a.type===A?new Q(a):t}});D.fromModel=function(a){var b=new D(a.options);[].push.apply(b.children,a.getViewElements(b));return b},D.available=function(){return a.browser.msie},D.preference=50,g.ui.registerView(D);var E=m.extend({init:function(a,b){var c=this;m.fn.init.call(c,b),c.content=a,c.template=E.template,c.template||(c.template=E.template=o("<kvml:textbox #= d.renderAttr(\"id\", d.options.id) # #= d.renderDataAttributes() #style='position: absolute; left: #= d.options.x #px; top: #= d.options.y #px; font: #= d.options.font #; color: #= d.options.color #; visibility: #= d.renderVisibility() #; white-space: nowrap;'>#= d.content #</kvml:textbox>"))},options:{x:0,y:0,font:y,color:t,fillOpacity:1},refresh:function(b){a(b).css("visibility",this.renderVisibility())},clone:function(){var a=this;return new E(a.content,f({},a.options))},renderVisibility:function(){return this.options.fillOpacity>0?"visible":"hidden"}}),F=m.extend({init:function(a,b){var c=this;m.fn.init.call(c,b),c.content=a,c.template=F.template,c.template||(c.template=F.template=o("<kvml:shape #= d.renderAttr(\"id\", d.options.id) # #= d.renderDataAttributes() #style='position: absolute; top: 0px; left: 0px; width: 1px; height: 1px;' stroked='false' coordsize='1,1'>#= d.renderPath() #<kvml:fill color='#= d.options.color #' /><kvml:textpath on='true' style='font: #= d.options.font #;' fitpath='false' string='#= d.content #' /></kvml:shape>"))},options:{x:0,y:0,font:y,color:t,size:{width:0,height:0}},renderPath:function(){var a=this,b=a.options,c=b.size.width,d=b.size.height,e=b.x+c/2,f=b.y+d/2,g=-b.rotation,h=q(b.x,f,e,f,g),i=q(b.x+c,f,e,f,g);return"<kvml:path textpathok='true' v='m "+r(h.x)+","+r(h.y)+" l "+r(i.x)+","+r(i.y)+"' />"}}),G=m.extend({init:function(a){var b=this;m.fn.init.call(b,a),b.template=G.template,b.template||(b.template=G.template=o('<kvml:stroke on=\'#= !!d.options.stroke #\' #= d.renderAttr("color", d.options.stroke) ##= d.renderAttr("weight", d.options.strokeWidth) ##= d.renderAttr("dashstyle", d.options.dashType) ##= d.renderAttr("opacity", d.options.strokeOpacity) # />'))}}),H=m.extend({init:function(a){var b=this;m.fn.init.call(b,a),b.template=H.template,b.template||(b.template=H.template=o('<kvml:fill on=\'#= d.isEnabled() #\' #= d.renderAttr("color", d.options.fill) ##= d.renderAttr("weight", d.options.fillWidth) ##= d.renderAttr("opacity", d.options.fillOpacity) # />'))},isEnabled:function(){var a=this.options.fill;return!!a&&a.toLowerCase()!==C}}),I=m.extend({init:function(a){var b=this;m.fn.init.call(b,a),b.template=I.template,b.template||(b.template=I.template=o("<kvml:shape #= d.renderAttr(\"id\", d.options.id) # #= d.renderDataAttributes() #style='position:absolute; #= d.renderSize() #' coordorigin='0 0' #= d.renderCoordsize() # ><kvml:path v='#= d.renderPoints() # e' />#= d.fill.render() + d.stroke.render() #</kvml:shape>")),b.stroke=new G(b.options),b.fill=new H(b.options)},options:{fill:"",fillOpacity:1,strokeOpacity:1,rotation:[0,0,0]},renderCoordsize:function(){var a=this.options.align===!1?1e4:1;return"coordsize='"+a+" "+a+"'"},renderSize:function(){var a=this.options.align===!1?100:1;return"width:"+a+"px; height:"+a+"px;"},render:function(){var a=this;a.fill.options.fillOpacity=a.options.fillOpacity,a.stroke.options.strokeOpacity=a.options.strokeOpacity;return m.fn.render.call(a)},renderPoints:function(){},refresh:function(b){if(!!b){var c=this,d=c.options,e=a(b),f=e[0].parentNode;if(f){e.find("path")[0].v=this.renderPoints();try{e.find("fill")[0].opacity=d.fillOpacity,e.find("stroke")[0].opacity=d.strokeOpacity}catch(g){}f.style.cssText=f.style.cssText}}}}),J=I.extend({init:function(a,b,c){var d=this;I.fn.init.call(d,c),d.points=a,d.closed=b},renderPoints:function(){var a=this,b=a.points,c,d=b.length,e=function(b){var c=a.options.rotation;return q(b.x,b.y,c[1],c[2],-c[0])},f="m "+a._print(e(b[0]));if(d>1){f+=" l ";for(c=1;c<d;c++)f+=a._print(e(b[c])),c<d-1&&(f+=", ")}a.closed&&(f+=" x");return f},clone:function(){var a=this;return new J(f([],a.points),a.closed,f({},a.options))},_print:function(a){var b=this.options.align===!1?100:1;return c.round(a.x*b)+","+c.round(a.y*b)}}),K=I.extend({init:function(a,b){var c=this;I.fn.init.call(c,b),c.pathTemplate=K.pathTemplate,c.pathTemplate||(c.pathTemplate=K.pathTemplate=o("M #= d.osp.x #,#= d.osp.y # WA #= d.obb.l #,#= d.obb.t # #= d.obb.r #,#= d.obb.b # #= d.osp.x #,#= d.osp.y # #= d.oep.x #,#= d.oep.y # L #= d.iep.x #,#= d.iep.y # AT #= d.ibb.l #,#= d.ibb.t # #= d.ibb.r #,#= d.ibb.b # #= d.iep.x #,#= d.iep.y # #= d.isp.x #,#= d.isp.y # X E")),c.config=a},renderPoints:function(){function q(a){return new j(r(a.x),r(a.y))}var a=this,b=a.config,d=c.max(r(b.r),0),e=c.max(r(b.ir),0),f=r(b.c.x),g=r(b.c.y),h=b.startAngle,i=b.angle+h,k={l:f-d,t:g-d,r:f+d,b:g+d},l={l:f-e,t:g-e,r:f+e,b:g+e},m,n,o,p;i=i-h>359.9?i-.22:i,m=q(b.point(h)),n=q(b.point(h,!0)),p=q(b.point(i)),o=q(b.point(i,!0));return a.pathTemplate({obb:k,ibb:l,osp:m,isp:n,oep:p,iep:o,cx:f,cy:g})},clone:function(){var a=this;return new K(f({},a.config),f({},a.options))}}),L=K.extend({init:function(a,b){var c=this;K.fn.init.call(c,a,b),c.pathTemplate=L.pathTemplate,c.pathTemplate||(c.pathTemplate=L.pathTemplate=o("M #= d.osp.x #,#= d.osp.y # WA #= d.obb.l #,#= d.obb.t # #= d.obb.r #,#= d.obb.b # #= d.osp.x #,#= d.osp.y # #= d.oep.x #,#= d.oep.y # L #= d.cx #,#= d.cy # X E"))},clone:function(){var a=this;return new L(f({},a.config),f({},a.options))}}),M=m.extend({init:function(a,b,c){var d=this;m.fn.init.call(d,c),d.center=a,d.radius=b,d.template=M.template,d.template||(d.template=M.template=o("<kvml:oval #= d.renderAttr(\"id\", d.options.id) # #= d.renderDataAttributes() #style='position:absolute; width:#= d.radius * 2 #px; height:#= d.radius * 2 #px; top:#= d.center[1] - d.radius #px; left:#= d.center[0] - d.radius #px;'>#= d.fill.render() + d.stroke.render() #</kvml:oval>")),d.stroke=new G(d.options),d.fill=new H(d.options)},options:{fill:""}}),N=m.extend({init:function(a){var b=this;m.fn.init.call(b,a),b.template=N.template,b.template||(b.template=N.template=o("<div #= d.renderAttr(\"id\", d.options.id) ##= d.renderDataAttributes() #style='position: absolute; white-space: nowrap;'>#= d.renderContent() #</div>"))}}),O=m.extend({init:function(a,b){var c=this;m.fn.init.call(c,b),c.template=O.template,c.clipTemplate=O.clipTemplate,c.template||(c.template=O.template=o("<div #= d.renderAttr(\"id\", d.options.id) #style='position:absolute; width:#= d.box.width() #px; height:#= d.box.height() #px; top:#= d.box.y1 #px; left:#= d.box.x1 #px; clip:#= d._renderClip() #;' >#= d.renderContent() #</div>"),c.clipTemplate=O.clipTemplate=o("rect(#= d.points[0].y #px #= d.points[1].x #px #= d.points[2].y #px #= d.points[0].x #px)")),c.box=a,c.points=a.points()},clone:function(){var a=this;return new O(a.box,f({},a.options))},refresh:function(a){a.style.clip=this._renderClip()},_renderClip:function(){return this.clipTemplate(this)}}),P=m.extend({init:function(a){var b=this;m.fn.init.call(b,a)},options:{opacity:1},renderColors:function(){var a=this,b=a.options,d=b.stops,e,f,g=d.length,h=[],i=c.round;for(f=0;f<g;f++)e=d[f],h.push(i(e.offset*100)+"% "+e.color);return h.join(",")}}),Q=P.extend({init:function(a){var b=this;P.fn.init.call(b,a),b.template=Q.template,b.template||(b.template=Q.template=o("<kvml:fill type='gradient' angle='#= 270 - d.options.rotation #' colors='#= d.renderColors() #' opacity='#= d.options.opacity #' />"))},options:{rotation:0}}),R=P.extend({init:function(a){var b=this;P.fn.init.call(b,a),b.template=R.template,b.template||(b.template=R.template=o("<kvml:fill type='gradienttitle' focus='100%' focusposition='#= d.focusPosition() #'colors='#= d.renderColors() #' color='#= d.firstColor() #' color2='#= d.lastColor() #' opacity='#= d.options.opacity #' />"))},focusPosition:function(){var a=this.options,b=a.bbox,c=a.cx,d=a.cy,e=Math.max(0,Math.min(1,(c-b.x1)/b.width())),f=Math.max(0,Math.min(1,(d-b.y1)/b.height()));return r(e,v)+" "+r(f,v)},firstColor:function(){var a=this.options.stops;return a[0].color},lastColor:function(){var a=this.options.stops;return a[a.length-1].color}});S.prototype={decorate:function(a){var b=a.options,c=this.view,d,e;b.overlay&&(e=b.overlay.bbox,d=c.buildGradient(f({},b.overlay,{_overlayFill:b.fill,_bboxHash:n(e)?e.getHash():""})));if(!d)return a;delete b.overlay,b.fill=f(Y(b.fill,d),{opacity:b.fillOpacity});return a}},T.prototype={decorate:function(a){var b=this,c=b.view,d=a.options,e=d.fill;e&&(e.gradient&&(e=c.buildGradient(e)),typeof e===z&&(a.fill=c.createGradient(e)));return a}};var U=e.extend({init:function(a){this.view=a},decorate:function(a){var b=this,c=b.view,d=c.options,e=a.options.animation,f;if(e&&e.type===u&&d.transitions){f=new O(new i(0,0,d.width,d.height),{id:p()}),c.animations.push(new k(f,{size:d.width})),f.children.push(a);return f}return a}});f(g,{VMLCircle:M,VMLClipAnimationDecorator:U,VMLClipRect:O,VMLFill:H,VMLGroup:N,VMLLine:J,VMLLinearGradient:Q,VMLOverlayDecorator:S,VMLPath:I,VMLRadialGradient:R,VMLRing:K,VMLRotatedText:F,VMLSector:L,VMLStroke:G,VMLText:E,VMLView:D,blendColors:W,blendGradient:Y})}(jQuery),function(a,b){var c=window.kendo,d=window.location,e=window.history,f=50,g=/^#*/,h=window.document.documentMode,i=a.browser.msie&&(!h||h<=8),j="onhashchange"in window&&!i,k=window.document,l=c.Observable.extend({start:function(a){a=a||{};var b=this;b._pushStateRequested=!!a.pushState,b._pushState=b._pushStateRequested&&b._pushStateSupported(),b.root=a.root||"/",b._interval=0,this.bind(["change","ready"],a);if(b._normalizeUrl())return!0;b.current=b._currentLocation(),b._listenToLocationChange(),b.trigger("ready",this.url())},stop:function(){a(window).unbind(".kendo"),this.unbind("change"),this.unbind("ready"),clearInterval(this._interval)},_normalizeUrl:function(){var a=this,b,c=a.root==d.pathname,f=a._pushStateRequested&&!a._pushStateSupported()&&!c,h=a._pushState&&c&&d.hash;if(f){d.replace(a.root+"#"+a._stripRoot(d.pathname));return!0}if(h){b=a._makePushStateUrl(d.hash.replace(g,"")),e.replaceState({},k.title,b);return!1}return!1},_listenToLocationChange:function(){var b=this,c=a.proxy(b._checkUrl,b);this._pushState?a(window).bind("popstate.kendo",c):j?a(window).bind("hashchange.kendo",c):b._interval=setInterval(c,f)},_pushStateSupported:function(){return window.history&&window.history.pushState},_checkUrl:function(a){var b=this,c=b._currentLocation();c!=b.current&&b.navigate(c)},_stripRoot:function(a){var b=this;return a.indexOf(b.root)===0?("/"+a.substr(b.root.length)).replace(/\/\//g,"/"):a},_makePushStateUrl:function(a){var b=this;a.indexOf(b.root)!==0&&(a=(b.root+a).replace(/\/\//g,"/"));return d.protocol+"//"+d.host+a},_currentLocation:function(){var a=this,b;if(a._pushState){b=d.pathname,d.search&&(b+=d.search);return a._stripRoot(b)}return d.hash.replace(g,"")},change:function(a){this.bind("change",a)},navigate:function(a,b){var c=this;if(a==="#:back")e.back();else{a=a.replace(g,"");if(c.current===a||c.current===decodeURIComponent(a))return;c._pushState?(e.pushState({},k.title,c._makePushStateUrl(a)),c.current=a):d.hash=c.current=a,b||c.trigger("change",c.url())}},url:function(){var a=this.current.split("?"),b={location:a[0],params:{},string:this.current},c=(a[1]||"").split(/&|=/),d=c.length,e=0;for(;e<d;e+=2)b.params[c[e]]=c[e+1];return b}});c.history=new l}(jQuery),function(a,b){var c=window.kendo,d=c.mobile.ui,e=c.ui.Popup,f="visibility",g="hidden",h="visible",i='<div class="km-shim"/>',j=d.Widget,k=j.extend({init:function(b,d){var e=this,f=a(i).hide();j.fn.init.call(e,b,d),e.shim=f,e.element=b,e.options.modal||e.shim.on(c.support.mouseup,a.proxy(e.hide,e)),c.notify(e)},options:{name:"Shim",modal:!0,duration:200},viewInit:function(a){var b=this,c=a.application,d="center center",f="fade:in";c.os==="ios"&&(d="bottom left",f="slideIn:up"),c.element.append(b.shim),b.popup=new e(b.element,{anchor:b.shim,appendTo:b.shim,origin:d,position:d,animation:{open:{effects:f,duration:b.options.duration},close:{duration:b.options.duration}},closed:function(){b.shim.hide()},open:function(){b.shim.show()}})},show:function(){this.popup.open(),this.popup.wrapper.css({width:"",left:"",top:""})},hide:function(){this.popup.close()}});d.plugin(k)}(jQuery),function(a,b){var c=window.kendo,d=c.mobile,e=d.ui,f=c.history,g=c.attr,h=c.Class,i=e.Widget,j="init",k="show",l="hide",m=c.roleSelector,n=i.extend({init:function(a,b){var d=this,f=m("content"),h;i.fn.init.call(d,a,b),a=d.element,d.layout=b.layout,d.application=b.application,d.element.data("kendoView",d).addClass("km-view"),d.header=a.find(m("header")).addClass("km-header"),d.footer=a.find(m("footer")).addClass("km-footer"),a.has(f)[0]||a.wrapInner("<div "+g("role")+'="content"></div>'),d.content=a.find(m("content")).addClass("km-content"),d.element.prepend(d.header).append(d.footer),d.id=a.data(c.ns+"url")||"#"+a.attr("id"),d.layout&&d.layout.setup(d),h=b.model,typeof h=="string"&&(h=c.getter(h)(window)),d.model=h,h?c.bind(a.children(),h,e):c.mobile.init(a.children()),d.content.kendoMobileScroller(),d.scroller=d.content.data("kendoMobileScroller"),d.scrollerContent=d.scroller.scrollElement,d.trigger(j,{view:d}),d._eachWidget(function(a){a.viewInit(d)})},events:[j,k,l],options:{name:"View",title:"",model:null},onHideStart:function(){var a=this;a.layout&&a.layout.detach(a)},onShowStart:function(){var a=this;a.element.css("display",""),a.params=f.url().params,a.layout&&a.layout.attach(a),a._eachWidget(function(b){b.viewShow(a)}),a.trigger(k,{view:a})},_eachWidget:function(b){var d;this.element.find("[data-"+c.ns+"role]").each(function(){d=c.widgetInstance(a(this),e),d&&b(d)})}}),o=h.extend({init:function(a){this.application=a},replace:function(a,b){var c=this,d=function(){c.application.transitioning=!1,a.element.hide(),a.trigger(l,{view:a})},e;c.back=b.nextView===a&&JSON.stringify(b.params)===JSON.stringify(f.url().params),e=c.application.dataOrDefault((c.back?a:b).element,"transition"),c.parallax=e==="slide",a.onHideStart(),b.onShowStart(),c.back&&!c.parallax?(b.element.css("z-index",0),a.element.css("z-index",1)):(b.element.css("z-index",1),a.element.css("z-index",0)),c.switchWith(a.footer,b.footer),c.switchWith(a.header,b.header),c.contents(a,b).kendoAnimateTo(c.contents(b,a),{effects:e,reverse:c.back,complete:d}),c.back||(a.nextView=b)},contents:function(a,b){var c;this.parallax?(c=a.content,b.header[0]||(c=c.add(a.header)),b.footer[0]||(c=c.add(a.footer))):c=a.element;return c},switchWith:function(a,b){a[0]&&b[0]&&a[0]!=b[0]&&this.parallax&&a.kendoAnimateTo(b,{effects:"fade"})}}),p=i.extend({init:function(a,b){var d=this;i.fn.init.call(d,a,b),a=d.element,d.element=a.detach(),d.header=a.find(m("header")).addClass("km-header"),d.footer=a.find(m("footer")).addClass("km-footer"),d.elements=d.header.add(d.footer),c.mobile.init(d.element.children()),d.trigger(j,{layout:d})},options:{name:"Layout"},events:[j,k,l],setup:function(a){a.header[0]||(a.header=this.header),a.footer[0]||(a.footer=this.footer)},detach:function(a){var b=this;a.header===b.header&&a.element.prepend(b.header.detach().clone(!0)),a.footer===b.footer&&a.element.append(b.footer.detach().clone(!0)),b.trigger(l,{layout:b,view:a})},attach:function(a){var b=this;a.header===b.header&&(b.header.detach(),a.element.find(m("header")).remove(),a.element.prepend(b.header)),a.footer===b.footer&&(b.footer.detach(),a.element.find(m("footer")).remove(),a.element.append(b.footer)),b.trigger(k,{layout:b,view:a})}});e.plugin(n),e.plugin(p),d.ViewSwitcher=o}(jQuery),function(a,b){function N(){a("meta[name=viewport]").replaceWith(s({height:L()?", height=device-width":", height=device-height"}))}function M(){return L()?q:p}function L(){return Math.abs(window.orientation)/90==1}function K(b){var d=a(b.currentTarget).data(c.ns+"rel");d!=C&&b.preventDefault()}function J(b){if(!(b.which>1||b.isDefaultPrevented())){var e=a(b.currentTarget),f=e.data(c.ns+"rel"),g=e.attr(B);if(f===C)return;g&&g!=D&&(e.attr(B,D),setTimeout(function(){e.attr(B,g)}),f==="actionsheet"?a(g).data("kendoMobileActionSheet").openFor(e):d.navigate(g)),b.preventDefault()}}var c=window.kendo,d=c.history,e=c.support,f=c.mobile,g=c.roleSelector,h=c.attr,i=f.ViewSwitcher,j=e.mobileOS,k,l,m,n=c.template("#=data.name##if(data.version){# #=data.name##=data.version.major# km-m#=data.version.minor# #=data.version.appMode?'km-app':'km-web'##}#",{usedWithBlock:!1}),o=j.device=="blackberry"&&j.flatVersion>=600&&j.flatVersion<1e3&&j.appMode,p="km-vertical",q="km-horizontal",r={ios:"iPhone OS 4_3",android:"Android 2.3.3",blackberry:"PlayBook Version/7.2.0.0",meego:"MeeGo NokiaBrowser/8.5.0"},s=c.template('<meta content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width#=data.height#" name="viewport" />',{usedWithBlock:!1}),t='<meta name="apple-mobile-web-app-capable" content="yes" /> <meta name="apple-mobile-web-app-status-bar-style" content="black" /> '+s({height:""}),u=c.template('<link rel="apple-touch-icon'+(e.mobileOS.android?"-precomposed":"")+'" # if(data.size) { # sizes="#=data.size#" #}# href="#=data.icon#" />',{usedWithBlock:!1}),v=function(a){return a.replace(/(\S+)/g,"["+h("role")+"=$1],")},w=v("button backbutton detailbutton listview-link"),x=v("tab"),y="onorientationchange"in window?"orientationchange":"resize",z=j.device=="iphone"||j.device=="ipod",A=60,B="href",C="external",D="#!",E=/<body[^>]*>(([\u000a\u000d\u2028\u2029]|.)*)<\/body>/i,F=a(window),G=a("head"),H=["touchstart","touchend","touchmove","mousedown","mousemove","mouseup"],I=a.proxy,O=c.Observable.extend({init:function(b,d){var e=this;e.layouts={},c.mobile.application=e,e.options=a.extend({hideAddressBar:!0,transition:""},d),c.Observable.fn.init.call(e,e.options),e.element=b?a(b):a(document.body),a(function(){e._setupPlatform(),e._attachHideBarHandlers(),e._attachMeta(),e._setupElementClass(),e._loader(),e._setupAppLinks(),e._setupLayouts(e.element),e._startHistory(),e._attachCapture()})},navigate:function(a){var b=this;b.transitioning=!0,b._findView(a,function(c){b.view!==c&&(d.navigate(a,!0),(new i(b)).replace(b.view,c),b.view=c)})},scroller:function(){return this.view.content.data("kendoScroller")},hideLoading:function(){var a=this;clearTimeout(a._loading),a.loader.hide()},showLoading:function(){var a=this;clearTimeout(a._loading);a.options.loading!==!1&&(a._loading=setTimeout(function(){a.loader.show()},100))},_setupAppLinks:function(){this.element.delegate(x,e.mousedown,J).delegate(w,e.mouseup,J).delegate(x+w,"click",K)},_setupPlatform:function(){var a=this,b=a.options.platform,c=typeof b=="string";b&&(j=c?e.detectOS(r[b]):b,e.mobileOS=j),k=j?j.name:"ios",l="km-"+k,m=n({name:l,version:j?{appMode:j.appMode,major:j.majorVersion,minor:j.minorVersion?j.minorVersion[0]:0}:!1}),a.os=k},_setupLayouts:function(d){var e=this,f=c.ns+"platform";d.find(g("layout")).each(function(){var d=a(this),g=d.data(f);if(g===b||g===k)e.layouts[d.data("id")]=c.initWidget(d,{},c.mobile.ui)})},_startHistory:function(){var b=this,c,e,f=b.options.initial;c=b.element.find(g("view")),b.rootView=c.first(),e={change:function(a){b.navigate(a.string)},ready:function(a){var e=a.string,g=!e&&f;g&&(e=f),b._findView(e,function(a){c.not(a).hide(),a.onShowStart(),b.view=a,g&&d.navigate(f,!0)})}},d.start(a.extend(b.options,e))},_createView:function(a){var b=this,d=b.dataOrDefault(a,"layout");d&&(d=b.layouts[d]);var e=c.initWidget(a,{application:this,layout:d},c.mobile.ui);return e},_createRemoteView:function(b,c){var d=this,e=a("<div />"),f,i;E.test(c)&&(c=RegExp.$1),e[0].innerHTML=c,f=e.find(g("view")).hide(),i=f.first(),i.hide().attr(h("url"),b),d._setupLayouts(e),d.element.append(e.find(g("layout"))).append(e.find("script, style")).append(f);return d._createView(i)},_findView:function(b,c){var d=this,e,f=b.charAt(0),g=f==="#",i=f==="/",j;b?(j=d.element.find("["+h("url")+"='"+b+"']"),!j[0]&&!i&&(j=d.element.find(g?b:"#"+b))):j=d.rootView,e=j.data("kendoView"),e?c(e):j[0]?c(d._createView(j)):(d._xhr&&d._xhr.abort(),d.showLoading(),d._xhr=a.get(b,function(a){c(d._createRemoteView(b,a)),d.hideLoading()},"html").fail(function(){d.hideLoading()}))},_setupElementClass:function(){var a=this,b=a.options.platform?"km-"+a.options.platform:m,c=a.element;c.parent().addClass("km-root"),c.addClass(b+" "+M()),o&&N(),F.bind(y,function(b){c.removeClass("km-horizontal km-vertical").addClass(M()),o&&N(),a.view&&a.view.scroller.reset()})},_attachMeta:function(){var a=this.options.icon,b;G.prepend(t);if(a){typeof a=="string"&&(a={"":a});for(b in a)G.prepend(u({icon:a[b],size:b}))}},_attachHideBarHandlers:function(){var a=this,b=I(a._hideBar,a);!j.appMode&&!!a.options.hideAddressBar&&(a._initialHeight={},z&&(F.bind("load "+y,b),a.element[0].addEventListener(e.mousedown,b,!0)))},_hideBar:function(){var a=this,b=a.element,c=window.orientation+"",d=a._initialHeight,e;d[c]||(d[c]=F.height()),e=d[c]+A,e!=b.height()&&b.height(e),setTimeout(window.scrollTo,0,0,1)},_attachCapture:function(){function b(b){a.transitioning&&b.stopPropagation()}var a=this;a.transitioning=!1;for(var c=0;c<H.length;c++)a.element[0].addEventListener(H[c],b,!0)},dataOrDefault:function(a,b){return typeof a.data(c.ns+b)!="undefined"?a.data(b):this.options[b]},_loader:function(){var c=this,d=c.options.loading;d===b&&(d="<h1>Loading...</h1>"),c.loader=a('<div class="km-loader"><span class="km-loading km-spin"></span>'+d+"</div>").hide().appendTo(c.element)}});c.mobile.Application=O}(jQuery),function(a,b){var c=window.kendo,d=c.mobile.ui,e=d.Shim,f=d.Widget,g="open",h="li>a",i="actionsheetContext",j='<div class="km-actionsheet-wrapper" />',k=c.template('<li class="km-actionsheet-cancel"><a href="\\#">#:cancel#</a></li>'),l=f.extend({init:function(b,d){var g=this,i=c.support.mobileOS,l;f.fn.init.call(g,b,d),b=g.element,b.addClass("km-actionsheet").append(k({cancel:g.options.cancel})).wrap(j).on(c.support.mouseup,h,a.proxy(g._click,g)).on("click",h,c.preventDefault),l=b.parent(),g.wrapper=l,g.shim=new e(g.wrapper,{modal:!i.android&&!i.meego})},events:[g],options:{name:"ActionSheet",cancel:"Cancel"},open:function(b,c){var d=this;d.target=a(b),d.context=c,d.trigger(g,{target:d.target,context:d.context}),d.shim.show()},close:function(){this.context=this.target=null,this.shim.hide()},openFor:function(a){var b=this;b.target=a,b.context=a.data(i),b.trigger(g,{target:b.target,context:b.context}),b.shim.show()},_click:function(b){if(!b.originalEvent||!b.originalEvent.defaultPrevented){var d=a(b.currentTarget).data("action");d&&c.getter(d)(window)({target:this.target,context:this.context}),b.preventDefault(),this.close()}}});d.plugin(l)}(jQuery),function(a,b){var c=window.kendo,d=c.mobile,e=d.ui,f=e.Widget,g=c.support,h=g.mobileOS,i=h.android&&h.flatVersion>=300,j=g.mousecancel,k=g.mousedown,l=g.mousemove,m=g.mouseup,n="click",o=0,p=a.proxy,q=f.extend({init:function(a,b){var c=this;f.fn.init.call(c,a,b),c._wrap(),c._style(),c._releaseProxy=p(c._release,c),c._removeProxy=p(c._removeActive,c),c.element.bind(m,c._releaseProxy),c.element.bind(k+" "+j+" "+m,c._removeProxy),i&&c.element.bind(l,function(a){o||(o=setTimeout(c._removeProxy,500,a))})},events:[n],options:{name:"Button",icon:"",style:""},_removeActive:function(b){a(b.target).closest(".km-button,.km-detail").toggleClass("km-state-active",b.type==k),i&&(clearTimeout(o),o=0)},_release:function(b){var c=this;b.which>1||c.trigger(n,{target:a(b.target),button:c.element})&&b.preventDefault()},_style:function(){var b=this.options.style,c=this.element,d;b&&(d=b.split(" "),a.each(d,function(){c.addClass("km-"+this)}))},_wrap:function(){var b=this,c=b.options.icon,d='<span class="km-icon km-'+c,e=b.element.addClass("km-button"),f=e.children("span:not(.km-icon)").addClass("km-text"),g=e.find("img").addClass("km-image");!f[0]&&e.html()&&(f=e.wrapInner('<span class="km-text" />').children("span.km-text")),!g[0]&&c&&(f[0]||(d+=" km-notext"),e.prepend(a(d+'" />')))}}),r=q.extend({options:{name:"BackButton",style:"back"},init:function(a,b){q.fn.init.call(this,a,b),this.element.attr("href","#:back")}}),s=q.extend({options:{name:"DetailButton",style:""},init:function(a,b){q.fn.init.call(this,a,b)},_style:function(){var b=this.options.style+" detail",c=this.element;if(b){var d=b.split(" ");a.each(d,function(){c.addClass("km-"+this)})}},_wrap:function(){var b=this,c=b.options.icon,d='<span class="km-icon km-'+c,e=b.element,f=e.children("span"),g=e.find("img").addClass("km-image");!g[0]&&c&&(f[0]||(d+=" km-notext"),e.prepend(a(d+'" />')))}});e.plugin(q),e.plugin(r),e.plugin(s)}(jQuery),function(a,b){var c=window.kendo,d=c.mobile.ui,e=d.Widget,f="km-state-active",g="select",h="li:not(."+f+")",i=c.support.touch?"touchstart":"mousedown",j=e.extend({init:function(b,c){var d=this;e.fn.init.call(d,b,c),d.element.addClass("km-buttongroup").delegate(h,i,a.proxy(d._mousedown,d)).find("li").each(d._button),d.select(d.options.index)},events:[g],options:{name:"ButtonGroup",index:-1},current:function(){return this.element.find("."+f)},select:function(c){var d=this,e=-1;c!==b&&c!==-1&&(d.current().removeClass(f),typeof c=="number"?(e=c,c=a(d.element[0].children[c])):c.nodeType&&(c=a(c),e=c.index()),c.addClass(f),d.selectedIndex=e)},_button:function(){var b=a(this).addClass("km-button"),d=b.data(c.ns+"icon"),e=b.children("span"),f=b.find("img").addClass("km-image");e[0]||(e=b.wrapInner("<span/>").children("span")),e.addClass("km-text"),!f[0]&&d&&b.prepend(a('<span class="km-icon km-'+d+'"/>'))},_mousedown:function(a){if(!(a.which>1)){var b=this;b.select(a.currentTarget),b.trigger(g)}}});d.plugin(j)}(jQuery),function(a,b){function C(b,c){c=a(c);if(!!c.children("input[type=checkbox],input[type=radio]").length){var d=c.parent();if(d.contents().not(c).not(function(){return this.nodeType==3})[0])return;c.addClass("km-listview-label")}}function B(b,d){d=a(d);var e=d.parent(),f=d.add(e.children("[data-"+c.ns+"role=detailbutton]")),g=e.contents().not(f).not(z);if(!g.length){var h=e.data(c.ns+"icon"),i=a('<span class="km-icon"/>');d.addClass("km-listview-link").attr(c.attr("role"),"listview-link"),h&&(d.prepend(i),i.addClass("km-"+h))}}function A(b,d){d=a(d);var e=d.data(c.ns+"icon"),f=a('<span class="km-icon"/>');e&&(d.prepend(f),f.addClass("km-"+e))}function z(){return this.nodeType===d.TEXT_NODE&&this.nodeValue.match(/^\s+$/)}function y(b){if(!(b.which>1)){var d=a(b.currentTarget),e=d.parent(),f=d.data(c.ns+"role")||"",g=!f.match(/button/),h=b.originalEvent&&b.originalEvent.defaultPrevented;g&&e.toggleClass("km-state-active",b.type===s&&!h);if(d.is("label")&&b.type===v&&!h){var i=d.find("input"),j=i.attr("type"),k=!i[0].checked;j==="radio"&&(k=!0),i[0].checked=k}}}var c=window.kendo,d=window.Node,e=c.mobile,f=e.ui,g=c.support,h=c.data.DataSource,i=f.Widget,j=".km-list > li",k=".km-list > li > .km-listview-link, .km-list > li > .km-listview-label",l=".km-list > li > .km-listview-label > input",m=a.proxy,n="km-group-title",o='<div class="'+n+'"><span class="km-text"></span></div>',p=c.template('<li><div class="'+n+'">#= this.headerTemplate(data) #</div><ul>#= kendo.render(this.template, data.items)#</ul></li>'),q='<div class="km-listview-wrapper" />',r="function",s=g.mousedown,t=g.mousemove,u=g.mousecancel,v=g.mouseup,w="click",x="requestStart",D=i.extend({init:function(a,b){var d=this;i.fn.init.call(d,a,b),b=d.options,d.element.on([s,v,t,u].join(" "),k,y).on("click",l,function(a){a.preventDefault()}).on(v,j,m(d._click,d)),d.element.wrap(q),d.wrapper=d.element.parent(),d._footer(),d._dataSource(),d._bindScroller(),b.dataSource?d.dataSource.fetch():d._style(),c.notify(d,f)},events:[w],options:{name:"ListView",type:"flat",template:"${data}",headerTemplate:'<span class="km-text">${value}</span>',appendOnRefresh:!1,loadMore:!1,loadMoreText:"Press to load more",endlessScroll:!1,scrollTreshold:30,pullToRefresh:!1,pullTemplate:"Pull to refresh",releaseTemplate:"Release to refresh",refreshTemplate:"Refreshing",pullOffset:140,style:""},setOptions:function(a){i.fn.setOptions.call(this,a)},setDataSource:function(a){this.options.dataSource=a,this._dataSource(),a.fetch()},_dataSource:function(){var a=this,b=a.options;a.dataSource&&a._refreshHandler?a.dataSource.unbind("change",a._refreshHandler).unbind(x,a._showLoading):a._refreshHandler=m(a.refresh,a),a.dataSource=h.create(b.dataSource).bind("change",a._refreshHandler),!b.pullToRefresh&&!b.loadMore&&!b.endlessScroll&&a.dataSource.bind(x,a._showLoading)},_bindScroller:function(){var a=this,b=a.options,c=a.dataSource,d=a._scroller();!d||(b.pullToRefresh&&d.setOptions({pullToRefresh:!0,pull:function(){c.read()},pullTemplate:b.pullTemplate,releaseTemplate:b.releaseTemplate,refreshTemplate:b.refreshTemplate}),b.endlessScroll&&(a._scrollHeight=d.element.height(),d.setOptions({resize:function(){a._scrollHeight=d.element.height(),a._calcTreshold()},scroll:function(b){!a.loading&&b.scrollTop+a._scrollHeight>a._treshold&&(a.loading=!0,a._toggleIcon(!0),c.next())}})))},_calcTreshold:function(){var a=this,b=a._scroller();b&&(a._treshold=b.scrollHeight()-a.options.scrollTreshold)},refresh:function(b){b=b||{};var d=this,g=d.element,h=d.options,i=d.dataSource,j=i.view(),k=d.loading,l=k?"append":"html",m,n,o;b.action==="itemchange"?(n=b.items[0],o=a(d.template(n)),g.find("[data-"+c.ns+"uid="+n.uid+"]").replaceWith(o),d.trigger("itemChange",{item:o,data:n,ns:f})):(d.template||d._templates(),d.trigger("dataBinding"),i.group()[0]?(h.type="group",m=c.render(d.groupTemplate,j)):m=c.render(d.template,j),h.appendOnRefresh&&(l="prepend"),g[l](m),k&&(d.loading=!1,h.loadMore?d._toggleButton(!0):d._toggleIcon(!1)),h.pullToRefresh&&d._scroller().pullHandled(),e.init(g.children()),d._hideLoading(),d._style(),d.trigger("dataBound",{ns:f}))},_templates:function(){var b=this,d=b.options.template,e=b.options.headerTemplate,f="",g={},h={};if(b.dataSource.group()[0]||b.dataSource.view()[0]instanceof c.data.ObservableObject)f=' data-uid="#=uid#"';typeof d===r&&(g.template=d,d="#=this.template(data)#"),h.template=b.template=a.proxy(c.template("<li"+f+">"+d+"</li>"),g),typeof e===r&&(h._headerTemplate=e,e="#=this._headerTemplate(data)#"),h.headerTemplate=c.template(e),b.groupTemplate=a.proxy(p,h)},_click:function(b){if(!(b.which>1||b.isDefaultPrevented())){var d=this,e,g=a(b.currentTarget),h=a(b.target),i=h.closest(c.roleSelector("button","detailbutton","backbutton")),j=c.widgetInstance(i,f),k=g.attr(c.attr("uid"));k&&(e=d.dataSource.getByUid(k)),d.trigger(w,{target:h,item:g,dataItem:e,button:j})&&b.preventDefault()}},items:function(){return this.options.type==="group"?this.element.find(".km-list").children():this.element.children()},_style:function(){var b=this,c,d,e,f,g,h=b.options,i=h.type==="group",j=b.element,k=h.style==="inset";j.addClass("km-listview").toggleClass("km-list",!i).toggleClass("km-listinset",!i&&k).toggleClass("km-listgroup",i&&!k).toggleClass("km-listgroupinset",i&&k),i&&(j.children().children("ul").addClass("km-list"),j.children("li").each(function(){var b=a(this).contents().first();!b.is("ul")&&!b.is("div."+n)&&b.wrap(o)})),c=b.items(),c.each(function(){var a=this,b=!1;for(d=0,e=a.childNodes.length;d<e;d++)f=a.childNodes[d],g=f.nodeName.toUpperCase(),g=="A"&&(B(d,f),b=!0),g=="LABEL"&&(C(d,f),b=!0);b||A(d,a)}),j.closest(".km-content").toggleClass("km-insetcontent",k)},_footer:function(){var b=this,c=b.options,d=c.loadMore,e;if(d||c.endlessScroll)b._loadIcon=a('<span style="display:none" class="km-icon"></span>'),e=a('<span class="km-load-more"></span>').append(b._loadIcon),d&&(b._loadButton=a('<button class="km-load km-button">'+c.loadMoreText+"</button>").click(function(){b.loading=!0,b._toggleButton(!1),b.dataSource.next()}),e.append(b._loadButton)),b.wrapper.append(e)},_toggleButton:function(a){this._loadButton.toggle(a),this._toggleIcon(!a)},_toggleIcon:function(a){var b=this._loadIcon;a?b.css("display","block"):b.hide()},_scroller:function(){var a=this.view();return a&&a.scroller},_showLoading:function(){e.application&&e.application.showLoading()},_hideLoading:function(){e.application&&e.application.hideLoading()}});f.plugin(D)}(jQuery),function(a,b){function g(b,d){var e=d.find("["+c.attr("align")+"="+b+"]");e[0]&&d.prepend(a('<div class="km-'+b+'item" />').append(e))}var c=window.kendo,d=c.mobile.ui,e=c.roleSelector,f=d.Widget,h=f.extend({init:function(b,c){var d=this;f.fn.init.call(d,b,c),b=d.element,d._title=document.title,b.addClass("km-navbar").wrapInner(a('<div class="km-view-title" />')),g("left",b),g("right",b)},options:{name:"NavBar"},title:function(a){this.element.find(e("view-title")).text(a),document.title=a!==b?a:this._title},viewShow:function(a){this.title(a.options.title)}});d.plugin(h)}(jQuery),function(a,b){var c=window.kendo,d=c.mobile,e=d.ui,f=a.proxy,g=c.fx.Transition,h=c.ui.Pane,i=c.ui.PaneDimensions,j=e.Widget,k=Math,l=k.abs,m=k.ceil,n=k.round,o=k.max,p=k.min,q=k.floor,r="change",s="km-current-page",t=j.extend({init:function(b,d){var e=this;j.fn.init.call(e,b,d),b=e.element,b.wrapInner("<div/>").addClass("km-scrollview").append('<ol class="km-pages"/>'),e.inner=b.children().first(),e.pager=b.children().last(),e.page=0;var k,m,n,o,p,q;k=new c.ui.Movable(e.inner),m=new g({axis:"x",movable:k,onEnd:function(){e.page=Math.round(-k.x/p.size),e._updatePage()}}),n=new c.Drag(b,{start:function(){l(n.x.velocity)*2>=l(n.y.velocity)?n.capture():n.cancel(),m.cancel()},end:a.proxy(e._dragEnd,e)}),o=new i({element:e.inner,container:e.element}),p=o.x,p.bind("change",f(e.refresh,e)),q=new h({dimensions:o,drag:n,movable:k,elastic:!0}),a.extend(e,{movable:k,transition:m,drag:n,dimensions:o,dimension:p,pane:q}),e.page=e.options.page},options:{name:"ScrollView",page:0,duration:300,velocityThreshold:.8,bounceVelocityThreshold:1.6},events:[r],viewShow:function(a){this.dimensions.refresh()},refresh:function(){var a=this,b="",c=a.dimension,d=c.size,e;a.element.find("[data-role=page]").width(d),c.update(!0),a.scrollTo(a.page),e=a.pages=m(c.total/d),a.minSnap=-(e-1)*d,a.maxSnap=0;for(var f=0;f<e;f++)b+="<li/>";a.pager.html(b),a._updatePage()},content:function(a){this.element.children().first().html(a),this.dimensions.refresh()},scrollTo:function(a){this.page=a,this._moveTo(-a*this.dimension.size,g.easeOutExpo)},_moveTo:function(a,b){this.transition.moveTo({location:a,duration:this.options.duration,ease:b})},_dragEnd:function(a){var b=this,c=a.x.velocity,d=b.dimension.size,e=b.options,f=e.velocityThreshold,h,i=n,j=g.easeOutExpo;c>f?i=m:c<-f&&(i=q),l(c)>e.bounceVelocityThreshold&&(j=g.easeOutBack),h=o(b.minSnap,p(i(b.movable.x/d)*d,b.maxSnap)),this._moveTo(h,j)},_updatePage:function(){var a=this,b=a.pager,c=a.page;a.trigger(r,{page:c}),b.children().removeClass(s).eq(c).addClass(s)}});e.plugin(t)}(jQuery),function(a,b){function n(a,b,c){return Math.max(b,Math.min(c,a))}var c=window.kendo,d=c.mobile.ui,e=d.Widget,f=c.support,g="change",h="km-switch-on",i="km-switch-off",j="margin-left",k="km-state-active",l=f.transitions.css+"transform",m=a.proxy,o=e.extend({init:function(a,b){var d=this,f,g,h;e.fn.init.call(d,a,b),d._wrapper(),d._drag(),d._background(),d._handle(),a=d.element.data(c.attr("role"),"switch"),a[0].type="checkbox",f=d.wrapper.width(),h=d.handle.outerWidth(!0),d.constrain=f-h,d.snapPoint=f/2-h/2,d._animateBackground=!0,g=d.options.checked,g===null&&(g=a[0].checked),d.check(g),c.notify(d,c.mobile.ui)},events:[g],options:{name:"Switch",onLabel:"ON",offLabel:"OFF",checked:null},check:function(a){var c=this,d=c.element[0];if(a===b)return d.checked;c._position(a?c.constrain:0),d.checked=a,c.wrapper.toggleClass(h,a).toggleClass(i,!a)},toggle:function(){var a=this;a.check(!a.element[0].checked)},_move:function(a){var b=this;a.preventDefault(),b._position(n(b.position+a.x.delta,0,b.constrain))},_position:function(a){var b=this;b.position=a,b.handle.css(l,"translatex("+a+"px)"),b._animateBackground&&b.background.css(j,b.origin+a)},_start:function(a){this.drag.capture(),this.handle.addClass(k)},_stop:function(a){var b=this;b.handle.removeClass(k),b._toggle(b.position>b.snapPoint)},_toggle:function(a){var b=this,c=b.handle,d=b.element[0],e=d.checked,f=200,j;b.wrapper.toggleClass(h,a).toggleClass(i,!a),b.position=j=a*b.constrain,b._animateBackground&&b.background.kendoStop(!0,!0).kendoAnimate({effects:"slideMargin",offset:j,reverse:!a,axis:"left",duration:f,ease:"linear"}),c.kendoStop(!0,!0).kendoAnimate({effects:"slideTo",duration:f,offset:j+"px,0",complete:function(){e!==a&&(d.checked=a,b.trigger(g,{checked:a}))}})},_background:function(){var b=this,c;c=a("<span class='km-switch-wrapper'><span class='km-switch-background'></span></span>").appendTo(b.wrapper).children(".km-switch-background"),b.origin=parseInt(c.css(j),10),c.data("origin",b.origin),b.background=c},_handle:function(){var b=this,c=b.options;b.handle=a("<span class='km-switch-container'><span class='km-switch-handle' /></span>").appendTo(b.wrapper).children(".km-switch-handle"),b.handle.append('<span class="km-switch-label-on">'+c.onLabel+'</span><span class="km-switch-label-off">'+c.offLabel+"</span>")},_wrapper:function(){var a=this,b=a.element,c=b.parent("span.km-swith");c[0]||(c=b.wrap('<span class="km-switch"/>').parent()),a.wrapper=c},_drag:function(){var a=this;a.drag=new c.Drag(a.wrapper,{tap:function(){a._toggle(!a.element[0].checked)},start:m(a._start,a),move:m(a._move,a),end:m(a._stop,a)})}});d.plugin(o)}(jQuery),function(a,b){var c=window.kendo,d=c.mobile.ui,e=d.Widget,f=c.support,g="km-state-active",h="select",i=a.proxy,j=e.extend({init:function(a,b){var c=this;e.fn.init.call(c,a,b),c.element.addClass("km-tabstrip"),c._releaseProxy=i(c._release,c),c.element.find("a").each(c._buildButton).bind(f.mousedown,c._releaseProxy).eq(c.options.selectedIndex).addClass(g)},events:[h],switchTo:function(a){this._setActiveItem(this.element.find('a[href$="'+a+'"]'))},currentItem:function(){return this.element.children("."+g)},_release:function(b){if(!(b.which>1)){var c=this,d=a(b.currentTarget);if(d[0]===c.currentItem()[0])return;c.trigger(h,{item:d})?b.preventDefault():c._setActiveItem(d)}},_setActiveItem:function(a){!a[0]||(this.currentItem().removeClass(g),a.addClass(g))},_buildButton:function(){var b=a(this),d=b.data(c.ns+"icon"),e=b.find("img"),f=a('<span class="km-icon"/>');b.addClass("km-button").attr(c.attr("role"),"tab").contents().not(e).wrapAll('<span class="km-text"/>'),e[0]?e.addClass("km-image"):(b.prepend(f),d&&f.addClass("km-"+d))},viewShow:function(a){var b=this;b.switchTo(a.id)},options:{name:"TabStrip",selectedIndex:0,enable:!0}});d.plugin(j)}(jQuery);
define("libs/kendo/kendo.all.min", function(){});

(function() {

  require.config({
    paths: {
      jQuery: 'libs/jquery/jquery',
      Kendo: 'libs/kendo/kendo',
      WebGL: 'libs/webgl/glfx'
    }
  });

  require(['app', 'order!libs/jquery/jquery.min', 'order!libs/kendo/kendo.all.min', 'order!libs/webgl/glfx.min'], function(app) {
    return app.init();
  });

}).call(this);

define("main", function(){});