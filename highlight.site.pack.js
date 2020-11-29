/*
  Highlight.js 10.2.1 (32fb9a1d)
  License: BSD-3-Clause
  Copyright (c) 2006-2020, Ivan Sagalaev
*/
var hljs = (function () {
  "use strict";
  function e(n) {
    Object.freeze(n);
    var t = "function" == typeof n;
    return (
      Object.getOwnPropertyNames(n).forEach(function (r) {
        !Object.hasOwnProperty.call(n, r) ||
          null === n[r] ||
          ("object" != typeof n[r] && "function" != typeof n[r]) ||
          (t && ("caller" === r || "callee" === r || "arguments" === r)) ||
          Object.isFrozen(n[r]) ||
          e(n[r]);
      }),
      n
    );
  }
  class n {
    constructor(e) {
      void 0 === e.data && (e.data = {}), (this.data = e.data);
    }
    ignoreMatch() {
      this.ignore = !0;
    }
  }
  function t(e) {
    return e
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }
  function r(e, ...n) {
    var t = {};
    for (const n in e) t[n] = e[n];
    return (
      n.forEach(function (e) {
        for (const n in e) t[n] = e[n];
      }),
      t
    );
  }
  function a(e) {
    return e.nodeName.toLowerCase();
  }
  var i = Object.freeze({
    __proto__: null,
    escapeHTML: t,
    inherit: r,
    nodeStream: function (e) {
      var n = [];
      return (
        (function e(t, r) {
          for (var i = t.firstChild; i; i = i.nextSibling)
            3 === i.nodeType
              ? (r += i.nodeValue.length)
              : 1 === i.nodeType &&
                (n.push({
                  event: "start",
                  offset: r,
                  node: i,
                }),
                (r = e(i, r)),
                a(i).match(/br|hr|img|input/) ||
                  n.push({
                    event: "stop",
                    offset: r,
                    node: i,
                  }));
          return r;
        })(e, 0),
        n
      );
    },
    mergeStreams: function (e, n, r) {
      var i = 0,
        s = "",
        o = [];
      function l() {
        return e.length && n.length
          ? e[0].offset !== n[0].offset
            ? e[0].offset < n[0].offset
              ? e
              : n
            : "start" === n[0].event
            ? e
            : n
          : e.length
          ? e
          : n;
      }
      function c(e) {
        s +=
          "<" +
          a(e) +
          [].map
            .call(e.attributes, function (e) {
              return " " + e.nodeName + '="' + t(e.value) + '"';
            })
            .join("") +
          ">";
      }
      function u(e) {
        s += "</" + a(e) + ">";
      }
      function g(e) {
        ("start" === e.event ? c : u)(e.node);
      }
      for (; e.length || n.length; ) {
        var d = l();
        if (
          ((s += t(r.substring(i, d[0].offset))), (i = d[0].offset), d === e)
        ) {
          o.reverse().forEach(u);
          do {
            g(d.splice(0, 1)[0]), (d = l());
          } while (d === e && d.length && d[0].offset === i);
          o.reverse().forEach(c);
        } else
          "start" === d[0].event ? o.push(d[0].node) : o.pop(),
            g(d.splice(0, 1)[0]);
      }
      return s + t(r.substr(i));
    },
  });
  const s = "</span>",
    o = (e) => !!e.kind;
  class l {
    constructor(e, n) {
      (this.buffer = ""), (this.classPrefix = n.classPrefix), e.walk(this);
    }
    addText(e) {
      this.buffer += t(e);
    }
    openNode(e) {
      if (!o(e)) return;
      let n = e.kind;
      e.sublanguage || (n = `${this.classPrefix}${n}`), this.span(n);
    }
    closeNode(e) {
      o(e) && (this.buffer += s);
    }
    value() {
      return this.buffer;
    }
    span(e) {
      this.buffer += `<span class="${e}">`;
    }
  }
  class c {
    constructor() {
      (this.rootNode = {
        children: [],
      }),
        (this.stack = [this.rootNode]);
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    add(e) {
      this.top.children.push(e);
    }
    openNode(e) {
      const n = {
        kind: e,
        children: [],
      };
      this.add(n), this.stack.push(n);
    }
    closeNode() {
      if (this.stack.length > 1) return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); );
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    walk(e) {
      return this.constructor._walk(e, this.rootNode);
    }
    static _walk(e, n) {
      return (
        "string" == typeof n
          ? e.addText(n)
          : n.children &&
            (e.openNode(n),
            n.children.forEach((n) => this._walk(e, n)),
            e.closeNode(n)),
        e
      );
    }
    static _collapse(e) {
      "string" != typeof e &&
        e.children &&
        (e.children.every((e) => "string" == typeof e)
          ? (e.children = [e.children.join("")])
          : e.children.forEach((e) => {
              c._collapse(e);
            }));
    }
  }
  class u extends c {
    constructor(e) {
      super(), (this.options = e);
    }
    addKeyword(e, n) {
      "" !== e && (this.openNode(n), this.addText(e), this.closeNode());
    }
    addText(e) {
      "" !== e && this.add(e);
    }
    addSublanguage(e, n) {
      const t = e.root;
      (t.kind = n), (t.sublanguage = !0), this.add(t);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return !0;
    }
  }
  function g(e) {
    return e ? ("string" == typeof e ? e : e.source) : null;
  }
  const d =
      "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    h = {
      begin: "\\\\[\\s\\S]",
      relevance: 0,
    },
    f = {
      className: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [h],
    },
    p = {
      className: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [h],
    },
    m = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
    },
    b = function (e, n, t = {}) {
      var a = r(
        {
          className: "comment",
          begin: e,
          end: n,
          contains: [],
        },
        t
      );
      return (
        a.contains.push(m),
        a.contains.push({
          className: "doctag",
          begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
          relevance: 0,
        }),
        a
      );
    },
    v = b("//", "$"),
    x = b("/\\*", "\\*/"),
    E = b("#", "$");
  var _ = Object.freeze({
      __proto__: null,
      IDENT_RE: "[a-zA-Z]\\w*",
      UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
      NUMBER_RE: "\\b\\d+(\\.\\d+)?",
      C_NUMBER_RE: d,
      BINARY_NUMBER_RE: "\\b(0b[01]+)",
      RE_STARTERS_RE:
        "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
      SHEBANG: (e = {}) => {
        const n = /^#![ ]*\//;
        return (
          e.binary &&
            (e.begin = (function (...e) {
              return e.map((e) => g(e)).join("");
            })(n, /.*\b/, e.binary, /\b.*/)),
          r(
            {
              className: "meta",
              begin: n,
              end: /$/,
              relevance: 0,
              "on:begin": (e, n) => {
                0 !== e.index && n.ignoreMatch();
              },
            },
            e
          )
        );
      },
      BACKSLASH_ESCAPE: h,
      APOS_STRING_MODE: f,
      QUOTE_STRING_MODE: p,
      PHRASAL_WORDS_MODE: m,
      COMMENT: b,
      C_LINE_COMMENT_MODE: v,
      C_BLOCK_COMMENT_MODE: x,
      HASH_COMMENT_MODE: E,
      NUMBER_MODE: {
        className: "number",
        begin: "\\b\\d+(\\.\\d+)?",
        relevance: 0,
      },
      C_NUMBER_MODE: {
        className: "number",
        begin: d,
        relevance: 0,
      },
      BINARY_NUMBER_MODE: {
        className: "number",
        begin: "\\b(0b[01]+)",
        relevance: 0,
      },
      CSS_NUMBER_MODE: {
        className: "number",
        begin:
          "\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0,
      },
      REGEXP_MODE: {
        begin: /(?=\/[^/\n]*\/)/,
        contains: [
          {
            className: "regexp",
            begin: /\//,
            end: /\/[gimuy]*/,
            illegal: /\n/,
            contains: [
              h,
              {
                begin: /\[/,
                end: /\]/,
                relevance: 0,
                contains: [h],
              },
            ],
          },
        ],
      },
      TITLE_MODE: {
        className: "title",
        begin: "[a-zA-Z]\\w*",
        relevance: 0,
      },
      UNDERSCORE_TITLE_MODE: {
        className: "title",
        begin: "[a-zA-Z_]\\w*",
        relevance: 0,
      },
      METHOD_GUARD: {
        begin: "\\.\\s*[a-zA-Z_]\\w*",
        relevance: 0,
      },
      END_SAME_AS_BEGIN: function (e) {
        return Object.assign(e, {
          "on:begin": (e, n) => {
            n.data._beginMatch = e[1];
          },
          "on:end": (e, n) => {
            n.data._beginMatch !== e[1] && n.ignoreMatch();
          },
        });
      },
    }),
    w = "of and for in not or if then".split(" ");
  function N(e, n) {
    return n
      ? +n
      : (function (e) {
          return w.includes(e.toLowerCase());
        })(e)
      ? 0
      : 1;
  }
  const y = {
      props: ["language", "code", "autodetect"],
      data: function () {
        return {
          detectedLanguage: "",
          unknownLanguage: !1,
        };
      },
      computed: {
        className() {
          return this.unknownLanguage ? "" : "hljs " + this.detectedLanguage;
        },
        highlighted() {
          if (!this.autoDetect && !hljs.getLanguage(this.language))
            return (
              console.warn(
                `The language "${this.language}" you specified could not be found.`
              ),
              (this.unknownLanguage = !0),
              t(this.code)
            );
          let e;
          return (
            this.autoDetect
              ? ((e = hljs.highlightAuto(this.code)),
                (this.detectedLanguage = e.language))
              : ((e = hljs.highlight(
                  this.language,
                  this.code,
                  this.ignoreIllegals
                )),
                (this.detectectLanguage = this.language)),
            e.value
          );
        },
        autoDetect() {
          return !(this.language && ((e = this.autodetect), !e && "" !== e));
          var e;
        },
        ignoreIllegals: () => !0,
      },
      render(e) {
        return e("pre", {}, [
          e("code", {
            class: this.className,
            domProps: {
              innerHTML: this.highlighted,
            },
          }),
        ]);
      },
    },
    R = {
      install(e) {
        e.component("highlightjs", y);
      },
    },
    k = t,
    M = r,
    { nodeStream: O, mergeStreams: L } = i,
    A = Symbol("nomatch");
  return (function (t) {
    var a = [],
      i = Object.create(null),
      s = Object.create(null),
      o = [],
      l = !0,
      c = /(^(<[^>]+>|\t|)+|\n)/gm,
      d =
        "Could not find the language '{}', did you forget to load/include a language module?";
    const h = {
      disableAutodetect: !0,
      name: "Plain text",
      contains: [],
    };
    var f = {
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      tabReplace: null,
      useBR: !1,
      languages: null,
      __emitter: u,
    };
    function p(e) {
      return f.noHighlightRe.test(e);
    }
    function m(e, n, t, r) {
      var a = {
        code: n,
        language: e,
      };
      j("before:highlight", a);
      var i = a.result ? a.result : b(a.language, a.code, t, r);
      return (i.code = a.code), j("after:highlight", i), i;
    }
    function b(e, t, a, s) {
      var o = t;
      function c(e, n) {
        var t = E.case_insensitive ? n[0].toLowerCase() : n[0];
        return (
          Object.prototype.hasOwnProperty.call(e.keywords, t) && e.keywords[t]
        );
      }
      function u() {
        null != R.subLanguage
          ? (function () {
              if ("" !== L) {
                var e = null;
                if ("string" == typeof R.subLanguage) {
                  if (!i[R.subLanguage]) return void O.addText(L);
                  (e = b(R.subLanguage, L, !0, M[R.subLanguage])),
                    (M[R.subLanguage] = e.top);
                } else e = v(L, R.subLanguage.length ? R.subLanguage : null);
                R.relevance > 0 && (I += e.relevance),
                  O.addSublanguage(e.emitter, e.language);
              }
            })()
          : (function () {
              if (!R.keywords) return void O.addText(L);
              let e = 0;
              R.keywordPatternRe.lastIndex = 0;
              let n = R.keywordPatternRe.exec(L),
                t = "";
              for (; n; ) {
                t += L.substring(e, n.index);
                const r = c(R, n);
                if (r) {
                  const [e, a] = r;
                  O.addText(t), (t = ""), (I += a), O.addKeyword(n[0], e);
                } else t += n[0];
                (e = R.keywordPatternRe.lastIndex),
                  (n = R.keywordPatternRe.exec(L));
              }
              (t += L.substr(e)), O.addText(t);
            })(),
          (L = "");
      }
      function h(e) {
        return (
          e.className && O.openNode(e.className),
          (R = Object.create(e, {
            parent: {
              value: R,
            },
          }))
        );
      }
      function p(e) {
        return 0 === R.matcher.regexIndex ? ((L += e[0]), 1) : ((S = !0), 0);
      }
      var m = {};
      function x(t, r) {
        var i = r && r[0];
        if (((L += t), null == i)) return u(), 0;
        if (
          "begin" === m.type &&
          "end" === r.type &&
          m.index === r.index &&
          "" === i
        ) {
          if (((L += o.slice(r.index, r.index + 1)), !l)) {
            const n = Error("0 width match regex");
            throw ((n.languageName = e), (n.badRule = m.rule), n);
          }
          return 1;
        }
        if (((m = r), "begin" === r.type))
          return (function (e) {
            var t = e[0],
              r = e.rule;
            const a = new n(r),
              i = [r.__beforeBegin, r["on:begin"]];
            for (const n of i) if (n && (n(e, a), a.ignore)) return p(t);
            return (
              r &&
                r.endSameAsBegin &&
                (r.endRe = RegExp(
                  t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
                  "m"
                )),
              r.skip
                ? (L += t)
                : (r.excludeBegin && (L += t),
                  u(),
                  r.returnBegin || r.excludeBegin || (L = t)),
              h(r),
              r.returnBegin ? 0 : t.length
            );
          })(r);
        if ("illegal" === r.type && !a) {
          const e = Error(
            'Illegal lexeme "' +
              i +
              '" for mode "' +
              (R.className || "<unnamed>") +
              '"'
          );
          throw ((e.mode = R), e);
        }
        if ("end" === r.type) {
          var s = (function (e) {
            var t = e[0],
              r = o.substr(e.index),
              a = (function e(t, r, a) {
                let i = (function (e, n) {
                  var t = e && e.exec(n);
                  return t && 0 === t.index;
                })(t.endRe, a);
                if (i) {
                  if (t["on:end"]) {
                    const e = new n(t);
                    t["on:end"](r, e), e.ignore && (i = !1);
                  }
                  if (i) {
                    for (; t.endsParent && t.parent; ) t = t.parent;
                    return t;
                  }
                }
                if (t.endsWithParent) return e(t.parent, r, a);
              })(R, e, r);
            if (!a) return A;
            var i = R;
            i.skip
              ? (L += t)
              : (i.returnEnd || i.excludeEnd || (L += t),
                u(),
                i.excludeEnd && (L = t));
            do {
              R.className && O.closeNode(),
                R.skip || R.subLanguage || (I += R.relevance),
                (R = R.parent);
            } while (R !== a.parent);
            return (
              a.starts &&
                (a.endSameAsBegin && (a.starts.endRe = a.endRe), h(a.starts)),
              i.returnEnd ? 0 : t.length
            );
          })(r);
          if (s !== A) return s;
        }
        if ("illegal" === r.type && "" === i) return 1;
        if (j > 1e5 && j > 3 * r.index)
          throw Error(
            "potential infinite loop, way more iterations than matches"
          );
        return (L += i), i.length;
      }
      var E = y(e);
      if (!E)
        throw (
          (console.error(d.replace("{}", e)),
          Error('Unknown language: "' + e + '"'))
        );
      var _ = (function (e) {
          function n(n, t) {
            return RegExp(
              g(n),
              "m" + (e.case_insensitive ? "i" : "") + (t ? "g" : "")
            );
          }
          class t {
            constructor() {
              (this.matchIndexes = {}),
                (this.regexes = []),
                (this.matchAt = 1),
                (this.position = 0);
            }
            addRule(e, n) {
              (n.position = this.position++),
                (this.matchIndexes[this.matchAt] = n),
                this.regexes.push([n, e]),
                (this.matchAt +=
                  (function (e) {
                    return RegExp(e.toString() + "|").exec("").length - 1;
                  })(e) + 1);
            }
            compile() {
              0 === this.regexes.length && (this.exec = () => null);
              const e = this.regexes.map((e) => e[1]);
              (this.matcherRe = n(
                (function (e, n = "|") {
                  for (
                    var t = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,
                      r = 0,
                      a = "",
                      i = 0;
                    i < e.length;
                    i++
                  ) {
                    var s = (r += 1),
                      o = g(e[i]);
                    for (i > 0 && (a += n), a += "("; o.length > 0; ) {
                      var l = t.exec(o);
                      if (null == l) {
                        a += o;
                        break;
                      }
                      (a += o.substring(0, l.index)),
                        (o = o.substring(l.index + l[0].length)),
                        "\\" === l[0][0] && l[1]
                          ? (a += "\\" + (+l[1] + s))
                          : ((a += l[0]), "(" === l[0] && r++);
                    }
                    a += ")";
                  }
                  return a;
                })(e),
                !0
              )),
                (this.lastIndex = 0);
            }
            exec(e) {
              this.matcherRe.lastIndex = this.lastIndex;
              const n = this.matcherRe.exec(e);
              if (!n) return null;
              const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
                r = this.matchIndexes[t];
              return n.splice(0, t), Object.assign(n, r);
            }
          }
          class a {
            constructor() {
              (this.rules = []),
                (this.multiRegexes = []),
                (this.count = 0),
                (this.lastIndex = 0),
                (this.regexIndex = 0);
            }
            getMatcher(e) {
              if (this.multiRegexes[e]) return this.multiRegexes[e];
              const n = new t();
              return (
                this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)),
                n.compile(),
                (this.multiRegexes[e] = n),
                n
              );
            }
            resumingScanAtSamePosition() {
              return 0 !== this.regexIndex;
            }
            considerAll() {
              this.regexIndex = 0;
            }
            addRule(e, n) {
              this.rules.push([e, n]), "begin" === n.type && this.count++;
            }
            exec(e) {
              const n = this.getMatcher(this.regexIndex);
              n.lastIndex = this.lastIndex;
              let t = n.exec(e);
              if (this.resumingScanAtSamePosition())
                if (t && t.index === this.lastIndex);
                else {
                  const n = this.getMatcher(0);
                  (n.lastIndex = this.lastIndex + 1), (t = n.exec(e));
                }
              return (
                t &&
                  ((this.regexIndex += t.position + 1),
                  this.regexIndex === this.count && this.considerAll()),
                t
              );
            }
          }
          function i(e, n) {
            const t = e.input[e.index - 1],
              r = e.input[e.index + e[0].length];
            ("." !== t && "." !== r) || n.ignoreMatch();
          }
          if (e.contains && e.contains.includes("self"))
            throw Error(
              "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
            );
          return (function t(s, o) {
            const l = s;
            if (s.compiled) return l;
            (s.compiled = !0),
              (s.__beforeBegin = null),
              (s.keywords = s.keywords || s.beginKeywords);
            let c = null;
            if (
              ("object" == typeof s.keywords &&
                ((c = s.keywords.$pattern), delete s.keywords.$pattern),
              s.keywords &&
                (s.keywords = (function (e, n) {
                  var t = {};
                  return (
                    "string" == typeof e
                      ? r("keyword", e)
                      : Object.keys(e).forEach(function (n) {
                          r(n, e[n]);
                        }),
                    t
                  );
                  function r(e, r) {
                    n && (r = r.toLowerCase()),
                      r.split(" ").forEach(function (n) {
                        var r = n.split("|");
                        t[r[0]] = [e, N(r[0], r[1])];
                      });
                  }
                })(s.keywords, e.case_insensitive)),
              s.lexemes && c)
            )
              throw Error(
                "ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) "
              );
            return (
              (l.keywordPatternRe = n(s.lexemes || c || /\w+/, !0)),
              o &&
                (s.beginKeywords &&
                  ((s.begin =
                    "\\b(" +
                    s.beginKeywords.split(" ").join("|") +
                    ")(?=\\b|\\s)"),
                  (s.__beforeBegin = i)),
                s.begin || (s.begin = /\B|\b/),
                (l.beginRe = n(s.begin)),
                s.endSameAsBegin && (s.end = s.begin),
                s.end || s.endsWithParent || (s.end = /\B|\b/),
                s.end && (l.endRe = n(s.end)),
                (l.terminator_end = g(s.end) || ""),
                s.endsWithParent &&
                  o.terminator_end &&
                  (l.terminator_end += (s.end ? "|" : "") + o.terminator_end)),
              s.illegal && (l.illegalRe = n(s.illegal)),
              void 0 === s.relevance && (s.relevance = 1),
              s.contains || (s.contains = []),
              (s.contains = [].concat(
                ...s.contains.map(function (e) {
                  return (function (e) {
                    return (
                      e.variants &&
                        !e.cached_variants &&
                        (e.cached_variants = e.variants.map(function (n) {
                          return r(
                            e,
                            {
                              variants: null,
                            },
                            n
                          );
                        })),
                      e.cached_variants
                        ? e.cached_variants
                        : (function e(n) {
                            return !!n && (n.endsWithParent || e(n.starts));
                          })(e)
                        ? r(e, {
                            starts: e.starts ? r(e.starts) : null,
                          })
                        : Object.isFrozen(e)
                        ? r(e)
                        : e
                    );
                  })("self" === e ? s : e);
                })
              )),
              s.contains.forEach(function (e) {
                t(e, l);
              }),
              s.starts && t(s.starts, o),
              (l.matcher = (function (e) {
                const n = new a();
                return (
                  e.contains.forEach((e) =>
                    n.addRule(e.begin, {
                      rule: e,
                      type: "begin",
                    })
                  ),
                  e.terminator_end &&
                    n.addRule(e.terminator_end, {
                      type: "end",
                    }),
                  e.illegal &&
                    n.addRule(e.illegal, {
                      type: "illegal",
                    }),
                  n
                );
              })(l)),
              l
            );
          })(e);
        })(E),
        w = "",
        R = s || _,
        M = {},
        O = new f.__emitter(f);
      !(function () {
        for (var e = [], n = R; n !== E; n = n.parent)
          n.className && e.unshift(n.className);
        e.forEach((e) => O.openNode(e));
      })();
      var L = "",
        I = 0,
        T = 0,
        j = 0,
        S = !1;
      try {
        for (R.matcher.considerAll(); ; ) {
          j++,
            S ? (S = !1) : R.matcher.considerAll(),
            (R.matcher.lastIndex = T);
          const e = R.matcher.exec(o);
          if (!e) break;
          const n = x(o.substring(T, e.index), e);
          T = e.index + n;
        }
        return (
          x(o.substr(T)),
          O.closeAllNodes(),
          O.finalize(),
          (w = O.toHTML()),
          {
            relevance: I,
            value: w,
            language: e,
            illegal: !1,
            emitter: O,
            top: R,
          }
        );
      } catch (n) {
        if (n.message && n.message.includes("Illegal"))
          return {
            illegal: !0,
            illegalBy: {
              msg: n.message,
              context: o.slice(T - 100, T + 100),
              mode: n.mode,
            },
            sofar: w,
            relevance: 0,
            value: k(o),
            emitter: O,
          };
        if (l)
          return {
            illegal: !1,
            relevance: 0,
            value: k(o),
            emitter: O,
            language: e,
            top: R,
            errorRaised: n,
          };
        throw n;
      }
    }
    function v(e, n) {
      n = n || f.languages || Object.keys(i);
      var t = (function (e) {
          const n = {
            relevance: 0,
            emitter: new f.__emitter(f),
            value: k(e),
            illegal: !1,
            top: h,
          };
          return n.emitter.addText(e), n;
        })(e),
        r = t;
      return (
        n
          .filter(y)
          .filter(T)
          .forEach(function (n) {
            var a = b(n, e, !1);
            (a.language = n),
              a.relevance > r.relevance && (r = a),
              a.relevance > t.relevance && ((r = t), (t = a));
          }),
        r.language && (t.second_best = r),
        t
      );
    }
    function x(e) {
      return f.tabReplace || f.useBR
        ? e.replace(c, (e) =>
            "\n" === e
              ? f.useBR
                ? "<br>"
                : e
              : f.tabReplace
              ? e.replace(/\t/g, f.tabReplace)
              : e
          )
        : e;
    }
    function E(e) {
      let n = null;
      const t = (function (e) {
        var n = e.className + " ";
        n += e.parentNode ? e.parentNode.className : "";
        const t = f.languageDetectRe.exec(n);
        if (t) {
          var r = y(t[1]);
          return (
            r ||
              (console.warn(d.replace("{}", t[1])),
              console.warn(
                "Falling back to no-highlight mode for this block.",
                e
              )),
            r ? t[1] : "no-highlight"
          );
        }
        return n.split(/\s+/).find((e) => p(e) || y(e));
      })(e);
      if (p(t)) return;
      j("before:highlightBlock", {
        block: e,
        language: t,
      }),
        f.useBR
          ? ((n = document.createElement(
              "div"
            )).innerHTML = e.innerHTML
              .replace(/\n/g, "")
              .replace(/<br[ /]*>/g, "\n"))
          : (n = e);
      const r = n.textContent,
        a = t ? m(t, r, !0) : v(r),
        i = O(n);
      if (i.length) {
        const e = document.createElement("div");
        (e.innerHTML = a.value), (a.value = L(i, O(e), r));
      }
      (a.value = x(a.value)),
        j("after:highlightBlock", {
          block: e,
          result: a,
        }),
        (e.innerHTML = a.value),
        (e.className = (function (e, n, t) {
          var r = n ? s[n] : t,
            a = [e.trim()];
          return (
            e.match(/\bhljs\b/) || a.push("hljs"),
            e.includes(r) || a.push(r),
            a.join(" ").trim()
          );
        })(e.className, t, a.language)),
        (e.result = {
          language: a.language,
          re: a.relevance,
          relavance: a.relevance,
        }),
        a.second_best &&
          (e.second_best = {
            language: a.second_best.language,
            re: a.second_best.relevance,
            relavance: a.second_best.relevance,
          });
    }
    const w = () => {
      if (!w.called) {
        w.called = !0;
        var e = document.querySelectorAll("pre code");
        a.forEach.call(e, E);
      }
    };
    function y(e) {
      return (e = (e || "").toLowerCase()), i[e] || i[s[e]];
    }
    function I(e, { languageName: n }) {
      "string" == typeof e && (e = [e]),
        e.forEach((e) => {
          s[e] = n;
        });
    }
    function T(e) {
      var n = y(e);
      return n && !n.disableAutodetect;
    }
    function j(e, n) {
      var t = e;
      o.forEach(function (e) {
        e[t] && e[t](n);
      });
    }
    Object.assign(t, {
      highlight: m,
      highlightAuto: v,
      fixMarkup: function (e) {
        return (
          console.warn(
            "fixMarkup is deprecated and will be removed entirely in v11.0"
          ),
          console.warn(
            "Please see https://github.com/highlightjs/highlight.js/issues/2534"
          ),
          x(e)
        );
      },
      highlightBlock: E,
      configure: function (e) {
        f = M(f, e);
      },
      initHighlighting: w,
      initHighlightingOnLoad: function () {
        window.addEventListener("DOMContentLoaded", w, !1);
      },
      registerLanguage: function (e, n) {
        var r = null;
        try {
          r = n(t);
        } catch (n) {
          if (
            (console.error(
              "Language definition for '{}' could not be registered.".replace(
                "{}",
                e
              )
            ),
            !l)
          )
            throw n;
          console.error(n), (r = h);
        }
        r.name || (r.name = e),
          (i[e] = r),
          (r.rawDefinition = n.bind(null, t)),
          r.aliases &&
            I(r.aliases, {
              languageName: e,
            });
      },
      listLanguages: function () {
        return Object.keys(i);
      },
      getLanguage: y,
      registerAliases: I,
      requireLanguage: function (e) {
        var n = y(e);
        if (n) return n;
        throw Error(
          "The '{}' language is required, but not loaded.".replace("{}", e)
        );
      },
      autoDetection: T,
      inherit: M,
      addPlugin: function (e) {
        o.push(e);
      },
      vuePlugin: R,
    }),
      (t.debugMode = function () {
        l = !1;
      }),
      (t.safeMode = function () {
        l = !0;
      }),
      (t.versionString = "10.2.1");
    for (const n in _) "object" == typeof _[n] && e(_[n]);
    return Object.assign(t, _), t;
  })({});
})();
"object" == typeof exports &&
  "undefined" != typeof module &&
  (module.exports = hljs);
