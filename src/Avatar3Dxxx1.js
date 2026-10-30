import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* Your 3D model (public/avatar.glb) wearing four outfits that swap as you scroll:
   0 dress (designer) · 1 climbing gear · 2 scuba gear · 3 jorts + camera.
   Hair and clothes are built in code and fitted to the model's body (model units, scaled by SCALE). */
const MODEL_URL = `${process.env.PUBLIC_URL || ""}/avatar.glb`;
const SCALE = 3.2 / 10.5;
const HC = [0, 9.28, 0.175], HR = [0.7, 0.99, 0.775]; // head centre + radii (model units)

const gm = new THREE.DataTexture(new Uint8Array([105, 165, 220, 255]), 4, 1, THREE.RedFormat); gm.minFilter = gm.magFilter = THREE.NearestFilter; gm.needsUpdate = true;
const NO_OUTLINE = { outlineParameters: { visible: false } };
const toon = (color, o = {}) => new THREE.MeshToonMaterial({ color, gradientMap: gm, ...o });
const cloth = (color, o = {}) => toon(color, { side: THREE.DoubleSide, ...o });
const basic = (color, o = {}) => new THREE.MeshBasicMaterial({ color, ...o, userData: NO_OUTLINE });
const metal = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.8 });
const mesh = (geo, mat, pos = [0, 0, 0], scale = [1, 1, 1]) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.scale.set(...scale); return m; };
const lathe = (pts, mat, sz = 1) => { const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 64), mat); m.scale.z = sz; return m; };
const cyl = (rt, rb, h, mat, pos) => mesh(new THREE.CylinderGeometry(rt, rb, h, 32), mat, pos);
const ring = (r, tube, mat, pos, sc = [1, 0.85, 1]) => { const m = mesh(new THREE.TorusGeometry(r, tube, 12, 64), mat, pos, sc); m.rotation.x = Math.PI / 2; return m; };
const tube = (pts, r, mat) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 48, r, 10), mat);

/* a flattened, tapered, pointed hair lock that follows a curve */
function clump(pts, w0, outward) {
  const seg = 40, rad = 14, curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.5);
  const pos = [], idx = [], P = new THREE.Vector3(), T = new THREE.Vector3(), O = new THREE.Vector3(), W = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const t = i / seg; curve.getPointAt(t, P); curve.getTangentAt(t, T);
    outward(P, O); O.addScaledVector(T, -O.dot(T)).normalize(); W.crossVectors(T, O).normalize();
    const w = w0 * Math.pow(1 - t, 0.5) * (0.7 + 0.3 * Math.min(1, t * 4)), h = w * 0.7;
    for (let j = 0; j < rad; j++) { const a = (j / rad) * Math.PI * 2, c = Math.cos(a) * w, d = Math.sin(a) * h; pos.push(P.x + W.x * c + O.x * d, P.y + W.y * c + O.y * d, P.z + W.z * c + O.z * d); }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) { const a = i * rad + j, b = i * rad + ((j + 1) % rad), c = (i + 1) * rad + j, d = (i + 1) * rad + ((j + 1) % rad); idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}

