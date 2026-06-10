#!/usr/bin/env python3
"""
create_course_notes.py
Gera notas Obsidian para cada vídeo de um curso, com links para todos os materiais.

Uso:
    python3 create_course_notes.py <pasta-do-curso> <pasta-destino-no-vault>

Exemplo:
    python3 create_course_notes.py \
        "/home/outlier/drive/Cursos/Python Avançado" \
        "/home/outlier/vault/Cursos/Python Avançado"
"""

import sys
import urllib.parse
from pathlib import Path

VIDEO_EXTENSIONS = {".mp4", ".mkv", ".avi", ".mov", ".webm", ".m4v", ".flv", ".wmv"}


def is_video(path: Path) -> bool:
    return path.suffix.lower() in VIDEO_EXTENSIONS


def has_direct_video(directory: Path) -> bool:
    """Verifica se o diretório tem pelo menos um vídeo como filho direto."""
    return any(is_video(f) for f in directory.iterdir() if f.is_file())


def has_video_recursive(directory: Path) -> bool:
    """Verifica se o diretório ou qualquer descendente contém vídeo."""
    return any(is_video(f) for f in directory.rglob("*") if f.is_file())


def file_uri(path: Path) -> str:
    """Converte um Path absoluto em URI file:// com encoding correto."""
    encoded = urllib.parse.quote(str(path), safe="/:")
    return f"file://{encoded}"


def collect_resources_recursive(directory: Path) -> list:
    """
    Coleta todos os arquivos não-vídeo recursivamente.
    Não desce em subdiretórios que tenham vídeos diretos (eles se viram sozinhos).
    """
    resources = []
    try:
        for item in sorted(directory.iterdir()):
            if item.is_file() and not is_video(item):
                resources.append(item)
            elif item.is_dir() and not has_direct_video(item):
                resources.extend(collect_resources_recursive(item))
    except PermissionError:
        pass
    return resources


def create_recursos_note(
    directory: Path, resources: list, vault_dir: Path, course_base: Path
):
    """Cria _recursos.md em pastas sem vídeo que tenham arquivos."""
    rel = directory.relative_to(course_base)
    note_path = vault_dir / rel / "_recursos.md"
    note_path.parent.mkdir(parents=True, exist_ok=True)

    lines = [f"# Recursos — {directory.name}", "", "## Materiais"]
    for r in sorted(resources):
        lines.append(f"- [{r.name}]({file_uri(r)})")

    note_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  📁 {note_path.relative_to(vault_dir)}")


def get_friendly_path(path: Path) -> str:
    """Retorna o caminho amigável a partir da pasta 'cursos' (case-insensitive)."""
    parts = path.parts
    for i, part in enumerate(parts):
        if part.lower() == "cursos":
            return "/".join(parts[i:])
    return path.as_posix()


def create_note(video: Path, resources: list, vault_dir: Path, course_base: Path):
    """Cria o arquivo .md para um vídeo no vault."""
    rel = video.relative_to(course_base)
    note_path = vault_dir / rel.with_suffix(".md")
    note_path.parent.mkdir(parents=True, exist_ok=True)

    # Propriedades da nota (YAML frontmatter)
    lines = [
        "---",
        f"video: {get_friendly_path(video)}",
    ]
    if resources:
        lines.append("materials:")
        for r in sorted(resources):
            lines.append(f"  - {get_friendly_path(r)}")
    lines.append("---")

    # Conteúdo da nota
    lines += [
        f"# {video.stem}",
        "",
        "```dataviewjs",
        'await dv.view("scripts/player");',
        "```",
        "",
        f"![ ]({file_uri(video)})",
    ]

    if resources:
        lines += ["", "## 📎 Materiais"]
        for r in sorted(resources):
            lines.append(f"- [{r.name}]({file_uri(r)})")

    note_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  ✓  {note_path.relative_to(vault_dir)}")


def process_directory(directory: Path, vault_dir: Path, course_base: Path):
    """Processa um diretório e desce recursivamente conforme as regras."""
    try:
        items = list(directory.iterdir())
    except PermissionError:
        return

    videos = sorted([f for f in items if f.is_file() and is_video(f)])
    non_videos = sorted([f for f in items if f.is_file() and not is_video(f)])
    subdirs = sorted([d for d in items if d.is_dir()])

    if len(videos) == 1:
        # Vídeo único: reivindica todos os materiais recursivamente
        resources = collect_resources_recursive(directory)
        create_note(videos[0], resources, vault_dir, course_base)

        # Subdiretórios com vídeos próprios são processados de forma independente
        for sub in subdirs:
            if has_video_recursive(sub):
                process_directory(sub, vault_dir, course_base)

    elif len(videos) > 1:
        # Múltiplos vídeos: todos compartilham os não-vídeos diretos da pasta
        for video in videos:
            create_note(video, non_videos, vault_dir, course_base)

        for sub in subdirs:
            process_directory(sub, vault_dir, course_base)

    else:
        # Sem vídeos: cria _recursos.md se houver arquivos, depois desce nos subdiretórios
        if non_videos:
            create_recursos_note(directory, non_videos, vault_dir, course_base)
        for sub in subdirs:
            process_directory(sub, vault_dir, course_base)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    course_dir = Path(sys.argv[1]).resolve()
    vault_dir = Path(sys.argv[2]).resolve()

    if not course_dir.exists():
        print(f"Erro: pasta não encontrada → {course_dir}")
        sys.exit(1)

    print(f"Curso : {course_dir}")
    print(f"Vault : {vault_dir}")
    print()

    process_directory(course_dir, vault_dir, course_dir)

    print("\nConcluído.")


if __name__ == "__main__":
    main()
