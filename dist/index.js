"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var debug_1 = __importDefault(require("debug"));
var morgan_1 = __importDefault(require("morgan"));
var express_session_1 = __importDefault(require("express-session"));
var cuid_1 = __importDefault(require("cuid"));
var memorystore_1 = __importDefault(require("memorystore"));
var socket_io_1 = require("socket.io");
var child_process_1 = require("child_process");
var nedb_promises_1 = __importDefault(require("nedb-promises"));
var _a = process.env, SERVER_PORT = _a.SERVER_PORT, NODE_ENV = _a.NODE_ENV;
var isDev = NODE_ENV === 'development';
var publicFolder = path_1.default.normalize(path_1.default.join(__dirname, '../public/'));
var CWD = path_1.default.normalize(path_1.default.join(__dirname, '../'));
var debug = debug_1.default('socket');
var MemoryStore = memorystore_1.default(express_session_1.default);
var DB = nedb_promises_1.default.create({
    autoload: true,
    filename: path_1.default.join(CWD, 'data.db'),
});
function boot() {
    return __awaiter(this, void 0, void 0, function () {
        var app, serverUrl, server, io;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug('Initializing server...');
                    app = express_1.default();
                    serverUrl = child_process_1.execSync('gp url 3000').toString().trim();
                    server = http_1.default.createServer(app);
                    io = new socket_io_1.Server(server, {
                        cors: {
                            origin: [serverUrl, 'https://admin.socket.io'],
                        },
                    });
                    // await DB.load();
                    return [4 /*yield*/, DB.remove({}, {
                            multi: true,
                        })];
                case 1:
                    // await DB.load();
                    _a.sent();
                    DB.ensureIndex({
                        fieldName: 'socketId',
                        unique: true,
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return server.listen(SERVER_PORT, resolve); })];
                case 2:
                    _a.sent();
                    debug('Server listening at %s', SERVER_PORT);
                    io.on('connection', function (socket) {
                        var user = {
                            socketId: socket.id,
                            username: '',
                        };
                        DB.insert(user)
                            .then(function (_user) {
                            user._id = _user._id;
                            debug('Connected: %s', socket.id);
                        })
                            .catch(function () { });
                        socket.on('SET:username', function (username) {
                            user.username = username;
                            DB.update({ _id: user._id }, { username: username }).then(function () {
                                // debug('SET username %s for: %s', username, socket.id);
                            });
                        });
                        socket.on('SET:room', function (id, cb) {
                            socket.join(id);
                            debug('%s joined room: %s', user.username || socket.id);
                            if (cb)
                                cb();
                        });
                        socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
                            var s;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, DB.remove({ _id: user._id }, {})];
                                    case 1:
                                        s = _a.sent();
                                        debug('Disconnected: %s', socket.id);
                                        debug('Removed %s users!', s);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    return [2 /*return*/, { app: app, server: server, io: io }];
            }
        });
    });
}
boot()
    .then(function (_a) {
    var app = _a.app, io = _a.io;
    app.use(morgan_1.default(isDev ? 'dev' : 'common', {
        stream: {
            write: function (msg) { return debug(msg.trimEnd()); },
        },
        skip: function (req) {
            if (req.url.match('/socket.io')) {
                return true;
            }
            return false;
        },
    }));
    app.use(express_session_1.default({
        secret: 'socket-test',
        resave: true,
        saveUninitialized: true,
        genid: function () { return cuid_1.default(); },
        cookie: {
            httpOnly: false,
            path: '/',
            sameSite: true,
            maxAge: 1000 * 60 * 60,
        },
        store: new MemoryStore({
            checkPeriod: 1000 * 60 * 60 * 2,
        }),
    }));
    app.use(express_1.default.static(publicFolder));
    app.get('/', function (req, res) {
        res.send('Hello World');
    });
})
    .catch(console.log);
//# sourceMappingURL=index.js.map