function buildAvatar(gltf) {
  const model = gltf.scene, rig = new THREE.Group(), root = new THREE.Group(); root.add(rig); rig.scale.setScalar(SCALE);
  model.updateMatrixWorld(true);
  let body, headM, faceM;
  model.traverse((o) => { if (!o.isSkinnedMesh) return; if (o.material.name === "Face") faceM = o; else if (o.morphTargetDictionary) headM = o; else body = o; });
  const sc = body.matrixWorld.getMaxScaleOnAxis(), bones = {}; body.skeleton.bones.forEach((b) => { bones[b.name] = b; });

  // per-vertex data of the body in model space (used to cut clothes out of the body mesh)
  const n = body.geometry.attributes.position.count, vx = new Float32Array(n), vy = new Float32Array(n), bn = new Array(n), tv = new THREE.Vector3();
  const SI = body.geometry.attributes.skinIndex, SW = body.geometry.attributes.skinWeight;
  for (let i = 0; i < n; i++) {
    body.getVertexPosition(i, tv).applyMatrix4(body.matrixWorld); vx[i] = tv.x; vy[i] = tv.y;
    let best = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; best = SI.getComponent(i, k); } }
    bn[i] = body.skeleton.bones[best].name;
  }
  // the model's own materials are emissive-only textures → show them unlit, as authored
  [body, headM, faceM].forEach((m) => { const map = m.material.emissiveMap; if (map) map.colorSpace = THREE.SRGBColorSpace; m.material = new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide, userData: m === faceM ? NO_OUTLINE : {} }); m.frustumCulled = false; });
  rig.add(model);

  const O = [[], [], [], []];
  const put = (i, obj, parent = rig) => { parent.add(obj); O[i].push(obj); return obj; };

  // ---- clothes: copies of body triangles, pushed out along their normals ----
  const shell = (i, keep, d, mat, colorFn, yr = [-1e9, 1e9]) => {
    const g0 = body.geometry, P = g0.attributes.position, N = g0.attributes.normal, idx = g0.index.array, k = d / sc;
    const pos = [], nor = [], si = [], sw = [], ind = [], col = [];
    const V = (v) => ({ p: [P.getX(v), P.getY(v), P.getZ(v)], n: [N.getX(v), N.getY(v), N.getZ(v)], y: vy[v], s: v });
    const lerpV = (a, b, t) => ({ p: a.p.map((x, j) => x + (b.p[j] - x) * t), n: a.n.map((x, j) => x + (b.n[j] - x) * t), y: a.y + (b.y - a.y) * t, s: a.s });
    const clip = (poly, keepFn, cut) => { const out = []; for (let j = 0; j < poly.length; j++) { const a = poly[j], b = poly[(j + 1) % poly.length], ia = keepFn(a), ib = keepFn(b); if (ia) out.push(a); if (ia !== ib) { const t = (cut - a.y) / (b.y - a.y), m = lerpV(a, b, t); m.s = ia ? a.s : b.s; out.push(m); } } return out; };
    const emit = (q) => { const base = pos.length / 3; q.forEach((v) => { pos.push(v.p[0] + v.n[0] * k, v.p[1] + v.n[1] * k, v.p[2] + v.n[2] * k); nor.push(...v.n); si.push(SI.getX(v.s), SI.getY(v.s), SI.getZ(v.s), SI.getW(v.s)); sw.push(SW.getX(v.s), SW.getY(v.s), SW.getZ(v.s), SW.getW(v.s)); if (colorFn) col.push(...colorFn(v.s)); }); for (let j = 1; j < q.length - 1; j++) ind.push(base, base + j, base + j + 1); };
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t], b = idx[t + 1], c = idx[t + 2]; if (!(keep(a) && keep(b) && keep(c))) continue;
      let poly = [V(a), V(b), V(c)];
      if (yr[0] > -1e8) poly = clip(poly, (v) => v.y >= yr[0], yr[0]);
      if (poly.length && yr[1] < 1e8) poly = clip(poly, (v) => v.y <= yr[1], yr[1]);
      if (poly.length >= 3) emit(poly);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute("skinWeight", new THREE.Float32BufferAttribute(sw, 4)); g.setIndex(ind);
    if (colorFn) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const sm = new THREE.SkinnedMesh(g, mat); body.parent.add(sm); sm.matrix.copy(body.matrix); sm.matrix.decompose(sm.position, sm.quaternion, sm.scale); sm.updateMatrixWorld(true); sm.bind(body.skeleton, body.bindMatrix); sm.frustumCulled = false;
    O[i].push(sm); return sm;
  };
  const T = (v) => /^(Hips|Spine|Chest)/.test(bn[v]), LEG = (v) => /^(Upper_Leg|Lower_Leg)/.test(bn[v]), ARM = (v) => /^(Shoulder|Upper_Arm|Lower_Arm)/.test(bn[v]), NECK = (v) => /^Neck/.test(bn[v]);
  const top = (i, color, hem, up) => {
    const m = cloth(color); shell(i, T, 0.09, m, null, [hem, up]);
    [-1, 1].forEach((sg) => put(i, tube([[sg * 0.3, up - 0.03, 0.7], [sg * 0.36, up + 0.3, 0.5], [sg * 0.4, up + 0.43, 0.18], [sg * 0.36, up + 0.3, -0.12], [sg * 0.3, up - 0.05, -0.3]], 0.075, m)));
  };
  const shorts = (i, color, hem) => shell(i, (v) => /^(Hips|Upper_Leg)/.test(bn[v]), 0.15, cloth(color), null, [hem, 5.95]);
  const shoes = (i, color, o = {}) => [-1, 1].forEach((s) => {
    put(i, mesh(new THREE.SphereGeometry(1, 40, 28), toon(color), [s * 0.47, 0.24, 0.45], [0.38, 0.23, 0.8]));
    put(i, cyl(0.25, 0.27, o.cuff ?? 0.55, toon(o.cuffColor || color), [s * 0.47, 0.82, 0.04]));
    if (o.toe) put(i, mesh(new THREE.SphereGeometry(1, 28, 20), toon(o.toe), [s * 0.47, 0.22, 1.02], [0.32, 0.2, 0.3]));
  });

  /* 0 · DESIGNER: dress + magnolia */
  top(0, "#f4ead8", 5.9, 7.75);
  put(0, lathe([[0.84, 6.0], [0.95, 5.6], [1.25, 4.9], [1.6, 4.0], [1.62, 3.9]], cloth("#f4ead8"), 0.85), rig).position.set(0, 0, 0.2);
  put(0, cyl(0.34, 0.38, 0.3, cloth("#f4ead8"), [0, 8.22, 0.06]));
  shoes(0, "#fbf5ec");
  const flower = put(0, new THREE.Group());
  flower.add(cyl(0.03, 0.04, 1.6, toon("#6b5a45"), [0, 0.55, 0])); flower.add(mesh(new THREE.SphereGeometry(0.14, 12, 10), toon("#8f9c70"), [0.14, 0.4, 0], [1.8, 0.5, 0.9]));
  const bloom = new THREE.Group(); bloom.position.set(0, 1.4, 0); bloom.rotation.x = -0.5; flower.add(bloom);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2, p = mesh(new THREE.SphereGeometry(0.2, 18, 12), toon("#fffaf0"), [Math.cos(a) * 0.2, 0.05, Math.sin(a) * 0.2], [0.8, 0.28, 1.5]); p.rotation.y = -a; p.rotation.z = 0.35; bloom.add(p); }
  bloom.add(mesh(new THREE.SphereGeometry(0.1, 12, 10), toon("#f2d47a"), [0, 0.1, 0]));

  /* 1 · CLIMBER: muscle tee, shorts, harness, chalk brush, climbing shoes */
  top(1, "#e07a5f", 5.35, 7.8); shorts(1, "#4b5d67", 4.2); shoes(1, "#d8553d", { toe: "#f5efe6" });
  const web = cloth("#f2c14e");
  put(1, ring(0.88, 0.085, web, [0, 5.95, 0.2], [1, 0.82, 1]));
  [-1, 1].forEach((s) => put(1, ring(0.55, 0.06, web, [s * 0.5, 4.75, 0.22], [1, 1, 1])));
  put(1, mesh(new THREE.BoxGeometry(0.28, 0.22, 0.09), metal("#c9ccd1"), [0, 5.95, 1.0]));
  const carab = put(1, new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 10, 24), metal("#c9ccd1"))); carab.position.set(0.95, 5.6, 0.5); carab.rotation.y = Math.PI / 2;
  const brush = put(1, new THREE.Group());
  brush.add(cyl(0.05, 0.05, 1.4, toon("#b98a56"), [0, 0.45, 0])); brush.add(cyl(0.16, 0.11, 0.38, toon("#e8d5a8"), [0, 1.3, 0]));
  [[0.12, 1.65, 0.05], [-0.15, 1.8, 0], [0, 1.95, 0.1]].forEach(([x, y, z]) => brush.add(mesh(new THREE.SphereGeometry(0.06, 10, 8), basic("#ffffff", { transparent: true, opacity: 0.85 }), [x, y, z])));

  /* 2 · DIVER: wetsuit, BCD + tank, fins, mask */
  const teal = new THREE.Color("#1fa7b5"), navy = new THREE.Color("#243447");
  const wcol = (v) => { const c = (/^Lower_Arm/.test(bn[v]) && vy[v] < 5.9 && Math.abs(vx[v]) > 1.5) || (/^Lower_Leg/.test(bn[v]) && vy[v] < 1.6) || (/^Lower_Leg/.test(bn[v]) && vy[v] > 3.1 && vy[v] < 3.5) ? teal : navy; return [c.r, c.g, c.b]; };
  shell(2, (v) => T(v) || LEG(v) || ARM(v) || NECK(v), 0.07, cloth("#ffffff", { vertexColors: true }), wcol, [0.7, 8.25]);
  shoes(2, "#1d2a35", { cuff: 0.45 });
  const finShape = new THREE.Shape(); finShape.moveTo(-0.2, 0); finShape.lineTo(0.2, 0); finShape.lineTo(0.55, 1.9); finShape.quadraticCurveTo(0, 2.05, -0.55, 1.9); finShape.closePath();
  [-1, 1].forEach((s) => { const f = put(2, new THREE.Mesh(new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: false }), toon("#1fa7b5"))); f.rotation.x = Math.PI / 2; f.position.set(s * 0.47, 0.18, 0.95); });
  put(2, lathe([[0.8, 5.7], [0.86, 6.4], [0.84, 7.1], [0.72, 7.8], [0.46, 8.05]], cloth("#f2a33a"), 0.85)).position.set(0, 0, 0.33);
  put(2, ring(0.9, 0.06, toon("#1a1a1a"), [0, 6.7, 0.33], [1, 0.85, 1])); put(2, ring(0.84, 0.07, toon("#1a1a1a"), [0, 5.8, 0.33], [1, 0.85, 1]));
  put(2, cyl(0.42, 0.42, 3.1, metal("#bfd8df"), [0, 7.0, -0.95])); put(2, ring(0.44, 0.06, cloth("#f2c14e"), [0, 7.9, -0.95], [1, 1, 1]));
  put(2, mesh(new THREE.SphereGeometry(0.18, 16, 12), metal("#2a2a2a"), [0, 8.65, -0.95]));
  put(2, tube([[0, 8.7, -0.9], [0.5, 8.9, -0.3], [0.8, 8.3, 0.4], [0.5, 7.4, 1.0]], 0.05, toon("#1a1a1a")));
  const mkMask = (pl, ps, ts, tl, mat) => { const m = put(2, mesh(new THREE.SphereGeometry(1, 48, 28, ps, pl, ts, tl), mat, HC, [HR[0] * 1.1, HR[1] * 1.1, HR[2] * 1.1])); return m; };
  const frame = new THREE.MeshStandardMaterial({ color: "#151f2a", roughness: 0.4, side: THREE.DoubleSide });
  const glass = basic("#6fd0ee", { transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
  const P0 = Math.PI / 2 - 0.75, T0 = 1.41;
  mkMask(1.5, P0, T0, 0.6, glass); mkMask(1.66, P0 - 0.08, T0 - 0.08, 0.08, frame); mkMask(1.66, P0 - 0.08, T0 + 0.6, 0.08, frame);
  mkMask(0.08, P0 - 0.08, T0 - 0.08, 0.76, frame); mkMask(0.08, P0 + 1.5, T0 - 0.08, 0.76, frame);
  const sg = new THREE.TorusGeometry(0.78, 0.06, 10, 64, Math.PI * 1.4); sg.rotateZ(Math.PI * 0.8);
  const strap = put(2, new THREE.Mesh(sg, toon("#1fa7b5"))); strap.rotation.x = Math.PI / 2; strap.scale.set(1, 1, 1); strap.position.set(HC[0], 9.12, HC[2]);

  /* 3 · EVERYDAY: tank top, denim jorts, sneakers, Fujifilm-style camera */
  top(3, "#fffaf0", 5.45, 7.7); shorts(3, "#7da2c6", 3.85); shoes(3, "#f5f1ea", { toe: "#ffffff" });
  const cam = put(3, new THREE.Group()); const blk = toon("#1b1b1b"), slv = metal("#c9ccd1");
  cam.add(mesh(new THREE.BoxGeometry(1.2, 0.68, 0.42), blk)); cam.add(mesh(new THREE.BoxGeometry(1.2, 0.17, 0.42), slv, [0, 0.42, 0]));
  [-0.32, 0.32].forEach((x) => cam.add(cyl(0.1, 0.1, 0.11, slv, [x, 0.56, 0])));
  const lens = cyl(0.25, 0.25, 0.34, blk, [0.1, -0.03, 0.34]); lens.rotation.x = Math.PI / 2; cam.add(lens);
  const lr = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 10, 36), slv); lr.position.set(0.1, -0.03, 0.51); cam.add(lr);
  cam.add(mesh(new THREE.BoxGeometry(0.24, 0.05, 0.012), basic("#e8e8e8"), [-0.38, 0.27, 0.216])); cam.add(mesh(new THREE.BoxGeometry(0.1, 0.05, 0.012), basic("#d0342c"), [-0.2, 0.27, 0.216]));
  const strapT = put(3, new THREE.Group());

  // ---- hair: layered tapered locks fitted to this head ----
  const hairG = new THREE.Group(); hairG.position.set(...HC); rig.add(hairG);
  const hMat = (c) => toon(c, { side: THREE.DoubleSide }), hA = hMat("#1d1619"), hB = hMat("#2b2126"), hD = hMat("#110c0e");
  const longHair = [], shortHair = [];
  const sp = (th, ph, r = 1.07) => [Math.sin(th) * Math.sin(ph) * HR[0] * r, Math.cos(th) * HR[1] * r, Math.sin(th) * Math.cos(ph) * HR[2] * r];
  const outward = (P, O) => { if (P.y > -0.45 * HR[1]) O.set(P.x / HR[0] ** 2, P.y / HR[1] ** 2, P.z / HR[2] ** 2); else O.set(P.x, 0, P.z - 0.15); O.normalize(); };
  const addClump = (pts, w0, mat, list) => { const m = new THREE.Mesh(clump(pts, w0, outward), mat); hairG.add(m); if (list) list.push(m); return m; };
  const cap = new THREE.Group(); cap.scale.set(...HR); hairG.add(cap); const capT = new THREE.Group(); capT.rotation.x = -0.5; cap.add(capT);
  capT.add(new THREE.Mesh(new THREE.SphereGeometry(1.07, 72, 48, 0, Math.PI * 2, 0, 1.62), hD));
  [-0.66, -0.4, -0.14, 0.12, 0.38, 0.66].forEach((ph, k) => {
    const te = 1.25 - 0.08 * Math.cos(ph * 2.2) + (k % 2) * 0.1, sg2 = ph < 0 ? -1 : 1, end = sp(te, ph);
    addClump([sp(0.25, ph * 0.5), sp(0.7, ph * 0.85), sp(te - 0.3, ph), end, [end[0] + sg2 * 0.14, end[1] - 0.09, end[2] + 0.03]], 0.2, k % 2 ? hB : hA);
  });
  addClump([[0, 0.95, 0.1], [0.05, 1.3, 0.15], [0.2, 1.5, 0.1], [0.25, 1.4, 0.04]], 0.05, hA); // ahoge
  const tailLock = (ph, te, len, flare, w0, mat, custom, r = 1.07) => {
    const E = sp(te, ph, r), sg2 = Math.sign(Math.sin(ph)) || 1, base = [sp(0.3, ph, r), sp(0.9, ph, r), sp(1.5, ph, r), E], zb = -0.7;
    const t = custom || [0.3, 0.65, 1].map((f, k) => [E[0] * (0.98 - 0.04 * k) + sg2 * flare * f, E[1] - len * f, E[2] + (zb - E[2]) * Math.min(1, f * 1.2)]);
    addClump([...base, ...t], w0, mat, longHair); addClump([...base, t[0]], w0 * 0.9, mat, shortHair);
  };
  [-1.55, -1.1, -0.66, -0.22, 0.22, 0.66, 1.1, 1.55].forEach((d, k) => tailLock(Math.PI + d, 1.95 + (k % 3) * 0.04, 2.9 + (k % 4) * 0.25, 0.32, 0.3, k % 2 ? hB : hA));
  [-1.33, -0.88, -0.44, 0, 0.44, 0.88, 1.33].forEach((d, k) => tailLock(Math.PI + d, 2.0, 3.2 + (k % 3) * 0.2, 0.3, 0.31, hD, null, 0.97));
  [-1, 1].forEach((s) => {
    tailLock(s * 0.98, 1.7, 0, 0, 0.19, hA, [[s * 0.66, -0.9, 0.55], [s * 0.62, -1.8, 1.0], [s * 0.55, -2.7, 1.1]]);
    tailLock(s * 1.25, 1.8, 1.9, 0.35, 0.26, hB); tailLock(s * 1.5, 1.85, 2.4, 0.4, 0.26, hA);
  });

  // ---- posing + props that follow the hands ----
  const rest = {}; Object.keys(bones).forEach((k) => { rest[k] = bones[k].quaternion.clone(); });
  const wq = new THREE.Quaternion(), pq = new THREE.Quaternion(), qq = new THREE.Quaternion(), ax = new THREE.Vector3();
  const rotW = (name, axis, ang) => { const b = bones[name]; b.updateWorldMatrix(true, false); rig.getWorldQuaternion(qq); ax.copy(axis).applyQuaternion(qq); b.getWorldQuaternion(wq); b.parent.getWorldQuaternion(pq); b.quaternion.copy(pq.invert().multiply(new THREE.Quaternion().setFromAxisAngle(ax, ang)).multiply(wq)); b.updateMatrixWorld(true); };
  const X = new THREE.Vector3(1, 0, 0), Z = new THREE.Vector3(0, 0, 1);
  const handOf = (name) => { const v = new THREE.Vector3(); bones[name].getWorldPosition(v); return rig.worldToLocal(v); };
  const pose = (i) => {
    Object.keys(rest).forEach((k) => bones[k].quaternion.copy(rest[k])); rig.updateMatrixWorld(true);
    const inward = i === 2 ? 0.08 : 0.22;
    rotW("Upper_Arm_L_021", Z, -inward * 0.45); rotW("Lower_Arm_L_022", Z, -inward * 0.35);
    if (i === 2) { rotW("Upper_Arm_R_041", Z, inward); rotW("Lower_Arm_R_042", Z, inward * 1.6); }
    else { rotW("Upper_Arm_R_041", Z, inward * (i === 3 ? 1.5 : 0.6)); rotW("Upper_Arm_R_041", X, -0.5); rotW("Lower_Arm_R_042", X, -1.05); if (i === 3) rotW("Lower_Arm_R_042", Z, 0.5); }
    rig.updateMatrixWorld(true);
    const w = handOf("Wrist_R_043");
    if (i === 0) flower.position.set(w.x - 0.05, w.y - 0.3, w.z + 0.25);
    if (i === 1) brush.position.set(w.x - 0.05, w.y - 0.3, w.z + 0.25);
    if (i === 3) { cam.position.set(w.x + 0.25, w.y + 0.05, w.z + 0.3); cam.rotation.y = 0.35; strapT.clear(); strapT.add(tube([[w.x - 0.25, w.y + 0.2, w.z + 0.3], [w.x * 0.5 - 0.1, 7.9, 0.75], [-0.3, 8.45, 0.4], [0, 8.5, -0.25], [0.35, 8.45, 0.4], [w.x * 0.5 + 0.5, 7.7, 0.85], [w.x + 0.75, w.y + 0.2, w.z + 0.3]], 0.04, toon("#3a3a3a"))); }
  };

  const av = { root, outfit: -1, pop: 0,
    setOutfit(i) {
      if (i === av.outfit) return false; const first = av.outfit < 0; av.outfit = i;
      O.forEach((arr, k) => arr.forEach((o) => { o.visible = k === i; }));
      longHair.forEach((o) => { o.visible = i !== 2; }); shortHair.forEach((o) => { o.visible = i === 2; });
      pose(i); if (!first) av.pop = 1; return true;
    } };
  av.setOutfit(0);
  return av;
}

