/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Animation.js":
/*!**************************!*\
  !*** ./src/Animation.js ***!
  \**************************/
/*! exports provided: Animation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Animation\", function() { return Animation; });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Point */ \"./src/Point.js\");\n/* harmony import */ var _KdTree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./KdTree */ \"./src/KdTree.js\");\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n/* harmony import */ var _Circle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Circle */ \"./src/Circle.js\");\n\n\n\n\n\n\n\n\nclass Animation {\n    constructor(container0, container1) {\n        this.fpsDisplay = document.querySelector('#fps');\n        this.points = [];\n        this.width = document.querySelector('.container0').clientWidth;\n        this.height = document.querySelector('.container0').clientHeight;\n        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};\n        this.center = this.newPoint(this.center.x, this.center.y);\n        this.centerOfMass = this.newPoint(this.center.x, this.center.y);\n        container0.innerHTML = `<canvas id=\"point_ctx\" width=\"${this.width}\" height=\"${this.height}\"></canvas>`;\n        container1.innerHTML = `<canvas id=\"line_ctx\" width=\"${this.width}\" height=\"${this.height}\"></canvas>`;\n        this.canvas0 = document.querySelector('#point_ctx');\n        this.canvas1 = document.querySelector('#line_ctx');\n        this.line_ctx = this.canvas0.getContext('2d');\n        this.point_ctx = this.canvas1.getContext('2d');\n        this.point_ctx.fillStyle = 'rgb(200, 255, 255)';\n        this.generatePoints(_constants__WEBPACK_IMPORTED_MODULE_0__[\"START_COUNT\"], this.gaussianRandomPoint);\n        this.canvas1.addEventListener('click', (elt)=> this.pointFromClick(elt));\n        this.doAnim = true;\n        this.mouseX = null;\n        this.mouseY = null;\n        this.circle = null;\n        this.times = [];\n        this.fps = 0;\n        document.querySelector('#stop').addEventListener('click', ()=> {\n            this.doAnim = !this.doAnim;\n            if (this.doAnim) this.animate();\n        });\n    }\n\n    handleMouseMove(event) {\n        this.mouseX = event.clientX;\n        this.mouseY = event.clientY;\n        if (this.circle === null || this.circle === undefined) {\n            this.circle = new _Circle__WEBPACK_IMPORTED_MODULE_5__[\"Circle\"](this.mouseX, this.mouseY, _constants__WEBPACK_IMPORTED_MODULE_0__[\"MOUSE_RADIUS\"]);\n        }\n        else {\n            this.circle.update(this.mouseX, this.mouseY);\n        }\n    }\n\n    newPoint(x, y) {\n        return new _Point__WEBPACK_IMPORTED_MODULE_1__[\"Point\"](x, y, this.points.length, this.point_ctx, this.center, this.width, this.height);\n    }\n\n    pointFromClick(elt) {\n        this.points.push(this.newPoint(elt.clientX, elt.clientY));\n    }\n\n    generatePoints(x, func) {\n        let pointFactory = func.bind(this);\n        for (var _ = 0; _ < x; _++) {\n            this.points.push(pointFactory());\n        }\n    }\n\n    gaussianRandomPoint() {\n        return this.newPoint(Animation.gaussianRandom(this.width),\n                             Animation.gaussianRandom(this.height));\n    }\n\n    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }\n\n    // gaussian random generator from https://stackoverflow.com/a/39187274\n    static gaussianRand() {\n        var rand = 0;\n        for (var i = 0; i < 6; i += 1) { rand += Math.random(); }\n        return rand / 6;\n    }\n\n    uniformRandomPoint() {\n        return this.newPoint(Animation.uniformRandom(this.width),\n                             Animation.uniformRandom(this.height));\n    }\n\n    static uniformRandom(limit) { return Math.floor(Math.random() * limit); }\n\n    updateFps(now) {\n        // https://stackoverflow.com/a/48036361\n        while (this.times.length > 0 && this.times[0] <= now - 1000) {\n          this.times.shift();\n        }\n        this.times.push(now);\n        this.fps = this.times.length;\n        this.fpsDisplay.innerHTML = this.fps;\n    }\n\n    animate() {\n        const now = performance.now();\n        this.updateFps(now);\n        const tree = new _KdTree__WEBPACK_IMPORTED_MODULE_2__[\"KdTree\"]();\n        this.points.forEach(function(point){\n            tree.insert(point);\n        });\n\n        // clear the canvas\n        this.point_ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';\n        this.point_ctx.fillRect(0, 0, this.width, this.height);\n        //this.point_ctx.clearRect(0, 0, this.width, this.height);\n\n        // main anim loop\n        this.point_ctx.fillStyle = 'rgb(255, 50, 50)';\n        this.point_ctx.beginPath();\n        this.points.forEach(point=>{\n            point.nearest = tree.nearestNeighbour(point);\n            this.drawPoint(point, this.point_ctx, 50);\n            const neighbours = point.getNeighbours(tree);\n            if (neighbours !== null && point !== undefined) {\n                const avgPosition = point.getAvgPosition(neighbours);\n                point.applyForce(avgPosition);\n                const avgVelocity = point.getAvgVelocity(neighbours);\n                point.applyForce(avgVelocity);\n            }\n            //const wind = new Vector(0, -100);\n            //const midX = this.width / 2;\n            //const end = midX + 50;\n            //const midY = this.height / 2;\n            //if (point.position.x >= midX && point.position.x <= end) {\n                //point.applyForce(wind);\n            //}\n            point.avoidCollision();\n            point.applyForce(point.getResistance());\n            this.getBoundaryReflection(point);\n            point.move();\n        });\n\n        if (this.circle !== null) {\n            const pointsNearMouse = tree.range(this.circle.boundingRect);\n            if (pointsNearMouse) {\n                const len = pointsNearMouse.length;\n                const center = new _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"](this.mouseX, this.mouseY);\n                for (let i = 0; i < len; i++) {\n                    const point = this.points[i];\n                    if (this.circle.contains(point)) {\n                        point.attractTo(center);\n                    }\n                }\n            }\n        }\n        this.point_ctx.fill();\n        if (this.doAnim) {\n           window.requestAnimationFrame(()=> this.animate());\n        }\n    }\n\n    getNeighbouringPoints(point, tree) {\n        const pos = point.position;\n        const rect = new _Rect__WEBPACK_IMPORTED_MODULE_4__[\"Rect\"](\n            pos.x - _constants__WEBPACK_IMPORTED_MODULE_0__[\"PROXIMITY\"], pos.y - _constants__WEBPACK_IMPORTED_MODULE_0__[\"PROXIMITY\"],\n            pos.x + _constants__WEBPACK_IMPORTED_MODULE_0__[\"PROXIMITY\"], pos.y + _constants__WEBPACK_IMPORTED_MODULE_0__[\"PROXIMITY\"]\n        )\n        const neighbours = tree.range(rect);\n        return neighbours;\n    }\n\n    getBoundaryReflection(point) {\n        const pos = point.position;\n        if (pos.x < 0) {\n            pos.x = this.width;\n        }\n        else if (pos.x > this.width) {\n            pos.x = 0;\n        }\n        if (pos.y < 0) {\n            pos.y = this.height;\n        }\n        else if (pos.y > this.height) {\n            pos.y = 0;\n        }\n    }\n\n    drawPoint(point, context) {\n        context.moveTo(point.position.x, point.position.y);\n        context.arc(point.position.x, point.position.y, point.mass, 0, 2*Math.PI, true);\n    }\n\n    drawLine(b1, b2, context) {\n        context.strokeStyle = 'rgb(255, 50, 50)';\n        context.beginPath();\n        context.moveTo(b1.position.x, b1.position.y);\n        context.lineTo(b2.position.x, b2.position.y);\n        context.stroke();\n        context.strokeStyle = 'rgb(200, 255, 255)';\n    }\n}\n\nfunction randInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + 1;\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Animation.js?");

/***/ }),

