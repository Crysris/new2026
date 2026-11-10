import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

/* ========== 数学公式：一律走 KaTeX（见 规范.md） ========== */

/** 行内公式组件 */
export const Tex: React.FC<{tex: string; display?: boolean; color?: string}> = ({tex, display = false, color}) => (
  <span
    style={{color}}
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(tex, {displayMode: display, throwOnError: true, strict: 'ignore'}),
    }}
  />
);

/** 模板标签写法：{M`\dfrac{\pi}{6}`}，可插值：{M`\cos x=${v}`} */
export const M = (s: TemplateStringsArray, ...v: unknown[]) => <Tex tex={String.raw(s, ...v)} />;

/** SVG 内的公式标签（以 (x, y) 为中心） */
export const TexLabel: React.FC<{
  x: number;
  y: number;
  tex: string;
  o?: number;
  size?: number;
  color?: string;
}> = ({x, y, tex, o = 1, size = 32, color = '#e2e8f0'}) => {
  const w = 600;
  const h = 200;
  return (
    <foreignObject x={x - w / 2} y={y - h / 2} width={w} height={h} opacity={o}>
      <div
        style={{
          width: w,
          height: h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size,
          color,
        }}
      >
        <Tex tex={tex} />
      </div>
    </foreignObject>
  );
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const C = {
  bg: '#0f172a',
  panel: '#1e293b',
  fg: '#e2e8f0',
  dim: '#94a3b8',
  axis: '#475569',
  red: '#ef4444',
  blue: '#38bdf8',
  green: '#22c55e',
  yellow: '#facc15',
};

export const FONT = '"Noto Sans CJK SC","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 线性 0→1 */
export const fade = (f: number, start: number, dur = 15) =>
  interpolate(f, [start, start + dur], [0, 1], clamp);

/** 缓动 0→1 */
export const ease = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

/** 数学角 a（弧度，逆时针）→ SVG 坐标 */
export const P = (cx: number, cy: number, r: number, a: number): [number, number] => [
  cx + r * Math.cos(a),
  cy - r * Math.sin(a),
];

/** 从 a1 逆时针到 a2 的圆弧 */
export const arcPath = (cx: number, cy: number, r: number, a1: number, a2: number) => {
  const [x1, y1] = P(cx, cy, r, a1);
  const [x2, y2] = P(cx, cy, r, a2);
  const large = a2 - a1 > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
};

/** 角度化到 (-π, π] */
export const norm = (a: number) => {
  const t = 2 * Math.PI;
  return ((((a + Math.PI) % t) + t) % t) - Math.PI;
};

/** 是否落在闭禁区 [-π/6, π/6] */
export const inForbidden = (a: number) => Math.abs(norm(a)) <= Math.PI / 6 + 1e-9;

/** 跳跃动画：第 k 次跳在 t0 + k*gap 开始，持续 d 帧 */
export const jumpState = (
  f: number,
  phi: number,
  theta: number,
  n: number,
  t0: number,
  gap: number,
  d: number,
) => {
  let landed = 0;
  let cur = phi;
  let moving = false;
  for (let k = 0; k < n; k++) {
    const s = t0 + k * gap;
    if (f >= s + d) {
      landed = k + 1;
      cur = phi + (k + 1) * theta;
    } else if (f >= s) {
      cur = phi + k * theta + theta * ease(f, s, d);
      moving = true;
      break;
    } else break;
  }
  return {cur, landed, moving};
};

/** 镜头外壳：背景 + 首尾淡入淡出 */
export const SceneShell: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(fade(f, 0, 12), 1 - fade(f, dur - 12, 12));
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, opacity: o, fontFamily: FONT, color: C.fg}}>
      {children}
    </AbsoluteFill>
  );
};

/** 全屏 SVG 画布 */
export const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

/** 绝对定位文字行（带上浮淡入） */
export const Txt: React.FC<{
  x: number;
  y: number;
  o?: number;
  size?: number;
  color?: string;
  width?: number;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}> = ({x, y, o = 1, size = 44, color = C.fg, width, weight = 400, align = 'left', children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      opacity: o,
      transform: `translateY(${(1 - o) * 24}px)`,
      fontSize: size,
      color,
      fontWeight: weight,
      lineHeight: 1.45,
      textAlign: align,
      whiteSpace: width ? 'normal' : 'nowrap',
    }}
  >
    {children}
  </div>
);

