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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Animation\", function() { return Animation; });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Point */ \"./src/Point.js\");\n/* harmony import */ var _KdTree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./KdTree */ \"./src/KdTree.js\");\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\n\n\n\n\n\nclass Animation {\n    constructor(container0, container1, audio) {\n        this.analyser = audio;\n        this.points = [];\n        this.width = document.querySelector('.container0').clientWidth;\n        this.height = document.querySelector('.container0').clientHeight;\n        this.center = {'x': Math.floor(this.width/2), 'y': Math.floor(this.height/2)};\n        this.center = this.newPoint(this.center.x, this.center.y);\n        this.centerOfMass = this.newPoint(this.center.x, this.center.y);\n        container0.innerHTML = `<canvas id=\"point_ctx\" width=\"${this.width}\" height=\"${this.height}\"></canvas>`;\n        container1.innerHTML = `<canvas id=\"line_ctx\" width=\"${this.width}\" height=\"${this.height}\"></canvas>`;\n        this.canvas0 = document.querySelector('#point_ctx');\n        this.canvas1 = document.querySelector('#line_ctx');\n        this.line_ctx = this.canvas0.getContext('2d');\n        this.point_ctx = this.canvas1.getContext('2d');\n        this.point_ctx.fillStyle = 'rgb(200, 255, 255)';\n        this.generatePoints(_constants__WEBPACK_IMPORTED_MODULE_0__[\"START_COUNT\"], this.gaussianRandomPoint);\n        this.canvas1.addEventListener('click', (elt)=> this.pointFromClick(elt));\n        this.doAnim = true;\n        document.querySelector('#stop').addEventListener('click', ()=> {\n            this.doAnim = !this.doAnim;\n            if (this.doAnim) this.animate();\n        });\n    }\n\n    newPoint(x, y) {\n        return new _Point__WEBPACK_IMPORTED_MODULE_1__[\"Point\"](x, y, this.points.length, this.point_ctx, this.center, this.width, this.height);\n    }\n\n    pointFromClick(elt) {\n        this.points.push(this.newPoint(elt.clientX, elt.clientY));\n    }\n\n    generatePoints(x, func) {\n        let pointFactory = func.bind(this);\n        for (var _ = 0; _ < x; _++) {\n            this.points.push(pointFactory());\n        }\n    }\n\n    gaussianRandomPoint() {\n        return this.newPoint(Animation.gaussianRandom(this.width),\n                             Animation.gaussianRandom(this.height));\n    }\n\n    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit + 1)); }\n\n    // gaussian random generator from https://stackoverflow.com/a/39187274\n    static gaussianRand() {\n        var rand = 0;\n        for (var i = 0; i < 6; i += 1) { rand += Math.random(); }\n        return rand / 6;\n    }\n\n    uniformRandomPoint() {\n        return this.newPoint(Animation.uniformRandom(this.width),\n                             Animation.uniformRandom(this.height));\n    }\n\n    static uniformRandom(limit) { return Math.floor(Math.random() * limit); }\n\n    animate() {\n        this.analyser.update();\n        let tree = new _KdTree__WEBPACK_IMPORTED_MODULE_2__[\"KdTree\"]();\n        let neighbourDrawn = [];\n        this.points.forEach(function(point){\n            tree.insert(point);\n        });\n        this.point_ctx.clearRect(0, 0, this.width, this.height);\n        this.line_ctx.clearRect(0, 0, this.width, this.height);\n        this.points.forEach(point=>{\n            point.nearest = tree.nearestNeighbour(point);\n            this.drawPoint(point, this.point_ctx);\n            if (document.querySelector('#neighbour-opt').checked &&\n                    neighbourDrawn[point.id] === undefined) {\n                this.drawLine(point.nearest, point, this.line_ctx);\n                neighbourDrawn[point.id] = true;\n            }\n            const pos = point.position;\n            if (pos.x < 0) {\n                const edge1 = _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"].subtract(new _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"](0, pos.y), pos);\n                const mag = edge1.length();\n                edge1.normalize();\n                edge1.scale(mag);\n                point.applyForce(edge1);\n            }\n            else if (pos.x > this.width) {\n                const edge1 = _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"].subtract(new _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"](this.width, pos.y), pos);\n                const mag = edge1.length();\n                edge1.normalize();\n                edge1.scale(mag);\n                point.applyForce(edge1);\n            }\n            if (pos.y < 0) {\n                const edge2 = _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"].subtract(new _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"](pos.x, 0), pos);\n                const mag = edge2.length();\n                edge2.normalize();\n                edge2.scale(mag);\n                point.applyForce(edge2);\n            }\n            else if (pos.y > this.height) {\n                const edge2 = _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"].subtract(new _Vector__WEBPACK_IMPORTED_MODULE_3__[\"Vector\"](pos.x, this.height), pos);\n                const mag = edge2.length();\n                edge2.normalize();\n                edge2.scale(mag);\n                point.applyForce(edge2);\n            }\n            const centerGrav = point.getCenterGrav(this.center);\n            const dir = point.position.copy();\n            const mag = dir.length();\n            dir.normalize();\n            const freqScalar = this.analyser.freqData[point.mass*8];\n            if (freqScalar) {\n                const scaled = freqScalar / 50;\n                const antiGrav = centerGrav.copy();\n                antiGrav.normalize();\n                antiGrav.scale(freqScalar);\n                antiGrav.scale(Math.round(Math.random()) || -1);\n                point.applyForce(antiGrav);\n            }\n            point.applyForce(centerGrav);\n            point.move();\n        });\n        if (this.doAnim) {\n           window.requestAnimationFrame(()=> this.animate());\n        }\n    }\n\n    drawPoint(point, context) {\n        context.beginPath();\n        context.arc(point.position.x, point.position.y, point.mass, 0, 2*Math.PI, true);\n        context.fill();\n    }\n\n    drawLine(b1, b2, context) {\n        context.strokeStyle = 'rgb(100, 155, 155)';\n        context.beginPath();\n        context.moveTo(b1.position.x, b1.position.y);\n        context.lineTo(b2.position.x, b2.position.y);\n        context.stroke();\n        context.strokeStyle = 'rgb(200, 255, 255)';\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Animation.js?");

/***/ }),

