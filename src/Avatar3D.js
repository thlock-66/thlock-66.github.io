import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// A self-contained, deliberately stylised character. No external GLB or textures.
// Keep the same progressRef/onStep interface used by App.js.
const C = { skin: "#e7bba3", hair: "#17151c", cream: "#f5ead7", lilac: "#b6a0c7", plum: "#64536d", sage: "#9ba885", teal: "#719f9f", sole: "#e4d6c5", black: "#171b20" };
function makeCharacter() {
  const root = new THREE.Group();
  const materials = new Map();
  const material = (color) => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 }));
    return materials.get(color);
  };
  function ball(parent, color, position, scale) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), material(color));
    m.position.set(...position); m.scale.set(...scale); parent.add(m); return m;
  }
  function link(parent, color, a, b, radius) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, start.distanceTo(end), 24), material(color));
    m.position.copy(start).add(end).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    parent.add(m); ball(parent, color, a, [radius, radius, radius]); ball(parent, color, b, [radius, radius, radius]); return m;
  }
  function roundedBox(parent, color, position, size, radius = 0.06) {
    const [w, h, d] = size, r = Math.min(radius, w / 2, h / 2, d / 2);
    const s = new THREE.Shape();
    s.moveTo(-w/2+r,-h/2); s.lineTo(w/2-r,-h/2); s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    s.lineTo(w/2,h/2-r); s.quadraticCurveTo(w/2,h/2,w/2-r,h/2); s.lineTo(-w/2+r,h/2);
    s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r); s.lineTo(-w/2,-h/2+r); s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    const geometry = new THREE.ExtrudeGeometry(s, { depth: d-2*r, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: r, bevelThickness: r, curveSegments: 16 });
    geometry.translate(0, 0, -d/2+r);
    const m = new THREE.Mesh(geometry, material(color)); m.position.set(...position); parent.add(m); return m;
  }
  // Hair follows the scalp, then falls into tapered curved locks.
  const head = new THREE.Group(); head.position.y = -1.14; head.scale.setScalar(1.13); root.add(head);
  // Keep the front face proportions while rounding out the lower side profile.
  // A softened superellipse fills out the cheeks and chin without a sharp edge.
  const face=ball(head,C.skin,[0,2.67,0.07],[0.43,0.375,0.46]);
  const facePos=face.geometry.attributes.position,profilePower=2.65;
  for(let i=0;i<facePos.count;i++){
    const x=facePos.getX(i),y=facePos.getY(i),z=facePos.getZ(i);
    const radius=Math.sqrt(Math.max(0,1-x*x));
    if(radius<0.00001)continue;
    const soften=n=>Math.sign(n)*Math.pow(Math.min(1,Math.abs(n)),2/profilePower);
    facePos.setXYZ(i,x,radius*soften(y/radius),radius*soften(z/radius));
  }
  face.geometry.computeVertexNormals();
  // Used by the fringe and facial details, so each follows the new surface.
  const faceFront=(x,y)=>{
    const cross=Math.sqrt(Math.max(0.0001,1-(x/0.43)**2));
    const yn=Math.min(1,Math.abs((y-2.67)/(0.375*cross)));
    return 0.07+0.46*cross*Math.pow(Math.max(0.00001,1-yn**profilePower),1/profilePower);
  };
  // A rear scalp layer keeps the fuller head covered from the side.
  ball(head,C.hair,[0,2.70,-0.14],[0.445,0.385,0.31]);
  // Continuous scalp shell extends down over the temples, closing side gaps.
  const capGeometry=new THREE.SphereGeometry(1,72,40,0,Math.PI*2,0,Math.PI);
  const cp=capGeometry.attributes.position;
  for(let j=0;j<cp.count;j++){
    const x=cp.getX(j),y=cp.getY(j),z=cp.getZ(j),phi=Math.atan2(x,z);
    const t=Math.acos(THREE.MathUtils.clamp(y,-1,1))/Math.PI;
    const end=1.35+0.52*(1-Math.max(0,Math.cos(phi))),theta=t*end;
    cp.setXYZ(j,Math.sin(theta)*Math.sin(phi)*0.456,2.68+Math.cos(theta)*0.43,0.055+Math.sin(theta)*Math.cos(phi)*(Math.cos(phi)>0?0.485:0.29));
  }
  capGeometry.computeVertexNormals();const scalp=new THREE.Mesh(capGeometry,material(C.hair));head.add(scalp);
  function lock(points,width,depth=0.05) {
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const positions=[],indices=[],segments=40,sides=12;
    const tangent=new THREE.Vector3(),side=new THREE.Vector3(),normal=new THREE.Vector3();
    for(let j=0;j<=segments;j++){
      const t=j/segments,centre=curve.getPointAt(t);
      curve.getTangentAt(t,tangent);side.crossVectors(tangent,new THREE.Vector3(0,0,1)).normalize();normal.crossVectors(side,tangent).normalize();
      const taper=Math.max(0.002,Math.pow(1-t,0.45)),soft=Math.min(1,0.42+t*5);
      for(let k=0;k<=sides;k++){
        const a=k/sides*Math.PI*2,v=centre.clone().addScaledVector(side,Math.cos(a)*width*taper*soft).addScaledVector(normal,Math.sin(a)*depth*taper);
        positions.push(v.x,v.y,v.z);
        if(j<segments&&k<sides){const n=j*(sides+1)+k;indices.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}
      }
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
    const mat=material(C.hair);mat.side=THREE.DoubleSide;
    head.add(new THREE.Mesh(geo,mat));
  }
  // A single closed hair volume with shallow vertical ridges.
  const backGeometry=new THREE.SphereGeometry(1,96,64);
  const bp=backGeometry.attributes.position;
  for(let j=0;j<bp.count;j++){
    const x=bp.getX(j),y=bp.getY(j),z=bp.getZ(j),angle=Math.atan2(x,z);
    // Flatten the lower hemisphere into a gently rounded hem, preserving a closed mesh.
    const yy=y<0?-Math.pow(-y,0.40):y;
    const ridge=1+0.009*Math.cos(angle*24)*(1-y*y);
    const blend=THREE.MathUtils.smoothstep(y,-0.2,0.12);
    const centre=-0.27+blend*0.15,depth=0.22+blend*0.13;
    bp.setXYZ(j,x*0.475*ridge,2.39+yy*0.70,centre+z*depth*ridge);
  }
  backGeometry.computeVertexNormals();head.add(new THREE.Mesh(backGeometry,material(C.hair)));
  [-1,1].forEach(sign=>{
    ball(head,C.skin,[sign*0.424,2.62,0.025],[0.065,0.09,0.065]);
    // Round front-facing eyes with equal horizontal and vertical radii.
    ball(head,"#19151e",[sign*0.125,2.57,0.422],[0.061,0.061,0.012]);
    ball(head,"#fffaf4",[sign*0.125-0.016,2.591,0.435],[0.020,0.020,0.009]);
    ball(head,"#fffaf4",[sign*0.125+0.018,2.552,0.435],[0.013,0.006,0.005]);
    ball(head,"#e899a6",[sign*0.275,2.50,0.348],[0.072,0.032,0.019]);
    // Pointed face-framing pieces follow the jaw before curling gently outward.
    lock([[sign*0.16,3.075,0.12],[sign*0.38,2.92,0.27],[sign*0.44,2.64,0.22],[sign*0.43,2.28,0.18],[sign*0.48,2.13,0.18]],0.105,0.045);

  });
  // A single swept fringe with integrated tapered lobes and sculpted grooves.
  const fringePositions=[],fringeIndices=[],cols=128,rows=40;
  for(let yStep=0;yStep<=rows;yStep++){
    const v=yStep/rows;
    for(let xStep=0;xStep<=cols;xStep++){
      const u=xStep/cols,x=(u*2-1)*0.39;
      // Curved, tapered ends are joined above their tips, like the reference.
      const sweep=u*5.2+0.12;
      const tip=Math.pow(Math.sin(Math.PI*(sweep-Math.floor(sweep))),1.5);
      // Longer connected face-framing sections at both edges, plus a longer
      // piece to the left of centre, as shown in the marked reference.
      const side=THREE.MathUtils.smoothstep(Math.abs(x),0.285,0.39);
      const extraLeft=Math.exp(-(((x+0.135)/0.035)**2));
      // Broader, connected temple sections taper into the long side pieces.
      const leftTemple=Math.exp(-(((x+0.295)/0.035)**2));
      const rightTemple=Math.exp(-(((x-0.30)/0.035)**2));
      const edge=2.79-0.070*tip-0.025*u-0.33*side-0.065*extraLeft-0.18*leftTemple-0.16*rightTemple;
      const top=3.025-0.11*Math.pow(Math.abs(x)/0.39,1.7);
      const y=top*(1-v)+edge*v;
      // The ridges flow diagonally across a single unbroken surface.
      const phase=(u+0.12*(1-v))*5.2;
      const grooves=0.008*Math.cos(phase*2*Math.PI)+0.003*Math.cos(phase*4*Math.PI);
      const z=faceFront(x,y)+0.027+grooves*(0.25+0.75*v)+(0.16*side+0.18*Math.max(leftTemple,rightTemple))*v*v;
      fringePositions.push(x,y,z);
      if(yStep<rows&&xStep<cols){const k=yStep*(cols+1)+xStep;fringeIndices.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
    }
  }
  const fringeGeometry=new THREE.BufferGeometry();fringeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(fringePositions,3));fringeGeometry.setIndex(fringeIndices);fringeGeometry.computeVertexNormals();head.add(new THREE.Mesh(fringeGeometry,material(C.hair)));
  // Two soft lobes and a tiny lower stroke, matching the reference expression.
  const smile=new THREE.CurvePath();
  smile.add(new THREE.CubicBezierCurve3(new THREE.Vector3(-0.055,2.500,0.5),new THREE.Vector3(-0.055,2.460,0.5),new THREE.Vector3(-0.008,2.460,0.5),new THREE.Vector3(0,2.491,0.5)));
  smile.add(new THREE.CubicBezierCurve3(new THREE.Vector3(0,2.491,0.5),new THREE.Vector3(0.008,2.460,0.5),new THREE.Vector3(0.055,2.460,0.5),new THREE.Vector3(0.055,2.500,0.5)));
  head.add(new THREE.Mesh(new THREE.TubeGeometry(smile,48,0.009,10,false),material("#754956")));
  const lowerSmile=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.018,2.437,0.5),new THREE.Vector3(0,2.428,0.5),new THREE.Vector3(0.018,2.437,0.5));
  head.add(new THREE.Mesh(new THREE.TubeGeometry(lowerSmile,16,0.007,10,false),material("#754956")));
  const detailColors=new Set(['#19151e','#fffaf4','#e899a6','#754956']);
  head.updateMatrixWorld(true);
  head.traverse(o=>{
    if(!o.isMesh||!detailColors.has('#'+o.material.color.getHexString()))return;
    const isHighlight=o.material.color.getHexString()==='fffaf4',v=new THREE.Vector3();
    const toHead=new THREE.Matrix4().copy(head.matrixWorld).invert().multiply(o.matrixWorld),back=toHead.clone().invert();
    const p=o.geometry.attributes.position;
    for(let j=0;j<p.count;j++){
      v.fromBufferAttribute(p,j).applyMatrix4(toHead);
      v.z=faceFront(v.x,v.y)+(isHighlight?0.012:0.007);
      v.applyMatrix4(back);p.setXYZ(j,v.x,v.y,v.z);
    }
    o.geometry.computeVertexNormals();
  });
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.115,0.13,0.20,32),material(C.skin));neck.position.set(0,1.465,0.06);root.add(neck);
  // Outfit geometry IS the body surface, so there is no hidden torso to poke through.
  const outfits = [], headGear=[];
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group(); g.scale.y=0.80; g.position.y=0; root.add(g); outfits.push(g);
    const shirt = [C.cream, C.lilac, C.black, C.cream][i];
    ball(g, shirt, [0,1.79,0], [0.36,0.44,0.23]);
    [-1,1].forEach(s => {
      const legColor = i===2 ? C.black : C.skin;
      link(g,legColor,[s*0.17,1.26,0],[s*0.18,0.25,0.025],0.115);
      ball(g,i===2?C.black:C.cream,[s*0.18,0.16,0.11],[0.15,0.13,0.255]);
      ball(g,C.sole,[s*0.18,0.075,0.12],[0.152,0.04,0.25]);
      const holding=i===0&&s===-1;
      const shoulder=[s*0.255,1.99,0], elbow=holding?[-0.48,1.78,0.19]:[s*0.46,1.69,0.015], wrist=holding?[-0.66,1.74,0.32]:[s*0.48,1.39,0.09];
      // Overlapping shoulder joint joins the upper arm into the torso silhouette.
      ball(g,i===1?C.skin:shirt,[s*0.275,1.965,0],[0.135,0.155,0.165]);
      link(g,i===1?C.skin:shirt,shoulder,[s*0.41,1.82,0.005],i===1?0.078:0.105);
      link(g,i===2?C.black:C.skin,[s*0.41,1.82,0.005],elbow,0.077);
      link(g,i===2?C.black:C.skin,elbow,wrist,0.071);
      // Intentional mitten-like hands: a rounded palm and thumb, no broken finger rig.
      ball(g,C.skin,holding?[-0.66,1.70,0.36]:[s*0.48,1.33,0.1],[0.078,0.115,0.068]);
      ball(g,C.skin,holding?[-0.605,1.74,0.37]:[s*0.416,1.36,0.13],[0.035,0.055,0.036]);
    });
    if(i===0) {
      const pts=[[0,0.96],[0.54,0.96],[0.53,1.0],[0.44,1.2],[0.36,1.46],[0.32,1.6],[0,1.6]].map(([x,y])=>new THREE.Vector2(x,y));
      const skirtMaterial=material(C.lilac).clone();skirtMaterial.side=THREE.DoubleSide;skirtMaterial.transparent=false;skirtMaterial.opacity=1;
      const skirt=new THREE.Mesh(new THREE.LatheGeometry(pts,64),skirtMaterial); skirt.scale.z=0.7; g.add(skirt);
      // Flat artist brush: tapered handle, narrow ferrule and separate bristles.
      const handle=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.022,1.35,24),material('#809976'));
      handle.position.set(-0.66,1.75,0.34);g.add(handle);
      roundedBox(g,'#a8acb0',[-0.66,2.47,0.34],[0.24,0.17,0.075],0.012);
      for(let j=0;j<18;j++){
        const x=-0.776+j*0.0137,h=0.29+0.028*Math.sin(j*2.4);
        const bristle=new THREE.Mesh(new THREE.CylinderGeometry(0.005,0.008,h,8),material(j<5?'#d97d80':j>12?'#8e9cc5':'#f4e4c3'));
        bristle.position.set(x,2.55+h/2,0.34);g.add(bristle);
        // A second row gives the brush real thickness and a visible bristled edge.
        const rear=bristle.clone();rear.position.z=0.365;g.add(rear);
      }
      // Curled fingers overlap the shaft on its front; the thumb closes from the side.
      [1.66,1.70,1.74].forEach(y=>ball(g,C.skin,[-0.674,y,0.391],[0.045,0.019,0.028]));
      // Small flower brooch, outside the dress surface.
      for(let k=0;k<5;k++){const a=k*Math.PI*2/5;ball(g,C.lilac,[-0.19+Math.cos(a)*0.043,1.98+Math.sin(a)*0.043,0.208],[0.036,0.036,0.018]);}
      ball(g,"#e6c980",[-0.19,1.98,0.229],[0.022,0.022,0.015]);
    } else {
      const pants=i===1?C.sage:i===2?C.black:"#9faec3";
      ball(g,pants,[0,1.4,0],[0.32,0.23,0.22]);
      [-1,1].forEach(s=>link(g,pants,[s*0.17,1.37,0],[s*0.17,1.06,0],0.15));
    }
    if(i===1) {
      [-1,1].forEach(sign=>link(g,C.lilac,[sign*0.23,1.94,0.12],[sign*0.23,2.10,0.035],0.055));
      // Visible waist belt, two closed leg loops and front tie-in straps.
      function harnessRing(x,y,rx,rz) {
        const ring=new THREE.Mesh(new THREE.TorusGeometry(1,0.065,12,64),material(C.plum));
        ring.rotation.x=Math.PI/2;ring.scale.set(rx,rz,0.5);ring.position.set(x,y,0.005);g.add(ring);
      }
      harnessRing(0,1.56,0.34,0.25);
      [-1,1].forEach(sign=>{
        harnessRing(sign*0.17,1.13,0.171,0.175);
        link(g,C.plum,[sign*0.10,1.55,0.245],[sign*0.17,1.14,0.178],0.025);
      });
      roundedBox(g,"#d2bb82",[0,1.51,0.277],[0.09,0.12,0.035],0.014);
      // Chalk bag attaches to the rear waist by a visible webbing loop.
      link(g,C.plum,[0.26,1.55,-0.15],[0.34,1.4,-0.23],0.022);
      roundedBox(g,C.cream,[0.35,1.28,-0.24],[0.23,0.27,0.19],0.055);
      const rim=new THREE.Mesh(new THREE.TorusGeometry(0.095,0.018,10,40),material(C.lilac));
      rim.rotation.x=Math.PI/2;rim.position.set(0.35,1.425,-0.24);g.add(rim);

    }
    if(i===2) {
      [-1,1].forEach(sign=>{
        ball(g,'#292e34',[sign*0.245,1.79,0.16],[0.135,0.34,0.17]);
        const fin=roundedBox(g,C.cream,[sign*0.18,0.20,0.43],[0.31,0.07,0.78],0.03);fin.rotation.x=-0.45;
        link(g,'#d3d7da',[sign*0.18,0.18,0.23],[sign*0.18,0.18,0.70],0.014);
      });
      roundedBox(g,'#30363c',[0,1.49,0.23],[0.57,0.11,0.075],0.025);
      roundedBox(g,'#9ca8ab',[0,1.49,0.28],[0.10,0.085,0.025],0.01);
      link(g,C.sage,[0,1.46,-0.37],[0,1.99,-0.37],0.135);
      [-1,1].forEach(sign=>link(g,'#30363c',[sign*0.23,2.08,0.16],[sign*0.23,1.57,0.2],0.035));
      // Face equipment lives with the head, independent of body compression.
      const gear=new THREE.Group();head.add(gear);headGear.push({gear,outfit:i});
      // Rear-only strap: no geometry crosses the front of the lenses.
      const strapCurve=new THREE.CatmullRomCurve3([[0.275,2.58,0.56],[0.455,2.58,0.16],[0.46,2.58,-0.12],[0.29,2.58,-0.35],[0,2.58,-0.405],[-0.29,2.58,-0.35],[-0.46,2.58,-0.12],[-0.455,2.58,0.16],[-0.275,2.58,0.56]].map(p=>new THREE.Vector3(...p)));
      gear.add(new THREE.Mesh(new THREE.TubeGeometry(strapCurve,64,0.025,10,false),material(C.teal)));
      // One continuous scuba mask, shaped as in the reference sketch.
      // A single wide opening keeps the eyes visible without a glasses bridge.
      const maskShape=new THREE.Shape();
      maskShape.moveTo(-0.32,0.10);maskShape.quadraticCurveTo(-0.31,0.17,-0.21,0.17);
      maskShape.quadraticCurveTo(-0.10,0.17,0,0.115);maskShape.quadraticCurveTo(0.10,0.17,0.21,0.17);
      maskShape.quadraticCurveTo(0.31,0.17,0.32,0.10);maskShape.lineTo(0.32,-0.095);
      maskShape.quadraticCurveTo(0.31,-0.15,0.21,-0.15);maskShape.quadraticCurveTo(0.11,-0.15,0,-0.105);
      maskShape.quadraticCurveTo(-0.11,-0.15,-0.21,-0.15);maskShape.quadraticCurveTo(-0.31,-0.15,-0.32,-0.095);maskShape.closePath();
      const opening=new THREE.Path();
      opening.moveTo(-0.275,0.075);opening.lineTo(-0.275,-0.075);opening.quadraticCurveTo(-0.27,-0.11,-0.20,-0.11);
      opening.quadraticCurveTo(-0.09,-0.11,0,-0.06);opening.quadraticCurveTo(0.09,-0.11,0.20,-0.11);
      opening.quadraticCurveTo(0.27,-0.11,0.275,-0.075);opening.lineTo(0.275,0.075);
      opening.quadraticCurveTo(0.27,0.13,0.20,0.13);opening.quadraticCurveTo(0.09,0.13,0,0.075);
      opening.quadraticCurveTo(-0.09,0.13,-0.20,0.13);opening.quadraticCurveTo(-0.27,0.13,-0.275,0.075);opening.closePath();
      maskShape.holes.push(opening);
      const maskFrame=new THREE.Mesh(new THREE.ExtrudeGeometry(maskShape,{depth:0.025,bevelEnabled:true,bevelSize:0.012,bevelThickness:0.01,bevelSegments:4,curveSegments:20}),material(C.teal));
      maskFrame.position.set(0,2.59,0.558);gear.add(maskFrame);
      // The lens spans both eyes; it remains translucent and sits behind the rim.
      const glassMaterial=new THREE.MeshPhysicalMaterial({color:'#b8dcd9',transparent:true,opacity:0.13,roughness:0.12,depthWrite:false,side:THREE.DoubleSide});
      const pane=new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(opening.getPoints(96))),glassMaterial);
      pane.position.set(0,2.59,0.565);gear.add(pane);
      // A small moulded silicone nose pocket sits below the lens.
      ball(gear,C.teal,[0,2.49,0.565],[0.095,0.065,0.035]);
      ball(gear,C.plum,[0,2.405,0.534],[0.085,0.064,0.055]);
      ball(gear,C.sole,[0,2.405,0.585],[0.052,0.043,0.012]);
      const hose=new THREE.CatmullRomCurve3([[0.08,2.405,0.55],[0.36,2.36,0.54],[0.62,2.30,0.08],[0.59,2.62,-0.28],[0.2,2.71,-0.4]].map(p=>new THREE.Vector3(...p)));
      gear.add(new THREE.Mesh(new THREE.TubeGeometry(hose,48,0.025,10,false),material(C.plum)));

    }
    if(i===3) {
      // Camera hangs from the neck; no simulated grip or hand-prop intersection.
      [-1,1].forEach(s=>link(g,C.plum,[s*0.13,2.13,0.14],[s*0.18,1.65,0.34],0.016));
      roundedBox(g,C.black,[0,1.57,0.36],[0.43,0.28,0.16],0.035);
      roundedBox(g,'#292d32',[0,1.68,0.375],[0.4,0.065,0.16],0.02);
      const lens=new THREE.Mesh(new THREE.CylinderGeometry(0.086,0.086,0.12,40),material('#44494e'));lens.rotation.x=Math.PI/2;lens.position.set(0.04,1.56,0.49);g.add(lens);
      ball(g,'#17232d',[0.04,1.56,0.556],[0.064,0.064,0.014]);
      roundedBox(g,'#20252a',[0,1.76,0.37],[0.16,0.09,0.16],0.018);
      [-0.14,0.145].forEach(x=>{
        const dial=new THREE.Mesh(new THREE.CylinderGeometry(0.043,0.043,0.035,24),material('#41464c'));dial.position.set(x,1.745,0.37);g.add(dial);
      });
      roundedBox(g,'#121416',[-0.145,1.57,0.46],[0.08,0.16,0.035],0.02);
      // Small light lettering printed directly onto the front plate.
      const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=64;
      const ctx=labelCanvas.getContext('2d');ctx.fillStyle='#ecece7';ctx.font='bold 35px sans-serif';ctx.textAlign='center';ctx.fillText('FUJIFILM',128,43);
      const labelTexture=new THREE.CanvasTexture(labelCanvas);
      const label=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.04),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false}));label.position.set(-0.10,1.67,0.465);g.add(label);
    }
  }
  outfits.forEach(g=>{
    g.updateMatrixWorld(true);
    g.traverse(o=>{
      if(!o.isMesh)return;
      const geo=o.geometry.clone(),p=geo.attributes.position,v=new THREE.Vector3();
      o.updateWorldMatrix(true,false);
      const toGroup=new THREE.Matrix4().copy(g.matrixWorld).invert().multiply(o.matrixWorld),back=toGroup.clone().invert();
      for(let j=0;j<p.count;j++){
        v.fromBufferAttribute(p,j).applyMatrix4(toGroup);
        v.y=v.y<1.26?0.25+(v.y-0.25)*0.65:v.y-0.3535;
        v.applyMatrix4(back);p.setXYZ(j,v.x,v.y,v.z);
      }
      geo.computeVertexNormals();o.geometry.dispose();o.geometry=geo;
    });
  });
  return { root, setOutfit(i) {outfits.forEach((g,k)=>{g.visible=k===i;});headGear.forEach(({gear,outfit})=>{gear.visible=outfit===i;});} };
}

export default function Avatar3D({ progressRef, onStep }) {
  const mount = useRef(null), callback = useRef(onStep);
  callback.current = onStep;
  useEffect(() => {
    const el=mount.current; let renderer;
    try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}
    catch {el.textContent="A designer, climber, diver and photographer.";return()=>{el.textContent="";};}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
    renderer.setClearColor(0x000000,0);el.appendChild(renderer.domElement);
    const scene=new THREE.Scene(), camera=new THREE.OrthographicCamera(-2,2,2,-2,0.1,50);
    scene.add(new THREE.HemisphereLight("#fff8ed","#c5b8ce",2.2));
    const key=new THREE.DirectionalLight("#fff6e8",3);key.position.set(-3,5,5);scene.add(key);
    const fill=new THREE.DirectionalLight("#e6ddf0",1.6);fill.position.set(3,3,1);scene.add(fill);
    const avatar=makeCharacter();scene.add(avatar.root);
    const resize=()=>{
      const w=el.clientWidth||1,h=el.clientHeight||1,aspect=w/h;
      renderer.setSize(w,h,false);
      const viewHeight=Math.max(w<650?3.65:3.35,2.25/aspect);
      camera.left=-viewHeight*aspect/2;camera.right=viewHeight*aspect/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
      camera.position.set(0,1.25,8);camera.lookAt(0,1.25,0);camera.updateProjectionMatrix();
    };
    const ro=new ResizeObserver(resize);ro.observe(el);resize();
    let visible=true;const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});io.observe(el);
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const ease=t=>t*t*t*(t*(t*6-15)+10);
    let frame,last=performance.now(),turns=0,step=-1;
    const draw=now=>{
      frame=requestAnimationFrame(draw);const dt=Math.min((now-last)/1000,0.05);last=now;if(!visible)return;
      const raw=progressRef?.current;const p=Number.isFinite(raw)?THREE.MathUtils.clamp(raw,0,1):0;
      const seg=Math.min(3,Math.floor(p/0.3)),local=p-seg*0.3;
      const target=seg===3?3:seg+ease(THREE.MathUtils.clamp((local-0.1)/0.2,0,1));
      turns=media.matches?target:turns+(target-turns)*(1-Math.exp(-dt*7));
      const next=Math.min(3,Math.max(0,Math.round(turns)));
      if(next!==step){step=next;avatar.setOutfit(step);callback.current?.(step);}
      avatar.root.rotation.y=media.matches?0:turns*Math.PI*2-0.09;
      avatar.root.position.y=media.matches?0:Math.sin(now*0.0015)*0.012;
      renderer.render(scene,camera);
    };frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});renderer.dispose();renderer.domElement.remove();};
  },[progressRef]);
  return React.createElement("div", {className:"avatar-canvas",ref:mount,"aria-hidden":true});
}
