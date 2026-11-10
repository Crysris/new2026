import React from 'react';
import {AbsoluteFill, Composition, Series} from 'remotion';
import {C, FPS} from './lib';
import {
  Scene0Intro,
  Scene1Forbidden,
  Scene2Jumping,
  Scene3SmallStep,
  Scene4TwoFates,
  Scene5Gap,
  Scene6Answer,
  Scene7Mistakes,
  Scene8Summary,
} from './scenes';

// 每个镜头的时长（秒）——配音录好后改这里即可
export const SCENES: {name: string; seconds: number; C: React.FC<{dur: number}>}[] = [
  {name: '0 开场', seconds: 20, C: Scene0Intro},
  {name: '1 禁区', seconds: 40, C: Scene1Forbidden},
  {name: '2 跳跃的点', seconds: 40, C: Scene2Jumping},
  {name: '3 步子太小', seconds: 35, C: Scene3SmallStep},
  {name: '4 两种命运', seconds: 50, C: Scene4TwoFates},
  {name: '5 塞进缝里', seconds: 55, C: Scene5Gap},
  {name: '6 求最小值', seconds: 50, C: Scene6Answer},
  {name: '7 易错点', seconds: 30, C: Scene7Mistakes},
  {name: '8 总结', seconds: 25, C: Scene8Summary},
];

const TOTAL = SCENES.reduce((s, x) => s + Math.round(x.seconds * FPS), 0);

const Video: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    {/* 配音：把音频放到 public/voice.mp3 后取消下一行注释，并 import {Audio, staticFile} from 'remotion' */}
    {/* <Audio src={staticFile('voice.mp3')} /> */}
    <Series>
      {SCENES.map(({name, seconds, C: Scene}) => {
        const dur = Math.round(seconds * FPS);
        return (
          <Series.Sequence key={name} name={name} durationInFrames={dur}>
            <Scene dur={dur} />
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="UnitCircleTheta"
      component={Video}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* 单独预览某个镜头，方便调试 */}
    {SCENES.map(({name, seconds, C: Scene}, i) => {
      const dur = Math.round(seconds * FPS);
      const Comp: React.FC = () => <Scene dur={dur} />;
      return (
        <Composition
          key={name}
          id={`Scene${i}`}
          component={Comp}
          durationInFrames={dur}
          fps={FPS}
          width={1920}
          height={1080}
        />
      );
    })}
  </>
);
