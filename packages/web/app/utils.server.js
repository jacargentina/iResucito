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
exports.__esModule = true;
exports.mailSender = exports.saveLocalePatch = exports.readLocalePatch = exports.getdb = exports.dataPath = exports.folderSongs = void 0;
var path = require("path");
var fs = require("fs");
var core_1 = require("@iresucito/core");
var gmail_send_1 = require("gmail-send");
var NodeReader = function (path) {
    return fs.promises.readFile(path, 'utf8');
};
var NodeWriter = function (path, content, encoding) {
    return fs.promises.writeFile(path, content, encoding);
};
var NodeExists = function (path) {
    return Promise.resolve(fs.existsSync(path));
};
var NodeLister = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.promises.readdir(path)];
            case 1:
                files = _a.sent();
                return [2 /*return*/, files.map(function (file) {
                        return { name: file };
                    })];
        }
    });
}); };
var folderExtras = new SongsExtras('./data', NodeExists, NodeWriter, NodeReader, fs.promises.unlink);
exports.folderSongs = new core_1.SongsProcessor('./public/build/_assets/songs', NodeLister, NodeReader);
var db = null;
exports.dataPath = path.resolve('./data');
var getdb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var lowdb, LowSync, JSONFileSync;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!db) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.resolve().then(function () { return require('lowdb'); })];
            case 1:
                lowdb = _a.sent();
                LowSync = lowdb.LowSync, JSONFileSync = lowdb.JSONFileSync;
                db = new LowSync(new JSONFileSync(path.join(exports.dataPath, 'db.json')));
                db.data = db.data || { users: [], tokens: [] };
                _a.label = 2;
            case 2: return [2 /*return*/, db];
        }
    });
}); };
exports.getdb = getdb;
function readLocalePatch() {
    return __awaiter(this, void 0, void 0, function () {
        var exists, patchJSON;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, folderExtras.patchExists()];
                case 1:
                    exists = _a.sent();
                    if (!exists) return [3 /*break*/, 3];
                    return [4 /*yield*/, folderExtras.readPatch()];
                case 2:
                    patchJSON = _a.sent();
                    return [2 /*return*/, JSON.parse(patchJSON)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readLocalePatch = readLocalePatch;
function saveLocalePatch(patchObj) {
    return __awaiter(this, void 0, void 0, function () {
        var json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    json = JSON.stringify(patchObj, null, ' ');
                    return [4 /*yield*/, folderExtras.savePatch(json)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveLocalePatch = saveLocalePatch;
exports.mailSender = (0, gmail_send_1["default"])({
    user: 'javier.alejandro.castro@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
    subject: 'iResucito Web'
});
