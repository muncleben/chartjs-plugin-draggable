/*!
 * chartjs-plugin-draggable.js
 * http://chartjs.org/
 * Version: 0.1.0
 * 
 * Copyright 2016 Jonathon Hill
 * Released under the MIT license
 * https://github.com/compwright/chartjs-plugin-draggable/blob/master/LICENSE.md
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _chart = __webpack_require__(1);

	var _chart2 = _interopRequireDefault(_chart);

	var _plugin = __webpack_require__(2);

	var _accessor = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var plugin = new _plugin.ChartjsDraggablePlugin([_accessor.DraggableAnnotationAccessor]);

	_chart2.default.pluginService.register(plugin);

	exports.default = plugin;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Chart;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ChartjsDraggablePlugin = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _d3Drag = __webpack_require__(3);

	var _d3Selection = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChartjsDraggablePlugin = exports.ChartjsDraggablePlugin = function () {
		function ChartjsDraggablePlugin(accessors) {
			_classCallCheck(this, ChartjsDraggablePlugin);

			this.accessors = accessors.filter(function (accessor) {
				return accessor.isSupported();
			});
			this.subject = null;
		}

		_createClass(ChartjsDraggablePlugin, [{
			key: 'afterInit',
			value: function afterInit(chartInstance) {
				var _this = this;

				(0, _d3Selection.select)(chartInstance.chart.canvas).call((0, _d3Drag.drag)().container(chartInstance.chart.canvas).filter(function () {
					_this.subject = _this.accessors
					// All draggable elements that are enabled
					.map(function (accessor) {
						return accessor.getElements(chartInstance);
					})
					// Flatten array of arrays
					.reduce(function (list, innerList) {
						return list.concat(innerList);
					}, [])
					// Select the first element whose box the click started in
					// @TODO: select the nearest element to drag
					.filter(function (draggable) {
						return draggable.isInBox(_d3Selection.event, 10);
					})[0];

					// Only proceed if the drag gesture started on a draggable element
					return !!_this.subject;
				}).subject(function () {
					return _this.subject;
				}).on('start', this._getDispatcher('onDragStart')).on('drag', this._getDispatcher('onDrag')).on('end', this._getDispatcher('onDragEnd')));
			}
		}, {
			key: '_getDispatcher',
			value: function _getDispatcher(type) {
				var _this2 = this;

				return function () {
					_this2.subject.dispatch(type, _d3Selection.event);
				}.bind(this);
			}
		}]);

		return ChartjsDraggablePlugin;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-drag/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(4), __webpack_require__(5)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch', 'd3-selection'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
	}(this, function (exports,d3Dispatch,d3Selection) { 'use strict';

	  function nopropagation() {
	    d3Selection.event.stopImmediatePropagation();
	  }

	  function noevent() {
	    d3Selection.event.preventDefault();
	    d3Selection.event.stopImmediatePropagation();
	  }

	  function nodrag(view) {
	    var root = view.document.documentElement,
	        selection = d3Selection.select(view).on("dragstart.drag", noevent, true);
	    if ("onselectstart" in root) {
	      selection.on("selectstart.drag", noevent, true);
	    } else {
	      root.__noselect = root.style.MozUserSelect;
	      root.style.MozUserSelect = "none";
	    }
	  }

	  function yesdrag(view, noclick) {
	    var root = view.document.documentElement,
	        selection = d3Selection.select(view).on("dragstart.drag", null);
	    if (noclick) {
	      selection.on("click.drag", noevent, true);
	      setTimeout(function() { selection.on("click.drag", null); }, 0);
	    }
	    if ("onselectstart" in root) {
	      selection.on("selectstart.drag", null);
	    } else {
	      root.style.MozUserSelect = root.__noselect;
	      delete root.__noselect;
	    }
	  }

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
	    this.target = target;
	    this.type = type;
	    this.subject = subject;
	    this.identifier = id;
	    this.active = active;
	    this.x = x;
	    this.y = y;
	    this.dx = dx;
	    this.dy = dy;
	    this._ = dispatch;
	  }

	  DragEvent.prototype.on = function() {
	    var value = this._.on.apply(this._, arguments);
	    return value === this._ ? this : value;
	  };

	  // Ignore right-click, since that should open the context menu.
	  function defaultFilter() {
	    return !d3Selection.event.button;
	  }

	  function defaultContainer() {
	    return this.parentNode;
	  }

	  function defaultSubject(d) {
	    return d == null ? {x: d3Selection.event.x, y: d3Selection.event.y} : d;
	  }

	  function drag() {
	    var filter = defaultFilter,
	        container = defaultContainer,
	        subject = defaultSubject,
	        gestures = {},
	        listeners = d3Dispatch.dispatch("start", "drag", "end"),
	        active = 0,
	        mousemoving,
	        touchending;

	    function drag(selection) {
	      selection
	          .on("mousedown.drag", mousedowned)
	          .on("touchstart.drag", touchstarted)
	          .on("touchmove.drag", touchmoved)
	          .on("touchend.drag touchcancel.drag", touchended)
	          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	    }

	    function mousedowned() {
	      if (touchending || !filter.apply(this, arguments)) return;
	      var gesture = beforestart("mouse", container.apply(this, arguments), d3Selection.mouse, this, arguments);
	      if (!gesture) return;
	      d3Selection.select(d3Selection.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
	      nodrag(d3Selection.event.view);
	      nopropagation();
	      mousemoving = false;
	      gesture("start");
	    }

	    function mousemoved() {
	      noevent();
	      mousemoving = true;
	      gestures.mouse("drag");
	    }

	    function mouseupped() {
	      d3Selection.select(d3Selection.event.view).on("mousemove.drag mouseup.drag", null);
	      yesdrag(d3Selection.event.view, mousemoving);
	      noevent();
	      gestures.mouse("end");
	    }

	    function touchstarted() {
	      if (!filter.apply(this, arguments)) return;
	      var touches = d3Selection.event.changedTouches,
	          c = container.apply(this, arguments),
	          n = touches.length, i, gesture;

	      for (i = 0; i < n; ++i) {
	        if (gesture = beforestart(touches[i].identifier, c, d3Selection.touch, this, arguments)) {
	          nopropagation();
	          gesture("start");
	        }
	      }
	    }

	    function touchmoved() {
	      var touches = d3Selection.event.changedTouches,
	          n = touches.length, i, gesture;

	      for (i = 0; i < n; ++i) {
	        if (gesture = gestures[touches[i].identifier]) {
	          noevent();
	          gesture("drag");
	        }
	      }
	    }

	    function touchended() {
	      var touches = d3Selection.event.changedTouches,
	          n = touches.length, i, gesture;

	      if (touchending) clearTimeout(touchending);
	      touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
	      for (i = 0; i < n; ++i) {
	        if (gesture = gestures[touches[i].identifier]) {
	          nopropagation();
	          gesture("end");
	        }
	      }
	    }

	    function beforestart(id, container, point, that, args) {
	      var p = point(container, id), s, dx, dy,
	          sublisteners = listeners.copy();

	      if (!d3Selection.customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
	        if ((d3Selection.event.subject = s = subject.apply(that, args)) == null) return false;
	        dx = s.x - p[0] || 0;
	        dy = s.y - p[1] || 0;
	        return true;
	      })) return;

	      return function gesture(type) {
	        var p0 = p, n;
	        switch (type) {
	          case "start": gestures[id] = gesture, n = active++; break;
	          case "end": delete gestures[id], --active; // nobreak
	          case "drag": p = point(container, id), n = active; break;
	        }
	        d3Selection.customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
	      };
	    }

	    drag.filter = function(_) {
	      return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
	    };

	    drag.container = function(_) {
	      return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
	    };

	    drag.subject = function(_) {
	      return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
	    };

	    drag.on = function() {
	      var value = listeners.on.apply(listeners, arguments);
	      return value === listeners ? drag : value;
	    };

	    return drag;
	  }

	  exports.drag = drag;
	  exports.dragDisable = nodrag;
	  exports.dragEnable = yesdrag;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-dispatch/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var noop = {value: function() {}};

	  function dispatch() {
	    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
	      _[t] = [];
	    }
	    return new Dispatch(_);
	  }

	  function Dispatch(_) {
	    this._ = _;
	  }

	  function parseTypenames(typenames, types) {
	    return typenames.trim().split(/^|\s+/).map(function(t) {
	      var name = "", i = t.indexOf(".");
	      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	      return {type: t, name: name};
	    });
	  }

	  Dispatch.prototype = dispatch.prototype = {
	    constructor: Dispatch,
	    on: function(typename, callback) {
	      var _ = this._,
	          T = parseTypenames(typename + "", _),
	          t,
	          i = -1,
	          n = T.length;

	      // If no callback was specified, return the callback of the given type and name.
	      if (arguments.length < 2) {
	        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
	        return;
	      }

	      // If a type was specified, set the callback for the given type and name.
	      // Otherwise, if a null callback was specified, remove callbacks of the given name.
	      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	      while (++i < n) {
	        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
	        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
	      }

	      return this;
	    },
	    copy: function() {
	      var copy = {}, _ = this._;
	      for (var t in _) copy[t] = _[t].slice();
	      return new Dispatch(copy);
	    },
	    call: function(type, that) {
	      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	    },
	    apply: function(type, that, args) {
	      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	    }
	  };

	  function get(type, name) {
	    for (var i = 0, n = type.length, c; i < n; ++i) {
	      if ((c = type[i]).name === name) {
	        return c.value;
	      }
	    }
	  }

	  function set(type, name, callback) {
	    for (var i = 0, n = type.length; i < n; ++i) {
	      if (type[i].name === name) {
	        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	        break;
	      }
	    }
	    if (callback != null) type.push({name: name, value: callback});
	    return type;
	  }

	  exports.dispatch = dispatch;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-selection/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var xhtml = "http://www.w3.org/1999/xhtml";

	  var namespaces = {
	    svg: "http://www.w3.org/2000/svg",
	    xhtml: xhtml,
	    xlink: "http://www.w3.org/1999/xlink",
	    xml: "http://www.w3.org/XML/1998/namespace",
	    xmlns: "http://www.w3.org/2000/xmlns/"
	  };

	  function namespace(name) {
	    var prefix = name += "", i = prefix.indexOf(":");
	    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	  }

	  function creatorInherit(name) {
	    return function() {
	      var document = this.ownerDocument,
	          uri = this.namespaceURI;
	      return uri === xhtml && document.documentElement.namespaceURI === xhtml
	          ? document.createElement(name)
	          : document.createElementNS(uri, name);
	    };
	  }

	  function creatorFixed(fullname) {
	    return function() {
	      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	    };
	  }

	  function creator(name) {
	    var fullname = namespace(name);
	    return (fullname.local
	        ? creatorFixed
	        : creatorInherit)(fullname);
	  }

	  var nextId = 0;

	  function local() {
	    return new Local;
	  }

	  function Local() {
	    this._ = "@" + (++nextId).toString(36);
	  }

	  Local.prototype = local.prototype = {
	    constructor: Local,
	    get: function(node) {
	      var id = this._;
	      while (!(id in node)) if (!(node = node.parentNode)) return;
	      return node[id];
	    },
	    set: function(node, value) {
	      return node[this._] = value;
	    },
	    remove: function(node) {
	      return this._ in node && delete node[this._];
	    },
	    toString: function() {
	      return this._;
	    }
	  };

	  var matcher = function(selector) {
	    return function() {
	      return this.matches(selector);
	    };
	  };

	  if (typeof document !== "undefined") {
	    var element = document.documentElement;
	    if (!element.matches) {
	      var vendorMatches = element.webkitMatchesSelector
	          || element.msMatchesSelector
	          || element.mozMatchesSelector
	          || element.oMatchesSelector;
	      matcher = function(selector) {
	        return function() {
	          return vendorMatches.call(this, selector);
	        };
	      };
	    }
	  }

	  var matcher$1 = matcher;

	  var filterEvents = {};

	  exports.event = null;

	  if (typeof document !== "undefined") {
	    var element$1 = document.documentElement;
	    if (!("onmouseenter" in element$1)) {
	      filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	    }
	  }

	  function filterContextListener(listener, index, group) {
	    listener = contextListener(listener, index, group);
	    return function(event) {
	      var related = event.relatedTarget;
	      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	        listener.call(this, event);
	      }
	    };
	  }

	  function contextListener(listener, index, group) {
	    return function(event1) {
	      var event0 = exports.event; // Events can be reentrant (e.g., focus).
	      exports.event = event1;
	      try {
	        listener.call(this, this.__data__, index, group);
	      } finally {
	        exports.event = event0;
	      }
	    };
	  }

	  function parseTypenames(typenames) {
	    return typenames.trim().split(/^|\s+/).map(function(t) {
	      var name = "", i = t.indexOf(".");
	      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	      return {type: t, name: name};
	    });
	  }

	  function onRemove(typename) {
	    return function() {
	      var on = this.__on;
	      if (!on) return;
	      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	          this.removeEventListener(o.type, o.listener, o.capture);
	        } else {
	          on[++i] = o;
	        }
	      }
	      if (++i) on.length = i;
	      else delete this.__on;
	    };
	  }

	  function onAdd(typename, value, capture) {
	    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	    return function(d, i, group) {
	      var on = this.__on, o, listener = wrap(value, i, group);
	      if (on) for (var j = 0, m = on.length; j < m; ++j) {
	        if ((o = on[j]).type === typename.type && o.name === typename.name) {
	          this.removeEventListener(o.type, o.listener, o.capture);
	          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	          o.value = value;
	          return;
	        }
	      }
	      this.addEventListener(typename.type, listener, capture);
	      o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	      if (!on) this.__on = [o];
	      else on.push(o);
	    };
	  }

	  function selection_on(typename, value, capture) {
	    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

	    if (arguments.length < 2) {
	      var on = this.node().__on;
	      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	        for (i = 0, o = on[j]; i < n; ++i) {
	          if ((t = typenames[i]).type === o.type && t.name === o.name) {
	            return o.value;
	          }
	        }
	      }
	      return;
	    }

	    on = value ? onAdd : onRemove;
	    if (capture == null) capture = false;
	    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	    return this;
	  }

	  function customEvent(event1, listener, that, args) {
	    var event0 = exports.event;
	    event1.sourceEvent = exports.event;
	    exports.event = event1;
	    try {
	      return listener.apply(that, args);
	    } finally {
	      exports.event = event0;
	    }
	  }

	  function sourceEvent() {
	    var current = exports.event, source;
	    while (source = current.sourceEvent) current = source;
	    return current;
	  }

	  function point(node, event) {
	    var svg = node.ownerSVGElement || node;

	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      point.x = event.clientX, point.y = event.clientY;
	      point = point.matrixTransform(node.getScreenCTM().inverse());
	      return [point.x, point.y];
	    }

	    var rect = node.getBoundingClientRect();
	    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	  }

	  function mouse(node) {
	    var event = sourceEvent();
	    if (event.changedTouches) event = event.changedTouches[0];
	    return point(node, event);
	  }

	  function none() {}

	  function selector(selector) {
	    return selector == null ? none : function() {
	      return this.querySelector(selector);
	    };
	  }

	  function selection_select(select) {
	    if (typeof select !== "function") select = selector(select);

	    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	          if ("__data__" in node) subnode.__data__ = node.__data__;
	          subgroup[i] = subnode;
	        }
	      }
	    }

	    return new Selection(subgroups, this._parents);
	  }

	  function empty() {
	    return [];
	  }

	  function selectorAll(selector) {
	    return selector == null ? empty : function() {
	      return this.querySelectorAll(selector);
	    };
	  }

	  function selection_selectAll(select) {
	    if (typeof select !== "function") select = selectorAll(select);

	    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          subgroups.push(select.call(node, node.__data__, i, group));
	          parents.push(node);
	        }
	      }
	    }

	    return new Selection(subgroups, parents);
	  }

	  function selection_filter(match) {
	    if (typeof match !== "function") match = matcher$1(match);

	    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	          subgroup.push(node);
	        }
	      }
	    }

	    return new Selection(subgroups, this._parents);
	  }

	  function sparse(update) {
	    return new Array(update.length);
	  }

	  function selection_enter() {
	    return new Selection(this._enter || this._groups.map(sparse), this._parents);
	  }

	  function EnterNode(parent, datum) {
	    this.ownerDocument = parent.ownerDocument;
	    this.namespaceURI = parent.namespaceURI;
	    this._next = null;
	    this._parent = parent;
	    this.__data__ = datum;
	  }

	  EnterNode.prototype = {
	    constructor: EnterNode,
	    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	    querySelector: function(selector) { return this._parent.querySelector(selector); },
	    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	  };

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  var keyPrefix = "$"; // Protect against keys like “__proto__”.

	  function bindIndex(parent, group, enter, update, exit, data) {
	    var i = 0,
	        node,
	        groupLength = group.length,
	        dataLength = data.length;

	    // Put any non-null nodes that fit into update.
	    // Put any null nodes into enter.
	    // Put any remaining data into enter.
	    for (; i < dataLength; ++i) {
	      if (node = group[i]) {
	        node.__data__ = data[i];
	        update[i] = node;
	      } else {
	        enter[i] = new EnterNode(parent, data[i]);
	      }
	    }

	    // Put any non-null nodes that don’t fit into exit.
	    for (; i < groupLength; ++i) {
	      if (node = group[i]) {
	        exit[i] = node;
	      }
	    }
	  }

	  function bindKey(parent, group, enter, update, exit, data, key) {
	    var i,
	        node,
	        nodeByKeyValue = {},
	        groupLength = group.length,
	        dataLength = data.length,
	        keyValues = new Array(groupLength),
	        keyValue;

	    // Compute the key for each node.
	    // If multiple nodes have the same key, the duplicates are added to exit.
	    for (i = 0; i < groupLength; ++i) {
	      if (node = group[i]) {
	        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	        if (keyValue in nodeByKeyValue) {
	          exit[i] = node;
	        } else {
	          nodeByKeyValue[keyValue] = node;
	        }
	      }
	    }

	    // Compute the key for each datum.
	    // If there a node associated with this key, join and add it to update.
	    // If there is not (or the key is a duplicate), add it to enter.
	    for (i = 0; i < dataLength; ++i) {
	      keyValue = keyPrefix + key.call(parent, data[i], i, data);
	      if (node = nodeByKeyValue[keyValue]) {
	        update[i] = node;
	        node.__data__ = data[i];
	        nodeByKeyValue[keyValue] = null;
	      } else {
	        enter[i] = new EnterNode(parent, data[i]);
	      }
	    }

	    // Add any remaining nodes that were not bound to data to exit.
	    for (i = 0; i < groupLength; ++i) {
	      if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	        exit[i] = node;
	      }
	    }
	  }

	  function selection_data(value, key) {
	    if (!value) {
	      data = new Array(this.size()), j = -1;
	      this.each(function(d) { data[++j] = d; });
	      return data;
	    }

	    var bind = key ? bindKey : bindIndex,
	        parents = this._parents,
	        groups = this._groups;

	    if (typeof value !== "function") value = constant(value);

	    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	      var parent = parents[j],
	          group = groups[j],
	          groupLength = group.length,
	          data = value.call(parent, parent && parent.__data__, j, parents),
	          dataLength = data.length,
	          enterGroup = enter[j] = new Array(dataLength),
	          updateGroup = update[j] = new Array(dataLength),
	          exitGroup = exit[j] = new Array(groupLength);

	      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	      // Now connect the enter nodes to their following update node, such that
	      // appendChild can insert the materialized enter node before this node,
	      // rather than at the end of the parent node.
	      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	        if (previous = enterGroup[i0]) {
	          if (i0 >= i1) i1 = i0 + 1;
	          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	          previous._next = next || null;
	        }
	      }
	    }

	    update = new Selection(update, parents);
	    update._enter = enter;
	    update._exit = exit;
	    return update;
	  }

	  function selection_exit() {
	    return new Selection(this._exit || this._groups.map(sparse), this._parents);
	  }

	  function selection_merge(selection) {

	    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	        if (node = group0[i] || group1[i]) {
	          merge[i] = node;
	        }
	      }
	    }

	    for (; j < m0; ++j) {
	      merges[j] = groups0[j];
	    }

	    return new Selection(merges, this._parents);
	  }

	  function selection_order() {

	    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	        if (node = group[i]) {
	          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	          next = node;
	        }
	      }
	    }

	    return this;
	  }

	  function selection_sort(compare) {
	    if (!compare) compare = ascending;

	    function compareNode(a, b) {
	      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	    }

	    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          sortgroup[i] = node;
	        }
	      }
	      sortgroup.sort(compareNode);
	    }

	    return new Selection(sortgroups, this._parents).order();
	  }

	  function ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }

	  function selection_call() {
	    var callback = arguments[0];
	    arguments[0] = this;
	    callback.apply(null, arguments);
	    return this;
	  }

	  function selection_nodes() {
	    var nodes = new Array(this.size()), i = -1;
	    this.each(function() { nodes[++i] = this; });
	    return nodes;
	  }

	  function selection_node() {

	    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	        var node = group[i];
	        if (node) return node;
	      }
	    }

	    return null;
	  }

	  function selection_size() {
	    var size = 0;
	    this.each(function() { ++size; });
	    return size;
	  }

	  function selection_empty() {
	    return !this.node();
	  }

	  function selection_each(callback) {

	    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	        if (node = group[i]) callback.call(node, node.__data__, i, group);
	      }
	    }

	    return this;
	  }

	  function attrRemove(name) {
	    return function() {
	      this.removeAttribute(name);
	    };
	  }

	  function attrRemoveNS(fullname) {
	    return function() {
	      this.removeAttributeNS(fullname.space, fullname.local);
	    };
	  }

	  function attrConstant(name, value) {
	    return function() {
	      this.setAttribute(name, value);
	    };
	  }

	  function attrConstantNS(fullname, value) {
	    return function() {
	      this.setAttributeNS(fullname.space, fullname.local, value);
	    };
	  }

	  function attrFunction(name, value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) this.removeAttribute(name);
	      else this.setAttribute(name, v);
	    };
	  }

	  function attrFunctionNS(fullname, value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	      else this.setAttributeNS(fullname.space, fullname.local, v);
	    };
	  }

	  function selection_attr(name, value) {
	    var fullname = namespace(name);

	    if (arguments.length < 2) {
	      var node = this.node();
	      return fullname.local
	          ? node.getAttributeNS(fullname.space, fullname.local)
	          : node.getAttribute(fullname);
	    }

	    return this.each((value == null
	        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	        ? (fullname.local ? attrFunctionNS : attrFunction)
	        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	  }

	  function defaultView(node) {
	    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	        || (node.document && node) // node is a Window
	        || node.defaultView; // node is a Document
	  }

	  function styleRemove(name) {
	    return function() {
	      this.style.removeProperty(name);
	    };
	  }

	  function styleConstant(name, value, priority) {
	    return function() {
	      this.style.setProperty(name, value, priority);
	    };
	  }

	  function styleFunction(name, value, priority) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) this.style.removeProperty(name);
	      else this.style.setProperty(name, v, priority);
	    };
	  }

	  function selection_style(name, value, priority) {
	    var node;
	    return arguments.length > 1
	        ? this.each((value == null
	              ? styleRemove : typeof value === "function"
	              ? styleFunction
	              : styleConstant)(name, value, priority == null ? "" : priority))
	        : defaultView(node = this.node())
	            .getComputedStyle(node, null)
	            .getPropertyValue(name);
	  }

	  function propertyRemove(name) {
	    return function() {
	      delete this[name];
	    };
	  }

	  function propertyConstant(name, value) {
	    return function() {
	      this[name] = value;
	    };
	  }

	  function propertyFunction(name, value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) delete this[name];
	      else this[name] = v;
	    };
	  }

	  function selection_property(name, value) {
	    return arguments.length > 1
	        ? this.each((value == null
	            ? propertyRemove : typeof value === "function"
	            ? propertyFunction
	            : propertyConstant)(name, value))
	        : this.node()[name];
	  }

	  function classArray(string) {
	    return string.trim().split(/^|\s+/);
	  }

	  function classList(node) {
	    return node.classList || new ClassList(node);
	  }

	  function ClassList(node) {
	    this._node = node;
	    this._names = classArray(node.getAttribute("class") || "");
	  }

	  ClassList.prototype = {
	    add: function(name) {
	      var i = this._names.indexOf(name);
	      if (i < 0) {
	        this._names.push(name);
	        this._node.setAttribute("class", this._names.join(" "));
	      }
	    },
	    remove: function(name) {
	      var i = this._names.indexOf(name);
	      if (i >= 0) {
	        this._names.splice(i, 1);
	        this._node.setAttribute("class", this._names.join(" "));
	      }
	    },
	    contains: function(name) {
	      return this._names.indexOf(name) >= 0;
	    }
	  };

	  function classedAdd(node, names) {
	    var list = classList(node), i = -1, n = names.length;
	    while (++i < n) list.add(names[i]);
	  }

	  function classedRemove(node, names) {
	    var list = classList(node), i = -1, n = names.length;
	    while (++i < n) list.remove(names[i]);
	  }

	  function classedTrue(names) {
	    return function() {
	      classedAdd(this, names);
	    };
	  }

	  function classedFalse(names) {
	    return function() {
	      classedRemove(this, names);
	    };
	  }

	  function classedFunction(names, value) {
	    return function() {
	      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	    };
	  }

	  function selection_classed(name, value) {
	    var names = classArray(name + "");

	    if (arguments.length < 2) {
	      var list = classList(this.node()), i = -1, n = names.length;
	      while (++i < n) if (!list.contains(names[i])) return false;
	      return true;
	    }

	    return this.each((typeof value === "function"
	        ? classedFunction : value
	        ? classedTrue
	        : classedFalse)(names, value));
	  }

	  function textRemove() {
	    this.textContent = "";
	  }

	  function textConstant(value) {
	    return function() {
	      this.textContent = value;
	    };
	  }

	  function textFunction(value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      this.textContent = v == null ? "" : v;
	    };
	  }

	  function selection_text(value) {
	    return arguments.length
	        ? this.each(value == null
	            ? textRemove : (typeof value === "function"
	            ? textFunction
	            : textConstant)(value))
	        : this.node().textContent;
	  }

	  function htmlRemove() {
	    this.innerHTML = "";
	  }

	  function htmlConstant(value) {
	    return function() {
	      this.innerHTML = value;
	    };
	  }

	  function htmlFunction(value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      this.innerHTML = v == null ? "" : v;
	    };
	  }

	  function selection_html(value) {
	    return arguments.length
	        ? this.each(value == null
	            ? htmlRemove : (typeof value === "function"
	            ? htmlFunction
	            : htmlConstant)(value))
	        : this.node().innerHTML;
	  }

	  function raise() {
	    if (this.nextSibling) this.parentNode.appendChild(this);
	  }

	  function selection_raise() {
	    return this.each(raise);
	  }

	  function lower() {
	    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	  }

	  function selection_lower() {
	    return this.each(lower);
	  }

	  function selection_append(name) {
	    var create = typeof name === "function" ? name : creator(name);
	    return this.select(function() {
	      return this.appendChild(create.apply(this, arguments));
	    });
	  }

	  function constantNull() {
	    return null;
	  }

	  function selection_insert(name, before) {
	    var create = typeof name === "function" ? name : creator(name),
	        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	    return this.select(function() {
	      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	    });
	  }

	  function remove() {
	    var parent = this.parentNode;
	    if (parent) parent.removeChild(this);
	  }

	  function selection_remove() {
	    return this.each(remove);
	  }

	  function selection_datum(value) {
	    return arguments.length
	        ? this.property("__data__", value)
	        : this.node().__data__;
	  }

	  function dispatchEvent(node, type, params) {
	    var window = defaultView(node),
	        event = window.CustomEvent;

	    if (event) {
	      event = new event(type, params);
	    } else {
	      event = window.document.createEvent("Event");
	      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	      else event.initEvent(type, false, false);
	    }

	    node.dispatchEvent(event);
	  }

	  function dispatchConstant(type, params) {
	    return function() {
	      return dispatchEvent(this, type, params);
	    };
	  }

	  function dispatchFunction(type, params) {
	    return function() {
	      return dispatchEvent(this, type, params.apply(this, arguments));
	    };
	  }

	  function selection_dispatch(type, params) {
	    return this.each((typeof params === "function"
	        ? dispatchFunction
	        : dispatchConstant)(type, params));
	  }

	  var root = [null];

	  function Selection(groups, parents) {
	    this._groups = groups;
	    this._parents = parents;
	  }

	  function selection() {
	    return new Selection([[document.documentElement]], root);
	  }

	  Selection.prototype = selection.prototype = {
	    constructor: Selection,
	    select: selection_select,
	    selectAll: selection_selectAll,
	    filter: selection_filter,
	    data: selection_data,
	    enter: selection_enter,
	    exit: selection_exit,
	    merge: selection_merge,
	    order: selection_order,
	    sort: selection_sort,
	    call: selection_call,
	    nodes: selection_nodes,
	    node: selection_node,
	    size: selection_size,
	    empty: selection_empty,
	    each: selection_each,
	    attr: selection_attr,
	    style: selection_style,
	    property: selection_property,
	    classed: selection_classed,
	    text: selection_text,
	    html: selection_html,
	    raise: selection_raise,
	    lower: selection_lower,
	    append: selection_append,
	    insert: selection_insert,
	    remove: selection_remove,
	    datum: selection_datum,
	    on: selection_on,
	    dispatch: selection_dispatch
	  };

	  function select(selector) {
	    return typeof selector === "string"
	        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	        : new Selection([[selector]], root);
	  }

	  function selectAll(selector) {
	    return typeof selector === "string"
	        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
	        : new Selection([selector == null ? [] : selector], root);
	  }

	  function touch(node, touches, identifier) {
	    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

	    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
	      if ((touch = touches[i]).identifier === identifier) {
	        return point(node, touch);
	      }
	    }

	    return null;
	  }

	  function touches(node, touches) {
	    if (touches == null) touches = sourceEvent().touches;

	    for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
	      points[i] = point(node, touches[i]);
	    }

	    return points;
	  }

	  exports.creator = creator;
	  exports.local = local;
	  exports.matcher = matcher$1;
	  exports.mouse = mouse;
	  exports.namespace = namespace;
	  exports.namespaces = namespaces;
	  exports.select = select;
	  exports.selectAll = selectAll;
	  exports.selection = selection;
	  exports.selector = selector;
	  exports.selectorAll = selectorAll;
	  exports.touch = touch;
	  exports.touches = touches;
	  exports.window = defaultView;
	  exports.customEvent = customEvent;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Chart) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DraggableAnnotationAccessor = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _accessor = __webpack_require__(7);

	var _lineElement = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/*
	annotation: {
		annotations: [
			{
				draggable: true,
				onDragStart: function() {
					
				},
				onDrag: function() {
					
				},
				onDragEnd: function() {
					
				}
			}
		]
	}
	*/

	var DraggableAnnotationAccessor = exports.DraggableAnnotationAccessor = function (_DraggableElementAcce) {
		_inherits(DraggableAnnotationAccessor, _DraggableElementAcce);

		function DraggableAnnotationAccessor() {
			_classCallCheck(this, DraggableAnnotationAccessor);

			return _possibleConstructorReturn(this, (DraggableAnnotationAccessor.__proto__ || Object.getPrototypeOf(DraggableAnnotationAccessor)).apply(this, arguments));
		}

		_createClass(DraggableAnnotationAccessor, null, [{
			key: 'isSupported',
			value: function isSupported() {
				return !!Chart.Annotation;
			}
		}, {
			key: 'getElements',
			value: function getElements(chartInstance) {
				return _accessor.DraggableElementAccessor.getElements(chartInstance, chartInstance._annotationObjects, chartInstance.options.annotation.annotations, function (config) {
					switch (config.type) {
						case 'line':
							return _lineElement.DraggableLineAnnotationElement;

						default:
							throw 'Unsupported annotation type: ' + config.type;
					}
				});
			}
		}]);

		return DraggableAnnotationAccessor;
	}(_accessor.DraggableElementAccessor);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DraggableElementAccessor = exports.DraggableElementAccessor = function () {
		function DraggableElementAccessor() {
			_classCallCheck(this, DraggableElementAccessor);
		}

		_createClass(DraggableElementAccessor, null, [{
			key: 'isSupported',
			value: function isSupported() {
				return true;
			}
		}, {
			key: 'getElements',
			value: function getElements(chartInstance, elements, configs, elementClass) {
				var elementClassFn = typeof elementClass === 'function' ? elementClass : function () {
					return elementClass;
				};

				return elements.filter(function (element, i) {
					return !!configs[i].draggable;
				}).map(function (element, i) {
					var className = elementClassFn(configs[i]);
					return new className(chartInstance, element, configs[i]);
				});
			}
		}]);

		return DraggableElementAccessor;
	}();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DraggableLineAnnotationElement = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _element = __webpack_require__(9);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DraggableLineAnnotationElement = exports.DraggableLineAnnotationElement = function (_DraggableElement) {
		_inherits(DraggableLineAnnotationElement, _DraggableElement);

		function DraggableLineAnnotationElement(chartInstance, elementInstance, elementConfig) {
			_classCallCheck(this, DraggableLineAnnotationElement);

			var _this = _possibleConstructorReturn(this, (DraggableLineAnnotationElement.__proto__ || Object.getPrototypeOf(DraggableLineAnnotationElement)).call(this, chartInstance, elementInstance, elementConfig));

			_this.scale = _this.chart.scales[elementConfig.scaleID];
			return _this;
		}

		_createClass(DraggableLineAnnotationElement, [{
			key: '_getPixel',
			value: function _getPixel(event) {
				return this.scale.isHorizontal() ? event.x : event.y;
			}
		}, {
			key: '_getValue',
			value: function _getValue(event) {
				var offset = this.offset || 0;
				return this.scale.getValueForPixel(this._getPixel(event) - offset);
			}
		}, {
			key: 'getBox',
			value: function getBox(tolerance) {
				return {
					x: [this.element._view.x1 - tolerance, this.element._view.x2 + tolerance],
					y: [this.element._view.y1 - tolerance, this.element._view.y2 + tolerance]
				};
			}
		}, {
			key: 'onDragStart',
			value: function onDragStart(event) {
				this.offset = this._getPixel(event) - this.scale.getPixelForValue(this.config.value);
			}
		}, {
			key: 'onDrag',
			value: function onDrag(event) {
				this.config.value = this._constrainValue(this.scale, this._getValue(event));
				this.chart.update(0);
			}
		}, {
			key: 'onDragEnd',
			value: function onDragEnd(event) {
				this.offset = undefined;
			}
		}]);

		return DraggableLineAnnotationElement;
	}(_element.DraggableElement);

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/*
	{
		draggable: true,
		onDragStart: function(event) {
			
		},
		onDrag: function(event) {
			
		},
		onDragEnd: function(event) {
			
		}
	}
	*/

	// http://stackoverflow.com/a/10816667/168815

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function getOffset(evt) {
		var el = evt.target,
		    x = 0,
		    y = 0;

		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			x += el.offsetLeft - el.scrollLeft;
			y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}

		x = evt.clientX - x;
		y = evt.clientY - y;

		return { x: x, y: y };
	}

	var DraggableElement = exports.DraggableElement = function () {
		function DraggableElement(chartInstance, elementInstance, elementConfig) {
			_classCallCheck(this, DraggableElement);

			this.chart = chartInstance;
			this.element = elementInstance;
			this.config = elementConfig;
		}

		_createClass(DraggableElement, [{
			key: 'getBox',
			value: function getBox(tolerance) {
				return {
					x: [this.element._view.x - tolerance, this.element._view.x + tolerance],
					y: [this.element._view.y - tolerance, this.element._view.y + tolerance]
				};
			}
		}, {
			key: 'isInBox',
			value: function isInBox(event, tolerance) {
				var click = getOffset(event);
				var box = this.getBox(tolerance || 0);
				return click.x >= box.x[0] && click.x <= box.x[1] && click.y >= box.y[0] && click.y <= box.y[1];
			}
		}, {
			key: '_constrainValue',
			value: function _constrainValue(scale, value) {
				if (typeof scale.min !== 'undefined' && value < scale.min) {
					return scale.min;
				} else if (typeof scale.max !== 'undefined' && value > scale.max) {
					return scale.max;
				} else {
					return value;
				}
			}
		}, {
			key: 'dispatch',
			value: function dispatch(type, event) {
				// Invoke plugin callback
				if (typeof this[type] === 'function') {
					this[type](event);
				}

				// Invoke user callback
				if (typeof this.config[type] === 'function') {
					this.config[type](event);
				}
			}
		}]);

		return DraggableElement;
	}();

/***/ }
/******/ ]);