hljs.registerLanguage(
  "python",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          keyword:
            "and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10",
          built_in: "Ellipsis NotImplemented",
          literal: "False None True",
        },
        a = {
          className: "meta",
          begin: /^(>>>|\.\.\.) /,
        },
        i = {
          className: "subst",
          begin: /\{/,
          end: /\}/,
          keywords: n,
          illegal: /#/,
        },
        s = {
          begin: /\{\{/,
          relevance: 0,
        },
        r = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE],
          variants: [
            {
              begin: /(u|b)?r?'''/,
              end: /'''/,
              contains: [e.BACKSLASH_ESCAPE, a],
              relevance: 10,
            },
            {
              begin: /(u|b)?r?"""/,
              end: /"""/,
              contains: [e.BACKSLASH_ESCAPE, a],
              relevance: 10,
            },
            {
              begin: /(fr|rf|f)'''/,
              end: /'''/,
              contains: [e.BACKSLASH_ESCAPE, a, s, i],
            },
            {
              begin: /(fr|rf|f)"""/,
              end: /"""/,
              contains: [e.BACKSLASH_ESCAPE, a, s, i],
            },
            {
              begin: /(u|r|ur)'/,
              end: /'/,
              relevance: 10,
            },
            {
              begin: /(u|r|ur)"/,
              end: /"/,
              relevance: 10,
            },
            {
              begin: /(b|br)'/,
              end: /'/,
            },
            {
              begin: /(b|br)"/,
              end: /"/,
            },
            {
              begin: /(fr|rf|f)'/,
              end: /'/,
              contains: [e.BACKSLASH_ESCAPE, s, i],
            },
            {
              begin: /(fr|rf|f)"/,
              end: /"/,
              contains: [e.BACKSLASH_ESCAPE, s, i],
            },
            e.APOS_STRING_MODE,
            e.QUOTE_STRING_MODE,
          ],
        },
        l = {
          className: "number",
          relevance: 0,
          variants: [
            {
              begin: e.BINARY_NUMBER_RE + "[lLjJ]?",
            },
            {
              begin: "\\b(0o[0-7]+)[lLjJ]?",
            },
            {
              begin: e.C_NUMBER_RE + "[lLjJ]?",
            },
          ],
        },
        t = {
          className: "params",
          variants: [
            {
              begin: /\(\s*\)/,
              skip: !0,
              className: null,
            },
            {
              begin: /\(/,
              end: /\)/,
              excludeBegin: !0,
              excludeEnd: !0,
              contains: ["self", a, l, r, e.HASH_COMMENT_MODE],
            },
          ],
        };
      return (
        (i.contains = [r, l, a]),
        {
          name: "Python",
          aliases: ["py", "gyp", "ipython"],
          keywords: n,
          illegal: /(<\/|->|\?)|=>/,
          contains: [
            a,
            l,
            {
              beginKeywords: "if",
              relevance: 0,
            },
            r,
            e.HASH_COMMENT_MODE,
            {
              variants: [
                {
                  className: "function",
                  beginKeywords: "def",
                },
                {
                  className: "class",
                  beginKeywords: "class",
                },
              ],
              end: /:/,
              illegal: /[${=;\n,]/,
              contains: [
                e.UNDERSCORE_TITLE_MODE,
                t,
                {
                  begin: /->/,
                  endsWithParent: !0,
                  keywords: "None",
                },
              ],
            },
            {
              className: "meta",
              begin: /^[\t ]*@/,
              end: /$/,
            },
            {
              begin: /\b(print|exec)\(/,
            },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "xml",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          className: "symbol",
          begin: "&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;",
        },
        a = {
          begin: "\\s",
          contains: [
            {
              className: "meta-keyword",
              begin: "#?[a-z_][a-z1-9_-]+",
              illegal: "\\n",
            },
          ],
        },
        s = e.inherit(a, {
          begin: "\\(",
          end: "\\)",
        }),
        t = e.inherit(e.APOS_STRING_MODE, {
          className: "meta-string",
        }),
        i = e.inherit(e.QUOTE_STRING_MODE, {
          className: "meta-string",
        }),
        c = {
          endsWithParent: !0,
          illegal: /</,
          relevance: 0,
          contains: [
            {
              className: "attr",
              begin: "[A-Za-z0-9\\._:-]+",
              relevance: 0,
            },
            {
              begin: /=\s*/,
              relevance: 0,
              contains: [
                {
                  className: "string",
                  endsParent: !0,
                  variants: [
                    {
                      begin: /"/,
                      end: /"/,
                      contains: [n],
                    },
                    {
                      begin: /'/,
                      end: /'/,
                      contains: [n],
                    },
                    {
                      begin: /[^\s"'=<>`]+/,
                    },
                  ],
                },
              ],
            },
          ],
        };
      return {
        name: "HTML, XML",
        aliases: [
          "html",
          "xhtml",
          "rss",
          "atom",
          "xjb",
          "xsd",
          "xsl",
          "plist",
          "wsf",
          "svg",
        ],
        case_insensitive: !0,
        contains: [
          {
            className: "meta",
            begin: "<![a-z]",
            end: ">",
            relevance: 10,
            contains: [
              a,
              i,
              t,
              s,
              {
                begin: "\\[",
                end: "\\]",
                contains: [
                  {
                    className: "meta",
                    begin: "<![a-z]",
                    end: ">",
                    contains: [a, s, i, t],
                  },
                ],
              },
            ],
          },
          e.COMMENT("\x3c!--", "--\x3e", {
            relevance: 10,
          }),
          {
            begin: "<\\!\\[CDATA\\[",
            end: "\\]\\]>",
            relevance: 10,
          },
          n,
          {
            className: "meta",
            begin: /<\?xml/,
            end: /\?>/,
            relevance: 10,
          },
          {
            className: "tag",
            begin: "<style(?=\\s|>)",
            end: ">",
            keywords: {
              name: "style",
            },
            contains: [c],
            starts: {
              end: "</style>",
              returnEnd: !0,
              subLanguage: ["css", "xml"],
            },
          },
          {
            className: "tag",
            begin: "<script(?=\\s|>)",
            end: ">",
            keywords: {
              name: "script",
            },
            contains: [c],
            starts: {
              end: "</script>",
              returnEnd: !0,
              subLanguage: ["javascript", "handlebars", "xml"],
            },
          },
          {
            className: "tag",
            begin: "</?",
            end: "/?>",
            contains: [
              {
                className: "name",
                begin: /[^\/><\s]+/,
                relevance: 0,
              },
              c,
            ],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "javascript",
  (function () {
    "use strict";
    const e = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      a = [].concat(
        [
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          "require",
          "exports",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "unescape",
        ],
        [
          "arguments",
          "this",
          "super",
          "console",
          "window",
          "document",
          "localStorage",
          "module",
          "global",
        ],
        [
          "Intl",
          "DataView",
          "Number",
          "Math",
          "Date",
          "String",
          "RegExp",
          "Object",
          "Function",
          "Boolean",
          "Error",
          "Symbol",
          "Set",
          "Map",
          "WeakSet",
          "WeakMap",
          "Proxy",
          "Reflect",
          "JSON",
          "Promise",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Float32Array",
          "Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "ArrayBuffer",
        ],
        [
          "EvalError",
          "InternalError",
          "RangeError",
          "ReferenceError",
          "SyntaxError",
          "TypeError",
          "URIError",
        ]
      );
    function s(e) {
      return r("(?=", e, ")");
    }
    function r(...e) {
      return e
        .map((e) =>
          (function (e) {
            return e ? ("string" == typeof e ? e : e.source) : null;
          })(e)
        )
        .join("");
    }
    return function (t) {
      var i = "[A-Za-z$_][0-9A-Za-z$_]*",
        c = {
          begin: /<[A-Za-z0-9\\._:-]+/,
          end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        },
        o = {
          $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
          keyword: e.join(" "),
          literal: n.join(" "),
          built_in: a.join(" "),
        },
        l = {
          className: "number",
          variants: [
            {
              begin: "\\b(0[bB][01]+)n?",
            },
            {
              begin: "\\b(0[oO][0-7]+)n?",
            },
            {
              begin: t.C_NUMBER_RE + "n?",
            },
          ],
          relevance: 0,
        },
        E = {
          className: "subst",
          begin: "\\$\\{",
          end: "\\}",
          keywords: o,
          contains: [],
        },
        d = {
          begin: "html`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [t.BACKSLASH_ESCAPE, E],
            subLanguage: "xml",
          },
        },
        g = {
          begin: "css`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [t.BACKSLASH_ESCAPE, E],
            subLanguage: "css",
          },
        },
        u = {
          className: "string",
          begin: "`",
          end: "`",
          contains: [t.BACKSLASH_ESCAPE, E],
        };
      E.contains = [
        t.APOS_STRING_MODE,
        t.QUOTE_STRING_MODE,
        d,
        g,
        u,
        l,
        t.REGEXP_MODE,
      ];
      var b = E.contains.concat([
          {
            begin: /\(/,
            end: /\)/,
            contains: ["self"].concat(E.contains, [
              t.C_BLOCK_COMMENT_MODE,
              t.C_LINE_COMMENT_MODE,
            ]),
          },
          t.C_BLOCK_COMMENT_MODE,
          t.C_LINE_COMMENT_MODE,
        ]),
        _ = {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          contains: b,
        };
      return {
        name: "JavaScript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: o,
        contains: [
          t.SHEBANG({
            binary: "node",
            relevance: 5,
          }),
          {
            className: "meta",
            relevance: 10,
            begin: /^\s*['"]use (strict|asm)['"]/,
          },
          t.APOS_STRING_MODE,
          t.QUOTE_STRING_MODE,
          d,
          g,
          u,
          t.C_LINE_COMMENT_MODE,
          t.COMMENT("/\\*\\*", "\\*/", {
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+",
                contains: [
                  {
                    className: "type",
                    begin: "\\{",
                    end: "\\}",
                    relevance: 0,
                  },
                  {
                    className: "variable",
                    begin: i + "(?=\\s*(-)|$)",
                    endsParent: !0,
                    relevance: 0,
                  },
                  {
                    begin: /(?=[^\n])\s/,
                    relevance: 0,
                  },
                ],
              },
            ],
          }),
          t.C_BLOCK_COMMENT_MODE,
          l,
          {
            begin: r(
              /[{,\n]\s*/,
              s(r(/(((\/\/.*$)|(\/\*(.|\n)*\*\/))\s*)*/, i + "\\s*:"))
            ),
            relevance: 0,
            contains: [
              {
                className: "attr",
                begin: i + s("\\s*:"),
                relevance: 0,
              },
            ],
          },
          {
            begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            contains: [
              t.C_LINE_COMMENT_MODE,
              t.C_BLOCK_COMMENT_MODE,
              t.REGEXP_MODE,
              {
                className: "function",
                begin:
                  "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" +
                  t.UNDERSCORE_IDENT_RE +
                  ")\\s*=>",
                returnBegin: !0,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      {
                        begin: t.UNDERSCORE_IDENT_RE,
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: !0,
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        keywords: o,
                        contains: b,
                      },
                    ],
                  },
                ],
              },
              {
                begin: /,/,
                relevance: 0,
              },
              {
                className: "",
                begin: /\s/,
                end: /\s*/,
                skip: !0,
              },
              {
                variants: [
                  {
                    begin: "<>",
                    end: "</>",
                  },
                  {
                    begin: c.begin,
                    end: c.end,
                  },
                ],
                subLanguage: "xml",
                contains: [
                  {
                    begin: c.begin,
                    end: c.end,
                    skip: !0,
                    contains: ["self"],
                  },
                ],
              },
            ],
            relevance: 0,
          },
          {
            className: "function",
            beginKeywords: "function",
            end: /\{/,
            excludeEnd: !0,
            contains: [
              t.inherit(t.TITLE_MODE, {
                begin: i,
              }),
              _,
            ],
            illegal: /\[|%/,
          },
          {
            begin: /\$[(.]/,
          },
          t.METHOD_GUARD,
          {
            className: "class",
            beginKeywords: "class",
            end: /[{;=]/,
            excludeEnd: !0,
            illegal: /[:"\[\]]/,
            contains: [
              {
                beginKeywords: "extends",
              },
              t.UNDERSCORE_TITLE_MODE,
            ],
          },
          {
            beginKeywords: "constructor",
            end: /\{/,
            excludeEnd: !0,
          },
          {
            begin: "(get|set)\\s+(?=" + i + "\\()",
            end: /{/,
            keywords: "get set",
            contains: [
              t.inherit(t.TITLE_MODE, {
                begin: i,
              }),
              {
                begin: /\(\)/,
              },
              _,
            ],
          },
        ],
        illegal: /#(?!!)/,
      };
    };
  })()
);
hljs.registerLanguage(
  "http",
  (function () {
    "use strict";
    return function (e) {
      var n = "HTTP/[0-9\\.]+";
      return {
        name: "HTTP",
        aliases: ["https"],
        illegal: "\\S",
        contains: [
          {
            begin: "^" + n,
            end: "$",
            contains: [
              {
                className: "number",
                begin: "\\b\\d{3}\\b",
              },
            ],
          },
          {
            begin: "^[A-Z]+ (.*?) " + n + "$",
            returnBegin: !0,
            end: "$",
            contains: [
              {
                className: "string",
                begin: " ",
                end: " ",
                excludeBegin: !0,
                excludeEnd: !0,
              },
              {
                begin: n,
              },
              {
                className: "keyword",
                begin: "[A-Z]+",
              },
            ],
          },
          {
            className: "attribute",
            begin: "^\\w",
            end: ": ",
            excludeEnd: !0,
            illegal: "\\n|\\s|=",
            starts: {
              end: "$",
              relevance: 0,
            },
          },
          {
            begin: "\\n\\n",
            starts: {
              subLanguage: [],
              endsWithParent: !0,
            },
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "c-like",
  (function () {
    "use strict";
    return function (e) {
      function t(e) {
        return "(?:" + e + ")?";
      }
      var n =
          "(decltype\\(auto\\)|" +
          t("[a-zA-Z_]\\w*::") +
          "[a-zA-Z_]\\w*" +
          t("<.*?>") +
          ")",
        r = {
          className: "keyword",
          begin: "\\b[a-z\\d_]*_t\\b",
        },
        a = {
          className: "string",
          variants: [
            {
              begin: '(u8?|U|L)?"',
              end: '"',
              illegal: "\\n",
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin:
                "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
              end: "'",
              illegal: ".",
            },
            e.END_SAME_AS_BEGIN({
              begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
              end: /\)([^()\\ ]{0,16})"/,
            }),
          ],
        },
        i = {
          className: "number",
          variants: [
            {
              begin: "\\b(0b[01']+)",
            },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        s = {
          className: "meta",
          begin: /#\s*[a-z]+\b/,
          end: /$/,
          keywords: {
            "meta-keyword":
              "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
          },
          contains: [
            {
              begin: /\\\n/,
              relevance: 0,
            },
            e.inherit(a, {
              className: "meta-string",
            }),
            {
              className: "meta-string",
              begin: /<.*?>/,
              end: /$/,
              illegal: "\\n",
            },
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
          ],
        },
        o = {
          className: "title",
          begin: t("[a-zA-Z_]\\w*::") + e.IDENT_RE,
          relevance: 0,
        },
        c = t("[a-zA-Z_]\\w*::") + e.IDENT_RE + "\\s*\\(",
        l = {
          keyword:
            "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
          built_in:
            "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
          literal: "true false nullptr NULL",
        },
        d = [r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, i, a],
        _ = {
          variants: [
            {
              begin: /=/,
              end: /;/,
            },
            {
              begin: /\(/,
              end: /\)/,
            },
            {
              beginKeywords: "new throw return else",
              end: /;/,
            },
          ],
          keywords: l,
          contains: d.concat([
            {
              begin: /\(/,
              end: /\)/,
              keywords: l,
              contains: d.concat(["self"]),
              relevance: 0,
            },
          ]),
          relevance: 0,
        },
        u = {
          className: "function",
          begin: "(" + n + "[\\*&\\s]+)+" + c,
          returnBegin: !0,
          end: /[{;=]/,
          excludeEnd: !0,
          keywords: l,
          illegal: /[^\w\s\*&:<>]/,
          contains: [
            {
              begin: "decltype\\(auto\\)",
              keywords: l,
              relevance: 0,
            },
            {
              begin: c,
              returnBegin: !0,
              contains: [o],
              relevance: 0,
            },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: l,
              relevance: 0,
              contains: [
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
                a,
                i,
                r,
                {
                  begin: /\(/,
                  end: /\)/,
                  keywords: l,
                  relevance: 0,
                  contains: [
                    "self",
                    e.C_LINE_COMMENT_MODE,
                    e.C_BLOCK_COMMENT_MODE,
                    a,
                    i,
                    r,
                  ],
                },
              ],
            },
            r,
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            s,
          ],
        };
      return {
        aliases: ["c", "cc", "h", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
        keywords: l,
        disableAutodetect: !0,
        illegal: "</",
        contains: [].concat(_, u, d, [
          s,
          {
            begin:
              "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
            end: ">",
            keywords: l,
            contains: ["self", r],
          },
          {
            begin: e.IDENT_RE + "::",
            keywords: l,
          },
          {
            className: "class",
            beginKeywords: "class struct",
            end: /[{;:]/,
            contains: [
              {
                begin: /</,
                end: />/,
                contains: ["self"],
              },
              e.TITLE_MODE,
            ],
          },
        ]),
        exports: {
          preprocessor: s,
          strings: a,
          keywords: l,
        },
      };
    };
  })()
);
hljs.registerLanguage(
  "cpp",
  (function () {
    "use strict";
    return function (e) {
      var i = e.requireLanguage("c-like").rawDefinition();
      return (
        (i.disableAutodetect = !1),
        (i.name = "C++"),
        (i.aliases = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"]),
        i
      );
    };
  })()
);
hljs.registerLanguage(
  "sql",
  (function () {
    "use strict";
    return function (e) {
      var t = e.COMMENT("--", "$");
      return {
        name: "SQL",
        case_insensitive: !0,
        illegal: /[<>{}*]/,
        contains: [
          {
            beginKeywords:
              "begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment values with",
            end: /;/,
            endsWithParent: !0,
            keywords: {
              $pattern: /[\w\.]+/,
              keyword:
                "as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select self semi sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
              literal: "true false null unknown",
              built_in:
                "array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text time timestamp tinyint varchar varchar2 varying void",
            },
            contains: [
              {
                className: "string",
                begin: "'",
                end: "'",
                contains: [
                  {
                    begin: "''",
                  },
                ],
              },
              {
                className: "string",
                begin: '"',
                end: '"',
                contains: [
                  {
                    begin: '""',
                  },
                ],
              },
              {
                className: "string",
                begin: "`",
                end: "`",
              },
              e.C_NUMBER_MODE,
              e.C_BLOCK_COMMENT_MODE,
              t,
              e.HASH_COMMENT_MODE,
            ],
          },
          e.C_BLOCK_COMMENT_MODE,
          t,
          e.HASH_COMMENT_MODE,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "clojure",
  (function () {
    "use strict";
    return function (e) {
      var t = "[a-zA-Z_\\-!.?+*=<>&#'][a-zA-Z_\\-!.?+*=<>&#'0-9/;:]*",
        n =
          "def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",
        r = {
          $pattern: t,
          "builtin-name":
            n +
            " cond apply if-not if-let if not not= = < > <= >= == + / * - rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize",
        },
        a = {
          begin: t,
          relevance: 0,
        },
        s = {
          className: "number",
          begin: "[-+]?\\d+(\\.\\d+)?",
          relevance: 0,
        },
        o = e.inherit(e.QUOTE_STRING_MODE, {
          illegal: null,
        }),
        i = e.COMMENT(";", "$", {
          relevance: 0,
        }),
        c = {
          className: "literal",
          begin: /\b(true|false|nil)\b/,
        },
        d = {
          begin: "[\\[\\{]",
          end: "[\\]\\}]",
        },
        l = {
          className: "comment",
          begin: "\\^" + t,
        },
        m = e.COMMENT("\\^\\{", "\\}"),
        u = {
          className: "symbol",
          begin: "[:]{1,2}" + t,
        },
        p = {
          begin: "\\(",
          end: "\\)",
        },
        f = {
          endsWithParent: !0,
          relevance: 0,
        },
        h = {
          keywords: r,
          className: "name",
          begin: t,
          starts: f,
        },
        y = [p, o, l, m, i, u, d, s, c, a],
        g = {
          beginKeywords: n,
          lexemes: t,
          end: '(\\[|\\#|\\d|"|:|\\{|\\)|\\(|$)',
          contains: [
            {
              className: "title",
              begin: t,
              relevance: 0,
              excludeEnd: !0,
              endsParent: !0,
            },
          ].concat(y),
        };
      return (
        (p.contains = [e.COMMENT("comment", ""), g, h, f]),
        (f.contains = y),
        (d.contains = y),
        (m.contains = [d]),
        {
          name: "Clojure",
          aliases: ["clj"],
          illegal: /\S/,
          contains: [p, o, l, m, i, u, d, s, c],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "csharp",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          keyword:
            "abstract as base bool break byte case catch char checked const continue decimal default delegate do double enum event explicit extern finally fixed float for foreach goto if implicit in init int interface internal is lock long object operator out override params private protected public readonly ref sbyte sealed short sizeof stackalloc static string struct switch this try typeof uint ulong unchecked unsafe ushort using virtual void volatile while add alias ascending async await by descending dynamic equals from get global group into join let nameof on orderby partial remove select set value var when where yield",
          literal: "null false true",
        },
        i = e.inherit(e.TITLE_MODE, {
          begin: "[a-zA-Z](\\.?\\w)*",
        }),
        a = {
          className: "number",
          variants: [
            {
              begin: "\\b(0b[01']+)",
            },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        s = {
          className: "string",
          begin: '@"',
          end: '"',
          contains: [
            {
              begin: '""',
            },
          ],
        },
        t = e.inherit(s, {
          illegal: /\n/,
        }),
        l = {
          className: "subst",
          begin: "{",
          end: "}",
          keywords: n,
        },
        r = e.inherit(l, {
          illegal: /\n/,
        }),
        c = {
          className: "string",
          begin: /\$"/,
          end: '"',
          illegal: /\n/,
          contains: [
            {
              begin: "{{",
            },
            {
              begin: "}}",
            },
            e.BACKSLASH_ESCAPE,
            r,
          ],
        },
        o = {
          className: "string",
          begin: /\$@"/,
          end: '"',
          contains: [
            {
              begin: "{{",
            },
            {
              begin: "}}",
            },
            {
              begin: '""',
            },
            l,
          ],
        },
        g = e.inherit(o, {
          illegal: /\n/,
          contains: [
            {
              begin: "{{",
            },
            {
              begin: "}}",
            },
            {
              begin: '""',
            },
            r,
          ],
        });
      (l.contains = [
        o,
        c,
        s,
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
        a,
        e.C_BLOCK_COMMENT_MODE,
      ]),
        (r.contains = [
          g,
          c,
          t,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          a,
          e.inherit(e.C_BLOCK_COMMENT_MODE, {
            illegal: /\n/,
          }),
        ]);
      var d = {
          variants: [o, c, s, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
        },
        E = {
          begin: "<",
          end: ">",
          contains: [
            {
              beginKeywords: "in out",
            },
            i,
          ],
        },
        _ =
          e.IDENT_RE +
          "(<" +
          e.IDENT_RE +
          "(\\s*,\\s*" +
          e.IDENT_RE +
          ")*>)?(\\[\\])?",
        b = {
          begin: "@" + e.IDENT_RE,
          relevance: 0,
        };
      return {
        name: "C#",
        aliases: ["cs", "c#"],
        keywords: n,
        illegal: /::/,
        contains: [
          e.COMMENT("///", "$", {
            returnBegin: !0,
            contains: [
              {
                className: "doctag",
                variants: [
                  {
                    begin: "///",
                    relevance: 0,
                  },
                  {
                    begin: "\x3c!--|--\x3e",
                  },
                  {
                    begin: "</?",
                    end: ">",
                  },
                ],
              },
            ],
          }),
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "meta",
            begin: "#",
            end: "$",
            keywords: {
              "meta-keyword":
                "if else elif endif define undef warning error line region endregion pragma checksum",
            },
          },
          d,
          a,
          {
            beginKeywords: "class interface",
            end: /[{;=]/,
            illegal: /[^\s:,]/,
            contains: [
              {
                beginKeywords: "where class",
              },
              i,
              E,
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          {
            beginKeywords: "namespace",
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [i, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
          },
          {
            beginKeywords: "record",
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [i, E, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
          },
          {
            className: "meta",
            begin: "^\\s*\\[",
            excludeBegin: !0,
            end: "\\]",
            excludeEnd: !0,
            contains: [
              {
                className: "meta-string",
                begin: /"/,
                end: /"/,
              },
            ],
          },
          {
            beginKeywords: "new return throw await else",
            relevance: 0,
          },
          {
            className: "function",
            begin: "(" + _ + "\\s+)+" + e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
            returnBegin: !0,
            end: /\s*[{;=]/,
            excludeEnd: !0,
            keywords: n,
            contains: [
              {
                begin: e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
                returnBegin: !0,
                contains: [e.TITLE_MODE, E],
                relevance: 0,
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: n,
                relevance: 0,
                contains: [d, a, e.C_BLOCK_COMMENT_MODE],
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          b,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "objectivec",
  (function () {
    "use strict";
    return function (e) {
      var n = /[a-zA-Z@][a-zA-Z0-9_]*/,
        _ = {
          $pattern: n,
          keyword: "@interface @class @protocol @implementation",
        };
      return {
        name: "Objective-C",
        aliases: ["mm", "objc", "obj-c"],
        keywords: {
          $pattern: n,
          keyword:
            "int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required @encode @package @import @defs @compatibility_alias __bridge __bridge_transfer __bridge_retained __bridge_retain __covariant __contravariant __kindof _Nonnull _Nullable _Null_unspecified __FUNCTION__ __PRETTY_FUNCTION__ __attribute__ getter setter retain unsafe_unretained nonnull nullable null_unspecified null_resettable class instancetype NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",
          literal: "false true FALSE TRUE nil YES NO NULL",
          built_in:
            "BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once",
        },
        illegal: "</",
        contains: [
          {
            className: "built_in",
            begin:
              "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+",
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          e.C_NUMBER_MODE,
          e.QUOTE_STRING_MODE,
          e.APOS_STRING_MODE,
          {
            className: "string",
            variants: [
              {
                begin: '@"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE],
              },
            ],
          },
          {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
              "meta-keyword":
                "if else elif endif define undef warning error line pragma ifdef ifndef include",
            },
            contains: [
              {
                begin: /\\\n/,
                relevance: 0,
              },
              e.inherit(e.QUOTE_STRING_MODE, {
                className: "meta-string",
              }),
              {
                className: "meta-string",
                begin: /<.*?>/,
                end: /$/,
                illegal: "\\n",
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          {
            className: "class",
            begin: "(" + _.keyword.split(" ").join("|") + ")\\b",
            end: "({|$)",
            excludeEnd: !0,
            keywords: _,
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          {
            begin: "\\." + e.UNDERSCORE_IDENT_RE,
            relevance: 0,
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "java",
  (function () {
    "use strict";
    function e(e) {
      return e ? ("string" == typeof e ? e : e.source) : null;
    }
    function n(e) {
      return a("(", e, ")?");
    }
    function a(...n) {
      return n.map((n) => e(n)).join("");
    }
    function s(...n) {
      return "(" + n.map((n) => e(n)).join("|") + ")";
    }
    return function (e) {
      var t =
          "false synchronized int abstract float private char boolean var static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do",
        i = {
          className: "meta",
          begin: "@[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              contains: ["self"],
            },
          ],
        },
        r = (e) => a("[", e, "]+([", e, "_]*[", e, "]+)?"),
        c = {
          className: "number",
          variants: [
            {
              begin: `\\b(0[bB]${r("01")})[lL]?`,
            },
            {
              begin: `\\b(0${r("0-7")})[dDfFlL]?`,
            },
            {
              begin: a(
                /\b0[xX]/,
                s(
                  a(r("a-fA-F0-9"), /\./, r("a-fA-F0-9")),
                  a(r("a-fA-F0-9"), /\.?/),
                  a(/\./, r("a-fA-F0-9"))
                ),
                /([pP][+-]?(\d+))?/,
                /[fFdDlL]?/
              ),
            },
            {
              begin: a(
                /\b/,
                s(a(/\d*\./, r("\\d")), r("\\d")),
                /[eE][+-]?[\d]+[dDfF]?/
              ),
            },
            {
              begin: a(/\b/, r(/\d/), n(/\.?/), n(r(/\d/)), /[dDfFlL]?/),
            },
          ],
          relevance: 0,
        };
      return {
        name: "Java",
        aliases: ["jsp"],
        keywords: t,
        illegal: /<\/|#/,
        contains: [
          e.COMMENT("/\\*\\*", "\\*/", {
            relevance: 0,
            contains: [
              {
                begin: /\w+@/,
                relevance: 0,
              },
              {
                className: "doctag",
                begin: "@[A-Za-z]+",
              },
            ],
          }),
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          {
            className: "class",
            beginKeywords: "class interface enum",
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: "class interface enum",
            illegal: /[:"\[\]]/,
            contains: [
              {
                beginKeywords: "extends implements",
              },
              e.UNDERSCORE_TITLE_MODE,
            ],
          },
          {
            beginKeywords: "new throw return else",
            relevance: 0,
          },
          {
            className: "function",
            begin:
              "([À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(<[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(\\s*,\\s*[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*)*>)?\\s+)+" +
              e.UNDERSCORE_IDENT_RE +
              "\\s*\\(",
            returnBegin: !0,
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: t,
            contains: [
              {
                begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                returnBegin: !0,
                relevance: 0,
                contains: [e.UNDERSCORE_TITLE_MODE],
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: t,
                relevance: 0,
                contains: [
                  i,
                  e.APOS_STRING_MODE,
                  e.QUOTE_STRING_MODE,
                  e.C_NUMBER_MODE,
                  e.C_BLOCK_COMMENT_MODE,
                ],
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          c,
          i,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "swift",
  (function () {
    "use strict";
    return function (e) {
      var i = {
          keyword:
            "#available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector #sourceLocation _ __COLUMN__ __FILE__ __FUNCTION__ __LINE__ Any as as! as? associatedtype associativity break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard if import in indirect infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol Protocol public repeat required rethrows return right self Self set static struct subscript super switch throw throws true try try! try? Type typealias unowned var weak where while willSet",
          literal: "true false nil",
          built_in:
            "abs advance alignof alignofValue anyGenerator assert assertionFailure bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c compactMap contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal fatalError filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare map max maxElement min minElement numericCast overlaps partition posix precondition preconditionFailure print println quickSort readLine reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith stride strideof strideofValue swap toString transcode underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers withUnsafePointer withUnsafePointers withVaList zip",
        },
        n = e.COMMENT("/\\*", "\\*/", {
          contains: ["self"],
        }),
        t = {
          className: "subst",
          begin: /\\\(/,
          end: "\\)",
          keywords: i,
          contains: [],
        },
        a = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE, t],
          variants: [
            {
              begin: /"""/,
              end: /"""/,
            },
            {
              begin: /"/,
              end: /"/,
            },
          ],
        },
        r = {
          className: "number",
          begin:
            "\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b",
          relevance: 0,
        };
      return (
        (t.contains = [r]),
        {
          name: "Swift",
          keywords: i,
          contains: [
            a,
            e.C_LINE_COMMENT_MODE,
            n,
            {
              className: "type",
              begin: "\\b[A-Z][\\wÀ-ʸ']*[!?]",
            },
            {
              className: "type",
              begin: "\\b[A-Z][\\wÀ-ʸ']*",
              relevance: 0,
            },
            r,
            {
              className: "function",
              beginKeywords: "func",
              end: "{",
              excludeEnd: !0,
              contains: [
                e.inherit(e.TITLE_MODE, {
                  begin: /[A-Za-z$_][0-9A-Za-z$_]*/,
                }),
                {
                  begin: /</,
                  end: />/,
                },
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  endsParent: !0,
                  keywords: i,
                  contains: [
                    "self",
                    r,
                    a,
                    e.C_BLOCK_COMMENT_MODE,
                    {
                      begin: ":",
                    },
                  ],
                  illegal: /["']/,
                },
              ],
              illegal: /\[|%/,
            },
            {
              className: "class",
              beginKeywords: "struct protocol class extension enum",
              keywords: i,
              end: "\\{",
              excludeEnd: !0,
              contains: [
                e.inherit(e.TITLE_MODE, {
                  begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/,
                }),
              ],
            },
            {
              className: "meta",
              begin:
                "(@discardableResult|@warn_unused_result|@exported|@lazy|@noescape|@NSCopying|@NSManaged|@objc|@objcMembers|@convention|@required|@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|@infix|@prefix|@postfix|@autoclosure|@testable|@available|@nonobjc|@NSApplicationMain|@UIApplicationMain|@dynamicMemberLookup|@propertyWrapper)\\b",
            },
            {
              beginKeywords: "import",
              end: /$/,
              contains: [e.C_LINE_COMMENT_MODE, n],
            },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "css",
  (function () {
    "use strict";
    return function (e) {
      var n = {
        begin: /(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/,
        returnBegin: !0,
        end: ";",
        endsWithParent: !0,
        contains: [
          {
            className: "attribute",
            begin: /\S/,
            end: ":",
            excludeEnd: !0,
            starts: {
              endsWithParent: !0,
              excludeEnd: !0,
              contains: [
                {
                  begin: /[\w-]+\(/,
                  returnBegin: !0,
                  contains: [
                    {
                      className: "built_in",
                      begin: /[\w-]+/,
                    },
                    {
                      begin: /\(/,
                      end: /\)/,
                      contains: [
                        e.APOS_STRING_MODE,
                        e.QUOTE_STRING_MODE,
                        e.CSS_NUMBER_MODE,
                      ],
                    },
                  ],
                },
                e.CSS_NUMBER_MODE,
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                e.C_BLOCK_COMMENT_MODE,
                {
                  className: "number",
                  begin: "#[0-9A-Fa-f]+",
                },
                {
                  className: "meta",
                  begin: "!important",
                },
              ],
            },
          },
        ],
      };
      return {
        name: "CSS",
        case_insensitive: !0,
        illegal: /[=\/|'\$]/,
        contains: [
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "selector-id",
            begin: /#[A-Za-z0-9_-]+/,
          },
          {
            className: "selector-class",
            begin: /\.[A-Za-z0-9_-]+/,
          },
          {
            className: "selector-attr",
            begin: /\[/,
            end: /\]/,
            illegal: "$",
            contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
          },
          {
            className: "selector-pseudo",
            begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/,
          },
          {
            begin: "@(page|font-face)",
            lexemes: "@[a-z-]+",
            keywords: "@page @font-face",
          },
          {
            begin: "@",
            end: "[{;]",
            illegal: /:/,
            returnBegin: !0,
            contains: [
              {
                className: "keyword",
                begin: /@\-?\w[\w]*(\-\w+)*/,
              },
              {
                begin: /\s/,
                endsWithParent: !0,
                excludeEnd: !0,
                relevance: 0,
                keywords: "and or not only",
                contains: [
                  {
                    begin: /[a-z-]+:/,
                    className: "attribute",
                  },
                  e.APOS_STRING_MODE,
                  e.QUOTE_STRING_MODE,
                  e.CSS_NUMBER_MODE,
                ],
              },
            ],
          },
          {
            className: "selector-tag",
            begin: "[a-zA-Z-][a-zA-Z0-9_-]*",
            relevance: 0,
          },
          {
            begin: "{",
            end: "}",
            illegal: /\S/,
            contains: [e.C_BLOCK_COMMENT_MODE, n],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "ruby",
  (function () {
    "use strict";
    return function (e) {
      var n =
          "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?",
        a = {
          keyword:
            "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",
          literal: "true false nil",
        },
        s = {
          className: "doctag",
          begin: "@[A-Za-z]+",
        },
        i = {
          begin: "#<",
          end: ">",
        },
        r = [
          e.COMMENT("#", "$", {
            contains: [s],
          }),
          e.COMMENT("^\\=begin", "^\\=end", {
            contains: [s],
            relevance: 10,
          }),
          e.COMMENT("^__END__", "\\n$"),
        ],
        c = {
          className: "subst",
          begin: "#\\{",
          end: "}",
          keywords: a,
        },
        t = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE, c],
          variants: [
            {
              begin: /'/,
              end: /'/,
            },
            {
              begin: /"/,
              end: /"/,
            },
            {
              begin: /`/,
              end: /`/,
            },
            {
              begin: "%[qQwWx]?\\(",
              end: "\\)",
            },
            {
              begin: "%[qQwWx]?\\[",
              end: "\\]",
            },
            {
              begin: "%[qQwWx]?{",
              end: "}",
            },
            {
              begin: "%[qQwWx]?<",
              end: ">",
            },
            {
              begin: "%[qQwWx]?/",
              end: "/",
            },
            {
              begin: "%[qQwWx]?%",
              end: "%",
            },
            {
              begin: "%[qQwWx]?-",
              end: "-",
            },
            {
              begin: "%[qQwWx]?\\|",
              end: "\\|",
            },
            {
              begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/,
            },
            {
              begin: /<<[-~]?'?(\w+)(?:.|\n)*?\n\s*\1\b/,
              returnBegin: !0,
              contains: [
                {
                  begin: /<<[-~]?'?/,
                },
                e.END_SAME_AS_BEGIN({
                  begin: /(\w+)/,
                  end: /(\w+)/,
                  contains: [e.BACKSLASH_ESCAPE, c],
                }),
              ],
            },
          ],
        },
        b = {
          className: "params",
          begin: "\\(",
          end: "\\)",
          endsParent: !0,
          keywords: a,
        },
        d = [
          t,
          i,
          {
            className: "class",
            beginKeywords: "class module",
            end: "$|;",
            illegal: /=/,
            contains: [
              e.inherit(e.TITLE_MODE, {
                begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?",
              }),
              {
                begin: "<\\s*",
                contains: [
                  {
                    begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE,
                  },
                ],
              },
            ].concat(r),
          },
          {
            className: "function",
            beginKeywords: "def",
            end: "$|;",
            contains: [
              e.inherit(e.TITLE_MODE, {
                begin: n,
              }),
              b,
            ].concat(r),
          },
          {
            begin: e.IDENT_RE + "::",
          },
          {
            className: "symbol",
            begin: e.UNDERSCORE_IDENT_RE + "(\\!|\\?)?:",
            relevance: 0,
          },
          {
            className: "symbol",
            begin: ":(?!\\s)",
            contains: [
              t,
              {
                begin: n,
              },
            ],
            relevance: 0,
          },
          {
            className: "number",
            begin:
              "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0,
          },
          {
            begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))",
          },
          {
            className: "params",
            begin: /\|/,
            end: /\|/,
            keywords: a,
          },
          {
            begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
            keywords: "unless",
            contains: [
              i,
              {
                className: "regexp",
                contains: [e.BACKSLASH_ESCAPE, c],
                illegal: /\n/,
                variants: [
                  {
                    begin: "/",
                    end: "/[a-z]*",
                  },
                  {
                    begin: "%r{",
                    end: "}[a-z]*",
                  },
                  {
                    begin: "%r\\(",
                    end: "\\)[a-z]*",
                  },
                  {
                    begin: "%r!",
                    end: "![a-z]*",
                  },
                  {
                    begin: "%r\\[",
                    end: "\\][a-z]*",
                  },
                ],
              },
            ].concat(r),
            relevance: 0,
          },
        ].concat(r);
      (c.contains = d), (b.contains = d);
      var g = [
        {
          begin: /^\s*=>/,
          starts: {
            end: "$",
            contains: d,
          },
        },
        {
          className: "meta",
          begin:
            "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>)",
          starts: {
            end: "$",
            contains: d,
          },
        },
      ];
      return {
        name: "Ruby",
        aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
        keywords: a,
        illegal: /\/\*/,
        contains: r.concat(g).concat(d),
      };
    };
  })()
);
hljs.registerLanguage(
  "makefile",
  (function () {
    "use strict";
    return function (e) {
      var i = {
          className: "variable",
          variants: [
            {
              begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin: /\$[@%<?\^\+\*]/,
            },
          ],
        },
        n = {
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, i],
        },
        a = {
          className: "variable",
          begin: /\$\([\w-]+\s/,
          end: /\)/,
          keywords: {
            built_in:
              "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value",
          },
          contains: [i],
        },
        r = {
          begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)",
        },
        s = {
          className: "section",
          begin: /^[^\s]+:/,
          end: /$/,
          contains: [i],
        };
      return {
        name: "Makefile",
        aliases: ["mk", "mak"],
        keywords: {
          $pattern: /[\w-]+/,
          keyword:
            "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath",
        },
        contains: [
          e.HASH_COMMENT_MODE,
          i,
          n,
          a,
          r,
          {
            className: "meta",
            begin: /^\.PHONY:/,
            end: /$/,
            keywords: {
              $pattern: /[\.\w]+/,
              "meta-keyword": ".PHONY",
            },
          },
          s,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "go",
  (function () {
    "use strict";
    return function (e) {
      var n = {
        keyword:
          "break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",
        literal: "true false iota nil",
        built_in:
          "append cap close complex copy imag len make new panic print println real recover delete",
      };
      return {
        name: "Go",
        aliases: ["golang"],
        keywords: n,
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "string",
            variants: [
              e.QUOTE_STRING_MODE,
              e.APOS_STRING_MODE,
              {
                begin: "`",
                end: "`",
              },
            ],
          },
          {
            className: "number",
            variants: [
              {
                begin: e.C_NUMBER_RE + "[i]",
                relevance: 1,
              },
              e.C_NUMBER_MODE,
            ],
          },
          {
            begin: /:=/,
          },
          {
            className: "function",
            beginKeywords: "func",
            end: "\\s*(\\{|$)",
            excludeEnd: !0,
            contains: [
              e.TITLE_MODE,
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: n,
                illegal: /["']/,
              },
            ],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "coffeescript",
  (function () {
    "use strict";
    const e = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      a = [].concat(
        [
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          "require",
          "exports",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "unescape",
        ],
        [
          "arguments",
          "this",
          "super",
          "console",
          "window",
          "document",
          "localStorage",
          "module",
          "global",
        ],
        [
          "Intl",
          "DataView",
          "Number",
          "Math",
          "Date",
          "String",
          "RegExp",
          "Object",
          "Function",
          "Boolean",
          "Error",
          "Symbol",
          "Set",
          "Map",
          "WeakSet",
          "WeakMap",
          "Proxy",
          "Reflect",
          "JSON",
          "Promise",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Float32Array",
          "Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "ArrayBuffer",
        ],
        [
          "EvalError",
          "InternalError",
          "RangeError",
          "ReferenceError",
          "SyntaxError",
          "TypeError",
          "URIError",
        ]
      );
    return function (r) {
      var t = {
          keyword: e
            .concat([
              "then",
              "unless",
              "until",
              "loop",
              "by",
              "when",
              "and",
              "or",
              "is",
              "isnt",
              "not",
            ])
            .filter(
              ((e) => (n) => !e.includes(n))([
                "var",
                "const",
                "let",
                "function",
                "static",
              ])
            )
            .join(" "),
          literal: n.concat(["yes", "no", "on", "off"]).join(" "),
          built_in: a.concat(["npm", "print"]).join(" "),
        },
        i = "[A-Za-z$_][0-9A-Za-z$_]*",
        s = {
          className: "subst",
          begin: /#\{/,
          end: /}/,
          keywords: t,
        },
        o = [
          r.BINARY_NUMBER_MODE,
          r.inherit(r.C_NUMBER_MODE, {
            starts: {
              end: "(\\s*/)?",
              relevance: 0,
            },
          }),
          {
            className: "string",
            variants: [
              {
                begin: /'''/,
                end: /'''/,
                contains: [r.BACKSLASH_ESCAPE],
              },
              {
                begin: /'/,
                end: /'/,
                contains: [r.BACKSLASH_ESCAPE],
              },
              {
                begin: /"""/,
                end: /"""/,
                contains: [r.BACKSLASH_ESCAPE, s],
              },
              {
                begin: /"/,
                end: /"/,
                contains: [r.BACKSLASH_ESCAPE, s],
              },
            ],
          },
          {
            className: "regexp",
            variants: [
              {
                begin: "///",
                end: "///",
                contains: [s, r.HASH_COMMENT_MODE],
              },
              {
                begin: "//[gim]{0,3}(?=\\W)",
                relevance: 0,
              },
              {
                begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/,
              },
            ],
          },
          {
            begin: "@" + i,
          },
          {
            subLanguage: "javascript",
            excludeBegin: !0,
            excludeEnd: !0,
            variants: [
              {
                begin: "```",
                end: "```",
              },
              {
                begin: "`",
                end: "`",
              },
            ],
          },
        ];
      s.contains = o;
      var c = r.inherit(r.TITLE_MODE, {
          begin: i,
        }),
        l = {
          className: "params",
          begin: "\\([^\\(]",
          returnBegin: !0,
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              keywords: t,
              contains: ["self"].concat(o),
            },
          ],
        };
      return {
        name: "CoffeeScript",
        aliases: ["coffee", "cson", "iced"],
        keywords: t,
        illegal: /\/\*/,
        contains: o.concat([
          r.COMMENT("###", "###"),
          r.HASH_COMMENT_MODE,
          {
            className: "function",
            begin: "^\\s*" + i + "\\s*=\\s*(\\(.*\\))?\\s*\\B[-=]>",
            end: "[-=]>",
            returnBegin: !0,
            contains: [c, l],
          },
          {
            begin: /[:\(,=]\s*/,
            relevance: 0,
            contains: [
              {
                className: "function",
                begin: "(\\(.*\\))?\\s*\\B[-=]>",
                end: "[-=]>",
                returnBegin: !0,
                contains: [l],
              },
            ],
          },
          {
            className: "class",
            beginKeywords: "class",
            end: "$",
            illegal: /[:="\[\]]/,
            contains: [
              {
                beginKeywords: "extends",
                endsWithParent: !0,
                illegal: /[:="\[\]]/,
                contains: [c],
              },
              c,
            ],
          },
          {
            begin: i + ":",
            end: ":",
            returnBegin: !0,
            returnEnd: !0,
            relevance: 0,
          },
        ]),
      };
    };
  })()
);
hljs.registerLanguage(
  "bash",
  (function () {
    "use strict";
    return function (e) {
      const s = {};
      Object.assign(s, {
        className: "variable",
        variants: [
          {
            begin: /\$[\w\d#@][\w\d_]*/,
          },
          {
            begin: /\$\{/,
            end: /\}/,
            contains: [
              {
                begin: /:-/,
                contains: [s],
              },
            ],
          },
        ],
      });
      const t = {
          className: "subst",
          begin: /\$\(/,
          end: /\)/,
          contains: [e.BACKSLASH_ESCAPE],
        },
        n = {
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, s, t],
        };
      t.contains.push(n);
      const a = {
          begin: /\$\(\(/,
          end: /\)\)/,
          contains: [
            {
              begin: /\d+#[0-9a-f]+/,
              className: "number",
            },
            e.NUMBER_MODE,
            s,
          ],
        },
        i = e.SHEBANG({
          binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
          relevance: 10,
        }),
        c = {
          className: "function",
          begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
          returnBegin: !0,
          contains: [
            e.inherit(e.TITLE_MODE, {
              begin: /\w[\w\d_]*/,
            }),
          ],
          relevance: 0,
        };
      return {
        name: "Bash",
        aliases: ["sh", "zsh"],
        keywords: {
          $pattern: /\b-?[a-z\._-]+\b/,
          keyword:
            "if then else elif fi for while in do done case esac function",
          literal: "true false",
          built_in:
            "break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",
          _: "-ne -eq -lt -gt -f -d -e -s -l -a",
        },
        contains: [
          i,
          e.SHEBANG(),
          c,
          a,
          e.HASH_COMMENT_MODE,
          n,
          {
            className: "",
            begin: /\\"/,
          },
          {
            className: "string",
            begin: /'/,
            end: /'/,
          },
          s,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "ini",
  (function () {
    "use strict";
    function e(e) {
      return e ? ("string" == typeof e ? e : e.source) : null;
    }
    function n(...n) {
      return n.map((n) => e(n)).join("");
    }
    return function (a) {
      var s = {
          className: "number",
          relevance: 0,
          variants: [
            {
              begin: /([\+\-]+)?[\d]+_[\d_]+/,
            },
            {
              begin: a.NUMBER_RE,
            },
          ],
        },
        i = a.COMMENT();
      i.variants = [
        {
          begin: /;/,
          end: /$/,
        },
        {
          begin: /#/,
          end: /$/,
        },
      ];
      var t = {
          className: "variable",
          variants: [
            {
              begin: /\$[\w\d"][\w\d_]*/,
            },
            {
              begin: /\$\{(.*?)}/,
            },
          ],
        },
        r = {
          className: "literal",
          begin: /\bon|off|true|false|yes|no\b/,
        },
        l = {
          className: "string",
          contains: [a.BACKSLASH_ESCAPE],
          variants: [
            {
              begin: "'''",
              end: "'''",
              relevance: 10,
            },
            {
              begin: '"""',
              end: '"""',
              relevance: 10,
            },
            {
              begin: '"',
              end: '"',
            },
            {
              begin: "'",
              end: "'",
            },
          ],
        },
        c = {
          begin: /\[/,
          end: /\]/,
          contains: [i, r, t, l, s, "self"],
          relevance: 0,
        },
        g =
          "(" +
          [/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/]
            .map((n) => e(n))
            .join("|") +
          ")";
      return {
        name: "TOML, also INI",
        aliases: ["toml"],
        case_insensitive: !0,
        illegal: /\S/,
        contains: [
          i,
          {
            className: "section",
            begin: /\[+/,
            end: /\]+/,
          },
          {
            begin: n(
              g,
              "(\\s*\\.\\s*",
              g,
              ")*",
              n("(?=", /\s*=\s*[^#\s]/, ")")
            ),
            className: "attr",
            starts: {
              end: /$/,
              contains: [i, c, r, t, l, s],
            },
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "rust",
  (function () {
    "use strict";
    return function (e) {
      var n = "([ui](8|16|32|64|128|size)|f(32|64))?",
        t =
          "drop i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 str char bool Box Option Result String Vec Copy Send Sized Sync Drop Fn FnMut FnOnce ToOwned Clone Debug PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator Extend IntoIterator DoubleEndedIterator ExactSizeIterator SliceConcatExt ToString assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! debug_assert! debug_assert_eq! env! panic! file! format! format_args! include_bin! include_str! line! local_data_key! module_path! option_env! print! println! select! stringify! try! unimplemented! unreachable! vec! write! writeln! macro_rules! assert_ne! debug_assert_ne!";
      return {
        name: "Rust",
        aliases: ["rs"],
        keywords: {
          $pattern: e.IDENT_RE + "!?",
          keyword:
            "abstract as async await become box break const continue crate do dyn else enum extern false final fn for if impl in let loop macro match mod move mut override priv pub ref return self Self static struct super trait true try type typeof unsafe unsized use virtual where while yield",
          literal: "true false Some None Ok Err",
          built_in: t,
        },
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.COMMENT("/\\*", "\\*/", {
            contains: ["self"],
          }),
          e.inherit(e.QUOTE_STRING_MODE, {
            begin: /b?"/,
            illegal: null,
          }),
          {
            className: "string",
            variants: [
              {
                begin: /r(#*)"(.|\n)*?"\1(?!#)/,
              },
              {
                begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/,
              },
            ],
          },
          {
            className: "symbol",
            begin: /'[a-zA-Z_][a-zA-Z0-9_]*/,
          },
          {
            className: "number",
            variants: [
              {
                begin: "\\b0b([01_]+)" + n,
              },
              {
                begin: "\\b0o([0-7_]+)" + n,
              },
              {
                begin: "\\b0x([A-Fa-f0-9_]+)" + n,
              },
              {
                begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + n,
              },
            ],
            relevance: 0,
          },
          {
            className: "function",
            beginKeywords: "fn",
            end: "(\\(|<)",
            excludeEnd: !0,
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          {
            className: "meta",
            begin: "#\\!?\\[",
            end: "\\]",
            contains: [
              {
                className: "meta-string",
                begin: /"/,
                end: /"/,
              },
            ],
          },
          {
            className: "class",
            beginKeywords: "type",
            end: ";",
            contains: [
              e.inherit(e.UNDERSCORE_TITLE_MODE, {
                endsParent: !0,
              }),
            ],
            illegal: "\\S",
          },
          {
            className: "class",
            beginKeywords: "trait enum struct union",
            end: "{",
            contains: [
              e.inherit(e.UNDERSCORE_TITLE_MODE, {
                endsParent: !0,
              }),
            ],
            illegal: "[\\w\\d]",
          },
          {
            begin: e.IDENT_RE + "::",
            keywords: {
              built_in: t,
            },
          },
          {
            begin: "->",
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "handlebars",
  (function () {
    "use strict";
    function e(...e) {
      return e
        .map((e) =>
          (function (e) {
            return e ? ("string" == typeof e ? e : e.source) : null;
          })(e)
        )
        .join("");
    }
    return function (n) {
      const a = {
          "builtin-name":
            "action bindattr collection component concat debugger each each-in get hash if in input link-to loc log lookup mut outlet partial query-params render template textarea unbound unless view with yield",
        },
        t = /\[.*?\]/,
        s = /[^\s!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/,
        i = e("(", /'.*?'/, "|", /".*?"/, "|", t, "|", s, "|", /\.|\//, ")+"),
        r = e("(", t, "|", s, ")(?==)"),
        l = {
          begin: i,
          lexemes: /[\w.\/]+/,
        },
        c = n.inherit(l, {
          keywords: {
            literal: "true false undefined null",
          },
        }),
        o = {
          begin: /\(/,
          end: /\)/,
        },
        m = {
          className: "attr",
          begin: r,
          relevance: 0,
          starts: {
            begin: /=/,
            end: /=/,
            starts: {
              contains: [
                n.NUMBER_MODE,
                n.QUOTE_STRING_MODE,
                n.APOS_STRING_MODE,
                c,
                o,
              ],
            },
          },
        },
        d = {
          contains: [
            n.NUMBER_MODE,
            n.QUOTE_STRING_MODE,
            n.APOS_STRING_MODE,
            {
              begin: /as\s+\|/,
              keywords: {
                keyword: "as",
              },
              end: /\|/,
              contains: [
                {
                  begin: /\w+/,
                },
              ],
            },
            m,
            c,
            o,
          ],
          returnEnd: !0,
        },
        g = n.inherit(l, {
          className: "name",
          keywords: a,
          starts: n.inherit(d, {
            end: /\)/,
          }),
        });
      o.contains = [g];
      const u = n.inherit(l, {
          keywords: a,
          className: "name",
          starts: n.inherit(d, {
            end: /}}/,
          }),
        }),
        b = n.inherit(l, {
          keywords: a,
          className: "name",
        }),
        h = n.inherit(l, {
          className: "name",
          keywords: a,
          starts: n.inherit(d, {
            end: /}}/,
          }),
        });
      return {
        name: "Handlebars",
        aliases: ["hbs", "html.hbs", "html.handlebars", "htmlbars"],
        case_insensitive: !0,
        subLanguage: "xml",
        contains: [
          {
            begin: /\\\{\{/,
            skip: !0,
          },
          {
            begin: /\\\\(?=\{\{)/,
            skip: !0,
          },
          n.COMMENT(/\{\{!--/, /--\}\}/),
          n.COMMENT(/\{\{!/, /\}\}/),
          {
            className: "template-tag",
            begin: /\{\{\{\{(?!\/)/,
            end: /\}\}\}\}/,
            contains: [u],
            starts: {
              end: /\{\{\{\{\//,
              returnEnd: !0,
              subLanguage: "xml",
            },
          },
          {
            className: "template-tag",
            begin: /\{\{\{\{\//,
            end: /\}\}\}\}/,
            contains: [b],
          },
          {
            className: "template-tag",
            begin: /\{\{#/,
            end: /\}\}/,
            contains: [u],
          },
          {
            className: "template-tag",
            begin: /\{\{(?=else\}\})/,
            end: /\}\}/,
            keywords: "else",
          },
          {
            className: "template-tag",
            begin: /\{\{\//,
            end: /\}\}/,
            contains: [b],
          },
          {
            className: "template-variable",
            begin: /\{\{\{/,
            end: /\}\}\}/,
            contains: [h],
          },
          {
            className: "template-variable",
            begin: /\{\{/,
            end: /\}\}/,
            contains: [h],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "prolog",
  (function () {
    "use strict";
    return function (n) {
      var e = {
          begin: /\(/,
          end: /\)/,
          relevance: 0,
        },
        a = {
          begin: /\[/,
          end: /\]/,
        },
        s = {
          className: "comment",
          begin: /%/,
          end: /$/,
          contains: [n.PHRASAL_WORDS_MODE],
        },
        i = {
          className: "string",
          begin: /`/,
          end: /`/,
          contains: [n.BACKSLASH_ESCAPE],
        },
        c = [
          {
            begin: /[a-z][A-Za-z0-9_]*/,
            relevance: 0,
          },
          {
            className: "symbol",
            variants: [
              {
                begin: /[A-Z][a-zA-Z0-9_]*/,
              },
              {
                begin: /_[A-Za-z0-9_]*/,
              },
            ],
            relevance: 0,
          },
          e,
          {
            begin: /:-/,
          },
          a,
          s,
          n.C_BLOCK_COMMENT_MODE,
          n.QUOTE_STRING_MODE,
          n.APOS_STRING_MODE,
          i,
          {
            className: "string",
            begin: /0\'(\\\'|.)/,
          },
          {
            className: "string",
            begin: /0\'\\s/,
          },
          n.C_NUMBER_MODE,
        ];
      return (
        (e.contains = c),
        (a.contains = c),
        {
          name: "Prolog",
          contains: c.concat([
            {
              begin: /\.$/,
            },
          ]),
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "typescript",
  (function () {
    "use strict";
    const e = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      a = [].concat(
        [
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          "require",
          "exports",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "unescape",
        ],
        [
          "arguments",
          "this",
          "super",
          "console",
          "window",
          "document",
          "localStorage",
          "module",
          "global",
        ],
        [
          "Intl",
          "DataView",
          "Number",
          "Math",
          "Date",
          "String",
          "RegExp",
          "Object",
          "Function",
          "Boolean",
          "Error",
          "Symbol",
          "Set",
          "Map",
          "WeakSet",
          "WeakMap",
          "Proxy",
          "Reflect",
          "JSON",
          "Promise",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Float32Array",
          "Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "ArrayBuffer",
        ],
        [
          "EvalError",
          "InternalError",
          "RangeError",
          "ReferenceError",
          "SyntaxError",
          "TypeError",
          "URIError",
        ]
      );
    return function (r) {
      var t = {
          $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
          keyword: e
            .concat([
              "type",
              "namespace",
              "typedef",
              "interface",
              "public",
              "private",
              "protected",
              "implements",
              "declare",
              "abstract",
              "readonly",
            ])
            .join(" "),
          literal: n.join(" "),
          built_in: a
            .concat([
              "any",
              "void",
              "number",
              "boolean",
              "string",
              "object",
              "never",
              "enum",
            ])
            .join(" "),
        },
        s = {
          className: "meta",
          begin: "@[A-Za-z$_][0-9A-Za-z$_]*",
        },
        i = {
          className: "number",
          variants: [
            {
              begin: "\\b(0[bB][01]+)n?",
            },
            {
              begin: "\\b(0[oO][0-7]+)n?",
            },
            {
              begin: r.C_NUMBER_RE + "n?",
            },
          ],
          relevance: 0,
        },
        o = {
          className: "subst",
          begin: "\\$\\{",
          end: "\\}",
          keywords: t,
          contains: [],
        },
        c = {
          begin: "html`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [r.BACKSLASH_ESCAPE, o],
            subLanguage: "xml",
          },
        },
        l = {
          begin: "css`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [r.BACKSLASH_ESCAPE, o],
            subLanguage: "css",
          },
        },
        E = {
          className: "string",
          begin: "`",
          end: "`",
          contains: [r.BACKSLASH_ESCAPE, o],
        };
      o.contains = [
        r.APOS_STRING_MODE,
        r.QUOTE_STRING_MODE,
        c,
        l,
        E,
        i,
        r.REGEXP_MODE,
      ];
      var d = {
          begin: "\\(",
          end: /\)/,
          keywords: t,
          contains: [
            "self",
            r.QUOTE_STRING_MODE,
            r.APOS_STRING_MODE,
            r.NUMBER_MODE,
          ],
        },
        u = {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: t,
          contains: [r.C_LINE_COMMENT_MODE, r.C_BLOCK_COMMENT_MODE, s, d],
        };
      return {
        name: "TypeScript",
        aliases: ["ts"],
        keywords: t,
        contains: [
          r.SHEBANG(),
          {
            className: "meta",
            begin: /^\s*['"]use strict['"]/,
          },
          r.APOS_STRING_MODE,
          r.QUOTE_STRING_MODE,
          c,
          l,
          E,
          r.C_LINE_COMMENT_MODE,
          r.C_BLOCK_COMMENT_MODE,
          i,
          {
            begin: "(" + r.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            contains: [
              r.C_LINE_COMMENT_MODE,
              r.C_BLOCK_COMMENT_MODE,
              r.REGEXP_MODE,
              {
                className: "function",
                begin:
                  "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" +
                  r.UNDERSCORE_IDENT_RE +
                  ")\\s*=>",
                returnBegin: !0,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      {
                        begin: r.UNDERSCORE_IDENT_RE,
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: !0,
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        keywords: t,
                        contains: d.contains,
                      },
                    ],
                  },
                ],
              },
            ],
            relevance: 0,
          },
          {
            className: "function",
            beginKeywords: "function",
            end: /[\{;]/,
            excludeEnd: !0,
            keywords: t,
            contains: [
              "self",
              r.inherit(r.TITLE_MODE, {
                begin: "[A-Za-z$_][0-9A-Za-z$_]*",
              }),
              u,
            ],
            illegal: /%/,
            relevance: 0,
          },
          {
            beginKeywords: "constructor",
            end: /[\{;]/,
            excludeEnd: !0,
            contains: ["self", u],
          },
          {
            begin: /module\./,
            keywords: {
              built_in: "module",
            },
            relevance: 0,
          },
          {
            beginKeywords: "module",
            end: /\{/,
            excludeEnd: !0,
          },
          {
            beginKeywords: "interface",
            end: /\{/,
            excludeEnd: !0,
            keywords: "interface extends",
          },
          {
            begin: /\$[(.]/,
          },
          {
            begin: "\\." + r.IDENT_RE,
            relevance: 0,
          },
          s,
          d,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "elm",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          variants: [
            e.COMMENT("--", "$"),
            e.COMMENT("{-", "-}", {
              contains: ["self"],
            }),
          ],
        },
        i = {
          className: "type",
          begin: "\\b[A-Z][\\w']*",
          relevance: 0,
        },
        s = {
          begin: "\\(",
          end: "\\)",
          illegal: '"',
          contains: [
            {
              className: "type",
              begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?",
            },
            n,
          ],
        };
      return {
        name: "Elm",
        keywords:
          "let in if then else case of where module import exposing type alias as infix infixl infixr port effect command subscription",
        contains: [
          {
            beginKeywords: "port effect module",
            end: "exposing",
            keywords: "port effect module where command subscription exposing",
            contains: [s, n],
            illegal: "\\W\\.|;",
          },
          {
            begin: "import",
            end: "$",
            keywords: "import as exposing",
            contains: [s, n],
            illegal: "\\W\\.|;",
          },
          {
            begin: "type",
            end: "$",
            keywords: "type alias",
            contains: [
              i,
              s,
              {
                begin: "{",
                end: "}",
                contains: s.contains,
              },
              n,
            ],
          },
          {
            beginKeywords: "infix infixl infixr",
            end: "$",
            contains: [e.C_NUMBER_MODE, n],
          },
          {
            begin: "port",
            end: "$",
            keywords: "port",
            contains: [n],
          },
          {
            className: "string",
            begin: "'\\\\?.",
            end: "'",
            illegal: ".",
          },
          e.QUOTE_STRING_MODE,
          e.C_NUMBER_MODE,
          i,
          e.inherit(e.TITLE_MODE, {
            begin: "^[_a-z][\\w']*",
          }),
          n,
          {
            begin: "->|<-",
          },
        ],
        illegal: /;/,
      };
    };
  })()
);
hljs.registerLanguage(
  "json",
  (function () {
    "use strict";
    return function (n) {
      var e = {
          literal: "true false null",
        },
        i = [n.C_LINE_COMMENT_MODE, n.C_BLOCK_COMMENT_MODE],
        t = [n.QUOTE_STRING_MODE, n.C_NUMBER_MODE],
        a = {
          end: ",",
          endsWithParent: !0,
          excludeEnd: !0,
          contains: t,
          keywords: e,
        },
        l = {
          begin: "{",
          end: "}",
          contains: [
            {
              className: "attr",
              begin: /"/,
              end: /"/,
              contains: [n.BACKSLASH_ESCAPE],
              illegal: "\\n",
            },
            n.inherit(a, {
              begin: /:/,
            }),
          ].concat(i),
          illegal: "\\S",
        },
        s = {
          begin: "\\[",
          end: "\\]",
          contains: [n.inherit(a)],
          illegal: "\\S",
        };
      return (
        t.push(l, s),
        i.forEach(function (n) {
          t.push(n);
        }),
        {
          name: "JSON",
          contains: t,
          keywords: e,
          illegal: "\\S",
        }
      );
    };
  })()
);
