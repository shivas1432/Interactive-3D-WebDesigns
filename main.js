/*!
Sphere Packing 3D
https://codepen.io/wakana-k/pen/pvJGgpR
*/
console.clear();
import * as h from "three";
import { OrbitControls as i } from "three/addons/controls/OrbitControls.js";
import { OBJLoader as w } from "three/addons/loaders/OBJLoader.js";
import { RGBELoader as e } from "three/addons/loaders/RGBELoader.js";
import "three/addons/exporters/PLYExporter.js";
import * as g from "three/addons/utils/BufferGeometryUtils.js";
{
  let t, s, n, o, d, l, c, r, m, u;
  function a() {
    (t.aspect = window.innerWidth / window.innerHeight),
      t.updateProjectionMatrix(),
      n.setSize(window.innerWidth, window.innerHeight);
  }
  function p() {
    requestAnimationFrame(p), o.update(), n.render(s, t);
  }
  new e().load(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/quarry_01_1k.hdr",
    (e) => {
      (e.mapping = h.EquirectangularReflectionMapping),
        (l = e),
        (async function () {
          (c = await y()),
            (r = new h.Vector3()),
            (t = new h.PerspectiveCamera(
              50,
              window.innerWidth / window.innerHeight,
              0.1,
              1e3
            )).position.set(0, 0, 2),
            t.lookAt(0, 0, 0),
            ((s = new h.Scene()).background = new h.Color(2236962)),
            (s.environment = l),
            s.add(new h.AmbientLight(16777215, 5)),
            s.add(new h.HemisphereLight(16777215, 4473924, 5)),
            (n = new h.WebGLRenderer({
              antialias: !0,
              preserveDrawingBuffer: !0
            })).setPixelRatio(window.devicePixelRatio),
            n.setSize(window.innerWidth, window.innerHeight),
            document.body.appendChild(n.domElement),
            ((o = new i(t, n.domElement)).target.y = 0),
            (o.autoRotate = !1),
            (o.enableDamping = !0),
            (o.enablePan = !1),
            (o.minDistance = 1),
            (o.minPolarAngle = 0),
            (o.maxPolarAngle = Math.PI / 2),
            o.update(),
            (function () {
              const r = new h.MeshPhongMaterial({
                  envMap: l,
                  reflectivity: 1,
                  emissive: 0,
                  specular: 16777215,
                  shininess: 100,
                  flatShading: !0
                }),
                i = new h.Matrix4(),
                a = new h.Color(),
                e = new w();
              e.load(
                "https://happy358.github.io/misc/model/Heart/Heart.obj",
                function (e) {
                  let t = e.children[0].geometry;
                  (t = t.index ? t : g.mergeVertices(t)).computeVertexNormals(),
                    t.computeBoundingBox(),
                    t.computeBoundingSphere();
                  e = new h.MeshLambertMaterial({
                    color: new h.Color("pink"),
                    side: h.DoubleSide,
                    wireframe: !0
                  });
                  (d = t.clone()).scale(0.1, 0.1, 0.11),
                    t.center(),
                    t.computeVertexNormals(),
                    t.computeBoundingBox(),
                    t.computeBoundingSphere(),
                    (d.name = "terrain"),
                    ((u = new h.Mesh(d, e)).visible = !1),
                    (u.userData.physics = { mass: 0 }),
                    s.add(u),
                    c.addMesh(u, 0),
                    (d = new h.IcosahedronGeometry(0.15, 1)),
                    (m = new h.InstancedMesh(d, r, 80)).instanceMatrix.setUsage(
                      h.DynamicDrawUsage
                    ),
                    (m.userData.physics = { mass: 1 });
                  for (let e = 0; e < m.count; e++)
                    i.setPosition(
                      h.MathUtils.randFloat(-0.7, 0.7),
                      h.MathUtils.randFloat(-0.4, 0.2),
                      h.MathUtils.randFloat(-0.2, 0.2)
                    ),
                      m.setMatrixAt(e, i),
                      m.setColorAt(
                        e,
                        a.set(
                          chroma(
                            1,
                            0.8 * Math.random(),
                            300 + 60 * Math.random(),
                            "oklch"
                          ).hex()
                        )
                      );
                  s.add(m), c.addMesh(m, 1);
                  {
                    const o = document.createElement("button");
                    function n(e) {
                      e.preventDefault(),
                        c &&
                          "function" == typeof c.destroy &&
                          (c.destroy(),
                          console.log("Physics engine destroyed."),
                          (o.disabled = !0),
                          (o.style.display = "none"));
                    }
                    (o.className = "btn_stop"),
                      (o.innerText = "STOP Physics"),
                      document.body.appendChild(o),
                      o.addEventListener("pointerdown", n, { passive: !0 }),
                      o.addEventListener("click", n);
                  }
                }
              );
            })(),
            p(),
            window.addEventListener("resize", a);
        })();
    }
  );
}
async function y() {
  if ("Ammo" in window == !1)
    return void console.error("AmmoPhysics: Couldn't find Ammo.js");
  const p = await Ammo();
  const o = new p.btDefaultCollisionConfiguration(),
    r = new p.btCollisionDispatcher(o),
    i = new p.btDbvtBroadphase(),
    a = new p.btSequentialImpulseConstraintSolver(),
    v = new p.btDiscreteDynamicsWorld(r, i, a, o),
    M = (v.setGravity(new p.btVector3(0, 9.8, 0)), new p.btTransform());
  let x = new p.btVector3(0, 0, 0);
  const V = [],
    A = new WeakMap();
  function n(e, t = 0) {
    var n,
      o,
      r,
      i = (function (e) {
        var t = e.parameters;
        let n;
        if ("BoxGeometry" === e.type) {
          var o = void 0 !== t.width ? t.width / 2 : 0.5,
            r = void 0 !== t.height ? t.height / 2 : 0.5,
            i = void 0 !== t.depth ? t.depth / 2 : 0.5;
          n = new p.btBoxShape(new p.btVector3(o, r, i));
        } else if ("IcosahedronGeometry" === e.type) {
          o = void 0 !== t.radius ? t.radius : 1;
          n = new p.btSphereShape(o);
        } else if ("terrain" == e.name) {
          var a = e.attributes.position.array,
            s = e.index.array,
            d = new Ammo.btTriangleMesh();
          for (let e = 0; e < s.length; e += 3) {
            var l = new Ammo.btVector3(
                a[3 * s[e]],
                a[3 * s[e] + 1],
                a[3 * s[e] + 2]
              ),
              c = new Ammo.btVector3(
                a[3 * s[e + 1]],
                a[3 * s[e + 1] + 1],
                a[3 * s[e + 1] + 2]
              ),
              m = new Ammo.btVector3(
                a[3 * s[e + 2]],
                a[3 * s[e + 2] + 1],
                a[3 * s[e + 2] + 2]
              );
            d.addTriangle(l, c, m);
          }
          n = new Ammo.btBvhTriangleMeshShape(d, !0, !0);
        } else {
          var u = e.getAttribute("position");
          n = new Ammo.btConvexHullShape();
          for (let e = 0; e < u.count; e++) {
            var h = u.getX(e),
              w = u.getY(e),
              g = u.getZ(e),
              h = new Ammo.btVector3(h, w, g);
            n.addPoint(h, !0);
          }
        }
        return n.setMargin(0.015), n;
      })(e.geometry);
    if (null !== i)
      if (e.isInstancedMesh) {
        var a = e,
          s = t,
          d = i,
          l = a.instanceMatrix.array,
          c = [];
        for (let e = 0; e < a.count; e++) {
          var m = 16 * e,
            u = new p.btTransform(),
            m =
              (u.setFromOpenGLMatrix(l.slice(m, 16 + m)),
              new p.btDefaultMotionState(u)),
            u = new p.btVector3(0, 0, 0),
            m =
              (d.calculateLocalInertia(s, u),
              new p.btRigidBodyConstructionInfo(s, m, d, u)),
            u = new p.btRigidBody(m);
          u.setRestitution(0), v.addRigidBody(u), c.push(u);
        }
        0 < s && (V.push(a), A.set(a, c));
      } else
        e.isMesh &&
          ((t = t),
          (i = i),
          (n = (e = e).position),
          (o = e.quaternion),
          (r = new p.btTransform()).setIdentity(),
          r.setOrigin(new p.btVector3(n.x, n.y, n.z)),
          r.setRotation(new p.btQuaternion(o.x, o.y, o.z, o.w)),
          (n = new p.btDefaultMotionState(r)),
          (o = new p.btVector3(0, 0, 0)),
          i.calculateLocalInertia(t, o),
          (r = new p.btRigidBodyConstructionInfo(t, n, i, o)),
          (n = new p.btRigidBody(r)).setRestitution(0),
          v.addRigidBody(n),
          0 < t) &&
          (V.push(e), A.set(e, n));
  }
  let B = 0;
  let s = setInterval(function () {
    var n,
      o,
      r,
      i,
      a,
      s,
      d,
      l,
      c,
      m,
      u,
      h,
      e = performance.now();
    if (0 < B) {
      var t = (e - B) / 1e3;
      v.stepSimulation(t, 10);
      for (let e = 0, t = V.length; e < t; e++) {
        var w,
          g,
          p = V[e];
        if (p.isInstancedMesh) {
          var y = p.instanceMatrix.array,
            f = A.get(p);
          for (let t = 0; t < f.length; t++) {
            f[t].getMotionState().getWorldTransform(M);
            var b = M.getOrigin();
            let e;
            b.y() < -3 || 3 < b.y()
              ? (x.setValue(0, 0, 0),
                (e = M.getRotation()).x(0),
                e.y(0),
                e.z(0),
                M.setIdentity(),
                M.setOrigin(x),
                M.setRotation(e),
                f[t].setWorldTransform(M),
                x.setValue(0, 0, 0),
                f[t].setLinearVelocity(x),
                f[t].setAngularVelocity(x),
                f[t].clearForces())
              : (e = M.getRotation()),
              (b = b),
              (n = e),
              (o = y),
              (r = 16 * t),
              (l = d = s = a = h = i = u = m = c = l = d = s = a = i = void 0),
              (i = n.x()),
              (a = n.y()),
              (s = n.z()),
              (n = n.w()),
              (m = i * (d = i + i)),
              (u = i * (l = a + a)),
              (i *= c = s + s),
              (h = a * l),
              (a *= c),
              (s *= c),
              (d *= n),
              (l *= n),
              (n *= c),
              (o[r + 0] = 1 - (h + s)),
              (o[r + 1] = u + n),
              (o[r + 2] = i - l),
              (o[r + 3] = 0),
              (o[r + 4] = u - n),
              (o[r + 5] = 1 - (m + s)),
              (o[r + 6] = a + d),
              (o[r + 7] = 0),
              (o[r + 8] = i + l),
              (o[r + 9] = a - d),
              (o[r + 10] = 1 - (m + h)),
              (o[r + 11] = 0),
              (o[r + 12] = b.x()),
              (o[r + 13] = b.y()),
              (o[r + 14] = b.z()),
              (o[r + 15] = 1);
          }
          (p.instanceMatrix.needsUpdate = !0), p.computeBoundingSphere();
        } else
          p.isMesh &&
            (A.get(p).getMotionState().getWorldTransform(M),
            (w = M.getOrigin()),
            (g = M.getRotation()),
            p.position.set(w.x(), w.y(), w.z()),
            p.quaternion.set(g.x(), g.y(), g.z(), g.w()));
      }
    }
    B = e;
  }, 1e3 / 60);
  return {
    addScene: function (e) {
      e.traverse(function (e) {
        var t;
        e.isMesh && (t = e.userData.physics) && n(e, t.mass);
      });
    },
    addMesh: n,
    setMeshPosition: function (e, t, n = 0) {
      e.isInstancedMesh
        ? ((n = A.get(e)[n]).setAngularVelocity(new p.btVector3(0, 0, 0)),
          n.setLinearVelocity(new p.btVector3(0, 0, 0)),
          M.setIdentity(),
          M.setOrigin(new p.btVector3(t.x, t.y, t.z)),
          n.setWorldTransform(M))
        : e.isMesh &&
          ((n = A.get(e)).setAngularVelocity(new p.btVector3(0, 0, 0)),
          n.setLinearVelocity(new p.btVector3(0, 0, 0)),
          M.setIdentity(),
          M.setOrigin(new p.btVector3(t.x, t.y, t.z)),
          n.setWorldTransform(M));
    },
    destroy: function () {
      clearInterval(s);
      for (const t of V) {
        var e = A.get(t);
        if (Array.isArray(e))
          for (const n of e) v.removeRigidBody(n), p.destroy(n);
        else v.removeRigidBody(e), p.destroy(e);
        A.delete(t);
      }
      (V.length = 0),
        p.destroy(v),
        p.destroy(a),
        p.destroy(i),
        p.destroy(r),
        p.destroy(o),
        p.destroy(x),
        p.destroy(M);
    }
  };
}
export { y as AmmoPhysics };
