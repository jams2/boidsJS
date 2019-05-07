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
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _Particle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Particle */ \"./src/Particle.js\");\n/* harmony import */ var _RandomWalkParticle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RandomWalkParticle */ \"./src/RandomWalkParticle.js\");\n/* harmony import */ var _KdTree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./KdTree */ \"./src/KdTree.js\");\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n/* harmony import */ var _StatDisplay__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StatDisplay */ \"./src/StatDisplay.js\");\n/* harmony import */ var _Graph__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Graph */ \"./src/Graph.js\");\n/* harmony import */ var _DepthFirstSearch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DepthFirstSearch */ \"./src/DepthFirstSearch.js\");\n\n\n\n\n\n\n\n\n\n\nclass Animation {\n    constructor(particleContextContainer, lineContextContainer) {\n        this.statDisplay = new _StatDisplay__WEBPACK_IMPORTED_MODULE_5__[\"default\"](document.querySelector('#fps'));\n        this.canvasWidth = particleContextContainer.clientWidth;\n        this.canvasHeight = particleContextContainer.clientHeight;\n        this.particleContext = this.createAnimationContext(\n            particleContextContainer,\n        );\n        this.lineContext = this.createAnimationContext(lineContextContainer);\n        this.particles = this.generateParticles(_constants__WEBPACK_IMPORTED_MODULE_0__[\"START_COUNT\"], Animation.gaussianRandomParticle);\n        this.randomWalker = new _RandomWalkParticle__WEBPACK_IMPORTED_MODULE_2__[\"default\"](\n            Animation.gaussianRandom(this.canvasWidth),\n            Animation.gaussianRandom(this.canvasHeight),\n            -1,\n        );\n        this.doAnim = true;\n        document.querySelector('#stop').addEventListener('click', (event) => {\n            event.preventDefault();\n            this.doAnim = !this.doAnim;\n            if (this.doAnim) this.animate();\n        });\n    }\n\n    createAnimationContext(container, fillStyle) {\n        const canvas = this.createCanvas();\n        container.appendChild(canvas);\n        const animationContext = canvas.getContext('2d');\n        if (fillStyle !== null && fillStyle !== undefined) {\n            animationContext.fillStyle = fillStyle;\n        }\n        return animationContext;\n    }\n\n    createCanvas() {\n        const canvas = document.createElement('canvas');\n        canvas.width = this.canvasWidth;\n        canvas.height = this.canvasHeight;\n        return canvas;\n    }\n\n    generateParticles(count, particleFactory) {\n        const particles = [];\n        let particleCounter = 0;\n        while (particleCounter < count) {\n            particles.push(\n                particleFactory(this.canvasWidth, this.canvasHeight, particles.length),\n            );\n            particleCounter += 1;\n        }\n        return particles;\n    }\n\n    static gaussianRandomParticle(containerWidth, containerHeight, particleId) {\n        return new _Particle__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\n            Animation.gaussianRandom(containerWidth),\n            Animation.gaussianRandom(containerHeight),\n            particleId,\n        );\n    }\n\n    static gaussianRandom(limit) { return Math.floor(Animation.gaussianRand() * (limit+1)); }\n\n    static gaussianRand() {\n        // https://stackoverflow.com/a/39187274\n        let rand = 0;\n        for (let i = 0; i < 6; i += 1) { rand += Math.random(); }\n        return rand / 6;\n    }\n\n    static uniformRandomParticle(width, height, particleId) {\n        return new _Particle__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\n            Animation.uniformRandom(width),\n            Animation.uniformRandom(height),\n            particleId,\n        );\n    }\n\n    static uniformRandom(limit) { return Math.floor(Math.random() * limit); }\n\n    animate() {\n        this.statDisplay.updateFps(performance.now());\n        const tree = new _KdTree__WEBPACK_IMPORTED_MODULE_3__[\"KdTree\"]();\n        this.populateNewTree(tree);\n\n        this.clearCanvas();\n\n        // main anim loop\n        this.particleContext.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__[\"PARTICLE_FILLSTYLE\"];\n        this.particleContext.beginPath();\n        let i = 0;\n        this.setNearestNeighboursIfNull(this.randomWalker, tree);\n        this.randomWalker.move();\n        this.reflectFromBoundary(this.randomWalker);\n        while (i < this.particles.length) {\n            this.setNearestNeighboursIfNull(this.particles[i], tree);\n            this.alignParticleWithNeighbours(this.particles[i], tree);\n            this.particles[i].avoidCollision();\n            this.particles[i].performCollision();\n            this.particles[i].applyForce(this.particles[i].getResistance());\n            this.translateIfOutOfBounds(this.particles[i]);\n            this.particles[i].move();\n            Animation.drawParticle(this.particles[i], this.particleContext);\n            i += 1;\n        };\n        const walkerNeighbours = this.randomWalker.getNeighbours(tree);\n        if (walkerNeighbours != null) {\n            i = 0;\n            while (i < walkerNeighbours.length) {\n                walkerNeighbours[i].attractTo(this.randomWalker.position);\n                i += 1\n            }\n        }\n        this.particleContext.fill();\n        return;\n        if (this.doAnim) {\n            window.requestAnimationFrame(() => this.animate());\n        }\n    }\n\n    populateNewTree(tree) {\n        let i = 0;\n        while (i < this.particles.length) {\n            this.particles[i].nearest = null;\n            this.particles[i]._distToNearest = null;\n            this.particles[i]._distSquaredToNearest = null;\n            tree.insert(this.particles[i]);\n            i += 1;\n        };\n        tree.insert(this.randomWalker);\n    }\n\n    clearCanvas() {\n        this.particleContext.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__[\"PARTICLE_CONTEXT_FILLSTYLE\"];\n        this.particleContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);\n    }\n\n    setNearestNeighboursIfNull(particle, tree) {\n        if (particle.nearest === null) {\n            particle.setNearestNeighbour(particle.getNearestNeighbour(tree));\n            particle.nearest.setNearestNeighbour(particle);\n        }\n    }\n\n    alignParticleWithNeighbours(particle, tree) {\n        const neighbours = particle.getNeighbours(tree);\n        if (neighbours !== null && particle !== undefined) {\n            particle.alignWithNeighbours(neighbours);\n        }\n    }\n\n    translateIfOutOfBounds(particle) {\n        const pos = particle.position;\n        if (pos.x < 0) {\n            pos.x = this.canvasWidth;\n        } else if (pos.x > this.canvasWidth) {\n            pos.x = 0;\n        }\n        if (pos.y < 0) {\n            pos.y = this.canvasHeight;\n        } else if (pos.y > this.canvasHeight) {\n            pos.y = 0;\n        }\n    }\n\n    reflectFromBoundary(particle) {\n        const pos = particle.position;\n        if (pos.x < 0) {\n            pos.x = this.canvasWidth;\n        } else if (pos.x > this.canvasWidth) {\n            pos.x = 0;\n        }\n        if (pos.y < 0) {\n            pos.y = this.canvasHeight;\n        } else if (pos.y > this.canvasHeight) {\n            pos.y = 0;\n        }\n    }\n\n    static drawParticle(particle, context) {\n        context.moveTo(particle.position.x, particle.position.y);\n        context.arc(particle.position.x, particle.position.y, particle.mass, 0, 2*Math.PI, true);\n    }\n\n    static drawLine(b1, b2, context) {\n        context.strokeStyle = 'rgb(255, 50, 50)';\n        context.beginPath();\n        context.moveTo(b1.position.x, b1.position.y);\n        context.lineTo(b2.position.x, b2.position.y);\n        context.stroke();\n        context.strokeStyle = 'rgb(200, 255, 255)';\n    }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Animation);\n\n\n//# sourceURL=webpack:///./src/Animation.js?");