/***/ "./src/AudioSource.js":
/*!****************************!*\
  !*** ./src/AudioSource.js ***!
  \****************************/
/*! exports provided: AudioSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AudioSource\", function() { return AudioSource; });\nclass AudioSource {\n    constructor() {\n        this.ctx = new (window.AudioContext || window.webkitAudioContext)();\n        this.analyser = this.ctx.createAnalyser();\n        navigator.mediaDevices.getUserMedia(\n            {audio: true, video: false}\n        ).then(stream => {\n            this.source = this.ctx.createMediaStreamSource(stream)\n        }).then(()=> this.source.connect(this.analyser));\n        this.analyser.fftSize = 256;\n        this.analyser.maxDecibels = 50;\n        this.analyser.minDecibels = -70;\n        this.bufferLength = this.analyser.frequencyBinCount;\n        this.freqData = new Uint8Array(this.bufferLength);\n    }\n\n    update() {\n        this.analyser.getByteFrequencyData(this.freqData);\n    }\n}\n\n\n\n\n//# sourceURL=webpack:///./src/AudioSource.js?");

/***/ }),

/***/ "./src/KdTree.js":
/*!***********************!*\
  !*** ./src/KdTree.js ***!
  \***********************/
/*! exports provided: Node, KdTree, equalPoints, compareDouble, distanceSquared */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Node\", function() { return Node; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"KdTree\", function() { return KdTree; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"equalPoints\", function() { return equalPoints; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"compareDouble\", function() { return compareDouble; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"distanceSquared\", function() { return distanceSquared; });\nclass Node {\n    constructor(point, _parent) {\n        this.point = [point];\n        this._parent = _parent;\n        this.lb = null;\n        this.rt = null;\n    }\n}\n\n\nclass KdTree {\n    constructor() {\n        this.size = 0;\n        this.rootNode = null;\n        this.collisions = 0;\n    }\n\n    insert(point) {\n        /******************************************************************************************\n        *   Public interface to put\n        *   Takes a Point or array of Points.\n        ******************************************************************************************/\n        if (point === null || point === undefined) throw 'Invalid argument';\n        if (Array.isArray(point)) {\n            point.forEach(p=>{\n                if (!p instanceof Point || p === null) throw 'Invalid argument';\n                this.rootNode = this.put(this.rootNode, p, null, true);\n            });\n        }\n        else {\n            this.rootNode = this.put(this.rootNode, point, null, true);\n        }\n    }\n\n    put(node, point, _parent, isVertical) {\n        /******************************************************************************************\n         *  Insert point into KdTree\n         *  node (type: Node) - current node to compare new point with\n         *  point (type: point) - new point to insert\n         *  _parent (type: Node) - parent node of current node\n         *  isVertical (type: Boolean) - whether we are dividing h or v at this\n         *      recursive level, reversed on each successive call.\n         *****************************************************************************************/\n        if (node === null) {\n            this.size++;\n            return new Node(point, _parent);\n        }\n        if (equalPoints(point, node.point[0])) {\n            node.point.push(point);\n            this.collisions++;\n            return node;\n        }\n        let cmp;\n        if (isVertical) {\n            cmp = compareDouble(point.position.x, node.point[0].position.x);\n        }\n        else {\n            cmp = compareDouble(point.position.y, node.point[0].position.y);\n        }\n        if (cmp === -1) {\n            node.lb = this.put(node.lb, point, node, !isVertical);\n        }\n        else {\n            node.rt = this.put(node.rt, point, node, !isVertical);\n        }\n        return node;\n    }\n\n    nearestNeighbour(query) {\n        /******************************************************************************************\n         *  Public interface for getNearest.\n         *****************************************************************************************/\n        if (query === null || query === undefined) throw 'Invalid argument';\n        if (this.size < 2) return null;\n        return this.getNearest(this.rootNode.point[0], query, this.rootNode, true);\n    }\n\n    getNearest(nearest, queryPoint, node, isVertical) {\n        /******************************************************************************************\n         *  nearest (type: Point) - nearest point found so far\n         *  node (type: Node) - current node to compare queryPoint with\n         *  queryPoint (type: Point) - point to find nearest neighbour of\n         *  isVertical (type: Boolean) - whether we are dividing h or v at this\n         *      recursive level, reversed on each successive call.\n         *  As we are finding the nearest neighbour of every point in the tree,\n         *      to avoid every query point returning itself, we set the distanceSquared \n         *      method to return Infinity if two of the same point (either the same object \n         *      or another object with the same coordinates) are compared.\n         *****************************************************************************************/\n        if (node === null) {\n            return nearest;\n        }\n        if (compareDouble(distanceSquared(node.point[0], queryPoint),\n                distanceSquared(nearest, queryPoint)) < 0) {\n            nearest = node.point[0];\n        }\n        let cmp;\n        if (isVertical) { // take lb branch if node.point is greater than query\n            cmp = compareDouble(node.point[0].position.x, queryPoint.position.x);\n        }\n        else {\n            cmp = compareDouble(node.point[0].position.y, queryPoint.position.y);\n        }\n        if (cmp === 1) {\n            nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);\n            // if nearest returned is greater than dist to current node, check the other branch\n            if (compareDouble(distanceSquared(nearest, queryPoint),\n                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {\n                nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);\n            }\n        }\n        else {\n            nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);\n            if (compareDouble(distanceSquared(nearest, queryPoint),\n                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {\n                nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);\n            }\n        }\n        return nearest;\n    }\n\n    otherBranchDistSquared(nearest, node, vertical) {\n        let distance;\n        if (vertical) distance = Math.abs(node.point[0].position.x - nearest.position.x);\n        else distance = Math.abs(node.point[0].position.y - nearest.position.y);\n        return distance * distance;\n    }\n\n    range(rect) {\n        /******************************************************************************************\n         * rect: 2d Rect object\n         * Return an array of all points within the 2d range. Interface to KdTree.getRange\n         *****************************************************************************************/\n        if (rect === null) throw 'Invalid argument';\n        let stack = [];\n        this.getRange(this.rootNode, stack, rect, true);\n        return stack;\n    }\n\n    getRange(node, stack, rect, isVertical) {\n        if (node === null) return;\n        let cmp;\n        if (rect.contains(node.point[0])) {\n            node.point.forEach(p=>stack.push(p));\n            cmp = 0;\n        }\n        else if (isVertical) {\n            if (compareDouble(node.point[0].position.x, rect.xmin) >= 0 &&\n                    compareDouble(node.point[0].position.x, rect.xmin) <= 0) {\n                cmp = 0;\n            }\n            else {\n                cmp = (compareDouble(node.point[0].position.x, rect.xmin) < 0) ? 1 : -1;\n            }\n        }\n        else {\n            if (compareDouble(node.point[0].position.y, rect.ymin) >= 0 &&\n                    compareDouble(node.point[0].position.y, rect.ymax) <= 0) {\n                cmp = 0;\n            }\n            else {\n                cmp = (compareDouble(node.point[0].position.y, rect.ymin) < 0) ? 1 : -1;\n            }\n        }\n        if (cmp === 0) {\n            this.getRange(node.lb, stack, rect, !isVertical);\n            this.getRange(node.rt, stack, rect, !isVertical);\n        }\n        else if (cmp === -1) {\n            this.getRange(node.lb, stack, rect, !isVertical);\n        }\n        else {\n            this.getRange(node.rt, stack, rect, !isVertical);\n        }\n    }\n}\n\n\nfunction equalPoints(p1, p2) {\n    return Math.floor(p1.position.x * 10000) === Math.floor(p2.position.x * 10000) &&\n        Math.floor(p1.position.y * 10000) === Math.floor(p2.position.y * 10000);\n}\n\n\nfunction compareDouble(a, b) {\n    a = Math.floor(a * 1000);\n    b = Math.floor(b * 1000);\n    if (a === b) return 0;\n    else if (a < b) return -1;\n    return 1;\n}\n\n\nfunction distanceSquared(p, q) {\n    if (p === q || equalPoints(p, q)) return Infinity;\n    let dx = Math.abs(p.position.x - q.position.x);\n    let dy = Math.abs(p.position.y - q.position.y);\n    let result = Math.pow(dx, 2) + Math.pow(dy, 2);\n    return Math.floor(result*1000)/1000;\n}\n\n\n\n\n//# sourceURL=webpack:///./src/KdTree.js?");

