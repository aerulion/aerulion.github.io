// snapshot of src/scripts/mark-geometry.ts
var SILHOUETTE = "M25.8564 20.7846 22.641 22.641 18.9282 16.2102 13.8564 19.1384 12 18.0666 13.8564 14.8512 17.0717 12.9948 13.8564 7.4256 6.9282 19.4256 13.8564 23.4256 17.5692 21.282 19.4256 24.4974 13.8564 27.7128 1.8564 20.7846 13.8564 0Z";
var LOGO_OUTLINE = [
  [25.856406, 20.78461],
  [22.641016, 22.641016],
  [18.928203, 16.210236],
  [13.856406, 19.138439],
  [12, 18.066642],
  [13.856406, 14.851252],
  [17.071797, 12.994845],
  [13.856406, 7.425626],
  [6.928203, 19.425626],
  [13.856406, 23.425626],
  [17.569219, 21.282032],
  [19.425626, 24.497423],
  [13.856406, 27.712813],
  [1.856406, 20.78461],
  [13.856406, 0]
];
var TAU = Math.PI * 2;
var DEG = Math.PI / 180;
var ROOT2 = Math.SQRT2;
var ROOT3 = Math.sqrt(3);
var AXIS_ANGLES = [30, 60, 120, 150];
var AXES = AXIS_ANGLES.map((a) => [Math.cos(a * DEG), Math.sin(a * DEG)]);
var dot4 = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
var F1 = AXES.map((g) => g[0] / ROOT2);
var F2 = AXES.map((g) => g[1] / ROOT2);
var F3 = [1, -ROOT3, ROOT3, -1].map((v) => v / (2 * ROOT2));
var F4 = [ROOT3, -1, -1, ROOT3].map((v) => v / (2 * ROOT2));
var classify = (ax, ay, bx, by) => {
  let axis = 0;
  let span = 0;
  let best = Infinity;
  const dx = bx - ax;
  const dy = by - ay;
  AXES.forEach((g, i) => {
    const t = dx * g[0] + dy * g[1];
    const err = Math.hypot(dx - t * g[0], dy - t * g[1]);
    if (err < best) {
      best = err;
      axis = i;
      span = t;
    }
  });
  return [axis, span];
};
var lift = () => {
  const steps = LOGO_OUTLINE.map((p, i) => {
    const q = LOGO_OUTLINE[(i + 1) % LOGO_OUTLINE.length];
    return classify(p[0], p[1], q[0], q[1]);
  });
  const drift = [0, 0, 0, 0];
  let arc = 0;
  for (const [axis, span] of steps) {
    drift[axis] += span;
    arc += Math.abs(span);
  }
  const out = [];
  let cursor = [0, 0, 0, 0];
  for (const [axis, span] of steps) {
    out.push(cursor);
    const share = Math.abs(span) / arc;
    const next = cursor.slice();
    next[axis] += span;
    for (let j = 0;j < 4; j++)
      next[j] -= drift[j] * share;
    cursor = next;
  }
  return out;
};
var rmsOf = (pts) => Math.sqrt(pts.reduce((s, p) => s + p[0] * p[0] + p[1] * p[1], 0) / pts.length);
var build = () => {
  const raw = lift();
  const mid = [0, 1, 2, 3].map((j) => raw.reduce((s, v) => s + v[j], 0) / raw.length);
  const centred = raw.map((v) => v.map((x, j) => x - mid[j]));
  const visible = centred.map((v) => [dot4(v, F1) * ROOT2, dot4(v, F2) * ROOT2]);
  const perp = centred.map((v) => [dot4(v, F3) * ROOT2, dot4(v, F4) * ROOT2]);
  const k = rmsOf(visible) / rmsOf(perp);
  return {
    visible,
    perp: perp.map((p) => [p[0] * k, p[1] * k]),
    radius: rmsOf(visible)
  };
};
var LIFT = build();
var LOGO_RADIUS = LIFT.radius;
var LOGO_CENTRE = [
  LOGO_OUTLINE.reduce((s, p) => s + p[0], 0) / LOGO_OUTLINE.length,
  LOGO_OUTLINE.reduce((s, p) => s + p[1], 0) / LOGO_OUTLINE.length
];
var UNFOLD_DEFAULTS = {
  depth: 0.4,
  shells: 2,
  precess: -1,
  anomaly: 0.14,
  phase: 0,
  fan: 0
};
var unfold = (angle, options = UNFOLD_DEFAULTS) => {
  const { depth, shells, precess, anomaly, phase, fan } = options;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const cg = Math.cos(angle);
  const sg = Math.sin(angle);
  const psi = angle * precess + phase;
  const step = depth * LOGO_RADIUS / shells;
  const dir = [Math.cos(psi), Math.sin(psi)];
  const shift = (s) => {
    const x = -s * dir[0] * sa;
    const y = -s * dir[1] * sa;
    return [x * cg - y * sg, x * sg + y * cg];
  };
  const cf = Math.cos(fan);
  const sf = Math.sin(fan);
  const base = LIFT.visible.map((z, i) => {
    const u = LIFT.perp[i];
    const u0 = u[0] * cf - u[1] * sf;
    const u1 = u[0] * sf + u[1] * cf;
    const x = z[0] * ca - (-z[1] + anomaly * u0) * sa;
    const y = z[1] * ca - (z[0] + anomaly * u1) * sa;
    return [LOGO_CENTRE[0] + x * cg - y * sg, LOGO_CENTRE[1] + x * sg + y * cg];
  });
  const out = [];
  for (let j = 1;j <= shells; j++) {
    out.push({ offset: shift(j * step), level: j / shells });
    out.push({ offset: shift(-j * step), level: j / shells });
  }
  return { base, shells: out, span: shift(shells * step), spread: Math.abs(sa) };
};
var TAN30 = 0.5773502692;
var FAR = 60;
var INK_REST = 7.388;
var INK_TRAVEL = 31;
var INK_POLY = [
  [-FAR, INK_REST + FAR * TAN30],
  [FAR, INK_REST - FAR * TAN30],
  [FAR, FAR * 1.5],
  [-FAR, FAR * 1.5]
];
var BARE_FRAME = "M-200 -200H200V200H-200Z";
var inkPoints = () => INK_POLY.map((p) => `${p[0]},${Number(p[1].toFixed(4))}`).join(" ");
var barePath = (dy) => `${BARE_FRAME}M${INK_POLY.map(([x, y]) => `${x} ${(y + dy).toFixed(3)}`).join("L")}Z`;
var glide = (u) => u * u * u * (u * (u * 6 - 15) + 10);
var snap = (u) => 1 - (1 - u) ** 3;
var BACK = 1.70158;
var recoil = (u) => {
  const v = u - 1;
  return 1 + (BACK + 1) * v * v * v + BACK * v * v;
};
var EASES = { glide, snap, recoil };
var EASE_BAG = ["snap", "snap", "recoil", "glide"];
var HALF = Math.PI;
var QUARTER = Math.PI / 2;
var PEAK_JITTER = 0.14 * Math.PI;
var FAN_DRIFT = 0.32;
var EPISODE_DEFAULTS = {
  rest: [7, 15],
  arcs: [2, 4],
  strike: [0.5, 0.8],
  fanned: [1.5, 3],
  flat: [0.35, 0.7],
  settle: [1, 1.8],
  lead: 0.9
};
var moveLength = (move) => move.strike + move.hold;
var arcLength = (arc) => moveLength(arc.out) + moveLength(arc.back);
var planEpisode = (rand, shape = EPISODE_DEFAULTS) => {
  const between = ([lo, hi]) => lo + rand() * (hi - lo);
  const pick = () => EASE_BAG[Math.min(EASE_BAG.length - 1, Math.floor(rand() * EASE_BAG.length))];
  const count = Math.round(between(shape.arcs));
  const arcs = [];
  let span = 0;
  let fan = rand() * TAU;
  for (let i = 0;i < count; i++) {
    const arc = {
      fan,
      phase: rand() * TAU,
      reach: 0.8 + rand() * 0.45,
      dir: rand() < 0.5 ? -1 : 1,
      peak: QUARTER + (rand() - 0.5) * 2 * PEAK_JITTER,
      out: { strike: between(shape.strike), hold: between(shape.fanned), ease: pick() },
      back: {
        strike: between(shape.strike),
        hold: between(i === count - 1 ? shape.settle : shape.flat),
        ease: pick()
      }
    };
    arcs.push(arc);
    span += arcLength(arc);
    fan = (fan + QUARTER + rand() * HALF) % TAU;
  }
  return { rest: between(shape.rest), span, arcs };
};
var episodeLength = (episode, lead) => episode.rest + 2 * lead + episode.span;
var pose = (arc, angle, ink, drift = 0) => ({
  angle,
  phase: arc.phase + drift,
  reach: arc.reach,
  fan: arc.fan + drift,
  ink: ink < 0 ? 0 : ink > 1 ? 1 : ink
});
var episodeBeat = (episode, time, lead) => {
  const { arcs } = episode;
  const first = arcs[0];
  if (time <= episode.rest)
    return pose(first, 0, 0);
  const opening = time - episode.rest;
  if (opening < lead)
    return pose(first, 0, glide(opening / lead));
  let cursor = opening - lead;
  let angle = 0;
  for (const arc of arcs) {
    const span = arcLength(arc);
    if (cursor < span) {
      const peak = arc.dir * arc.peak;
      const close = arc.dir * HALF;
      const drift = cursor * FAN_DRIFT;
      let step = cursor;
      if (step < arc.out.strike) {
        return pose(arc, angle + peak * EASES[arc.out.ease](step / arc.out.strike), 1, drift);
      }
      step -= arc.out.strike;
      if (step < arc.out.hold)
        return pose(arc, angle + peak, 1, drift);
      step -= arc.out.hold;
      if (step < arc.back.strike) {
        const u = EASES[arc.back.ease](step / arc.back.strike);
        return pose(arc, angle + peak + (close - peak) * u, 1, drift);
      }
      return pose(arc, angle + close, 1, drift);
    }
    cursor -= span;
    angle += arc.dir * HALF;
  }
  const tail = arcs[arcs.length - 1];
  if (cursor < lead)
    return pose(tail, angle, 1 - glide(cursor / lead));
  return pose(tail, angle, 0);
};
var toPath = (pts) => `M${pts.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join("L")}Z`;
var ladderPath = (frame) => {
  const [sx, sy] = frame.span;
  let d = "";
  for (const [x, y] of frame.base) {
    d += `M${(x - sx).toFixed(3)} ${(y - sy).toFixed(3)}L${(x + sx).toFixed(3)} ${(y + sy).toFixed(3)}`;
  }
  return d;
};
export {
  unfold,
  toPath,
  planEpisode,
  ladderPath,
  inkPoints,
  episodeLength,
  episodeBeat,
  barePath,
  arcLength,
  UNFOLD_DEFAULTS,
  SILHOUETTE,
  INK_TRAVEL,
  INK_REST,
  EPISODE_DEFAULTS,
  EASES
};