/***/ }),

/***/ "./src/DepthFirstSearch.js":
/*!*********************************!*\
  !*** ./src/DepthFirstSearch.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass DepthFirstSearch {\n    constructor(graph) {\n        this.marked = Array(graph.length).fill(false);\n        this.componentId = Array(graph.length).fill(null);\n        this.componentSize = Array(graph.length).fill(0);\n        this.numComponents = 0;\n        for (let vertexIndex = 0; vertexIndex < graph.vertices.length; vertexIndex += 1) {\n            if (!this.marked[vertexIndex]) {\n                this.depthFirstSearch(graph, vertexIndex);\n                this.numComponents += 1;\n            }\n        }\n    }\n\n    depthFirstSearch(graph, vertexIndex) {\n        this.marked[vertexIndex] = true;\n        this.componentId[vertexIndex] = this.numComponents;\n        this.componentSize[this.numComponents] += 1;\n        graph.adjacentVertexIndices[vertexIndex].forEach((adjacentVertexIndex) => {\n            if (!this.marked[adjacentVertexIndex]) {\n                this.depthFirstSearch(graph, adjacentVertexIndex);\n                this.numComponents += 1;\n            }\n        });\n    }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (DepthFirstSearch);\n\n\n//# sourceURL=webpack:///./src/DepthFirstSearch.js?");

/***/ }),