/** 荧光笔高亮 */
export const Hl: React.FC<{p: number; color?: string; children: React.ReactNode}> = ({
  p,
  color = 'rgba(250,204,21,0.45)',
  children,
}) => (
  <span
    style={{
      backgroundImage: `linear-gradient(${color},${color})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${p * 100}% 100%`,
      padding: '0 6px',
      borderRadius: 6,
    }}
  >
    {children}
  </span>
);

/** 带边框的强调框 */
export const Box: React.FC<{
  x: number;
  y: number;
  o?: number;
  color?: string;
  size?: number;
  width?: number;
  scale?: number;
  children: React.ReactNode;
}> = ({x, y, o = 1, color = C.yellow, size = 44, width, scale = 1, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      opacity: o,
      transform: `scale(${scale})`,
      transformOrigin: 'left center',
      border: `4px solid ${color}`,
      borderRadius: 18,
      padding: '18px 30px',
      fontSize: size,
      lineHeight: 1.45,
      background: 'rgba(15,23,42,0.85)',
    }}
  >
    {children}
  </div>
);

/** SVG 文字标签 */
export const Label: React.FC<{
  x: number;
  y: number;
  o?: number;
  size?: number;
  color?: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  children: React.ReactNode;
}> = ({x, y, o = 1, size = 32, color = C.fg, weight = 400, anchor = 'middle', children}) => (
  <text
    x={x}
    y={y}
    opacity={o}
    fontSize={size}
    fill={color}
    fontWeight={weight}
    textAnchor={anchor}
    dominantBaseline="middle"
    fontFamily={FONT}
  >
    {children}
  </text>
);

/** 单位圆：坐标轴 + 圆 + 可选竖线 / 红色禁区 */
export const UnitCircle: React.FC<{
  cx: number;
  cy: number;
  r: number;
  draw?: number; // 圆的描绘进度
  axes?: number; // 坐标轴透明度
  forbidden?: number; // 禁区生长进度
  pulse?: number; // 禁区闪烁 0..1
  line?: number; // 竖线 x=√3/2 描绘进度
  endpoints?: number; // 禁区端点透明度
  radial?: number; // 禁区弧的径向偏移（用于"塞进去"动画）
}> = ({cx, cy, r, draw = 1, axes = 1, forbidden = 0, pulse = 0, line = 0, endpoints = 0, radial = 0}) => {
  const L = 2 * Math.PI * r;
  const half = (Math.PI / 6) * forbidden;
  const xLine = cx + (r * Math.sqrt(3)) / 2;
  const rr = r + radial;
  const [sx1, sy1] = P(cx, cy, r, -half);
  const [sx2, sy2] = P(cx, cy, r, half);
  return (
    <g>
      <g opacity={axes} stroke={C.axis} strokeWidth={2}>
        <line x1={cx - r - 50} y1={cy} x2={cx + r + 50} y2={cy} />
        <line x1={cx} y1={cy + r + 50} x2={cx} y2={cy - r - 50} />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.fg}
        strokeWidth={4}
        strokeDasharray={L}
        strokeDashoffset={L * (1 - draw)}
        transform={`rotate(0 ${cx} ${cy})`}
      />
      {line > 0 && (
        <line
          x1={xLine}
          y1={cy - r - 40}
          x2={xLine}
          y2={cy - r - 40 + (2 * r + 80) * line}
          stroke={C.yellow}
          strokeWidth={3}
          strokeDasharray="14 10"
        />
      )}
      {forbidden > 0 && (
        <>
          {radial === 0 && (
            <path
              d={`M ${cx} ${cy} L ${sx1} ${sy1} A ${r} ${r} 0 0 0 ${sx2} ${sy2} Z`}
              fill={C.red}
              opacity={0.14 + 0.2 * pulse}
            />
          )}
          <path
            d={arcPath(cx, cy, rr, -half, half)}
            fill="none"
            stroke={C.red}
            strokeWidth={14 + 8 * pulse}
            strokeLinecap="butt"
          />
        </>
      )}
      {endpoints > 0 &&
        [-Math.PI / 6, Math.PI / 6].map((a) => {
          const [x, y] = P(cx, cy, rr, a);
          return <circle key={a} cx={x} cy={y} r={11} fill={C.red} stroke={C.bg} strokeWidth={3} opacity={endpoints} />;
        })}
    </g>
  );
};

export const Dot: React.FC<{x: number; y: number; r?: number; color?: string; o?: number}> = ({
  x,
  y,
  r = 12,
  color = C.blue,
  o = 1,
}) => <circle cx={x} cy={y} r={r} fill={color} stroke={C.bg} strokeWidth={3} opacity={o} />;
