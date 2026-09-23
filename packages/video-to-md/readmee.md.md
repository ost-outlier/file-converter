Regras claras então. O algoritmo fica assim:

- **1 vídeo na pasta** → reivindica todos os não-vídeos recursivamente (para quando encontra subpasta com vídeos próprios)
- **N vídeos na pasta** → todos compartilham os não-vídeos diretos da mesma pasta
- **0 vídeos** → desce nos subdiretórios, sem criar nota

**Como usar:**

```bash
python3 create_course_notes.py \
  "/home/outlier/Drive/immersion" \
  "/home/outlier/Documentos/NeuronNotes/Apeiron/Immersion"
```

---

**O que gera para cada vídeo:**

```markdown
# Aula 1 - Introdução

![](file:///home/outlier/drive/Cursos/Python/Aula%201%20-%20Introdu%C3%A7%C3%A3o.mp4)

## Materiais
- [Resumo.pdf](file:///home/outlier/drive/Cursos/Python/Resumo.pdf)
- [exercicios.html](file:///home/outlier/drive/Cursos/Python/Extras/exercicios.html)
```

---

**Antes de rodar em um curso real**, teste numa pasta pequena com estrutura artificial para confirmar que as associações estão corretas. Se algum comportamento ficar estranho (ex: arquivo aparecendo na nota errada), me mostra a estrutura de pastas e ajustamos a lógica.