/***/ "./src/Graph.js":
/*!**********************!*\
  !*** ./src/Graph.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst CONNECTION_THRESHOLD = 150;\n\n\nclass Graph {\n    constructor(particles) {\n        this.vertices = particles.slice(0);\n        this.adjacentVertexIndices = [];\n        for (let i = 0; i < this.vertices.length; i += 1) {\n            this.adjacentVertexIndices[i] = [];\n        }\n        this.countEdges = 0;\n        for (let i = 0; i < this.vertices.length; i += 1) {\n            if (this.vertices[i].distToNearest() <= CONNECTION_THRESHOLD) {\n                const indexOfNearest = this.vertices.indexOf(this.vertices[i].nearest);\n                this.adjacentVertexIndices[i].push(indexOfNearest);\n                this.countEdges += 1;\n            }\n        }\n    }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Graph);\n\n\n//# sourceURL=webpack:///./src/Graph.js?");

/***/ }),

/***/ "./src/KdTree.js":
/*!***********************!*\
  !*** ./src/KdTree.js ***!
  \***********************/
/*! exports provided: Node, KdTree, equalPoints, comparePosition, distanceSquared */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Node\", function() { return Node; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"KdTree\", function() { return KdTree; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"equalPoints\", function() { return equalPoints; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"comparePosition\", function() { return comparePosition; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"distanceSquared\", function() { return distanceSquared; });\nclass Node {\n    constructor(newPoint, parentNode) {\n        this.points = [newPoint];\n        this.parentNode = parentNode;\n        this.lb = null;\n        this.rt = null;\n    }\n}\n\n\nclass KdTree {\n    constructor() {\n        this.size = 0;\n        this.rootNode = null;\n    }\n\n    insert(point) {\n        // Public interface to KdTree.put\n        if (point === null || point === undefined) throw 'Invalid argument';\n        this.rootNode = this.put(this.rootNode, point, null, true);\n    }\n\n    put(currentNode, newPoint, parentNode, isVertical) {\n        if (currentNode === null) {\n            this.size++;\n            return new Node(newPoint, parentNode);\n        }\n        if (equalPoints(newPoint, currentNode.points[0])) {\n            currentNode.points.push(newPoint);\n            return currentNode;\n        }\n        let cmp;\n        if (isVertical) {\n            cmp = comparePosition(newPoint.position.x, currentNode.points[0].position.x);\n        } else {\n            cmp = comparePosition(newPoint.position.y, currentNode.points[0].position.y);\n        }\n        if (cmp === -1) {\n            currentNode.lb = this.put(currentNode.lb, newPoint, currentNode, !isVertical);\n        } else {\n            currentNode.rt = this.put(currentNode.rt, newPoint, currentNode, !isVertical);\n        }\n        return currentNode;\n    }\n\n    nearestNeighbour(query) {\n        // Public interface for getNearest.\n        if (query === null || query === undefined) throw 'Invalid argument';\n        if (this.size < 2) return null;\n        return this.getNearest(this.rootNode.points[0], query, this.rootNode, true);\n    }\n\n    getNearest(nearest, queryPoint, node, isVertical) {\n        /******************************************************************************************\n         *  nearest (type: Point) - nearest point found so far\n         *  node (type: Node) - current node to compare queryPoint with\n         *  queryPoint (type: Point) - point to find nearest neighbour of\n         *  isVertical (type: Boolean) - whether we are dividing h or v at this\n         *      recursive level, reversed on each successive call.\n         *  As we are finding the nearest neighbour of every point in the tree,\n         *      to avoid every query point returning itself, we set the distanceSquared \n         *      method to return Infinity if two of the same point (either the same object \n         *      or another object with the same coordinates) are compared.\n         *****************************************************************************************/\n        if (node === null) {\n            return nearest;\n        }\n        if (comparePosition(distanceSquared(node.points[0], queryPoint),\n                distanceSquared(nearest, queryPoint)) < 0) {\n            nearest = node.points[0];\n        }\n        let cmp;\n        if (isVertical) { // take lb branch if node.point is greater than query\n            cmp = comparePosition(node.points[0].position.x, queryPoint.position.x);\n        }\n        else {\n            cmp = comparePosition(node.points[0].position.y, queryPoint.position.y);\n        }\n        if (cmp === 1) {\n            nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);\n            // if nearest returned is greater than dist to current node, check the other branch\n            if (comparePosition(distanceSquared(nearest, queryPoint),\n                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {\n                nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);\n            }\n        } else {\n            nearest = this.getNearest(nearest, queryPoint, node.rt, !isVertical);\n            if (comparePosition(distanceSquared(nearest, queryPoint),\n                this.otherBranchDistSquared(queryPoint, node, isVertical)) >= 0) {\n                nearest = this.getNearest(nearest, queryPoint, node.lb, !isVertical);\n            }\n        }\n        return nearest;\n    }\n\n    otherBranchDistSquared(nearest, node, vertical) {\n        let distance;\n        if (vertical) distance = Math.abs(node.points[0].position.x - nearest.position.x);\n        else distance = Math.abs(node.points[0].position.y - nearest.position.y);\n        return distance * distance;\n    }\n\n    range(rect) {\n        /******************************************************************************************\n         * rect: 2d Rect object\n         * Return an array of all points within the 2d range. Interface to KdTree.getRange.\n         * If called in reference to a point, e.g. in Point.getNeighhbours, that point will\n         * be included in the returned stack.\n         *****************************************************************************************/\n        if (rect === null) throw 'Invalid argument';\n        let stack = [];\n        this.getRange(this.rootNode, stack, rect, true);\n        return stack;\n    }\n\n    getRange(node, stack, rect, isVertical) {\n        if (node === null) return;\n        let cmp;\n        if (rect.contains(node.points[0])) {\n            let i = 0;\n            while (i < node.points.length) {\n                stack.push(node.points[i]);\n                i += 1;\n            }\n            cmp = 0;\n        }\n        else if (isVertical) {\n            if (comparePosition(node.points[0].position.x, rect.xmin) >= 0 &&\n                    comparePosition(node.points[0].position.x, rect.xmin) <= 0) {\n                cmp = 0;\n            }\n            else {\n                cmp = (comparePosition(node.points[0].position.x, rect.xmin) < 0) ? 1 : -1;\n            }\n        }\n        else {\n            if (comparePosition(node.points[0].position.y, rect.ymin) >= 0 &&\n                    comparePosition(node.points[0].position.y, rect.ymax) <= 0) {\n                cmp = 0;\n            }\n            else {\n                cmp = (comparePosition(node.points[0].position.y, rect.ymin) < 0) ? 1 : -1;\n            }\n        }\n        if (cmp === 0) {\n            this.getRange(node.lb, stack, rect, !isVertical);\n            this.getRange(node.rt, stack, rect, !isVertical);\n        }\n        else if (cmp === -1) {\n            this.getRange(node.lb, stack, rect, !isVertical);\n        }\n        else {\n            this.getRange(node.rt, stack, rect, !isVertical);\n        }\n    }\n}\n\n\nfunction equalPoints(p1, p2) {\n    return p1.position.x === p2.position.x &&\n        p1.position.y === p2.position.y;\n}\n\n\nfunction comparePosition(a, b) {\n    if (a === b) return 0;\n    else if (a < b) return -1;\n    return 1;\n}\n\n\nfunction distanceSquared(p, q) {\n    if (p.id === q.id || equalPoints(p, q)) return Infinity;\n    const dx = Math.abs(p.position.x - q.position.x);\n    const dy = Math.abs(p.position.y - q.position.y);\n    return dx*dx + dy*dy;\n}\n\n\n\n\n//# sourceURL=webpack:///./src/KdTree.js?");

/***/ }),

/***/ "./src/Particle.js":
/*!*************************!*\
  !*** ./src/Particle.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n/* harmony import */ var _Rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Rect */ \"./src/Rect.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n\n\n\n\n\nclass Particle {\n    constructor(x, y, id) {\n        this.mass = 3;\n        this.position = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](x, y);\n        this.velocity = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](\n            Math.floor(Math.random() * _constants__WEBPACK_IMPORTED_MODULE_2__[\"MAX_SPEED\"]),\n            Math.floor(Math.random() * _constants__WEBPACK_IMPORTED_MODULE_2__[\"MAX_SPEED\"]),\n        );\n        this.lastPos = null;\n        this.accel = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0.0001, 0.0001);\n        this.id = id;\n        this.nearest = null;\n        this._distToNearest = null;\n        this._distSquaredToNearest = null;\n    }\n\n    getNearestNeighbour(tree) {\n        return tree.nearestNeighbour(this);\n    }\n\n    setNearestNeighbour(otherParticle) {\n        this.nearest = otherParticle;\n    }\n\n    alignWithNeighbours(neighbours) {\n        this.applyAvgPosition(neighbours);\n        this.applyAvgVelocity(neighbours);\n    }\n\n    applyAvgPosition(neighbours) {\n        const avgPosition = this.getAvgPosition(neighbours);\n        this.applyForce(avgPosition);\n    }\n\n    applyAvgVelocity(neighbours) {\n        const avgVelocity = this.getAvgVelocity(neighbours);\n        this.applyForce(avgVelocity);\n    }\n\n    distToNearest() {\n        if (this.nearest === null) {\n            return -Infinity;\n        } else if (this._distToNearest === null) {\n            const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(this.position, this.nearest.position);\n            this._distToNearest = dir.length();\n        }\n        return this._distToNearest;\n    }\n\n    distSquaredToNearest() {\n        if (this.nearest === null) {\n            return -Infinity;\n        } else if (this._distSquaredToNearest === null) {\n            const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(this.position, this.nearest.position);\n            this._distSquaredToNearest = dir.lengthSq();\n        }\n        return this._distSquaredToNearest;\n    }\n\n    distSquaredTo(other) {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(this.position, other.position);\n        return dir.lengthSq();\n    }\n\n    applyForce(force) {\n        _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].checkArgType(force);\n        const f = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].divide(force, this.mass);\n        this.accel.add(f);\n    }\n\n    angleInRadiansFrom(that) {\n        return Math.atan2(\n            this.position.y - that.position.y,\n            this.position.x - that.position.x,\n        );\n    }\n\n    performCollision() {\n        if (this.nearest !== null && this.distSquaredTo(this.nearest) <= 20) {\n            const tmp = this.nearest.velocity;\n            this.nearest.velocity = this.velocity;\n            this.velocity = tmp;\n        }\n    }\n\n    avoidCollision() {\n        if (this.distToNearest() < _constants__WEBPACK_IMPORTED_MODULE_2__[\"COLLISION\"]) {\n            const delta = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(\n                new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0),\n                _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(this.nearest.position, this.position),\n            );\n            delta.scale(0.75);\n            this.applyForce(delta);\n        }\n    }\n\n    tendTowards(position, scalar) {\n        const towards = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(position, this.position);\n        towards.divideBy(100);\n        towards.scale(scalar);\n        return towards;\n    }\n\n    attractTo(position) {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(position, this.position);\n        dir.normalize();\n        dir.scale(_constants__WEBPACK_IMPORTED_MODULE_2__[\"MOUSE_REPEL\"]);\n        this.applyForce(dir);\n    }\n\n    move() {\n        this.velocity.add(this.accel);\n        this.velocity.limit(_constants__WEBPACK_IMPORTED_MODULE_2__[\"MAX_SPEED\"]);\n        this.position.add(this.velocity);\n        this.accel.scale(0);\n        this.position.x = Math.floor(this.position.x);\n        this.position.y = Math.floor(this.position.y);\n    }\n\n    getDx() {\n        return this.speed * Math.cos(this.rotation);\n    }\n\n    getDy() {\n        return this.speed * Math.sin(this.rotation);\n    }\n\n    bySlope(p, q) {\n        return this.slopeTo(p) - this.slopeTo(q);\n    }\n\n    compareTo(that) {\n        if (this.position.y < that.position.y) return -1;\n        else if (this.position.y > that.position.y) return 1;\n        else if (this.position.x < that.position.x) return -1;\n        else if (this.position.x > that.position.x) return 1;\n        return 0;\n    }\n\n    slopeTo(that) {\n        if (this.positionEquals(that)) return -Infinity;\n        else if (this.position.y === that.position.y) return 0.0;\n        else if (this.position.x === that.position.x) return Infinity;\n        return (that.position.y - this.position.y) / (that.position.x - this.position.x);\n    }\n\n    positionEquals(that) {\n        return this.position.x === that.position.x && this.position.y === that.position.y;\n    }\n\n    getFlockVector(range) {\n        if (!range.avgPos || !range.avgVel) {\n            return new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0);\n        }\n        range.avgPos.divideBy(100);\n        range.avgPos.scale(_constants__WEBPACK_IMPORTED_MODULE_2__[\"FLOCK_POSITION_SCALAR\"]);\n        range.avgVel.divideBy(100);\n        return range.avg;\n    }\n\n    getCenterGrav(centerParticle) {\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(centerParticle.position, this.position);\n        const mag = dir.length();\n        dir.normalize();\n        const grav = (_constants__WEBPACK_IMPORTED_MODULE_2__[\"G\"] * this.mass * 26) / (mag * mag);\n        dir.scale(grav);\n        return dir;\n    }\n\n    getResistance() {\n        const speed = this.velocity.length();\n        // get half circumference of circle for frontal area - mass is radius\n        const frontalArea = Math.PI * this.mass;\n        const dragMagnitude = frontalArea * _constants__WEBPACK_IMPORTED_MODULE_2__[\"C\"] * speed * speed;\n        const drag = this.velocity.copy();\n        drag.normalize();\n        drag.scale(-1);\n        drag.scale(dragMagnitude);\n        return drag;\n    }\n\n    getNeighbourGrav() {\n        const pos = this.position;\n        const neighbour = this.nearest.position;\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(neighbour, pos);\n        const dist = dir.length();\n        const m = (_constants__WEBPACK_IMPORTED_MODULE_2__[\"G\"] * this.mass * this.nearest.mass) / (dist * dist);\n        dir.normalize();\n        dir.scale(m);\n        return dir;\n    }\n\n    getNeighbours(tree) {\n        const rect = new _Rect__WEBPACK_IMPORTED_MODULE_1__[\"Rect\"](\n            this.position.x - _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"], this.position.y - _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"],\n            this.position.x + _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"], this.position.y + _constants__WEBPACK_IMPORTED_MODULE_2__[\"PROXIMITY\"],\n        );\n        const neighbours = tree.range(rect);\n        if (neighbours.length < 2) {\n            return null;\n        }\n        return neighbours;\n    }\n\n    getAvgPosition(neighbours) {\n        const avgPosition = this.getVectorMean(neighbours, 'position');\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(avgPosition, this.position);\n        dir.normalize();\n        dir.scale(0.5);\n        return dir;\n    }\n\n    getAvgVelocity(neighbours) {\n        const avgVelocity = this.getVectorMean(neighbours, 'velocity');\n        const dir = _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].subtract(avgVelocity, this.velocity);\n        dir.scale(0.5);\n        return dir;\n    }\n\n    getVectorMean(vectors, property) {\n        const len = vectors.length;\n        const sumVectors = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"](0, 0);\n        for (let i = 0; i < len; i += 1) {\n            if (vectors[i].id === this.id) {\n                continue;\n            }\n            sumVectors.add(vectors[i][property]);\n        }\n        sumVectors.divideBy(len - 1);\n        return sumVectors;\n    }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Particle);\n\n\n//# sourceURL=webpack:///./src/Particle.js?");

/***/ }),

/***/ "./src/RandomWalkParticle.js":
/*!***********************************!*\
  !*** ./src/RandomWalkParticle.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Particle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Particle */ \"./src/Particle.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ \"./src/constants.js\");\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\n\n\n\nconst MAX_MOVE = 25;\n\n\nclass RandomWalkParticle extends _Particle__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(x, y, id) {\n        super(x, y, id);\n        this.mass = 35;\n    }\n\n    move() {\n        this.position.x += Math.floor(\n            (Math.random() * MAX_MOVE) * ((Math.random() > 0.49) ? 1 : -1)\n        );\n        this.position.y += Math.floor(\n            (Math.random() * MAX_MOVE) * ((Math.random() > 0.49) ? 1 : -1)\n        );\n    }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (RandomWalkParticle);\n\n\n//# sourceURL=webpack:///./src/RandomWalkParticle.js?");

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

/***/ "./src/StatDisplay.js":
/*!****************************!*\
  !*** ./src/StatDisplay.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass StatDisplay {\n    constructor(containerElement) {\n        this.container = containerElement;\n        this.fps = 0;\n        this.times = [];\n        this.collisions = [];\n    }\n\n    updateFps(now) {\n        // https://stackoverflow.com/a/48036361\n        while (this.times.length > 0 && this.times[0] <= now - 1000) {\n            this.times.shift();\n        }\n        this.times.push(now);\n        this.fps = this.times.length;\n        this.container.innerHTML = this.fps;\n    }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (StatDisplay);\n\n\n//# sourceURL=webpack:///./src/StatDisplay.js?");

/***/ }),

/***/ "./src/Vector.js":
/*!***********************!*\
  !*** ./src/Vector.js ***!
  \***********************/
/*! exports provided: Vector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector\", function() { return Vector; });\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    static checkArgType(other) {\n        if (!(other instanceof Vector)) {\n            throw 'Invalid arg';\n        }\n    }\n\n    limit(max) {\n        if (this.length() > max) {\n            this.normalize();\n            this.scale(max);\n        }\n    }\n\n    static dot(v1, v2) {\n        return v1.x * v2.x + v1.y * v2.y;\n    }\n\n    dot(other) {\n        return this.x * other.x + this.y * other.y;\n    }\n\n    static add(v1, v2) {\n        return new Vector(\n            v1.x + v2.x,\n            v1.y + v2.y\n        );\n    }\n\n    static subtract(v1, v2) {\n        return new Vector(\n            v1.x - v2.x, v1.y - v2.y\n        );\n    }\n\n    static divide(vector, scalar) {\n        return new Vector(vector.x / scalar, vector.y / scalar);\n    }\n\n    add(other) {\n        Vector.checkArgType(other);\n        this.x += other.x;\n        this.y += other.y;\n    }\n\n    subtract(other) {\n        Vector.checkArgType(other);\n        this.x -= other.x;\n        this.y -= other.y;\n    }\n\n    scale(scalar) {\n        if (isNaN(scalar)) {\n            throw 'Invalid argument';\n        }\n        this.x *= scalar;\n        this.y *= scalar;\n    }\n\n    divideBy(scalar) {\n        if (isNaN(scalar)) {\n            throw 'Invalid argument';\n        }\n        this.x /= scalar;\n        this.y /= scalar;\n    }\n\n    length() {\n        return Math.sqrt(this.x * this.x + this.y * this.y);\n    }\n\n    lengthSq() {\n        return this.x * this.x + this.y * this.y;\n    }\n\n    normalize() {\n        const m = this.length();\n        if (m) {\n            this.divideBy(m);\n        }\n    }\n\n    copy() {\n        return new Vector(this.x, this.y);\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack:///./src/Vector.js?");

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! exports provided: MOUSE_RADIUS, FLOCK_VELOCITY_SCALAR, COLLISION, FLOCK_POSITION_SCALAR, MAX_SPEED, MIN_SPEED, START_COUNT, PROXIMITY, G, C, MOUSE_REPEL, PARTICLE_CONTEXT_FILLSTYLE, PARTICLE_FILLSTYLE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOUSE_RADIUS\", function() { return MOUSE_RADIUS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FLOCK_VELOCITY_SCALAR\", function() { return FLOCK_VELOCITY_SCALAR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COLLISION\", function() { return COLLISION; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FLOCK_POSITION_SCALAR\", function() { return FLOCK_POSITION_SCALAR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MAX_SPEED\", function() { return MAX_SPEED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MIN_SPEED\", function() { return MIN_SPEED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START_COUNT\", function() { return START_COUNT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PROXIMITY\", function() { return PROXIMITY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"G\", function() { return G; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"C\", function() { return C; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOUSE_REPEL\", function() { return MOUSE_REPEL; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PARTICLE_CONTEXT_FILLSTYLE\", function() { return PARTICLE_CONTEXT_FILLSTYLE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PARTICLE_FILLSTYLE\", function() { return PARTICLE_FILLSTYLE; });\nconst MAX_SPEED = 7;\nconst MIN_SPEED = 0.1;\nconst START_COUNT = 600;\nconst PROXIMITY = 80;\nconst G = 43;\nconst C = 0.001;\nconst FLOCK_POSITION_SCALAR = 3;\nconst COLLISION = 12;\nconst FLOCK_VELOCITY_SCALAR = 0.05;\nconst MOUSE_RADIUS = 150;\nconst MOUSE_REPEL = 4;\nconst PARTICLE_CONTEXT_FILLSTYLE = 'rgba(0, 0, 0, 0.75)';\nconst PARTICLE_FILLSTYLE = 'rgb(200, 255, 255)';\n\n\n\n\n//# sourceURL=webpack:///./src/constants.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ \"./src/Animation.js\");\n\n\n\nwindow.addEventListener('load', () => {\n    const particleContextContainer = document.querySelector('#particle-container');\n    const lineContextContainer = document.querySelector('#line-container');\n    const anim = new _Animation__WEBPACK_IMPORTED_MODULE_0__[\"default\"](particleContextContainer, lineContextContainer);\n    anim.animate();\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });