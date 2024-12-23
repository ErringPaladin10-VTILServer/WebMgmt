﻿function enableSlickGridTabbing(n, t) {
  var i = document.getElementById(n).getElementsByClassName("slick-hideFocus");
  i[0].setAttribute("tabindex", t == !0 ? -1 : 0);
  i[1].setAttribute("tabindex", t == !0 ? -1 : 0);
}
function getCookie(n) {
  for (
    var t, r = n + "=", u = document.cookie.split(";"), i = 0;
    i < u.length;
    i++
  ) {
    for (t = u[i]; t.charAt(0) == " "; ) t = t.substring(1);
    if (t.indexOf(r) == 0) return t.substring(r.length, t.length);
  }
  return "";
}
function wdpRestart() {
  if (
    (Wdp.Utils._hideVisibleOverlays(),
    window.confirm("Are you sure you want to restart the target device?"))
  ) {
    var n = new WebbRest();
    n.restart().fail(function (n, t, i) {
      i.status === 501
        ? alert("Restart is not supported.")
        : alert("Failed to restart.");
    });
  }
}
function wdpShutdown() {
  if (
    (Wdp.Utils._hideVisibleOverlays(),
    window.confirm(
      "Are you sure you want to shutdown the target device? You cannot turn it back on remotely."
    ))
  ) {
    var n = new WebbRest();
    n.shutdown().fail(function (n, t, i) {
      i.status === 501
        ? alert("Shutdown is not supported.")
        : alert("Failed to shutdown.");
    });
  }
}
function wdpFireAriaMessage(n) {
  $("#wdp-aria-message").text(n);
}
$.ajaxSetup({ async: !1 });
$.getJSON("/js/settings.json", function (n) {
  window.DeviceSettings = n.DeviceSettings;
});


$.ajaxSetup({ async: !0 }),
  (function () {
    "use strict";
    function nu() {
      return "ms_" + be++;
    }
    var ee = 27,
      vr = 1,
      fi = 2,
      ni = 3,
      bi = 4,
      hi = 5,
      ti = 6,
      ei = 7,
      ci = 8,
      ki = 9,
      oe = "none",
      p = "horizontal",
      ut = "vertical",
      ru = 0,
      uu = 1,
      fu = 2,
      yr = 3,
      pr = 4,
      li = "container",
      pt = "panel",
      ft = "stack",
      ot = "wdp-",
      h = "dock-",
      a = ot + "active",
      ii = h + "header-close",
      st = h + "container",
      w = h + "content",
      di = h + "content-host",
      se = ot + "devcentersigninprompt",
      ke = se + "-signincommand",
      ri = h + "container-direction-column",
      at = h + "container-direction-row",
      eu = h + "divider",
      he = h + "target",
      ai = h + "dragging",
      ou = ot + "fader",
      tt = h + "header",
      oi = h + "headers",
      si = ot + "nav",
      gi = si + "-minimized",
      su = si + "-divider",
      wt = su + "-minimizebutton",
      ce = si + "-workspaces",
      hu = si + "-footer",
      cu = hu + "-link",
      nr = si + "-workspace",
      lu = ot + "icon",
      au = "wdp-menu",
      it = ot + "menu-",
      tr = it + "button",
      le = it + "category",
      ae = it + "categoryname",
      ve = it + "container",
      vi = it + "content",
      de = it + "fixedcommands",
      ir = h + "move-preview",
      yi = it + "settings",
      ge = it + "toggle",
      no = it + "togglecontainer",
      wr = it + "toolalreadyadded",
      vu = it + "tool-label",
      yu = it + "tools",
      pu = it + "workspaces",
      bt = it + "setting-workspaces-",
      wu = bt + "addtool",
      bu = bt + "export",
      ku = bt + "delete",
      du = bt + "import",
      gu = bt + "new",
      nf = bt + "rename",
      tf = bt + "reset",
      to = bt + "toggleshownav",
      rr = ot + "powermenu-",
      ur = rr + "button",
      ye = rr + "container",
      rf = rr + "restart",
      uf = rr + "shutdown",
      ff = "wdp-noworkspaces",
      ef = "wdp-noworkspaces-text",
      of = h + "panel-",
      fr = of + "origin",
      er = ot + "overlay",
      lt = h + "panel",
      or = of + "placeholder",
      sf = "btn-primary",
      hf = ot + "progress-container",
      cf = ot + "popup",
      br = w + "-iframe",
      kr = h + "resize-preview",
      lf = "btn-secondary",
      pe = ot + "submenu",
      sr = "dock-target",
      pi = sr,
      af = sr + "-stack",
      hr = sr + "-split-",
      vf = hr + "left",
      yf = hr + "right",
      pf = hr + "top",
      wf = hr + "bottom",
      cr = sr + "-move-",
      bf = cr + "left",
      kf = cr + "right",
      df = cr + "top",
      gf = cr + "bottom",
      kt = h + "header-title",
      dt = [],
      dr = null,
      h = "data-dock-",
      we = h + "action",
      gr = h + "active-header",
      ui = h + "draggable",
      et = h + "node-type",
      ne = h + "resizable",
      l = h + "uri",
      wi = h + "id",
      e = function (n, t) {
        return n.classList.add(t);
      },
      r = function (n, t, i, r) {
        n.addEventListener(t, i, r);
      },
      o = function (n, t) {
        n.appendChild(t);
      },
      c = function (n) {
        return document.createElement(n);
      },
      f = function (n, t) {
        return n.getAttribute(t);
      },
      gt = function (n) {
        return n.getBoundingClientRect();
      },
      ht = function (n) {
        return n.style.height;
      },
      n = function (n) {
        return n.parentNode;
      },
      vt = function (n) {
        return n.style.width;
      },
      b = function (n, t) {
        return n.classList.contains(t);
      },
      k = function (n) {
        n.style.display = "none";
      },
      rt = function (n, t, i) {
        n.insertBefore(t, i);
      },
      i = function (n, t) {
        return n.querySelector(t);
      },
      u = function (n, t) {
        return n.querySelectorAll(t);
      },
      s = function (n, t) {
        n.removeChild(t);
      },
      d = function (n, t) {
        n.classList.remove(t);
      },
      g = function (n, t, i) {
        n.removeEventListener(t, i);
      },
      ct = function (n, t, i) {
        n.setAttribute(t, i);
      },
      nt = function (n, t) {
        n.className = t;
      },
      v = function (n, t) {
        n.style.height = t;
      },
      y = function (n, t) {
        n.style.width = t;
      },
      yt = function (n) {
        n.style.display = "block";
      },
      be = 0,
      lr,
      te,
      ie,
      tu,
      t,
      iu,
      ar,
      re,
      ue,
      fe;
    window.Wdp = {};
    Wdp.Utils = {};
    Wdp.Utils._workspaceManager;
    Wdp.Utils._showPopUp = function (n, t, u, f, o) {
      function y() {
        var n = i(document.body, "." + cf).wdpControl;
        n._hide();
      }
      var a, v, s, h, l;
      return (
        u || (u = { label: "Close", callback: y }),
        (a = c("div")),
        e(a, cf),
        o && e(a, o),
        (v =
          "<h4>" +
          n +
          '</h4><p role="alert">' +
          t +
          '</p><button class="' +
          sf +
          '">' +
          u.label +
          "</button>"),
        f && (v += '<button class="' + lf + '">' + f.label + "</button>"),
        (s = new Wdp._Overlay(a, { html: v })),
        s._show(),
        (h = i(a, "." + sf)),
        (l = i(a, "." + lf)),
        r(h, "click", u.callback || s._hide.bind(s), !1),
        l && r(l, "click", f.callback || s._hide.bind(s), !1),
        r(
          h,
          "keydown",
          function (n) {
            n.key != "Tab" ||
              !n.shiftKey ||
              n.altKey ||
              n.ctrlKey ||
              (n.preventDefault(), n.stopPropagation(), h.focus());
          },
          !1
        ),
        r(
          l ? l : h,
          "keydown",
          function (n) {
            if (n.key == "Tab" && !n.shiftKey && !n.altKey && !n.ctrlKey) {
              n.preventDefault();
              n.stopPropagation();
              var t = l ? l : h;
              t.focus();
            }
          },
          !1
        ),
        h.focus(),
        s
      );
    };
    Wdp.Utils._showProgress = function (n) {
      var t = document.createElement("div");
      t.innerHTML = '<div class="' + hf + '">  <progress></progress></div>';
      n.appendChild(t);
    };
    Wdp.Utils._hideProgress = function (n) {
      for (
        var i = n.querySelectorAll("." + hf), t = 0, r = i.length;
        t < r;
        t++
      )
        i[t].parentNode.removeChild(i[t]);
    };
    Wdp.Utils._hideVisibleOverlays = function () {
      for (
        var n, i = u(document.body, "." + er), t = 0, r = i.length;
        t < r;
        t++
      )
        (n = i[t]),
          n && n.wdpControl && n.wdpControl._open && n.wdpControl._hide();
    };
    ie = 6e4;
    Wdp.Utils._getSignedInUserAsync = function () {
      var t = new WebbRest(),
        n = $.Deferred(),
        i = Date.now();
      return (
        lr && Date.now() - te < ie
          ? n.resolve(lr)
          : t
              .getSignedInUser()
              .done(function (t) {
                lr = t;
                te = Date.now();
                n.resolve(lr);
              })
              .fail(function (t) {
                n.reject(t);
              }),
        n
      );
    };
    tu = function (n, t) {
      var i = this,
        u,
        r,
        f;
      for (
        i._activeWorkspaceIdInternal = -1,
          i._currentMouseOverTarget,
          i._currentPanel,
          i._currentPanelRect,
          i._currentPanelTabHeaders,
          i._delayedSaveTimeout,
          i._dockTargetRects,
          i._element,
          i._gestureState = ru,
          i._handleCloseToolBound = i._handleCloseTool.bind(this),
          i._handleHashChangeBound = i._handleHashChange.bind(this),
          i._handleMouseDownBound = i._handleMouseDown.bind(this),
          i._handleMouseMoveBound = i._handleMouseMove.bind(this),
          i._handleMouseOverBound = i._handleMouseOver.bind(this),
          i._handleMouseUpBound = i._handleMouseUp.bind(this),
          i._handlePostMessageBound = i._handlePostMessage.bind(this),
          i._handleSwitchWorkspaceBound = i._handleSwitchWorkspace.bind(this),
          i._initialX = -1,
          i._initialY = -1,
          i._initInternalBound = i._initInternal.bind(this),
          i._mouseDown = !1,
          i._origionalWorkspaceData = t,
          i._panels,
          i._pendingSave = !1,
          i._resizeDirection = oe,
          i._resizeNextPanel,
          i._resizeNextPanelRect,
          i._resizePreview,
          i._resizePreviousPanel,
          i._resizePreviousPanelRect,
          i._tabHeaderRects = [],
          i._workspaceData = t,
          i._LOCAL_STORAGE_KEY = "wdp-data",
          i._LOCAL_STORAGE_USER_SETTINGS_KEY =
            i._LOCAL_STORAGE_KEY + "-usersettings",
          i._LOCAL_STORAGE_OS_VERSION_KEY = i._LOCAL_STORAGE_KEY + "-osversion",
          i._MIN_PANEL_SIZE = 30,
          i._SAVE_INTERVAL = 200,
          i._USER_SETTING_SHOW_NAV = "showNav",
          Wdp.Utils._workspaceManager = this,
          r = 0;
        r < i._workspaceData.workspaces.length;
        r++
      )
        (u = i._workspaceData.workspaces[r]),
          u.group != undefined &&
            i._workspaceData.groupSubWorkspaces.indexOf(u.group) == -1 &&
            i._workspaceData.groupSubWorkspaces.push(u.group);
      if (i._workspaceData.groupSubWorkspaces)
        for (r = 1; r <= i._workspaceData.groupSubWorkspaces.length; r++)
          i._workspaceData.expandSubWorkspaces ? dt.push(!0) : dt.push(!1);
      f = new WebbRest();
      f.getSoftwareInfo()
        .done(function (n) {
          i._osInfo = n;
        })
        .always(function () {
          f.getUniqueId()
            .done(function (n) {
              i._LOCAL_STORAGE_KEY = "wdp-data-" + n.UniqueId;
              i._LOCAL_STORAGE_USER_SETTINGS_KEY =
                i._LOCAL_STORAGE_KEY + "-usersettings";
              i._LOCAL_STORAGE_OS_VERSION_KEY =
                i._LOCAL_STORAGE_KEY + "-osversion";
            })
            .always(function () {
              f.getPluginWorkspaces()
                .done(function (n) {
                  i._addPluginWorkspaces(n);
                })
                .always(function () {
                  i._init(n);
                });
            });
        });
    };
    t = tu.prototype;
    Object.defineProperty(t, "_activeWorkspaceId", {
      get: function () {
        var n = this._activeWorkspaceIdInternal;
        return n === -1 && (n = 0), n;
      },
      set: function (n) {
        return (this._activeWorkspaceIdInternal = n);
      },
      enumerable: !0,
      configurable: !0,
    });
    Object.defineProperty(t, "_userSettings", {
      get: function () {
        var n = this,
          t;
        if (!n._userSettingsInternal) {
          t = localStorage.getItem(n._LOCAL_STORAGE_USER_SETTINGS_KEY);
          try {
            n._userSettingsInternal = JSON.parse(t);
          } catch (i) {}
        }
        return n._userSettingsInternal || {};
      },
      set: function (n) {
        var t = this,
          i;
        t._userSettingsInternal = n;
        i = JSON.stringify(t._userSettingsInternal);
        localStorage.setItem(t._LOCAL_STORAGE_USER_SETTINGS_KEY, i);
      },
      enumerable: !0,
      configurable: !0,
    });
    t._addPluginWorkspaces = function (n) {
      var r = this,
        i = n.Workspaces,
        t;
      if (i !== undefined) {
        for ($.ajaxSetup({ async: !1 }), t = 0; t < i.length; t++)
          $.getJSON(i[t].Path, function (n) {
            r._workspaceData.workspaces[r._workspaceData.workspaces.length] = n;
          });
        $.ajaxSetup({ async: !0 });
      }
    };
    t._addTool = function (n, t) {
      var u = this,
        e = i(u._element, "." + lt),
        a,
        o,
        v;
      if (e) {
        var s = i(e, "." + oi),
          y = i(e, "." + di),
          h = nu(),
          f = c("div"),
          p = i(s, "." + tt);
        nt(f, tt);
        ct(f, ui, "true");
        ct(f, l, "#" + h);
        ct(f, "role", "presentation");
        f.innerHTML =
          '<div class="' +
          kt +
          '" tabindex="0" role="tab" aria-level="3">' +
          n +
          '</div><div class="' +
          ii +
          '" tabindex="0" role="button" aria-label="Close tool: ' +
          n +
          '" title="Close tool: ' +
          n +
          '"></div>';
        rt(s, f, p);
        a = i(f, "." + ii);
        r(a, "click", u._handleCloseToolBound, !1);
        r(
          a,
          "keypress",
          function (n) {
            n.key == "Enter" && u._handleCloseToolBound(n);
          },
          !1
        );
        o = c("div");
        v = i(s, "." + w);
        o.id = h;
        nt(o, w);
        ct(o, l, t);
        rt(y, o, v);
        u._loadFragment(t, o);
        u._layoutPanel(e);
        e.wdpControl._refresh(f, "#" + h);
      } else
        e = u._createPanel(
          { nodeType: pt, title: n, uri: t, width: 100, height: 100 },
          u._element
        );
      u._save();
    };
    t._appendDivider = function (n) {
      var t = this._createDivider();
      o(n, t);
    };
    t._calculateDockTargetRect = function (n, t) {
      var r = null,
        u = i(n, "#dock-target-" + t);
      return u && (r = gt(u)), r;
    };
    t._calculateTabHeaderRects = function () {
      var t = this,
        e = i(t._element, "#" + pi),
        f,
        r,
        o;
      if (e && ((f = n(e)), f))
        for (
          t._tabHeaderRects && (t._tabHeaderRects.length = 0),
            t._currentPanelTabHeaders = u(f, "." + tt),
            r = 0,
            o = t._currentPanelTabHeaders.length;
          r < o;
          r++
        )
          t._tabHeaderRects.push(gt(t._currentPanelTabHeaders[r]));
    };
    t._checkForDragStart = function (t, i, r) {
      var u = this,
        e;
      if (
        (u._currentMouseOverTarget || (u._currentMouseOverTarget = r.target),
        (e = f(u._currentMouseOverTarget, ui)),
        !e)
      )
        if (((e = f(n(u._currentMouseOverTarget), ui)), e))
          u._currentMouseOverTarget = n(u._currentMouseOverTarget);
        else return;
      u._initialX = t;
      u._initialY = i;
      u._gestureState = uu;
    };
    t._checkForUpdates = function (n) {
      var o = this,
        i,
        f,
        t,
        c,
        s,
        r,
        l;
      n.groupSubWorkspaces = o._workspaceData.groupSubWorkspaces;
      n.tagSubWorkspaces && (n.tagSubWorkspaces = undefined);
      n.version && (n.version = undefined);
      var h = function (n) {
          if (
            (typeof n.nodeType == "number" &&
              (n.nodeType == 1
                ? (n.nodeType = "container")
                : n.nodeType == 2
                ? (n.nodeType = "panel")
                : n.nodeType == 3 && (n.nodeType = "stack")),
            typeof n.flow == "number" &&
              (n.flow == 0
                ? (n.flow = "none")
                : n.flow == 1
                ? (n.flow = "horizontal")
                : n.flow == 2 && (n.flow = "vertical")),
            n.children)
          )
            for (var t = 0; t < n.children.length; ++t) h(n.children[t]);
        },
        u = o._workspaceData.workspaces,
        e = n.workspaces;
      for (t = e.length - 1; t >= 0; t--)
        if (((i = e[t]), !i.editable || i.version === undefined))
          if (i.editable) {
            for (r = 0; r < i.data.length; ++r) h(i.data[r]);
            i.version = 1;
          } else
            (f = o._findWorkspaceById(i.id, !0)),
              f !== -1
                ? (u[f].version === undefined ||
                    i.version === undefined ||
                    parseFloat(u[f].version) > parseFloat(i.version)) &&
                  (n.workspaces[t] = u[f])
                : n.workspaces.splice(t, 1);
      for (t = 0, c = u.length; t < c; t++) {
        for (s = !1, r = 0, l = e.length; r < l; r++)
          if (e[r].id === u[t].id) {
            s = !0;
            break;
          }
        s || n.workspaces.push(u[t]);
      }
    };
    t._cleanContainer = function (n) {
      var r = this,
        f = u(n, "." + lt),
        s,
        e,
        t;
      if (f.length) {
        for (t = 0, s = f.length; t < s; t++) r._layoutPanel(f[t]);
        i(n, "." + lt) || r._removeEmptyContainer(n);
      } else r._removeEmptyContainer(n);
      if (
        n.childNodes.length === 1 &&
        b(n.childNodes[0], st) &&
        n.flow === n.childNodes[0].flow
      ) {
        for (e = n.childNodes[0].childNodes, t = e.length - 1; t >= 0; t--)
          o(n, e[t]);
        r._removeEmptyContainer(n.childNodes[0]);
      }
    };
    t._createContainer = function (n, t) {
      var e = this,
        i = c("div"),
        f,
        u,
        r;
      if (
        (n.flow === p
          ? nt(i, st + " " + at)
          : n.flow === ut && nt(i, st + " " + ri),
        (i.flow = n.flow),
        y(i, n.width + "%"),
        v(i, n.height + "%"),
        n.children)
      )
        for (f = n.children, u = 0; u < f.length; u++)
          (r = f[u]),
            r.nodeType === li
              ? e._createContainer(r, i)
              : (r.nodeType === pt || r.nodeType === ft) &&
                e._createPanel(r, i),
            u < f.length - 1 && e._appendDivider(i);
      return t && o(t, i), i;
    };
    t._createDivider = function (n) {
      var t = c("div");
      return nt(t, eu), ct(t, ne, "true"), n && o(n, t), t;
    };
    t._createPanel = function (t, f) {
      var b = this,
        k = [],
        h = c("div"),
        d,
        p,
        a,
        g,
        e,
        rt,
        it;
      if (
        (nt(h, lt),
        ct(h, et, t.nodeType),
        (d = nu()),
        (p = '<div class="' + oi + '">'),
        t.nodeType === ft)
      )
        for (a = t.children, e = 0; e < a.length; e++)
          (k[e] = nu()),
            (p +=
              '<div class="' +
              tt +
              '" ' +
              ui +
              '="true" ' +
              l +
              '="#' +
              k[e] +
              '" role="presentation">  <div class="' +
              kt +
              '" tabindex="0" role="tab" aria-level="3">' +
              a[e].title +
              '</div>  <div class="' +
              ii +
              '" tabindex="0" role="button" aria-label="Close tool: ' +
              a[e].title +
              '" title="Close tool: ' +
              a[e].title +
              '"></div></div>');
      else
        p +=
          '<div class="' +
          tt +
          '" ' +
          ui +
          '="true" ' +
          l +
          '="#' +
          d +
          '" role="presentation">  <div class="' +
          kt +
          '" tabindex="0" role="tab" aria-level="3">' +
          t.title +
          '</div>  <div class="' +
          ii +
          '" tabindex="0" role="button" aria-label="Close tool: ' +
          t.title +
          '" title="Close tool: ' +
          t.title +
          '"></div></div>';
      if (((p += '</div><div class="' + di + '">'), t.nodeType === ft))
        for (a = t.children, e = 0; e < a.length; e++)
          p +=
            '<div id="' +
            k[e] +
            '" class="' +
            w +
            '"' +
            l +
            '="' +
            a[e].uri +
            '"></div>';
      else
        p +=
          '<div id="' +
          d +
          '" class="' +
          w +
          '"' +
          l +
          '="' +
          t.uri +
          '"></div>';
      if (
        ((p += "</div>"),
        (h.innerHTML = p),
        y(h, t.width + "%"),
        v(h, t.height + "%"),
        t.nodeType === ft)
      )
        for (e = 0; e < a.length; e++)
          b._loadFragment(a[e].uri, i(h, "#" + k[e]));
      else b._loadFragment(t.uri, i(h, "#" + d));
      if ((f && o(f, h), new Wdp._MasterDetail(h), t.nodeType === ft))
        for (g = u(h, "." + ii), e = 0; e < g.length; e++)
          r(g[e], "click", b._handleCloseToolBound, !1),
            r(
              g[e],
              "keypress",
              function (n) {
                n.key == "Enter" && b._handleCloseToolBound(n);
              },
              !1
            );
      else
        (rt = i(h, "." + ii)),
          r(rt, "click", b._handleCloseToolBound, !1),
          r(
            rt,
            "keypress",
            function (n) {
              n.key == "Enter" && b._handleCloseToolBound(n);
            },
            !1
          );
      return (it = document.getElementById(ff)), it && s(n(it), it), h;
    };
    t._handleCloseTool = function (n) {
      var t = this,
        r = n.target.parentNode,
        u = f(r, l),
        e = i(t._element, u),
        o = f(e, l);
      t._removeTool(o);
      n.preventDefault();
      n.stopPropagation();
    };
    t._delayedInit = function () {
      var n = this;
      g(document, "DOMContentLoaded", n._initInternalBound);
      n._initInternal();
    };
    t._dispose = function () {
      var t = this;
      t._unRegisterGlobalEventListeners();
      clearTimeout(t._delayedSaveTimeout);
      t._delayedSaveTimeout = null;
      t._activeWorkspaceIdInternal = null;
      t._currentMouseOverTarget = null;
      t._currentPanel = null;
      t._currentPanelRect = null;
      t._currentPanelTabHeaders = null;
      t._dockTargetRects = null;
      t._handleMouseDownBound = null;
      t._handleMouseMoveBound = null;
      t._handleMouseOverBound = null;
      t._handleMouseUpBound = null;
      t._gestureState = null;
      t._initialX = null;
      t._initialY = null;
      t._initInternalBound = null;
      t._mouseDown = null;
      t._panels = null;
      t._resizeDirection = null;
      t._resizeNextPanel = null;
      t._resizeNextPanelRect = null;
      t._resizePreview = null;
      t._resizePreviousPanel = null;
      t._resizePreviousPanelRect = null;
      t._tabHeaderRects && (t._tabHeaderRects.length = 0);
      t._tabHeaderRects = null;
      t._workspaceData = null;
      t._pendingSave = null;
      t._SAVE_INTERVAL = null;
      t._MIN_PANEL_SIZE = null;
      t._element && n(t._element) && s(n(t._element), t._element);
      t._element = null;
      Wdp.Utils._workspaceManager = null;
    };
    t._drag = function (n, t) {
      var r = this,
        u = i(r._element, "." + ai),
        f,
        e;
      u &&
        ((f = r._cachedShowingNav ? n - 254 : n - 32),
        (e = t - 48),
        (u.style.left = f + "px"),
        (u.style.top = e + "px"));
      r._handleDockingTargetMouseMove(n, t);
      r._handleMoveToNewPanel(n, t);
    };
    t._dragEnd = function () {
      var r = this,
        t = i(r._element, "." + ai),
        e,
        l,
        it,
        ut,
        u,
        h,
        c,
        b,
        k,
        g,
        nt,
        p;
      if (t) {
        if (
          ((e = i(r._element, "." + fr)),
          (l = n(r._currentPanel)),
          d(t, ai),
          d(t, a),
          (it = ht(t)),
          (ut = vt(t)),
          t.removeAttribute("style"),
          (u = i(r._element, "#" + or)),
          (c = i(r._element, "#" + ir)),
          c && (h = c.target),
          h)
        )
          switch (h) {
            case fi:
            case bi:
            case ni:
            case hi:
              r._handleSplit(t, l, h, c, u);
              break;
            case ti:
            case ei:
            case ci:
            case ki:
              r._handleMove(t, l, h, c);
              break;
            case vr:
              r._handleStack(t, l, h, c, u, e);
          }
        else
          (b = f(t, et)),
            b === ft
              ? ((k = i(e, "." + oi)),
                (g = i(t, "." + tt)),
                o(k, g),
                (nt = i(e, "." + di)),
                (p = i(t, "." + w)),
                o(nt, p),
                this._reloadPanel(null, p),
                s(n(t), t),
                e.wdpControl._refresh())
              : (y(t, vt(u)),
                v(t, ht(u)),
                rt(n(u), t, u),
                this._reloadPanel(t));
        d(e, fr);
        u && s(n(u), u);
        r._hideDropTargets(t);
        r._resetDragState(t);
      }
    };
    t._dragStart = function () {
      var h = this,
        it = h._currentMouseOverTarget,
        kt = f(it, ui),
        r,
        t,
        bt,
        k,
        st,
        lt,
        at,
        ut,
        d,
        pt,
        p,
        g,
        wt,
        ot;
      if (kt) {
        if (
          ((t = n(n(it))),
          (h._currentPanelRect = gt(t)),
          (bt = f(t, et)),
          bt === ft)
        ) {
          for (
            k = it,
              f(k, ui) || (k = n(it)),
              ct(k, gr, "true"),
              st = f(k, l),
              lt = t,
              r = lt,
              t = t.cloneNode(!0),
              at = u(t, "." + tt),
              ut = !1,
              p = 0;
            p < at.length;
            p++
          )
            (d = at[p]),
              f(d, gr)
                ? (!ut && b(d, a) && (ut = !0), d.removeAttribute(gr))
                : s(n(d), d);
          for (pt = u(t, "." + w), p = 0; p < pt.length; p++)
            (g = pt[p]),
              "#" + g.id !== st
                ? s(n(g), g)
                : g.style.display === "none" && yt(g);
          s(n(k), k);
          wt = i(r, st);
          s(n(wt), wt);
          ut && ((ot = i(lt, "." + w)), ot && (e(ot, a), yt(ot)));
        } else
          (r = c("div")),
            (r.id = or),
            nt(r, or),
            ct(r, et, f(t, et)),
            y(r, vt(t)),
            v(r, ht(t)),
            rt(n(t), r, t),
            s(n(t), t);
        e(t, ai);
        t.style.top = h._currentPanelRect.top + "px";
        t.style.left = h._currentPanelRect.left + "px";
        y(t, h._currentPanelRect.width + "px");
        v(t, h._currentPanelRect.height + "px");
        o(h._element, t);
        e(r, fr);
        h._setActivePanel(t);
        h._currentPanel = r;
        h._showDropTargets(r);
        h._gestureState = yr;
      }
    };
    t._evenlyDistributedLayout = function (n, t) {
      for (var i, f = n.flow, r = 0, u = t.length; r < u; r++)
        (i = t[r]),
          f === ut
            ? (v(i, 100 / u + "%"), y(i, "100%"))
            : (v(i, "100%"), y(i, 100 / u + "%"));
    };
    t._findDockTarget = function (n, t) {
      var r = this,
        u;
      if (!r._dockTargetRects) {
        if (((u = i(r._element, "#" + pi)), !u)) return;
        var f = r._calculateDockTargetRect(u, "stack"),
          e = r._calculateDockTargetRect(u, "split-left"),
          o = r._calculateDockTargetRect(u, "split-right"),
          s = r._calculateDockTargetRect(u, "split-top"),
          h = r._calculateDockTargetRect(u, "split-bottom"),
          c = r._calculateDockTargetRect(u, "move-left"),
          l = r._calculateDockTargetRect(u, "move-right"),
          a = r._calculateDockTargetRect(u, "move-top"),
          v = r._calculateDockTargetRect(u, "move-bottom");
        r._dockTargetRects = {
          stack: f,
          splitLeft: e,
          splitRight: o,
          splitTop: s,
          splitBottom: h,
          moveLeft: c,
          moveRight: l,
          moveTop: a,
          moveBottom: v,
        };
      }
      if (r._testCollision(n, t, r._dockTargetRects.stack)) return vr;
      if (r._testCollision(n, t, r._dockTargetRects.splitLeft)) return fi;
      if (r._testCollision(n, t, r._dockTargetRects.splitRight)) return ni;
      if (r._testCollision(n, t, r._dockTargetRects.splitTop)) return bi;
      if (r._testCollision(n, t, r._dockTargetRects.splitBottom)) return hi;
      if (r._testCollision(n, t, r._dockTargetRects.moveLeft)) return ti;
      if (r._testCollision(n, t, r._dockTargetRects.moveRight)) return ei;
      if (r._testCollision(n, t, r._dockTargetRects.moveTop)) return ci;
      if (r._testCollision(n, t, r._dockTargetRects.moveBottom)) return ki;
      r._calculateTabHeaderRects();
    };
    t._findWorkspaceByName = function (n, t) {
      for (
        var e = this,
          r = -1,
          f,
          u = e._workspaceData.workspaces,
          i = 0,
          o = u.length;
        i < o;
        i++
      )
        if (n === u[i].name) {
          r = i;
          f = u[r];
          break;
        }
      return t ? r : f;
    };
    t._findWorkspaceById = function (n, t) {
      for (
        var e = this,
          r = -1,
          f,
          u = e._workspaceData.workspaces,
          i = 0,
          o = u.length;
        i < o;
        i++
      )
        if (n == u[i].id) {
          r = i;
          f = u[r];
          break;
        }
      return t ? r : f;
    };
    t._getUserSetting = function (n) {
      var t = Wdp.Utils._workspaceManager,
        i = null;
      return t._userSettings && (i = t._userSettings[n]), i;
    };
    t._handleDockingTargetMouseMove = function (n, t) {
      var i = this,
        r = i._findDockTarget(n, t);
      r ? i._showDockPreview(r) : i._hideDockPreview();
    };
    t._handleHashChange = function () {
      var n = this,
        t,
        i,
        r;
      location.hash &&
        ((t = n._findWorkspaceById(n._activeWorkspaceId, !0)),
        (i = decodeURIComponent(location.hash.replace("#", ""))),
        t !== -1 &&
          n._workspaceData.workspaces[t].name !== i &&
          ((r = n._findWorkspaceByName(i)), r && n._load(r)));
    };
    t._handleMoveToNewPanel = function (n, t) {
      var i = this,
        e,
        o,
        r,
        f;
      if (!i._panels)
        for (
          i._panels = [], e = u(i._element, "." + lt + ", ." + or), r = 0;
          r < e.length;
          r++
        )
          i._panels.push({ element: e[r], rect: gt(e[r]) });
      if (
        ((o = !1),
        (n < i._currentPanelRect.left ||
          n > i._currentPanelRect.right ||
          t < i._currentPanelRect.top ||
          t > i._currentPanelRect.bottom) &&
          (o = !0),
        o)
      )
        for (r = 0; r < i._panels.length; r++)
          if (
            !b(i._panels[r].element, ai) &&
            ((f = i._panels[r].rect),
            n >= f.left && n <= f.right && t >= f.top && t <= f.bottom)
          ) {
            i._initializeDropTargetsForNewPanel(i._panels[r].element, f);
            break;
          }
    };
    t._handleMouseDown = function () {
      var n = this;
      n._mouseDown = !0;
      r(window, "mousemove", n._handleMouseMoveBound, !1);
      r(window, "mouseover", n._handleMouseOverBound, !1);
    };
    t._handleMouseMove = function (n) {
      var t = this;
      t._mouseDown && (t._processDragGestures(n), t._processResizeGestures(n));
    };
    t._handleMouseOver = function (n) {
      var t = this;
      ((t._mouseDown && n.target !== document) || n.target !== document.body) &&
        (t._currentMouseOverTarget = n.target);
    };
    t._handleMouseUp = function (n) {
      var t = this;
      t._mouseDown = !1;
      t._gestureState === yr && t._dragEnd();
      t._gestureState === pr && t._resizeEnd(n.clientX, n.clientY);
      t._resetGestureState();
      g(window, "mousemove", t._handleMouseMoveBound);
      g(window, "mouseover", t._handleMouseOverBound);
    };
    t._handleSplit = function (t, i, r) {
      var f = this,
        s = n(f._currentPanel),
        k,
        a,
        c,
        l,
        w,
        g,
        b,
        h;
      u(s, "." + lt).length === 1 &&
        (r === fi || r === ni
          ? (d(s, ri), e(s, at), (s.flow = p))
          : (d(s, at), e(s, ri), (s.flow = ut)));
      ((s.flow === ut && (r === fi || r === ni)) ||
        (s.flow === p && (r === bi || r === hi))) &&
        (r === fi || r === ni
          ? ((w = p),
            (c = "100%"),
            (l = "50%"),
            (k = ht(t).replace("%", "")),
            (a = "100%"))
          : ((w = ut), (c = "50%"), (l = "100%"), (a = ht(t).replace("%", ""))),
        v(f._currentPanel, c),
        y(f._currentPanel, l),
        v(t, c),
        y(t, l),
        (g = { nodeType: li, flow: w, height: k, width: a }),
        (b = f._createContainer(g)),
        rt(n(f._currentPanel), b, f._currentPanel),
        o(b, f._currentPanel));
      h = f._currentPanel;
      rt(n(h), t, h);
      (r === ni || r === hi) && (rt(n(t), h, t), this._reloadPanel(h));
      this._reloadPanel(t);
      f._layoutContainer(f._element);
    };
    t._handleMove = function (t, i, r) {
      var f = this,
        e,
        d,
        k,
        s,
        a,
        u,
        l,
        h,
        w,
        b;
      if (i) {
        if (i === f._element) {
          for (
            k = i,
              s = c("div"),
              s.flow = p,
              nt(s, st + " " + at),
              v(s, "100%"),
              y(s, "100%"),
              l = k.children,
              h = l.length - 1;
            h >= 0;
            h--
          )
            o(s, l[h]);
          $(f._element).empty();
          o(f._element, s);
          e = s;
        } else e = n(i);
        if (
          ((d = n(t)),
          (e.flow === p && (r === ci || r === ki)) ||
            (e.flow === ut && (r === ti || r === ei)))
        )
          if (
            ((a = e),
            (u = c("div")),
            r === ti || r === ei
              ? ((u.flow = p), nt(u, st + " " + at))
              : ((u.flow = ut), nt(u, st + " " + ri)),
            v(u, "100%"),
            y(u, "100%"),
            e === f._element)
          ) {
            for (l = e.children, h = l.length - 1; h >= 0; h--) o(u, l[h]);
            $(f._element).empty();
            o(f._element, u);
            e = u;
          } else o(n(a), u), o(u, a), (i = a);
        r === ti || r === ei
          ? ((w = "100%"), (b = "50%"))
          : ((w = "50%"), (b = "100%"));
        v(i, w);
        y(i, b);
        v(t, w);
        y(t, b);
        r === ti || r === ci
          ? rt(n(i), t, i)
          : (rt(n(i), t, i), rt(n(t), i, t));
        this._reloadPanel(t);
        f._layoutContainer(f._element);
      }
    };
    t._handlePostMessage = function (n) {
      var r = this,
        i,
        t,
        e;
      if (n.isTrusted && n.data && n.data._wdpPostMessage) {
        var f = n.data._wdpPostMessage,
          o = f.type,
          s = f.forward;
        switch (o) {
          case "remotetool-refresh":
            r._refreshRemoteTools();
        }
        if (s)
          for (i = u(r._element, "." + br), t = 0, e = i.length; t < e; t++)
            i[t].contentWindow.postMessage(n.data, "*");
      }
    };
    t._handleSwitchWorkspace = function (n) {
      var t = this,
        i = f(n.target, wi);
      t._switchWorkspace(i);
      n.preventDefault();
    };
    t._handleStack = function (t, r, f, e, o, h) {
      var a = this,
        k = i(a._element, "#" + pi),
        c,
        p,
        l,
        d,
        nt;
      if (k && ((c = n(k)), c))
        if (c === o)
          y(t, vt(o)), v(t, ht(o)), rt(n(o), t, o), this._reloadPanel(t);
        else {
          if (((p = i(t, "." + tt)), (l = i(c, "." + oi)), !l)) return;
          d = l.firstChildElement;
          rt(l, p, d);
          var g = i(t, "." + w),
            it = i(c, "." + di),
            b = i(it, "." + w),
            d = b;
          rt(n(b), g, b);
          this._reloadPanel(null, g);
          nt = u(h, "." + tt).length;
          nt === 1 && ct(h, et, pt);
          t && n(t) && s(n(t), t);
          ct(c, et, ft);
          c.wdpControl && c.wdpControl._refresh(p);
          a._layoutContainer(a._element);
        }
    };
    t._hideDockPreview = function () {
      var r = this,
        t = i(r._element, "#" + ir);
      t && s(n(t), t);
    };
    t._hideDropTargets = function () {
      var r = this,
        t;
      r._hideDockPreview();
      t = i(r._element, "#" + pi);
      t && s(n(t), t);
    };
    t._initializeDropTargetsForNewPanel = function (n, t) {
      var i = this;
      i._currentPanel = n;
      i._currentPanelRect = t;
      i._setActivePanel(n);
      i._showDropTargets(n);
      i._panels = null;
      i._dockTargetRects = null;
    };
    t._insertDivider = function (t) {
      var r = this,
        i;
      n(t) && ((i = r._createDivider()), rt(n(t), i, t));
    };
    t._init = function (n) {
      var t = this;
      t._element = n;
      document.body
        ? t._initInternal()
        : r(document, "DOMContentLoaded", t._initInternalBound, !1);
    };
    t._initInternal = function () {
      var n = this,
        r,
        u,
        f,
        s,
        t,
        i,
        a,
        h,
        v,
        c,
        l;
      if (
        ((n._element = n._element || document.body),
        n._registerGlobalEventListeners(),
        n._workspaceData.logo && n._layoutLogo(n._workspaceData.logo),
        window.localStorage)
      ) {
        if (((u = !0), n._osInfo)) {
          if (
            ((f = localStorage.getItem(n._LOCAL_STORAGE_OS_VERSION_KEY)), f)
          ) {
            var o = JSON.parse(f),
              y = parseInt(
                n._osInfo.OsVersion.substr(0, n._osInfo.OsVersion.indexOf("."))
              ),
              p = parseInt(o.OsVersion.substr(0, o.OsVersion.indexOf(".")));
            (n._osInfo.OsEditionId != o.OsEditionId || y < p) && (u = !1);
          }
          localStorage.setItem(
            n._LOCAL_STORAGE_OS_VERSION_KEY,
            JSON.stringify(n._osInfo)
          );
        }
        if (((s = localStorage.getItem(n._LOCAL_STORAGE_KEY)), s && u))
          try {
            r = JSON.parse(s);
            n._checkForUpdates(r);
            n._workspaceData = r;
            t = n._workspaceData[0];
            location.hash &&
              ((i = decodeURIComponent(location.hash.replace("#", ""))),
              (t = this._findWorkspaceByName(i)));
          } catch (w) {}
        t || (t = n._workspaceData.workspaces[0]);
        n._load(t);
        n._refreshNav();
      } else
        n._workspaceData &&
          ((t = n._workspaceData.workspaces[0]),
          location.hash &&
            ((i = decodeURIComponent(location.hash.replace("#", ""))),
            (t = this._findWorkspaceByName(i))),
          n._load(t));
      if (
        window.DeviceSettings &&
        (window.DeviceSettings.DeviceShortName &&
          ((a =
            ot +
            "devicefamily-" +
            window.DeviceSettings.DeviceShortName.toLowerCase()),
          e(document.body, a)),
        window.DeviceSettings.AdditionalStylesheets)
      ) {
        h = $("head");
        for (v in window.DeviceSettings.AdditionalStylesheets)
          (c = h.find("link[rel='stylesheet']:last")),
            (l =
              "<link rel='stylesheet' href='css/" +
              window.DeviceSettings.AdditionalStylesheets[v].Stylesheet +
              "' type='text/css'>"),
            c.length ? c.after(l) : h.append(l);
      }
    };
    t._layout = function (n) {
      var t = this,
        r,
        u,
        i;
      if (n)
        for (
          e(t._element, st),
            e(t._element, at),
            t._element.flow = p,
            r = 0,
            u = n.length;
          r < u;
          r++
        )
          (i = n[r]),
            i.nodeType === li
              ? t._createContainer(i, t._element)
              : (i.nodeType === pt || i.nodeType === ft) &&
                t._createPanel(i, t._element),
            r < u - 1 && t._createDivider(t._element);
    };
    t._layoutContainer = function (t) {
      var e = this,
        u,
        o,
        h,
        w,
        i,
        f,
        r,
        c,
        l;
      if (t) {
        e._cleanContainer(t);
        var nt = t.flow,
          k = t.children,
          a = [],
          p = [],
          d = 0,
          g = 0;
        for (i = 0, f = k.length; i < f; i++)
          (u = k[i]),
            b(u, lt) || b(u, st)
              ? ((o = parseInt(ht(u).replace("%", ""))),
                isNaN(o) && (o = 50),
                (d += o),
                (h = parseInt(vt(u).replace("%", ""))),
                isNaN(h) && (h = 50),
                (g += h),
                p.push(u))
              : b(u, eu) && a.push(u);
        for (i = 0, f = a.length; i < f; i++) (w = a[i]), s(n(w), w);
        for (i = 0, f = p.length; i < f; i++)
          (r = p[i]),
            b(r, st) && e._layoutContainer(r),
            nt === ut
              ? ((c = parseInt(ht(r).replace("%", ""))),
                isNaN(c) && (c = 50),
                v(r, 100 * (c / d) + "%"),
                y(r, "100%"))
              : (v(r, "100%"),
                (l = parseInt(vt(r).replace("%", ""))),
                isNaN(l) && (l = 50),
                y(r, 100 * (l / g) + "%")),
            i > 0 && e._insertDivider(r);
        e._ensureConsistency(t);
        e._save();
      }
    };
    t._ensureConsistency = function (n) {
      var u, a, t, e, f;
      if (n.parentNode) {
        var o = this,
          i = n.flow,
          s = n.children,
          h = [],
          c = 0,
          l = 0,
          r = !1;
        for (u = 0, a = s.length; u < a; u++)
          (t = s[u]),
            (b(t, lt) || b(t, st)) &&
              (i === ut
                ? ((f = parseInt(ht(t).replace("%", ""))),
                  (c += f),
                  (e = parseInt(vt(t).replace("%", ""))),
                  e !== 100 && (r = !0))
                : ((e = parseInt(vt(t).replace("%", ""))),
                  (l += e),
                  (f = parseInt(ht(t).replace("%", ""))),
                  f !== 100 && (r = !0)),
              h.push(t));
        i === ut && Math.abs(100 - c) > 1
          ? (r = !0)
          : i === p && Math.abs(100 - l) > 1 && (r = !0);
        r && o._evenlyDistributedLayout(n, h);
        ((i === ut && n.classList.contains(at)) ||
          (i === p && n.classList.contains(ri))) &&
          o._resetFlowDirection(n);
      }
    };
    t._layoutBanner = function (n) {
      var t = this;
      if (!n) {
        $("#wdp-banner").addClass("wdp-banner-hidden");
        $("#wdp-content").removeClass("wdp-content-with-banner");
        return;
      }
      $("#wdp-banner").removeClass("wdp-banner-hidden");
      $("#wdp-banner").css("height", n.height + "px");
      $(
        '<style type="text/css"> #wdp-content.wdp-content-with-banner{ height:calc(100% - ' +
          (n.height + 4) +
          "px); } </style>"
      ).appendTo("head");
      $("#wdp-content").addClass("wdp-content-with-banner");
      t._loadFragment(n.uri, $("#wdp-banner"));
    };
    t._layoutLogo = function (n) {
      var t = this;
      if (!n) {
        $("#wdp-logo").html("");
        return;
      }
      $("#wdp-logo-img").attr("src", n.image);
      $("#wdp-logo-img").attr("alt", n.altText);
      $("#wdp-logo").addClass("wdp-logo");
    };
    t._layoutPanel = function (t) {
      var o = this,
        r = u(t, "." + tt),
        e;
      r.length === 0
        ? s(n(t), t)
        : r.length === 1 && f(t, et) === ft
        ? (ct(t, et, pt), (e = i(t, "." + w)), yt(e))
        : r.length > 1 && f(t, et) !== ft && ct(t, et, ft);
      o._save();
    };
    t._load = function (n) {
      var t = this,
        f,
        e,
        r,
        u;
      document.contentLoading = !0;
      n || ((f = t._findWorkspaceById(t._activeWorkspaceId)), (n = f));
      t._activeWorkspaceId = n.id;
      location.hash = encodeURIComponent(n.name);
      window.DeviceSettings &&
        window.DeviceSettings.DeviceLabel &&
        ((location.title =
          n.name +
          " - " +
          window.DeviceSettings.DeviceLabel +
          " Device Portal"),
        (e = i(document, "#wdp-titlelabel")),
        (e.textContent = location.title));
      $(t._element).empty();
      t._layoutBanner(n.banner);
      t._layout(n.data);
      n.data.length ||
        ((r = document.createElement("div")),
        (r.id = ff),
        (r.innerHTML =
          "<h1>It's lonely here</h1><h5 id=\"" +
          ef +
          '" tabindex="0" style="padding-top:0px">You can add tools from the menu. You can resize and rearrange them too.</h5>'),
        t._element.insertBefore(r, t._element.firstChildElement));
      t._save(!0);
      document.contentLoading = !1;
      u = document.createEvent("Event");
      u.initEvent("loadingcompleted", !0, !0);
      window.dispatchEvent(u);
    };
    t._loadFragment = function (n, t) {
      var r = this,
        i;
      n.match("https|http")
        ? ((i = document.createElement("iframe")),
          e(i, br),
          r._refreshRemoteTool(i, t, n),
          o(t, i))
        : $(t).load(n);
    };
    t._new = function (n) {
      var t = this,
        r = !1,
        i,
        u;
      if (n) {
        i = null;
        do i = t._generateGUID();
        while (t._findWorkspaceById(i, !0) !== -1);
        u = {
          id: i,
          name: n,
          editable: !0,
          version: 1,
          data: {
            nodeType: li,
            flow: p,
            width: 100,
            height: 100,
            children: [],
          },
        };
        t._workspaceData.workspaces.push(u);
        t._switchWorkspace(i);
        t._saveImpl(!0);
        r = !0;
      }
      return r;
    };
    t._generateGUID = function () {
      return "{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}".replace(
        /[xy]/g,
        function (n) {
          var t = (Math.random() * 16) | 0,
            i = n == "x" ? t : (t & 3) | 8;
          return i.toString(16);
        }
      );
    };
    t._processDragGestures = function (n) {
      var t = this,
        i = n.clientX,
        r = n.clientY,
        u = t._currentMouseOverTarget;
      t._initialX === -1 && t._initialY === -1 && t._checkForDragStart(i, r, n);
      t._gestureState === uu &&
        Math.abs(i - t._initialX) + Math.abs(r - t._initialY) > 10 &&
        t._setDragStart(i, r);
      t._gestureState === fu && u && t._dragStart(i, r);
      t._gestureState === yr && t._drag(i, r);
    };
    t._processResizeGestures = function (t) {
      var i = this,
        r = t.clientX,
        u = t.clientY,
        e = t.target,
        s,
        h;
      if (i._mouseDown && i._initialX === -1 && i._initialY === -1 && f(e, ne))
        (i._initialX = r),
          (i._initialY = u),
          (s = e),
          (h = n(e)),
          (i._resizeDirection = h.flow),
          (i._resizePreview = c("div")),
          (i._resizePreview.id = kr),
          nt(i._resizePreview, kr),
          i._resizeDirection === p
            ? (i._resizePreview.style.left = r + "px")
            : (i._resizePreview.style.top = u + "px"),
          o(h, i._resizePreview),
          (i._resizePreviousPanel = s.previousElementSibling),
          (i._resizePreviousPanelRect = gt(i._resizePreviousPanel)),
          (i._resizeNextPanel = s.nextElementSibling),
          (i._resizeNextPanelRect = gt(i._resizeNextPanel)),
          (i._gestureState = pr);
      else if (
        i._gestureState === pr &&
        (i._resizeDirection === p
          ? (r < i._resizePreviousPanelRect.left + i._MIN_PANEL_SIZE
              ? (r = i._resizePreviousPanelRect.left + i._MIN_PANEL_SIZE)
              : r > i._resizeNextPanelRect.right - i._MIN_PANEL_SIZE &&
                (r = i._resizeNextPanelRect.right - i._MIN_PANEL_SIZE),
            (i._resizePreview.style.left = r + "px"))
          : (u < i._resizePreviousPanelRect.top + i._MIN_PANEL_SIZE
              ? (u = i._resizePreviousPanelRect.top + i._MIN_PANEL_SIZE)
              : u > i._resizeNextPanelRect.bottom - i._MIN_PANEL_SIZE &&
                (u = i._resizeNextPanelRect.bottom - i._MIN_PANEL_SIZE),
            (i._resizePreview.style.top = u + "px")),
        window.getSelection)
      )
        if (window.getSelection().empty)
          try {
            window.getSelection().empty();
          } catch (l) {}
        else if (window.getSelection().removeAllRanges)
          try {
            window.getSelection().removeAllRanges();
          } catch (l) {}
    };
    t._toggleShowHideWorkspace = function () {
      var u = this.id,
        n = u.replace("toggleWorkspaces", ""),
        r = document
          .getElementById("wdp-nav-multilevelbutton" + n)
          .getAttribute("aria-label"),
        t,
        i;
      dt[n] === !0
        ? ((dt[n] = !1),
          (document.getElementById("wdp-nav-sub-workspaces" + n).style.display =
            "none"),
          (t = r.replace("Collapse", "Expand")),
          document
            .getElementById("wdp-nav-multilevelbutton" + n)
            .setAttribute("aria-label", t),
          d(document.getElementById("toggleWorkspaces" + n), "toggleButton"))
        : (dt[n] === !1 || dr === n) &&
          ((dt[n] = !0),
          (document.getElementById("wdp-nav-sub-workspaces" + n).style.display =
            ""),
          (t = r.replace("Expand", "Collapse")),
          document
            .getElementById("wdp-nav-multilevelbutton" + n)
            .setAttribute("aria-label", t),
          e(document.getElementById("toggleWorkspaces" + n), "toggleButton"));
      i = document.createEvent("Event");
      i.initEvent("resize", !0, !0);
      window.dispatchEvent(i);
    };
    t._refreshNav = function () {
      var n = this,
        l = n._workspaceData.workspaces,
        h = i(document, "#" + si),
        v = n._getUserSetting(n._USER_SETTING_SHOW_NAV),
        s,
        c,
        y,
        p,
        w,
        o,
        k,
        g,
        f,
        b,
        nt,
        t,
        tt;
      if (
        (v === !1 ||
          v ||
          ((v = !0), n._setUserSetting(n._USER_SETTING_SHOW_NAV, !0)),
        v ? d(document.body, gi) : e(document.body, gi),
        (l = n._workspaceData.workspaces),
        $(h).empty(),
        (s =
          '<div class="' +
          su +
          '">   <a id="' +
          wt +
          '" class="' +
          wt +
          '" tabindex="0" role="button"></a></div><ul class="' +
          ce +
          '" role="list">'),
        (c = ""),
        n._workspaceData.groupSubWorkspaces)
      )
        for (
          t = 0, f = 0;
          f < n._workspaceData.groupSubWorkspaces.length;
          f++
        ) {
          for (
            y = n._workspaceData.groupSubWorkspaces[f], p = !1, w = 0;
            w < l.length;
            w++
          )
            (o = l[w]),
              o.group === y &&
                (p ||
                  ((p = !0),
                  (s +=
                    '<li class="' +
                    nr +
                    '" id="toggleWorkspaces' +
                    t +
                    '" role="listitem"><a id="wdp-nav-multilevelbutton' +
                    t +
                    '" href="#" role="button" style=cursor:pointer; aria-label="Expand:' +
                    y +
                    '"><span class="wdp-nav-show-subworkspace" ></span>' +
                    y +
                    "</a>"),
                  (s +=
                    '<ul class="wdp-nav-sub-workspaces" id="wdp-nav-sub-workspaces' +
                    t +
                    '" style=display:none; role="list">')),
                o.id === n._activeWorkspaceId
                  ? ((c = " " + a + '"'), (dr = t))
                  : (c = '"'),
                (s +=
                  '<li class="wdp-nav-sub-workspace' +
                  c +
                  ' role="listitem"><a href="#' +
                  o.name +
                  '" ' +
                  wi +
                  '="' +
                  o.id +
                  '" role="link">' +
                  o.name +
                  "</a></li>"));
          p && ((s += "</ul></li>"), t++);
        }
      for (f = 0; f < l.length; f++)
        (o = l[f]),
          o.group === undefined &&
            ((c = o.id === n._activeWorkspaceId ? " " + a + '"' : '"'),
            (s +=
              '<li class="' +
              nr +
              c +
              ' role="listitem"><a href="#' +
              o.name +
              '" ' +
              wi +
              '="' +
              o.id +
              '" role="link">' +
              o.name +
              "</a></li>"));
      for (
        s += "</ul>",
          s +=
            '<div class="' +
            hu +
            '">   <a id="' +
            cu +
            '" class="' +
            cu +
            '" tabindex="0" href="https://go.microsoft.com/fwlink/?linkid=521839">Privacy &amp; Cookies</a></div>',
          h.innerHTML = s,
          k = u(h, "." + nr + " a"),
          f = 0,
          b = k.length;
        f < b;
        f++
      )
        r(k[f], "click", n._handleSwitchWorkspaceBound, !1);
      for (
        g = u(h, "." + nr + "#toggleWorkspaces" + t + " a"),
          f = 0,
          b = g.length;
        f < b;
        f++
      )
        r(g[f], "click", n._handleSwitchWorkspaceBound, !1);
      if (
        ((nt = i(h, "#" + wt)),
        r(nt, "click", n._toggleShowHideNav, !1),
        r(
          nt,
          "keypress",
          function (t) {
            t.key == "Enter" && n._toggleShowHideNav();
          },
          !1
        ),
        n._workspaceData.groupSubWorkspaces)
      )
        for (t = 0; t < n._workspaceData.groupSubWorkspaces.length; t++)
          dt[t] === !0 &&
            (dr === t && (dt[t] = !1),
            (document.getElementById(
              "wdp-nav-sub-workspaces" + t
            ).style.display = ""),
            document
              .getElementById("wdp-nav-multilevelbutton" + t)
              .setAttribute(
                "aria-label",
                '"Collapse:' + n._workspaceData.groupSubWorkspaces[t] + '"'
              ),
            e(document.getElementById("toggleWorkspaces" + t), "toggleButton")),
            (tt = i(h, "#toggleWorkspaces" + t)),
            r(tt, "click", n._toggleShowHideWorkspace, !1);
      v
        ? $("#" + wt)
            .attr("aria-label", "Hide list of workspaces")
            .attr("title", "Hide list of workspaces")
            .attr("aria-expanded", !0)
        : $("#" + wt)
            .attr("aria-label", "Show list of workspaces")
            .attr("title", "Show list of workspaces")
            .attr("aria-expanded", !1);
    };
    t._refreshRemoteTool = function (t, i, r) {
      i || (i = n(t));
      r || (r = f(i, l));
      t.addEventListener(
        "load",
        function u() {
          t.removeEventListener("load", u);
        },
        !1
      );
      t.src = r;
    };
    t._refreshRemoteTools = function () {
      for (
        var r, t = this, i = u(t._element, "." + br), n = 0, f = i.length;
        n < f;
        n++
      )
        (r = i[n]), t._refreshRemoteTool(r);
    };
    t._registerGlobalEventListeners = function () {
      var n = this;
      r(window, "hashchange", n._handleHashChangeBound, !1);
      r(window, "message", n._handlePostMessageBound, !1);
      r(window, "mousedown", n._handleMouseDownBound, !1);
      r(window, "mouseup", n._handleMouseUpBound, !1);
    };
    t._reloadPanel = function (n, t) {
      var e = this,
        o,
        u;
      t || (t = n.querySelector("." + w));
      o = f(t, l);
      this._loadFragment(o, t);
      n &&
        ((u = i(n, "." + ii)),
        r(u, "click", e._handleCloseToolBound, !1),
        r(
          u,
          "keypress",
          function (n) {
            n.key == "Enter" && e._handleCloseToolBound(n);
          },
          !1
        ));
    };
    t._remove = function () {
      var n = this,
        t = n._findWorkspaceById(n._activeWorkspaceId, !0);
      return t !== -1 &&
        n._workspaceData.workspaces.length > 1 &&
        n._workspaceData.workspaces[t].editable
        ? (n._workspaceData.workspaces.splice(t, 1),
          n._saveImpl(!0),
          n._switchWorkspace(n._workspaceData.workspaces[0].id),
          !0)
        : !1;
    };
    t._removeEmptyContainer = function (t) {
      var i = this;
      t !== i._element && n(t) && s(n(t), t);
    };
    t._removeTool = function (t) {
      var u = this,
        r = i(u._element, "." + w + "[" + l + '="' + t + '"]'),
        e,
        f;
      r &&
        ((e = n(n(n(r)))),
        (f = i(u._element, "." + tt + "[" + l + '="#' + r.id + '"]')),
        s(n(f), f),
        s(n(r), r),
        u._layoutContainer(e));
    };
    t._rename = function (n) {
      var t = this,
        r = !1,
        i = t._findWorkspaceById(t._activeWorkspaceId, !0);
      return (
        i !== -1 &&
          n &&
          t._workspaceData.workspaces[i].editable &&
          ((t._workspaceData.workspaces[i].name = n),
          t._saveImpl(!0),
          (location.hash = encodeURIComponent(n)),
          (r = !0)),
        r
      );
    };
    t._resetDragState = function (n) {
      var t = this,
        r;
      t._dockTargetRects = null;
      t._currentPanelTabHeaders = null;
      r = i(n, "." + oi);
    };
    t._resetFlowDirection = function (n) {
      var t = n.flow;
      t === ut
        ? (n.classList.remove(at), n.classList.add(ri))
        : (n.classList.remove(ri), n.classList.add(at));
    };
    t._resetGestureState = function () {
      var n = this;
      n._initialX = -1;
      n._initialY = -1;
      n._gestureState = ru;
      n._currentMouseOverTarget = null;
    };
    t._resizeEnd = function (t, r) {
      var u = this,
        f;
      u._resizePreview = i(u._element, "#" + kr);
      u._resizePreview &&
        ((f = n(u._resizePreview)),
        u._resizeImpl(f.flow, t, r),
        s(n(u._resizePreview), u._resizePreview),
        (u._resizePreview = null),
        (u._resizePreviousPanel = null),
        (u._resizeNextPanel = null),
        (u._resizePreviousPanelRect = null),
        (u._resizeNextPanelRect = null));
    };
    t._resizeImpl = function (n, t, i) {
      var r = this,
        o,
        u,
        l,
        f,
        e;
      n === p
        ? ((u = "width"),
          t < r._resizePreviousPanelRect.left + r._MIN_PANEL_SIZE
            ? (t = r._resizePreviousPanelRect.left + r._MIN_PANEL_SIZE)
            : t > r._resizeNextPanelRect.right - r._MIN_PANEL_SIZE &&
              (t = r._resizeNextPanelRect.right - r._MIN_PANEL_SIZE),
          (o = t - r._initialX))
        : ((u = "height"),
          i < r._resizePreviousPanelRect.top + r._MIN_PANEL_SIZE
            ? (i = r._resizePreviousPanelRect.top + r._MIN_PANEL_SIZE)
            : i > r._resizeNextPanelRect.bottom - r._MIN_PANEL_SIZE &&
              (i = r._resizeNextPanelRect.bottom - r._MIN_PANEL_SIZE),
          (o = i - r._initialY));
      l = Math.abs(o);
      f = parseInt(r._resizePreviousPanel.style[u].replace("%", ""));
      isNaN(f) && (f = 50);
      e = parseInt(r._resizeNextPanel.style[u].replace("%", ""));
      isNaN(e) && (e = 50);
      var a = f + e,
        v = r._resizePreviousPanelRect[u] + r._resizeNextPanelRect[u],
        s = (l * a) / v,
        h,
        c;
      o > 0
        ? ((h = Math.floor(f + s)), (c = Math.ceil(e - s)))
        : ((h = Math.floor(f - s)), (c = Math.ceil(e + s)));
      r._resizePreviousPanel.style[u] = h + "%";
      r._resizeNextPanel.style[u] = c + "%";
      r._save();
      $(window).trigger("resize");
    };
    t._setActivePanel = function (n) {
      for (
        var o, r = this, f = u(r._element, "." + lt), t = 0;
        t < f.length;
        t++
      )
        d(n, a), (o = i(n, "." + oi));
      e(n, a);
    };
    t._setDragStart = function () {
      var n = this;
      n._gestureState = fu;
      n._cachedShowingNav = n._getUserSetting(n._USER_SETTING_SHOW_NAV);
    };
    t._showDockPreview = function (t) {
      var u = this,
        a = n(u._currentPanel),
        l;
      if (a) {
        l = c("div");
        l.id = ir;
        nt(l, ir);
        var p = a.flow,
          i = gt(u._currentPanel),
          r = gt(a),
          f = "",
          e = "",
          s = "",
          h = "";
        switch (t) {
          case vr:
            e = i.top;
            f = i.left;
            s = i.width;
            h = i.height;
            break;
          case fi:
            f = i.left - i.width / 4 >= r.left ? i.left - i.width / 4 : i.left;
            e = i.top;
            s = i.width / 2;
            h = i.height;
            break;
          case ni:
            f =
              i.right + i.width / 4 <= r.right
                ? i.right - i.width / 4
                : i.right - i.width / 2;
            e = i.top;
            s = i.width / 2;
            h = i.height;
            break;
          case bi:
            e = i.top + i.height / 4 <= r.top ? i.top + i.height / 4 : i.top;
            f = i.left;
            s = i.width;
            h = i.height / 2;
            break;
          case hi:
            e =
              i.bottom + i.height / 4 <= r.bottom
                ? i.bottom + i.height / 4
                : i.top + i.height / 2;
            f = i.left;
            s = i.width;
            h = i.height / 2;
            break;
          case ti:
            f =
              r.left - i.width / 4 >= u._element.offsetTop
                ? r.left - i.width / 4
                : r.left;
            e = r.top;
            s = i.width / 2;
            h = r.height;
            break;
          case ei:
            f =
              r.right + i.width / 4 <=
              u._element.offsetLeft + u._element.offsetWidth
                ? r.right - i.width / 4
                : u._element.offsetLeft + u._element.offsetWidth - i.width / 2;
            e = r.top;
            s = i.width / 2;
            h = r.height;
            break;
          case ci:
            e =
              r.top - i.height / 4 >= u._element.offsetTop
                ? r.top - i.height / 4
                : r.top;
            f = r.left;
            s = r.width;
            h = i.height / 2;
            break;
          case ki:
            e =
              r.top - i.height / 4 >=
              u._element.offsetTop + u._element.offsetHeight
                ? r.top - i.height / 4
                : u._element.offsetTop + u._element.offsetHeight - i.height / 2;
            f = r.left;
            s = r.width;
            h = i.height / 2;
        }
        l.style.top = e + "px";
        l.style.left = f + "px";
        y(l, s - 8 + "px");
        v(l, h - 8 + "px");
        l.target = t;
        u._hideDockPreview();
        o(u._element, l);
      }
    };
    t._showDropTargets = function (t) {
      var k = this,
        u = n(t),
        r,
        i;
      if (u) {
        k._hideDropTargets();
        r = c("div");
        r.id = pi;
        nt(r, he);
        var a = !0,
          v = !0,
          y = !0,
          w = !0,
          e = !0,
          s = !0,
          h = !0,
          l = !0,
          d = f(t, et);
        d === pt && b(t, fr) && ((a = !1), (v = !1), (y = !1), (w = !1));
        u && u.children.length > 1
          ? u.flow === p
            ? ((e = !1), (s = !1))
            : ((h = !1), (l = !1))
          : ((e = !1), (s = !1), (h = !1), (l = !1));
        i = "";
        !0 && (i += '<div id="' + af + '" class="' + af + '"></div>');
        a && (i += '<div id="' + vf + '" class="' + vf + '"></div>');
        v && (i += '<div id="' + yf + '" class="' + yf + '"></div>');
        y && (i += '<div id="' + pf + '" class="' + pf + '"></div>');
        w && (i += '<div id="' + wf + '" class="' + wf + '"></div>');
        e && (i += '<div id="' + bf + '" class="' + bf + '"></div>');
        s && (i += '<div id="' + kf + '" class="' + kf + '"></div>');
        h && (i += '<div id="' + df + '" class="' + df + '"></div>');
        l && (i += '<div id="' + gf + '" class="' + gf + '"></div>');
        r.innerHTML = i;
        o(t, r);
      }
    };
    t._save = function (n) {
      var t = this;
      if (n) {
        t._saveImpl();
        return;
      }
      t._pendingSave ||
        ((t._pendingSave = !0),
        (t._delayedSaveTimeout = setTimeout(
          t._saveImpl.bind(this),
          t._SAVE_INTERVAL
        )));
    };
    t._saveImpl = function (n) {
      var t = this,
        r,
        f,
        u,
        o,
        i,
        e,
        s;
      if (!n) {
        for (r = [], f = t._element.children, u = 0, o = f.length; u < o; u++)
          (i = f[u]),
            b(i, st)
              ? r.push(t._serializeContainer(i))
              : b(i, lt) && r.push(t._serializePanel(i));
        e = this._findWorkspaceById(t._activeWorkspaceId);
        e && (e.data = r);
      }
      s = JSON.stringify(t._workspaceData);
      localStorage && localStorage.setItem(t._LOCAL_STORAGE_KEY, s);
      t._pendingSave = !1;
    };
    t._serializeContainer = function (n) {
      var o = this,
        s,
        i,
        r,
        u,
        e,
        f,
        t;
      for (
        s = b(n, at) ? p : ut,
          i = parseInt(ht(n).replace("%", "")),
          isNaN(i) && (i = 50),
          r = parseInt(vt(n).replace("%", "")),
          isNaN(r) && (r = 50),
          u = { nodeType: li, flow: s, height: i, width: r, children: [] },
          e = n.children,
          f = 0;
        f < e.length;
        f++
      )
        (t = e[f]),
          b(t, st)
            ? u.children.push(o._serializeContainer(t))
            : b(t, lt) && u.children.push(o._serializePanel(t));
      return u;
    };
    t._serializePanel = function (n) {
      var h = f(n, et),
        o = parseInt(ht(n).replace("%", "")),
        r,
        t,
        a,
        s,
        e;
      if (
        (isNaN(o) && (o = 50),
        (r = parseInt(vt(n).replace("%", ""))),
        isNaN(r) && (r = 50),
        (t = { nodeType: h, height: o, width: r }),
        h === pt)
      )
        (t.nodeType = pt),
          (t.title = i(n, "." + kt).textContent),
          (t.uri = f(i(n, "." + w), l));
      else
        for (
          t.nodeType = ft, a = [], s = u(n, "." + tt), t.children = [], e = 0;
          e < s.length;
          e++
        ) {
          var c = s[e],
            v = i(c, "." + kt).textContent,
            y = f(c, l),
            p = i(n, y),
            b = f(p, l);
          t.children.push({ title: v, uri: b });
        }
      return t;
    };
    t._setUserSetting = function (n, t) {
      var i = Wdp.Utils._workspaceManager,
        r = i._userSettings;
      r[n] = t;
      i._userSettings = r;
    };
    t._switchWorkspace = function (n) {
      var t = this,
        r = t._findWorkspaceById(n),
        i;
      r &&
        ((i = document.createEvent("Event")),
        i.initEvent("beforeunload", !0, !0),
        window.dispatchEvent(i),
        t._load(r),
        t._refreshNav());
      document.body.scrollTop !== 0 && (document.body.scrollTop = 0);
      $("." + kt)[0] ? $("." + kt)[0].focus() : $("#" + ef).focus();
    };
    t._testCollision = function (n, t, i) {
      return i && n >= i.left && n <= i.right && t >= i.top && t <= i.bottom
        ? !0
        : !1;
    };
    t._toggleShowHideNav = function () {
      var n = Wdp.Utils._workspaceManager,
        t = n._getUserSetting(n._USER_SETTING_SHOW_NAV),
        i;
      t = !t;
      t
        ? (d(document.body, gi),
          $("#" + wt)
            .attr("aria-label", "Hide list of workspaces")
            .attr("title", "Hide list of workspaces")
            .attr("aria-expanded", !0))
        : (e(document.body, gi),
          $("#" + wt)
            .attr("aria-label", "Show list of workspaces")
            .attr("title", "Show list of workspaces")
            .attr("aria-expanded", !1));
      i = document.createEvent("Event");
      i.initEvent("resize", !0, !0);
      window.dispatchEvent(i);
      n._setUserSetting(n._USER_SETTING_SHOW_NAV, t);
    };
    t._unRegisterGlobalEventListeners = function () {
      var n = this;
      g(window, "popstate", n._handlePostMessageBound);
      g(window, "mousemove", n._handleMouseMoveBound);
      g(window, "mouseover", n._handleMouseOverBound);
      g(window, "popstate", n._handleHashChangeBound);
    };
    Wdp.WorkspaceManager = tu;
    iu = function (n) {
      var t = this;
      t._element = n || c("div");
      t._element.wdpControl = this;
      t._refresh();
    };
    ar = iu.prototype;
    ar._handleClick = function (t) {
      var i = t.target,
        r = f(i, l),
        u,
        e;
      r || ((i = n(i)), (r = f(i, l)));
      u = n(n(i)).wdpControl;
      u && u._showOnlyVisibleTab(i, r);
      e = document.createEvent("Event");
      e.initEvent("resize", !0, !0);
      window.dispatchEvent(e);
    };
    ar._refresh = function (n, t) {
      for (var i = this, f = u(i._element, "." + tt), e = 0; e < f.length; e++)
        r(f[e], "click", i._handleClick, !1),
          r(
            f[e],
            "keypress",
            function (n) {
              n.key == "Enter" && i._handleClick(n);
            },
            !1
          );
      f.length && i._showOnlyVisibleTab(n, t);
    };
    ar._showOnlyVisibleTab = function (n, t) {
      for (
        var c, f, o, s = this, h = u(s._element, "." + w), r = 0;
        r < h.length;
        r++
      )
        k(h[r]);
      for (
        c = t ? i(s._element, t) : h[0],
          yt(c),
          f = u(s._element, "." + tt),
          n || (n = f[0]),
          r = 0;
        r < f.length;
        r++
      )
        (o = f[r]), o === n ? e(o, a) : d(o, a);
    };
    Wdp._MasterDetail = iu;
    re = (function () {
      function h(n, t) {
        var i = this;
        i._addRemoveToolBound = i._addRemoveTool.bind(this);
        i._closeBound = i._close.bind(this);
        i._element = n;
        i._element.wdpControl = this;
        i._extraCommands = t && t.extraSettings;
        i._handleMouseClickBound = i._handleMouseClick.bind(this);
        i._handleNavigateBound = i._handleNavigate.bind(this);
        i._handleSwitchWorkspaceBound = i._handleSwitchWorkspace.bind(this);
        i._handleWindowClickBound = i._handleWindowClick.bind(this);
        i._initialized = !1;
        i._menuPageState = 0;
        i._opened = !1;
        i._settingsCommandClickedBound = i._settingsCommandClicked.bind(this);
        i._tabOutOfMenuBound = i._tabOutOfMenu.bind(this);
        i._toggleMenuBound = i._toggleMenu.bind(this);
        i._tools = t && t.tools;
        e(i._element, au);
        i._menuButton = c("button");
        i._menuButton.id = tr;
        i._menuButton.title = "Options menu";
        i._menuButton.setAttribute("aria-expanded", !1);
        e(i._menuButton, tr);
        o(i._element, i._menuButton);
        r(i._menuButton, "click", i._toggleMenuBound, !1);
        r(window, "click", i._handleWindowClickBound, !1);
        r(
          i._menuButton,
          "keydown",
          function (n) {
            n.key == "Escape" &&
              (n.preventDefault(), n.stopPropagation(), i._closeBound());
          },
          !1
        );
        i._workspaceManager = t && t.workspaceManager;
        Wdp.Utils._menu = this;
      }
      var t = h.prototype;
      return (
        (t._addRemoveTool = function (t) {
          var i = this,
            r = t.target.tagName === "A" ? t.target : n(t.target),
            f = r.textContent,
            u = r.href.replace(location.origin, "");
          b(n(r), wr)
            ? i._workspaceManager._removeTool(u)
            : i._workspaceManager._addTool(f, u);
          t.preventDefault();
          i._close();
        }),
        (t._close = function () {
          var n = this;
          n._opened &&
            (k(n._menuContainer),
            d(n._element, a),
            n._menuButton.setAttribute("aria-expanded", !1),
            (n._opened = !1));
        }),
        (t._open = function () {
          var n = this,
            t;
          n._opened ||
            (n._initialized ? n._refresh() : (n._init(), (n._initialized = !0)),
            (t = document.createEvent("Event")),
            t.initEvent("beforeopen", !0, !0),
            n._element.dispatchEvent(t),
            yt(n._menuContainer),
            e(n._element, a),
            n._menuButton.setAttribute("aria-expanded", !0),
            (n._opened = !0));
        }),
        (t._dispose = function () {
          var t = this;
          g(window, "blur", t._closeBound);
          g(window, "hashchange", t._handleNavigateBound);
          s(n(t._element), t._element);
        }),
        (t._handleNavigate = function () {
          var t = this,
            i;
          t._menuPageState === 1
            ? t._menuPageState++
            : t._menuPageState === 2 &&
              ((i = document.getElementById(vi)),
              i &&
                (s(n(i), i),
                (document.getElementById("wdp-content").style.display =
                  "flex")),
              (t._menuPageState = 0));
        }),
        (t._init = function () {
          var n = this,
            a,
            l,
            s,
            h,
            t,
            f;
          if (
            ((n._menuContainer = c("nav")),
            (n._menuContainer.id = ve),
            k(n._menuContainer),
            (n._menuContainer.innerHTML =
              '<ul class="' +
              yi +
              '" role="presentation">  <li role="presentation"><a id="' +
              wu +
              '" href="menu/AddTool/AddTool.htm">Add tools to workspace</a></li>  <li role="presentation"><a id="' +
              gu +
              '" href="menu/newworkspace/newworkspace.htm">New workspace</a></li>  <li role="presentation"><a id="' +
              du +
              '" href="menu/importworkspace/importworkspace.htm">Import workspace</a></li>  <li role="presentation"><a id="' +
              bu +
              '" href="menu/exportworkspace/exportworkspace.htm">Export workspace</a></li>  <li role="presentation"><a id="' +
              nf +
              '" href="menu/renameworkspace/renameworkspace.htm">Rename workspace</a></li>  <li role="presentation"><a id="' +
              ku +
              '" href="menu/deleteworkspace/deleteworkspace.htm">Delete workspace</a></li>  <li role="presentation"><a id="' +
              tf +
              '" href="menu/resetworkspace/resetworkspace.htm">Reset layout</a></li></ul>'),
            o(n._element, n._menuContainer),
            (n._addToolWorkspaceButton = i(n._element, "#" + wu)),
            (n._newWorkspaceButton = i(n._element, "#" + gu)),
            (n._importWorkspaceButton = i(n._element, "#" + du)),
            (n._exportWorkspaceButton = i(n._element, "#" + bu)),
            (n._renameWorkspaceButton = i(n._element, "#" + nf)),
            (n._resetWorkspaceButton = i(n._element, "#" + tf)),
            (n._deleteWorkspaceButton = i(n._element, "#" + ku)),
            n._refresh(),
            (a = i(n._element, "." + yi)),
            n._extraCommands)
          )
            for (t = 0, f = n._extraCommands.length; t < f; t++)
              (l = c("li")),
                (l.innerHTML =
                  '<a href="' +
                  n._extraCommands[t].uri +
                  '">' +
                  n._extraCommands[t].name +
                  "</a>"),
                o(a, l);
          for (
            s = u(n._element, "." + yi + " a"), t = 0, f = s.length;
            t < f;
            t++
          )
            r(s[t], "click", n._settingsCommandClickedBound, !1),
              r(
                s[t],
                "keydown",
                function (t) {
                  t.key == "Escape" &&
                    (document.getElementById(tr).focus(), n._closeBound());
                },
                !1
              );
          for (h = u(n._element, "li"), t = 0, f = h.length; t < f; t++)
            i(h[t], "ul") && e(h[t], pe);
          r(window, "blur", n._closeBound, !1);
          r(window, "hashchange", n._handleNavigateBound, !1);
        }),
        (t._handleMouseClick = function (n) {
          var i = this,
            t = n.target;
          this._showSubMenu(t);
        }),
        (t._handleSwitchWorkspace = function (n) {
          var t = this,
            i = f(n.target, wi);
          t._workspaceManager._switchWorkspace(i);
          n.preventDefault();
          t._close();
        }),
        (t._handleWindowClick = function (n) {
          var t = this;
          t._element.contains(n.target) || t._close();
        }),
        (t._refresh = function () {
          var t = this,
            i,
            n,
            f;
          for (
            t._refreshWorkspaceSettings(),
              i = u(t._element, "a"),
              n = 0,
              f = i.length;
            n < f;
            n++
          )
            r(i[n], "click", t._handleMouseClickBound, !1);
        }),
        (t._refreshTools = function () {
          var o = this,
            g,
            nt,
            a,
            tt,
            v,
            it,
            c,
            b,
            rt,
            t,
            h,
            k,
            ut,
            s,
            p,
            et;
          if (o._tools) {
            var ft = i(o._element, "#" + yu),
              y = "",
              a = !1;
            for (t = 0, h = o._tools.length; t < h; t++) {
              if (((c = o._tools[t]), c.group)) {
                a = !0;
                break;
              }
              y +=
                '<li><a href="' +
                c.uri +
                '"><span class="' +
                lu +
                '"></span><span class="' +
                vu +
                '">' +
                c.name +
                "</span></a></li>";
            }
            if (a) {
              for (
                g = "Other",
                  nt = !1,
                  y = "",
                  a = [],
                  t = 0,
                  h = o._tools.length;
                t < h;
                t++
              )
                if (((v = o._tools[t].group), v)) {
                  for (tt = !1, s = 0, p = a.length; s < p; s++)
                    if (v === a[s]) {
                      tt = !0;
                      break;
                    }
                  tt || a.push(v);
                } else (o._tools[t].group = g), (nt = !0);
              for (nt && a.push(g), t = 0, h = a.length; t < h; t++) {
                for (
                  v = a[t],
                    y +=
                      '<div class="' +
                      le +
                      '"><div class="' +
                      ae +
                      '">' +
                      v +
                      "</div>",
                    s = 0,
                    p = o._tools.length;
                  s < p;
                  s++
                )
                  (c = o._tools[s]),
                    c.group === v &&
                      (y +=
                        '<li><a href="' +
                        c.uri +
                        '"><span class="' +
                        lu +
                        '"></span><span class="' +
                        vu +
                        '">' +
                        c.name +
                        "</span></a></li>");
                y += "</div>";
              }
            }
            for (
              ft.innerHTML = y, it = u(ft, "a"), t = 0, h = it.length;
              t < h;
              t++
            )
              (c = it[t]), r(c, "click", o._addRemoveToolBound, !1);
            for (
              b = u(o._workspaceManager._element, "." + w),
                rt = u(o._element, "#" + yu + " a"),
                t = 0,
                h = rt.length;
              t < h;
              t++
            ) {
              for (k = rt[t], ut = !1, s = 0, p = b.length; s < p; s++)
                if (
                  ((et = k.href.replace(location.origin, "")),
                  f(b[s], l).replace("/ws/", "") === et.replace("/ws/", ""))
                ) {
                  ut = !0;
                  break;
                }
              b.length && ut ? e(n(k), wr) : d(n(k), wr);
            }
          }
        }),
        (t._refreshWorkspaces = function () {
          var t = this,
            f,
            o,
            s,
            h,
            c,
            n,
            e;
          if (t._workspaceManager && t._workspaceManager._workspaceData) {
            for (
              f = t._workspaceManager._workspaceData.workspaces,
                o = i(t._element, "#" + pu),
                $(o).empty(),
                s = "",
                h = "",
                n = 0,
                e = f.length;
              n < e;
              n++
            )
              (h =
                f[n].id === t._workspaceManager._activeWorkspaceId
                  ? 'class="' + a + '"'
                  : ""),
                (s +=
                  "<li " +
                  h +
                  '><a href="#' +
                  f[n].id +
                  '" ' +
                  wi +
                  '="' +
                  f[n].id +
                  '">' +
                  f[n].name +
                  "</a></li>");
            for (
              o.innerHTML = s,
                c = u(t._element, "#" + pu + " a"),
                n = 0,
                e = c.length;
              n < e;
              n++
            )
              r(c[n], "click", t._handleSwitchWorkspaceBound, !1);
          }
        }),
        (t._tabOutOfMenu = function (n) {
          if (n.key == "Tab" && !n.shiftKey && !n.altKey && !n.ctrlKey) {
            var t = this;
            document.getElementById(tr).focus();
            t._toggleMenuBound();
          }
        }),
        (t._refreshWorkspaceSettings = function () {
          var t = this,
            i;
          t._workspaceManager &&
            (i = t._workspaceManager._findWorkspaceById(
              t._workspaceManager._activeWorkspaceId
            ));
          i
            ? i.editable
              ? (yt(n(t._renameWorkspaceButton)),
                yt(n(t._deleteWorkspaceButton)),
                k(n(t._resetWorkspaceButton)),
                g(t._addToolWorkspaceButton, "keydown", t._tabOutOfMenuBound),
                r(
                  t._deleteWorkspaceButton,
                  "keydown",
                  t._tabOutOfMenuBound,
                  !1
                ),
                g(t._resetWorkspaceButton, "keydown", t._tabOutOfMenuBound))
              : (k(n(t._renameWorkspaceButton)),
                k(n(t._deleteWorkspaceButton)),
                yt(n(t._resetWorkspaceButton)),
                g(t._addToolWorkspaceButton, "keydown", t._tabOutOfMenuBound),
                g(t._deleteWorkspaceButton, "keydown", t._tabOutOfMenuBound),
                r(t._resetWorkspaceButton, "keydown", t._tabOutOfMenuBound, !1))
            : (k(n(t._newWorkspaceButton)),
              k(n(t._importWorkspaceButton)),
              k(n(t._exportWorkspaceButton)),
              k(n(t._renameWorkspaceButton)),
              k(n(t._deleteWorkspaceButton)),
              k(n(t._resetWorkspaceButton)),
              r(t._addToolWorkspaceButton, "keydown", t._tabOutOfMenuBound, !1),
              g(t._deleteWorkspaceButton, "keydown", t._tabOutOfMenuBound),
              g(t._resetWorkspaceButton, "keydown", t._tabOutOfMenuBound));
        }),
        (t._settingsCommandClicked = function (t) {
          var u = this,
            h = t.target.textContent,
            l = t.target.href,
            a = f(t.target, we),
            e,
            r,
            v;
          a
            ? eval(a)
            : l &&
              ((e = encodeURIComponent(h)),
              location.hash != "#" + e &&
                ((r = document.getElementById(vi)),
                r &&
                  (s(n(r), r),
                  (document.getElementById("wdp-content").style.display =
                    "flex")),
                (u._menuPageState = 0),
                (r = c("div")),
                (r.id = vi),
                r.setAttribute("tabindex", "0"),
                nt(r, vi),
                $(r).load(l),
                o(document.body, r),
                (document.getElementById("wdp-content").style.display = "none"),
                (location.hash = e),
                window.DeviceSettings &&
                  window.DeviceSettings.DeviceLabel &&
                  ((location.title =
                    h +
                    " - " +
                    window.DeviceSettings.DeviceLabel +
                    " Device Portal"),
                  (v = i(document, "#wdp-titlelabel")),
                  (v.textContent = location.title)),
                (u._menuPageState = 1)));
          u._close();
          t.preventDefault();
          t.stopPropagation();
        }),
        (t._showSubMenu = function (t) {
          var h = this,
            c = n(t),
            s = i(c, "ul"),
            f = u(h._element, "li ul"),
            r,
            o;
          if (s) {
            for (r = 0, o = f.length; r < o; r++) k(f[r]), d(n(f[r]), a);
            yt(s);
            e(n(s), a);
          } else
            for (r = 0, o = f.length; r < o; r++)
              f[r].style.display !== "block" ||
                f[r].contains(t) ||
                (k(f[r]), d(n(f[r]), a));
        }),
        (t._toggleMenu = function () {
          var n = this;
          n._opened ? n._close() : n._open();
        }),
        h
      );
    })();
    Wdp.Menu = re;
    ue = (function () {
      function t() {
        var n = this;
        ((n._closeBound = n._close.bind(this)),
        (n._element = document.getElementById("wdp-powermenu")),
        n._element) &&
          ((n._handleWindowClickBound = n._handleWindowClick.bind(this)),
          (n._initialized = !1),
          (n._opened = !1),
          (n._settingsCommandClickedBound =
            n._settingsCommandClicked.bind(this)),
          (n._shiftTabOutOfMenuBound = n._shiftTabOutOfMenu.bind(this)),
          (n._tabOutOfMenuBound = n._tabOutOfMenu.bind(this)),
          (n._toggleMenuBound = n._toggleMenu.bind(this)),
          e(n._element, au),
          (n._menuButton = c("button")),
          (n._menuButton.id = ur),
          (n._menuButton.title = "Power options menu"),
          (n._menuButton.textContent = "Power"),
          e(n._menuButton, ur),
          o(n._element, n._menuButton),
          r(n._menuButton, "click", n._toggleMenuBound, !1),
          r(window, "click", n._handleWindowClickBound, !1),
          r(
            n._menuButton,
            "keydown",
            function (t) {
              t.key == "Escape" &&
                (t.preventDefault(), t.stopPropagation(), n._closeBound());
            },
            !1
          ),
          (Wdp.Utils._powermenu = this));
      }
      var n = t.prototype;
      return (
        (n._toggleMenu = function () {
          var n = this;
          n._opened ? n._close() : n._open();
        }),
        (n._close = function () {
          var n = this;
          n._opened &&
            (k(n._menuContainer), d(n._element, a), (n._opened = !1));
        }),
        (n._open = function () {
          var n = this,
            t;
          n._opened ||
            (n._initialized || (n._init(), (n._initialized = !0)),
            (t = document.createEvent("Event")),
            t.initEvent("beforeopen", !0, !0),
            n._element.dispatchEvent(t),
            yt(n._menuContainer),
            e(n._element, a),
            (n._opened = !0));
        }),
        (n._init = function () {
          var n = this,
            f,
            t,
            e;
          for (
            n._menuContainer = c("nav"),
              n._menuContainer.id = ye,
              k(n._menuContainer),
              n._menuContainer.innerHTML =
                '<ul class="' +
                yi +
                '" role="presentation">  <li role="presentation"><a id="' +
                rf +
                '" data-click="wdpRestart()" href="#" role="button">Restart</a></li>  <li role="presentation"><a id="' +
                uf +
                '" data-click="wdpShutdown()" href="#" role="button">Shutdown</a></li></ul>',
              o(n._element, n._menuContainer),
              n._restartButton = i(n._element, "#" + rf),
              n._shutdownButton = i(n._element, "#" + uf),
              f = u(n._element, "." + yi + " a"),
              t = 0,
              e = f.length;
            t < e;
            t++
          )
            r(f[t], "click", n._settingsCommandClickedBound, !1),
              r(
                f[t],
                "keydown",
                function (t) {
                  t.key == "Escape" &&
                    (document.getElementById(ur).focus(), n._closeBound());
                },
                !1
              );
          r(n._menuButton, "keydown", n._shiftTabOutOfMenuBound, !1);
          r(n._shutdownButton, "keydown", n._tabOutOfMenuBound, !1);
          r(window, "blur", n._closeBound, !1);
        }),
        (n._handleWindowClick = function (n) {
          var t = this;
          t._element.contains(n.target) || t._close();
        }),
        (n._settingsCommandClicked = function (n) {
          var i = this,
            r = n.target.textContent,
            u = n.target.href,
            t = f(n.target, "data-click");
          t && eval(t);
          i._close();
          n.preventDefault();
          n.stopPropagation();
        }),
        (n._shiftTabOutOfMenu = function (n) {
          if (n.key == "Tab" && n.shiftKey && !n.altKey && !n.ctrlKey) {
            var t = this;
            t._close();
          }
        }),
        (n._tabOutOfMenu = function (n) {
          if (n.key == "Tab" && !n.shiftKey && !n.altKey && !n.ctrlKey) {
            var t = this;
            document.getElementById(ur).focus();
            t._close();
          }
        }),
        t
      );
    })();
    Wdp.PowerMenu = ue;
    fe = (function () {
      function i(n, t) {
        var i = this;
        i._domInitialized = !1;
        i._element = n || c("div");
        i._elementInitialized = !1;
        i._fader;
        i._handleKeyUpBound = i._handleKeyUp.bind(this);
        i._open = !1;
        i._element.wdpControl = this;
        t && t.html && (i._html = t.html);
        r(i._element, "keyup", i._handleKeyUpBound, !1);
      }
      var t = i.prototype;
      return (
        (t._dispose = function () {
          var t = this;
          t._disposed ||
            ((t._disposed = !0),
            n(t._fader) && s(n(t._fader), t._fader),
            t._element && s(n(t._element), t._element));
        }),
        (t._handleKeyUp = function (n) {
          var t = this;
          n.keyCode === ee && t._hide();
        }),
        (t._hide = function () {
          var t = this;
          t._element && n(t._element) && s(n(t._element), t._element);
          t._hideFader();
          t._open = !1;
        }),
        (t._hideFader = function () {
          var t = this;
          t._fader && n(t._fader) && s(n(t._fader), t._fader);
        }),
        (t._hideVisibleOverlays = function () {
          for (
            var n, i = u(document.body, "." + er), t = 0, r = i.length;
            t < r;
            t++
          )
            (n = i[t]),
              n && n.wdpControl && n.wdpControl._open && n.wdpControl._hide();
        }),
        (t._show = function (n) {
          var t = this;
          t._hideVisibleOverlays();
          t._elementInitialized ||
            ((t._element.id = er),
            e(t._element, er),
            (t._elementInitialized = !0));
          t._showFader();
          t._element.innerHTML = t._html;
          o(document.body, t._element);
          t._findPosition(n);
          t._open = !0;
        }),
        (t._findPosition = function (n) {
          if (n) {
            var o = this,
              r = this._element.getBoundingClientRect(),
              u = n.getBoundingClientRect(),
              f = document.body.offsetHeight,
              e = document.body.offsetWidth,
              t = u.bottom,
              i = u.left;
            t + r.height > f ? (t = f - r.height) : t < 0 && (t = 0);
            i + r.width > e ? (i = e - r.width) : i < 0 && (i = 0);
            this._element.style.top = t + "px";
            this._element.style.left = i + "px";
          }
        }),
        (t._showFader = function () {
          var n = this;
          n._fader ||
            ((n._fader = c("div")),
            (n._fader.id = ou),
            nt(n._fader, ou),
            r(n._fader, "click", n._hide.bind(this), !1));
          o(document.body, n._fader);
        }),
        i
      );
    })();
    Wdp._Overlay = fe;
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        function f(n) {
          document.getElementById("wdp-alert").innerHTML = n;
          $("body").toggleClass("showAlert");
        }
        function e() {
          if (!navigator.cookieEnabled) return !1;
          return (
            "cookie" in document &&
            (document.cookie.length > 0 ||
              (document.cookie = "test=1").indexOf.call(
                document.cookie,
                "test"
              ) > -1)
          );
        }
        var i, r;
        getSystemPowerInformation();
        var u = document.getElementById("wdp-skipnavmaincontent"),
          n = document.getElementById("webbHelp"),
          t = document.getElementById("feedback"),
          h = new Wdp.PowerMenu();
        u &&
          u.addEventListener(
            "keypress",
            function (n) {
              if (n.key == "Enter") {
                var t = document.getElementById(vi);
                t ||
                  (t = document
                    .getElementById("wdp-content")
                    .querySelector("." + kt));
                t || (t = document.getElementById("wdp-noworkspaces-text"));
                t.focus();
              }
            },
            !1
          );
        n &&
          t &&
          window.DeviceSettings &&
          window.DeviceSettings.DeviceLabel &&
          ((document.title =
            window.DeviceSettings.DeviceLabel + " Device Portal"),
          (i =
            "https://go.microsoft.com/fwlink/?LinkID=" +
            window.DeviceSettings.HelpLinkID),
          (n.title = i),
          n.addEventListener("click", function () {
            window.open(i);
          }),
          (r =
            "https://go.microsoft.com/fwlink/?LinkID=" +
            window.DeviceSettings.FeedbackLinkID),
          (t.title = r),
          t.addEventListener("click", function () {
            window.open(r);
          }));
        e() ||
          f(
            "Cookies are required for this site.  Some features may not be available."
          );
      },
      !1
    );
  })();
