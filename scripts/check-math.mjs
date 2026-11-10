// 口径检查：源码里（注释除外）不允许出现 Unicode 数学符号或 "a/b" 式分式。
// 所有数学内容必须写成 LaTeX，交给 <Tex> / M`` / <TexLabel> 渲染。
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const BANNED = /[√πθφα-ωΑ-Ω⁄₀-₉⁰-⁹⟹⟺⇒⇔≤≥≠≈≡∈×·°]/;
const SLASH_FRACTION = /(?<![\w)\]])\d+\s*\/\s*\d+(?![\w(])/; // 字面量里的 2/5、√3/2 等
const files = readdirSync('src').filter((f) => /\.(tsx?|jsx?)$/.test(f));

let bad = 0;
for (const f of files) {
  const lines = readFileSync(join('src', f), 'utf8').split('\n');
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    if (/^\s*\*/.test(line)) return; // 块注释行
    // 只检查字符串 / JSX 文本：粗略地取引号、反引号与 >...< 之间的内容
    const texts = [...code.matchAll(/'[^']*'|"[^"]*"|>[^<>{}]+</g)].map((m) => m[0]);
    for (const t of texts) {
      if (BANNED.test(t) || SLASH_FRACTION.test(t)) {
        console.log(`${f}:${i + 1}  ${line.trim()}`);
        bad++;
        break;
      }
    }
  });
}
if (bad) {
  console.error(`\n✗ ${bad} 处数学内容未使用 LaTeX，请改成 M\`...\` / <Tex> / <TexLabel>`);
  process.exit(1);
}
console.log('✓ 数学公式口径检查通过');
