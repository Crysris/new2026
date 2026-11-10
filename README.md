# 单位圆解 2021 上海高考题：cos(nθ+φ)<√3/2

## 运行
```bash
npm install
npm start          # 打开 Remotion Studio 预览（可单独选 Scene0~Scene8 调试）
npm run check      # 数学公式口径检查 + 类型检查
npm run build      # 先检查，再渲染到 out/video.mp4
```

## 文件
- `src/Root.tsx`：镜头列表与时长（`SCENES` 数组，单位秒）。配音录好后改这里对齐
- `src/scenes.tsx`：9 个镜头的动画，每个镜头内的关键帧数字（如 `fade(f, 360)`）是镜头内的帧号（30fps）
- `src/lib.tsx`：单位圆、禁区弧、跳点等通用组件与配色

## 加配音
把音频放到 `public/voice.mp3`，在 `Root.tsx` 中取消 `<Audio>` 那行的注释。

## 公式口径
所有数学内容用 LaTeX + KaTeX 渲染，详见 `规范.md`。
