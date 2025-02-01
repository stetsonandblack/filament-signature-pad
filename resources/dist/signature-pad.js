var v = class {
        constructor(t, i, e, n) {
            if (isNaN(t) || isNaN(i)) throw new Error(`Point is invalid: (${t}, ${i})`);
            this.x = +t, this.y = +i, this.pressure = e || 0, this.time = n || Date.now()
        }
        distanceTo(t) {
            return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2))
        }
        equals(t) {
            return this.x === t.x && this.y === t.y && this.pressure === t.pressure && this.time === t.time
        }
        velocityFrom(t) {
            return this.time !== t.time ? this.distanceTo(t) / (this.time - t.time) : 0
        }
    },
    w = class {
        constructor(t, i, e, n, s, a) {
            this.startPoint = t, this.control2 = i, this.control1 = e, this.endPoint = n, this.startWidth = s, this.endWidth = a
        }
        static fromPoints(t, i) {
            let e = this.calculateControlPoints(t[0], t[1], t[2]).c2,
                n = this.calculateControlPoints(t[1], t[2], t[3]).c1;
            return new w(t[1], e, n, t[2], i.start, i.end)
        }
        static calculateControlPoints(t, i, e) {
            let n = t.x - i.x,
                s = t.y - i.y,
                a = i.x - e.x,
                r = i.y - e.y,
                h = {
                    x: (t.x + i.x) / 2,
                    y: (t.y + i.y) / 2
                },
                o = {
                    x: (i.x + e.x) / 2,
                    y: (i.y + e.y) / 2
                },
                d = Math.sqrt(n * n + s * s),
                c = Math.sqrt(a * a + r * r),
                m = h.x - o.x,
                _ = h.y - o.y,
                u = c / (d + c),
                g = {
                    x: o.x + m * u,
                    y: o.y + _ * u
                },
                x = i.x - g.x,
                y = i.y - g.y;
            return {
                c1: new v(h.x + x, h.y + y),
                c2: new v(o.x + x, o.y + y)
            }
        }
        length() {
            let i = 0,
                e, n;
            for (let s = 0; s <= 10; s += 1) {
                let a = s / 10,
                    r = this.point(a, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x),
                    h = this.point(a, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
                if (s > 0) {
                    let o = r - e,
                        d = h - n;
                    i += Math.sqrt(o * o + d * d)
                }
                e = r, n = h
            }
            return i
        }
        point(t, i, e, n, s) {
            return i * (1 - t) * (1 - t) * (1 - t) + 3 * e * (1 - t) * (1 - t) * t + 3 * n * (1 - t) * t * t + s * t * t * t
        }
    },
    p = class {
        constructor() {
            try {
                this._et = new EventTarget
            } catch {
                this._et = document
            }
        }
        addEventListener(t, i, e) {
            this._et.addEventListener(t, i, e)
        }
        dispatchEvent(t) {
            return this._et.dispatchEvent(t)
        }
        removeEventListener(t, i, e) {
            this._et.removeEventListener(t, i, e)
        }
    };

function P(l, t = 250) {
    let i = 0,
        e = null,
        n, s, a, r = () => {
            i = Date.now(), e = null, n = l.apply(s, a), e || (s = null, a = [])
        };
    return function(...o) {
        let d = Date.now(),
            c = t - (d - i);
        return s = this, a = o, c <= 0 || c > t ? (e && (clearTimeout(e), e = null), i = d, n = l.apply(s, a), e || (s = null, a = [])) : e || (e = window.setTimeout(r, c)), n
    }
}
var f = class extends p {
    constructor(t, i = {}) {
        super(), this.canvas = t, this._drawningStroke = !1, this._isEmpty = !0, this._lastPoints = [], this._data = [], this._lastVelocity = 0, this._lastWidth = 0, this._handleMouseDown = e => {
            e.buttons === 1 && (this._drawningStroke = !0, this._strokeBegin(e))
        }, this._handleMouseMove = e => {
            this._drawningStroke && this._strokeMoveUpdate(e)
        }, this._handleMouseUp = e => {
            e.buttons === 1 && this._drawningStroke && (this._drawningStroke = !1, this._strokeEnd(e))
        }, this._handleTouchStart = e => {
            if (e.cancelable && e.preventDefault(), e.targetTouches.length === 1) {
                let n = e.changedTouches[0];
                this._strokeBegin(n)
            }
        }, this._handleTouchMove = e => {
            e.cancelable && e.preventDefault();
            let n = e.targetTouches[0];
            this._strokeMoveUpdate(n)
        }, this._handleTouchEnd = e => {
            if (e.target === this.canvas) {
                e.cancelable && e.preventDefault();
                let s = e.changedTouches[0];
                this._strokeEnd(s)
            }
        }, this._handlePointerStart = e => {
            this._drawningStroke = !0, e.preventDefault(), this._strokeBegin(e)
        }, this._handlePointerMove = e => {
            this._drawningStroke && (e.preventDefault(), this._strokeMoveUpdate(e))
        }, this._handlePointerEnd = e => {
            this._drawningStroke && (e.preventDefault(), this._drawningStroke = !1, this._strokeEnd(e))
        }, this.velocityFilterWeight = i.velocityFilterWeight || .7, this.minWidth = i.minWidth || .5, this.maxWidth = i.maxWidth || 2.5, this.throttle = "throttle" in i ? i.throttle : 16, this.minDistance = "minDistance" in i ? i.minDistance : 5, this.dotSize = i.dotSize || 0, this.penColor = i.penColor || "black", this.backgroundColor = i.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = i.compositeOperation || "source-over", this._strokeMoveUpdate = this.throttle ? P(f.prototype._strokeUpdate, this.throttle) : f.prototype._strokeUpdate, this._ctx = t.getContext("2d"), this.clear(), this.on()
    }
    clear() {
        let {
            _ctx: t,
            canvas: i
        } = this;
        t.fillStyle = this.backgroundColor, t.clearRect(0, 0, i.width, i.height), t.fillRect(0, 0, i.width, i.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0
    }
    fromDataURL(t, i = {}) {
        return new Promise((e, n) => {
            let s = new Image,
                a = i.ratio || window.devicePixelRatio || 1,
                r = i.width || this.canvas.width / a,
                h = i.height || this.canvas.height / a,
                o = i.xOffset || 0,
                d = i.yOffset || 0;
            this._reset(this._getPointGroupOptions()), s.onload = () => {
                this._ctx.drawImage(s, o, d, r, h), e()
            }, s.onerror = c => {
                n(c)
            }, s.crossOrigin = "anonymous", s.src = t, this._isEmpty = !1
        })
    }
    toDataURL(t = "image/png", i) {
        switch (t) {
            case "image/svg+xml":
                return typeof i != "object" && (i = void 0), `data:image/svg+xml;base64,${btoa(this.toSVG(i))}`;
            default:
                return typeof i != "number" && (i = void 0), this.canvas.toDataURL(t, i)
        }
    }
    on() {
        this.canvas.style.touchAction = "none", this.canvas.style.msTouchAction = "none", this.canvas.style.userSelect = "none";
        let t = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
        window.PointerEvent && !t ? this._handlePointerEvents() : (this._handleMouseEvents(), "ontouchstart" in window && this._handleTouchEvents())
    }
    off() {
        this.canvas.style.touchAction = "auto", this.canvas.style.msTouchAction = "auto", this.canvas.style.userSelect = "auto", this.canvas.removeEventListener("pointerdown", this._handlePointerStart), this.canvas.removeEventListener("pointermove", this._handlePointerMove), this.canvas.ownerDocument.removeEventListener("pointerup", this._handlePointerEnd), this.canvas.removeEventListener("mousedown", this._handleMouseDown), this.canvas.removeEventListener("mousemove", this._handleMouseMove), this.canvas.ownerDocument.removeEventListener("mouseup", this._handleMouseUp), this.canvas.removeEventListener("touchstart", this._handleTouchStart), this.canvas.removeEventListener("touchmove", this._handleTouchMove), this.canvas.removeEventListener("touchend", this._handleTouchEnd)
    }
    isEmpty() {
        return this._isEmpty
    }
    fromData(t, {
        clear: i = !0
    } = {}) {
        i && this.clear(), this._fromData(t, this._drawCurve.bind(this), this._drawDot.bind(this)), this._data = this._data.concat(t)
    }
    toData() {
        return this._data
    }
    _getPointGroupOptions(t) {
        return {
            penColor: t && "penColor" in t ? t.penColor : this.penColor,
            dotSize: t && "dotSize" in t ? t.dotSize : this.dotSize,
            minWidth: t && "minWidth" in t ? t.minWidth : this.minWidth,
            maxWidth: t && "maxWidth" in t ? t.maxWidth : this.maxWidth,
            velocityFilterWeight: t && "velocityFilterWeight" in t ? t.velocityFilterWeight : this.velocityFilterWeight,
            compositeOperation: t && "compositeOperation" in t ? t.compositeOperation : this.compositeOperation
        }
    }
    _strokeBegin(t) {
        this.dispatchEvent(new CustomEvent("beginStroke", {
            detail: t
        }));
        let i = this._getPointGroupOptions(),
            e = Object.assign(Object.assign({}, i), {
                points: []
            });
        this._data.push(e), this._reset(i), this._strokeUpdate(t)
    }
    _strokeUpdate(t) {
        if (this._data.length === 0) {
            this._strokeBegin(t);
            return
        }
        this.dispatchEvent(new CustomEvent("beforeUpdateStroke", {
            detail: t
        }));
        let i = t.clientX,
            e = t.clientY,
            n = t.pressure !== void 0 ? t.pressure : t.force !== void 0 ? t.force : 0,
            s = this._createPoint(i, e, n),
            a = this._data[this._data.length - 1],
            r = a.points,
            h = r.length > 0 && r[r.length - 1],
            o = h ? s.distanceTo(h) <= this.minDistance : !1,
            d = this._getPointGroupOptions(a);
        if (!h || !(h && o)) {
            let c = this._addPoint(s, d);
            h ? c && this._drawCurve(c, d) : this._drawDot(s, d), r.push({
                time: s.time,
                x: s.x,
                y: s.y,
                pressure: s.pressure
            })
        }
        this.dispatchEvent(new CustomEvent("afterUpdateStroke", {
            detail: t
        }))
    }
    _strokeEnd(t) {
        this._strokeUpdate(t), this.dispatchEvent(new CustomEvent("endStroke", {
            detail: t
        }))
    }
    _handlePointerEvents() {
        this._drawningStroke = !1, this.canvas.addEventListener("pointerdown", this._handlePointerStart), this.canvas.addEventListener("pointermove", this._handlePointerMove), this.canvas.ownerDocument.addEventListener("pointerup", this._handlePointerEnd)
    }
    _handleMouseEvents() {
        this._drawningStroke = !1, this.canvas.addEventListener("mousedown", this._handleMouseDown), this.canvas.addEventListener("mousemove", this._handleMouseMove), this.canvas.ownerDocument.addEventListener("mouseup", this._handleMouseUp)
    }
    _handleTouchEvents() {
        this.canvas.addEventListener("touchstart", this._handleTouchStart), this.canvas.addEventListener("touchmove", this._handleTouchMove), this.canvas.addEventListener("touchend", this._handleTouchEnd)
    }
    _reset(t) {
        this._lastPoints = [], this._lastVelocity = 0, this._lastWidth = (t.minWidth + t.maxWidth) / 2, this._ctx.fillStyle = t.penColor, this._ctx.globalCompositeOperation = t.compositeOperation
    }
    _createPoint(t, i, e) {
        let n = this.canvas.getBoundingClientRect();
        return new v(t - n.left, i - n.top, e, new Date().getTime())
    }
    _addPoint(t, i) {
        let {
            _lastPoints: e
        } = this;
        if (e.push(t), e.length > 2) {
            e.length === 3 && e.unshift(e[0]);
            let n = this._calculateCurveWidths(e[1], e[2], i),
                s = w.fromPoints(e, n);
            return e.shift(), s
        }
        return null
    }
    _calculateCurveWidths(t, i, e) {
        let n = e.velocityFilterWeight * i.velocityFrom(t) + (1 - e.velocityFilterWeight) * this._lastVelocity,
            s = this._strokeWidth(n, e),
            a = {
                end: s,
                start: this._lastWidth
            };
        return this._lastVelocity = n, this._lastWidth = s, a
    }
    _strokeWidth(t, i) {
        return Math.max(i.maxWidth / (t + 1), i.minWidth)
    }
    _drawCurveSegment(t, i, e) {
        let n = this._ctx;
        n.moveTo(t, i), n.arc(t, i, e, 0, 2 * Math.PI, !1), this._isEmpty = !1
    }
    _drawCurve(t, i) {
        let e = this._ctx,
            n = t.endWidth - t.startWidth,
            s = Math.ceil(t.length()) * 2;
        e.beginPath(), e.fillStyle = i.penColor;
        for (let a = 0; a < s; a += 1) {
            let r = a / s,
                h = r * r,
                o = h * r,
                d = 1 - r,
                c = d * d,
                m = c * d,
                _ = m * t.startPoint.x;
            _ += 3 * c * r * t.control1.x, _ += 3 * d * h * t.control2.x, _ += o * t.endPoint.x;
            let u = m * t.startPoint.y;
            u += 3 * c * r * t.control1.y, u += 3 * d * h * t.control2.y, u += o * t.endPoint.y;
            let g = Math.min(t.startWidth + o * n, i.maxWidth);
            this._drawCurveSegment(_, u, g)
        }
        e.closePath(), e.fill()
    }
    _drawDot(t, i) {
        let e = this._ctx,
            n = i.dotSize > 0 ? i.dotSize : (i.minWidth + i.maxWidth) / 2;
        e.beginPath(), this._drawCurveSegment(t.x, t.y, n), e.closePath(), e.fillStyle = i.penColor, e.fill()
    }
    _fromData(t, i, e) {
        for (let n of t) {
            let {
                points: s
            } = n, a = this._getPointGroupOptions(n);
            if (s.length > 1)
                for (let r = 0; r < s.length; r += 1) {
                    let h = s[r],
                        o = new v(h.x, h.y, h.pressure, h.time);
                    r === 0 && this._reset(a);
                    let d = this._addPoint(o, a);
                    d && i(d, a)
                } else this._reset(a), e(s[0], a)
        }
    }
    toSVG({
              includeBackgroundColor: t = !1
          } = {}) {
        let i = this._data,
            e = Math.max(window.devicePixelRatio || 1, 1),
            n = 0,
            s = 0,
            a = this.canvas.width / e,
            r = this.canvas.height / e,
            h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        if (h.setAttribute("xmlns", "http://www.w3.org/2000/svg"), h.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), h.setAttribute("viewBox", `${n} ${s} ${a} ${r}`), h.setAttribute("width", a.toString()), h.setAttribute("height", r.toString()), t && this.backgroundColor) {
            let o = document.createElement("rect");
            o.setAttribute("width", "100%"), o.setAttribute("height", "100%"), o.setAttribute("fill", this.backgroundColor), h.appendChild(o)
        }
        return this._fromData(i, (o, {
            penColor: d
        }) => {
            let c = document.createElement("path");
            if (!isNaN(o.control1.x) && !isNaN(o.control1.y) && !isNaN(o.control2.x) && !isNaN(o.control2.y)) {
                let m = `M ${o.startPoint.x.toFixed(3)},${o.startPoint.y.toFixed(3)} C ${o.control1.x.toFixed(3)},${o.control1.y.toFixed(3)} ${o.control2.x.toFixed(3)},${o.control2.y.toFixed(3)} ${o.endPoint.x.toFixed(3)},${o.endPoint.y.toFixed(3)}`;
                c.setAttribute("d", m), c.setAttribute("stroke-width", (o.endWidth * 2.25).toFixed(3)), c.setAttribute("stroke", d), c.setAttribute("fill", "none"), c.setAttribute("stroke-linecap", "round"), h.appendChild(c)
            }
        }, (o, {
            penColor: d,
            dotSize: c,
            minWidth: m,
            maxWidth: _
        }) => {
            let u = document.createElement("circle"),
                g = c > 0 ? c : (m + _) / 2;
            u.setAttribute("r", g.toString()), u.setAttribute("cx", o.x.toString()), u.setAttribute("cy", o.y.toString()), u.setAttribute("fill", d), h.appendChild(u)
        }), h.outerHTML
    }
};

function E(l) {
    return {
        state: l.state,
        signaturePadId: l.signaturePadId,
        disabled: l.disabled,
        dotSize: l.dotSize,
        minWidth: l.minWidth,
        maxWidth: l.maxWidth,
        minDistance: l.minDistance,
        penColor: l.penColor,
        backgroundColor: l.backgroundColor,
        init() {
            this.disabled || (this.resizeCanvas(), this.signaturePad = new f(this.$refs.canvas, {
                dotSize: this.dotSize || 2,
                minWidth: this.minWidth || 1,
                maxWidth: this.maxWidth || 2.5,
                minDistance: this.minDistance || 2,
                penColor: this.penColor || "rgb(0,0,0)",
                backgroundColor: this.backgroundColor || "rgba(0,0,0,0)"
            }), this.state && this.signaturePad.fromDataURL(this.state, {
                ratio: this.ratio
            }), this.signaturePad.addEventListener("beginStroke", () => {
                console.log("Signature started")
            }, {
                once: !1
            }), this.signaturePad.addEventListener("endStroke", t => {
                this.save()
            }, {
                once: !1
            }), this.signaturePad.addEventListener("afterUpdateStroke", () => {}, {
                once: !1
            }))
        },
        save() {
            this.state = this.signaturePad.toDataURL("image/png"), this.$dispatch("signature-saved", this.signaturePadId)
        },
        clear() {
            this.signaturePad.clear(), this.state = null
        },
        resizeCanvas() {
            this.ratio = Math.max(window.devicePixelRatio || 1, 1), this.$refs.canvas.width = this.$refs.canvas.offsetWidth * this.ratio, this.$refs.canvas.height = this.$refs.canvas.offsetHeight * this.ratio, this.$refs.canvas.getContext("2d").scale(this.ratio, this.ratio)
        },
        downloadSVG() {
            if (this.signaturePad.isEmpty()) alert("Please provide a signature first.");
            else {
                let t = this.signaturePad.toDataURL("image/svg+xml");
                this.download(t, "signature.svg")
            }
        },
        downloadPNG() {
            if (this.signaturePad.isEmpty()) alert("Please provide a signature first.");
            else {
                let t = this.signaturePad.toDataURL();
                this.download(t, "signature.png")
            }
        },
        downloadJPG() {
            if (this.signaturePad.isEmpty()) alert("Please provide a signature first.");
            else {
                this.signaturePad.backgroundColor = "rgb(255,255,255)";
                let t = this.signaturePad.toDataURL("image/jpeg");
                this.download(t, "signature.jpg")
            }
        },
        download(t, i = "signature") {
            let e = this.dataURLToBlob(t),
                n = window.URL.createObjectURL(e),
                s = document.createElement("a");
            s.href = n, s.style = "display: none", s.download = i, document.body.appendChild(s), s.click(), window.URL.revokeObjectURL(n)
        },
        dataURLToBlob(t) {
            let i = t.split(";base64,"),
                e = i[0].split(":")[1],
                n = window.atob(i[1]),
                s = n.length,
                a = new Uint8Array(s);
            for (let r = 0; r < s; ++r) a[r] = n.charCodeAt(r);
            return new Blob([a], {
                type: e
            })
        }
    }
}
export {
    E as
        default
};
/*! Bundled license information:

signature_pad/dist/signature_pad.js:
  (*!
   * Signature Pad v4.1.6 | https://github.com/szimek/signature_pad
   * (c) 2023 Szymon Nowak | Released under the MIT license
   *)
*/