/***/ "./src/AudioSource.js":
/*!****************************!*\
  !*** ./src/AudioSource.js ***!
  \****************************/
/*! exports provided: AudioSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AudioSource\", function() { return AudioSource; });\nclass AudioSource {\n    constructor() {\n        this.ctx = new (window.AudioContext || window.webkitAudioContext)();\n        this.analyser = this.ctx.createAnalyser();\n        navigator.mediaDevices.getUserMedia(\n            {audio: true, video: false}\n        ).then(stream => {\n            this.source = this.ctx.createMediaStreamSource(stream)\n        }).then(()=> this.source.connect(this.analyser));\n        this.analyser.fftSize = 256;\n        this.analyser.maxDecibels = 50;\n        this.analyser.minDecibels = -80;\n        this.bufferLength = this.analyser.frequencyBinCount;\n        this.freqData = new Uint8Array(this.bufferLength);\n    }\n\n    update() {\n        this.analyser.getByteFrequencyData(this.freqData);\n    }\n}\n\n\n\n\n//# sourceURL=webpack:///./src/AudioSource.js?");

/***/ }),

/***/ "./src/Circle.js":
/*!***********************!*\
  !*** ./src/Circle.js ***!
  \***********************/
/*! exports provided: Circle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Circle\", function() { return Circle; });\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n\n\nclass Circle {\n    constructor(x, y, radius) {\n        this.centerX = x;\n        this.centerY = y;\n        this.radius = radius;\n        this.xmin = this.centerX - this.radius;\n        this.ymin = this.centerY - this.radius;\n        this.xmax = this.centerX + this.radius;\n        this.ymax = this.centerY + this.radius;\n        this.boundingRect = new _Rect__WEBPACK_IMPORTED_MODULE_0__[\"Rect\"](this.xmin, this.ymin, this.xmax, this.ymax);\n    }\n\n    contains(point) {\n        return (this.distSquaredFromCenter(point) <= this.radius * this.radius);\n    }\n\n    update(x, y) {\n        this.centerX = x;\n        this.centerY = y;\n        this.xmin = this.centerX - this.radius;\n        this.ymin = this.centerY - this.radius;\n        this.xmax = this.centerX + this.radius;\n        this.ymax = this.centerY + this.radius;\n        this.boundingRect.xmin = this.xmin;\n        this.boundingRect.ymin = this.ymin;\n        this.boundingRect.xmax = this.xmax;\n        this.boundingRect.ymax = this.ymax;\n    }\n\n    distSquaredFromCenter(point) {\n        const pos = point.position;\n        const dX = pos.x - this.centerX;\n        const dY = pos.y - this.centerY;\n        return dX*dX + dY*dY;\n    }\n}\n\n\n\n\n//# sourceURL=webpack:///./src/Circle.js?");

/***/ }),

