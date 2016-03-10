(function(h) {
    function B(a, c) {
        this.settings = this.getSettings(a, c);
        this.$element = c;
        return this
    }
    h.fn.LiteTooltip = function(a) {
        return this.each(function() {
            var c = h.extend({}, h.fn.LiteTooltip.defaultSettings, a || {}),
                j = h(this),
                c = new B(c, j);
            "" != c.settings.title && (j.is("input") || j.css({
                cursor: "pointer"
            }), "hoverable" == c.settings.trigger ? (this.toggle = !1, j.bind("mouseenter", {
                settings: c.settings,
                element: j,
                $plugin: c,
                $toggle: this.toggle
            }, c.mouseOverHandler), j.bind("mouseleave", {
                settings: c.settings,
                element: j,
                $plugin: c,
                $toggle: this.toggle
            }, c.mouseOutHandler)) : "hover" == c.settings.trigger ? (j.bind("mouseenter", {
                settings: c.settings,
                element: j,
                $plugin: c
            }, c.mouseOverHandler), j.bind("mouseleave", {
                settings: c.settings,
                element: j,
                $plugin: c
            }, c.mouseOutHandler)) : "focus" == c.settings.trigger ? (j.bind("focus", {
                settings: c.settings,
                element: j,
                $plugin: c
            }, c.mouseOverHandler), j.bind("blur", {
                settings: c.settings,
                element: j,
                $plugin: c
            }, c.mouseOutHandler)) : "click" == c.settings.trigger && (this.toggle = !1, j.bind("click", {
                settings: c.settings,
                element: j,
                $plugin: c,
                $toggle: this.toggle
            }, c.mouseOverHandler), c.settings.issticky || j.bind("mouseleave", {
                settings: c.settings,
                element: j,
                $plugin: c,
                $toggle: this.toggle
            }, c.mouseOutHandler)))
        })
    };
    B.prototype = {
        getSettings: function(a, c) {
            return h.extend({}, a, {
                location: c.data("location"),
                title: c.data("title"),
                backcolor: c.data("backcolor"),
                textalign: c.data("textalign"),
                trigger: c.data("trigger"),
                textcolor: c.data("textcolor"),
                opacity: c.data("opacity"),
                templatename: c.data("templatename"),
                width: c.data("width"),
                delay: c.data("delay"),
                issticky: c.data("issticky")
            })
        },
        mouseOverHandler: function(a) {
            if (a.data.element.is("input") && "" != a.data.element.val()) return !1;
            if ("click" == a.data.settings.trigger) {
                if (a.data.$toggle) return this.toggle = a.data.$toggle = !1;
                this.toggle = a.data.$toggle = !0;
                a.data.element.unbind("click");
                a.data.element.bind("click", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: a.data.$toggle
                }, a.data.$plugin.mouseOutHandler)
            }
            var c = a.data.element,
                j = a.data.settings,
                q = parseInt(j.margin.toString().replace("px",
                    "")),
                B = parseInt(j.padding.toString().replace("px", "")),
                f = parseInt(j.width.toString().replace("px", "")),
                v = j.location,
                w = j.backcolor,
                t = j.textcolor,
                g = j.textalign,
                C = j.templatename,
                D = j.delay,
                b = h(j.template);
            b.css({
                opacity: j.opacity
            });
            b.css("visibility", "visible");
            b.find(".tooltip-content").css({
                background: w,
                "text-align": g
            }).html(j.title + j.clearfix);
            b.find(".tooltip-content").css({
                "box-shadow": "1px 1px 3px 0px #888888",
                color: t,
                padding: B + "px"
            });
            var e = v,
                g = v.split("-")[0],
                s = e,
                t = g;
            b.removeClass(v).addClass(e);
            b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" + g + "-color", w);
            h("body").append(b);
            b.offset({
                top: 0,
                left: 0
            });
            var m = b.outerWidth(),
                n = b.outerHeight(),
                x = h(document).width(),
                n = scrollbarWidth(),
                k = h(document).width() - h(window).width();
            0 < k && (x -= n);
            x > h(window).width() && (x = h(window).width() - n);
            var A = h(document).height();
            k > n && (A -= n);
            m < f && (f = m);
            0 != f ? (f = 2 * f > x ? Math.floor(x / 2 - 30) : f - 30, 1.5 * f > x / 2 && (f = Math.floor(x / 2 - 30))) : f = 680 > x ? Math.floor(x / 2 - 30) : 340;
            b.css({
                "max-width": f
            });
            m = b.outerWidth();
            n = b.outerHeight();
            "click" == a.data.settings.trigger ? (f = h('<div id="tooltip-clickoutside"></div>'), f.css({
                width: "100%",
                height: "100%",
                position: "absolute",
                top: h(document).scrollTop() + "px",
                left: "0px"
            }), h("body").append(f), f.bind("click", {
                settings: a.data.settings,
                element: a.data.element,
                $plugin: a.data.$plugin,
                $toggle: a.data.$toggle
            }, a.data.$plugin.mouseOutHandler), this.toggle = a.data.$toggle = !1) : "hoverable" == a.data.settings.trigger && a.data.element.unbind("mouseenter");
            var r = c.context,
                l = r.offsetWidth,
                p = r.offsetHeight,
                k = c.offset().top,
                f = c.offset().left;
            if ("area" == r.tagName.toLowerCase()) {
                var k = r.parentElement.getAttribute("name"),
                    z = r.getAttribute("shape").toLowerCase(),
                    f = h("img[usemap='#" + k + "']").offset().top,
                    k = h("img[usemap='#" + k + "']").offset().left,
                    E = parseInt(r.getAttribute("coords").split(",")[0]),
                    F = parseInt(r.getAttribute("coords").split(",")[1]),
                    p = parseInt(r.getAttribute("coords").split(",")[2]),
                    u = parseInt(r.getAttribute("coords").split(",")[3] || p),
                    l = parseInt(f + F),
                    y = parseInt(k + E);
                "circle" == z && (l = parseInt(f + F - p), y = parseInt(k +
                    E - p), p *= 2, u *= 2);
                "rect" == z && (l = parseInt(f + F), y = parseInt(k + E), p -= E, u -= F);
                if ("poly" == z) {
                    l = [];
                    r = r.getAttribute("coords").split(",");
                    for (p = 0; p < r.length;) l.push({
                        x: parseInt(r[p]),
                        y: parseInt(r[p + 1])
                    }), p += 2;
                    l.sort(function(a, b) {
                        var c = a.x,
                            d = b.x;
                        return c == d ? 0 : c < d ? 1 : -1
                    });
                    p = l[0].x;
                    l.sort(function(a, b) {
                        var c = a.y,
                            d = b.y;
                        return c == d ? 0 : c < d ? 1 : -1
                    });
                    r = l[0].y;
                    l.sort(function(a, b) {
                        var c = a.x,
                            d = b.x;
                        return c == d ? 0 : c > d ? 1 : -1
                    });
                    u = l[0].x;
                    l.sort(function(a, b) {
                        var c = a.y,
                            d = b.y;
                        return c == d ? 0 : c > d ? 1 : -1
                    });
                    z = l[0].y;
                    l = parseInt(f + z);
                    y =
                        parseInt(k + u);
                    p -= u;
                    u = r - z
                }
                f = y;
                k = l;
                l = p;
                p = u
            }
            f = Math.round(f);
            k = Math.round(k);
            l = Math.round(l);
            p = Math.round(p);
            b.offset({
                top: 0,
                left: 0
            });
            var d;
            switch (v) {
                case "top":
                    d = {
                        top: k - n - q,
                        left: f - m / 2 + l / 2
                    };
                    break;
                case "top-left":
                    d = {
                        top: k - n - q,
                        left: f
                    };
                    break;
                case "top-right":
                    d = {
                        top: k - n - q,
                        left: f - m + l
                    };
                    break;
                case "right":
                    d = {
                        top: k + p / 2 - n / 2,
                        left: f + l + q
                    };
                    break;
                case "right-top":
                    d = {
                        top: k + p - n + 8,
                        left: f + l + q
                    };
                    break;
                case "right-bottom":
                    d = {
                        top: k - 8,
                        left: f + l + q
                    };
                    break;
                case "bottom":
                    d = {
                        top: k + p + q,
                        left: f - m / 2 + l / 2
                    };
                    break;
                case "bottom-left":
                    d = {
                        top: k +
                            p + q,
                        left: f
                    };
                    break;
                case "bottom-right":
                    d = {
                        top: k + p + q,
                        left: f - m + l
                    };
                    break;
                case "left":
                    d = {
                        top: k + p / 2 - n / 2,
                        left: f - m - q
                    };
                    break;
                case "left-top":
                    d = {
                        top: k + p - n + 8,
                        left: f - m - q
                    };
                    break;
                case "left-bottom":
                    d = {
                        top: k - 8,
                        left: f - m - q
                    }
            }
            r = u = 0;
            r = d.left;
            u = d.top;
            z = null != e.match("bottom") || "left" == e || "right" == e ? ("left" == e || "right" == e ? n / 2 : n) > A - k - p : !1;
            if (0 > d.left || 0 > d.top || d.left + m > x || z)
                if ("top" == g || "bottom" == g || "left" == g || "right" == g) {
                    y = !1;
                    switch (g) {
                        case "top":
                            d.top = k - n - q;
                            d.left = f - m / 2 + l / 2;
                            y = !0;
                            break;
                        case "bottom":
                            d.top = k - n - q;
                            d.left =
                                f - m / 2 + l / 2;
                            y = !0;
                            break;
                        case "left":
                            g = e.replace(g + "-", "");
                            "top" == g ? (g = "top", e = "top-left", b.removeClass(s).addClass(e), b.find(".tooltip-arrow").removeClass(s).css("border-" + t + "-color", "").addClass(e).css("border-" + g + "-color", w), t = "top", s = "top-left", b.removeClass(v).addClass(e), b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" + g + "-color", w), m = b.outerWidth(), n = b.outerHeight(), d.top = k - n - q, d.left = f - m / 2 + l / 2, r = f, u = k - n - q) : "bottom" == g ? (g = "bottom", e = "bottom-left", b.removeClass(s).addClass(e), b.find(".tooltip-arrow").removeClass(s).css("border-" +
                                t + "-color", "").addClass(e).css("border-" + g + "-color", w), t = "bottom", s = "bottom-left", b.removeClass(v).addClass(e), b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" + g + "-color", w), m = b.outerWidth(), n = b.outerHeight(), d.top = k + p + q, d.left = f - m / 2 + l / 2, r = f, u = k + p + q) : (e = g = "top", b.removeClass(s).addClass(e), b.find(".tooltip-arrow").removeClass(s).css("border-" + t + "-color", "").addClass(e).css("border-" + g + "-color", w), s = t = "top", b.removeClass(v).addClass(e), b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" +
                                g + "-color", w), m = b.outerWidth(), n = b.outerHeight(), d.top = k - n - q, d.left = f - m / 2 + l / 2, r = d.left, u = d.top);
                            z = null != e.match("bottom") || "left" == e || "right" == e ? ("left" == e || "right" == e ? n / 2 : n) > A - k - p : !1;
                            0 > d.left || 0 > d.top || d.left + m > x || z ? y = !0 : (d.left = r, d.top = u);
                            break;
                        case "right":
                            g = e.replace(g + "-", ""), "top" == g ? (g = "top", e = "top-left", b.removeClass(s).addClass(e), b.find(".tooltip-arrow").removeClass(s).css("border-" + t + "-color", "").addClass(e).css("border-" + g + "-color", w), t = "top", s = "top-left", b.removeClass(v).addClass(e),
                                    b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" + g + "-color", w), m = b.outerWidth(), n = b.outerHeight(), d.top = k - n - q, d.left = f - m / 2 + l / 2, r = f, u = k - n - q) : "bottom" == g ? (g = "bottom", e = "bottom-left", b.removeClass(s).addClass(e), b.find(".tooltip-arrow").removeClass(s).css("border-" + t + "-color", "").addClass(e).css("border-" + g + "-color", w), t = "bottom", s = "bottom-left", b.removeClass(v).addClass(e), b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" + g + "-color", w), m = b.outerWidth(), n = b.outerHeight(),
                                    d.top = k - n - q, d.left = f - m / 2 + l / 2, r = f, u = k + p + q) : (e = g = "top", b.removeClass(s).addClass(e), b.find(".tooltip-arrow").removeClass(s).css("border-" + t + "-color", "").addClass(e).css("border-" + g + "-color", w), s = t = "top", b.removeClass(v).addClass(e), b.find(".tooltip-arrow").removeClass(v).addClass(e).css("border-" + g + "-color", w), m = b.outerWidth(), n = b.outerHeight(), d.top = k - n - q, d.left = f - m / 2 + l / 2, r = d.left, u = d.top), z = null != e.match("bottom") || "left" == e || "right" == e ? ("left" == e || "right" == e ? n / 2 : n) > A - k - p : !1, 0 > d.left || 0 > d.top || d.left +
                                m > x || z ? y = !0 : (d.left = r, d.top = u)
                    }
                    if (y && (y = A = !1, 0 > d.top ? (e = g = "bottom", d.top = k + p + q, y = !0, 0 > d.left && (g = "bottom", e = "bottom-left", d.left = f, A = !0), d.left + m > x && (d.left = f - m + l, 0 > d.left ? (e = g = "bottom", d.left = f - m / 2 + l / 2) : (g = "bottom", e = "bottom-right", d.left = f - m + l), A = !0)) : (e = g = "top", d.top = k - n - q, y = !1, 0 > d.left && (g = "top", e = "top-left", d.left = f, A = !0), d.left + m > x && (d.left = f - m + l, 0 > d.left ? (e = g = "top", d.left = f - m / 2 + l / 2) : (g = "top", e = "top-right", d.left = f - m + l), A = !0)), !A))
                        if (y ? (e = s.replace("top", "bottom"), g = t.replace("top", "bottom")) :
                            (e = s.replace("bottom", "top"), g = t.replace("bottom", "top")), 0 > r) {
                            if ("bottom" == g || "top" == g) e = e.replace("right", "left"), d.left = f
                        } else d.left = r
                }
            b.removeClass(s).addClass(e);
            b.find(".tooltip-arrow").removeClass(s).css("border-" + t + "-color", "").addClass(e).css("border-" + g + "-color", w);
            "" != C && (b.find(".tooltip-content > .template").hasClass("template") ? (b.find(".tooltip-content > .template").addClass(C), q = b.find("." + C).css("background-color"), b.find(".tooltip-arrow").css("border-" + t + "-color", ""), b.find(".tooltip-arrow").css("border-" +
                g + "-color", q), b.find(".tooltip-content").css({
                background: q
            })) : b.find(".tooltip-content > .tooltip-menu").hasClass("tooltip-menu") && (b.find(".tooltip-content > .tooltip-menu").addClass(C), q = b.find("." + C).css("background-color"), b.find(".tooltip-arrow").css("border-" + t + "-color", ""), b.find(".tooltip-arrow").css("border-" + g + "-color", q), b.find(".tooltip-content").css({
                background: q
            })));
            b.find(".tooltip-content > .video-wrapper").css({
                width: b.width() - 2 * B + "px"
            });
            b.offset(d);
            b.hide();
            c.removeAttr("title");
            c.removeAttr("alt");
            if ("hoverable" == a.data.settings.trigger || "click" == a.data.settings.trigger) D = 0;
            switch (g) {
                case "top":
                    b.delay(D).css({
                        top: "-=20",
                        opacity: 0,
                        display: "block"
                    }).animate({
                        top: "+=20",
                        opacity: j.opacity
                    }, 150);
                    break;
                case "bottom":
                    b.delay(D).css({
                        top: "+=20",
                        opacity: 0,
                        display: "block"
                    }).animate({
                        top: "-=20",
                        opacity: j.opacity
                    }, 150);
                    break;
                case "left":
                    b.delay(D).css({
                        left: "-=20",
                        opacity: 0,
                        display: "block"
                    }).animate({
                        left: "+=20",
                        opacity: j.opacity
                    }, 150);
                    break;
                case "right":
                    b.delay(D).css({
                        left: "+=20",
                        opacity: 0,
                        display: "block"
                    }).animate({
                        left: "-=20",
                        opacity: j.opacity
                    }, 150)
            }
            a.data.$plugin.tooltip = b;
            a.data.$plugin.location = v;
            a.data.$plugin.tooltip_arrow_border = g;
            b = null;
            return !1
        },
        mouseOutHandler: function(a) {
            var c = a.data.$plugin.tooltip,
                j = !1;
            "hoverable" != a.data.settings.trigger ? "hover" == a.data.settings.trigger ? (h(c).delay(a.data.settings.delay), j = !0) : (j = !0, "click" == a.data.settings.trigger && (a.data.settings.issticky ? j = !0 : (a.data.settings.interval = setInterval(function() {
                    h(c).fadeOut(0, function() {
                        h(a.data.$plugin.tooltip).remove()
                    });
                    clearInterval(a.data.settings.interval);
                    this.toggle = !1;
                    a.data.$toggle = !1;
                    a.data.element.unbind("click");
                    a.data.element.unbind("mouseleave");
                    a.data.element.bind("click", {
                        settings: a.data.settings,
                        element: a.data.element,
                        $plugin: a.data.$plugin,
                        $toggle: !1
                    }, a.data.$plugin.mouseOverHandler);
                    a.data.element.bind("mouseleave", {
                        settings: a.data.settings,
                        element: a.data.element,
                        $plugin: a.data.$plugin,
                        $toggle: !1
                    }, a.data.$plugin.mouseOutHandler)
                }, 0 == a.data.settings.delay ? 2E3 : a.data.settings.delay), a.data.element.unbind("mouseleave"),
                h(c).find(".tooltip-content").bind("mouseenter", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: !0
                }, function() {
                    a.data.element.unbind("click");
                    a.data.element.unbind("mouseleave");
                    this.toggle = !0;
                    a.data.$toggle = !0;
                    clearInterval(a.data.settings.interval)
                }), h(c).find(".tooltip-content").bind("mouseleave", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: a.data.$toggle
                }, function() {
                    h(c).fadeOut(0, function() {
                        h(a.data.$plugin.tooltip).remove()
                    });
                    this.toggle = !1;
                    a.data.$toggle = !1;
                    a.data.element.unbind("click");
                    a.data.element.unbind("mouseleave");
                    a.data.element.bind("click", {
                        settings: a.data.settings,
                        element: a.data.element,
                        $plugin: a.data.$plugin,
                        $toggle: !1
                    }, a.data.$plugin.mouseOverHandler);
                    a.data.element.bind("mouseleave", {
                        settings: a.data.settings,
                        element: a.data.element,
                        $plugin: a.data.$plugin,
                        $toggle: !1
                    }, a.data.$plugin.mouseOutHandler)
                }), j = !1))) : (a.data.settings.interval = setInterval(function() {
                h(c).fadeOut(0, function() {
                    h(a.data.$plugin.tooltip).remove()
                });
                clearInterval(a.data.settings.interval);
                a.data.element.unbind("mouseleave");
                a.data.element.unbind("mouseenter");
                a.data.element.bind("mouseenter", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: !1
                }, a.data.$plugin.mouseOverHandler);
                a.data.element.bind("mouseleave", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: !1
                }, a.data.$plugin.mouseOutHandler)
            }, 0 == a.data.settings.delay ? 2E3 : a.data.settings.delay), a.data.element.unbind("mouseleave"), h(c).find(".tooltip-content").bind("mouseenter", {
                settings: a.data.settings,
                element: a.data.element,
                $plugin: a.data.$plugin,
                $toggle: !0
            }, function() {
                a.data.element.unbind("mouseenter");
                a.data.element.unbind("mouseleave");
                this.toggle = !0;
                a.data.$toggle = !0;
                clearInterval(a.data.settings.interval)
            }), h(c).find(".tooltip-content").bind("mouseleave", {
                settings: a.data.settings,
                element: a.data.element,
                $plugin: a.data.$plugin,
                $toggle: !0
            }, function() {
                h(c).fadeOut(0, function() {
                    h(a.data.$plugin.tooltip).remove()
                });
                this.toggle = !1;
                a.data.$toggle = !1;
                a.data.element.unbind("mouseleave");
                a.data.element.unbind("mouseenter");
                a.data.element.bind("mouseenter", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: !1
                }, a.data.$plugin.mouseOverHandler);
                a.data.element.bind("mouseleave", {
                    settings: a.data.settings,
                    element: a.data.element,
                    $plugin: a.data.$plugin,
                    $toggle: !1
                }, a.data.$plugin.mouseOutHandler)
            }), j = !1);
            if (j) switch (a.data.$plugin.tooltip_arrow_border) {
                case "top":
                    h(c).animate({
                        top: "-=20",
                        opacity: 0
                    }, 150, function() {
                        h(a.data.$plugin.tooltip).remove()
                    });
                    break;
                case "bottom":
                    h(c).animate({
                        top: "+=20",
                        opacity: 0
                    }, 150, function() {
                        h(a.data.$plugin.tooltip).remove()
                    });
                    break;
                case "left":
                    h(c).animate({
                        left: "-=20",
                        opacity: 0
                    }, 150, function() {
                        h(a.data.$plugin.tooltip).remove()
                    });
                    break;
                case "right":
                    h(c).animate({
                        left: "+=20",
                        opacity: 0
                    }, 150, function() {
                        h(a.data.$plugin.tooltip).remove()
                    })
            }
            "click" == a.data.settings.trigger && a.data.$toggle && (h("body").find("#tooltip-clickoutside").remove(), this.toggle = !1, a.data.$toggle = !1, a.data.element.unbind("click"), a.data.element.unbind("mouseleave"), a.data.element.bind("click", {
                settings: a.data.settings,
                element: a.data.element,
                $plugin: a.data.$plugin,
                $toggle: a.data.$toggle
            }, a.data.$plugin.mouseOverHandler), a.data.settings.issticky || a.data.element.bind("mouseleave", {
                settings: a.data.settings,
                element: a.data.element,
                $plugin: a.data.$plugin,
                $toggle: a.data.$toggle
            }, a.data.$plugin.mouseOutHandler));
            return !1
        }
    };
    scrollbarWidth = function() {
        var a = h('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
        h("body").append(a);
        var c = h("div", a).innerWidth();
        a.css("overflow", "scroll");
        var j = h("div", a).innerWidth();
        h(a).remove();
        return c - j
    };
    h.fn.LiteTooltip.defaultSettings = {
        location: "top",
        title: "",
        opacity: 0.89,
        backcolor: "#000000",
        textcolor: "#ffffff",
        template: '<div class="litetooltip-wrapper"><div class="tooltip-arrow"></div><div class="tooltip-content"></div></div>',
        margin: 5,
        padding: 10,
        width: 0,
        textalign: "center",
        trigger: "hover",
        templatename: "",
        delay: 0,
        issticky: !0,
        clearfix: '<div class="clear"></div>'
    }
})(jQuery);