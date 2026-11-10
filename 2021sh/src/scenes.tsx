import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  Box,
  C,
  Canvas,
  Dot,
  Hl,
  Label,
  M,
  P,
  Tex,
  SceneShell,
  TexLabel,
  Txt,
  UnitCircle,
  arcPath,
  ease,
  fade,
  inForbidden,
  jumpState,
} from './lib';

const PI = Math.PI;

/* ------------------------------------------------------------------ */
/* 镜头 0｜开场                                                        */
/* ------------------------------------------------------------------ */
export const Scene0Intro: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <SceneShell dur={dur}>
      <Txt x={0} y={140} width={1920} align="center" size={40} color={C.dim} o={fade(f, 10, 20)}>
        2021 · 上海高考 · 填空压轴
      </Txt>
      <Txt x={160} y={330} width={1600} size={58} o={fade(f, 40, 25)}>
        已知 {M`\theta>0`}，<Hl p={ease(f, 150, 25)}>存在实数 {M`\varphi`}</Hl>，
        <Hl p={ease(f, 210, 25)}>对任意 {M`n\in\mathbf{N}^*`}</Hl>，使得 {M`\cos(n\theta+\varphi)<\dfrac{\sqrt{3}}{2}`}，
        则 {M`\theta`} 的<Hl p={ease(f, 270, 25)}>最小值</Hl>是 ______
      </Txt>
      <Txt x={0} y={720} width={1920} align="center" size={52} color={C.blue} weight={700} o={fade(f, 380, 25)}>
        不硬算 —— 把它放到单位圆上
      </Txt>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 1｜把不等式翻译成禁区                                           */
/* ------------------------------------------------------------------ */
export const Scene1Forbidden: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const cx = 560;
  const cy = 540;
  const r = 320;
  const s3 = Math.sqrt(3) / 2;

  // 演示点：760 帧后绕圆一周
  const demoO = fade(f, 760, 20);
  const a = PI / 2 + interpolate(f, [790, 1150], [0, 2 * PI], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const [dx, dy] = P(cx, cy, r, a);
  const bad = inForbidden(a);

  const [e1x, e1y] = P(cx, cy, r, PI / 6);
  const [e2x, e2y] = P(cx, cy, r, -PI / 6);

  return (
    <SceneShell dur={dur}>
      <Canvas>
        <UnitCircle
          cx={cx}
          cy={cy}
          r={r}
          draw={ease(f, 0, 45)}
          axes={fade(f, 0, 30)}
          line={ease(f, 60, 40)}
          forbidden={ease(f, 180, 40)}
          endpoints={fade(f, 220, 15)}
        />
        <TexLabel x={cx + r * s3 + 10} y={cy - r - 75} o={fade(f, 90)} color={C.yellow} size={30} tex={String.raw`x=\dfrac{\sqrt{3}}{2}`} />
        {/* 端点角度标签 */}
        <TexLabel x={e1x + 60} y={e1y - 30} o={fade(f, 120)} size={30} tex={String.raw`\dfrac{\pi}{6}`} />
        <TexLabel x={e2x + 70} y={e2y + 30} o={fade(f, 120)} size={30} tex={String.raw`-\dfrac{\pi}{6}`} />
        {/* 圆心角 */}
        <g opacity={fade(f, 300)}>
          <line x1={cx} y1={cy} x2={e1x} y2={e1y} stroke={C.red} strokeWidth={2} strokeDasharray="8 6" />
          <line x1={cx} y1={cy} x2={e2x} y2={e2y} stroke={C.red} strokeWidth={2} strokeDasharray="8 6" />
          <path d={arcPath(cx, cy, 70, -PI / 6, PI / 6)} fill="none" stroke={C.red} strokeWidth={3} />
          <TexLabel x={cx + 130} y={cy - 4} color={C.red} size={28} tex={String.raw`60^\circ`} />
        </g>
        <Label x={cx + r + 95} y={cy} o={fade(f, 240)} color={C.red} size={44} weight={700}>
          禁区
        </Label>
        {/* 演示点 + 投影 */}
        <g opacity={demoO}>
          <line x1={dx} y1={dy} x2={dx} y2={cy} stroke={bad ? C.red : C.blue} strokeWidth={3} strokeDasharray="6 6" />
          <Dot x={dx} y={cy} r={8} color={bad ? C.red : C.blue} />
          <Dot x={dx} y={dy} r={16} color={bad ? C.red : C.blue} />
        </g>
      </Canvas>

      <Txt x={1040} y={170} o={fade(f, 360, 20)} size={46}>
        {M`\cos x`} = 单位圆上点的<span style={{color: C.blue}}>横坐标</span>
      </Txt>
      <Txt x={1040} y={280} o={fade(f, 450, 20)} size={46}>
        {M`\cos x<\dfrac{\sqrt{3}}{2}\ \Leftrightarrow`} 点在竖线<span style={{color: C.yellow}}>左侧</span>
      </Txt>
      <Txt x={1040} y={410} o={fade(f, 540, 20)} size={46}>
        {M`\Leftrightarrow`} 不落在<span style={{color: C.red}}>红色弧</span>上（含端点）
      </Txt>
      <Box x={1040} y={530} o={fade(f, 640, 20)} color={C.red} size={46}>
        禁区：闭弧 {M`\left[-\dfrac{\pi}{6},\dfrac{\pi}{6}\right]`}
        <br />
        圆心角 <span style={{color: C.red}}>{M`\dfrac{\pi}{3}=60^\circ`}</span>
      </Box>
      <Txt x={1040} y={830} o={demoO} size={48} color={bad ? C.red : C.blue} weight={700}>
        {bad ? M`\cos x=${Math.cos(a).toFixed(3)}\geqslant 0.866` : M`\cos x=${Math.cos(a).toFixed(3)}<0.866`} {bad ? '✗' : '✓'}
      </Txt>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 2｜一只跳跃的点                                                 */
/* ------------------------------------------------------------------ */
export const Scene2Jumping: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const cx = 560;
  const cy = 540;
  const r = 320;
  const phi = 1.2; // 起点
  const theta = 1.9; // 每步转角
  const N = 5;
  const {cur, landed} = jumpState(f, phi, theta, N, 130, 60, 36);

  const [sx, sy] = P(cx, cy, r, phi);
  const [mx, my] = P(cx, cy, r, cur);

  return (
    <SceneShell dur={dur}>
      <Canvas>
        <UnitCircle cx={cx} cy={cy} r={r} forbidden={1} endpoints={1} />
        {/* 起点角 φ */}
        <g opacity={fade(f, 30)}>
          <path d={arcPath(cx, cy, 60, 0, phi)} fill="none" stroke={C.dim} strokeWidth={3} />
          <TexLabel x={cx + 95 * Math.cos(phi / 2)} y={cy - 95 * Math.sin(phi / 2)} color={C.dim} size={34} tex={String.raw`\varphi`} />
          <Dot x={sx} y={sy} r={13} color={C.dim} />
          <Label {...lab(cx, cy, r, phi)} color={C.dim} size={32}>起点</Label>
        </g>
        {/* 第一步的 θ 标注 */}
        <g opacity={fade(f, 130) * (1 - fade(f, 220))}>
          <path d={arcPath(cx, cy, r + 30, phi, phi + theta)} fill="none" stroke={C.blue} strokeWidth={3} />
          <TexLabel {...lab(cx, cy, r + 30, phi + theta / 2)} color={C.blue} size={40} tex={String.raw`\theta`} />
        </g>
        {/* 已落下的点 */}
        {Array.from({length: landed}).map((_, k) => {
          const ang = phi + (k + 1) * theta;
          const [x, y] = P(cx, cy, r, ang);
          return (
            <g key={k}>
              <Dot x={x} y={y} r={12} color={C.blue} />
              <TexLabel {...lab(cx, cy, r, ang)} color={C.blue} size={30} tex={`P_${k + 1}`} />
            </g>
          );
        })}
        {f >= 130 && <Dot x={mx} y={my} r={16} color={C.yellow} />}
      </Canvas>

      <Txt x={1040} y={200} o={fade(f, 60, 20)} size={50}>
        第 {M`n`} 个点的角度：<span style={{color: C.blue}}>{M`\varphi+n\theta`}</span>
      </Txt>
      <Txt x={1040} y={300} o={fade(f, 480, 20)} size={44} color={C.dim}>
        {M`\varphi`}：起点　　{M`\theta`}：每一步转过的角
      </Txt>
      <Box x={1040} y={440} width={780} o={fade(f, 620, 20)} color={C.yellow} size={46}>
        能否挑一个起点 {M`\varphi`}，让点
        <b style={{color: C.yellow}}> 永远 </b>
        不踩进<span style={{color: C.red}}>红色禁区</span>？
      </Box>
      <Txt x={1040} y={720} o={fade(f, 820, 20)} size={52} weight={700}>
        求 {M`\theta`} 的 <span style={{color: C.yellow}}>最小值</span>
      </Txt>
    </SceneShell>
  );
};

/** 在角 a 方向、圆外侧放标签 */
const lab = (cx: number, cy: number, r: number, a: number, off = 48) => {
  const [x, y] = P(cx, cy, r + off, a);
  return {x, y};
};

/* ------------------------------------------------------------------ */
/* 镜头 3｜步子太小一定踩雷                                             */
/* ------------------------------------------------------------------ */
export const Scene3SmallStep: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const cx = 560;
  const cy = 540;
  const r = 320;
  const phi = (40 * PI) / 180;
  const theta = (40 * PI) / 180;
  const N = 8;
  const t0 = 60;
  const gap = 45;
  const {cur, landed} = jumpState(f, phi, theta, N, t0, gap, 30);
  const hit = landed === N;
  const pulse = hit ? 0.5 + 0.5 * Math.sin((f - (t0 + N * gap)) / 4) : 0;
  const [mx, my] = P(cx, cy, r, cur);

  return (
    <SceneShell dur={dur}>
      <Canvas>
        <UnitCircle cx={cx} cy={cy} r={r} forbidden={1} endpoints={1} pulse={pulse} />
        {(() => {
          const [x, y] = P(cx, cy, r, phi);
          return <Dot x={x} y={y} r={11} color={C.dim} />;
        })()}
        {Array.from({length: landed}).map((_, k) => {
          const ang = phi + (k + 1) * theta;
          const [x, y] = P(cx, cy, r, ang);
          const bad = inForbidden(ang);
          return <Dot key={k} x={x} y={y} r={bad ? 18 : 12} color={bad ? C.red : C.blue} />;
        })}
        {f >= t0 && !hit && <Dot x={mx} y={my} r={16} color={C.yellow} />}
        <Label x={cx + r + 80} y={cy - 70} o={hit ? fade(f, t0 + N * gap) : 0} color={C.red} size={72} weight={700}>
          ✗
        </Label>
      </Canvas>

      <Txt x={1040} y={200} o={fade(f, 20, 20)} size={52}>
        {M`\theta=40^\circ`} <span style={{color: C.red}}>{M`<60^\circ`}</span>
      </Txt>
      <Txt x={1040} y={300} o={fade(f, 30, 20)} size={40} color={C.dim}>
        第 {Math.max(landed, 0)} 步
      </Txt>
      <Txt x={1040} y={420} o={fade(f, 520, 20)} size={46}>
        步子比禁区窄 → 跨不过去
      </Txt>
      <Box x={1040} y={540} o={fade(f, 620, 20)} color={C.red} size={46}>
        {M`\theta<60^\circ\ \Rightarrow`} 不管起点在哪都失败
      </Box>
      <Txt x={1040} y={760} o={fade(f, 760, 20)} size={52} color={C.yellow} weight={700}>
        那 {M`\theta>60^\circ`} 就一定行吗？
      </Txt>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 4｜落点的两种命运                                               */
/* ------------------------------------------------------------------ */
export const Scene4TwoFates: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const cy = 560;
  const r = 270;

  // 左：θ = 1 弧度（无理倍）
  const Lx = 480;
  const lPhi = 2.0;
  const lCount = Math.floor(
    interpolate(f, [60, 900], [0, 320], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t}),
  );
  const lBad = Array.from({length: lCount}).filter((_, k) => inForbidden(lPhi + (k + 1))).length;

  // 右：θ = 2π·2/5
  const Rx = 1440;
  const rPhi = PI / 5;
  const rTheta = (4 * PI) / 5;
  const {cur, landed} = jumpState(f, rPhi, rTheta, 10, 60, 45, 30);
  const [mx, my] = P(Rx, cy, r, cur);
  const penta = [1, 3, 5, 7, 9].map((k) => P(Rx, cy, r, (k * PI) / 5));

  return (
    <SceneShell dur={dur}>
      <div style={{position: 'absolute', left: 959, top: 80, width: 2, height: 920, background: C.axis}} />
      <Canvas>
        {/* 左 */}
        <UnitCircle cx={Lx} cy={cy} r={r} forbidden={1} endpoints={1} pulse={lBad > 0 ? 0.6 : 0} />
        {Array.from({length: lCount}).map((_, k) => {
          const ang = lPhi + (k + 1);
          const [x, y] = P(Lx, cy, r, ang);
          const bad = inForbidden(ang);
          return <Dot key={k} x={x} y={y} r={bad ? 9 : 7} color={bad ? C.red : C.blue} o={0.9} />;
        })}
        {/* 右 */}
        <UnitCircle cx={Rx} cy={cy} r={r} forbidden={1} endpoints={1} />
        <polygon
          points={penta.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="rgba(56,189,248,0.10)"
          stroke={C.blue}
          strokeWidth={3}
          opacity={fade(f, 540, 30)}
        />
        {Array.from({length: Math.min(landed, 5)}).map((_, k) => {
          const ang = rPhi + (k + 1) * rTheta;
          const [x, y] = P(Rx, cy, r, ang);
          return (
            <g key={k}>
              <Dot x={x} y={y} r={13} color={C.blue} />
              <TexLabel {...lab(Rx, cy, r, ang, 44)} size={28} color={C.blue} tex={`P_${k + 1}`} />
            </g>
          );
        })}
        {f >= 60 && f < 520 && <Dot x={mx} y={my} r={16} color={C.yellow} />}
      </Canvas>

      <Txt x={0} y={40} width={960} align="center" size={44} o={fade(f, 10)}>
        {M`\theta=1`}（弧度）
      </Txt>
      <Txt x={0} y={150} width={960} align="center" size={34} color={C.dim} o={fade(f, 10)}>
        {M`\dfrac{\theta}{2\pi}`} 是无理数　·　已撒 {lCount} 个点
      </Txt>
      <Txt x={960} y={30} width={960} align="center" size={44} o={fade(f, 10)}>
        {M`\theta=2\pi\cdot\dfrac{2}{5}`}
      </Txt>
      <Txt x={960} y={160} width={960} align="center" size={34} color={C.dim} o={fade(f, 10)}>
        已跳 {landed} 步
      </Txt>
      <Txt x={0} y={900} width={960} align="center" size={44} color={C.red} weight={700} o={fade(f, 920, 20)}>
        越撒越密 → 必进禁区 ✗
      </Txt>
      <Txt x={960} y={880} width={960} align="center" size={40} o={fade(f, 300, 20)} color={C.yellow}>
        转 5 步回到起点，此后循环
      </Txt>
      <Txt x={960} y={940} width={960} align="center" size={40} o={fade(f, 620, 20)} weight={700}>
        落点 = <span style={{color: C.blue}}>正 {M`q`} 边形</span>顶点，间隔 {M`\dfrac{2\pi}{q}`}
      </Txt>
      <div style={{position: 'absolute', inset: 0, background: C.bg, opacity: fade(f, 1100, 25) * 0.7}} />
      <Box x={460} y={420} width={1000} o={fade(f, 1100, 25)} color={C.yellow} size={44}>
        {M`\theta=2\pi\cdot\dfrac{p}{q}`}（{M`\dfrac{p}{q}`} 既约）
        <br />
        {M`\Rightarrow`} 落点恰好是正 {M`q`} 边形的 {M`q`} 个顶点
      </Box>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 5｜禁区要能塞进缝里                                             */
/* ------------------------------------------------------------------ */
const GapPanel: React.FC<{f: number; q: number; cx: number; start: number}> = ({f, q, cx, start}) => {
  const cy = 400;
  const r = 210;
  const verts = Array.from({length: q}).map((_, k) => PI / q + (2 * PI * k) / q);
  const p = ease(f, start, 60);
  const judged = f >= start + 75;
  const ok = q === 5;
  const gapDeg = (360 / q).toFixed(q === 7 ? 1 : 0);

  return (
    <g>
      <UnitCircle cx={cx} cy={cy} r={r} axes={0.6} forbidden={f >= start ? 1 : 0} radial={110 * (1 - p)} endpoints={f >= start ? 1 : 0} />
      <polygon
        points={verts.map((a) => P(cx, cy, r, a).join(',')).join(' ')}
        fill="none"
        stroke={C.dim}
        strokeWidth={2}
        opacity={fade(f, 0, 40) * 0.6}
      />
      {verts.map((a, i) => {
        const [x, y] = P(cx, cy, r, a);
        const hit = judged && inForbidden(a);
        return (
          <Dot key={i} x={x} y={y} r={hit ? 17 : 12} color={hit ? C.yellow : judged && ok ? C.green : C.blue} o={fade(f, 0, 40)} />
        );
      })}
      <TexLabel x={cx} y={cy - r - 60} size={42} o={fade(f, 0, 30)} tex={`q=${q}`} />
      <TexLabel x={cx} y={cy + r + 75} size={32} color={C.dim} o={fade(f, 60, 20)} tex={String.raw`\text{间隙 }\dfrac{2\pi}{q}=${gapDeg}^\circ`} />
      <TexLabel
        x={cx}
        y={cy + r + 160}
        size={36}
        color={ok ? C.green : C.red}
        o={fade(f, start + 75, 15)}
        tex={q === 7 ? String.raw`\text{✗ 塞不下}` : q === 6 ? String.raw`\text{✗ 端点压线}` : String.raw`\text{✓ 两侧各余 }6^\circ`}
      />
    </g>
  );
};

export const Scene5Gap: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <SceneShell dur={dur}>
      <Canvas>
        <GapPanel f={f} q={7} cx={330} start={200} />
        <GapPanel f={f} q={6} cx={960} start={500} />
        <GapPanel f={f} q={5} cx={1590} start={800} />
      </Canvas>
      <Box x={430} y={795} width={1060} o={fade(f, 1150, 25)} color={C.yellow} size={50}>
        需要 {M`\dfrac{2\pi}{q}>\dfrac{\pi}{3}\ \Rightarrow\ q<6\ \Rightarrow`} <span style={{color: C.yellow}}>{M`q\leqslant 5`}</span>
      </Box>
      <Txt x={0} y={978} width={1920} align="center" size={30} color={C.dim} o={fade(f, 1400, 20)}>
        {M`q=6`}：端点处 {M`\cos\dfrac{\pi}{6}=\dfrac{\sqrt{3}}{2}`}，不满足「严格小于」
      </Txt>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 6｜求最小值并验证                                               */
/* ------------------------------------------------------------------ */
export const Scene6Answer: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cx = 1400;
  const cy = 500;
  const r = 280;
  const names = [String.raw`\dfrac{3\pi}{5}`, String.raw`\pi`, String.raw`\dfrac{7\pi}{5}`, String.raw`\dfrac{9\pi}{5}`, String.raw`\dfrac{\pi}{5}`];
  const rows: [string, string, string, boolean][] = [
    ['n=1', String.raw`\dfrac{3\pi}{5}`, String.raw`\approx -0.309`, false],
    ['n=2', String.raw`\pi`, String.raw`=-1`, false],
    ['n=3', String.raw`\dfrac{7\pi}{5}`, String.raw`\approx -0.309`, false],
    ['n=4', String.raw`\dfrac{9\pi}{5}`, String.raw`\approx 0.809`, true],
    ['n=5', String.raw`\dfrac{11\pi}{5}\equiv\dfrac{\pi}{5}`, String.raw`\approx 0.809`, true],
  ];
  const s = spring({frame: f - 1200, fps, config: {damping: 12}});

  return (
    <SceneShell dur={dur}>
      <Canvas>
        <UnitCircle cx={cx} cy={cy} r={r} forbidden={1} endpoints={1} />
        {[1, 2, 3, 4, 5].map((n, i) => {
          const a = ((2 * n + 1) * PI) / 5;
          const [x, y] = P(cx, cy, r, a);
          const o = fade(f, 300 + i * 60, 15);
          return (
            <g key={n} opacity={o}>
              <Dot x={x} y={y} r={14} color={C.green} />
              <TexLabel {...lab(cx, cy, r, a, 55)} size={28} color={C.green} tex={names[i]} />
            </g>
          );
        })}
        <polygon
          points={[1, 3, 5, 7, 9].map((k) => P(cx, cy, r, (k * PI) / 5).join(',')).join(' ')}
          fill="none"
          stroke={C.green}
          strokeWidth={2}
          opacity={fade(f, 600, 30) * 0.6}
        />
      </Canvas>

      <Txt x={120} y={50} o={fade(f, 0, 20)} size={40}>
        {M`\theta=2\pi\cdot\dfrac{p}{q}`}，{M`q\leqslant 5`}，{M`p\geqslant 1`}
      </Txt>
      <Txt x={120} y={160} o={fade(f, 120, 20)} size={42}>
        {M`\Rightarrow\ \theta\geqslant`} <span style={{color: C.yellow}}>{M`\dfrac{2\pi}{5}`}</span>
      </Txt>
      <Txt x={120} y={270} o={fade(f, 240, 20)} size={36} color={C.green}>
        取 {M`\theta=\dfrac{2\pi}{5},\ \varphi=\dfrac{\pi}{5}`}，{M`n\theta+\varphi=\dfrac{(2n+1)\pi}{5}`}
      </Txt>
      {rows.map(([n, ang, val, near], i) => (
        <Txt key={n} x={150} y={370 + i * 84} o={fade(f, 650 + i * 55, 15)} size={30} color={near ? C.yellow : C.fg}>
          <div style={{display: 'flex', alignItems: 'center', height: 80}}>
            <span style={{width: 120, color: C.dim}}><Tex tex={n} /></span>
            <span style={{width: 260}}><Tex tex={ang} /></span>
            <Tex tex={String.raw`\cos` + ' ' + val} />
          </div>
        </Txt>
      ))}
      <Txt x={120} y={815} o={fade(f, 1000, 20)} size={36}>
        {M`\max=\cos\dfrac{\pi}{5}\approx 0.809<\dfrac{\sqrt{3}}{2}\approx 0.866`} <span style={{color: C.green}}>✓</span>
      </Txt>
      <Box x={120} y={925} o={fade(f, 1200, 10)} scale={0.6 + 0.4 * s} color={C.yellow} size={52}>
        {M`\theta`} 的最小值 = <span style={{color: C.yellow}}>{M`\dfrac{2\pi}{5}`}</span>
      </Box>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 7｜易错点                                                       */
/* ------------------------------------------------------------------ */
export const Scene7Mistakes: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const cards = [
    {t: 30, wrong: <>{M`\dfrac{\pi}{3}`}</>, why: <>正六边形，禁区端点正好压在顶点上</>},
    {t: 300, wrong: <>{M`\theta>\dfrac{\pi}{3}`} 都行</>, why: <>反例 {M`\theta=\dfrac{2\pi}{7}`}：正七边形间隙只有 {M`51.4^\circ`}</>},
    {t: 600, wrong: <>只验证前几项</>, why: <>「对任意 {M`n`}」要看整个循环</>},
  ];
  return (
    <SceneShell dur={dur}>
      <Txt x={0} y={70} width={1920} align="center" size={56} weight={700} o={fade(f, 0, 15)}>
        易错点
      </Txt>
      {cards.map((c, i) => {
        const o = fade(f, c.t, 20);
        const x = fade(f, c.t + 60, 12);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 120 + i * 580,
              top: 260,
              width: 520,
              height: 520,
              opacity: o,
              transform: `translateY(${(1 - o) * 40}px)`,
              background: C.panel,
              borderRadius: 24,
              padding: 40,
              boxSizing: 'border-box',
            }}
          >
            <div style={{fontSize: 30, color: C.dim}}>错答 {i + 1}</div>
            <div style={{fontSize: 56, fontWeight: 700, marginTop: 30, position: 'relative', display: 'inline-block'}}>
              {c.wrong}
              <div
                style={{
                  position: 'absolute',
                  left: -10,
                  top: '52%',
                  height: 8,
                  width: `${x * 110}%`,
                  background: C.red,
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{fontSize: 40, marginTop: 60, lineHeight: 1.5, opacity: x}}>{c.why}</div>
            <div style={{position: 'absolute', right: 40, bottom: 30, fontSize: 90, color: C.red, opacity: x}}>✗</div>
          </div>
        );
      })}
      <Txt x={0} y={880} width={1920} align="center" size={44} color={C.yellow} o={fade(f, 780, 20)}>
        决定成败的不是单步多大，而是落点围成的正多边形够不够稀疏
      </Txt>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ */
/* 镜头 8｜方法总结                                                     */
/* ------------------------------------------------------------------ */
export const Scene8Summary: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <SceneShell dur={dur}>
      <Txt x={0} y={120} width={1920} align="center" size={56} weight={700} o={fade(f, 0, 15)}>
        两步翻译
      </Txt>
      <Box x={260} y={300} width={1400} o={fade(f, 40, 20)} color={C.red} size={52}>
        ① 三角不等式 → 单位圆上的<b style={{color: C.red}}>「禁区弧」</b>
      </Box>
      <Box x={260} y={500} width={1400} o={fade(f, 200, 20)} color={C.blue} size={52}>
        ② 等差的角 {M`n\theta+\varphi`} → <b style={{color: C.blue}}>正 {M`q`} 边形的顶点</b>
      </Box>
      <Txt x={0} y={800} width={1920} align="center" size={48} color={C.dim} o={fade(f, 500, 25)}>
        下期见 👋
      </Txt>
    </SceneShell>
  );
};
