import type { VideoToMarkdownTemplate } from "./types";

export const templateConfig: VideoToMarkdownTemplate = {
  input: String.raw`E:\Fundamentos de Arquitetura de Software`,
  output: String.raw`C:\Users\ricardo_outlier\Meu Drive\NeuronNotes\6. Materiais Brutos\2. Áreas\Arquitetura de Software`,
  force: true,
  properties: `---

type: "[[Vídeo]]"

enterprise: "[[desenvolvedor.io]]"

author: "[[Eduardo Pires]]"
keywords:

  - "[[Arquitetura de Software]]"

course: "[[fundamentos da arquititetura de software]]"

"url": "\${videoUrl}"
---

`,
};