/***/ "./src/KdTree.js":
/*!***********************!*\
  !*** ./src/KdTree.js ***!
  \***********************/
/*! exports provided: Node, KdTree, equalPoints, comparePosition, distanceSquared */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Node\", function() { return Node; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"KdTree\", function() { return KdTree; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"equalPoints\", function() { return equalPoints; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"comparePosition\", function() { return comparePosition; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"distanceSquared\", function() { return distanceSquared; });\nclass Node {\n    constructor(point, _parent) {\n        this.point = [point];\n        this._parent = _parent;\n        this.lb = null;\n        this.rt = null;\n    }\n}\n\n\nclass KdTree {\n    constructor() {\n        this.size = 0;\n        this.rootNode = null;\n        this.collisions = 0;\n    }\n\n    insert(point) {\n        /******************************************************************************************\n        *   Public interface to put\n        *   Takes a Point or array of Points.\n        ******************************************************************************************/\n        if (point === null || point === undefined) throw 'Invalid argument';\n        if (Array.isArray(point)) {\n            point.forEach(p=>{\n                if (!p instanceof Point || p === null) throw 'Invalid argument';\n                this.rootNode = this.put(this.rootNode, p, null, true);\n            });\n        }\n        else {\n            this.rootNode = this.put(this.rootNode, point, null, true);\n        }\n    }\n\n    put(node, point, _parent, isVertical) {\n        /******************************************************************************************\n         *  Insert point into KdTree\n         *  node (type: Node) - current node to compare new point with\n         *  point (type: point) - new point to insert\n         *  _parent (type: Node) - parent node of current node\n         *  isVertical (type: Boolean) - whether we are dividing h or v at this\n         *      recursive level, reversed on each successive call.\n         *****************************************************************************************/\n        if (node === null) {\n            this.size++;\n            return new Node(point, _parent);\n        }\n        if (equalPoints(point, node.point[0])) {\n            node.point.push(point);\n            this.collisions++;\n            return node;\n        }\n        let cmp;\n        if (isVertical) {\n            cmp = comparePosition(point.position.x, node.point[0].position.x);\n        }\n        else {\n            cmp = comparePosition(point.position.y, node.point[0].position.y);\n        }\n        if (cmp === -1) {\n            node.lb = this.put(node.lb, point, node, !isVertical);\n        }\n        else {\n            node.rt = this.put(node.rt, point, node, !isVertical);\n        }\n        return node;\n    }\n\n    nearestNeighbour(query) {\n        /******************************************************************************************\n         *  Public interface for getNearest.\n         *****************************************************************************************/\n        if (query === null || query === undefined) throw 'Invalid argument';\n        if (this.size < 2) return null;\n        return this.getNearest(this.rootNode.point[0], query, this.rootNode, true);\n    }\n\n    getNearest(nearest, queryPoint, node, isVertical) {\n        /******************************************************************************************\n         *  nearest (type: Point) - nearest point found so far\n         *  node (type: Node) - current node to compare queryPoint with\n         *  queryPoint (type: Point) - point to find nearest neighbour of\n         *  isVertical (type: Boolean) - whether we are dividing h or v at this\n         *      recursive level, reversed on each successive call.\n         *  As we are finding the nearest neighbour of every point in the tree,\n         *      to avoid every query point returning itself, we set the distanceSquared \n         *      method to return Infinity if two of the same point (either the same object \n         *      or another object with the same coordinates) are compared.\n         *****************************************************************************************/\n        if (node === null) {\n            return nearest;\n        }\n        if (comparePosition(distanceSquared(node.point[0], queryPoint),\n                distanceSquared(nearest, queryPoint)) < 0) {\n            nearest = node.point[0];\n        }\n        let cmp;\n        if (isVertical) { // take lb branch if node.point is greater than query\n            cmp = comparePosition(node.point[0].position.x, queryPoint.position.x);\n        }\n        else {\n            cmp = comparePosition(node.point[0].position.y, queryPoint.position.y);\n        }\n        if (cmp === 1) {\n            nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);\n            // if nearest returned is greater than dist to current node, check the other branch\n            if (comparePosition(distanceSquared(nearest, queryPoint),\n                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {\n                nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);\n            }\n        }\n        else {\n            nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);\n            if (comparePosition(distanceSquared(nearest, queryPoint),\n                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {\n                nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);\n            }\n        }\n        return nearest;\n    }\n\n    otherBranchDistSquared(nearest, node, vertical) {\n        let distance;\n        if (vertical) distance = Math.abs(node.point[0].position.x - nearest.position.x);\n        else distance = Math.abs(node.point[0].position.y - nearest.position.y);\n        return distance * distance;\n    }\n\n    range(rect) {\n        /******************************************************************************************\n         * rect: 2d Rect object\n         * Return an array of all points within the 2d range. Interface to KdTree.getRange.\n         * If called in reference to a point, e.g. in Point.getNeighhbours, that point will\n         * be included in the returned stack.\n         *****************************************************************************************/\n        if (rect === null) throw 'Invalid argument';\n        let stack = [];\n        this.getRange(this.rootNode, stack, rect, true);\n        return stack;\n    }\n\n    getRange(node, stack, rect, isVertical) {\n        if (node === null) return;\n        let cmp;\n        if (rect.contains(node.point[0])) {\n            const len = node.point.length;\n            for (let i = 0; i < len; i++) {\n                stack.push(node.point[i]);\n            }\n            cmp = 0;\n        }\n        else if (isVertical) {\n            if (comparePosition(node.point[0].position.x, rect.xmin) >= 0 &&\n                    comparePosition(node.point[0].position.x, rect.xmin) <= 0) {\n                cmp = 0;\n            }\n            else {\n                cmp = (comparePosition(node.point[0].position.x, rect.xmin) < 0) ? 1 : -1;\n            }\n        }\n        else {\n            if (comparePosition(node.point[0].position.y, rect.ymin) >= 0 &&\n                    comparePosition(node.point[0].position.y, rect.ymax) <= 0) {\n                cmp = 0;\n            }\n            else {\n                cmp = (comparePosition(node.point[0].position.y, rect.ymin) < 0) ? 1 : -1;\n            }\n        }\n        if (cmp === 0) {\n            this.getRange(node.lb, stack, rect, !isVertical);\n            this.getRange(node.rt, stack, rect, !isVertical);\n        }\n        else if (cmp === -1) {\n            this.getRange(node.lb, stack, rect, !isVertical);\n        }\n        else {\n            this.getRange(node.rt, stack, rect, !isVertical);\n        }\n    }\n}\n\n\nfunction equalPoints(p1, p2) {\n    return p1.position.x === p2.position.x &&\n        p1.position.y === p2.position.y;\n}\n\n\nfunction comparePosition(a, b) {\n    if (a === b) return 0;\n    else if (a < b) return -1;\n    return 1;\n}\n\n\nfunction distanceSquared(p, q) {\n    if (p.id === q.id || equalPoints(p, q)) return Infinity;\n    const dx = Math.abs(p.position.x - q.position.x);\n    const dy = Math.abs(p.position.y - q.position.y);\n    return dx*dx + dy*dy;\n}\n\n\n\n\n//# sourceURL=webpack:///./src/KdTree.js?");

/***/ }),

/***/ "./src/Point.js":
/*!**********************!*\
  !*** ./src/Point.js ***!
  \**********************/
/*! exports provided: Point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Point\", function() { return Point; });\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n\n\n\n\n\nclass Point {\n    constructor(x, y, id) {\n        this.mass = 3;\n        this.position = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](x, y);\n        this.velocity = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](Math.floor(Math.random() * 6), Math.floor(Math.random() * 6));\n        this.lastPos = null;\n        this.accel = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0.0001, 0.0001);\n        this.id = id;\n    }\n\n    distToNearest() {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(this.position, this.nearest.position);\n        const length = dir.length();\n        return length;\n    }\n\n    applyForce(force) {\n        _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].checkArgType(force);\n        const f = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].divide(force, this.mass);\n        this.accel.add(f);\n    }\n\n    angleInRadiansFrom(that) {\n        return Math.atan2(\n            this.position.y - that.position.y,\n            this.position.x - that.position.x\n        );\n    }\n\n    avoidCollision() {\n        if (this.distToNearest() < _constants__WEBPACK_IMPORTED_MODULE_2__[\"COLLISION\"]) {\n            const delta = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(\n                new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0),\n                _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(\n                    this.nearest.position, this.position\n                )\n            );\n            this.applyForce(delta);\n        }\n    }\n\n    tendTowards(position, scalar) {\n        const towards = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(position, this.position);\n        towards.divideBy(100);\n        towards.scale(scalar);\n        return towards;\n    }\n\n    attractTo(position) {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(position, this.position);\n        dir.normalize();\n        dir.scale(_constants__WEBPACK_IMPORTED_MODULE_2__[\"MOUSE_REPEL\"]);\n        this.applyForce(dir);\n    }\n\n    move() {\n        this.velocity.add(this.accel);\n        this.velocity.limit(_constants__WEBPACK_IMPORTED_MODULE_2__[\"MAX_SPEED\"]);\n        this.position.add(this.velocity);\n        this.accel.scale(0);\n        this.position.x = Math.floor(this.position.x);\n        this.position.y = Math.floor(this.position.y);\n    }\n\n    getDx() {\n        return this.speed * Math.cos(this.rotation);\n    }\n\n    getDy() {\n        return this.speed * Math.sin(this.rotation);\n    }\n\n    bySlope(p, q) {\n        return this.slopeTo(p) - this.slopeTo(q);\n    }\n\n    compareTo(that) {\n        if (this.position.y < that.position.y) return -1;\n        else if (this.position.y > that.position.y) return 1;\n        else if (this.position.x < that.position.x) return -1;\n        else if (this.position.x > that.position.x) return 1;\n        else return 0;\n    }\n\n    slopeTo(that) {\n        if (this.position.x == that.position.x &&\n            this.position.y == that.position.y)\n            return -Infinity;\n        else if (this.position.y == that.position.y) return 0.0;\n        else if (this.position.x == that.position.x) return Infinity;\n        else return (that.position.y - this.position.y) /\n            (that.position.x - this.position.x);\n    }\n\n    getFlockVector(range) {\n        if (!range.avgPos || !range.avgVel) {\n            return new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0)\n        }\n        range.avgPos.divideBy(100);\n        range.avgPos.scale(_constants__WEBPACK_IMPORTED_MODULE_2__[\"FLOCK_POSITION_SCALAR\"]);\n        range.avgVel.divideBy(100);\n        return range.avg;\n    }\n\n    getCenterGrav(centerPoint) {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(centerPoint.position, this.position);\n        const mag = dir.length();\n        dir.normalize();\n        const grav = (_constants__WEBPACK_IMPORTED_MODULE_2__[\"G\"] * this.mass * 26) / (mag * mag);\n        dir.scale(grav);\n        return dir;\n    }\n\n    getResistance() {\n        const speed = this.velocity.length();\n        // get half circumference of circle for frontal area - mass is radius\n        const frontalArea = Math.PI * this.mass;\n        const dragMagnitude = frontalArea * _constants__WEBPACK_IMPORTED_MODULE_2__[\"C\"] * speed * speed;\n        const drag = this.velocity.copy();\n        drag.normalize();\n        drag.scale(-1);\n        drag.scale(dragMagnitude);\n        return drag;\n    }\n\n    getNeighbourGrav() {\n        const pos = this.position;\n        const neighbour = this.nearest.position;\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(neighbour, pos);\n        const dist = dir.length();\n        const m = (_constants__WEBPACK_IMPORTED_MODULE_2__[\"G\"] * this.mass * this.nearest.mass) / (dist * dist);\n        dir.normalize();\n        dir.scale(m);\n        return dir;\n    }\n\n    getNeighbours(tree) {\n        const rect = new _Rect__WEBPACK_IMPORTED_MODULE_1__[\"Rect\"](\n            this.position.x - _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"], this.position.y - _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"],\n            this.position.x + _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"], this.position.y + _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"]\n        )\n        const neighbours = tree.range(rect);\n        if (neighbours.length < 2) {\n            return null;\n        }\n        return neighbours;\n    }\n\n    getAvgPosition(neighbours) {\n        const avgPosition = this.getVectorMean(neighbours, 'position');\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(avgPosition, this.position);\n        dir.normalize();\n        dir.scale(0.5);\n        return dir;\n    }\n\n    getAvgVelocity(neighbours) {\n        const avgVelocity = this.getVectorMean(neighbours, 'velocity');\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(avgVelocity, this.velocity);\n        dir.normalize;\n        dir.scale(0.5);\n        return dir;\n    }\n\n    getVectorMean(vectors, property) {\n        const len = vectors.length;\n        const sumVectors = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0);\n        for (let i = 0; i < len; i++) {\n            if (vectors[i].id === this.id) {\n                continue;\n            }\n            sumVectors.add(vectors[i][property]);\n        }\n        sumVectors.divideBy(len - 1);\n        return sumVectors;\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Point.js?");

/***/ }),

/***/ "./src/Rect.js":
/*!*********************!*\
  !*** ./src/Rect.js ***!
  \*********************/
/*! exports provided: Rect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Rect\", function() { return Rect; });\nclass Rect {\n    constructor(xmin, ymin, xmax, ymax) {\n        if (xmin === undefined || xmin === null || ymin === undefined || ymin === null ||\n            xmax === undefined || xmax === null || ymax === undefined || ymax === null) {\n            throw 'Invalid argument';\n        }\n        this.xmin = xmin;\n        this.ymin = ymin;\n        this.xmax = xmax;\n        this.ymax = ymax;\n    }\n\n    contains(point) {\n        return point.position.x >= this.xmin && point.position.x <= this.xmax &&\n            point.position.y >= this.ymin && point.position.y <= this.ymax;\n    }\n}\n\n\n\n\n//# sourceURL=webpack:///./src/Rect.js?");

/***/ }),

/***/ "./src/Vector.js":
/*!***********************!*\
  !*** ./src/Vector.js ***!
  \***********************/
/*! exports provided: Vector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector\", function() { return Vector; });\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    static checkArgType(other) {\n        if (!(other instanceof Vector)) {\n            throw 'Invalid arg';\n        }\n    }\n\n    limit(max) {\n        if (this.length() > max) {\n            this.normalize();\n            this.scale(max);\n        }\n    }\n\n    static add(v1, v2) {\n        return new Vector(\n            v1.x + v2.x,\n            v1.y + v2.y\n        );\n    }\n\n    static subtract(v1, v2) {\n        return new Vector(\n            v1.x - v2.x, v1.y - v2.y\n        );\n    }\n\n    static divide(vector, scalar) {\n        return new Vector(vector.x / scalar, vector.y / scalar);\n    }\n\n    add(other) {\n        Vector.checkArgType(other);\n        this.x += other.x;\n        this.y += other.y;\n    }\n\n    subtract(other) {\n        Vector.checkArgType(other);\n        this.x -= other.x;\n        this.y -= other.y;\n    }\n\n    scale(scalar) {\n        if (isNaN(scalar)) {\n            throw 'Invalid argument';\n        }\n        this.x *= scalar;\n        this.y *= scalar;\n    }\n\n    divideBy(scalar) {\n        if (isNaN(scalar)) {\n            throw 'Invalid argument';\n        }\n        this.x /= scalar;\n        this.y /= scalar;\n    }\n\n    length() {\n        return Math.sqrt(this.x * this.x + this.y * this.y);\n    }\n\n    lengthSq() {\n        return this.x * this.x + this.y * this.y;\n    }\n\n    normalize() {\n        const m = this.length();\n        if (m) {\n            this.divideBy(m);\n        }\n    }\n\n    copy() {\n        return new Vector(this.x, this.y);\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Vector.js?");

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! exports provided: MOUSE_RADIUS, FLOCK_VELOCITY_SCALAR, COLLISION, FLOCK_POSITION_SCALAR, MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C, MOUSE_REPEL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOUSE_RADIUS\", function() { return MOUSE_RADIUS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FLOCK_VELOCITY_SCALAR\", function() { return FLOCK_VELOCITY_SCALAR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COLLISION\", function() { return COLLISION; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FLOCK_POSITION_SCALAR\", function() { return FLOCK_POSITION_SCALAR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MAX_SPEED\", function() { return MAX_SPEED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MIN_SPEED\", function() { return MIN_SPEED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START_COUNT\", function() { return START_COUNT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PROXIMITY\", function() { return PROXIMITY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"G\", function() { return G; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"C\", function() { return C; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOUSE_REPEL\", function() { return MOUSE_REPEL; });\nconst MAX_SPEED = 10;\nconst MIN_SPEED = 0.1;\nconst START_COUNT = 800;\nconst PROXIMITY = 100;\nconst G = 43;\nconst C = 0.001;\nconst FLOCK_POSITION_SCALAR = 3;\nconst COLLISION = 10;\nconst FLOCK_VELOCITY_SCALAR = 0.05;\nconst MOUSE_RADIUS = 150;\nconst MOUSE_REPEL = 40;\n\n\n\n\n//# sourceURL=webpack:///./src/constants.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _KdTree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./KdTree */ \"./src/KdTree.js\");\n/* harmony import */ var _AudioSource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioSource */ \"./src/AudioSource.js\");\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Point */ \"./src/Point.js\");\n/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Animation */ \"./src/Animation.js\");\n/* harmony import */ var _Circle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Circle */ \"./src/Circle.js\");\n\n \n\n\n\n\n\n\n\n\nwindow.addEventListener(\"load\", function() {\n    const container0 = document.querySelector('#container0');\n    const container1 = document.querySelector('#container1');\n    const anim = new _Animation__WEBPACK_IMPORTED_MODULE_6__[\"Animation\"](container0, container1);\n    anim.animate();\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });