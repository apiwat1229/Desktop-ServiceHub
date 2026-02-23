import cu, { app as Vr, BrowserWindow as Ur, ipcMain as Ve } from "electron";
import zo from "node:fs";
import lu from "node:os";
import It from "node:path";
import Xt from "path";
import oc from "util";
import zs from "fs";
import uu from "crypto";
import du from "assert";
import fu from "events";
import hu from "os";
var Yr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function mu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var gs = { exports: {} }, pu = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
};
const Mt = pu, yu = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), $u = (e) => !e.some((t) => yu.has(t));
function Qr(e) {
  const t = e.split("."), r = [];
  for (let n = 0; n < t.length; n++) {
    let s = t[n];
    for (; s[s.length - 1] === "\\" && t[n + 1] !== void 0; )
      s = s.slice(0, -1) + ".", s += t[++n];
    r.push(s);
  }
  return $u(r) ? r : [];
}
var _u = {
  get(e, t, r) {
    if (!Mt(e) || typeof t != "string")
      return r === void 0 ? e : r;
    const n = Qr(t);
    if (n.length !== 0) {
      for (let s = 0; s < n.length; s++)
        if (e = e[n[s]], e == null) {
          if (s !== n.length - 1)
            return r;
          break;
        }
      return e === void 0 ? r : e;
    }
  },
  set(e, t, r) {
    if (!Mt(e) || typeof t != "string")
      return e;
    const n = e, s = Qr(t);
    for (let a = 0; a < s.length; a++) {
      const i = s[a];
      Mt(e[i]) || (e[i] = {}), a === s.length - 1 && (e[i] = r), e = e[i];
    }
    return n;
  },
  delete(e, t) {
    if (!Mt(e) || typeof t != "string")
      return !1;
    const r = Qr(t);
    for (let n = 0; n < r.length; n++) {
      const s = r[n];
      if (n === r.length - 1)
        return delete e[s], !0;
      if (e = e[s], !Mt(e))
        return !1;
    }
  },
  has(e, t) {
    if (!Mt(e) || typeof t != "string")
      return !1;
    const r = Qr(t);
    if (r.length === 0)
      return !1;
    for (let n = 0; n < r.length; n++)
      if (Mt(e)) {
        if (!(r[n] in e))
          return !1;
        e = e[r[n]];
      } else
        return !1;
    return !0;
  }
}, qs = { exports: {} }, Ks = { exports: {} }, Gs = { exports: {} }, Hs = { exports: {} };
const ic = zs;
Hs.exports = (e) => new Promise((t) => {
  ic.access(e, (r) => {
    t(!r);
  });
});
Hs.exports.sync = (e) => {
  try {
    return ic.accessSync(e), !0;
  } catch {
    return !1;
  }
};
var gu = Hs.exports, Bs = { exports: {} }, Ws = { exports: {} };
const cc = (e, ...t) => new Promise((r) => {
  r(e(...t));
});
Ws.exports = cc;
Ws.exports.default = cc;
var vu = Ws.exports;
const wu = vu, lc = (e) => {
  if (!((Number.isInteger(e) || e === 1 / 0) && e > 0))
    return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
  const t = [];
  let r = 0;
  const n = () => {
    r--, t.length > 0 && t.shift()();
  }, s = (l, c, ...d) => {
    r++;
    const u = wu(l, ...d);
    c(u), u.then(n, n);
  }, a = (l, c, ...d) => {
    r < e ? s(l, c, ...d) : t.push(s.bind(null, l, c, ...d));
  }, i = (l, ...c) => new Promise((d) => a(l, d, ...c));
  return Object.defineProperties(i, {
    activeCount: {
      get: () => r
    },
    pendingCount: {
      get: () => t.length
    },
    clearQueue: {
      value: () => {
        t.length = 0;
      }
    }
  }), i;
};
Bs.exports = lc;
Bs.exports.default = lc;
var Eu = Bs.exports;
const qo = Eu;
class uc extends Error {
  constructor(t) {
    super(), this.value = t;
  }
}
const Su = (e, t) => Promise.resolve(e).then(t), bu = (e) => Promise.all(e).then((t) => t[1] === !0 && Promise.reject(new uc(t[0])));
var Pu = (e, t, r) => {
  r = Object.assign({
    concurrency: 1 / 0,
    preserveOrder: !0
  }, r);
  const n = qo(r.concurrency), s = [...e].map((i) => [i, n(Su, i, t)]), a = qo(r.preserveOrder ? 1 : 1 / 0);
  return Promise.all(s.map((i) => a(bu, i))).then(() => {
  }).catch((i) => i instanceof uc ? i.value : Promise.reject(i));
};
const dc = Xt, fc = gu, Nu = Pu;
Gs.exports = (e, t) => (t = Object.assign({
  cwd: process.cwd()
}, t), Nu(e, (r) => fc(dc.resolve(t.cwd, r)), t));
Gs.exports.sync = (e, t) => {
  t = Object.assign({
    cwd: process.cwd()
  }, t);
  for (const r of e)
    if (fc.sync(dc.resolve(t.cwd, r)))
      return r;
};
var Ou = Gs.exports;
const Nt = Xt, hc = Ou;
Ks.exports = (e, t = {}) => {
  const r = Nt.resolve(t.cwd || ""), { root: n } = Nt.parse(r), s = [].concat(e);
  return new Promise((a) => {
    (function i(l) {
      hc(s, { cwd: l }).then((c) => {
        c ? a(Nt.join(l, c)) : l === n ? a(null) : i(Nt.dirname(l));
      });
    })(r);
  });
};
Ks.exports.sync = (e, t = {}) => {
  let r = Nt.resolve(t.cwd || "");
  const { root: n } = Nt.parse(r), s = [].concat(e);
  for (; ; ) {
    const a = hc.sync(s, { cwd: r });
    if (a)
      return Nt.join(r, a);
    if (r === n)
      return null;
    r = Nt.dirname(r);
  }
};
var Ru = Ks.exports;
const mc = Ru;
qs.exports = async ({ cwd: e } = {}) => mc("package.json", { cwd: e });
qs.exports.sync = ({ cwd: e } = {}) => mc.sync("package.json", { cwd: e });
var Tu = qs.exports, Js = { exports: {} };
const _e = Xt, pc = hu, bt = pc.homedir(), Xs = pc.tmpdir(), { env: tr } = process, Iu = (e) => {
  const t = _e.join(bt, "Library");
  return {
    data: _e.join(t, "Application Support", e),
    config: _e.join(t, "Preferences", e),
    cache: _e.join(t, "Caches", e),
    log: _e.join(t, "Logs", e),
    temp: _e.join(Xs, e)
  };
}, ju = (e) => {
  const t = tr.APPDATA || _e.join(bt, "AppData", "Roaming"), r = tr.LOCALAPPDATA || _e.join(bt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: _e.join(r, e, "Data"),
    config: _e.join(t, e, "Config"),
    cache: _e.join(r, e, "Cache"),
    log: _e.join(r, e, "Log"),
    temp: _e.join(Xs, e)
  };
}, Au = (e) => {
  const t = _e.basename(bt);
  return {
    data: _e.join(tr.XDG_DATA_HOME || _e.join(bt, ".local", "share"), e),
    config: _e.join(tr.XDG_CONFIG_HOME || _e.join(bt, ".config"), e),
    cache: _e.join(tr.XDG_CACHE_HOME || _e.join(bt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: _e.join(tr.XDG_STATE_HOME || _e.join(bt, ".local", "state"), e),
    temp: _e.join(Xs, t, e)
  };
}, yc = (e, t) => {
  if (typeof e != "string")
    throw new TypeError(`Expected string, got ${typeof e}`);
  return t = Object.assign({ suffix: "nodejs" }, t), t.suffix && (e += `-${t.suffix}`), process.platform === "darwin" ? Iu(e) : process.platform === "win32" ? ju(e) : Au(e);
};
Js.exports = yc;
Js.exports.default = yc;
var ku = Js.exports, ut = {}, de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.NOOP = de.LIMIT_FILES_DESCRIPTORS = de.LIMIT_BASENAME_LENGTH = de.IS_USER_ROOT = de.IS_POSIX = de.DEFAULT_TIMEOUT_SYNC = de.DEFAULT_TIMEOUT_ASYNC = de.DEFAULT_WRITE_OPTIONS = de.DEFAULT_READ_OPTIONS = de.DEFAULT_FOLDER_MODE = de.DEFAULT_FILE_MODE = de.DEFAULT_ENCODING = void 0;
const Cu = "utf8";
de.DEFAULT_ENCODING = Cu;
const Du = 438;
de.DEFAULT_FILE_MODE = Du;
const Mu = 511;
de.DEFAULT_FOLDER_MODE = Mu;
const Lu = {};
de.DEFAULT_READ_OPTIONS = Lu;
const Fu = {};
de.DEFAULT_WRITE_OPTIONS = Fu;
const Vu = 5e3;
de.DEFAULT_TIMEOUT_ASYNC = Vu;
const Uu = 100;
de.DEFAULT_TIMEOUT_SYNC = Uu;
const zu = !!process.getuid;
de.IS_POSIX = zu;
const qu = process.getuid ? !process.getuid() : !1;
de.IS_USER_ROOT = qu;
const Ku = 128;
de.LIMIT_BASENAME_LENGTH = Ku;
const Gu = 1e4;
de.LIMIT_FILES_DESCRIPTORS = Gu;
const Hu = () => {
};
de.NOOP = Hu;
var Ln = {}, cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.attemptifySync = cr.attemptifyAsync = void 0;
const $c = de, Bu = (e, t = $c.NOOP) => function() {
  return e.apply(void 0, arguments).catch(t);
};
cr.attemptifyAsync = Bu;
const Wu = (e, t = $c.NOOP) => function() {
  try {
    return e.apply(void 0, arguments);
  } catch (r) {
    return t(r);
  }
};
cr.attemptifySync = Wu;
var Ys = {};
Object.defineProperty(Ys, "__esModule", { value: !0 });
const Ju = de, _c = {
  isChangeErrorOk: (e) => {
    const { code: t } = e;
    return t === "ENOSYS" || !Ju.IS_USER_ROOT && (t === "EINVAL" || t === "EPERM");
  },
  isRetriableError: (e) => {
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!_c.isChangeErrorOk(e))
      throw e;
  }
};
Ys.default = _c;
var lr = {}, Qs = {};
Object.defineProperty(Qs, "__esModule", { value: !0 });
const Xu = de, pe = {
  interval: 25,
  intervalId: void 0,
  limit: Xu.LIMIT_FILES_DESCRIPTORS,
  queueActive: /* @__PURE__ */ new Set(),
  queueWaiting: /* @__PURE__ */ new Set(),
  init: () => {
    pe.intervalId || (pe.intervalId = setInterval(pe.tick, pe.interval));
  },
  reset: () => {
    pe.intervalId && (clearInterval(pe.intervalId), delete pe.intervalId);
  },
  add: (e) => {
    pe.queueWaiting.add(e), pe.queueActive.size < pe.limit / 2 ? pe.tick() : pe.init();
  },
  remove: (e) => {
    pe.queueWaiting.delete(e), pe.queueActive.delete(e);
  },
  schedule: () => new Promise((e) => {
    const t = () => pe.remove(r), r = () => e(t);
    pe.add(r);
  }),
  tick: () => {
    if (!(pe.queueActive.size >= pe.limit)) {
      if (!pe.queueWaiting.size)
        return pe.reset();
      for (const e of pe.queueWaiting) {
        if (pe.queueActive.size >= pe.limit)
          break;
        pe.queueWaiting.delete(e), pe.queueActive.add(e), e();
      }
    }
  }
};
Qs.default = pe;
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.retryifySync = lr.retryifyAsync = void 0;
const Yu = Qs, Qu = (e, t) => function(r) {
  return function n() {
    return Yu.default.schedule().then((s) => e.apply(void 0, arguments).then((a) => (s(), a), (a) => {
      if (s(), Date.now() >= r)
        throw a;
      if (t(a)) {
        const i = Math.round(100 + 400 * Math.random());
        return new Promise((c) => setTimeout(c, i)).then(() => n.apply(void 0, arguments));
      }
      throw a;
    }));
  };
};
lr.retryifyAsync = Qu;
const Zu = (e, t) => function(r) {
  return function n() {
    try {
      return e.apply(void 0, arguments);
    } catch (s) {
      if (Date.now() > r)
        throw s;
      if (t(s))
        return n.apply(void 0, arguments);
      throw s;
    }
  };
};
lr.retryifySync = Zu;
Object.defineProperty(Ln, "__esModule", { value: !0 });
const fe = zs, Me = oc, Le = cr, Oe = Ys, ze = lr, xu = {
  chmodAttempt: Le.attemptifyAsync(Me.promisify(fe.chmod), Oe.default.onChangeError),
  chownAttempt: Le.attemptifyAsync(Me.promisify(fe.chown), Oe.default.onChangeError),
  closeAttempt: Le.attemptifyAsync(Me.promisify(fe.close)),
  fsyncAttempt: Le.attemptifyAsync(Me.promisify(fe.fsync)),
  mkdirAttempt: Le.attemptifyAsync(Me.promisify(fe.mkdir)),
  realpathAttempt: Le.attemptifyAsync(Me.promisify(fe.realpath)),
  statAttempt: Le.attemptifyAsync(Me.promisify(fe.stat)),
  unlinkAttempt: Le.attemptifyAsync(Me.promisify(fe.unlink)),
  closeRetry: ze.retryifyAsync(Me.promisify(fe.close), Oe.default.isRetriableError),
  fsyncRetry: ze.retryifyAsync(Me.promisify(fe.fsync), Oe.default.isRetriableError),
  openRetry: ze.retryifyAsync(Me.promisify(fe.open), Oe.default.isRetriableError),
  readFileRetry: ze.retryifyAsync(Me.promisify(fe.readFile), Oe.default.isRetriableError),
  renameRetry: ze.retryifyAsync(Me.promisify(fe.rename), Oe.default.isRetriableError),
  statRetry: ze.retryifyAsync(Me.promisify(fe.stat), Oe.default.isRetriableError),
  writeRetry: ze.retryifyAsync(Me.promisify(fe.write), Oe.default.isRetriableError),
  chmodSyncAttempt: Le.attemptifySync(fe.chmodSync, Oe.default.onChangeError),
  chownSyncAttempt: Le.attemptifySync(fe.chownSync, Oe.default.onChangeError),
  closeSyncAttempt: Le.attemptifySync(fe.closeSync),
  mkdirSyncAttempt: Le.attemptifySync(fe.mkdirSync),
  realpathSyncAttempt: Le.attemptifySync(fe.realpathSync),
  statSyncAttempt: Le.attemptifySync(fe.statSync),
  unlinkSyncAttempt: Le.attemptifySync(fe.unlinkSync),
  closeSyncRetry: ze.retryifySync(fe.closeSync, Oe.default.isRetriableError),
  fsyncSyncRetry: ze.retryifySync(fe.fsyncSync, Oe.default.isRetriableError),
  openSyncRetry: ze.retryifySync(fe.openSync, Oe.default.isRetriableError),
  readFileSyncRetry: ze.retryifySync(fe.readFileSync, Oe.default.isRetriableError),
  renameSyncRetry: ze.retryifySync(fe.renameSync, Oe.default.isRetriableError),
  statSyncRetry: ze.retryifySync(fe.statSync, Oe.default.isRetriableError),
  writeSyncRetry: ze.retryifySync(fe.writeSync, Oe.default.isRetriableError)
};
Ln.default = xu;
var Zs = {};
Object.defineProperty(Zs, "__esModule", { value: !0 });
const ed = {
  isFunction: (e) => typeof e == "function",
  isString: (e) => typeof e == "string",
  isUndefined: (e) => typeof e > "u"
};
Zs.default = ed;
var xs = {};
Object.defineProperty(xs, "__esModule", { value: !0 });
const Zr = {}, vs = {
  next: (e) => {
    const t = Zr[e];
    if (!t)
      return;
    t.shift();
    const r = t[0];
    r ? r(() => vs.next(e)) : delete Zr[e];
  },
  schedule: (e) => new Promise((t) => {
    let r = Zr[e];
    r || (r = Zr[e] = []), r.push(t), !(r.length > 1) && t(() => vs.next(e));
  })
};
xs.default = vs;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const td = Xt, Ko = de, Go = Ln, Be = {
  store: {},
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), r = Date.now().toString().slice(-10), n = "tmp-", s = `.${n}${r}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Be.truncate(t(e));
    return n in Be.store ? Be.get(e, t, r) : (Be.store[n] = r, [n, () => delete Be.store[n]]);
  },
  purge: (e) => {
    Be.store[e] && (delete Be.store[e], Go.default.unlinkAttempt(e));
  },
  purgeSync: (e) => {
    Be.store[e] && (delete Be.store[e], Go.default.unlinkSyncAttempt(e));
  },
  purgeSyncAll: () => {
    for (const e in Be.store)
      Be.purgeSync(e);
  },
  truncate: (e) => {
    const t = td.basename(e);
    if (t.length <= Ko.LIMIT_BASENAME_LENGTH)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Ko.LIMIT_BASENAME_LENGTH;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
process.on("exit", Be.purgeSyncAll);
ea.default = Be;
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.writeFileSync = ut.writeFile = ut.readFileSync = ut.readFile = void 0;
const gc = Xt, Ie = de, ue = Ln, We = Zs, rd = xs, Ot = ea;
function vc(e, t = Ie.DEFAULT_READ_OPTIONS) {
  var r;
  if (We.default.isString(t))
    return vc(e, { encoding: t });
  const n = Date.now() + ((r = t.timeout) !== null && r !== void 0 ? r : Ie.DEFAULT_TIMEOUT_ASYNC);
  return ue.default.readFileRetry(n)(e, t);
}
ut.readFile = vc;
function wc(e, t = Ie.DEFAULT_READ_OPTIONS) {
  var r;
  if (We.default.isString(t))
    return wc(e, { encoding: t });
  const n = Date.now() + ((r = t.timeout) !== null && r !== void 0 ? r : Ie.DEFAULT_TIMEOUT_SYNC);
  return ue.default.readFileSyncRetry(n)(e, t);
}
ut.readFileSync = wc;
const Ec = (e, t, r, n) => {
  if (We.default.isFunction(r))
    return Ec(e, t, Ie.DEFAULT_WRITE_OPTIONS, r);
  const s = Sc(e, t, r);
  return n && s.then(n, n), s;
};
ut.writeFile = Ec;
const Sc = async (e, t, r = Ie.DEFAULT_WRITE_OPTIONS) => {
  var n;
  if (We.default.isString(r))
    return Sc(e, t, { encoding: r });
  const s = Date.now() + ((n = r.timeout) !== null && n !== void 0 ? n : Ie.DEFAULT_TIMEOUT_ASYNC);
  let a = null, i = null, l = null, c = null, d = null;
  try {
    r.schedule && (a = await r.schedule(e)), i = await rd.default.schedule(e), e = await ue.default.realpathAttempt(e) || e, [c, l] = Ot.default.get(e, r.tmpCreate || Ot.default.create, r.tmpPurge !== !1);
    const u = Ie.IS_POSIX && We.default.isUndefined(r.chown), h = We.default.isUndefined(r.mode);
    if (u || h) {
      const y = await ue.default.statAttempt(e);
      y && (r = { ...r }, u && (r.chown = { uid: y.uid, gid: y.gid }), h && (r.mode = y.mode));
    }
    const S = gc.dirname(e);
    await ue.default.mkdirAttempt(S, {
      mode: Ie.DEFAULT_FOLDER_MODE,
      recursive: !0
    }), d = await ue.default.openRetry(s)(c, "w", r.mode || Ie.DEFAULT_FILE_MODE), r.tmpCreated && r.tmpCreated(c), We.default.isString(t) ? await ue.default.writeRetry(s)(d, t, 0, r.encoding || Ie.DEFAULT_ENCODING) : We.default.isUndefined(t) || await ue.default.writeRetry(s)(d, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? await ue.default.fsyncRetry(s)(d) : ue.default.fsyncAttempt(d)), await ue.default.closeRetry(s)(d), d = null, r.chown && await ue.default.chownAttempt(c, r.chown.uid, r.chown.gid), r.mode && await ue.default.chmodAttempt(c, r.mode);
    try {
      await ue.default.renameRetry(s)(c, e);
    } catch (y) {
      if (y.code !== "ENAMETOOLONG")
        throw y;
      await ue.default.renameRetry(s)(c, Ot.default.truncate(e));
    }
    l(), c = null;
  } finally {
    d && await ue.default.closeAttempt(d), c && Ot.default.purge(c), a && a(), i && i();
  }
}, bc = (e, t, r = Ie.DEFAULT_WRITE_OPTIONS) => {
  var n;
  if (We.default.isString(r))
    return bc(e, t, { encoding: r });
  const s = Date.now() + ((n = r.timeout) !== null && n !== void 0 ? n : Ie.DEFAULT_TIMEOUT_SYNC);
  let a = null, i = null, l = null;
  try {
    e = ue.default.realpathSyncAttempt(e) || e, [i, a] = Ot.default.get(e, r.tmpCreate || Ot.default.create, r.tmpPurge !== !1);
    const c = Ie.IS_POSIX && We.default.isUndefined(r.chown), d = We.default.isUndefined(r.mode);
    if (c || d) {
      const h = ue.default.statSyncAttempt(e);
      h && (r = { ...r }, c && (r.chown = { uid: h.uid, gid: h.gid }), d && (r.mode = h.mode));
    }
    const u = gc.dirname(e);
    ue.default.mkdirSyncAttempt(u, {
      mode: Ie.DEFAULT_FOLDER_MODE,
      recursive: !0
    }), l = ue.default.openSyncRetry(s)(i, "w", r.mode || Ie.DEFAULT_FILE_MODE), r.tmpCreated && r.tmpCreated(i), We.default.isString(t) ? ue.default.writeSyncRetry(s)(l, t, 0, r.encoding || Ie.DEFAULT_ENCODING) : We.default.isUndefined(t) || ue.default.writeSyncRetry(s)(l, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? ue.default.fsyncSyncRetry(s)(l) : ue.default.fsyncAttempt(l)), ue.default.closeSyncRetry(s)(l), l = null, r.chown && ue.default.chownSyncAttempt(i, r.chown.uid, r.chown.gid), r.mode && ue.default.chmodSyncAttempt(i, r.mode);
    try {
      ue.default.renameSyncRetry(s)(i, e);
    } catch (h) {
      if (h.code !== "ENAMETOOLONG")
        throw h;
      ue.default.renameSyncRetry(s)(i, Ot.default.truncate(e));
    }
    a(), i = null;
  } finally {
    l && ue.default.closeSyncAttempt(l), i && Ot.default.purge(i);
  }
};
ut.writeFileSync = bc;
var ws = { exports: {} }, Pc = {}, st = {}, ur = {}, Kr = {}, ie = {}, zr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...w) {
    const N = [m[0]];
    let R = 0;
    for (; R < w.length; )
      l(N, w[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function i(m, ...w) {
    const N = [y(m[0])];
    let R = 0;
    for (; R < w.length; )
      N.push(a), l(N, w[R]), N.push(a, y(m[++R]));
    return c(N), new n(N);
  }
  e.str = i;
  function l(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(h(w));
  }
  e.addCodeArg = l;
  function c(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === a) {
        const N = d(m[w - 1], m[w + 1]);
        if (N !== void 0) {
          m.splice(w - 1, 3, N);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function d(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function u(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : i`${m}${w}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
  }
  function S(m) {
    return new n(y(m));
  }
  e.stringify = S;
  function y(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = y;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = v;
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function _(m) {
    return new n(m.toString());
  }
  e.regexpCode = _;
})(zr);
var Es = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = zr;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const i = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? i : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const S = this.toName(d), { prefix: y } = S, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let g = this._values[y];
      if (g) {
        const w = g.get(v);
        if (w)
          return w;
      } else
        g = this._values[y] = /* @__PURE__ */ new Map();
      g.set(v, S);
      const _ = this._scope[y] || (this._scope[y] = []), m = _.length;
      return _[m] = u.ref, S.setValue(u, { property: y, itemIndex: m }), S;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (S) => {
        if (S.value === void 0)
          throw new Error(`CodeGen: name "${S}" has no value`);
        return S.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, S) {
      let y = t.nil;
      for (const v in d) {
        const g = d[v];
        if (!g)
          continue;
        const _ = h[v] = h[v] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
          if (_.has(m))
            return;
          _.set(m, n.Started);
          let w = u(m);
          if (w) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            y = (0, t._)`${y}${N} ${m} = ${w};${this.opts._n}`;
          } else if (w = S == null ? void 0 : S(m))
            y = (0, t._)`${y}${w}${this.opts._n}`;
          else
            throw new r(m);
          _.set(m, n.Completed);
        });
      }
      return y;
    }
  }
  e.ValueScope = l;
})(Es);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = zr, r = Es;
  var n = zr;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Es;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(o, f) {
      return this;
    }
  }
  class i extends a {
    constructor(o, f, P) {
      super(), this.varKind = o, this.name = f, this.rhs = P;
    }
    render({ es5: o, _n: f }) {
      const P = o ? r.varKinds.var : this.varKind, k = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${P} ${this.name}${k};` + f;
    }
    optimizeNames(o, f) {
      if (o[this.name.str])
        return this.rhs && (this.rhs = M(this.rhs, o, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(o, f, P) {
      super(), this.lhs = o, this.rhs = f, this.sideEffects = P;
    }
    render({ _n: o }) {
      return `${this.lhs} = ${this.rhs};` + o;
    }
    optimizeNames(o, f) {
      if (!(this.lhs instanceof t.Name && !o[this.lhs.str] && !this.sideEffects))
        return this.rhs = M(this.rhs, o, f), this;
    }
    get names() {
      const o = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ne(o, this.rhs);
    }
  }
  class c extends l {
    constructor(o, f, P, k) {
      super(o, P, k), this.op = f;
    }
    render({ _n: o }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + o;
    }
  }
  class d extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `${this.label}:` + o;
    }
  }
  class u extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `break${this.label ? ` ${this.label}` : ""};` + o;
    }
  }
  class h extends a {
    constructor(o) {
      super(), this.error = o;
    }
    render({ _n: o }) {
      return `throw ${this.error};` + o;
    }
    get names() {
      return this.error.names;
    }
  }
  class S extends a {
    constructor(o) {
      super(), this.code = o;
    }
    render({ _n: o }) {
      return `${this.code};` + o;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(o, f) {
      return this.code = M(this.code, o, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class y extends a {
    constructor(o = []) {
      super(), this.nodes = o;
    }
    render(o) {
      return this.nodes.reduce((f, P) => f + P.render(o), "");
    }
    optimizeNodes() {
      const { nodes: o } = this;
      let f = o.length;
      for (; f--; ) {
        const P = o[f].optimizeNodes();
        Array.isArray(P) ? o.splice(f, 1, ...P) : P ? o[f] = P : o.splice(f, 1);
      }
      return o.length > 0 ? this : void 0;
    }
    optimizeNames(o, f) {
      const { nodes: P } = this;
      let k = P.length;
      for (; k--; ) {
        const C = P[k];
        C.optimizeNames(o, f) || (L(o, C.names), P.splice(k, 1));
      }
      return P.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((o, f) => x(o, f.names), {});
    }
  }
  class v extends y {
    render(o) {
      return "{" + o._n + super.render(o) + "}" + o._n;
    }
  }
  class g extends y {
  }
  class _ extends v {
  }
  _.kind = "else";
  class m extends v {
    constructor(o, f) {
      super(f), this.condition = o;
    }
    render(o) {
      let f = `if(${this.condition})` + super.render(o);
      return this.else && (f += "else " + this.else.render(o)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const o = this.condition;
      if (o === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const P = f.optimizeNodes();
        f = this.else = Array.isArray(P) ? new _(P) : P;
      }
      if (f)
        return o === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(H(o), f instanceof m ? [f] : f.nodes);
      if (!(o === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(o, f) {
      var P;
      if (this.else = (P = this.else) === null || P === void 0 ? void 0 : P.optimizeNames(o, f), !!(super.optimizeNames(o, f) || this.else))
        return this.condition = M(this.condition, o, f), this;
    }
    get names() {
      const o = super.names;
      return ne(o, this.condition), this.else && x(o, this.else.names), o;
    }
  }
  m.kind = "if";
  class w extends v {
  }
  w.kind = "for";
  class N extends w {
    constructor(o) {
      super(), this.iteration = o;
    }
    render(o) {
      return `for(${this.iteration})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iteration = M(this.iteration, o, f), this;
    }
    get names() {
      return x(super.names, this.iteration.names);
    }
  }
  class R extends w {
    constructor(o, f, P, k) {
      super(), this.varKind = o, this.name = f, this.from = P, this.to = k;
    }
    render(o) {
      const f = o.es5 ? r.varKinds.var : this.varKind, { name: P, from: k, to: C } = this;
      return `for(${f} ${P}=${k}; ${P}<${C}; ${P}++)` + super.render(o);
    }
    get names() {
      const o = ne(super.names, this.from);
      return ne(o, this.to);
    }
  }
  class j extends w {
    constructor(o, f, P, k) {
      super(), this.loop = o, this.varKind = f, this.name = P, this.iterable = k;
    }
    render(o) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iterable = M(this.iterable, o, f), this;
    }
    get names() {
      return x(super.names, this.iterable.names);
    }
  }
  class q extends v {
    constructor(o, f, P) {
      super(), this.name = o, this.args = f, this.async = P;
    }
    render(o) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(o);
    }
  }
  q.kind = "func";
  class X extends y {
    render(o) {
      return "return " + super.render(o);
    }
  }
  X.kind = "return";
  class le extends v {
    render(o) {
      let f = "try" + super.render(o);
      return this.catch && (f += this.catch.render(o)), this.finally && (f += this.finally.render(o)), f;
    }
    optimizeNodes() {
      var o, f;
      return super.optimizeNodes(), (o = this.catch) === null || o === void 0 || o.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(o, f) {
      var P, k;
      return super.optimizeNames(o, f), (P = this.catch) === null || P === void 0 || P.optimizeNames(o, f), (k = this.finally) === null || k === void 0 || k.optimizeNames(o, f), this;
    }
    get names() {
      const o = super.names;
      return this.catch && x(o, this.catch.names), this.finally && x(o, this.finally.names), o;
    }
  }
  class K extends v {
    constructor(o) {
      super(), this.error = o;
    }
    render(o) {
      return `catch(${this.error})` + super.render(o);
    }
  }
  K.kind = "catch";
  class Q extends v {
    render(o) {
      return "finally" + super.render(o);
    }
  }
  Q.kind = "finally";
  class ce {
    constructor(o, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = o, this._scope = new r.Scope({ parent: o }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(o) {
      return this._scope.name(o);
    }
    // reserves unique name in the external scope
    scopeName(o) {
      return this._extScope.name(o);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(o, f) {
      const P = this._extScope.value(o, f);
      return (this._values[P.prefix] || (this._values[P.prefix] = /* @__PURE__ */ new Set())).add(P), P;
    }
    getScopeValue(o, f) {
      return this._extScope.getValue(o, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(o) {
      return this._extScope.scopeRefs(o, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(o, f, P, k) {
      const C = this._scope.toName(f);
      return P !== void 0 && k && (this._constants[C.str] = P), this._leafNode(new i(o, C, P)), C;
    }
    // `const` declaration (`var` in es5 mode)
    const(o, f, P) {
      return this._def(r.varKinds.const, o, f, P);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(o, f, P) {
      return this._def(r.varKinds.let, o, f, P);
    }
    // `var` declaration with optional assignment
    var(o, f, P) {
      return this._def(r.varKinds.var, o, f, P);
    }
    // assignment code
    assign(o, f, P) {
      return this._leafNode(new l(o, f, P));
    }
    // `+=` code
    add(o, f) {
      return this._leafNode(new c(o, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(o) {
      return typeof o == "function" ? o() : o !== t.nil && this._leafNode(new S(o)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...o) {
      const f = ["{"];
      for (const [P, k] of o)
        f.length > 1 && f.push(","), f.push(P), (P !== k || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, k));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(o, f, P) {
      if (this._blockNode(new m(o)), f && P)
        this.code(f).else().code(P).endIf();
      else if (f)
        this.code(f).endIf();
      else if (P)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(o) {
      return this._elseNode(new m(o));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, _);
    }
    _for(o, f) {
      return this._blockNode(o), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(o, f) {
      return this._for(new N(o), f);
    }
    // `for` statement for a range of values
    forRange(o, f, P, k, C = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const W = this._scope.toName(o);
      return this._for(new R(C, W, f, P), () => k(W));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(o, f, P, k = r.varKinds.const) {
      const C = this._scope.toName(o);
      if (this.opts.es5) {
        const W = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${W}.length`, (G) => {
          this.var(C, (0, t._)`${W}[${G}]`), P(C);
        });
      }
      return this._for(new j("of", k, C, f), () => P(C));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(o, f, P, k = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(o, (0, t._)`Object.keys(${f})`, P);
      const C = this._scope.toName(o);
      return this._for(new j("in", k, C, f), () => P(C));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(o) {
      return this._leafNode(new d(o));
    }
    // `break` statement
    break(o) {
      return this._leafNode(new u(o));
    }
    // `return` statement
    return(o) {
      const f = new X();
      if (this._blockNode(f), this.code(o), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(X);
    }
    // `try` statement
    try(o, f, P) {
      if (!f && !P)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const k = new le();
      if (this._blockNode(k), this.code(o), f) {
        const C = this.name("e");
        this._currNode = k.catch = new K(C), f(C);
      }
      return P && (this._currNode = k.finally = new Q(), this.code(P)), this._endBlockNode(K, Q);
    }
    // `throw` statement
    throw(o) {
      return this._leafNode(new h(o));
    }
    // start self-balancing block
    block(o, f) {
      return this._blockStarts.push(this._nodes.length), o && this.code(o).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(o) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const P = this._nodes.length - f;
      if (P < 0 || o !== void 0 && P !== o)
        throw new Error(`CodeGen: wrong number of nodes: ${P} vs ${o} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(o, f = t.nil, P, k) {
      return this._blockNode(new q(o, f, P)), k && this.code(k).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(q);
    }
    optimize(o = 1) {
      for (; o-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(o) {
      return this._currNode.nodes.push(o), this;
    }
    _blockNode(o) {
      this._currNode.nodes.push(o), this._nodes.push(o);
    }
    _endBlockNode(o, f) {
      const P = this._currNode;
      if (P instanceof o || f && P instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${o.kind}/${f.kind}` : o.kind}"`);
    }
    _elseNode(o) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = o, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const o = this._nodes;
      return o[o.length - 1];
    }
    set _currNode(o) {
      const f = this._nodes;
      f[f.length - 1] = o;
    }
  }
  e.CodeGen = ce;
  function x($, o) {
    for (const f in o)
      $[f] = ($[f] || 0) + (o[f] || 0);
    return $;
  }
  function ne($, o) {
    return o instanceof t._CodeOrName ? x($, o.names) : $;
  }
  function M($, o, f) {
    if ($ instanceof t.Name)
      return P($);
    if (!k($))
      return $;
    return new t._Code($._items.reduce((C, W) => (W instanceof t.Name && (W = P(W)), W instanceof t._Code ? C.push(...W._items) : C.push(W), C), []));
    function P(C) {
      const W = f[C.str];
      return W === void 0 || o[C.str] !== 1 ? C : (delete o[C.str], W);
    }
    function k(C) {
      return C instanceof t._Code && C._items.some((W) => W instanceof t.Name && o[W.str] === 1 && f[W.str] !== void 0);
    }
  }
  function L($, o) {
    for (const f in o)
      $[f] = ($[f] || 0) - (o[f] || 0);
  }
  function H($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${b($)}`;
  }
  e.not = H;
  const V = p(e.operators.AND);
  function I(...$) {
    return $.reduce(V);
  }
  e.and = I;
  const A = p(e.operators.OR);
  function E(...$) {
    return $.reduce(A);
  }
  e.or = E;
  function p($) {
    return (o, f) => o === t.nil ? f : f === t.nil ? o : (0, t._)`${b(o)} ${$} ${b(f)}`;
  }
  function b($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(ie);
var U = {};
Object.defineProperty(U, "__esModule", { value: !0 });
U.checkStrictMode = U.getErrorPath = U.Type = U.useFunc = U.setEvaluated = U.evaluatedPropsToName = U.mergeEvaluated = U.eachItem = U.unescapeJsonPointer = U.escapeJsonPointer = U.escapeFragment = U.unescapeFragment = U.schemaRefOrVal = U.schemaHasRulesButRef = U.schemaHasRules = U.checkUnknownRules = U.alwaysValidSchema = U.toHash = void 0;
const he = ie, nd = zr;
function sd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
U.toHash = sd;
function ad(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Nc(e, t), !Oc(t, e.self.RULES.all));
}
U.alwaysValidSchema = ad;
function Nc(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Ic(e, `unknown keyword: "${a}"`);
}
U.checkUnknownRules = Nc;
function Oc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
U.schemaHasRules = Oc;
function od(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
U.schemaHasRulesButRef = od;
function id({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, he._)`${r}`;
  }
  return (0, he._)`${e}${t}${(0, he.getProperty)(n)}`;
}
U.schemaRefOrVal = id;
function cd(e) {
  return Rc(decodeURIComponent(e));
}
U.unescapeFragment = cd;
function ld(e) {
  return encodeURIComponent(ta(e));
}
U.escapeFragment = ld;
function ta(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
U.escapeJsonPointer = ta;
function Rc(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
U.unescapeJsonPointer = Rc;
function ud(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
U.eachItem = ud;
function Ho({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, i, l) => {
    const c = i === void 0 ? a : i instanceof he.Name ? (a instanceof he.Name ? e(s, a, i) : t(s, a, i), i) : a instanceof he.Name ? (t(s, i, a), a) : r(a, i);
    return l === he.Name && !(c instanceof he.Name) ? n(s, c) : c;
  };
}
U.mergeEvaluated = {
  props: Ho({
    mergeNames: (e, t, r) => e.if((0, he._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, he._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, he._)`${r} || {}`).code((0, he._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, he._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, he._)`${r} || {}`), ra(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Tc
  }),
  items: Ho({
    mergeNames: (e, t, r) => e.if((0, he._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, he._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, he._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, he._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Tc(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, he._)`{}`);
  return t !== void 0 && ra(e, r, t), r;
}
U.evaluatedPropsToName = Tc;
function ra(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, he._)`${t}${(0, he.getProperty)(n)}`, !0));
}
U.setEvaluated = ra;
const Bo = {};
function dd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Bo[t.code] || (Bo[t.code] = new nd._Code(t.code))
  });
}
U.useFunc = dd;
var Ss;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ss || (U.Type = Ss = {}));
function fd(e, t, r) {
  if (e instanceof he.Name) {
    const n = t === Ss.Num;
    return r ? n ? (0, he._)`"[" + ${e} + "]"` : (0, he._)`"['" + ${e} + "']"` : n ? (0, he._)`"/" + ${e}` : (0, he._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, he.getProperty)(e).toString() : "/" + ta(e);
}
U.getErrorPath = fd;
function Ic(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
U.checkStrictMode = Ic;
var ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
const Ce = ie, hd = {
  // validation function arguments
  data: new Ce.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ce.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ce.Name("instancePath"),
  parentData: new Ce.Name("parentData"),
  parentDataProperty: new Ce.Name("parentDataProperty"),
  rootData: new Ce.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ce.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ce.Name("vErrors"),
  // null or array of validation errors
  errors: new Ce.Name("errors"),
  // counter of validation errors
  this: new Ce.Name("this"),
  // "globals"
  self: new Ce.Name("self"),
  scope: new Ce.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ce.Name("json"),
  jsonPos: new Ce.Name("jsonPos"),
  jsonLen: new Ce.Name("jsonLen"),
  jsonPart: new Ce.Name("jsonPart")
};
ht.default = hd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ie, r = U, n = ht;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: m }) => m ? (0, t.str)`"${_}" keyword must be ${m} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, m = e.keywordError, w, N) {
    const { it: R } = _, { gen: j, compositeRule: q, allErrors: X } = R, le = h(_, m, w);
    N ?? (q || X) ? c(j, le) : d(R, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(_, m = e.keywordError, w) {
    const { it: N } = _, { gen: R, compositeRule: j, allErrors: q } = N, X = h(_, m, w);
    c(R, X), j || q || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function i(_, m) {
    _.assign(n.default.errors, m), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(m, () => _.assign((0, t._)`${n.default.vErrors}.length`, m), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = i;
  function l({ gen: _, keyword: m, schemaValue: w, data: N, errsCount: R, it: j }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const q = _.name("err");
    _.forRange("i", R, n.default.errors, (X) => {
      _.const(q, (0, t._)`${n.default.vErrors}[${X}]`), _.if((0, t._)`${q}.instancePath === undefined`, () => _.assign((0, t._)`${q}.instancePath`, (0, t.strConcat)(n.default.instancePath, j.errorPath))), _.assign((0, t._)`${q}.schemaPath`, (0, t.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (_.assign((0, t._)`${q}.schema`, w), _.assign((0, t._)`${q}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(_, m) {
    const w = _.const("err", m);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function d(_, m) {
    const { gen: w, validateName: N, schemaEnv: R } = _;
    R.$async ? w.throw((0, t._)`new ${_.ValidationError}(${m})`) : (w.assign((0, t._)`${N}.errors`, m), w.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(_, m, w) {
    const { createErrors: N } = _.it;
    return N === !1 ? (0, t._)`{}` : S(_, m, w);
  }
  function S(_, m, w = {}) {
    const { gen: N, it: R } = _, j = [
      y(R, w),
      v(_, w)
    ];
    return g(_, m, j), N.object(...j);
  }
  function y({ errorPath: _ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${_}${(0, r.getErrorPath)(m, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: _, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${_}`;
    return w && (R = (0, t.str)`${R}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, R];
  }
  function g(_, { params: m, message: w }, N) {
    const { keyword: R, data: j, schemaValue: q, it: X } = _, { opts: le, propertyName: K, topSchemaRef: Q, schemaPath: ce } = X;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(_) : m || (0, t._)`{}`]), le.messages && N.push([u.message, typeof w == "function" ? w(_) : w]), le.verbose && N.push([u.schema, q], [u.parentSchema, (0, t._)`${Q}${ce}`], [n.default.data, j]), K && N.push([u.propertyName, K]);
  }
})(Kr);
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.boolOrEmptySchema = ur.topBoolOrEmptySchema = void 0;
const md = Kr, pd = ie, yd = ht, $d = {
  message: "boolean schema is false"
};
function _d(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? jc(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(yd.default.data) : (t.assign((0, pd._)`${n}.errors`, null), t.return(!0));
}
ur.topBoolOrEmptySchema = _d;
function gd(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), jc(e)) : r.var(t, !0);
}
ur.boolOrEmptySchema = gd;
function jc(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, md.reportError)(s, $d, void 0, t);
}
var Se = {}, Ht = {};
Object.defineProperty(Ht, "__esModule", { value: !0 });
Ht.getRules = Ht.isJSONType = void 0;
const vd = ["string", "number", "integer", "boolean", "null", "object", "array"], wd = new Set(vd);
function Ed(e) {
  return typeof e == "string" && wd.has(e);
}
Ht.isJSONType = Ed;
function Sd() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Ht.getRules = Sd;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.shouldUseRule = $t.shouldUseGroup = $t.schemaHasRulesForType = void 0;
function bd({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Ac(e, n);
}
$t.schemaHasRulesForType = bd;
function Ac(e, t) {
  return t.rules.some((r) => kc(e, r));
}
$t.shouldUseGroup = Ac;
function kc(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
$t.shouldUseRule = kc;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.reportTypeError = Se.checkDataTypes = Se.checkDataType = Se.coerceAndCheckDataType = Se.getJSONTypes = Se.getSchemaTypes = Se.DataType = void 0;
const Pd = Ht, Nd = $t, Od = Kr, te = ie, Cc = U;
var sr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(sr || (Se.DataType = sr = {}));
function Rd(e) {
  const t = Dc(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Se.getSchemaTypes = Rd;
function Dc(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Pd.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Se.getJSONTypes = Dc;
function Td(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Id(t, s.coerceTypes), i = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Nd.schemaHasRulesForType)(e, t[0]));
  if (i) {
    const l = na(t, n, s.strictNumbers, sr.Wrong);
    r.if(l, () => {
      a.length ? jd(e, t, a) : sa(e);
    });
  }
  return i;
}
Se.coerceAndCheckDataType = Td;
const Mc = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Id(e, t) {
  return t ? e.filter((r) => Mc.has(r) || t === "array" && r === "array") : [];
}
function jd(e, t, r) {
  const { gen: n, data: s, opts: a } = e, i = n.let("dataType", (0, te._)`typeof ${s}`), l = n.let("coerced", (0, te._)`undefined`);
  a.coerceTypes === "array" && n.if((0, te._)`${i} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, te._)`${s}[0]`).assign(i, (0, te._)`typeof ${s}`).if(na(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, te._)`${l} !== undefined`);
  for (const d of r)
    (Mc.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), sa(e), n.endIf(), n.if((0, te._)`${l} !== undefined`, () => {
    n.assign(s, l), Ad(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, te._)`${i} == "number" || ${i} == "boolean"`).assign(l, (0, te._)`"" + ${s}`).elseIf((0, te._)`${s} === null`).assign(l, (0, te._)`""`);
        return;
      case "number":
        n.elseIf((0, te._)`${i} == "boolean" || ${s} === null
              || (${i} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, te._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, te._)`${i} === "boolean" || ${s} === null
              || (${i} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, te._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, te._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, te._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, te._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, te._)`${i} === "string" || ${i} === "number"
              || ${i} === "boolean" || ${s} === null`).assign(l, (0, te._)`[${s}]`);
    }
  }
}
function Ad({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, te._)`${t} !== undefined`, () => e.assign((0, te._)`${t}[${r}]`, n));
}
function bs(e, t, r, n = sr.Correct) {
  const s = n === sr.Correct ? te.operators.EQ : te.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, te._)`${t} ${s} null`;
    case "array":
      a = (0, te._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, te._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = i((0, te._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = i();
      break;
    default:
      return (0, te._)`typeof ${t} ${s} ${e}`;
  }
  return n === sr.Correct ? a : (0, te.not)(a);
  function i(l = te.nil) {
    return (0, te.and)((0, te._)`typeof ${t} == "number"`, l, r ? (0, te._)`isFinite(${t})` : te.nil);
  }
}
Se.checkDataType = bs;
function na(e, t, r, n) {
  if (e.length === 1)
    return bs(e[0], t, r, n);
  let s;
  const a = (0, Cc.toHash)(e);
  if (a.array && a.object) {
    const i = (0, te._)`typeof ${t} != "object"`;
    s = a.null ? i : (0, te._)`!${t} || ${i}`, delete a.null, delete a.array, delete a.object;
  } else
    s = te.nil;
  a.number && delete a.integer;
  for (const i in a)
    s = (0, te.and)(s, bs(i, t, r, n));
  return s;
}
Se.checkDataTypes = na;
const kd = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, te._)`{type: ${e}}` : (0, te._)`{type: ${t}}`
};
function sa(e) {
  const t = Cd(e);
  (0, Od.reportError)(t, kd);
}
Se.reportTypeError = sa;
function Cd(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Cc.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.assignDefaults = void 0;
const Yt = ie, Dd = U;
function Md(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Wo(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Wo(e, a, s.default));
}
Fn.assignDefaults = Md;
function Wo(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: i } = e;
  if (r === void 0)
    return;
  const l = (0, Yt._)`${a}${(0, Yt.getProperty)(t)}`;
  if (s) {
    (0, Dd.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, Yt._)`${l} === undefined`;
  i.useDefaults === "empty" && (c = (0, Yt._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, Yt._)`${l} = ${(0, Yt.stringify)(r)}`);
}
var dt = {}, ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.validateUnion = ae.validateArray = ae.usePattern = ae.callValidateCode = ae.schemaProperties = ae.allSchemaProperties = ae.noPropertyInData = ae.propertyInData = ae.isOwnProperty = ae.hasPropFunc = ae.reportMissingProp = ae.checkMissingProp = ae.checkReportMissingProp = void 0;
const ye = ie, aa = U, vt = ht, Ld = U;
function Fd(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ia(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ye._)`${t}` }, !0), e.error();
  });
}
ae.checkReportMissingProp = Fd;
function Vd({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ye.or)(...n.map((a) => (0, ye.and)(ia(e, t, a, r.ownProperties), (0, ye._)`${s} = ${a}`)));
}
ae.checkMissingProp = Vd;
function Ud(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ae.reportMissingProp = Ud;
function Lc(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ye._)`Object.prototype.hasOwnProperty`
  });
}
ae.hasPropFunc = Lc;
function oa(e, t, r) {
  return (0, ye._)`${Lc(e)}.call(${t}, ${r})`;
}
ae.isOwnProperty = oa;
function zd(e, t, r, n) {
  const s = (0, ye._)`${t}${(0, ye.getProperty)(r)} !== undefined`;
  return n ? (0, ye._)`${s} && ${oa(e, t, r)}` : s;
}
ae.propertyInData = zd;
function ia(e, t, r, n) {
  const s = (0, ye._)`${t}${(0, ye.getProperty)(r)} === undefined`;
  return n ? (0, ye.or)(s, (0, ye.not)(oa(e, t, r))) : s;
}
ae.noPropertyInData = ia;
function Fc(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ae.allSchemaProperties = Fc;
function qd(e, t) {
  return Fc(t).filter((r) => !(0, aa.alwaysValidSchema)(e, t[r]));
}
ae.schemaProperties = qd;
function Kd({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: i }, l, c, d) {
  const u = d ? (0, ye._)`${e}, ${t}, ${n}${s}` : t, h = [
    [vt.default.instancePath, (0, ye.strConcat)(vt.default.instancePath, a)],
    [vt.default.parentData, i.parentData],
    [vt.default.parentDataProperty, i.parentDataProperty],
    [vt.default.rootData, vt.default.rootData]
  ];
  i.opts.dynamicRef && h.push([vt.default.dynamicAnchors, vt.default.dynamicAnchors]);
  const S = (0, ye._)`${u}, ${r.object(...h)}`;
  return c !== ye.nil ? (0, ye._)`${l}.call(${c}, ${S})` : (0, ye._)`${l}(${S})`;
}
ae.callValidateCode = Kd;
const Gd = (0, ye._)`new RegExp`;
function Hd({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ye._)`${s.code === "new RegExp" ? Gd : (0, Ld.useFunc)(e, s)}(${r}, ${n})`
  });
}
ae.usePattern = Hd;
function Bd(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return i(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), i(() => t.break()), a;
  function i(l) {
    const c = t.const("len", (0, ye._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: aa.Type.Num
      }, a), t.if((0, ye.not)(a), l);
    });
  }
}
ae.validateArray = Bd;
function Wd(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, aa.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const i = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(i, (0, ye._)`${i} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ye.not)(i));
  })), e.result(i, () => e.reset(), () => e.error(!0));
}
ae.validateUnion = Wd;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.validateKeywordUsage = dt.validSchemaType = dt.funcKeywordCode = dt.macroKeywordCode = void 0;
const Fe = ie, Ut = ht, Jd = ae, Xd = Kr;
function Yd(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: i } = e, l = t.macro.call(i.self, s, a, i), c = Vc(r, n, l);
  i.opts.validateSchema !== !1 && i.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Fe.nil,
    errSchemaPath: `${i.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
dt.macroKeywordCode = Yd;
function Qd(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: i, $data: l, it: c } = e;
  xd(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, i, c) : t.validate, u = Vc(n, s, d), h = n.let("valid");
  e.block$data(h, S), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function S() {
    if (t.errors === !1)
      g(), t.modifying && Jo(e), _(() => e.error());
    else {
      const m = t.async ? y() : v();
      t.modifying && Jo(e), _(() => Zd(e, m));
    }
  }
  function y() {
    const m = n.let("ruleErrs", null);
    return n.try(() => g((0, Fe._)`await `), (w) => n.assign(h, !1).if((0, Fe._)`${w} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Fe._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, Fe._)`${u}.errors`;
    return n.assign(m, null), g(Fe.nil), m;
  }
  function g(m = t.async ? (0, Fe._)`await ` : Fe.nil) {
    const w = c.opts.passContext ? Ut.default.this : Ut.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Fe._)`${m}${(0, Jd.callValidateCode)(e, u, w, N)}`, t.modifying);
  }
  function _(m) {
    var w;
    n.if((0, Fe.not)((w = t.valid) !== null && w !== void 0 ? w : h), m);
  }
}
dt.funcKeywordCode = Qd;
function Jo(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Fe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Zd(e, t) {
  const { gen: r } = e;
  r.if((0, Fe._)`Array.isArray(${t})`, () => {
    r.assign(Ut.default.vErrors, (0, Fe._)`${Ut.default.vErrors} === null ? ${t} : ${Ut.default.vErrors}.concat(${t})`).assign(Ut.default.errors, (0, Fe._)`${Ut.default.vErrors}.length`), (0, Xd.extendErrors)(e);
  }, () => e.error());
}
function xd({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Vc(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Fe.stringify)(r) });
}
function ef(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
dt.validSchemaType = ef;
function tf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const i = s.dependencies;
  if (i != null && i.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${i.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
dt.validateKeywordUsage = tf;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.extendSubschemaMode = jt.extendSubschemaData = jt.getSubschema = void 0;
const lt = ie, Uc = U;
function rf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: i }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, lt._)`${e.schemaPath}${(0, lt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, lt._)`${e.schemaPath}${(0, lt.getProperty)(t)}${(0, lt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Uc.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || i === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: i,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
jt.getSubschema = rf;
function nf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: i }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, S = l.let("data", (0, lt._)`${t.data}${(0, lt.getProperty)(r)}`, !0);
    c(S), e.errorPath = (0, lt.str)`${d}${(0, Uc.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, lt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof lt.Name ? s : l.let("data", s, !0);
    c(d), i !== void 0 && (e.propertyName = i);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
jt.extendSubschemaData = nf;
function sf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
jt.extendSubschemaMode = sf;
var je = {}, Vn = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var i = a[s];
      if (!e(t[i], r[i])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, zc = { exports: {} }, Rt = zc.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  _n(t, n, s, e, "", e);
};
Rt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Rt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Rt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Rt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function _n(e, t, r, n, s, a, i, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, i, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Rt.arrayKeywords)
          for (var S = 0; S < h.length; S++)
            _n(e, t, r, h[S], s + "/" + u + "/" + S, a, s, u, n, S);
      } else if (u in Rt.propsKeywords) {
        if (h && typeof h == "object")
          for (var y in h)
            _n(e, t, r, h[y], s + "/" + u + "/" + af(y), a, s, u, n, y);
      } else (u in Rt.keywords || e.allKeys && !(u in Rt.skipKeywords)) && _n(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, i, l, c, d);
  }
}
function af(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var of = zc.exports;
Object.defineProperty(je, "__esModule", { value: !0 });
je.getSchemaRefs = je.resolveUrl = je.normalizeId = je._getFullPath = je.getFullPath = je.inlineRef = void 0;
const cf = U, lf = Vn, uf = of, df = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function ff(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ps(e) : t ? qc(e) <= t : !1;
}
je.inlineRef = ff;
const hf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ps(e) {
  for (const t in e) {
    if (hf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Ps) || typeof r == "object" && Ps(r))
      return !0;
  }
  return !1;
}
function qc(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !df.has(r) && (typeof e[r] == "object" && (0, cf.eachItem)(e[r], (n) => t += qc(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Kc(e, t = "", r) {
  r !== !1 && (t = ar(t));
  const n = e.parse(t);
  return Gc(e, n);
}
je.getFullPath = Kc;
function Gc(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
je._getFullPath = Gc;
const mf = /#\/?$/;
function ar(e) {
  return e ? e.replace(mf, "") : "";
}
je.normalizeId = ar;
function pf(e, t, r) {
  return r = ar(r), e.resolve(t, r);
}
je.resolveUrl = pf;
const yf = /^[a-z_][-a-z0-9._]*$/i;
function $f(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = ar(e[r] || t), a = { "": s }, i = Kc(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return uf(e, { allKeys: !0 }, (h, S, y, v) => {
    if (v === void 0)
      return;
    const g = i + S;
    let _ = a[v];
    typeof h[r] == "string" && (_ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), a[S] = _;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = ar(_ ? R(_, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let j = this.refs[N];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? d(h, j.schema, N) : N !== ar(g) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = g), N;
    }
    function w(N) {
      if (typeof N == "string") {
        if (!yf.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, S, y) {
    if (S !== void 0 && !lf(h, S))
      throw u(y);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
je.getSchemaRefs = $f;
Object.defineProperty(st, "__esModule", { value: !0 });
st.getData = st.KeywordCxt = st.validateFunctionCode = void 0;
const Hc = ur, Xo = Se, ca = $t, Rn = Se, _f = Fn, Ir = dt, ss = jt, Y = ie, Z = ht, gf = je, _t = U, Er = Kr;
function vf(e) {
  if (Jc(e) && (Xc(e), Wc(e))) {
    Sf(e);
    return;
  }
  Bc(e, () => (0, Hc.topBoolOrEmptySchema)(e));
}
st.validateFunctionCode = vf;
function Bc({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, Y._)`${Z.default.data}, ${Z.default.valCxt}`, n.$async, () => {
    e.code((0, Y._)`"use strict"; ${Yo(r, s)}`), Ef(e, s), e.code(a);
  }) : e.func(t, (0, Y._)`${Z.default.data}, ${wf(s)}`, n.$async, () => e.code(Yo(r, s)).code(a));
}
function wf(e) {
  return (0, Y._)`{${Z.default.instancePath}="", ${Z.default.parentData}, ${Z.default.parentDataProperty}, ${Z.default.rootData}=${Z.default.data}${e.dynamicRef ? (0, Y._)`, ${Z.default.dynamicAnchors}={}` : Y.nil}}={}`;
}
function Ef(e, t) {
  e.if(Z.default.valCxt, () => {
    e.var(Z.default.instancePath, (0, Y._)`${Z.default.valCxt}.${Z.default.instancePath}`), e.var(Z.default.parentData, (0, Y._)`${Z.default.valCxt}.${Z.default.parentData}`), e.var(Z.default.parentDataProperty, (0, Y._)`${Z.default.valCxt}.${Z.default.parentDataProperty}`), e.var(Z.default.rootData, (0, Y._)`${Z.default.valCxt}.${Z.default.rootData}`), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, Y._)`${Z.default.valCxt}.${Z.default.dynamicAnchors}`);
  }, () => {
    e.var(Z.default.instancePath, (0, Y._)`""`), e.var(Z.default.parentData, (0, Y._)`undefined`), e.var(Z.default.parentDataProperty, (0, Y._)`undefined`), e.var(Z.default.rootData, Z.default.data), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, Y._)`{}`);
  });
}
function Sf(e) {
  const { schema: t, opts: r, gen: n } = e;
  Bc(e, () => {
    r.$comment && t.$comment && Qc(e), Rf(e), n.let(Z.default.vErrors, null), n.let(Z.default.errors, 0), r.unevaluated && bf(e), Yc(e), jf(e);
  });
}
function bf(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, Y._)`${r}.evaluated`), t.if((0, Y._)`${e.evaluated}.dynamicProps`, () => t.assign((0, Y._)`${e.evaluated}.props`, (0, Y._)`undefined`)), t.if((0, Y._)`${e.evaluated}.dynamicItems`, () => t.assign((0, Y._)`${e.evaluated}.items`, (0, Y._)`undefined`));
}
function Yo(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, Y._)`/*# sourceURL=${r} */` : Y.nil;
}
function Pf(e, t) {
  if (Jc(e) && (Xc(e), Wc(e))) {
    Nf(e, t);
    return;
  }
  (0, Hc.boolOrEmptySchema)(e, t);
}
function Wc({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Jc(e) {
  return typeof e.schema != "boolean";
}
function Nf(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Qc(e), Tf(e), If(e);
  const a = n.const("_errs", Z.default.errors);
  Yc(e, a), n.var(t, (0, Y._)`${a} === ${Z.default.errors}`);
}
function Xc(e) {
  (0, _t.checkUnknownRules)(e), Of(e);
}
function Yc(e, t) {
  if (e.opts.jtd)
    return Qo(e, [], !1, t);
  const r = (0, Xo.getSchemaTypes)(e.schema), n = (0, Xo.coerceAndCheckDataType)(e, r);
  Qo(e, r, !n, t);
}
function Of(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, _t.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Rf(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, _t.checkStrictMode)(e, "default is ignored in the schema root");
}
function Tf(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, gf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function If(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Qc({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, Y._)`${Z.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const i = (0, Y.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, Y._)`${Z.default.self}.opts.$comment(${a}, ${i}, ${l}.schema)`);
  }
}
function jf(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, Y._)`${Z.default.errors} === 0`, () => t.return(Z.default.data), () => t.throw((0, Y._)`new ${s}(${Z.default.vErrors})`)) : (t.assign((0, Y._)`${n}.errors`, Z.default.vErrors), a.unevaluated && Af(e), t.return((0, Y._)`${Z.default.errors} === 0`));
}
function Af({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof Y.Name && e.assign((0, Y._)`${t}.props`, r), n instanceof Y.Name && e.assign((0, Y._)`${t}.items`, n);
}
function Qo(e, t, r, n) {
  const { gen: s, schema: a, data: i, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, _t.schemaHasRulesButRef)(a, u))) {
    s.block(() => el(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || kf(e, t), s.block(() => {
    for (const S of u.rules)
      h(S);
    h(u.post);
  });
  function h(S) {
    (0, ca.shouldUseGroup)(a, S) && (S.type ? (s.if((0, Rn.checkDataType)(S.type, i, c.strictNumbers)), Zo(e, S), t.length === 1 && t[0] === S.type && r && (s.else(), (0, Rn.reportTypeError)(e)), s.endIf()) : Zo(e, S), l || s.if((0, Y._)`${Z.default.errors} === ${n || 0}`));
  }
}
function Zo(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, _f.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, ca.shouldUseRule)(n, a) && el(e, a.keyword, a.definition, t.type);
  });
}
function kf(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Cf(e, t), e.opts.allowUnionTypes || Df(e, t), Mf(e, e.dataTypes));
}
function Cf(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Zc(e.dataTypes, r) || la(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Ff(e, t);
  }
}
function Df(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && la(e, "use allowUnionTypes to allow union type keyword");
}
function Mf(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ca.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((i) => Lf(t, i)) && la(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Lf(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Zc(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Ff(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Zc(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function la(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, _t.checkStrictMode)(e, t, e.opts.strictTypes);
}
class xc {
  constructor(t, r, n) {
    if ((0, Ir.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, _t.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", tl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Ir.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", Z.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, Y.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, Y.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, Y._)`${r} !== undefined && (${(0, Y.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Er.reportExtraError : Er.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Er.reportError)(this, this.def.$dataError || Er.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Er.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = Y.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = Y.nil, r = Y.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: i } = this;
    n.if((0, Y.or)((0, Y._)`${s} === undefined`, r)), t !== Y.nil && n.assign(t, !0), (a.length || i.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== Y.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, Y.or)(i(), l());
    function i() {
      if (n.length) {
        if (!(r instanceof Y.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, Y._)`${(0, Rn.checkDataTypes)(c, r, a.opts.strictNumbers, Rn.DataType.Wrong)}`;
      }
      return Y.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, Y._)`!${c}(${r})`;
      }
      return Y.nil;
    }
  }
  subschema(t, r) {
    const n = (0, ss.getSubschema)(this.it, t);
    (0, ss.extendSubschemaData)(n, this.it, t), (0, ss.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Pf(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = _t.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = _t.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, Y.Name)), !0;
  }
}
st.KeywordCxt = xc;
function el(e, t, r, n) {
  const s = new xc(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Ir.funcKeywordCode)(s, r) : "macro" in r ? (0, Ir.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Ir.funcKeywordCode)(s, r);
}
const Vf = /^\/(?:[^~]|~0|~1)*$/, Uf = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function tl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return Z.default.rootData;
  if (e[0] === "/") {
    if (!Vf.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = Z.default.rootData;
  } else {
    const d = Uf.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let i = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, Y._)`${a}${(0, Y.getProperty)((0, _t.unescapeJsonPointer)(d))}`, i = (0, Y._)`${i} && ${a}`);
  return i;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
st.getData = tl;
var Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
let zf = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
Gr.default = zf;
var hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
const as = je;
let qf = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, as.resolveUrl)(t, r, n), this.missingSchema = (0, as.normalizeId)((0, as.getFullPath)(t, this.missingRef));
  }
};
hr.default = qf;
var Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.resolveSchema = Ge.getCompilingSchema = Ge.resolveRef = Ge.compileSchema = Ge.SchemaEnv = void 0;
const Qe = ie, Kf = Gr, Lt = ht, rt = je, xo = U, Gf = st;
let Un = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, rt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ge.SchemaEnv = Un;
function ua(e) {
  const t = rl.call(this, e);
  if (t)
    return t;
  const r = (0, rt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, i = new Qe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = i.scopeValue("Error", {
    ref: Kf.default,
    code: (0, Qe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = i.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: i,
    allErrors: this.opts.allErrors,
    data: Lt.default.data,
    parentData: Lt.default.parentData,
    parentDataProperty: Lt.default.parentDataProperty,
    dataNames: [Lt.default.data],
    dataPathArr: [Qe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Qe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Qe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Qe._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Gf.validateFunctionCode)(d), i.optimize(this.opts.code.optimize);
    const h = i.toString();
    u = `${i.scopeRefs(Lt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const y = new Function(`${Lt.default.self}`, `${Lt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: y }), y.errors = null, y.schema = e.schema, y.schemaEnv = e, e.$async && (y.$async = !0), this.opts.code.source === !0 && (y.source = { validateName: c, validateCode: h, scopeValues: i._values }), this.opts.unevaluated) {
      const { props: v, items: g } = d;
      y.evaluated = {
        props: v instanceof Qe.Name ? void 0 : v,
        items: g instanceof Qe.Name ? void 0 : g,
        dynamicProps: v instanceof Qe.Name,
        dynamicItems: g instanceof Qe.Name
      }, y.source && (y.source.evaluated = (0, Qe.stringify)(y.evaluated));
    }
    return e.validate = y, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ge.compileSchema = ua;
function Hf(e, t, r) {
  var n;
  r = (0, rt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Jf.call(this, e, r);
  if (a === void 0) {
    const i = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    i && (a = new Un({ schema: i, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Bf.call(this, a);
}
Ge.resolveRef = Hf;
function Bf(e) {
  return (0, rt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : ua.call(this, e);
}
function rl(e) {
  for (const t of this._compilations)
    if (Wf(t, e))
      return t;
}
Ge.getCompilingSchema = rl;
function Wf(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Jf(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || zn.call(this, e, t);
}
function zn(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, rt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, rt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return os.call(this, r, e);
  const a = (0, rt.normalizeId)(n), i = this.refs[a] || this.schemas[a];
  if (typeof i == "string") {
    const l = zn.call(this, e, i);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : os.call(this, r, l);
  }
  if (typeof (i == null ? void 0 : i.schema) == "object") {
    if (i.validate || ua.call(this, i), a === (0, rt.normalizeId)(t)) {
      const { schema: l } = i, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, rt.resolveUrl)(this.opts.uriResolver, s, d)), new Un({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return os.call(this, r, i);
  }
}
Ge.resolveSchema = zn;
const Xf = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function os(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, xo.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Xf.has(l) && d && (t = (0, rt.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, xo.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, rt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = zn.call(this, n, l);
  }
  const { schemaId: i } = this.opts;
  if (a = a || new Un({ schema: r, schemaId: i, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Yf = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Qf = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Zf = "object", xf = [
  "$data"
], eh = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, th = !1, rh = {
  $id: Yf,
  description: Qf,
  type: Zf,
  required: xf,
  properties: eh,
  additionalProperties: th
};
var da = {}, qn = { exports: {} };
const nh = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), nl = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function sl(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const sh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function ei(e) {
  return e.length = 0, !0;
}
function ah(e, t, r) {
  if (e.length) {
    const n = sl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function oh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, i = !1, l = ah;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (i = !0), !l(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!l(s, n, r))
          break;
        l = ei;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (l === ei ? r.zone = s.join("") : i ? n.push(s.join("")) : n.push(sl(s))), r.address = n.join(""), r;
}
function al(e) {
  if (ih(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = oh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function ih(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function ch(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function lh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function uh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!nl(r)) {
      const n = al(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var ol = {
  nonSimpleDomain: sh,
  recomposeAuthority: uh,
  normalizeComponentEncoding: lh,
  removeDotSegments: ch,
  isIPv4: nl,
  isUUID: nh,
  normalizeIPv6: al
};
const { isUUID: dh } = ol, fh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function il(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function cl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ll(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function hh(e) {
  return e.secure = il(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function mh(e) {
  if ((e.port === (il(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function ph(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(fh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = fa(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function yh(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = fa(s);
  a && (e = a.serialize(e, t));
  const i = e, l = e.nss;
  return i.path = `${n || t.nid}:${l}`, t.skipEscape = !0, i;
}
function $h(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !dh(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function _h(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const ul = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: cl,
    serialize: ll
  }
), gh = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: ul.domainHost,
    parse: cl,
    serialize: ll
  }
), gn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: hh,
    serialize: mh
  }
), vh = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: gn.domainHost,
    parse: gn.parse,
    serialize: gn.serialize
  }
), wh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: ph,
    serialize: yh,
    skipNormalize: !0
  }
), Eh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: $h,
    serialize: _h,
    skipNormalize: !0
  }
), Tn = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: ul,
    https: gh,
    ws: gn,
    wss: vh,
    urn: wh,
    "urn:uuid": Eh
  }
);
Object.setPrototypeOf(Tn, null);
function fa(e) {
  return e && (Tn[
    /** @type {SchemeName} */
    e
  ] || Tn[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Sh = {
  SCHEMES: Tn,
  getSchemeHandler: fa
};
const { normalizeIPv6: bh, removeDotSegments: Or, recomposeAuthority: Ph, normalizeComponentEncoding: xr, isIPv4: Nh, nonSimpleDomain: Oh } = ol, { SCHEMES: Rh, getSchemeHandler: dl } = Sh;
function Th(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  ft(gt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  gt(ft(e, t), t)), e;
}
function Ih(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = fl(gt(e, n), gt(t, n), n, !0);
  return n.skipEscape = !0, ft(s, n);
}
function fl(e, t, r, n) {
  const s = {};
  return n || (e = gt(ft(e, r), r), t = gt(ft(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Or(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Or(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = Or(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Or(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function jh(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ft(xr(gt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ft(xr(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ft(xr(gt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ft(xr(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ft(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = dl(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const i = Ph(r);
  if (i !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(i), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = Or(l)), i === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Ah = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function gt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match(Ah);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (Nh(n.host) === !1) {
        const c = bh(n.host);
        n.host = c.host.toLowerCase(), s = c.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const i = dl(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!i || !i.unicodeSupport) && n.host && (r.domainHost || i && i.domainHost) && s === !1 && Oh(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (l) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + l;
      }
    (!i || i && !i.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), i && i.parse && i.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const ha = {
  SCHEMES: Rh,
  normalize: Th,
  resolve: Ih,
  resolveComponent: fl,
  equal: jh,
  serialize: ft,
  parse: gt
};
qn.exports = ha;
qn.exports.default = ha;
qn.exports.fastUri = ha;
var hl = qn.exports;
Object.defineProperty(da, "__esModule", { value: !0 });
const ml = hl;
ml.code = 'require("ajv/dist/runtime/uri").default';
da.default = ml;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = st;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ie;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Gr, s = hr, a = Ht, i = Ge, l = ie, c = je, d = Se, u = U, h = rh, S = da, y = (E, p) => new RegExp(E, p);
  y.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), _ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function N(E) {
    var p, b, $, o, f, P, k, C, W, G, O, T, D, F, J, ee, ge, De, Pe, Ne, ve, it, ke, kt, Ct;
    const Ye = E.strict, Dt = (p = E.code) === null || p === void 0 ? void 0 : p.optimize, vr = Dt === !0 || Dt === void 0 ? 1 : Dt || 0, wr = ($ = (b = E.code) === null || b === void 0 ? void 0 : b.regExp) !== null && $ !== void 0 ? $ : y, ns = (o = E.uriResolver) !== null && o !== void 0 ? o : S.default;
    return {
      strictSchema: (P = (f = E.strictSchema) !== null && f !== void 0 ? f : Ye) !== null && P !== void 0 ? P : !0,
      strictNumbers: (C = (k = E.strictNumbers) !== null && k !== void 0 ? k : Ye) !== null && C !== void 0 ? C : !0,
      strictTypes: (G = (W = E.strictTypes) !== null && W !== void 0 ? W : Ye) !== null && G !== void 0 ? G : "log",
      strictTuples: (T = (O = E.strictTuples) !== null && O !== void 0 ? O : Ye) !== null && T !== void 0 ? T : "log",
      strictRequired: (F = (D = E.strictRequired) !== null && D !== void 0 ? D : Ye) !== null && F !== void 0 ? F : !1,
      code: E.code ? { ...E.code, optimize: vr, regExp: wr } : { optimize: vr, regExp: wr },
      loopRequired: (J = E.loopRequired) !== null && J !== void 0 ? J : w,
      loopEnum: (ee = E.loopEnum) !== null && ee !== void 0 ? ee : w,
      meta: (ge = E.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (De = E.messages) !== null && De !== void 0 ? De : !0,
      inlineRefs: (Pe = E.inlineRefs) !== null && Pe !== void 0 ? Pe : !0,
      schemaId: (Ne = E.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
      addUsedSchema: (ve = E.addUsedSchema) !== null && ve !== void 0 ? ve : !0,
      validateSchema: (it = E.validateSchema) !== null && it !== void 0 ? it : !0,
      validateFormats: (ke = E.validateFormats) !== null && ke !== void 0 ? ke : !0,
      unicodeRegExp: (kt = E.unicodeRegExp) !== null && kt !== void 0 ? kt : !0,
      int32range: (Ct = E.int32range) !== null && Ct !== void 0 ? Ct : !0,
      uriResolver: ns
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: b, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: g, es5: b, lines: $ }), this.logger = x(p.logger);
      const o = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), j.call(this, _, p, "NOT SUPPORTED"), j.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = Q.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && K.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = o;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: $ } = this.opts;
      let o = h;
      $ === "id" && (o = { ...h }, o.id = o.$id, delete o.$id), b && p && this.addMetaSchema(o, o[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const o = $(b);
      return "$async" in $ || (this.errors = $.errors), o;
    }
    compile(p, b) {
      const $ = this._addSchema(p, b);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return o.call(this, p, b);
      async function o(G, O) {
        await f.call(this, G.$schema);
        const T = this._addSchema(G, O);
        return T.validate || P.call(this, T);
      }
      async function f(G) {
        G && !this.getSchema(G) && await o.call(this, { $ref: G }, !0);
      }
      async function P(G) {
        try {
          return this._compileSchemaEnv(G);
        } catch (O) {
          if (!(O instanceof s.default))
            throw O;
          return k.call(this, O), await C.call(this, O.missingSchema), P.call(this, G);
        }
      }
      function k({ missingSchema: G, missingRef: O }) {
        if (this.refs[G])
          throw new Error(`AnySchema ${G} is loaded but ${O} cannot be resolved`);
      }
      async function C(G) {
        const O = await W.call(this, G);
        this.refs[G] || await f.call(this, O.$schema), this.refs[G] || this.addSchema(O, G, b);
      }
      async function W(G) {
        const O = this._loading[G];
        if (O)
          return O;
        try {
          return await (this._loading[G] = $(G));
        } finally {
          delete this._loading[G];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, $, o = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const P of p)
          this.addSchema(P, void 0, $, o);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: P } = this.opts;
        if (f = p[P], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${P} must be string`);
      }
      return b = (0, c.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, $, b, o, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, $ = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const o = this.validate($, p);
      if (!o && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return o;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = q.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: $ } = this.opts, o = new i.SchemaEnv({ schema: {}, schemaId: $ });
        if (b = i.resolveSchema.call(this, o, p), !b)
          return;
        this.refs[p] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = q.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const b of p)
        this.addKeyword(b);
      return this;
    }
    addKeyword(p, b) {
      let $;
      if (typeof p == "string")
        $ = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = $);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, $ = b.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (M.call(this, $, b), !b)
        return (0, u.eachItem)($, (f) => L.call(this, f)), this;
      V.call(this, b);
      const o = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)($, o.type.length === 0 ? (f) => L.call(this, f, o) : (f) => o.type.forEach((P) => L.call(this, f, o, P))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const $ of b.rules) {
        const o = $.rules.findIndex((f) => f.keyword === p);
        o >= 0 && $.rules.splice(o, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((o) => `${$}${o.instancePath} ${o.message}`).reduce((o, f) => o + b + f);
    }
    $dataMetaSchema(p, b) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const o of b) {
        const f = o.split("/").slice(1);
        let P = p;
        for (const k of f)
          P = P[k];
        for (const k in $) {
          const C = $[k];
          if (typeof C != "object")
            continue;
          const { $data: W } = C.definition, G = P[k];
          W && G && (P[k] = A(G));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const $ in p) {
        const o = p[$];
        (!b || b.test($)) && (typeof o == "string" ? delete p[$] : o && !o.meta && (this._cache.delete(o.schema), delete p[$]));
      }
    }
    _addSchema(p, b, $, o = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let P;
      const { schemaId: k } = this.opts;
      if (typeof p == "object")
        P = p[k];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let C = this._cache.get(p);
      if (C !== void 0)
        return C;
      $ = (0, c.normalizeId)(P || $);
      const W = c.getSchemaRefs.call(this, p, $);
      return C = new i.SchemaEnv({ schema: p, schemaId: k, meta: b, baseId: $, localRefs: W }), this._cache.set(C.schema, C), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = C), o && this.validateSchema(p, !0), C;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : i.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        i.compileSchema.call(this, p);
      } finally {
        this.opts = b;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function j(E, p, b, $ = "error") {
    for (const o in E) {
      const f = o;
      f in p && this.logger[$](`${b}: option ${o}. ${E[f]}`);
    }
  }
  function q(E) {
    return E = (0, c.normalizeId)(E), this.schemas[E] || this.refs[E];
  }
  function X() {
    const E = this.opts.schemas;
    if (E)
      if (Array.isArray(E))
        this.addSchema(E);
      else
        for (const p in E)
          this.addSchema(E[p], p);
  }
  function le() {
    for (const E in this.opts.formats) {
      const p = this.opts.formats[E];
      p && this.addFormat(E, p);
    }
  }
  function K(E) {
    if (Array.isArray(E)) {
      this.addVocabulary(E);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in E) {
      const b = E[p];
      b.keyword || (b.keyword = p), this.addKeyword(b);
    }
  }
  function Q() {
    const E = { ...this.opts };
    for (const p of v)
      delete E[p];
    return E;
  }
  const ce = { log() {
  }, warn() {
  }, error() {
  } };
  function x(E) {
    if (E === !1)
      return ce;
    if (E === void 0)
      return console;
    if (E.log && E.warn && E.error)
      return E;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ne = /^[a-z_$][a-z0-9_$:-]*$/i;
  function M(E, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(E, ($) => {
      if (b.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!ne.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function L(E, p, b) {
    var $;
    const o = p == null ? void 0 : p.post;
    if (b && o)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let P = o ? f.post : f.rules.find(({ type: C }) => C === b);
    if (P || (P = { type: b, rules: [] }, f.rules.push(P)), f.keywords[E] = !0, !p)
      return;
    const k = {
      keyword: E,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? H.call(this, P, k, p.before) : P.rules.push(k), f.all[E] = k, ($ = p.implements) === null || $ === void 0 || $.forEach((C) => this.addKeyword(C));
  }
  function H(E, p, b) {
    const $ = E.rules.findIndex((o) => o.keyword === b);
    $ >= 0 ? E.rules.splice($, 0, p) : (E.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function V(E) {
    let { metaSchema: p } = E;
    p !== void 0 && (E.$data && this.opts.$data && (p = A(p)), E.validateSchema = this.compile(p, !0));
  }
  const I = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function A(E) {
    return { anyOf: [E, I] };
  }
})(Pc);
var ma = {}, pa = {}, ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
const kh = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ya.default = kh;
var Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.callRef = Bt.getValidate = void 0;
const Ch = hr, ti = ae, qe = ie, Qt = ht, ri = Ge, en = U, Dh = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: i, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = ri.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new Ch.default(n.opts.uriResolver, s, r);
    if (u instanceof ri.SchemaEnv)
      return S(u);
    return y(u);
    function h() {
      if (a === d)
        return vn(e, i, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return vn(e, (0, qe._)`${v}.validate`, d, d.$async);
    }
    function S(v) {
      const g = pl(e, v);
      vn(e, g, v, v.$async);
    }
    function y(v) {
      const g = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, qe.stringify)(v) } : { ref: v }), _ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: qe.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(m), e.ok(_);
    }
  }
};
function pl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, qe._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Bt.getValidate = pl;
function vn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: i, schemaEnv: l, opts: c } = a, d = c.passContext ? Qt.default.this : qe.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, qe._)`await ${(0, ti.callValidateCode)(e, t, d)}`), y(t), i || s.assign(v, !0);
    }, (g) => {
      s.if((0, qe._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), S(g), i || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, ti.callValidateCode)(e, t, d), () => y(t), () => S(t));
  }
  function S(v) {
    const g = (0, qe._)`${v}.errors`;
    s.assign(Qt.default.vErrors, (0, qe._)`${Qt.default.vErrors} === null ? ${g} : ${Qt.default.vErrors}.concat(${g})`), s.assign(Qt.default.errors, (0, qe._)`${Qt.default.vErrors}.length`);
  }
  function y(v) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const _ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (a.props = en.mergeEvaluated.props(s, _.props, a.props));
      else {
        const m = s.var("props", (0, qe._)`${v}.evaluated.props`);
        a.props = en.mergeEvaluated.props(s, m, a.props, qe.Name);
      }
    if (a.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (a.items = en.mergeEvaluated.items(s, _.items, a.items));
      else {
        const m = s.var("items", (0, qe._)`${v}.evaluated.items`);
        a.items = en.mergeEvaluated.items(s, m, a.items, qe.Name);
      }
  }
}
Bt.callRef = vn;
Bt.default = Dh;
Object.defineProperty(pa, "__esModule", { value: !0 });
const Mh = ya, Lh = Bt, Fh = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Mh.default,
  Lh.default
];
pa.default = Fh;
var $a = {}, _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
const In = ie, wt = In.operators, jn = {
  maximum: { okStr: "<=", ok: wt.LTE, fail: wt.GT },
  minimum: { okStr: ">=", ok: wt.GTE, fail: wt.LT },
  exclusiveMaximum: { okStr: "<", ok: wt.LT, fail: wt.GTE },
  exclusiveMinimum: { okStr: ">", ok: wt.GT, fail: wt.LTE }
}, Vh = {
  message: ({ keyword: e, schemaCode: t }) => (0, In.str)`must be ${jn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, In._)`{comparison: ${jn[e].okStr}, limit: ${t}}`
}, Uh = {
  keyword: Object.keys(jn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Vh,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, In._)`${r} ${jn[t].fail} ${n} || isNaN(${r})`);
  }
};
_a.default = Uh;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const jr = ie, zh = {
  message: ({ schemaCode: e }) => (0, jr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, jr._)`{multipleOf: ${e}}`
}, qh = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: zh,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, i = t.let("res"), l = a ? (0, jr._)`Math.abs(Math.round(${i}) - ${i}) > 1e-${a}` : (0, jr._)`${i} !== parseInt(${i})`;
    e.fail$data((0, jr._)`(${n} === 0 || (${i} = ${r}/${n}, ${l}))`);
  }
};
ga.default = qh;
var va = {}, wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
function yl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
wa.default = yl;
yl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(va, "__esModule", { value: !0 });
const zt = ie, Kh = U, Gh = wa, Hh = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, zt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, zt._)`{limit: ${e}}`
}, Bh = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Hh,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? zt.operators.GT : zt.operators.LT, i = s.opts.unicode === !1 ? (0, zt._)`${r}.length` : (0, zt._)`${(0, Kh.useFunc)(e.gen, Gh.default)}(${r})`;
    e.fail$data((0, zt._)`${i} ${a} ${n}`);
  }
};
va.default = Bh;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
const Wh = ae, Jh = U, rr = ie, Xh = {
  message: ({ schemaCode: e }) => (0, rr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, rr._)`{pattern: ${e}}`
}, Yh = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Xh,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e, l = i.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = i.opts.code, d = c.code === "new RegExp" ? (0, rr._)`new RegExp` : (0, Jh.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, rr._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, rr._)`!${u}`);
    } else {
      const c = (0, Wh.usePattern)(e, s);
      e.fail$data((0, rr._)`!${c}.test(${r})`);
    }
  }
};
Ea.default = Yh;
var Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
const Ar = ie, Qh = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Ar.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ar._)`{limit: ${e}}`
}, Zh = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Qh,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Ar.operators.GT : Ar.operators.LT;
    e.fail$data((0, Ar._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Sa.default = Zh;
var ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const Sr = ae, kr = ie, xh = U, em = {
  message: ({ params: { missingProperty: e } }) => (0, kr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, kr._)`{missingProperty: ${e}}`
}, tm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: em,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: i } = e, { opts: l } = i;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (i.allErrors ? d() : u(), l.strictRequired) {
      const y = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const g of r)
        if ((y == null ? void 0 : y[g]) === void 0 && !v.has(g)) {
          const _ = i.schemaEnv.baseId + i.errSchemaPath, m = `required property "${g}" is not defined at "${_}" (strictRequired)`;
          (0, xh.checkStrictMode)(i, m, i.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(kr.nil, h);
      else
        for (const y of r)
          (0, Sr.checkReportMissingProp)(e, y);
    }
    function u() {
      const y = t.let("missing");
      if (c || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => S(y, v)), e.ok(v);
      } else
        t.if((0, Sr.checkMissingProp)(e, r, y)), (0, Sr.reportMissingProp)(e, y), t.else();
    }
    function h() {
      t.forOf("prop", n, (y) => {
        e.setParams({ missingProperty: y }), t.if((0, Sr.noPropertyInData)(t, s, y, l.ownProperties), () => e.error());
      });
    }
    function S(y, v) {
      e.setParams({ missingProperty: y }), t.forOf(y, n, () => {
        t.assign(v, (0, Sr.propertyInData)(t, s, y, l.ownProperties)), t.if((0, kr.not)(v), () => {
          e.error(), t.break();
        });
      }, kr.nil);
    }
  }
};
ba.default = tm;
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const Cr = ie, rm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Cr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Cr._)`{limit: ${e}}`
}, nm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: rm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Cr.operators.GT : Cr.operators.LT;
    e.fail$data((0, Cr._)`${r}.length ${s} ${n}`);
  }
};
Pa.default = nm;
var Na = {}, Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
const $l = Vn;
$l.code = 'require("ajv/dist/runtime/equal").default';
Hr.default = $l;
Object.defineProperty(Na, "__esModule", { value: !0 });
const is = Se, Re = ie, sm = U, am = Hr, om = {
  message: ({ params: { i: e, j: t } }) => (0, Re.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Re._)`{i: ${e}, j: ${t}}`
}, im = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: om,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: i, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, is.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, Re._)`${i} === false`), e.ok(c);
    function u() {
      const v = t.let("i", (0, Re._)`${r}.length`), g = t.let("j");
      e.setParams({ i: v, j: g }), t.assign(c, !0), t.if((0, Re._)`${v} > 1`, () => (h() ? S : y)(v, g));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function S(v, g) {
      const _ = t.name("item"), m = (0, is.checkDataTypes)(d, _, l.opts.strictNumbers, is.DataType.Wrong), w = t.const("indices", (0, Re._)`{}`);
      t.for((0, Re._)`;${v}--;`, () => {
        t.let(_, (0, Re._)`${r}[${v}]`), t.if(m, (0, Re._)`continue`), d.length > 1 && t.if((0, Re._)`typeof ${_} == "string"`, (0, Re._)`${_} += "_"`), t.if((0, Re._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(g, (0, Re._)`${w}[${_}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Re._)`${w}[${_}] = ${v}`);
      });
    }
    function y(v, g) {
      const _ = (0, sm.useFunc)(t, am.default), m = t.name("outer");
      t.label(m).for((0, Re._)`;${v}--;`, () => t.for((0, Re._)`${g} = ${v}; ${g}--;`, () => t.if((0, Re._)`${_}(${r}[${v}], ${r}[${g}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Na.default = im;
var Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
const Ns = ie, cm = U, lm = Hr, um = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ns._)`{allowedValue: ${e}}`
}, dm = {
  keyword: "const",
  $data: !0,
  error: um,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Ns._)`!${(0, cm.useFunc)(t, lm.default)}(${r}, ${s})`) : e.fail((0, Ns._)`${a} !== ${r}`);
  }
};
Oa.default = dm;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const Rr = ie, fm = U, hm = Hr, mm = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Rr._)`{allowedValues: ${e}}`
}, pm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: mm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= i.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, fm.useFunc)(t, hm.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const y = t.const("vSchema", a);
      u = (0, Rr.or)(...s.map((v, g) => S(y, g)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (y) => t.if((0, Rr._)`${d()}(${r}, ${y})`, () => t.assign(u, !0).break()));
    }
    function S(y, v) {
      const g = s[v];
      return typeof g == "object" && g !== null ? (0, Rr._)`${d()}(${r}, ${y}[${v}])` : (0, Rr._)`${r} === ${g}`;
    }
  }
};
Ra.default = pm;
Object.defineProperty($a, "__esModule", { value: !0 });
const ym = _a, $m = ga, _m = va, gm = Ea, vm = Sa, wm = ba, Em = Pa, Sm = Na, bm = Oa, Pm = Ra, Nm = [
  // number
  ym.default,
  $m.default,
  // string
  _m.default,
  gm.default,
  // object
  vm.default,
  wm.default,
  // array
  Em.default,
  Sm.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  bm.default,
  Pm.default
];
$a.default = Nm;
var Ta = {}, mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.validateAdditionalItems = void 0;
const qt = ie, Os = U, Om = {
  message: ({ params: { len: e } }) => (0, qt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, qt._)`{limit: ${e}}`
}, Rm = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Om,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Os.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    _l(e, n);
  }
};
function _l(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: i } = e;
  i.items = !0;
  const l = r.const("len", (0, qt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, qt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Os.alwaysValidSchema)(i, n)) {
    const d = r.var("valid", (0, qt._)`${l} <= ${t.length}`);
    r.if((0, qt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: Os.Type.Num }, d), i.allErrors || r.if((0, qt.not)(d), () => r.break());
    });
  }
}
mr.validateAdditionalItems = _l;
mr.default = Rm;
var Ia = {}, pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.validateTuple = void 0;
const ni = ie, wn = U, Tm = ae, Im = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return gl(e, "additionalItems", t);
    r.items = !0, !(0, wn.alwaysValidSchema)(r, t) && e.ok((0, Tm.validateArray)(e));
  }
};
function gl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: i, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = wn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, ni._)`${a}.length`);
  r.forEach((h, S) => {
    (0, wn.alwaysValidSchema)(l, h) || (n.if((0, ni._)`${d} > ${S}`, () => e.subschema({
      keyword: i,
      schemaProp: S,
      dataProp: S
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: S, errSchemaPath: y } = l, v = r.length, g = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (S.strictTuples && !g) {
      const _ = `"${i}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${y}"`;
      (0, wn.checkStrictMode)(l, _, S.strictTuples);
    }
  }
}
pr.validateTuple = gl;
pr.default = Im;
Object.defineProperty(Ia, "__esModule", { value: !0 });
const jm = pr, Am = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, jm.validateTuple)(e, "items")
};
Ia.default = Am;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const si = ie, km = U, Cm = ae, Dm = mr, Mm = {
  message: ({ params: { len: e } }) => (0, si.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, si._)`{limit: ${e}}`
}, Lm = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Mm,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, km.alwaysValidSchema)(n, t) && (s ? (0, Dm.validateAdditionalItems)(e, s) : e.ok((0, Cm.validateArray)(e)));
  }
};
ja.default = Lm;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const Je = ie, tn = U, Fm = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Je.str)`must contain at least ${e} valid item(s)` : (0, Je.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Je._)`{minContains: ${e}}` : (0, Je._)`{minContains: ${e}, maxContains: ${t}}`
}, Vm = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Fm,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let i, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (i = c === void 0 ? 1 : c, l = d) : i = 1;
    const u = t.const("len", (0, Je._)`${s}.length`);
    if (e.setParams({ min: i, max: l }), l === void 0 && i === 0) {
      (0, tn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && i > l) {
      (0, tn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, tn.alwaysValidSchema)(a, r)) {
      let g = (0, Je._)`${u} >= ${i}`;
      l !== void 0 && (g = (0, Je._)`${g} && ${u} <= ${l}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && i === 1 ? y(h, () => t.if(h, () => t.break())) : i === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Je._)`${s}.length > 0`, S)) : (t.let(h, !1), S()), e.result(h, () => e.reset());
    function S() {
      const g = t.name("_valid"), _ = t.let("count", 0);
      y(g, () => t.if(g, () => v(_)));
    }
    function y(g, _) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: tn.Type.Num,
          compositeRule: !0
        }, g), _();
      });
    }
    function v(g) {
      t.code((0, Je._)`${g}++`), l === void 0 ? t.if((0, Je._)`${g} >= ${i}`, () => t.assign(h, !0).break()) : (t.if((0, Je._)`${g} > ${l}`, () => t.assign(h, !1).break()), i === 1 ? t.assign(h, !0) : t.if((0, Je._)`${g} >= ${i}`, () => t.assign(h, !0)));
    }
  }
};
Aa.default = Vm;
var vl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ie, r = U, n = ae;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, u] = a(c);
      i(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const S = Array.isArray(c[h]) ? d : u;
      S[h] = c[h];
    }
    return [d, u];
  }
  function i(c, d = c.schema) {
    const { gen: u, data: h, it: S } = c;
    if (Object.keys(d).length === 0)
      return;
    const y = u.let("missing");
    for (const v in d) {
      const g = d[v];
      if (g.length === 0)
        continue;
      const _ = (0, n.propertyInData)(u, h, v, S.opts.ownProperties);
      c.setParams({
        property: v,
        depsCount: g.length,
        deps: g.join(", ")
      }), S.allErrors ? u.if(_, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${_} && (${(0, n.checkMissingProp)(c, g, y)})`), (0, n.reportMissingProp)(c, y), u.else());
    }
  }
  e.validatePropertyDeps = i;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: S, it: y } = c, v = u.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(y, d[g]) || (u.if(
        (0, n.propertyInData)(u, h, g, y.opts.ownProperties),
        () => {
          const _ = c.subschema({ keyword: S, schemaProp: g }, v);
          c.mergeValidEvaluated(_, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), c.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(vl);
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const wl = ie, Um = U, zm = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, wl._)`{propertyName: ${e.propertyName}}`
}, qm = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: zm,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Um.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (i) => {
      e.setParams({ propertyName: i }), e.subschema({
        keyword: "propertyNames",
        data: i,
        dataTypes: ["string"],
        propertyName: i,
        compositeRule: !0
      }, a), t.if((0, wl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ka.default = qm;
var Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
const rn = ae, et = ie, Km = ht, nn = U, Gm = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, et._)`{additionalProperty: ${e.additionalProperty}}`
}, Hm = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Gm,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: i } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = i;
    if (i.props = !0, c.removeAdditional !== "all" && (0, nn.alwaysValidSchema)(i, r))
      return;
    const d = (0, rn.allSchemaProperties)(n.properties), u = (0, rn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, et._)`${a} === ${Km.default.errors}`);
    function h() {
      t.forIn("key", s, (_) => {
        !d.length && !u.length ? v(_) : t.if(S(_), () => v(_));
      });
    }
    function S(_) {
      let m;
      if (d.length > 8) {
        const w = (0, nn.schemaRefOrVal)(i, n.properties, "properties");
        m = (0, rn.isOwnProperty)(t, w, _);
      } else d.length ? m = (0, et.or)(...d.map((w) => (0, et._)`${_} === ${w}`)) : m = et.nil;
      return u.length && (m = (0, et.or)(m, ...u.map((w) => (0, et._)`${(0, rn.usePattern)(e, w)}.test(${_})`))), (0, et.not)(m);
    }
    function y(_) {
      t.code((0, et._)`delete ${s}[${_}]`);
    }
    function v(_) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        y(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, nn.alwaysValidSchema)(i, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (g(_, m, !1), t.if((0, et.not)(m), () => {
          e.reset(), y(_);
        })) : (g(_, m), l || t.if((0, et.not)(m), () => t.break()));
      }
    }
    function g(_, m, w) {
      const N = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: nn.Type.Str
      };
      w === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Kn.default = Hm;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Bm = st, ai = ae, cs = U, oi = Kn, Wm = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && oi.default.code(new Bm.KeywordCxt(a, oi.default, "additionalProperties"));
    const i = (0, ai.allSchemaProperties)(r);
    for (const h of i)
      a.definedProperties.add(h);
    a.opts.unevaluated && i.length && a.props !== !0 && (a.props = cs.mergeEvaluated.props(t, (0, cs.toHash)(i), a.props));
    const l = i.filter((h) => !(0, cs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, ai.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Ca.default = Wm;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const ii = ae, sn = ie, ci = U, li = U, Jm = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: i } = a, l = (0, ii.allSchemaProperties)(r), c = l.filter((g) => (0, ci.alwaysValidSchema)(a, r[g]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = i.strictSchema && !i.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof sn.Name) && (a.props = (0, li.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    S();
    function S() {
      for (const g of l)
        d && y(g), a.allErrors ? v(g) : (t.var(u, !0), v(g), t.if(u));
    }
    function y(g) {
      for (const _ in d)
        new RegExp(g).test(_) && (0, ci.checkStrictMode)(a, `property ${_} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function v(g) {
      t.forIn("key", n, (_) => {
        t.if((0, sn._)`${(0, ii.usePattern)(e, g)}.test(${_})`, () => {
          const m = c.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: _,
            dataPropType: li.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, sn._)`${h}[${_}]`, !0) : !m && !a.allErrors && t.if((0, sn.not)(u), () => t.break());
        });
      });
    }
  }
};
Da.default = Jm;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const Xm = U, Ym = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Xm.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Ma.default = Ym;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const Qm = ae, Zm = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Qm.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
La.default = Zm;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const En = ie, xm = U, ep = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, En._)`{passingSchemas: ${e.passing}}`
}, tp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: ep,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, i = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(i, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let S;
        (0, xm.alwaysValidSchema)(s, u) ? t.var(c, !0) : S = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, En._)`${c} && ${i}`).assign(i, !1).assign(l, (0, En._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(i, !0), t.assign(l, h), S && e.mergeEvaluated(S, En.Name);
        });
      });
    }
  }
};
Fa.default = tp;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
const rp = U, np = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, i) => {
      if ((0, rp.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: i }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
Va.default = np;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const An = ie, El = U, sp = {
  message: ({ params: e }) => (0, An.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, An._)`{failingKeyword: ${e.ifClause}}`
}, ap = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: sp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, El.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ui(n, "then"), a = ui(n, "else");
    if (!s && !a)
      return;
    const i = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, An.not)(l), d("else"));
    e.pass(i, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const S = e.subschema({ keyword: u }, l);
        t.assign(i, l), e.mergeValidEvaluated(S, i), h ? t.assign(h, (0, An._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function ui(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, El.alwaysValidSchema)(e, r);
}
Ua.default = ap;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const op = U, ip = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, op.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
za.default = ip;
Object.defineProperty(Ta, "__esModule", { value: !0 });
const cp = mr, lp = Ia, up = pr, dp = ja, fp = Aa, hp = vl, mp = ka, pp = Kn, yp = Ca, $p = Da, _p = Ma, gp = La, vp = Fa, wp = Va, Ep = Ua, Sp = za;
function bp(e = !1) {
  const t = [
    // any
    _p.default,
    gp.default,
    vp.default,
    wp.default,
    Ep.default,
    Sp.default,
    // object
    mp.default,
    pp.default,
    hp.default,
    yp.default,
    $p.default
  ];
  return e ? t.push(lp.default, dp.default) : t.push(cp.default, up.default), t.push(fp.default), t;
}
Ta.default = bp;
var qa = {}, Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const we = ie, Pp = {
  message: ({ schemaCode: e }) => (0, we.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, we._)`{format: ${e}}`
}, Np = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Pp,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: i, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? S() : y();
    function S() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), g = r.const("fDef", (0, we._)`${v}[${i}]`), _ = r.let("fType"), m = r.let("format");
      r.if((0, we._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign(_, (0, we._)`${g}.type || "string"`).assign(m, (0, we._)`${g}.validate`), () => r.assign(_, (0, we._)`"string"`).assign(m, g)), e.fail$data((0, we.or)(w(), N()));
      function w() {
        return c.strictSchema === !1 ? we.nil : (0, we._)`${i} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, we._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, we._)`${m}(${n})`, j = (0, we._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, we._)`${m} && ${m} !== true && ${_} === ${t} && !${j}`;
      }
    }
    function y() {
      const v = h.formats[a];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [g, _, m] = N(v);
      g === t && e.pass(R());
      function w() {
        if (c.strictSchema === !1) {
          h.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(j) {
        const q = j instanceof RegExp ? (0, we.regexpCode)(j) : c.code.formats ? (0, we._)`${c.code.formats}${(0, we.getProperty)(a)}` : void 0, X = r.scopeValue("formats", { key: a, ref: j, code: q });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, we._)`${X}.validate`] : ["string", j, X];
      }
      function R() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, we._)`await ${m}(${n})`;
        }
        return typeof _ == "function" ? (0, we._)`${m}(${n})` : (0, we._)`${m}.test(${n})`;
      }
    }
  }
};
Ka.default = Np;
Object.defineProperty(qa, "__esModule", { value: !0 });
const Op = Ka, Rp = [Op.default];
qa.default = Rp;
var dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.contentVocabulary = dr.metadataVocabulary = void 0;
dr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
dr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ma, "__esModule", { value: !0 });
const Tp = pa, Ip = $a, jp = Ta, Ap = qa, di = dr, kp = [
  Tp.default,
  Ip.default,
  (0, jp.default)(),
  Ap.default,
  di.metadataVocabulary,
  di.contentVocabulary
];
ma.default = kp;
var Ga = {}, Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.DiscrError = void 0;
var fi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(fi || (Gn.DiscrError = fi = {}));
Object.defineProperty(Ga, "__esModule", { value: !0 });
const xt = ie, Rs = Gn, hi = Ge, Cp = hr, Dp = U, Mp = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Rs.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, xt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Lp = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Mp,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: i } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!i)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, xt._)`${r}${(0, xt.getProperty)(l)}`);
    t.if((0, xt._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Rs.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const y = S();
      t.if(!1);
      for (const v in y)
        t.elseIf((0, xt._)`${d} === ${v}`), t.assign(c, h(y[v]));
      t.else(), e.error(!1, { discrError: Rs.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(y) {
      const v = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: y }, v);
      return e.mergeEvaluated(g, xt.Name), v;
    }
    function S() {
      var y;
      const v = {}, g = m(s);
      let _ = !0;
      for (let R = 0; R < i.length; R++) {
        let j = i[R];
        if (j != null && j.$ref && !(0, Dp.schemaHasRulesButRef)(j, a.self.RULES)) {
          const X = j.$ref;
          if (j = hi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), j instanceof hi.SchemaEnv && (j = j.schema), j === void 0)
            throw new Cp.default(a.opts.uriResolver, a.baseId, X);
        }
        const q = (y = j == null ? void 0 : j.properties) === null || y === void 0 ? void 0 : y[l];
        if (typeof q != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        _ = _ && (g || m(j)), w(q, R);
      }
      if (!_)
        throw new Error(`discriminator: "${l}" must be required`);
      return v;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function w(R, j) {
        if (R.const)
          N(R.const, j);
        else if (R.enum)
          for (const q of R.enum)
            N(q, j);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, j) {
        if (typeof R != "string" || R in v)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        v[R] = j;
      }
    }
  }
};
Ga.default = Lp;
const Fp = "http://json-schema.org/draft-07/schema#", Vp = "http://json-schema.org/draft-07/schema#", Up = "Core schema meta-schema", zp = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, qp = [
  "object",
  "boolean"
], Kp = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Gp = {
  $schema: Fp,
  $id: Vp,
  title: Up,
  definitions: zp,
  type: qp,
  properties: Kp,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Pc, n = ma, s = Ga, a = Gp, i = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(a, i) : a;
      this.addMetaSchema(v, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = st;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = ie;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = Gr;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var S = hr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return S.default;
  } });
})(ws, ws.exports);
var Hp = ws.exports, Ts = { exports: {} }, Sl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(K, Q) {
    return { validate: K, compare: Q };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, i),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c, d),
    "date-time": t(h, S),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: g,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: le,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: m,
    // signed 32 bit integer
    int32: { type: "number", validate: R },
    // signed 64 bit integer
    int64: { type: "number", validate: j },
    // C-type float
    float: { type: "number", validate: q },
    // C-type double
    double: { type: "number", validate: q },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, i),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, S),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(K) {
    return K % 4 === 0 && (K % 100 !== 0 || K % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(K) {
    const Q = n.exec(K);
    if (!Q)
      return !1;
    const ce = +Q[1], x = +Q[2], ne = +Q[3];
    return x >= 1 && x <= 12 && ne >= 1 && ne <= (x === 2 && r(ce) ? 29 : s[x]);
  }
  function i(K, Q) {
    if (K && Q)
      return K > Q ? 1 : K < Q ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
  function c(K, Q) {
    const ce = l.exec(K);
    if (!ce)
      return !1;
    const x = +ce[1], ne = +ce[2], M = +ce[3], L = ce[5];
    return (x <= 23 && ne <= 59 && M <= 59 || x === 23 && ne === 59 && M === 60) && (!Q || L !== "");
  }
  function d(K, Q) {
    if (!(K && Q))
      return;
    const ce = l.exec(K), x = l.exec(Q);
    if (ce && x)
      return K = ce[1] + ce[2] + ce[3] + (ce[4] || ""), Q = x[1] + x[2] + x[3] + (x[4] || ""), K > Q ? 1 : K < Q ? -1 : 0;
  }
  const u = /t|\s/i;
  function h(K) {
    const Q = K.split(u);
    return Q.length === 2 && a(Q[0]) && c(Q[1], !0);
  }
  function S(K, Q) {
    if (!(K && Q))
      return;
    const [ce, x] = K.split(u), [ne, M] = Q.split(u), L = i(ce, ne);
    if (L !== void 0)
      return L || d(x, M);
  }
  const y = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function g(K) {
    return y.test(K) && v.test(K);
  }
  const _ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function m(K) {
    return _.lastIndex = 0, _.test(K);
  }
  const w = -2147483648, N = 2 ** 31 - 1;
  function R(K) {
    return Number.isInteger(K) && K <= N && K >= w;
  }
  function j(K) {
    return Number.isInteger(K);
  }
  function q() {
    return !0;
  }
  const X = /[^\\]\\Z/;
  function le(K) {
    if (X.test(K))
      return !1;
    try {
      return new RegExp(K), !0;
    } catch {
      return !1;
    }
  }
})(Sl);
var bl = {}, Is = { exports: {} }, Pl = {}, mt = {}, Ft = {}, Br = {}, se = {}, qr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...w) {
    const N = [m[0]];
    let R = 0;
    for (; R < w.length; )
      l(N, w[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function i(m, ...w) {
    const N = [y(m[0])];
    let R = 0;
    for (; R < w.length; )
      N.push(a), l(N, w[R]), N.push(a, y(m[++R]));
    return c(N), new n(N);
  }
  e.str = i;
  function l(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(h(w));
  }
  e.addCodeArg = l;
  function c(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === a) {
        const N = d(m[w - 1], m[w + 1]);
        if (N !== void 0) {
          m.splice(w - 1, 3, N);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function d(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function u(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : i`${m}${w}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
  }
  function S(m) {
    return new n(y(m));
  }
  e.stringify = S;
  function y(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = y;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = v;
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function _(m) {
    return new n(m.toString());
  }
  e.regexpCode = _;
})(qr);
var js = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = qr;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const i = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? i : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const S = this.toName(d), { prefix: y } = S, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let g = this._values[y];
      if (g) {
        const w = g.get(v);
        if (w)
          return w;
      } else
        g = this._values[y] = /* @__PURE__ */ new Map();
      g.set(v, S);
      const _ = this._scope[y] || (this._scope[y] = []), m = _.length;
      return _[m] = u.ref, S.setValue(u, { property: y, itemIndex: m }), S;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (S) => {
        if (S.value === void 0)
          throw new Error(`CodeGen: name "${S}" has no value`);
        return S.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, S) {
      let y = t.nil;
      for (const v in d) {
        const g = d[v];
        if (!g)
          continue;
        const _ = h[v] = h[v] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
          if (_.has(m))
            return;
          _.set(m, n.Started);
          let w = u(m);
          if (w) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            y = (0, t._)`${y}${N} ${m} = ${w};${this.opts._n}`;
          } else if (w = S == null ? void 0 : S(m))
            y = (0, t._)`${y}${w}${this.opts._n}`;
          else
            throw new r(m);
          _.set(m, n.Completed);
        });
      }
      return y;
    }
  }
  e.ValueScope = l;
})(js);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = qr, r = js;
  var n = qr;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = js;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(o, f) {
      return this;
    }
  }
  class i extends a {
    constructor(o, f, P) {
      super(), this.varKind = o, this.name = f, this.rhs = P;
    }
    render({ es5: o, _n: f }) {
      const P = o ? r.varKinds.var : this.varKind, k = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${P} ${this.name}${k};` + f;
    }
    optimizeNames(o, f) {
      if (o[this.name.str])
        return this.rhs && (this.rhs = M(this.rhs, o, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(o, f, P) {
      super(), this.lhs = o, this.rhs = f, this.sideEffects = P;
    }
    render({ _n: o }) {
      return `${this.lhs} = ${this.rhs};` + o;
    }
    optimizeNames(o, f) {
      if (!(this.lhs instanceof t.Name && !o[this.lhs.str] && !this.sideEffects))
        return this.rhs = M(this.rhs, o, f), this;
    }
    get names() {
      const o = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ne(o, this.rhs);
    }
  }
  class c extends l {
    constructor(o, f, P, k) {
      super(o, P, k), this.op = f;
    }
    render({ _n: o }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + o;
    }
  }
  class d extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `${this.label}:` + o;
    }
  }
  class u extends a {
    constructor(o) {
      super(), this.label = o, this.names = {};
    }
    render({ _n: o }) {
      return `break${this.label ? ` ${this.label}` : ""};` + o;
    }
  }
  class h extends a {
    constructor(o) {
      super(), this.error = o;
    }
    render({ _n: o }) {
      return `throw ${this.error};` + o;
    }
    get names() {
      return this.error.names;
    }
  }
  class S extends a {
    constructor(o) {
      super(), this.code = o;
    }
    render({ _n: o }) {
      return `${this.code};` + o;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(o, f) {
      return this.code = M(this.code, o, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class y extends a {
    constructor(o = []) {
      super(), this.nodes = o;
    }
    render(o) {
      return this.nodes.reduce((f, P) => f + P.render(o), "");
    }
    optimizeNodes() {
      const { nodes: o } = this;
      let f = o.length;
      for (; f--; ) {
        const P = o[f].optimizeNodes();
        Array.isArray(P) ? o.splice(f, 1, ...P) : P ? o[f] = P : o.splice(f, 1);
      }
      return o.length > 0 ? this : void 0;
    }
    optimizeNames(o, f) {
      const { nodes: P } = this;
      let k = P.length;
      for (; k--; ) {
        const C = P[k];
        C.optimizeNames(o, f) || (L(o, C.names), P.splice(k, 1));
      }
      return P.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((o, f) => x(o, f.names), {});
    }
  }
  class v extends y {
    render(o) {
      return "{" + o._n + super.render(o) + "}" + o._n;
    }
  }
  class g extends y {
  }
  class _ extends v {
  }
  _.kind = "else";
  class m extends v {
    constructor(o, f) {
      super(f), this.condition = o;
    }
    render(o) {
      let f = `if(${this.condition})` + super.render(o);
      return this.else && (f += "else " + this.else.render(o)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const o = this.condition;
      if (o === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const P = f.optimizeNodes();
        f = this.else = Array.isArray(P) ? new _(P) : P;
      }
      if (f)
        return o === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(H(o), f instanceof m ? [f] : f.nodes);
      if (!(o === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(o, f) {
      var P;
      if (this.else = (P = this.else) === null || P === void 0 ? void 0 : P.optimizeNames(o, f), !!(super.optimizeNames(o, f) || this.else))
        return this.condition = M(this.condition, o, f), this;
    }
    get names() {
      const o = super.names;
      return ne(o, this.condition), this.else && x(o, this.else.names), o;
    }
  }
  m.kind = "if";
  class w extends v {
  }
  w.kind = "for";
  class N extends w {
    constructor(o) {
      super(), this.iteration = o;
    }
    render(o) {
      return `for(${this.iteration})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iteration = M(this.iteration, o, f), this;
    }
    get names() {
      return x(super.names, this.iteration.names);
    }
  }
  class R extends w {
    constructor(o, f, P, k) {
      super(), this.varKind = o, this.name = f, this.from = P, this.to = k;
    }
    render(o) {
      const f = o.es5 ? r.varKinds.var : this.varKind, { name: P, from: k, to: C } = this;
      return `for(${f} ${P}=${k}; ${P}<${C}; ${P}++)` + super.render(o);
    }
    get names() {
      const o = ne(super.names, this.from);
      return ne(o, this.to);
    }
  }
  class j extends w {
    constructor(o, f, P, k) {
      super(), this.loop = o, this.varKind = f, this.name = P, this.iterable = k;
    }
    render(o) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(o);
    }
    optimizeNames(o, f) {
      if (super.optimizeNames(o, f))
        return this.iterable = M(this.iterable, o, f), this;
    }
    get names() {
      return x(super.names, this.iterable.names);
    }
  }
  class q extends v {
    constructor(o, f, P) {
      super(), this.name = o, this.args = f, this.async = P;
    }
    render(o) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(o);
    }
  }
  q.kind = "func";
  class X extends y {
    render(o) {
      return "return " + super.render(o);
    }
  }
  X.kind = "return";
  class le extends v {
    render(o) {
      let f = "try" + super.render(o);
      return this.catch && (f += this.catch.render(o)), this.finally && (f += this.finally.render(o)), f;
    }
    optimizeNodes() {
      var o, f;
      return super.optimizeNodes(), (o = this.catch) === null || o === void 0 || o.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(o, f) {
      var P, k;
      return super.optimizeNames(o, f), (P = this.catch) === null || P === void 0 || P.optimizeNames(o, f), (k = this.finally) === null || k === void 0 || k.optimizeNames(o, f), this;
    }
    get names() {
      const o = super.names;
      return this.catch && x(o, this.catch.names), this.finally && x(o, this.finally.names), o;
    }
  }
  class K extends v {
    constructor(o) {
      super(), this.error = o;
    }
    render(o) {
      return `catch(${this.error})` + super.render(o);
    }
  }
  K.kind = "catch";
  class Q extends v {
    render(o) {
      return "finally" + super.render(o);
    }
  }
  Q.kind = "finally";
  class ce {
    constructor(o, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = o, this._scope = new r.Scope({ parent: o }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(o) {
      return this._scope.name(o);
    }
    // reserves unique name in the external scope
    scopeName(o) {
      return this._extScope.name(o);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(o, f) {
      const P = this._extScope.value(o, f);
      return (this._values[P.prefix] || (this._values[P.prefix] = /* @__PURE__ */ new Set())).add(P), P;
    }
    getScopeValue(o, f) {
      return this._extScope.getValue(o, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(o) {
      return this._extScope.scopeRefs(o, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(o, f, P, k) {
      const C = this._scope.toName(f);
      return P !== void 0 && k && (this._constants[C.str] = P), this._leafNode(new i(o, C, P)), C;
    }
    // `const` declaration (`var` in es5 mode)
    const(o, f, P) {
      return this._def(r.varKinds.const, o, f, P);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(o, f, P) {
      return this._def(r.varKinds.let, o, f, P);
    }
    // `var` declaration with optional assignment
    var(o, f, P) {
      return this._def(r.varKinds.var, o, f, P);
    }
    // assignment code
    assign(o, f, P) {
      return this._leafNode(new l(o, f, P));
    }
    // `+=` code
    add(o, f) {
      return this._leafNode(new c(o, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(o) {
      return typeof o == "function" ? o() : o !== t.nil && this._leafNode(new S(o)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...o) {
      const f = ["{"];
      for (const [P, k] of o)
        f.length > 1 && f.push(","), f.push(P), (P !== k || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, k));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(o, f, P) {
      if (this._blockNode(new m(o)), f && P)
        this.code(f).else().code(P).endIf();
      else if (f)
        this.code(f).endIf();
      else if (P)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(o) {
      return this._elseNode(new m(o));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, _);
    }
    _for(o, f) {
      return this._blockNode(o), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(o, f) {
      return this._for(new N(o), f);
    }
    // `for` statement for a range of values
    forRange(o, f, P, k, C = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const W = this._scope.toName(o);
      return this._for(new R(C, W, f, P), () => k(W));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(o, f, P, k = r.varKinds.const) {
      const C = this._scope.toName(o);
      if (this.opts.es5) {
        const W = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${W}.length`, (G) => {
          this.var(C, (0, t._)`${W}[${G}]`), P(C);
        });
      }
      return this._for(new j("of", k, C, f), () => P(C));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(o, f, P, k = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(o, (0, t._)`Object.keys(${f})`, P);
      const C = this._scope.toName(o);
      return this._for(new j("in", k, C, f), () => P(C));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(o) {
      return this._leafNode(new d(o));
    }
    // `break` statement
    break(o) {
      return this._leafNode(new u(o));
    }
    // `return` statement
    return(o) {
      const f = new X();
      if (this._blockNode(f), this.code(o), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(X);
    }
    // `try` statement
    try(o, f, P) {
      if (!f && !P)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const k = new le();
      if (this._blockNode(k), this.code(o), f) {
        const C = this.name("e");
        this._currNode = k.catch = new K(C), f(C);
      }
      return P && (this._currNode = k.finally = new Q(), this.code(P)), this._endBlockNode(K, Q);
    }
    // `throw` statement
    throw(o) {
      return this._leafNode(new h(o));
    }
    // start self-balancing block
    block(o, f) {
      return this._blockStarts.push(this._nodes.length), o && this.code(o).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(o) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const P = this._nodes.length - f;
      if (P < 0 || o !== void 0 && P !== o)
        throw new Error(`CodeGen: wrong number of nodes: ${P} vs ${o} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(o, f = t.nil, P, k) {
      return this._blockNode(new q(o, f, P)), k && this.code(k).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(q);
    }
    optimize(o = 1) {
      for (; o-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(o) {
      return this._currNode.nodes.push(o), this;
    }
    _blockNode(o) {
      this._currNode.nodes.push(o), this._nodes.push(o);
    }
    _endBlockNode(o, f) {
      const P = this._currNode;
      if (P instanceof o || f && P instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${o.kind}/${f.kind}` : o.kind}"`);
    }
    _elseNode(o) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = o, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const o = this._nodes;
      return o[o.length - 1];
    }
    set _currNode(o) {
      const f = this._nodes;
      f[f.length - 1] = o;
    }
  }
  e.CodeGen = ce;
  function x($, o) {
    for (const f in o)
      $[f] = ($[f] || 0) + (o[f] || 0);
    return $;
  }
  function ne($, o) {
    return o instanceof t._CodeOrName ? x($, o.names) : $;
  }
  function M($, o, f) {
    if ($ instanceof t.Name)
      return P($);
    if (!k($))
      return $;
    return new t._Code($._items.reduce((C, W) => (W instanceof t.Name && (W = P(W)), W instanceof t._Code ? C.push(...W._items) : C.push(W), C), []));
    function P(C) {
      const W = f[C.str];
      return W === void 0 || o[C.str] !== 1 ? C : (delete o[C.str], W);
    }
    function k(C) {
      return C instanceof t._Code && C._items.some((W) => W instanceof t.Name && o[W.str] === 1 && f[W.str] !== void 0);
    }
  }
  function L($, o) {
    for (const f in o)
      $[f] = ($[f] || 0) - (o[f] || 0);
  }
  function H($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${b($)}`;
  }
  e.not = H;
  const V = p(e.operators.AND);
  function I(...$) {
    return $.reduce(V);
  }
  e.and = I;
  const A = p(e.operators.OR);
  function E(...$) {
    return $.reduce(A);
  }
  e.or = E;
  function p($) {
    return (o, f) => o === t.nil ? f : f === t.nil ? o : (0, t._)`${b(o)} ${$} ${b(f)}`;
  }
  function b($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(se);
var z = {};
Object.defineProperty(z, "__esModule", { value: !0 });
z.checkStrictMode = z.getErrorPath = z.Type = z.useFunc = z.setEvaluated = z.evaluatedPropsToName = z.mergeEvaluated = z.eachItem = z.unescapeJsonPointer = z.escapeJsonPointer = z.escapeFragment = z.unescapeFragment = z.schemaRefOrVal = z.schemaHasRulesButRef = z.schemaHasRules = z.checkUnknownRules = z.alwaysValidSchema = z.toHash = void 0;
const me = se, Bp = qr;
function Wp(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
z.toHash = Wp;
function Jp(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Nl(e, t), !Ol(t, e.self.RULES.all));
}
z.alwaysValidSchema = Jp;
function Nl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Il(e, `unknown keyword: "${a}"`);
}
z.checkUnknownRules = Nl;
function Ol(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
z.schemaHasRules = Ol;
function Xp(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
z.schemaHasRulesButRef = Xp;
function Yp({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, me._)`${r}`;
  }
  return (0, me._)`${e}${t}${(0, me.getProperty)(n)}`;
}
z.schemaRefOrVal = Yp;
function Qp(e) {
  return Rl(decodeURIComponent(e));
}
z.unescapeFragment = Qp;
function Zp(e) {
  return encodeURIComponent(Ha(e));
}
z.escapeFragment = Zp;
function Ha(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
z.escapeJsonPointer = Ha;
function Rl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
z.unescapeJsonPointer = Rl;
function xp(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
z.eachItem = xp;
function mi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, i, l) => {
    const c = i === void 0 ? a : i instanceof me.Name ? (a instanceof me.Name ? e(s, a, i) : t(s, a, i), i) : a instanceof me.Name ? (t(s, i, a), a) : r(a, i);
    return l === me.Name && !(c instanceof me.Name) ? n(s, c) : c;
  };
}
z.mergeEvaluated = {
  props: mi({
    mergeNames: (e, t, r) => e.if((0, me._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, me._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, me._)`${r} || {}`).code((0, me._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, me._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, me._)`${r} || {}`), Ba(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Tl
  }),
  items: mi({
    mergeNames: (e, t, r) => e.if((0, me._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, me._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, me._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, me._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Tl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, me._)`{}`);
  return t !== void 0 && Ba(e, r, t), r;
}
z.evaluatedPropsToName = Tl;
function Ba(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, me._)`${t}${(0, me.getProperty)(n)}`, !0));
}
z.setEvaluated = Ba;
const pi = {};
function ey(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: pi[t.code] || (pi[t.code] = new Bp._Code(t.code))
  });
}
z.useFunc = ey;
var As;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(As || (z.Type = As = {}));
function ty(e, t, r) {
  if (e instanceof me.Name) {
    const n = t === As.Num;
    return r ? n ? (0, me._)`"[" + ${e} + "]"` : (0, me._)`"['" + ${e} + "']"` : n ? (0, me._)`"/" + ${e}` : (0, me._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, me.getProperty)(e).toString() : "/" + Ha(e);
}
z.getErrorPath = ty;
function Il(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
z.checkStrictMode = Il;
var an = {}, yi;
function At() {
  if (yi) return an;
  yi = 1, Object.defineProperty(an, "__esModule", { value: !0 });
  const e = se, t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return an.default = t, an;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = se, r = z, n = At();
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: m }) => m ? (0, t.str)`"${_}" keyword must be ${m} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, m = e.keywordError, w, N) {
    const { it: R } = _, { gen: j, compositeRule: q, allErrors: X } = R, le = h(_, m, w);
    N ?? (q || X) ? c(j, le) : d(R, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(_, m = e.keywordError, w) {
    const { it: N } = _, { gen: R, compositeRule: j, allErrors: q } = N, X = h(_, m, w);
    c(R, X), j || q || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function i(_, m) {
    _.assign(n.default.errors, m), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(m, () => _.assign((0, t._)`${n.default.vErrors}.length`, m), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = i;
  function l({ gen: _, keyword: m, schemaValue: w, data: N, errsCount: R, it: j }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const q = _.name("err");
    _.forRange("i", R, n.default.errors, (X) => {
      _.const(q, (0, t._)`${n.default.vErrors}[${X}]`), _.if((0, t._)`${q}.instancePath === undefined`, () => _.assign((0, t._)`${q}.instancePath`, (0, t.strConcat)(n.default.instancePath, j.errorPath))), _.assign((0, t._)`${q}.schemaPath`, (0, t.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (_.assign((0, t._)`${q}.schema`, w), _.assign((0, t._)`${q}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(_, m) {
    const w = _.const("err", m);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function d(_, m) {
    const { gen: w, validateName: N, schemaEnv: R } = _;
    R.$async ? w.throw((0, t._)`new ${_.ValidationError}(${m})`) : (w.assign((0, t._)`${N}.errors`, m), w.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(_, m, w) {
    const { createErrors: N } = _.it;
    return N === !1 ? (0, t._)`{}` : S(_, m, w);
  }
  function S(_, m, w = {}) {
    const { gen: N, it: R } = _, j = [
      y(R, w),
      v(_, w)
    ];
    return g(_, m, j), N.object(...j);
  }
  function y({ errorPath: _ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${_}${(0, r.getErrorPath)(m, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: _, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${_}`;
    return w && (R = (0, t.str)`${R}${(0, r.getErrorPath)(w, r.Type.Str)}`), [u.schemaPath, R];
  }
  function g(_, { params: m, message: w }, N) {
    const { keyword: R, data: j, schemaValue: q, it: X } = _, { opts: le, propertyName: K, topSchemaRef: Q, schemaPath: ce } = X;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(_) : m || (0, t._)`{}`]), le.messages && N.push([u.message, typeof w == "function" ? w(_) : w]), le.verbose && N.push([u.schema, q], [u.parentSchema, (0, t._)`${Q}${ce}`], [n.default.data, j]), K && N.push([u.propertyName, K]);
  }
})(Br);
var $i;
function ry() {
  if ($i) return Ft;
  $i = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.boolOrEmptySchema = Ft.topBoolOrEmptySchema = void 0;
  const e = Br, t = se, r = At(), n = {
    message: "boolean schema is false"
  };
  function s(l) {
    const { gen: c, schema: d, validateName: u } = l;
    d === !1 ? i(l, !1) : typeof d == "object" && d.$async === !0 ? c.return(r.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  Ft.topBoolOrEmptySchema = s;
  function a(l, c) {
    const { gen: d, schema: u } = l;
    u === !1 ? (d.var(c, !1), i(l)) : d.var(c, !0);
  }
  Ft.boolOrEmptySchema = a;
  function i(l, c) {
    const { gen: d, data: u } = l, h = {
      gen: d,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: l
    };
    (0, e.reportError)(h, n, void 0, c);
  }
  return Ft;
}
var be = {}, Wt = {};
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.getRules = Wt.isJSONType = void 0;
const ny = ["string", "number", "integer", "boolean", "null", "object", "array"], sy = new Set(ny);
function ay(e) {
  return typeof e == "string" && sy.has(e);
}
Wt.isJSONType = ay;
function oy() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Wt.getRules = oy;
var pt = {}, _i;
function jl() {
  if (_i) return pt;
  _i = 1, Object.defineProperty(pt, "__esModule", { value: !0 }), pt.shouldUseRule = pt.shouldUseGroup = pt.schemaHasRulesForType = void 0;
  function e({ schema: n, self: s }, a) {
    const i = s.RULES.types[a];
    return i && i !== !0 && t(n, i);
  }
  pt.schemaHasRulesForType = e;
  function t(n, s) {
    return s.rules.some((a) => r(n, a));
  }
  pt.shouldUseGroup = t;
  function r(n, s) {
    var a;
    return n[s.keyword] !== void 0 || ((a = s.definition.implements) === null || a === void 0 ? void 0 : a.some((i) => n[i] !== void 0));
  }
  return pt.shouldUseRule = r, pt;
}
Object.defineProperty(be, "__esModule", { value: !0 });
be.reportTypeError = be.checkDataTypes = be.checkDataType = be.coerceAndCheckDataType = be.getJSONTypes = be.getSchemaTypes = be.DataType = void 0;
const iy = Wt, cy = jl(), ly = Br, re = se, Al = z;
var or;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(or || (be.DataType = or = {}));
function uy(e) {
  const t = kl(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
be.getSchemaTypes = uy;
function kl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(iy.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
be.getJSONTypes = kl;
function dy(e, t) {
  const { gen: r, data: n, opts: s } = e, a = fy(t, s.coerceTypes), i = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, cy.schemaHasRulesForType)(e, t[0]));
  if (i) {
    const l = Wa(t, n, s.strictNumbers, or.Wrong);
    r.if(l, () => {
      a.length ? hy(e, t, a) : Ja(e);
    });
  }
  return i;
}
be.coerceAndCheckDataType = dy;
const Cl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function fy(e, t) {
  return t ? e.filter((r) => Cl.has(r) || t === "array" && r === "array") : [];
}
function hy(e, t, r) {
  const { gen: n, data: s, opts: a } = e, i = n.let("dataType", (0, re._)`typeof ${s}`), l = n.let("coerced", (0, re._)`undefined`);
  a.coerceTypes === "array" && n.if((0, re._)`${i} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, re._)`${s}[0]`).assign(i, (0, re._)`typeof ${s}`).if(Wa(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, re._)`${l} !== undefined`);
  for (const d of r)
    (Cl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Ja(e), n.endIf(), n.if((0, re._)`${l} !== undefined`, () => {
    n.assign(s, l), my(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, re._)`${i} == "number" || ${i} == "boolean"`).assign(l, (0, re._)`"" + ${s}`).elseIf((0, re._)`${s} === null`).assign(l, (0, re._)`""`);
        return;
      case "number":
        n.elseIf((0, re._)`${i} == "boolean" || ${s} === null
              || (${i} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, re._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, re._)`${i} === "boolean" || ${s} === null
              || (${i} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, re._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, re._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, re._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, re._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, re._)`${i} === "string" || ${i} === "number"
              || ${i} === "boolean" || ${s} === null`).assign(l, (0, re._)`[${s}]`);
    }
  }
}
function my({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, re._)`${t} !== undefined`, () => e.assign((0, re._)`${t}[${r}]`, n));
}
function ks(e, t, r, n = or.Correct) {
  const s = n === or.Correct ? re.operators.EQ : re.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, re._)`${t} ${s} null`;
    case "array":
      a = (0, re._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, re._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = i((0, re._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = i();
      break;
    default:
      return (0, re._)`typeof ${t} ${s} ${e}`;
  }
  return n === or.Correct ? a : (0, re.not)(a);
  function i(l = re.nil) {
    return (0, re.and)((0, re._)`typeof ${t} == "number"`, l, r ? (0, re._)`isFinite(${t})` : re.nil);
  }
}
be.checkDataType = ks;
function Wa(e, t, r, n) {
  if (e.length === 1)
    return ks(e[0], t, r, n);
  let s;
  const a = (0, Al.toHash)(e);
  if (a.array && a.object) {
    const i = (0, re._)`typeof ${t} != "object"`;
    s = a.null ? i : (0, re._)`!${t} || ${i}`, delete a.null, delete a.array, delete a.object;
  } else
    s = re.nil;
  a.number && delete a.integer;
  for (const i in a)
    s = (0, re.and)(s, ks(i, t, r, n));
  return s;
}
be.checkDataTypes = Wa;
const py = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, re._)`{type: ${e}}` : (0, re._)`{type: ${t}}`
};
function Ja(e) {
  const t = yy(e);
  (0, ly.reportError)(t, py);
}
be.reportTypeError = Ja;
function yy(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Al.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var br = {}, gi;
function $y() {
  if (gi) return br;
  gi = 1, Object.defineProperty(br, "__esModule", { value: !0 }), br.assignDefaults = void 0;
  const e = se, t = z;
  function r(s, a) {
    const { properties: i, items: l } = s.schema;
    if (a === "object" && i)
      for (const c in i)
        n(s, c, i[c].default);
    else a === "array" && Array.isArray(l) && l.forEach((c, d) => n(s, d, c.default));
  }
  br.assignDefaults = r;
  function n(s, a, i) {
    const { gen: l, compositeRule: c, data: d, opts: u } = s;
    if (i === void 0)
      return;
    const h = (0, e._)`${d}${(0, e.getProperty)(a)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${h}`);
      return;
    }
    let S = (0, e._)`${h} === undefined`;
    u.useDefaults === "empty" && (S = (0, e._)`${S} || ${h} === null || ${h} === ""`), l.if(S, (0, e._)`${h} = ${(0, e.stringify)(i)}`);
  }
  return br;
}
var Ze = {}, oe = {};
Object.defineProperty(oe, "__esModule", { value: !0 });
oe.validateUnion = oe.validateArray = oe.usePattern = oe.callValidateCode = oe.schemaProperties = oe.allSchemaProperties = oe.noPropertyInData = oe.propertyInData = oe.isOwnProperty = oe.hasPropFunc = oe.reportMissingProp = oe.checkMissingProp = oe.checkReportMissingProp = void 0;
const $e = se, Xa = z, Et = At(), _y = z;
function gy(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Qa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, $e._)`${t}` }, !0), e.error();
  });
}
oe.checkReportMissingProp = gy;
function vy({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, $e.or)(...n.map((a) => (0, $e.and)(Qa(e, t, a, r.ownProperties), (0, $e._)`${s} = ${a}`)));
}
oe.checkMissingProp = vy;
function wy(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
oe.reportMissingProp = wy;
function Dl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, $e._)`Object.prototype.hasOwnProperty`
  });
}
oe.hasPropFunc = Dl;
function Ya(e, t, r) {
  return (0, $e._)`${Dl(e)}.call(${t}, ${r})`;
}
oe.isOwnProperty = Ya;
function Ey(e, t, r, n) {
  const s = (0, $e._)`${t}${(0, $e.getProperty)(r)} !== undefined`;
  return n ? (0, $e._)`${s} && ${Ya(e, t, r)}` : s;
}
oe.propertyInData = Ey;
function Qa(e, t, r, n) {
  const s = (0, $e._)`${t}${(0, $e.getProperty)(r)} === undefined`;
  return n ? (0, $e.or)(s, (0, $e.not)(Ya(e, t, r))) : s;
}
oe.noPropertyInData = Qa;
function Ml(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
oe.allSchemaProperties = Ml;
function Sy(e, t) {
  return Ml(t).filter((r) => !(0, Xa.alwaysValidSchema)(e, t[r]));
}
oe.schemaProperties = Sy;
function by({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: i }, l, c, d) {
  const u = d ? (0, $e._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Et.default.instancePath, (0, $e.strConcat)(Et.default.instancePath, a)],
    [Et.default.parentData, i.parentData],
    [Et.default.parentDataProperty, i.parentDataProperty],
    [Et.default.rootData, Et.default.rootData]
  ];
  i.opts.dynamicRef && h.push([Et.default.dynamicAnchors, Et.default.dynamicAnchors]);
  const S = (0, $e._)`${u}, ${r.object(...h)}`;
  return c !== $e.nil ? (0, $e._)`${l}.call(${c}, ${S})` : (0, $e._)`${l}(${S})`;
}
oe.callValidateCode = by;
const Py = (0, $e._)`new RegExp`;
function Ny({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, $e._)`${s.code === "new RegExp" ? Py : (0, _y.useFunc)(e, s)}(${r}, ${n})`
  });
}
oe.usePattern = Ny;
function Oy(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return i(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), i(() => t.break()), a;
  function i(l) {
    const c = t.const("len", (0, $e._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Xa.Type.Num
      }, a), t.if((0, $e.not)(a), l);
    });
  }
}
oe.validateArray = Oy;
function Ry(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Xa.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const i = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(i, (0, $e._)`${i} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, $e.not)(i));
  })), e.result(i, () => e.reset(), () => e.error(!0));
}
oe.validateUnion = Ry;
var vi;
function Ty() {
  if (vi) return Ze;
  vi = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.validateKeywordUsage = Ze.validSchemaType = Ze.funcKeywordCode = Ze.macroKeywordCode = void 0;
  const e = se, t = At(), r = oe, n = Br;
  function s(S, y) {
    const { gen: v, keyword: g, schema: _, parentSchema: m, it: w } = S, N = y.macro.call(w.self, _, m, w), R = d(v, g, N);
    w.opts.validateSchema !== !1 && w.self.validateSchema(N, !0);
    const j = v.name("valid");
    S.subschema({
      schema: N,
      schemaPath: e.nil,
      errSchemaPath: `${w.errSchemaPath}/${g}`,
      topSchemaRef: R,
      compositeRule: !0
    }, j), S.pass(j, () => S.error(!0));
  }
  Ze.macroKeywordCode = s;
  function a(S, y) {
    var v;
    const { gen: g, keyword: _, schema: m, parentSchema: w, $data: N, it: R } = S;
    c(R, y);
    const j = !N && y.compile ? y.compile.call(R.self, m, w, R) : y.validate, q = d(g, _, j), X = g.let("valid");
    S.block$data(X, le), S.ok((v = y.valid) !== null && v !== void 0 ? v : X);
    function le() {
      if (y.errors === !1)
        ce(), y.modifying && i(S), x(() => S.error());
      else {
        const ne = y.async ? K() : Q();
        y.modifying && i(S), x(() => l(S, ne));
      }
    }
    function K() {
      const ne = g.let("ruleErrs", null);
      return g.try(() => ce((0, e._)`await `), (M) => g.assign(X, !1).if((0, e._)`${M} instanceof ${R.ValidationError}`, () => g.assign(ne, (0, e._)`${M}.errors`), () => g.throw(M))), ne;
    }
    function Q() {
      const ne = (0, e._)`${q}.errors`;
      return g.assign(ne, null), ce(e.nil), ne;
    }
    function ce(ne = y.async ? (0, e._)`await ` : e.nil) {
      const M = R.opts.passContext ? t.default.this : t.default.self, L = !("compile" in y && !N || y.schema === !1);
      g.assign(X, (0, e._)`${ne}${(0, r.callValidateCode)(S, q, M, L)}`, y.modifying);
    }
    function x(ne) {
      var M;
      g.if((0, e.not)((M = y.valid) !== null && M !== void 0 ? M : X), ne);
    }
  }
  Ze.funcKeywordCode = a;
  function i(S) {
    const { gen: y, data: v, it: g } = S;
    y.if(g.parentData, () => y.assign(v, (0, e._)`${g.parentData}[${g.parentDataProperty}]`));
  }
  function l(S, y) {
    const { gen: v } = S;
    v.if((0, e._)`Array.isArray(${y})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${y} : ${t.default.vErrors}.concat(${y})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(S);
    }, () => S.error());
  }
  function c({ schemaEnv: S }, y) {
    if (y.async && !S.$async)
      throw new Error("async keyword in sync schema");
  }
  function d(S, y, v) {
    if (v === void 0)
      throw new Error(`keyword "${y}" failed to compile`);
    return S.scopeValue("keyword", typeof v == "function" ? { ref: v } : { ref: v, code: (0, e.stringify)(v) });
  }
  function u(S, y, v = !1) {
    return !y.length || y.some((g) => g === "array" ? Array.isArray(S) : g === "object" ? S && typeof S == "object" && !Array.isArray(S) : typeof S == g || v && typeof S > "u");
  }
  Ze.validSchemaType = u;
  function h({ schema: S, opts: y, self: v, errSchemaPath: g }, _, m) {
    if (Array.isArray(_.keyword) ? !_.keyword.includes(m) : _.keyword !== m)
      throw new Error("ajv implementation error");
    const w = _.dependencies;
    if (w != null && w.some((N) => !Object.prototype.hasOwnProperty.call(S, N)))
      throw new Error(`parent schema must have dependencies of ${m}: ${w.join(",")}`);
    if (_.validateSchema && !_.validateSchema(S[m])) {
      const R = `keyword "${m}" value is invalid at path "${g}": ` + v.errorsText(_.validateSchema.errors);
      if (y.validateSchema === "log")
        v.logger.error(R);
      else
        throw new Error(R);
    }
  }
  return Ze.validateKeywordUsage = h, Ze;
}
var yt = {}, wi;
function Iy() {
  if (wi) return yt;
  wi = 1, Object.defineProperty(yt, "__esModule", { value: !0 }), yt.extendSubschemaMode = yt.extendSubschemaData = yt.getSubschema = void 0;
  const e = se, t = z;
  function r(a, { keyword: i, schemaProp: l, schema: c, schemaPath: d, errSchemaPath: u, topSchemaRef: h }) {
    if (i !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const S = a.schema[i];
      return l === void 0 ? {
        schema: S,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${a.errSchemaPath}/${i}`
      } : {
        schema: S[l],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(l)}`,
        errSchemaPath: `${a.errSchemaPath}/${i}/${(0, t.escapeFragment)(l)}`
      };
    }
    if (c !== void 0) {
      if (d === void 0 || u === void 0 || h === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: d,
        topSchemaRef: h,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  yt.getSubschema = r;
  function n(a, i, { dataProp: l, dataPropType: c, data: d, dataTypes: u, propertyName: h }) {
    if (d !== void 0 && l !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: S } = i;
    if (l !== void 0) {
      const { errorPath: v, dataPathArr: g, opts: _ } = i, m = S.let("data", (0, e._)`${i.data}${(0, e.getProperty)(l)}`, !0);
      y(m), a.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(l, c, _.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${l}`, a.dataPathArr = [...g, a.parentDataProperty];
    }
    if (d !== void 0) {
      const v = d instanceof e.Name ? d : S.let("data", d, !0);
      y(v), h !== void 0 && (a.propertyName = h);
    }
    u && (a.dataTypes = u);
    function y(v) {
      a.data = v, a.dataLevel = i.dataLevel + 1, a.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), a.parentData = i.data, a.dataNames = [...i.dataNames, v];
    }
  }
  yt.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: i, jtdMetadata: l, compositeRule: c, createErrors: d, allErrors: u }) {
    c !== void 0 && (a.compositeRule = c), d !== void 0 && (a.createErrors = d), u !== void 0 && (a.allErrors = u), a.jtdDiscriminator = i, a.jtdMetadata = l;
  }
  return yt.extendSubschemaMode = s, yt;
}
var Ae = {}, Ll = { exports: {} }, Tt = Ll.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Sn(t, n, s, e, "", e);
};
Tt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Tt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Tt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Tt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Sn(e, t, r, n, s, a, i, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, i, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Tt.arrayKeywords)
          for (var S = 0; S < h.length; S++)
            Sn(e, t, r, h[S], s + "/" + u + "/" + S, a, s, u, n, S);
      } else if (u in Tt.propsKeywords) {
        if (h && typeof h == "object")
          for (var y in h)
            Sn(e, t, r, h[y], s + "/" + u + "/" + jy(y), a, s, u, n, y);
      } else (u in Tt.keywords || e.allKeys && !(u in Tt.skipKeywords)) && Sn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, i, l, c, d);
  }
}
function jy(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Ay = Ll.exports;
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.getSchemaRefs = Ae.resolveUrl = Ae.normalizeId = Ae._getFullPath = Ae.getFullPath = Ae.inlineRef = void 0;
const ky = z, Cy = Vn, Dy = Ay, My = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Ly(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Cs(e) : t ? Fl(e) <= t : !1;
}
Ae.inlineRef = Ly;
const Fy = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Cs(e) {
  for (const t in e) {
    if (Fy.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Cs) || typeof r == "object" && Cs(r))
      return !0;
  }
  return !1;
}
function Fl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !My.has(r) && (typeof e[r] == "object" && (0, ky.eachItem)(e[r], (n) => t += Fl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Vl(e, t = "", r) {
  r !== !1 && (t = ir(t));
  const n = e.parse(t);
  return Ul(e, n);
}
Ae.getFullPath = Vl;
function Ul(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ae._getFullPath = Ul;
const Vy = /#\/?$/;
function ir(e) {
  return e ? e.replace(Vy, "") : "";
}
Ae.normalizeId = ir;
function Uy(e, t, r) {
  return r = ir(r), e.resolve(t, r);
}
Ae.resolveUrl = Uy;
const zy = /^[a-z_][-a-z0-9._]*$/i;
function qy(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = ir(e[r] || t), a = { "": s }, i = Vl(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Dy(e, { allKeys: !0 }, (h, S, y, v) => {
    if (v === void 0)
      return;
    const g = i + S;
    let _ = a[v];
    typeof h[r] == "string" && (_ = m.call(this, h[r])), w.call(this, h.$anchor), w.call(this, h.$dynamicAnchor), a[S] = _;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = ir(_ ? R(_, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let j = this.refs[N];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? d(h, j.schema, N) : N !== ir(g) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = g), N;
    }
    function w(N) {
      if (typeof N == "string") {
        if (!zy.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, S, y) {
    if (S !== void 0 && !Cy(h, S))
      throw u(y);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ae.getSchemaRefs = qy;
var Ei;
function Hn() {
  if (Ei) return mt;
  Ei = 1, Object.defineProperty(mt, "__esModule", { value: !0 }), mt.getData = mt.KeywordCxt = mt.validateFunctionCode = void 0;
  const e = ry(), t = be, r = jl(), n = be, s = $y(), a = Ty(), i = Iy(), l = se, c = At(), d = Ae, u = z, h = Br;
  function S(O) {
    if (j(O) && (X(O), R(O))) {
      _(O);
      return;
    }
    y(O, () => (0, e.topBoolOrEmptySchema)(O));
  }
  mt.validateFunctionCode = S;
  function y({ gen: O, validateName: T, schema: D, schemaEnv: F, opts: J }, ee) {
    J.code.es5 ? O.func(T, (0, l._)`${c.default.data}, ${c.default.valCxt}`, F.$async, () => {
      O.code((0, l._)`"use strict"; ${w(D, J)}`), g(O, J), O.code(ee);
    }) : O.func(T, (0, l._)`${c.default.data}, ${v(J)}`, F.$async, () => O.code(w(D, J)).code(ee));
  }
  function v(O) {
    return (0, l._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${O.dynamicRef ? (0, l._)`, ${c.default.dynamicAnchors}={}` : l.nil}}={}`;
  }
  function g(O, T) {
    O.if(c.default.valCxt, () => {
      O.var(c.default.instancePath, (0, l._)`${c.default.valCxt}.${c.default.instancePath}`), O.var(c.default.parentData, (0, l._)`${c.default.valCxt}.${c.default.parentData}`), O.var(c.default.parentDataProperty, (0, l._)`${c.default.valCxt}.${c.default.parentDataProperty}`), O.var(c.default.rootData, (0, l._)`${c.default.valCxt}.${c.default.rootData}`), T.dynamicRef && O.var(c.default.dynamicAnchors, (0, l._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      O.var(c.default.instancePath, (0, l._)`""`), O.var(c.default.parentData, (0, l._)`undefined`), O.var(c.default.parentDataProperty, (0, l._)`undefined`), O.var(c.default.rootData, c.default.data), T.dynamicRef && O.var(c.default.dynamicAnchors, (0, l._)`{}`);
    });
  }
  function _(O) {
    const { schema: T, opts: D, gen: F } = O;
    y(O, () => {
      D.$comment && T.$comment && ne(O), Q(O), F.let(c.default.vErrors, null), F.let(c.default.errors, 0), D.unevaluated && m(O), le(O), M(O);
    });
  }
  function m(O) {
    const { gen: T, validateName: D } = O;
    O.evaluated = T.const("evaluated", (0, l._)`${D}.evaluated`), T.if((0, l._)`${O.evaluated}.dynamicProps`, () => T.assign((0, l._)`${O.evaluated}.props`, (0, l._)`undefined`)), T.if((0, l._)`${O.evaluated}.dynamicItems`, () => T.assign((0, l._)`${O.evaluated}.items`, (0, l._)`undefined`));
  }
  function w(O, T) {
    const D = typeof O == "object" && O[T.schemaId];
    return D && (T.code.source || T.code.process) ? (0, l._)`/*# sourceURL=${D} */` : l.nil;
  }
  function N(O, T) {
    if (j(O) && (X(O), R(O))) {
      q(O, T);
      return;
    }
    (0, e.boolOrEmptySchema)(O, T);
  }
  function R({ schema: O, self: T }) {
    if (typeof O == "boolean")
      return !O;
    for (const D in O)
      if (T.RULES.all[D])
        return !0;
    return !1;
  }
  function j(O) {
    return typeof O.schema != "boolean";
  }
  function q(O, T) {
    const { schema: D, gen: F, opts: J } = O;
    J.$comment && D.$comment && ne(O), ce(O), x(O);
    const ee = F.const("_errs", c.default.errors);
    le(O, ee), F.var(T, (0, l._)`${ee} === ${c.default.errors}`);
  }
  function X(O) {
    (0, u.checkUnknownRules)(O), K(O);
  }
  function le(O, T) {
    if (O.opts.jtd)
      return H(O, [], !1, T);
    const D = (0, t.getSchemaTypes)(O.schema), F = (0, t.coerceAndCheckDataType)(O, D);
    H(O, D, !F, T);
  }
  function K(O) {
    const { schema: T, errSchemaPath: D, opts: F, self: J } = O;
    T.$ref && F.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(T, J.RULES) && J.logger.warn(`$ref: keywords ignored in schema at path "${D}"`);
  }
  function Q(O) {
    const { schema: T, opts: D } = O;
    T.default !== void 0 && D.useDefaults && D.strictSchema && (0, u.checkStrictMode)(O, "default is ignored in the schema root");
  }
  function ce(O) {
    const T = O.schema[O.opts.schemaId];
    T && (O.baseId = (0, d.resolveUrl)(O.opts.uriResolver, O.baseId, T));
  }
  function x(O) {
    if (O.schema.$async && !O.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function ne({ gen: O, schemaEnv: T, schema: D, errSchemaPath: F, opts: J }) {
    const ee = D.$comment;
    if (J.$comment === !0)
      O.code((0, l._)`${c.default.self}.logger.log(${ee})`);
    else if (typeof J.$comment == "function") {
      const ge = (0, l.str)`${F}/$comment`, De = O.scopeValue("root", { ref: T.root });
      O.code((0, l._)`${c.default.self}.opts.$comment(${ee}, ${ge}, ${De}.schema)`);
    }
  }
  function M(O) {
    const { gen: T, schemaEnv: D, validateName: F, ValidationError: J, opts: ee } = O;
    D.$async ? T.if((0, l._)`${c.default.errors} === 0`, () => T.return(c.default.data), () => T.throw((0, l._)`new ${J}(${c.default.vErrors})`)) : (T.assign((0, l._)`${F}.errors`, c.default.vErrors), ee.unevaluated && L(O), T.return((0, l._)`${c.default.errors} === 0`));
  }
  function L({ gen: O, evaluated: T, props: D, items: F }) {
    D instanceof l.Name && O.assign((0, l._)`${T}.props`, D), F instanceof l.Name && O.assign((0, l._)`${T}.items`, F);
  }
  function H(O, T, D, F) {
    const { gen: J, schema: ee, data: ge, allErrors: De, opts: Pe, self: Ne } = O, { RULES: ve } = Ne;
    if (ee.$ref && (Pe.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(ee, ve))) {
      J.block(() => k(O, "$ref", ve.all.$ref.definition));
      return;
    }
    Pe.jtd || I(O, T), J.block(() => {
      for (const ke of ve.rules)
        it(ke);
      it(ve.post);
    });
    function it(ke) {
      (0, r.shouldUseGroup)(ee, ke) && (ke.type ? (J.if((0, n.checkDataType)(ke.type, ge, Pe.strictNumbers)), V(O, ke), T.length === 1 && T[0] === ke.type && D && (J.else(), (0, n.reportTypeError)(O)), J.endIf()) : V(O, ke), De || J.if((0, l._)`${c.default.errors} === ${F || 0}`));
    }
  }
  function V(O, T) {
    const { gen: D, schema: F, opts: { useDefaults: J } } = O;
    J && (0, s.assignDefaults)(O, T.type), D.block(() => {
      for (const ee of T.rules)
        (0, r.shouldUseRule)(F, ee) && k(O, ee.keyword, ee.definition, T.type);
    });
  }
  function I(O, T) {
    O.schemaEnv.meta || !O.opts.strictTypes || (A(O, T), O.opts.allowUnionTypes || E(O, T), p(O, O.dataTypes));
  }
  function A(O, T) {
    if (T.length) {
      if (!O.dataTypes.length) {
        O.dataTypes = T;
        return;
      }
      T.forEach((D) => {
        $(O.dataTypes, D) || f(O, `type "${D}" not allowed by context "${O.dataTypes.join(",")}"`);
      }), o(O, T);
    }
  }
  function E(O, T) {
    T.length > 1 && !(T.length === 2 && T.includes("null")) && f(O, "use allowUnionTypes to allow union type keyword");
  }
  function p(O, T) {
    const D = O.self.RULES.all;
    for (const F in D) {
      const J = D[F];
      if (typeof J == "object" && (0, r.shouldUseRule)(O.schema, J)) {
        const { type: ee } = J.definition;
        ee.length && !ee.some((ge) => b(T, ge)) && f(O, `missing type "${ee.join(",")}" for keyword "${F}"`);
      }
    }
  }
  function b(O, T) {
    return O.includes(T) || T === "number" && O.includes("integer");
  }
  function $(O, T) {
    return O.includes(T) || T === "integer" && O.includes("number");
  }
  function o(O, T) {
    const D = [];
    for (const F of O.dataTypes)
      $(T, F) ? D.push(F) : T.includes("integer") && F === "number" && D.push("integer");
    O.dataTypes = D;
  }
  function f(O, T) {
    const D = O.schemaEnv.baseId + O.errSchemaPath;
    T += ` at "${D}" (strictTypes)`, (0, u.checkStrictMode)(O, T, O.opts.strictTypes);
  }
  class P {
    constructor(T, D, F) {
      if ((0, a.validateKeywordUsage)(T, D, F), this.gen = T.gen, this.allErrors = T.allErrors, this.keyword = F, this.data = T.data, this.schema = T.schema[F], this.$data = D.$data && T.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(T, this.schema, F, this.$data), this.schemaType = D.schemaType, this.parentSchema = T.schema, this.params = {}, this.it = T, this.def = D, this.$data)
        this.schemaCode = T.gen.const("vSchema", G(this.$data, T));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, D.schemaType, D.allowUndefined))
        throw new Error(`${F} value must be ${JSON.stringify(D.schemaType)}`);
      ("code" in D ? D.trackErrors : D.errors !== !1) && (this.errsCount = T.gen.const("_errs", c.default.errors));
    }
    result(T, D, F) {
      this.failResult((0, l.not)(T), D, F);
    }
    failResult(T, D, F) {
      this.gen.if(T), F ? F() : this.error(), D ? (this.gen.else(), D(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(T, D) {
      this.failResult((0, l.not)(T), void 0, D);
    }
    fail(T) {
      if (T === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(T), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(T) {
      if (!this.$data)
        return this.fail(T);
      const { schemaCode: D } = this;
      this.fail((0, l._)`${D} !== undefined && (${(0, l.or)(this.invalid$data(), T)})`);
    }
    error(T, D, F) {
      if (D) {
        this.setParams(D), this._error(T, F), this.setParams({});
        return;
      }
      this._error(T, F);
    }
    _error(T, D) {
      (T ? h.reportExtraError : h.reportError)(this, this.def.error, D);
    }
    $dataError() {
      (0, h.reportError)(this, this.def.$dataError || h.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, h.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(T) {
      this.allErrors || this.gen.if(T);
    }
    setParams(T, D) {
      D ? Object.assign(this.params, T) : this.params = T;
    }
    block$data(T, D, F = l.nil) {
      this.gen.block(() => {
        this.check$data(T, F), D();
      });
    }
    check$data(T = l.nil, D = l.nil) {
      if (!this.$data)
        return;
      const { gen: F, schemaCode: J, schemaType: ee, def: ge } = this;
      F.if((0, l.or)((0, l._)`${J} === undefined`, D)), T !== l.nil && F.assign(T, !0), (ee.length || ge.validateSchema) && (F.elseIf(this.invalid$data()), this.$dataError(), T !== l.nil && F.assign(T, !1)), F.else();
    }
    invalid$data() {
      const { gen: T, schemaCode: D, schemaType: F, def: J, it: ee } = this;
      return (0, l.or)(ge(), De());
      function ge() {
        if (F.length) {
          if (!(D instanceof l.Name))
            throw new Error("ajv implementation error");
          const Pe = Array.isArray(F) ? F : [F];
          return (0, l._)`${(0, n.checkDataTypes)(Pe, D, ee.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return l.nil;
      }
      function De() {
        if (J.validateSchema) {
          const Pe = T.scopeValue("validate$data", { ref: J.validateSchema });
          return (0, l._)`!${Pe}(${D})`;
        }
        return l.nil;
      }
    }
    subschema(T, D) {
      const F = (0, i.getSubschema)(this.it, T);
      (0, i.extendSubschemaData)(F, this.it, T), (0, i.extendSubschemaMode)(F, T);
      const J = { ...this.it, ...F, items: void 0, props: void 0 };
      return N(J, D), J;
    }
    mergeEvaluated(T, D) {
      const { it: F, gen: J } = this;
      F.opts.unevaluated && (F.props !== !0 && T.props !== void 0 && (F.props = u.mergeEvaluated.props(J, T.props, F.props, D)), F.items !== !0 && T.items !== void 0 && (F.items = u.mergeEvaluated.items(J, T.items, F.items, D)));
    }
    mergeValidEvaluated(T, D) {
      const { it: F, gen: J } = this;
      if (F.opts.unevaluated && (F.props !== !0 || F.items !== !0))
        return J.if(D, () => this.mergeEvaluated(T, l.Name)), !0;
    }
  }
  mt.KeywordCxt = P;
  function k(O, T, D, F) {
    const J = new P(O, D, T);
    "code" in D ? D.code(J, F) : J.$data && D.validate ? (0, a.funcKeywordCode)(J, D) : "macro" in D ? (0, a.macroKeywordCode)(J, D) : (D.compile || D.validate) && (0, a.funcKeywordCode)(J, D);
  }
  const C = /^\/(?:[^~]|~0|~1)*$/, W = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function G(O, { dataLevel: T, dataNames: D, dataPathArr: F }) {
    let J, ee;
    if (O === "")
      return c.default.rootData;
    if (O[0] === "/") {
      if (!C.test(O))
        throw new Error(`Invalid JSON-pointer: ${O}`);
      J = O, ee = c.default.rootData;
    } else {
      const Ne = W.exec(O);
      if (!Ne)
        throw new Error(`Invalid JSON-pointer: ${O}`);
      const ve = +Ne[1];
      if (J = Ne[2], J === "#") {
        if (ve >= T)
          throw new Error(Pe("property/index", ve));
        return F[T - ve];
      }
      if (ve > T)
        throw new Error(Pe("data", ve));
      if (ee = D[T - ve], !J)
        return ee;
    }
    let ge = ee;
    const De = J.split("/");
    for (const Ne of De)
      Ne && (ee = (0, l._)`${ee}${(0, l.getProperty)((0, u.unescapeJsonPointer)(Ne))}`, ge = (0, l._)`${ge} && ${ee}`);
    return ge;
    function Pe(Ne, ve) {
      return `Cannot access ${Ne} ${ve} levels up, current level is ${T}`;
    }
  }
  return mt.getData = G, mt;
}
var Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
class Ky extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Wr.default = Ky;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
const ls = Ae;
class Gy extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, ls.resolveUrl)(t, r, n), this.missingSchema = (0, ls.normalizeId)((0, ls.getFullPath)(t, this.missingRef));
  }
}
yr.default = Gy;
var He = {};
Object.defineProperty(He, "__esModule", { value: !0 });
He.resolveSchema = He.getCompilingSchema = He.resolveRef = He.compileSchema = He.SchemaEnv = void 0;
const xe = se, Hy = Wr, Vt = At(), nt = Ae, Si = z, By = Hn();
class Bn {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, nt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
He.SchemaEnv = Bn;
function Za(e) {
  const t = zl.call(this, e);
  if (t)
    return t;
  const r = (0, nt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, i = new xe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = i.scopeValue("Error", {
    ref: Hy.default,
    code: (0, xe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = i.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: i,
    allErrors: this.opts.allErrors,
    data: Vt.default.data,
    parentData: Vt.default.parentData,
    parentDataProperty: Vt.default.parentDataProperty,
    dataNames: [Vt.default.data],
    dataPathArr: [xe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, xe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: xe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, xe._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, By.validateFunctionCode)(d), i.optimize(this.opts.code.optimize);
    const h = i.toString();
    u = `${i.scopeRefs(Vt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const y = new Function(`${Vt.default.self}`, `${Vt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: y }), y.errors = null, y.schema = e.schema, y.schemaEnv = e, e.$async && (y.$async = !0), this.opts.code.source === !0 && (y.source = { validateName: c, validateCode: h, scopeValues: i._values }), this.opts.unevaluated) {
      const { props: v, items: g } = d;
      y.evaluated = {
        props: v instanceof xe.Name ? void 0 : v,
        items: g instanceof xe.Name ? void 0 : g,
        dynamicProps: v instanceof xe.Name,
        dynamicItems: g instanceof xe.Name
      }, y.source && (y.source.evaluated = (0, xe.stringify)(y.evaluated));
    }
    return e.validate = y, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
He.compileSchema = Za;
function Wy(e, t, r) {
  var n;
  r = (0, nt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Yy.call(this, e, r);
  if (a === void 0) {
    const i = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    i && (a = new Bn({ schema: i, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Jy.call(this, a);
}
He.resolveRef = Wy;
function Jy(e) {
  return (0, nt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Za.call(this, e);
}
function zl(e) {
  for (const t of this._compilations)
    if (Xy(t, e))
      return t;
}
He.getCompilingSchema = zl;
function Xy(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Yy(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Wn.call(this, e, t);
}
function Wn(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, nt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, nt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return us.call(this, r, e);
  const a = (0, nt.normalizeId)(n), i = this.refs[a] || this.schemas[a];
  if (typeof i == "string") {
    const l = Wn.call(this, e, i);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : us.call(this, r, l);
  }
  if (typeof (i == null ? void 0 : i.schema) == "object") {
    if (i.validate || Za.call(this, i), a === (0, nt.normalizeId)(t)) {
      const { schema: l } = i, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, nt.resolveUrl)(this.opts.uriResolver, s, d)), new Bn({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return us.call(this, r, i);
  }
}
He.resolveSchema = Wn;
const Qy = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function us(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Si.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Qy.has(l) && d && (t = (0, nt.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Si.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, nt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Wn.call(this, n, l);
  }
  const { schemaId: i } = this.opts;
  if (a = a || new Bn({ schema: r, schemaId: i, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Zy = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", xy = "Meta-schema for $data reference (JSON AnySchema extension proposal)", e$ = "object", t$ = [
  "$data"
], r$ = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, n$ = !1, s$ = {
  $id: Zy,
  description: xy,
  type: e$,
  required: t$,
  properties: r$,
  additionalProperties: n$
};
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const ql = hl;
ql.code = 'require("ajv/dist/runtime/uri").default';
xa.default = ql;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Hn();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = se;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Wr, s = yr, a = Wt, i = He, l = se, c = Ae, d = be, u = z, h = s$, S = xa, y = (E, p) => new RegExp(E, p);
  y.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), _ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function N(E) {
    var p, b, $, o, f, P, k, C, W, G, O, T, D, F, J, ee, ge, De, Pe, Ne, ve, it, ke, kt, Ct;
    const Ye = E.strict, Dt = (p = E.code) === null || p === void 0 ? void 0 : p.optimize, vr = Dt === !0 || Dt === void 0 ? 1 : Dt || 0, wr = ($ = (b = E.code) === null || b === void 0 ? void 0 : b.regExp) !== null && $ !== void 0 ? $ : y, ns = (o = E.uriResolver) !== null && o !== void 0 ? o : S.default;
    return {
      strictSchema: (P = (f = E.strictSchema) !== null && f !== void 0 ? f : Ye) !== null && P !== void 0 ? P : !0,
      strictNumbers: (C = (k = E.strictNumbers) !== null && k !== void 0 ? k : Ye) !== null && C !== void 0 ? C : !0,
      strictTypes: (G = (W = E.strictTypes) !== null && W !== void 0 ? W : Ye) !== null && G !== void 0 ? G : "log",
      strictTuples: (T = (O = E.strictTuples) !== null && O !== void 0 ? O : Ye) !== null && T !== void 0 ? T : "log",
      strictRequired: (F = (D = E.strictRequired) !== null && D !== void 0 ? D : Ye) !== null && F !== void 0 ? F : !1,
      code: E.code ? { ...E.code, optimize: vr, regExp: wr } : { optimize: vr, regExp: wr },
      loopRequired: (J = E.loopRequired) !== null && J !== void 0 ? J : w,
      loopEnum: (ee = E.loopEnum) !== null && ee !== void 0 ? ee : w,
      meta: (ge = E.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (De = E.messages) !== null && De !== void 0 ? De : !0,
      inlineRefs: (Pe = E.inlineRefs) !== null && Pe !== void 0 ? Pe : !0,
      schemaId: (Ne = E.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
      addUsedSchema: (ve = E.addUsedSchema) !== null && ve !== void 0 ? ve : !0,
      validateSchema: (it = E.validateSchema) !== null && it !== void 0 ? it : !0,
      validateFormats: (ke = E.validateFormats) !== null && ke !== void 0 ? ke : !0,
      unicodeRegExp: (kt = E.unicodeRegExp) !== null && kt !== void 0 ? kt : !0,
      int32range: (Ct = E.int32range) !== null && Ct !== void 0 ? Ct : !0,
      uriResolver: ns
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: b, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: g, es5: b, lines: $ }), this.logger = x(p.logger);
      const o = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), j.call(this, _, p, "NOT SUPPORTED"), j.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = Q.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && K.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = o;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: $ } = this.opts;
      let o = h;
      $ === "id" && (o = { ...h }, o.id = o.$id, delete o.$id), b && p && this.addMetaSchema(o, o[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const o = $(b);
      return "$async" in $ || (this.errors = $.errors), o;
    }
    compile(p, b) {
      const $ = this._addSchema(p, b);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return o.call(this, p, b);
      async function o(G, O) {
        await f.call(this, G.$schema);
        const T = this._addSchema(G, O);
        return T.validate || P.call(this, T);
      }
      async function f(G) {
        G && !this.getSchema(G) && await o.call(this, { $ref: G }, !0);
      }
      async function P(G) {
        try {
          return this._compileSchemaEnv(G);
        } catch (O) {
          if (!(O instanceof s.default))
            throw O;
          return k.call(this, O), await C.call(this, O.missingSchema), P.call(this, G);
        }
      }
      function k({ missingSchema: G, missingRef: O }) {
        if (this.refs[G])
          throw new Error(`AnySchema ${G} is loaded but ${O} cannot be resolved`);
      }
      async function C(G) {
        const O = await W.call(this, G);
        this.refs[G] || await f.call(this, O.$schema), this.refs[G] || this.addSchema(O, G, b);
      }
      async function W(G) {
        const O = this._loading[G];
        if (O)
          return O;
        try {
          return await (this._loading[G] = $(G));
        } finally {
          delete this._loading[G];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, $, o = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const P of p)
          this.addSchema(P, void 0, $, o);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: P } = this.opts;
        if (f = p[P], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${P} must be string`);
      }
      return b = (0, c.normalizeId)(b || f), this._checkUnique(b), this.schemas[b] = this._addSchema(p, $, b, o, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, $ = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const o = this.validate($, p);
      if (!o && b) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return o;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = q.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: $ } = this.opts, o = new i.SchemaEnv({ schema: {}, schemaId: $ });
        if (b = i.resolveSchema.call(this, o, p), !b)
          return;
        this.refs[p] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = q.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const b of p)
        this.addKeyword(b);
      return this;
    }
    addKeyword(p, b) {
      let $;
      if (typeof p == "string")
        $ = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = $);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, $ = b.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (M.call(this, $, b), !b)
        return (0, u.eachItem)($, (f) => L.call(this, f)), this;
      V.call(this, b);
      const o = {
        ...b,
        type: (0, d.getJSONTypes)(b.type),
        schemaType: (0, d.getJSONTypes)(b.schemaType)
      };
      return (0, u.eachItem)($, o.type.length === 0 ? (f) => L.call(this, f, o) : (f) => o.type.forEach((P) => L.call(this, f, o, P))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const $ of b.rules) {
        const o = $.rules.findIndex((f) => f.keyword === p);
        o >= 0 && $.rules.splice(o, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((o) => `${$}${o.instancePath} ${o.message}`).reduce((o, f) => o + b + f);
    }
    $dataMetaSchema(p, b) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const o of b) {
        const f = o.split("/").slice(1);
        let P = p;
        for (const k of f)
          P = P[k];
        for (const k in $) {
          const C = $[k];
          if (typeof C != "object")
            continue;
          const { $data: W } = C.definition, G = P[k];
          W && G && (P[k] = A(G));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const $ in p) {
        const o = p[$];
        (!b || b.test($)) && (typeof o == "string" ? delete p[$] : o && !o.meta && (this._cache.delete(o.schema), delete p[$]));
      }
    }
    _addSchema(p, b, $, o = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let P;
      const { schemaId: k } = this.opts;
      if (typeof p == "object")
        P = p[k];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let C = this._cache.get(p);
      if (C !== void 0)
        return C;
      $ = (0, c.normalizeId)(P || $);
      const W = c.getSchemaRefs.call(this, p, $);
      return C = new i.SchemaEnv({ schema: p, schemaId: k, meta: b, baseId: $, localRefs: W }), this._cache.set(C.schema, C), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = C), o && this.validateSchema(p, !0), C;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : i.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        i.compileSchema.call(this, p);
      } finally {
        this.opts = b;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function j(E, p, b, $ = "error") {
    for (const o in E) {
      const f = o;
      f in p && this.logger[$](`${b}: option ${o}. ${E[f]}`);
    }
  }
  function q(E) {
    return E = (0, c.normalizeId)(E), this.schemas[E] || this.refs[E];
  }
  function X() {
    const E = this.opts.schemas;
    if (E)
      if (Array.isArray(E))
        this.addSchema(E);
      else
        for (const p in E)
          this.addSchema(E[p], p);
  }
  function le() {
    for (const E in this.opts.formats) {
      const p = this.opts.formats[E];
      p && this.addFormat(E, p);
    }
  }
  function K(E) {
    if (Array.isArray(E)) {
      this.addVocabulary(E);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in E) {
      const b = E[p];
      b.keyword || (b.keyword = p), this.addKeyword(b);
    }
  }
  function Q() {
    const E = { ...this.opts };
    for (const p of v)
      delete E[p];
    return E;
  }
  const ce = { log() {
  }, warn() {
  }, error() {
  } };
  function x(E) {
    if (E === !1)
      return ce;
    if (E === void 0)
      return console;
    if (E.log && E.warn && E.error)
      return E;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ne = /^[a-z_$][a-z0-9_$:-]*$/i;
  function M(E, p) {
    const { RULES: b } = this;
    if ((0, u.eachItem)(E, ($) => {
      if (b.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!ne.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function L(E, p, b) {
    var $;
    const o = p == null ? void 0 : p.post;
    if (b && o)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let P = o ? f.post : f.rules.find(({ type: C }) => C === b);
    if (P || (P = { type: b, rules: [] }, f.rules.push(P)), f.keywords[E] = !0, !p)
      return;
    const k = {
      keyword: E,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? H.call(this, P, k, p.before) : P.rules.push(k), f.all[E] = k, ($ = p.implements) === null || $ === void 0 || $.forEach((C) => this.addKeyword(C));
  }
  function H(E, p, b) {
    const $ = E.rules.findIndex((o) => o.keyword === b);
    $ >= 0 ? E.rules.splice($, 0, p) : (E.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function V(E) {
    let { metaSchema: p } = E;
    p !== void 0 && (E.$data && this.opts.$data && (p = A(p)), E.validateSchema = this.compile(p, !0));
  }
  const I = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function A(E) {
    return { anyOf: [E, I] };
  }
})(Pl);
var eo = {}, to = {}, ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
const a$ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ro.default = a$;
var Jt = {};
Object.defineProperty(Jt, "__esModule", { value: !0 });
Jt.callRef = Jt.getValidate = void 0;
const o$ = yr, bi = oe, Ke = se, Zt = At(), Pi = He, on = z, i$ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: i, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Pi.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new o$.default(n.opts.uriResolver, s, r);
    if (u instanceof Pi.SchemaEnv)
      return S(u);
    return y(u);
    function h() {
      if (a === d)
        return bn(e, i, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return bn(e, (0, Ke._)`${v}.validate`, d, d.$async);
    }
    function S(v) {
      const g = Kl(e, v);
      bn(e, g, v, v.$async);
    }
    function y(v) {
      const g = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Ke.stringify)(v) } : { ref: v }), _ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Ke.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(m), e.ok(_);
    }
  }
};
function Kl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ke._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Jt.getValidate = Kl;
function bn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: i, schemaEnv: l, opts: c } = a, d = c.passContext ? Zt.default.this : Ke.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ke._)`await ${(0, bi.callValidateCode)(e, t, d)}`), y(t), i || s.assign(v, !0);
    }, (g) => {
      s.if((0, Ke._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), S(g), i || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, bi.callValidateCode)(e, t, d), () => y(t), () => S(t));
  }
  function S(v) {
    const g = (0, Ke._)`${v}.errors`;
    s.assign(Zt.default.vErrors, (0, Ke._)`${Zt.default.vErrors} === null ? ${g} : ${Zt.default.vErrors}.concat(${g})`), s.assign(Zt.default.errors, (0, Ke._)`${Zt.default.vErrors}.length`);
  }
  function y(v) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const _ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (a.props = on.mergeEvaluated.props(s, _.props, a.props));
      else {
        const m = s.var("props", (0, Ke._)`${v}.evaluated.props`);
        a.props = on.mergeEvaluated.props(s, m, a.props, Ke.Name);
      }
    if (a.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (a.items = on.mergeEvaluated.items(s, _.items, a.items));
      else {
        const m = s.var("items", (0, Ke._)`${v}.evaluated.items`);
        a.items = on.mergeEvaluated.items(s, m, a.items, Ke.Name);
      }
  }
}
Jt.callRef = bn;
Jt.default = i$;
Object.defineProperty(to, "__esModule", { value: !0 });
const c$ = ro, l$ = Jt, u$ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  c$.default,
  l$.default
];
to.default = u$;
var no = {}, so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const kn = se, St = kn.operators, Cn = {
  maximum: { okStr: "<=", ok: St.LTE, fail: St.GT },
  minimum: { okStr: ">=", ok: St.GTE, fail: St.LT },
  exclusiveMaximum: { okStr: "<", ok: St.LT, fail: St.GTE },
  exclusiveMinimum: { okStr: ">", ok: St.GT, fail: St.LTE }
}, d$ = {
  message: ({ keyword: e, schemaCode: t }) => (0, kn.str)`must be ${Cn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, kn._)`{comparison: ${Cn[e].okStr}, limit: ${t}}`
}, f$ = {
  keyword: Object.keys(Cn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: d$,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, kn._)`${r} ${Cn[t].fail} ${n} || isNaN(${r})`);
  }
};
so.default = f$;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const Dr = se, h$ = {
  message: ({ schemaCode: e }) => (0, Dr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Dr._)`{multipleOf: ${e}}`
}, m$ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: h$,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, i = t.let("res"), l = a ? (0, Dr._)`Math.abs(Math.round(${i}) - ${i}) > 1e-${a}` : (0, Dr._)`${i} !== parseInt(${i})`;
    e.fail$data((0, Dr._)`(${n} === 0 || (${i} = ${r}/${n}, ${l}))`);
  }
};
ao.default = m$;
var oo = {}, io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
function Gl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
io.default = Gl;
Gl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(oo, "__esModule", { value: !0 });
const Kt = se, p$ = z, y$ = io, $$ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Kt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Kt._)`{limit: ${e}}`
}, _$ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: $$,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Kt.operators.GT : Kt.operators.LT, i = s.opts.unicode === !1 ? (0, Kt._)`${r}.length` : (0, Kt._)`${(0, p$.useFunc)(e.gen, y$.default)}(${r})`;
    e.fail$data((0, Kt._)`${i} ${a} ${n}`);
  }
};
oo.default = _$;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const g$ = oe, v$ = z, nr = se, w$ = {
  message: ({ schemaCode: e }) => (0, nr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, nr._)`{pattern: ${e}}`
}, E$ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: w$,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e, l = i.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = i.opts.code, d = c.code === "new RegExp" ? (0, nr._)`new RegExp` : (0, v$.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, nr._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, nr._)`!${u}`);
    } else {
      const c = (0, g$.usePattern)(e, s);
      e.fail$data((0, nr._)`!${c}.test(${r})`);
    }
  }
};
co.default = E$;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const Mr = se, S$ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Mr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Mr._)`{limit: ${e}}`
}, b$ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: S$,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Mr.operators.GT : Mr.operators.LT;
    e.fail$data((0, Mr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
lo.default = b$;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const Pr = oe, Lr = se, P$ = z, N$ = {
  message: ({ params: { missingProperty: e } }) => (0, Lr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Lr._)`{missingProperty: ${e}}`
}, O$ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: N$,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: i } = e, { opts: l } = i;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (i.allErrors ? d() : u(), l.strictRequired) {
      const y = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const g of r)
        if ((y == null ? void 0 : y[g]) === void 0 && !v.has(g)) {
          const _ = i.schemaEnv.baseId + i.errSchemaPath, m = `required property "${g}" is not defined at "${_}" (strictRequired)`;
          (0, P$.checkStrictMode)(i, m, i.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(Lr.nil, h);
      else
        for (const y of r)
          (0, Pr.checkReportMissingProp)(e, y);
    }
    function u() {
      const y = t.let("missing");
      if (c || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => S(y, v)), e.ok(v);
      } else
        t.if((0, Pr.checkMissingProp)(e, r, y)), (0, Pr.reportMissingProp)(e, y), t.else();
    }
    function h() {
      t.forOf("prop", n, (y) => {
        e.setParams({ missingProperty: y }), t.if((0, Pr.noPropertyInData)(t, s, y, l.ownProperties), () => e.error());
      });
    }
    function S(y, v) {
      e.setParams({ missingProperty: y }), t.forOf(y, n, () => {
        t.assign(v, (0, Pr.propertyInData)(t, s, y, l.ownProperties)), t.if((0, Lr.not)(v), () => {
          e.error(), t.break();
        });
      }, Lr.nil);
    }
  }
};
uo.default = O$;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const Fr = se, R$ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Fr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Fr._)`{limit: ${e}}`
}, T$ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: R$,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Fr.operators.GT : Fr.operators.LT;
    e.fail$data((0, Fr._)`${r}.length ${s} ${n}`);
  }
};
fo.default = T$;
var ho = {}, Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
const Hl = Vn;
Hl.code = 'require("ajv/dist/runtime/equal").default';
Jr.default = Hl;
Object.defineProperty(ho, "__esModule", { value: !0 });
const ds = be, Te = se, I$ = z, j$ = Jr, A$ = {
  message: ({ params: { i: e, j: t } }) => (0, Te.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Te._)`{i: ${e}, j: ${t}}`
}, k$ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: A$,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: i, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, ds.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, Te._)`${i} === false`), e.ok(c);
    function u() {
      const v = t.let("i", (0, Te._)`${r}.length`), g = t.let("j");
      e.setParams({ i: v, j: g }), t.assign(c, !0), t.if((0, Te._)`${v} > 1`, () => (h() ? S : y)(v, g));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function S(v, g) {
      const _ = t.name("item"), m = (0, ds.checkDataTypes)(d, _, l.opts.strictNumbers, ds.DataType.Wrong), w = t.const("indices", (0, Te._)`{}`);
      t.for((0, Te._)`;${v}--;`, () => {
        t.let(_, (0, Te._)`${r}[${v}]`), t.if(m, (0, Te._)`continue`), d.length > 1 && t.if((0, Te._)`typeof ${_} == "string"`, (0, Te._)`${_} += "_"`), t.if((0, Te._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(g, (0, Te._)`${w}[${_}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Te._)`${w}[${_}] = ${v}`);
      });
    }
    function y(v, g) {
      const _ = (0, I$.useFunc)(t, j$.default), m = t.name("outer");
      t.label(m).for((0, Te._)`;${v}--;`, () => t.for((0, Te._)`${g} = ${v}; ${g}--;`, () => t.if((0, Te._)`${_}(${r}[${v}], ${r}[${g}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
ho.default = k$;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const Ds = se, C$ = z, D$ = Jr, M$ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ds._)`{allowedValue: ${e}}`
}, L$ = {
  keyword: "const",
  $data: !0,
  error: M$,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Ds._)`!${(0, C$.useFunc)(t, D$.default)}(${r}, ${s})`) : e.fail((0, Ds._)`${a} !== ${r}`);
  }
};
mo.default = L$;
var po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
const Tr = se, F$ = z, V$ = Jr, U$ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Tr._)`{allowedValues: ${e}}`
}, z$ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: U$,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= i.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, F$.useFunc)(t, V$.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const y = t.const("vSchema", a);
      u = (0, Tr.or)(...s.map((v, g) => S(y, g)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (y) => t.if((0, Tr._)`${d()}(${r}, ${y})`, () => t.assign(u, !0).break()));
    }
    function S(y, v) {
      const g = s[v];
      return typeof g == "object" && g !== null ? (0, Tr._)`${d()}(${r}, ${y}[${v}])` : (0, Tr._)`${r} === ${g}`;
    }
  }
};
po.default = z$;
Object.defineProperty(no, "__esModule", { value: !0 });
const q$ = so, K$ = ao, G$ = oo, H$ = co, B$ = lo, W$ = uo, J$ = fo, X$ = ho, Y$ = mo, Q$ = po, Z$ = [
  // number
  q$.default,
  K$.default,
  // string
  G$.default,
  H$.default,
  // object
  B$.default,
  W$.default,
  // array
  J$.default,
  X$.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Y$.default,
  Q$.default
];
no.default = Z$;
var yo = {}, $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.validateAdditionalItems = void 0;
const Gt = se, Ms = z, x$ = {
  message: ({ params: { len: e } }) => (0, Gt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Gt._)`{limit: ${e}}`
}, e_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: x$,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Ms.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Bl(e, n);
  }
};
function Bl(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: i } = e;
  i.items = !0;
  const l = r.const("len", (0, Gt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Gt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Ms.alwaysValidSchema)(i, n)) {
    const d = r.var("valid", (0, Gt._)`${l} <= ${t.length}`);
    r.if((0, Gt.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: Ms.Type.Num }, d), i.allErrors || r.if((0, Gt.not)(d), () => r.break());
    });
  }
}
$r.validateAdditionalItems = Bl;
$r.default = e_;
var $o = {}, _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.validateTuple = void 0;
const Ni = se, Pn = z, t_ = oe, r_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Wl(e, "additionalItems", t);
    r.items = !0, !(0, Pn.alwaysValidSchema)(r, t) && e.ok((0, t_.validateArray)(e));
  }
};
function Wl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: i, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Pn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Ni._)`${a}.length`);
  r.forEach((h, S) => {
    (0, Pn.alwaysValidSchema)(l, h) || (n.if((0, Ni._)`${d} > ${S}`, () => e.subschema({
      keyword: i,
      schemaProp: S,
      dataProp: S
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: S, errSchemaPath: y } = l, v = r.length, g = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (S.strictTuples && !g) {
      const _ = `"${i}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${y}"`;
      (0, Pn.checkStrictMode)(l, _, S.strictTuples);
    }
  }
}
_r.validateTuple = Wl;
_r.default = r_;
Object.defineProperty($o, "__esModule", { value: !0 });
const n_ = _r, s_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, n_.validateTuple)(e, "items")
};
$o.default = s_;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const Oi = se, a_ = z, o_ = oe, i_ = $r, c_ = {
  message: ({ params: { len: e } }) => (0, Oi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Oi._)`{limit: ${e}}`
}, l_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: c_,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, a_.alwaysValidSchema)(n, t) && (s ? (0, i_.validateAdditionalItems)(e, s) : e.ok((0, o_.validateArray)(e)));
  }
};
_o.default = l_;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const Xe = se, cn = z, u_ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Xe.str)`must contain at least ${e} valid item(s)` : (0, Xe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Xe._)`{minContains: ${e}}` : (0, Xe._)`{minContains: ${e}, maxContains: ${t}}`
}, d_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: u_,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let i, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (i = c === void 0 ? 1 : c, l = d) : i = 1;
    const u = t.const("len", (0, Xe._)`${s}.length`);
    if (e.setParams({ min: i, max: l }), l === void 0 && i === 0) {
      (0, cn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && i > l) {
      (0, cn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, cn.alwaysValidSchema)(a, r)) {
      let g = (0, Xe._)`${u} >= ${i}`;
      l !== void 0 && (g = (0, Xe._)`${g} && ${u} <= ${l}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && i === 1 ? y(h, () => t.if(h, () => t.break())) : i === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Xe._)`${s}.length > 0`, S)) : (t.let(h, !1), S()), e.result(h, () => e.reset());
    function S() {
      const g = t.name("_valid"), _ = t.let("count", 0);
      y(g, () => t.if(g, () => v(_)));
    }
    function y(g, _) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: cn.Type.Num,
          compositeRule: !0
        }, g), _();
      });
    }
    function v(g) {
      t.code((0, Xe._)`${g}++`), l === void 0 ? t.if((0, Xe._)`${g} >= ${i}`, () => t.assign(h, !0).break()) : (t.if((0, Xe._)`${g} > ${l}`, () => t.assign(h, !1).break()), i === 1 ? t.assign(h, !0) : t.if((0, Xe._)`${g} >= ${i}`, () => t.assign(h, !0)));
    }
  }
};
go.default = d_;
var Jl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = se, r = z, n = oe;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, u] = a(c);
      i(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const S = Array.isArray(c[h]) ? d : u;
      S[h] = c[h];
    }
    return [d, u];
  }
  function i(c, d = c.schema) {
    const { gen: u, data: h, it: S } = c;
    if (Object.keys(d).length === 0)
      return;
    const y = u.let("missing");
    for (const v in d) {
      const g = d[v];
      if (g.length === 0)
        continue;
      const _ = (0, n.propertyInData)(u, h, v, S.opts.ownProperties);
      c.setParams({
        property: v,
        depsCount: g.length,
        deps: g.join(", ")
      }), S.allErrors ? u.if(_, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${_} && (${(0, n.checkMissingProp)(c, g, y)})`), (0, n.reportMissingProp)(c, y), u.else());
    }
  }
  e.validatePropertyDeps = i;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: S, it: y } = c, v = u.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(y, d[g]) || (u.if(
        (0, n.propertyInData)(u, h, g, y.opts.ownProperties),
        () => {
          const _ = c.subschema({ keyword: S, schemaProp: g }, v);
          c.mergeValidEvaluated(_, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), c.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Jl);
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const Xl = se, f_ = z, h_ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Xl._)`{propertyName: ${e.propertyName}}`
}, m_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: h_,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, f_.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (i) => {
      e.setParams({ propertyName: i }), e.subschema({
        keyword: "propertyNames",
        data: i,
        dataTypes: ["string"],
        propertyName: i,
        compositeRule: !0
      }, a), t.if((0, Xl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
vo.default = m_;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const ln = oe, tt = se, p_ = At(), un = z, y_ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, tt._)`{additionalProperty: ${e.additionalProperty}}`
}, $_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: y_,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: i } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = i;
    if (i.props = !0, c.removeAdditional !== "all" && (0, un.alwaysValidSchema)(i, r))
      return;
    const d = (0, ln.allSchemaProperties)(n.properties), u = (0, ln.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, tt._)`${a} === ${p_.default.errors}`);
    function h() {
      t.forIn("key", s, (_) => {
        !d.length && !u.length ? v(_) : t.if(S(_), () => v(_));
      });
    }
    function S(_) {
      let m;
      if (d.length > 8) {
        const w = (0, un.schemaRefOrVal)(i, n.properties, "properties");
        m = (0, ln.isOwnProperty)(t, w, _);
      } else d.length ? m = (0, tt.or)(...d.map((w) => (0, tt._)`${_} === ${w}`)) : m = tt.nil;
      return u.length && (m = (0, tt.or)(m, ...u.map((w) => (0, tt._)`${(0, ln.usePattern)(e, w)}.test(${_})`))), (0, tt.not)(m);
    }
    function y(_) {
      t.code((0, tt._)`delete ${s}[${_}]`);
    }
    function v(_) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        y(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, un.alwaysValidSchema)(i, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (g(_, m, !1), t.if((0, tt.not)(m), () => {
          e.reset(), y(_);
        })) : (g(_, m), l || t.if((0, tt.not)(m), () => t.break()));
      }
    }
    function g(_, m, w) {
      const N = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: un.Type.Str
      };
      w === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Jn.default = $_;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const __ = Hn(), Ri = oe, fs = z, Ti = Jn, g_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ti.default.code(new __.KeywordCxt(a, Ti.default, "additionalProperties"));
    const i = (0, Ri.allSchemaProperties)(r);
    for (const h of i)
      a.definedProperties.add(h);
    a.opts.unevaluated && i.length && a.props !== !0 && (a.props = fs.mergeEvaluated.props(t, (0, fs.toHash)(i), a.props));
    const l = i.filter((h) => !(0, fs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Ri.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
wo.default = g_;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const Ii = oe, dn = se, ji = z, Ai = z, v_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: i } = a, l = (0, Ii.allSchemaProperties)(r), c = l.filter((g) => (0, ji.alwaysValidSchema)(a, r[g]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = i.strictSchema && !i.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof dn.Name) && (a.props = (0, Ai.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    S();
    function S() {
      for (const g of l)
        d && y(g), a.allErrors ? v(g) : (t.var(u, !0), v(g), t.if(u));
    }
    function y(g) {
      for (const _ in d)
        new RegExp(g).test(_) && (0, ji.checkStrictMode)(a, `property ${_} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function v(g) {
      t.forIn("key", n, (_) => {
        t.if((0, dn._)`${(0, Ii.usePattern)(e, g)}.test(${_})`, () => {
          const m = c.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: _,
            dataPropType: Ai.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, dn._)`${h}[${_}]`, !0) : !m && !a.allErrors && t.if((0, dn.not)(u), () => t.break());
        });
      });
    }
  }
};
Eo.default = v_;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const w_ = z, E_ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, w_.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
So.default = E_;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const S_ = oe, b_ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: S_.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
bo.default = b_;
var Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
const Nn = se, P_ = z, N_ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Nn._)`{passingSchemas: ${e.passing}}`
}, O_ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: N_,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, i = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(i, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let S;
        (0, P_.alwaysValidSchema)(s, u) ? t.var(c, !0) : S = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Nn._)`${c} && ${i}`).assign(i, !1).assign(l, (0, Nn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(i, !0), t.assign(l, h), S && e.mergeEvaluated(S, Nn.Name);
        });
      });
    }
  }
};
Po.default = O_;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const R_ = z, T_ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, i) => {
      if ((0, R_.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: i }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
No.default = T_;
var Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const Dn = se, Yl = z, I_ = {
  message: ({ params: e }) => (0, Dn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Dn._)`{failingKeyword: ${e.ifClause}}`
}, j_ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: I_,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Yl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ki(n, "then"), a = ki(n, "else");
    if (!s && !a)
      return;
    const i = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Dn.not)(l), d("else"));
    e.pass(i, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const S = e.subschema({ keyword: u }, l);
        t.assign(i, l), e.mergeValidEvaluated(S, i), h ? t.assign(h, (0, Dn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function ki(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Yl.alwaysValidSchema)(e, r);
}
Oo.default = j_;
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const A_ = z, k_ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, A_.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ro.default = k_;
Object.defineProperty(yo, "__esModule", { value: !0 });
const C_ = $r, D_ = $o, M_ = _r, L_ = _o, F_ = go, V_ = Jl, U_ = vo, z_ = Jn, q_ = wo, K_ = Eo, G_ = So, H_ = bo, B_ = Po, W_ = No, J_ = Oo, X_ = Ro;
function Y_(e = !1) {
  const t = [
    // any
    G_.default,
    H_.default,
    B_.default,
    W_.default,
    J_.default,
    X_.default,
    // object
    U_.default,
    z_.default,
    V_.default,
    q_.default,
    K_.default
  ];
  return e ? t.push(D_.default, L_.default) : t.push(C_.default, M_.default), t.push(F_.default), t;
}
yo.default = Y_;
var To = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const Ee = se, Q_ = {
  message: ({ schemaCode: e }) => (0, Ee.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ee._)`{format: ${e}}`
}, Z_ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Q_,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: i, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? S() : y();
    function S() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), g = r.const("fDef", (0, Ee._)`${v}[${i}]`), _ = r.let("fType"), m = r.let("format");
      r.if((0, Ee._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign(_, (0, Ee._)`${g}.type || "string"`).assign(m, (0, Ee._)`${g}.validate`), () => r.assign(_, (0, Ee._)`"string"`).assign(m, g)), e.fail$data((0, Ee.or)(w(), N()));
      function w() {
        return c.strictSchema === !1 ? Ee.nil : (0, Ee._)`${i} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, Ee._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Ee._)`${m}(${n})`, j = (0, Ee._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, Ee._)`${m} && ${m} !== true && ${_} === ${t} && !${j}`;
      }
    }
    function y() {
      const v = h.formats[a];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [g, _, m] = N(v);
      g === t && e.pass(R());
      function w() {
        if (c.strictSchema === !1) {
          h.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(j) {
        const q = j instanceof RegExp ? (0, Ee.regexpCode)(j) : c.code.formats ? (0, Ee._)`${c.code.formats}${(0, Ee.getProperty)(a)}` : void 0, X = r.scopeValue("formats", { key: a, ref: j, code: q });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, Ee._)`${X}.validate`] : ["string", j, X];
      }
      function R() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, Ee._)`await ${m}(${n})`;
        }
        return typeof _ == "function" ? (0, Ee._)`${m}(${n})` : (0, Ee._)`${m}.test(${n})`;
      }
    }
  }
};
Io.default = Z_;
Object.defineProperty(To, "__esModule", { value: !0 });
const x_ = Io, eg = [x_.default];
To.default = eg;
var fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.contentVocabulary = fr.metadataVocabulary = void 0;
fr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
fr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(eo, "__esModule", { value: !0 });
const tg = to, rg = no, ng = yo, sg = To, Ci = fr, ag = [
  tg.default,
  rg.default,
  (0, ng.default)(),
  sg.default,
  Ci.metadataVocabulary,
  Ci.contentVocabulary
];
eo.default = ag;
var jo = {}, Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.DiscrError = void 0;
var Di;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Di || (Xn.DiscrError = Di = {}));
Object.defineProperty(jo, "__esModule", { value: !0 });
const er = se, Ls = Xn, Mi = He, og = yr, ig = z, cg = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ls.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, er._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, lg = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: cg,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: i } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!i)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, er._)`${r}${(0, er.getProperty)(l)}`);
    t.if((0, er._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Ls.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const y = S();
      t.if(!1);
      for (const v in y)
        t.elseIf((0, er._)`${d} === ${v}`), t.assign(c, h(y[v]));
      t.else(), e.error(!1, { discrError: Ls.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(y) {
      const v = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: y }, v);
      return e.mergeEvaluated(g, er.Name), v;
    }
    function S() {
      var y;
      const v = {}, g = m(s);
      let _ = !0;
      for (let R = 0; R < i.length; R++) {
        let j = i[R];
        if (j != null && j.$ref && !(0, ig.schemaHasRulesButRef)(j, a.self.RULES)) {
          const X = j.$ref;
          if (j = Mi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), j instanceof Mi.SchemaEnv && (j = j.schema), j === void 0)
            throw new og.default(a.opts.uriResolver, a.baseId, X);
        }
        const q = (y = j == null ? void 0 : j.properties) === null || y === void 0 ? void 0 : y[l];
        if (typeof q != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        _ = _ && (g || m(j)), w(q, R);
      }
      if (!_)
        throw new Error(`discriminator: "${l}" must be required`);
      return v;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function w(R, j) {
        if (R.const)
          N(R.const, j);
        else if (R.enum)
          for (const q of R.enum)
            N(q, j);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, j) {
        if (typeof R != "string" || R in v)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        v[R] = j;
      }
    }
  }
};
jo.default = lg;
const ug = "http://json-schema.org/draft-07/schema#", dg = "http://json-schema.org/draft-07/schema#", fg = "Core schema meta-schema", hg = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, mg = [
  "object",
  "boolean"
], pg = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, yg = {
  $schema: ug,
  $id: dg,
  title: fg,
  definitions: hg,
  type: mg,
  properties: pg,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Pl, n = eo, s = jo, a = yg, i = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(a, i) : a;
      this.addMetaSchema(v, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = Hn();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = se;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = Wr;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var S = yr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return S.default;
  } });
})(Is, Is.exports);
var $g = Is.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = $g, r = se, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: c }) => r.str`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => r._`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: S } = l, { opts: y, self: v } = S;
      if (!y.validateFormats)
        return;
      const g = new t.KeywordCxt(S, v.RULES.all.format.definition, "format");
      g.$data ? _() : m();
      function _() {
        const N = c.scopeValue("formats", {
          ref: v.formats,
          code: y.code.formats
        }), R = c.const("fmt", r._`${N}[${g.schemaCode}]`);
        l.fail$data(r.or(r._`typeof ${R} != "object"`, r._`${R} instanceof RegExp`, r._`typeof ${R}.compare != "function"`, w(R)));
      }
      function m() {
        const N = g.schema, R = v.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const j = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: y.code.formats ? r._`${y.code.formats}${r.getProperty(N)}` : void 0
        });
        l.fail$data(w(j));
      }
      function w(N) {
        return r._`${N}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const i = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = i;
})(bl);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Sl, n = bl, s = se, a = new s.Name("fullFormats"), i = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, a), d;
    const [h, S] = u.mode === "fast" ? [r.fastFormats, i] : [r.fullFormats, a], y = u.formats || r.formatNames;
    return c(d, y, h, S), u.keywords && n.default(d), d;
  };
  l.get = (d, u = "full") => {
    const S = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!S)
      throw new Error(`Unknown format "${d}"`);
    return S;
  };
  function c(d, u, h, S) {
    var y, v;
    (y = (v = d.opts.code).formats) !== null && y !== void 0 || (v.formats = s._`require("ajv-formats/dist/formats").${S}`);
    for (const g of u)
      d.addFormat(g, h[g]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(Ts, Ts.exports);
var _g = Ts.exports;
const gg = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !vg(s, a) && n || Object.defineProperty(e, r, a);
}, vg = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, wg = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Eg = (e, t) => `/* Wrapped ${e}*/
${t}`, Sg = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), bg = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Pg = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Eg.bind(null, n, t.toString());
  Object.defineProperty(s, "name", bg), Object.defineProperty(e, "toString", { ...Sg, value: s });
}, Ng = (e, t, { ignoreNonConfigurable: r = !1 } = {}) => {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    gg(e, t, s, r);
  return wg(e, t), Pg(e, t, n), e;
};
var Og = Ng;
const Rg = Og;
var Tg = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    before: n = !1,
    after: s = !0
  } = t;
  if (!n && !s)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, i;
  const l = function(...c) {
    const d = this, u = () => {
      a = void 0, s && (i = e.apply(d, c));
    }, h = n && !a;
    return clearTimeout(a), a = setTimeout(u, r), h && (i = e.apply(d, c)), i;
  };
  return Rg(l, e), l.cancel = () => {
    a && (clearTimeout(a), a = void 0);
  }, l;
}, Fs = { exports: {} };
const Ig = "2.0.0", Ql = 256, jg = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Ag = 16, kg = Ql - 6, Cg = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Yn = {
  MAX_LENGTH: Ql,
  MAX_SAFE_COMPONENT_LENGTH: Ag,
  MAX_SAFE_BUILD_LENGTH: kg,
  MAX_SAFE_INTEGER: jg,
  RELEASE_TYPES: Cg,
  SEMVER_SPEC_VERSION: Ig,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Dg = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Qn = Dg;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Yn, a = Qn;
  t = e.exports = {};
  const i = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const S = "[a-zA-Z0-9-]", y = [
    ["\\s", 1],
    ["\\d", s],
    [S, n]
  ], v = (_) => {
    for (const [m, w] of y)
      _ = _.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return _;
  }, g = (_, m, w) => {
    const N = v(m), R = h++;
    a(_, R, m), u[_] = R, c[R] = m, d[R] = N, i[R] = new RegExp(m, w ? "g" : void 0), l[R] = new RegExp(N, w ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${S}*`), g("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${S}+`), g("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), g("FULL", `^${c[u.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), g("LOOSE", `^${c[u.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), g("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", c[u.COERCE], !0), g("COERCERTLFULL", c[u.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Fs, Fs.exports);
var Xr = Fs.exports;
const Mg = Object.freeze({ loose: !0 }), Lg = Object.freeze({}), Fg = (e) => e ? typeof e != "object" ? Mg : e : Lg;
var Ao = Fg;
const Li = /^[0-9]+$/, Zl = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Li.test(e), n = Li.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Vg = (e, t) => Zl(t, e);
var xl = {
  compareIdentifiers: Zl,
  rcompareIdentifiers: Vg
};
const fn = Qn, { MAX_LENGTH: Fi, MAX_SAFE_INTEGER: hn } = Yn, { safeRe: mn, t: pn } = Xr, Ug = Ao, { compareIdentifiers: hs } = xl;
let zg = class ct {
  constructor(t, r) {
    if (r = Ug(r), t instanceof ct) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Fi)
      throw new TypeError(
        `version is longer than ${Fi} characters`
      );
    fn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? mn[pn.LOOSE] : mn[pn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > hn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > hn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > hn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < hn)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (fn("SemVer.compare", this.version, this.options, t), !(t instanceof ct)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ct(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ct || (t = new ct(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ct || (t = new ct(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (fn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return hs(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ct || (t = new ct(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (fn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return hs(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? mn[pn.PRERELEASELOOSE] : mn[pn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), hs(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ue = zg;
const Vi = Ue, qg = (e, t, r = !1) => {
  if (e instanceof Vi)
    return e;
  try {
    return new Vi(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var gr = qg;
const Kg = gr, Gg = (e, t) => {
  const r = Kg(e, t);
  return r ? r.version : null;
};
var Hg = Gg;
const Bg = gr, Wg = (e, t) => {
  const r = Bg(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var Jg = Wg;
const Ui = Ue, Xg = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Ui(
      e instanceof Ui ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var Yg = Xg;
const zi = gr, Qg = (e, t) => {
  const r = zi(e, null, !0), n = zi(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, i = a ? r : n, l = a ? n : r, c = !!i.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(i) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var Zg = Qg;
const xg = Ue, e0 = (e, t) => new xg(e, t).major;
var t0 = e0;
const r0 = Ue, n0 = (e, t) => new r0(e, t).minor;
var s0 = n0;
const a0 = Ue, o0 = (e, t) => new a0(e, t).patch;
var i0 = o0;
const c0 = gr, l0 = (e, t) => {
  const r = c0(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var u0 = l0;
const qi = Ue, d0 = (e, t, r) => new qi(e, r).compare(new qi(t, r));
var at = d0;
const f0 = at, h0 = (e, t, r) => f0(t, e, r);
var m0 = h0;
const p0 = at, y0 = (e, t) => p0(e, t, !0);
var $0 = y0;
const Ki = Ue, _0 = (e, t, r) => {
  const n = new Ki(e, r), s = new Ki(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var ko = _0;
const g0 = ko, v0 = (e, t) => e.sort((r, n) => g0(r, n, t));
var w0 = v0;
const E0 = ko, S0 = (e, t) => e.sort((r, n) => E0(n, r, t));
var b0 = S0;
const P0 = at, N0 = (e, t, r) => P0(e, t, r) > 0;
var Zn = N0;
const O0 = at, R0 = (e, t, r) => O0(e, t, r) < 0;
var Co = R0;
const T0 = at, I0 = (e, t, r) => T0(e, t, r) === 0;
var eu = I0;
const j0 = at, A0 = (e, t, r) => j0(e, t, r) !== 0;
var tu = A0;
const k0 = at, C0 = (e, t, r) => k0(e, t, r) >= 0;
var Do = C0;
const D0 = at, M0 = (e, t, r) => D0(e, t, r) <= 0;
var Mo = M0;
const L0 = eu, F0 = tu, V0 = Zn, U0 = Do, z0 = Co, q0 = Mo, K0 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return L0(e, r, n);
    case "!=":
      return F0(e, r, n);
    case ">":
      return V0(e, r, n);
    case ">=":
      return U0(e, r, n);
    case "<":
      return z0(e, r, n);
    case "<=":
      return q0(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var ru = K0;
const G0 = Ue, H0 = gr, { safeRe: yn, t: $n } = Xr, B0 = (e, t) => {
  if (e instanceof G0)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? yn[$n.COERCEFULL] : yn[$n.COERCE]);
  else {
    const c = t.includePrerelease ? yn[$n.COERCERTLFULL] : yn[$n.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", i = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return H0(`${n}.${s}.${a}${i}${l}`, t);
};
var W0 = B0;
class J0 {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var X0 = J0, ms, Gi;
function ot() {
  if (Gi) return ms;
  Gi = 1;
  const e = /\s+/g;
  class t {
    constructor(L, H) {
      if (H = s(H), L instanceof t)
        return L.loose === !!H.loose && L.includePrerelease === !!H.includePrerelease ? L : new t(L.raw, H);
      if (L instanceof a)
        return this.raw = L.value, this.set = [[L]], this.formatted = void 0, this;
      if (this.options = H, this.loose = !!H.loose, this.includePrerelease = !!H.includePrerelease, this.raw = L.trim().replace(e, " "), this.set = this.raw.split("||").map((V) => this.parseRange(V.trim())).filter((V) => V.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const V = this.set[0];
        if (this.set = this.set.filter((I) => !g(I[0])), this.set.length === 0)
          this.set = [V];
        else if (this.set.length > 1) {
          for (const I of this.set)
            if (I.length === 1 && _(I[0])) {
              this.set = [I];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let L = 0; L < this.set.length; L++) {
          L > 0 && (this.formatted += "||");
          const H = this.set[L];
          for (let V = 0; V < H.length; V++)
            V > 0 && (this.formatted += " "), this.formatted += H[V].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(L) {
      const V = ((this.options.includePrerelease && y) | (this.options.loose && v)) + ":" + L, I = n.get(V);
      if (I)
        return I;
      const A = this.options.loose, E = A ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      L = L.replace(E, x(this.options.includePrerelease)), i("hyphen replace", L), L = L.replace(c[d.COMPARATORTRIM], u), i("comparator trim", L), L = L.replace(c[d.TILDETRIM], h), i("tilde trim", L), L = L.replace(c[d.CARETTRIM], S), i("caret trim", L);
      let p = L.split(" ").map((f) => w(f, this.options)).join(" ").split(/\s+/).map((f) => ce(f, this.options));
      A && (p = p.filter((f) => (i("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), i("range list", p);
      const b = /* @__PURE__ */ new Map(), $ = p.map((f) => new a(f, this.options));
      for (const f of $) {
        if (g(f))
          return [f];
        b.set(f.value, f);
      }
      b.size > 1 && b.has("") && b.delete("");
      const o = [...b.values()];
      return n.set(V, o), o;
    }
    intersects(L, H) {
      if (!(L instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((V) => m(V, H) && L.set.some((I) => m(I, H) && V.every((A) => I.every((E) => A.intersects(E, H)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(L) {
      if (!L)
        return !1;
      if (typeof L == "string")
        try {
          L = new l(L, this.options);
        } catch {
          return !1;
        }
      for (let H = 0; H < this.set.length; H++)
        if (ne(this.set[H], L, this.options))
          return !0;
      return !1;
    }
  }
  ms = t;
  const r = X0, n = new r(), s = Ao, a = xn(), i = Qn, l = Ue, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: S
  } = Xr, { FLAG_INCLUDE_PRERELEASE: y, FLAG_LOOSE: v } = Yn, g = (M) => M.value === "<0.0.0-0", _ = (M) => M.value === "", m = (M, L) => {
    let H = !0;
    const V = M.slice();
    let I = V.pop();
    for (; H && V.length; )
      H = V.every((A) => I.intersects(A, L)), I = V.pop();
    return H;
  }, w = (M, L) => (M = M.replace(c[d.BUILD], ""), i("comp", M, L), M = q(M, L), i("caret", M), M = R(M, L), i("tildes", M), M = le(M, L), i("xrange", M), M = Q(M, L), i("stars", M), M), N = (M) => !M || M.toLowerCase() === "x" || M === "*", R = (M, L) => M.trim().split(/\s+/).map((H) => j(H, L)).join(" "), j = (M, L) => {
    const H = L.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return M.replace(H, (V, I, A, E, p) => {
      i("tilde", M, V, I, A, E, p);
      let b;
      return N(I) ? b = "" : N(A) ? b = `>=${I}.0.0 <${+I + 1}.0.0-0` : N(E) ? b = `>=${I}.${A}.0 <${I}.${+A + 1}.0-0` : p ? (i("replaceTilde pr", p), b = `>=${I}.${A}.${E}-${p} <${I}.${+A + 1}.0-0`) : b = `>=${I}.${A}.${E} <${I}.${+A + 1}.0-0`, i("tilde return", b), b;
    });
  }, q = (M, L) => M.trim().split(/\s+/).map((H) => X(H, L)).join(" "), X = (M, L) => {
    i("caret", M, L);
    const H = L.loose ? c[d.CARETLOOSE] : c[d.CARET], V = L.includePrerelease ? "-0" : "";
    return M.replace(H, (I, A, E, p, b) => {
      i("caret", M, I, A, E, p, b);
      let $;
      return N(A) ? $ = "" : N(E) ? $ = `>=${A}.0.0${V} <${+A + 1}.0.0-0` : N(p) ? A === "0" ? $ = `>=${A}.${E}.0${V} <${A}.${+E + 1}.0-0` : $ = `>=${A}.${E}.0${V} <${+A + 1}.0.0-0` : b ? (i("replaceCaret pr", b), A === "0" ? E === "0" ? $ = `>=${A}.${E}.${p}-${b} <${A}.${E}.${+p + 1}-0` : $ = `>=${A}.${E}.${p}-${b} <${A}.${+E + 1}.0-0` : $ = `>=${A}.${E}.${p}-${b} <${+A + 1}.0.0-0`) : (i("no pr"), A === "0" ? E === "0" ? $ = `>=${A}.${E}.${p}${V} <${A}.${E}.${+p + 1}-0` : $ = `>=${A}.${E}.${p}${V} <${A}.${+E + 1}.0-0` : $ = `>=${A}.${E}.${p} <${+A + 1}.0.0-0`), i("caret return", $), $;
    });
  }, le = (M, L) => (i("replaceXRanges", M, L), M.split(/\s+/).map((H) => K(H, L)).join(" ")), K = (M, L) => {
    M = M.trim();
    const H = L.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return M.replace(H, (V, I, A, E, p, b) => {
      i("xRange", M, V, I, A, E, p, b);
      const $ = N(A), o = $ || N(E), f = o || N(p), P = f;
      return I === "=" && P && (I = ""), b = L.includePrerelease ? "-0" : "", $ ? I === ">" || I === "<" ? V = "<0.0.0-0" : V = "*" : I && P ? (o && (E = 0), p = 0, I === ">" ? (I = ">=", o ? (A = +A + 1, E = 0, p = 0) : (E = +E + 1, p = 0)) : I === "<=" && (I = "<", o ? A = +A + 1 : E = +E + 1), I === "<" && (b = "-0"), V = `${I + A}.${E}.${p}${b}`) : o ? V = `>=${A}.0.0${b} <${+A + 1}.0.0-0` : f && (V = `>=${A}.${E}.0${b} <${A}.${+E + 1}.0-0`), i("xRange return", V), V;
    });
  }, Q = (M, L) => (i("replaceStars", M, L), M.trim().replace(c[d.STAR], "")), ce = (M, L) => (i("replaceGTE0", M, L), M.trim().replace(c[L.includePrerelease ? d.GTE0PRE : d.GTE0], "")), x = (M) => (L, H, V, I, A, E, p, b, $, o, f, P) => (N(V) ? H = "" : N(I) ? H = `>=${V}.0.0${M ? "-0" : ""}` : N(A) ? H = `>=${V}.${I}.0${M ? "-0" : ""}` : E ? H = `>=${H}` : H = `>=${H}${M ? "-0" : ""}`, N($) ? b = "" : N(o) ? b = `<${+$ + 1}.0.0-0` : N(f) ? b = `<${$}.${+o + 1}.0-0` : P ? b = `<=${$}.${o}.${f}-${P}` : M ? b = `<${$}.${o}.${+f + 1}-0` : b = `<=${b}`, `${H} ${b}`.trim()), ne = (M, L, H) => {
    for (let V = 0; V < M.length; V++)
      if (!M[V].test(L))
        return !1;
    if (L.prerelease.length && !H.includePrerelease) {
      for (let V = 0; V < M.length; V++)
        if (i(M[V].semver), M[V].semver !== a.ANY && M[V].semver.prerelease.length > 0) {
          const I = M[V].semver;
          if (I.major === L.major && I.minor === L.minor && I.patch === L.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return ms;
}
var ps, Hi;
function xn() {
  if (Hi) return ps;
  Hi = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, h) {
      if (h = r(h), u instanceof t) {
        if (u.loose === !!h.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), i("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], S = u.match(h);
      if (!S)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = S[1] !== void 0 ? S[1] : "", this.operator === "=" && (this.operator = ""), S[2] ? this.semver = new l(S[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (i("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  ps = t;
  const r = Ao, { safeRe: n, t: s } = Xr, a = ru, i = Qn, l = Ue, c = ot();
  return ps;
}
const Y0 = ot(), Q0 = (e, t, r) => {
  try {
    t = new Y0(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var es = Q0;
const Z0 = ot(), x0 = (e, t) => new Z0(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var ev = x0;
const tv = Ue, rv = ot(), nv = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new rv(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    a.test(i) && (!n || s.compare(i) === -1) && (n = i, s = new tv(n, r));
  }), n;
};
var sv = nv;
const av = Ue, ov = ot(), iv = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new ov(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    a.test(i) && (!n || s.compare(i) === 1) && (n = i, s = new av(n, r));
  }), n;
};
var cv = iv;
const ys = Ue, lv = ot(), Bi = Zn, uv = (e, t) => {
  e = new lv(e, t);
  let r = new ys("0.0.0");
  if (e.test(r) || (r = new ys("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((i) => {
      const l = new ys(i.semver.version);
      switch (i.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || Bi(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${i.operator}`);
      }
    }), a && (!r || Bi(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var dv = uv;
const fv = ot(), hv = (e, t) => {
  try {
    return new fv(e, t).range || "*";
  } catch {
    return null;
  }
};
var mv = hv;
const pv = Ue, nu = xn(), { ANY: yv } = nu, $v = ot(), _v = es, Wi = Zn, Ji = Co, gv = Mo, vv = Do, wv = (e, t, r, n) => {
  e = new pv(e, n), t = new $v(t, n);
  let s, a, i, l, c;
  switch (r) {
    case ">":
      s = Wi, a = gv, i = Ji, l = ">", c = ">=";
      break;
    case "<":
      s = Ji, a = vv, i = Wi, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (_v(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, S = null;
    if (u.forEach((y) => {
      y.semver === yv && (y = new nu(">=0.0.0")), h = h || y, S = S || y, s(y.semver, h.semver, n) ? h = y : i(y.semver, S.semver, n) && (S = y);
    }), h.operator === l || h.operator === c || (!S.operator || S.operator === l) && a(e, S.semver))
      return !1;
    if (S.operator === c && i(e, S.semver))
      return !1;
  }
  return !0;
};
var Lo = wv;
const Ev = Lo, Sv = (e, t, r) => Ev(e, t, ">", r);
var bv = Sv;
const Pv = Lo, Nv = (e, t, r) => Pv(e, t, "<", r);
var Ov = Nv;
const Xi = ot(), Rv = (e, t, r) => (e = new Xi(e, r), t = new Xi(t, r), e.intersects(t, r));
var Tv = Rv;
const Iv = es, jv = at;
var Av = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const i = e.sort((u, h) => jv(u, h, r));
  for (const u of i)
    Iv(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === i[0] ? l.push("*") : h ? u === i[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Yi = ot(), Fo = xn(), { ANY: $s } = Fo, Nr = es, Vo = at, kv = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Yi(e, r), t = new Yi(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const i = Dv(s, a, r);
      if (n = n || i !== null, i)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Cv = [new Fo(">=0.0.0-0")], Qi = [new Fo(">=0.0.0")], Dv = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === $s) {
    if (t.length === 1 && t[0].semver === $s)
      return !0;
    r.includePrerelease ? e = Cv : e = Qi;
  }
  if (t.length === 1 && t[0].semver === $s) {
    if (r.includePrerelease)
      return !0;
    t = Qi;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const y of e)
    y.operator === ">" || y.operator === ">=" ? s = Zi(s, y, r) : y.operator === "<" || y.operator === "<=" ? a = xi(a, y, r) : n.add(y.semver);
  if (n.size > 1)
    return null;
  let i;
  if (s && a) {
    if (i = Vo(s.semver, a.semver, r), i > 0)
      return null;
    if (i === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const y of n) {
    if (s && !Nr(y, String(s), r) || a && !Nr(y, String(a), r))
      return null;
    for (const v of t)
      if (!Nr(y, String(v), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, S = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const y of t) {
    if (u = u || y.operator === ">" || y.operator === ">=", d = d || y.operator === "<" || y.operator === "<=", s) {
      if (S && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === S.major && y.semver.minor === S.minor && y.semver.patch === S.patch && (S = !1), y.operator === ">" || y.operator === ">=") {
        if (l = Zi(s, y, r), l === y && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Nr(s.semver, String(y), r))
        return !1;
    }
    if (a) {
      if (h && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === h.major && y.semver.minor === h.minor && y.semver.patch === h.patch && (h = !1), y.operator === "<" || y.operator === "<=") {
        if (c = xi(a, y, r), c === y && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Nr(a.semver, String(y), r))
        return !1;
    }
    if (!y.operator && (a || s) && i !== 0)
      return !1;
  }
  return !(s && d && !a && i !== 0 || a && u && !s && i !== 0 || S || h);
}, Zi = (e, t, r) => {
  if (!e)
    return t;
  const n = Vo(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, xi = (e, t, r) => {
  if (!e)
    return t;
  const n = Vo(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Mv = kv;
const _s = Xr, ec = Yn, Lv = Ue, tc = xl, Fv = gr, Vv = Hg, Uv = Jg, zv = Yg, qv = Zg, Kv = t0, Gv = s0, Hv = i0, Bv = u0, Wv = at, Jv = m0, Xv = $0, Yv = ko, Qv = w0, Zv = b0, xv = Zn, ew = Co, tw = eu, rw = tu, nw = Do, sw = Mo, aw = ru, ow = W0, iw = xn(), cw = ot(), lw = es, uw = ev, dw = sv, fw = cv, hw = dv, mw = mv, pw = Lo, yw = bv, $w = Ov, _w = Tv, gw = Av, vw = Mv;
var ww = {
  parse: Fv,
  valid: Vv,
  clean: Uv,
  inc: zv,
  diff: qv,
  major: Kv,
  minor: Gv,
  patch: Hv,
  prerelease: Bv,
  compare: Wv,
  rcompare: Jv,
  compareLoose: Xv,
  compareBuild: Yv,
  sort: Qv,
  rsort: Zv,
  gt: xv,
  lt: ew,
  eq: tw,
  neq: rw,
  gte: nw,
  lte: sw,
  cmp: aw,
  coerce: ow,
  Comparator: iw,
  Range: cw,
  satisfies: lw,
  toComparators: uw,
  maxSatisfying: dw,
  minSatisfying: fw,
  minVersion: hw,
  validRange: mw,
  outside: pw,
  gtr: yw,
  ltr: $w,
  intersects: _w,
  simplifyRange: gw,
  subset: vw,
  SemVer: Lv,
  re: _s.re,
  src: _s.src,
  tokens: _s.t,
  SEMVER_SPEC_VERSION: ec.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: ec.RELEASE_TYPES,
  compareIdentifiers: tc.compareIdentifiers,
  rcompareIdentifiers: tc.rcompareIdentifiers
}, ts = { exports: {} }, Uo = { exports: {} };
const su = (e, t) => {
  for (const r of Reflect.ownKeys(t))
    Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
  return e;
};
Uo.exports = su;
Uo.exports.default = su;
var Ew = Uo.exports;
const Sw = Ew, Mn = /* @__PURE__ */ new WeakMap(), au = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError("Expected a function");
  let r, n = 0;
  const s = e.displayName || e.name || "<anonymous>", a = function(...i) {
    if (Mn.set(a, ++n), n === 1)
      r = e.apply(this, i), e = null;
    else if (t.throw === !0)
      throw new Error(`Function \`${s}\` can only be called once`);
    return r;
  };
  return Sw(a, e), Mn.set(a, n), a;
};
ts.exports = au;
ts.exports.default = au;
ts.exports.callCount = (e) => {
  if (!Mn.has(e))
    throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);
  return Mn.get(e);
};
var bw = ts.exports;
(function(e, t) {
  var r = Yr && Yr.__classPrivateFieldSet || function(V, I, A, E, p) {
    if (E === "m") throw new TypeError("Private method is not writable");
    if (E === "a" && !p) throw new TypeError("Private accessor was defined without a setter");
    if (typeof I == "function" ? V !== I || !p : !I.has(V)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return E === "a" ? p.call(V, A) : p ? p.value = A : I.set(V, A), A;
  }, n = Yr && Yr.__classPrivateFieldGet || function(V, I, A, E) {
    if (A === "a" && !E) throw new TypeError("Private accessor was defined without a getter");
    if (typeof I == "function" ? V !== I || !E : !I.has(V)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return A === "m" ? E : A === "a" ? E.call(V) : E ? E.value : I.get(V);
  }, s, a, i, l, c, d;
  Object.defineProperty(t, "__esModule", { value: !0 });
  const u = oc, h = zs, S = Xt, y = uu, v = du, g = fu, _ = _u, m = Tu, w = ku, N = ut, R = Hp, j = _g, q = Tg, X = ww, le = bw, K = "aes-256-cbc", Q = () => /* @__PURE__ */ Object.create(null), ce = (V) => V != null;
  let x = "";
  try {
    delete require.cache[__filename], x = S.dirname((a = (s = e.parent) === null || s === void 0 ? void 0 : s.filename) !== null && a !== void 0 ? a : ".");
  } catch {
  }
  const ne = (V, I) => {
    const A = /* @__PURE__ */ new Set([
      "undefined",
      "symbol",
      "function"
    ]), E = typeof I;
    if (A.has(E))
      throw new TypeError(`Setting a value of type \`${E}\` for key \`${V}\` is not allowed as it's not supported by JSON`);
  }, M = "__internal__", L = `${M}.migrations.version`;
  class H {
    constructor(I = {}) {
      var A;
      i.set(this, void 0), l.set(this, void 0), c.set(this, void 0), d.set(this, {}), this._deserialize = (f) => JSON.parse(f), this._serialize = (f) => JSON.stringify(f, void 0, "	");
      const E = {
        configName: "config",
        fileExtension: "json",
        projectSuffix: "nodejs",
        clearInvalidConfig: !1,
        accessPropertiesByDotNotation: !0,
        configFileMode: 438,
        ...I
      }, p = le(() => {
        const f = m.sync({ cwd: x }), P = f && JSON.parse(h.readFileSync(f, "utf8"));
        return P ?? {};
      });
      if (!E.cwd) {
        if (E.projectName || (E.projectName = p().name), !E.projectName)
          throw new Error("Project name could not be inferred. Please specify the `projectName` option.");
        E.cwd = w(E.projectName, { suffix: E.projectSuffix }).config;
      }
      if (r(this, c, E, "f"), E.schema) {
        if (typeof E.schema != "object")
          throw new TypeError("The `schema` option must be an object.");
        const f = new R.default({
          allErrors: !0,
          useDefaults: !0
        });
        (0, j.default)(f);
        const P = {
          type: "object",
          properties: E.schema
        };
        r(this, i, f.compile(P), "f");
        for (const [k, C] of Object.entries(E.schema))
          C != null && C.default && (n(this, d, "f")[k] = C.default);
      }
      E.defaults && r(this, d, {
        ...n(this, d, "f"),
        ...E.defaults
      }, "f"), E.serialize && (this._serialize = E.serialize), E.deserialize && (this._deserialize = E.deserialize), this.events = new g.EventEmitter(), r(this, l, E.encryptionKey, "f");
      const b = E.fileExtension ? `.${E.fileExtension}` : "";
      this.path = S.resolve(E.cwd, `${(A = E.configName) !== null && A !== void 0 ? A : "config"}${b}`);
      const $ = this.store, o = Object.assign(Q(), E.defaults, $);
      this._validate(o);
      try {
        v.deepEqual($, o);
      } catch {
        this.store = o;
      }
      if (E.watch && this._watch(), E.migrations) {
        if (E.projectVersion || (E.projectVersion = p().version), !E.projectVersion)
          throw new Error("Project version could not be inferred. Please specify the `projectVersion` option.");
        this._migrate(E.migrations, E.projectVersion, E.beforeEachMigration);
      }
    }
    get(I, A) {
      if (n(this, c, "f").accessPropertiesByDotNotation)
        return this._get(I, A);
      const { store: E } = this;
      return I in E ? E[I] : A;
    }
    set(I, A) {
      if (typeof I != "string" && typeof I != "object")
        throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof I}`);
      if (typeof I != "object" && A === void 0)
        throw new TypeError("Use `delete()` to clear values");
      if (this._containsReservedKey(I))
        throw new TypeError(`Please don't use the ${M} key, as it's used to manage this module internal operations.`);
      const { store: E } = this, p = (b, $) => {
        ne(b, $), n(this, c, "f").accessPropertiesByDotNotation ? _.set(E, b, $) : E[b] = $;
      };
      if (typeof I == "object") {
        const b = I;
        for (const [$, o] of Object.entries(b))
          p($, o);
      } else
        p(I, A);
      this.store = E;
    }
    /**
        Check if an item exists.
    
        @param key - The key of the item to check.
        */
    has(I) {
      return n(this, c, "f").accessPropertiesByDotNotation ? _.has(this.store, I) : I in this.store;
    }
    /**
        Reset items to their default values, as defined by the `defaults` or `schema` option.
    
        @see `clear()` to reset all items.
    
        @param keys - The keys of the items to reset.
        */
    reset(...I) {
      for (const A of I)
        ce(n(this, d, "f")[A]) && this.set(A, n(this, d, "f")[A]);
    }
    /**
        Delete an item.
    
        @param key - The key of the item to delete.
        */
    delete(I) {
      const { store: A } = this;
      n(this, c, "f").accessPropertiesByDotNotation ? _.delete(A, I) : delete A[I], this.store = A;
    }
    /**
        Delete all items.
    
        This resets known items to their default values, if defined by the `defaults` or `schema` option.
        */
    clear() {
      this.store = Q();
      for (const I of Object.keys(n(this, d, "f")))
        this.reset(I);
    }
    /**
        Watches the given `key`, calling `callback` on any changes.
    
        @param key - The key wo watch.
        @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
        @returns A function, that when called, will unsubscribe.
        */
    onDidChange(I, A) {
      if (typeof I != "string")
        throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof I}`);
      if (typeof A != "function")
        throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof A}`);
      return this._handleChange(() => this.get(I), A);
    }
    /**
        Watches the whole config object, calling `callback` on any changes.
    
        @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
        @returns A function, that when called, will unsubscribe.
        */
    onDidAnyChange(I) {
      if (typeof I != "function")
        throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof I}`);
      return this._handleChange(() => this.store, I);
    }
    get size() {
      return Object.keys(this.store).length;
    }
    get store() {
      try {
        const I = h.readFileSync(this.path, n(this, l, "f") ? null : "utf8"), A = this._encryptData(I), E = this._deserialize(A);
        return this._validate(E), Object.assign(Q(), E);
      } catch (I) {
        if ((I == null ? void 0 : I.code) === "ENOENT")
          return this._ensureDirectory(), Q();
        if (n(this, c, "f").clearInvalidConfig && I.name === "SyntaxError")
          return Q();
        throw I;
      }
    }
    set store(I) {
      this._ensureDirectory(), this._validate(I), this._write(I), this.events.emit("change");
    }
    *[(i = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), Symbol.iterator)]() {
      for (const [I, A] of Object.entries(this.store))
        yield [I, A];
    }
    _encryptData(I) {
      if (!n(this, l, "f"))
        return I.toString();
      try {
        if (n(this, l, "f"))
          try {
            if (I.slice(16, 17).toString() === ":") {
              const A = I.slice(0, 16), E = y.pbkdf2Sync(n(this, l, "f"), A.toString(), 1e4, 32, "sha512"), p = y.createDecipheriv(K, E, A);
              I = Buffer.concat([p.update(Buffer.from(I.slice(17))), p.final()]).toString("utf8");
            } else {
              const A = y.createDecipher(K, n(this, l, "f"));
              I = Buffer.concat([A.update(Buffer.from(I)), A.final()]).toString("utf8");
            }
          } catch {
          }
      } catch {
      }
      return I.toString();
    }
    _handleChange(I, A) {
      let E = I();
      const p = () => {
        const b = E, $ = I();
        (0, u.isDeepStrictEqual)($, b) || (E = $, A.call(this, $, b));
      };
      return this.events.on("change", p), () => this.events.removeListener("change", p);
    }
    _validate(I) {
      if (!n(this, i, "f") || n(this, i, "f").call(this, I) || !n(this, i, "f").errors)
        return;
      const E = n(this, i, "f").errors.map(({ instancePath: p, message: b = "" }) => `\`${p.slice(1)}\` ${b}`);
      throw new Error("Config schema violation: " + E.join("; "));
    }
    _ensureDirectory() {
      h.mkdirSync(S.dirname(this.path), { recursive: !0 });
    }
    _write(I) {
      let A = this._serialize(I);
      if (n(this, l, "f")) {
        const E = y.randomBytes(16), p = y.pbkdf2Sync(n(this, l, "f"), E.toString(), 1e4, 32, "sha512"), b = y.createCipheriv(K, p, E);
        A = Buffer.concat([E, Buffer.from(":"), b.update(Buffer.from(A)), b.final()]);
      }
      if (process.env.SNAP)
        h.writeFileSync(this.path, A, { mode: n(this, c, "f").configFileMode });
      else
        try {
          N.writeFileSync(this.path, A, { mode: n(this, c, "f").configFileMode });
        } catch (E) {
          if ((E == null ? void 0 : E.code) === "EXDEV") {
            h.writeFileSync(this.path, A, { mode: n(this, c, "f").configFileMode });
            return;
          }
          throw E;
        }
    }
    _watch() {
      this._ensureDirectory(), h.existsSync(this.path) || this._write(Q()), process.platform === "win32" ? h.watch(this.path, { persistent: !1 }, q(() => {
        this.events.emit("change");
      }, { wait: 100 })) : h.watchFile(this.path, { persistent: !1 }, q(() => {
        this.events.emit("change");
      }, { wait: 5e3 }));
    }
    _migrate(I, A, E) {
      let p = this._get(L, "0.0.0");
      const b = Object.keys(I).filter((o) => this._shouldPerformMigration(o, p, A));
      let $ = { ...this.store };
      for (const o of b)
        try {
          E && E(this, {
            fromVersion: p,
            toVersion: o,
            finalVersion: A,
            versions: b
          });
          const f = I[o];
          f(this), this._set(L, o), p = o, $ = { ...this.store };
        } catch (f) {
          throw this.store = $, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${f}`);
        }
      (this._isVersionInRangeFormat(p) || !X.eq(p, A)) && this._set(L, A);
    }
    _containsReservedKey(I) {
      return typeof I == "object" && Object.keys(I)[0] === M ? !0 : typeof I != "string" ? !1 : n(this, c, "f").accessPropertiesByDotNotation ? !!I.startsWith(`${M}.`) : !1;
    }
    _isVersionInRangeFormat(I) {
      return X.clean(I) === null;
    }
    _shouldPerformMigration(I, A, E) {
      return this._isVersionInRangeFormat(I) ? A !== "0.0.0" && X.satisfies(A, I) ? !1 : X.satisfies(E, I) : !(X.lte(I, A) || X.gt(I, E));
    }
    _get(I, A) {
      return _.get(this.store, I, A);
    }
    _set(I, A) {
      const { store: E } = this;
      _.set(E, I, A), this.store = E;
    }
  }
  t.default = H, e.exports = H, e.exports.default = H;
})(gs, gs.exports);
var Pw = gs.exports;
const rc = Xt, { app: On, ipcMain: Vs, ipcRenderer: nc, shell: Nw } = cu, Ow = Pw;
let sc = !1;
const ac = () => {
  if (!Vs || !On)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: On.getPath("userData"),
    appVersion: On.getVersion()
  };
  return sc || (Vs.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), sc = !0), e;
};
class Rw extends Ow {
  constructor(t) {
    let r, n;
    if (nc) {
      const s = nc.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Vs && On && ({ defaultCwd: r, appVersion: n } = ac());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = rc.isAbsolute(t.cwd) ? t.cwd : rc.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    ac();
  }
  async openInEditor() {
    const t = await Nw.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var Tw = Rw;
const Iw = /* @__PURE__ */ mu(Tw), jw = Vr.getAppPath(), rs = jw;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
process.env.APP_ROOT = rs;
const Us = process.env.VITE_DEV_SERVER_URL, Aw = It.join(rs, "dist-electron"), ou = It.join(rs, "dist");
process.env.VITE_PUBLIC = Us ? It.join(rs, "public") : ou;
let B;
function iu() {
  const e = Pt.get("windowBounds");
  B = new Ur({
    icon: It.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    frame: !1,
    titleBarStyle: "hidden",
    center: !0,
    // Force center on every launch as requested
    webPreferences: {
      preload: It.join(Aw, "preload.mjs")
    },
    // Only restore size, not position, to ensure it always starts in the center
    // ...bounds, 
    // Default to a larger size suitable for Full HD (1920x1080)
    width: (e == null ? void 0 : e.width) || 1600,
    height: (e == null ? void 0 : e.height) || 900
  }), B.on("resize", () => {
    if (B) {
      const { width: t, height: r } = B.getBounds();
      Pt.set("windowBounds", { ...Pt.get("windowBounds"), width: t, height: r });
    }
  }), B.on("move", () => {
    if (B) {
      const { x: t, y: r } = B.getBounds();
      Pt.set("windowBounds", { ...Pt.get("windowBounds"), x: t, y: r });
    }
  }), B.webContents.on("did-finish-load", () => {
    B == null || B.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Us ? (B.loadURL(Us), B.webContents.closeDevTools()) : (B.loadFile(It.join(ou, "index.html")), B.webContents.closeDevTools()), B.webContents.on("before-input-event", (t, r) => {
    r.key === "F12" && r.type === "keyDown" && (B == null || B.webContents.toggleDevTools(), t.preventDefault()), r.control && r.shift && r.key.toLowerCase() === "i" && r.type === "keyDown" && (B == null || B.webContents.toggleDevTools(), t.preventDefault());
  });
}
Vr.on("window-all-closed", () => {
  process.platform !== "darwin" && (Vr.quit(), B = null);
});
Vr.on("activate", () => {
  Ur.getAllWindows().length === 0 && iu();
});
const Pt = new Iw();
Ve.on("electron-store-get", async (e, t) => {
  e.returnValue = Pt.get(t);
});
Ve.on("electron-store-set", async (e, t, r) => {
  Pt.set(t, r);
});
Ve.on("electron-store-delete", async (e, t) => {
  Pt.delete(t);
});
Ve.on("window-minimize", () => {
  B == null || B.minimize();
});
Ve.on("window-maximize", () => {
  B != null && B.isMaximized() ? B == null || B.unmaximize() : B == null || B.maximize();
});
Ve.on("window-close", () => {
  B == null || B.close();
});
Ve.on("reload-window", () => {
  B == null || B.webContents.reload();
});
Ve.on("force-reload-window", () => {
  B == null || B.webContents.reloadIgnoringCache();
});
Ve.on("toggle-devtools", () => {
  B == null || B.webContents.toggleDevTools();
});
Ve.on("zoom-in", () => {
  const e = (B == null ? void 0 : B.webContents.getZoomLevel()) || 0;
  B == null || B.webContents.setZoomLevel(e + 0.5);
});
Ve.on("zoom-out", () => {
  const e = (B == null ? void 0 : B.webContents.getZoomLevel()) || 0;
  B == null || B.webContents.setZoomLevel(e - 0.5);
});
Ve.on("zoom-reset", () => {
  B == null || B.webContents.setZoomLevel(0);
});
Ve.on("toggle-fullscreen", () => {
  B && B.setFullScreen(!B.isFullScreen());
});
Ve.on("print-window", (e) => {
  const t = Ur.fromWebContents(e.sender);
  t && t.webContents.print({
    silent: !1,
    printBackground: !0,
    margins: {
      marginType: "none"
    }
  }, (r, n) => {
    r || console.log("Print failed:", n);
  });
});
Ve.handle("preview-window", async (e, t) => {
  const r = Ur.fromWebContents(e.sender);
  if (!r) return !1;
  try {
    const n = await r.webContents.printToPDF({
      printBackground: !0,
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      pageSize: "A4"
    }), a = `${(t || "Print-Preview").replace(/[^a-z0-9\u0E00-\u0E7F\-\_\s]/gi, "").trim()}.pdf`, i = It.join(lu.tmpdir(), a);
    zo.writeFileSync(i, n);
    const l = new Ur({
      width: 1e3,
      height: 900,
      title: t || "Print Preview",
      icon: It.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
      webPreferences: {
        plugins: !0
        // Enable PDF viewer
      }
    });
    return l.on("page-title-updated", (c) => {
      c.preventDefault();
    }), l.on("closed", () => {
      setTimeout(() => {
        zo.unlink(i, (c) => {
          c && console.error("Failed to cleanup temp PDF:", c);
        });
      }, 1e3);
    }), l.setMenu(null), l.loadURL(`file://${i}`), !0;
  } catch (n) {
    return console.error("Failed to generate PDF preview:", n), !1;
  }
});
Vr.whenReady().then(() => {
  iu();
});
export {
  Aw as MAIN_DIST,
  ou as RENDERER_DIST,
  Us as VITE_DEV_SERVER_URL
};