/***/ }),

/***/ "./src/Point.js":
/*!**********************!*\
  !*** ./src/Point.js ***!
  \**********************/
/*! exports provided: Point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Point\", function() { return Point; });\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n\n\n\n\nclass Point {\n    constructor(x, y, id) {\n        this.mass = Math.floor(Math.random() * (16 - 2) + 2);\n        this.position = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](x, y);\n        this.velocity = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0);\n        this.lastPos = null;\n        this.accel = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0.001, 0.001);\n        this.id = id;\n    }\n\n    applyForce(force) {\n        _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].checkArgType(force);\n        const f = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].divide(force, this.mass);\n        this.accel.add(f);\n    }\n\n    angleInRadiansFrom(that) {\n        return Math.atan2(\n            this.position.y - that.position.y,\n            this.position.x - that.position.x\n        );\n    }\n\n    move() {\n        this.velocity.add(this.accel);\n        this.velocity.limit(15);\n        this.position.add(this.velocity);\n        this.accel.scale(0);\n    }\n\n    getDx() {\n        return this.speed * Math.cos(this.rotation);\n    }\n\n    getDy() {\n        return this.speed * Math.sin(this.rotation);\n    }\n\n    bySlope(p, q) {\n        return this.slopeTo(p) - this.slopeTo(q);\n    }\n\n    compareTo(that) {\n        if (this.position.y < that.position.y) return -1;\n        else if (this.position.y > that.position.y) return 1;\n        else if (this.position.x < that.position.x) return -1;\n        else if (this.position.x > that.position.x) return 1;\n        else return 0;\n    }\n\n    slopeTo(that) {\n        if (this.position.x == that.position.x &&\n            this.position.y == that.position.y)\n            return -Infinity;\n        else if (this.position.y == that.position.y) return 0.0;\n        else if (this.position.x == that.position.x) return Infinity;\n        else return (that.position.y - this.position.y) /\n            (that.position.x - this.position.x);\n    }\n\n    getFlockVector(range) {\n        if (!range.avg || !range.mass) return new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](1, 1);\n        const avgPos = range.avg;\n        const totalMass = range.mass / 5;\n        const pos = this.position;\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(avgPos, pos);\n        const mag = dir.length();\n        dir.normalize();\n        const grav = (0.001 * point.mass * totalMass) / (mag * mag);\n        dir.scale(grav);\n        return dir;\n    }\n\n    getCenterGrav(centerPoint) {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(centerPoint.position, this.position);\n        const mag = dir.length();\n        dir.normalize();\n        const grav = (_constants__WEBPACK_IMPORTED_MODULE_1__[\"G\"] * this.mass * 26) / (mag * mag);\n        dir.scale(grav);\n        return dir;\n    }\n\n    getResistance() {\n        const speed = this.velocity.length();\n        // get half circumference of circle for frontal area - mass is radius\n        const frontalArea = Math.PI * this.mass;\n        const dragMagnitude = frontalArea * _constants__WEBPACK_IMPORTED_MODULE_1__[\"C\"] * speed * speed;\n        const drag = this.velocity.copy();\n        drag.normalize();\n        drag.scale(-1);\n        drag.scale(dragMagnitude);\n        return drag;\n    }\n\n    getNeighbourGrav() {\n        const pos = this.position;\n        const neighbour = this.nearest.position;\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(neighbour, pos);\n        const dist = dir.length();\n        const m = (_constants__WEBPACK_IMPORTED_MODULE_1__[\"G\"] * this.mass * this.nearest.mass) / (dist * dist);\n        dir.normalize();\n        dir.scale(m);\n        return dir;\n    }\n\n    getRangeAverages(tree) {\n        const rect = new Rect(\n            this.position.x - _constants__WEBPACK_IMPORTED_MODULE_1__[\"PROXIMITY\"], this.position.y - _constants__WEBPACK_IMPORTED_MODULE_1__[\"PROXIMITY\"],\n            this.position.x + _constants__WEBPACK_IMPORTED_MODULE_1__[\"PROXIMITY\"], this.position.y + _constants__WEBPACK_IMPORTED_MODULE_1__[\"PROXIMITY\"]\n        )\n        const neighbours = tree.range(rect);\n        if (neighbours.length < 2) {\n            return new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](1, 1);\n        }\n        const mass = neighbours.map(x => x.mass);\n        const totalMass = mass.reduce((a, b) => a + b);\n        const vectors = neighbours.map(x=>x.position);\n        const sumVectors = vectors.reduce((acc, next) => {\n            return _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].add(acc, next);\n        }, new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0));\n        const avgPos = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].divide(sumVectors, neighbours.length);\n        return { avg: avgPos, mass: totalMass };\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Point.js?");

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
/*! exports provided: MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MAX_SPEED\", function() { return MAX_SPEED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MIN_SPEED\", function() { return MIN_SPEED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START_COUNT\", function() { return START_COUNT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PROXIMITY\", function() { return PROXIMITY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"G\", function() { return G; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"C\", function() { return C; });\nconst MAX_SPEED = 1.5;\nconst MIN_SPEED = 1;\nconst START_COUNT = 100;\nconst PROXIMITY = 2;\nconst G = 43;\nconst C = 0.000001;\n\n\n\n\n//# sourceURL=webpack:///./src/constants.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _KdTree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./KdTree */ \"./src/KdTree.js\");\n/* harmony import */ var _AudioSource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioSource */ \"./src/AudioSource.js\");\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Point */ \"./src/Point.js\");\n/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Animation */ \"./src/Animation.js\");\n\n \n\n\n\n\n\n\n\nwindow.addEventListener(\"load\", function() {\n    const container0 = document.querySelector('#container0');\n    const container1 = document.querySelector('#container1');\n    const analyser = new _AudioSource__WEBPACK_IMPORTED_MODULE_2__[\"AudioSource\"]();\n    const anim = new _Animation__WEBPACK_IMPORTED_MODULE_6__[\"Animation\"](container0, container1, analyser);\n    anim.animate();\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });