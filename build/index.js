"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SPINAL_RELATION_TYPE", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SPINAL_RELATION_TYPE;
  }
});
Object.defineProperty(exports, "SPINAL_RELATION_LST_PTR_TYPE", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SPINAL_RELATION_LST_PTR_TYPE;
  }
});
Object.defineProperty(exports, "SPINAL_RELATION_PTR_LST_TYPE", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SPINAL_RELATION_PTR_LST_TYPE;
  }
});
Object.defineProperty(exports, "SpinalContext", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SpinalContext;
  }
});
Object.defineProperty(exports, "SpinalNode", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SpinalNode;
  }
});
Object.defineProperty(exports, "SpinalGraph", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SpinalGraph;
  }
});
exports.SpinalGraphOrganService = exports.SpinalGraphService = void 0;

var _GraphManagerService = _interopRequireDefault(require("./GraphManagerService"));

var _spinalModelGraph = require("spinal-model-graph");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const G_root = typeof window == "undefined" ? global : window;
if (typeof G_root.spinal === "undefined") G_root.spinal = {};

if (typeof G_root.spinal.spinalGraphService === "undefined") {
  G_root.spinal.spinalGraphService = new _GraphManagerService.default(1);
  G_root.spinal.spinalGraphOrganService = new _GraphManagerService.default();
}

const SpinalGraphService = G_root.spinal.spinalGraphService;
exports.SpinalGraphService = SpinalGraphService;
const SpinalGraphOrganService = G_root.spinal.spinalGraphOrganService;
exports.SpinalGraphOrganService = SpinalGraphOrganService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJHX3Jvb3QiLCJ3aW5kb3ciLCJnbG9iYWwiLCJzcGluYWwiLCJzcGluYWxHcmFwaFNlcnZpY2UiLCJTcGluYWxHcmFwaFNlcnZpY2VDbGFzcyIsInNwaW5hbEdyYXBoT3JnYW5TZXJ2aWNlIiwiU3BpbmFsR3JhcGhTZXJ2aWNlIiwiU3BpbmFsR3JhcGhPcmdhblNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7OztBQVFBLE1BQU1BLE1BQU0sR0FBRyxPQUFPQyxNQUFQLElBQWlCLFdBQWpCLEdBQStCQyxNQUEvQixHQUF3Q0QsTUFBdkQ7QUFFQSxJQUFJLE9BQU9ELE1BQU0sQ0FBQ0csTUFBZCxLQUF5QixXQUE3QixFQUEwQ0gsTUFBTSxDQUFDRyxNQUFQLEdBQWdCLEVBQWhCOztBQUMxQyxJQUFJLE9BQU9ILE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxrQkFBckIsS0FBNEMsV0FBaEQsRUFBNkQ7QUFDM0RKLEVBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxrQkFBZCxHQUFtQyxJQUFJQyw0QkFBSixDQUE2QixDQUE3QixDQUFuQztBQUNBTCxFQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY0csdUJBQWQsR0FBd0MsSUFBSUQsNEJBQUosRUFBeEM7QUFDRDs7QUFHRCxNQUFNRSxrQkFBa0IsR0FBR1AsTUFBTSxDQUFDRyxNQUFQLENBQWNDLGtCQUF6Qzs7QUFDQSxNQUFNSSx1QkFBdUIsR0FBR1IsTUFBTSxDQUFDRyxNQUFQLENBQWNHLHVCQUE5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTcGluYWxHcmFwaFNlcnZpY2VDbGFzcyBmcm9tIFwiLi9HcmFwaE1hbmFnZXJTZXJ2aWNlXCI7XG5cbmV4cG9ydCB7XG4gIFNQSU5BTF9SRUxBVElPTl9UWVBFLFxuICBTUElOQUxfUkVMQVRJT05fTFNUX1BUUl9UWVBFLFxuICBTUElOQUxfUkVMQVRJT05fUFRSX0xTVF9UWVBFLFxuICBTcGluYWxDb250ZXh0LFxuICBTcGluYWxOb2RlLFxuICBTcGluYWxHcmFwaFxufSBmcm9tICdzcGluYWwtbW9kZWwtZ3JhcGgnO1xuY29uc3QgR19yb290ID0gdHlwZW9mIHdpbmRvdyA9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogd2luZG93O1xuXG5pZiAodHlwZW9mIEdfcm9vdC5zcGluYWwgPT09IFwidW5kZWZpbmVkXCIpIEdfcm9vdC5zcGluYWwgPSB7fTtcbmlmICh0eXBlb2YgR19yb290LnNwaW5hbC5zcGluYWxHcmFwaFNlcnZpY2UgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgR19yb290LnNwaW5hbC5zcGluYWxHcmFwaFNlcnZpY2UgPSBuZXcgU3BpbmFsR3JhcGhTZXJ2aWNlQ2xhc3MoIDEgKTtcbiAgR19yb290LnNwaW5hbC5zcGluYWxHcmFwaE9yZ2FuU2VydmljZSA9IG5ldyBTcGluYWxHcmFwaFNlcnZpY2VDbGFzcygpO1xufVxuXG5cbmNvbnN0IFNwaW5hbEdyYXBoU2VydmljZSA9IEdfcm9vdC5zcGluYWwuc3BpbmFsR3JhcGhTZXJ2aWNlO1xuY29uc3QgU3BpbmFsR3JhcGhPcmdhblNlcnZpY2UgPSBHX3Jvb3Quc3BpbmFsLnNwaW5hbEdyYXBoT3JnYW5TZXJ2aWNlO1xuZXhwb3J0IHtcbiAgU3BpbmFsR3JhcGhTZXJ2aWNlLFxuICBTcGluYWxHcmFwaE9yZ2FuU2VydmljZVxufTsiXX0=