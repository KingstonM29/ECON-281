/* Preference engine used by the Chapter 4 graphs (and reusable later).
   A "model" is just its MRS field m(x, y) = MU_X / MU_Y. Indifference curves are traced by
   following dy/dx = −m(x, y), and optimal bundles are found where MRS = P_X / P_Y on the budget line.
   This lets one set of code draw normal, inferior and Giffen goods with non-crossing curves. */
window.Econ = (function () {
  // Cobb–Douglas U = x^a y^(1−a): both goods normal.
  const cd = (a) => ({ a, m: (x, y) => (x <= 0 ? Infinity : (a * y) / ((1 - a) * x)) });
  // m = K / (x^j (y+B)^k): X is inferior (MRS falls as Y rises). With large k, X can be a Giffen good.
  const power = (K, j, k, B = 0) => ({ m: (x, y) => (x <= 0 ? Infinity : K / (Math.pow(x, j) * Math.pow(Math.max(y + B, 1e-9), k))) });
  // Quasi-linear U = f(x) + y with f'(x) = c0 − c1·x: no income effect on X.
  const quasi = (c0, c1) => ({ m: (x) => Math.max(c0 - c1 * x, 1e-6) });

  // Utility-maximizing bundle on the budget line P_X x + P_Y y = I.
  function optimum(model, px, py, I, N = 700) {
    const p = px / py, X = I / px;
    let prev = null;
    for (let i = 1; i < N; i++) {
      const x = (X * i) / N, s = model.m(x, (I - px * x) / py) - p;
      if (prev != null && prev > 0 && s <= 0) {
        let lo = (X * (i - 1)) / N, hi = x;
        for (let t = 0; t < 50; t++) { const mid = (lo + hi) / 2; if (model.m(mid, (I - px * mid) / py) - p > 0) lo = mid; else hi = mid; }
        const x0 = (lo + hi) / 2;
        return [x0, (I - px * x0) / py];
      }
      prev = s;
    }
    return prev > 0 ? [X, 0] : [0, I / py];
  }

  // Points on the indifference curve through (x0, y0), from xmin to xmax, stopping above ycap.
  function ic(model, x0, y0, xmin, xmax, ycap) {
    const f = (x, y) => -model.m(x, y);
    const walk = (to, n) => {
      const pts = [];
      let x = x0, y = y0, prevM = model.m(x0, y0);
      const h = (to - x0) / n;
      for (let i = 0; i < n; i++) {
        const k1 = f(x, y), k2 = f(x + h / 2, y + (h / 2) * k1), k3 = f(x + h / 2, y + (h / 2) * k2), k4 = f(x + h, y + h * k3);
        y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4); x += h;
        if (!isFinite(y) || y > ycap || y < -ycap * 0.05) { if (isFinite(y)) pts.push([x, Math.min(y, ycap)]); break; }
        // Stop where the curve would stop being convex (MRS must fall moving right, rise moving left).
        const mNow = model.m(x, y);
        if (h > 0 ? mNow > prevM * 1.0005 : mNow < prevM * 0.9995) break;
        prevM = mNow;
        pts.push([x, y]);
      }
      return pts;
    };
    const left = x0 > xmin ? walk(xmin, 500).reverse() : [];
    const right = x0 < xmax ? walk(xmax, 300) : [];
    return [...left, [x0, y0], ...right];
  }

  // On a traced indifference curve, the bundle where MRS equals slope p (the decomposition bundle D).
  function tangentOn(model, pts, p) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if (a[1] < 0 || b[1] < 0) continue;
      const ma = model.m(a[0], a[1]) - p, mb = model.m(b[0], b[1]) - p;
      if (ma > 0 && mb <= 0) { const t = ma / (ma - mb); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    }
    return null;
  }

  // Substitution / income decomposition of a change in P_X from px0 to px1.
  function decompose(model, px0, px1, py, I, xmax, ycap) {
    const A = optimum(model, px0, py, I), B = optimum(model, px1, py, I);
    const pts = ic(model, A[0], A[1], xmax / 500, xmax, ycap);
    const D = tangentOn(model, pts, px1 / py) || A;
    return { A, B, D, icA: pts, se: D[0] - A[0], ie: B[0] - D[0], total: B[0] - A[0] };
  }

  const engel = (model, px, py, I0, I1, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const I = I0 + ((I1 - I0) * i) / n; return [optimum(model, px, py, I)[0], I]; });
  const demand = (model, py, I, p0, p1, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const P = p0 + ((p1 - p0) * i) / n; return [optimum(model, P, py, I)[0], P]; });

  return { cd, power, quasi, optimum, ic, tangentOn, decompose, engel, demand };
})();