export default function Avatar3D({ progressRef, onStep }) {
  const mount = useRef(null), stepRef = useRef(onStep);
  stepRef.current = onStep;
  useEffect(() => {
    const el = mount.current; let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(renderer.domElement);
    const effect = new OutlineEffect(renderer, { defaultThickness: 0.0042, defaultColor: [0.12, 0.07, 0.08], defaultAlpha: 1 });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    const pmrem = new THREE.PMREMGenerator(renderer); const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = envTex; scene.environmentIntensity = 0.5;
    scene.add(new THREE.HemisphereLight("#fffaf2", "#e2d6e6", 1.5));
    const sun = new THREE.DirectionalLight("#ffffff", 1.9); sun.position.set(2.5, 4, 4); scene.add(sun);
    const rimL = new THREE.DirectionalLight("#cbbbd2", 0.9); rimL.position.set(-3, 2, -4); scene.add(rimL);
    const sc = document.createElement("canvas"); sc.width = sc.height = 128;
    const cx = sc.getContext("2d"), gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(48,35,60,.35)"); gr.addColorStop(1, "rgba(48,35,60,0)"); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, userData: NO_OUTLINE }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01; scene.add(shadow);

    let av = null, disposed = false;
    new GLTFLoader().load(MODEL_URL, (gltf) => { if (disposed) return; av = buildAvatar(gltf); scene.add(av.root); stepRef.current?.(0); }, undefined, (e) => console.error("Avatar model failed to load:", e));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      const d = 7.4 / Math.min(1, (w / h) * 1.5); camera.position.set(0, 1.95, d); camera.lookAt(0, 1.55, 0); camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    let visible = true; const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }); io.observe(el);

    // scroll → turns: hold (10%) · full spin (20%) · hold · spin · hold · spin · hold (10%). The outfit changes when she faces away.
    const ease = (u) => u * u * u * (u * (u * 6 - 15) + 10);
    let raf, turns = 0;
    const clock = new THREE.Timer();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || !av) return;
      clock.update(); const t = clock.getElapsed(), dt = Math.min(0.05, clock.getDelta()), p = progressRef?.current || 0;
      const seg = Math.min(3, Math.floor(p / 0.3)), loc = p - seg * 0.3;
      const target = seg === 3 ? 3 : seg + ease(Math.max(0, Math.min(1, (loc - 0.1) / 0.2)));
      turns += (target - turns) * (1 - Math.exp(-dt * 7));
      av.root.rotation.y = turns * Math.PI * 2;
      if (av.setOutfit(Math.max(0, Math.min(3, Math.round(turns))))) stepRef.current?.(av.outfit);
      let hop = 0; if (av.pop > 0) { av.pop = Math.max(0, av.pop - dt / 0.5); hop = Math.sin((1 - av.pop) * Math.PI) * 0.1; }
      av.root.position.y = (reduce ? 0 : Math.sin(t * 1.6) * 0.02) + hop;
      av.root.scale.set(1, 1 - hop * 0.2, 1);
      effect.render(scene, camera);
    };
    loop();
    return () => {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m?.dispose()); });
      envTex.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [progressRef]);
  return <div className="avatar-canvas" ref={mount} aria-hidden="true" />;
}
