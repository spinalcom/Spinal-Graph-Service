"use strict";

Object.defineProperty( exports, "__esModule", {
  value: true
} );
Object.defineProperty( exports, "SPINAL_RELATION_TYPE", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SPINAL_RELATION_TYPE;
  }
} );
Object.defineProperty( exports, "SPINAL_RELATION_LST_PTR_TYPE", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SPINAL_RELATION_LST_PTR_TYPE;
  }
} );
Object.defineProperty( exports, "SPINAL_RELATION_PTR_LST_TYPE", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SPINAL_RELATION_PTR_LST_TYPE;
  }
} );
Object.defineProperty( exports, "SpinalContext", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SpinalContext;
  }
} );
Object.defineProperty( exports, "SpinalNode", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SpinalNode;
  }
} );
Object.defineProperty( exports, "SpinalGraph", {
  enumerable: true,
  get: function get() {
    return _spinalModelGraph.SpinalGraph;
  }
} );
exports.SpinalGraphService = void 0;

var _GraphManagerService = _interopRequireDefault( require( "./GraphManagerService" ) );

var _spinalModelGraph = require( "spinal-model-graph" );

function _interopRequireDefault( obj ) { return obj && obj.__esModule ? obj : { default: obj }; }

const G_root = typeof window == "undefined" ? global : window;
if (typeof G_root.spinal === "undefined") G_root.spinal = {};

if (typeof G_root.spinal.spinalGraphService === "undefined") {
  if (typeof G_root.spinal.spinalSystem !== "undefined") {
    G_root.spinal.spinalGraphService = new _GraphManagerService.default( 1 );
  } else {
    G_root.spinal.spinalGraphService = new _GraphManagerService.default();
  }
}

const SpinalGraphService = G_root.spinal.spinalGraphService;
exports.SpinalGraphService = SpinalGraphService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJHX3Jvb3QiLCJ3aW5kb3ciLCJnbG9iYWwiLCJzcGluYWwiLCJzcGluYWxHcmFwaFNlcnZpY2UiLCJzcGluYWxTeXN0ZW0iLCJTcGluYWxHcmFwaFNlcnZpY2VDbGFzcyIsIlNwaW5hbEdyYXBoU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0FBU0EsTUFBTUEsTUFBTSxHQUFHLE9BQU9DLE1BQVAsSUFBaUIsV0FBakIsR0FBK0JDLE1BQS9CLEdBQXdDRCxNQUF2RDtBQUVBLElBQUksT0FBT0QsTUFBTSxDQUFDRyxNQUFkLEtBQXlCLFdBQTdCLEVBQTBDSCxNQUFNLENBQUNHLE1BQVAsR0FBZ0IsRUFBaEI7O0FBQzFDLElBQUksT0FBT0gsTUFBTSxDQUFDRyxNQUFQLENBQWNDLGtCQUFyQixLQUE0QyxXQUFoRCxFQUE2RDtBQUMzRCxNQUFJLE9BQU9KLE1BQU0sQ0FBQ0csTUFBUCxDQUFjRSxZQUFyQixLQUFzQyxXQUExQyxFQUF1RDtBQUNyREwsSUFBQUEsTUFBTSxDQUFDRyxNQUFQLENBQWNDLGtCQUFkLEdBQW1DLElBQUlFLDRCQUFKLENBQTRCLENBQTVCLENBQW5DO0FBQ0QsR0FGRCxNQUVPO0FBQ0xOLElBQUFBLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxrQkFBZCxHQUFtQyxJQUFJRSw0QkFBSixFQUFuQztBQUNEO0FBQ0Y7O0FBR0QsTUFBTUMsa0JBQWtCLEdBQUdQLE1BQU0sQ0FBQ0csTUFBUCxDQUFjQyxrQkFBekMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3BpbmFsR3JhcGhTZXJ2aWNlQ2xhc3MgZnJvbSBcIi4vR3JhcGhNYW5hZ2VyU2VydmljZVwiO1xuXG5leHBvcnQge1xuICBTUElOQUxfUkVMQVRJT05fVFlQRSxcbiAgU1BJTkFMX1JFTEFUSU9OX0xTVF9QVFJfVFlQRSxcbiAgU1BJTkFMX1JFTEFUSU9OX1BUUl9MU1RfVFlQRSxcbiAgU3BpbmFsQ29udGV4dCxcbiAgU3BpbmFsTm9kZSxcbiAgU3BpbmFsR3JhcGhcbn1cbiAgZnJvbSAnc3BpbmFsLW1vZGVsLWdyYXBoJztcbmNvbnN0IEdfcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdztcblxuaWYgKHR5cGVvZiBHX3Jvb3Quc3BpbmFsID09PSBcInVuZGVmaW5lZFwiKSBHX3Jvb3Quc3BpbmFsID0ge307XG5pZiAodHlwZW9mIEdfcm9vdC5zcGluYWwuc3BpbmFsR3JhcGhTZXJ2aWNlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIGlmICh0eXBlb2YgR19yb290LnNwaW5hbC5zcGluYWxTeXN0ZW0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbEdyYXBoU2VydmljZSA9IG5ldyBTcGluYWxHcmFwaFNlcnZpY2VDbGFzcygxKTtcbiAgfSBlbHNlIHtcbiAgICBHX3Jvb3Quc3BpbmFsLnNwaW5hbEdyYXBoU2VydmljZSA9IG5ldyBTcGluYWxHcmFwaFNlcnZpY2VDbGFzcygpO1xuICB9XG59XG5cblxuY29uc3QgU3BpbmFsR3JhcGhTZXJ2aWNlID0gR19yb290LnNwaW5hbC5zcGluYWxHcmFwaFNlcnZpY2U7XG5leHBvcnQge1xuICBTcGluYWxHcmFwaFNlcnZpY2Vcbn07XG4iXX0=