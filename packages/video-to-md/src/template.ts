import type { VideoToMarkdownTemplate } from "./types";

export const templateConfig: VideoToMarkdownTemplate = {
  input: String.raw`E:\Programação\Arquitetura de Software\Roadmap Arquiteto de Software`,
  output: String.raw`C:\Users\ricardo_outlier\NeuronNotes\6. Materiais Brutos\2. Áreas\Programação\Arquitetura de Software\Roadmap Arquiteto de Software`,
  force: true,
  properties: `---

type: "[[Vídeo]]"

author: "[[Renato Augusto]]"
keywords:

  - "[[Arquitetura de Software]]"
  - "[[roadmap]]"

course: "[[Roadmap Arquiteto de software]]"

"url": "\${videoUrl}"
---

`,
};
