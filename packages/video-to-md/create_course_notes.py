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

DRIVE_ROOT = Path("/home/outlier/Drive")

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

    lines = [f"# Recursos — {directory.name}", "", "## 📎 Materiais"]
    for r in sorted(resources):
        lines.append(f"- [{r.name}]({mobile_uri(r)}) | [💻PC]({file_uri(r)})")

    note_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  📁 {note_path.relative_to(vault_dir)}")


def get_friendly_path(path: Path) -> str:
    """Retorna o caminho relativo à raiz do Drive. Se estiver fora dela, retorna o caminho completo."""
    try:
        return path.relative_to(DRIVE_ROOT).as_posix()
    except ValueError:
        return path.as_posix()

def mobile_uri(path: Path) -> str:
    """Converte o caminho amigável para URI http://127.0.0.1:8080/ com encoding correto."""
    friendly = get_friendly_path(path)
    encoded = urllib.parse.quote(friendly, safe="/:")
    return f"http://127.0.0.1:8080/{encoded}"


def get_module_name(video: Path, course_base: Path):
    """
    Retorna o nome da pasta de primeira camada (módulo) em que o vídeo está,
    ou None se o vídeo estiver diretamente na raiz do curso.
    """
    rel = video.relative_to(course_base)
    if len(rel.parts) > 1:
        return rel.parts[0]
    return None


def create_course_note(course_dir: Path, vault_dir: Path):
    """Cria a nota raiz do curso (topo da cadeia addTime), se ainda não existir."""
    note_path = vault_dir / f"{course_dir.name}.md"
    if note_path.exists():
        return
    note_path.parent.mkdir(parents=True, exist_ok=True)

    lines = [
        "---",
        'ordering: "[[nome]]"',
        "sorting-spec: |-",
        f"  {course_dir.name}",
        "  %",
        "---",
        f"# {course_dir.name}",
        "",
        "```dataviewjs",
        'await dv.view("scripts/utils/totalTime");',
        "```",
    ]
    note_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  📘 {note_path.relative_to(vault_dir)}")


def create_module_note(module_dir: Path, vault_dir: Path, course_dir: Path):
    """Cria a nota raiz do módulo (primeira camada de pastas), com addTime pro curso."""
    note_path = vault_dir / module_dir.name / f"{module_dir.name}.md"
    if note_path.exists():
        return
    note_path.parent.mkdir(parents=True, exist_ok=True)

    lines = [
        "---",
        "addTime:",
        f'  - "[[{course_dir.name}]]"',
        "type:",
        '  - "[[Módulo de Curso]]"',
        'ordering: "[[nome]]"',
        "sorting-spec: |-",
        f"  {module_dir.name}",
        "  %",
        "---",
        f"# {module_dir.name}",
        "",
        "```dataviewjs",
        'await dv.view("scripts/utils/totalTime");',
        "```",
    ]
    note_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  📗 {note_path.relative_to(vault_dir)}")


def create_note(video: Path, resources: list, vault_dir: Path, course_base: Path):
    """Cria o arquivo .md para um vídeo no vault."""
    rel = video.relative_to(course_base)
    note_path = vault_dir / rel.with_suffix(".md")
    note_path.parent.mkdir(parents=True, exist_ok=True)

    module_name = get_module_name(video, course_base)
    add_time_target = module_name if module_name else course_base.name

    # Propriedades da nota (YAML frontmatter)
    lines = [
        "---",
        f"video: {get_friendly_path(video)}",
        "theBox:",
        f'  - "[[{add_time_target}]]"',
        "---",
    ]

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
            lines.append(f"- [{r.name}]({mobile_uri(r)}) | [💻PC]({file_uri(r)})")

    lines += [
        "",
        "# Anotações",
        "",
        "# Tempo Investido:",
        "```simple-time-tracker",
        "```",
    ]
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

    # Nota raiz do curso (topo da cadeia addTime)
    create_course_note(course_dir, vault_dir)

    # Notas de módulo (primeira camada de pastas com vídeo em algum lugar dentro)
    for item in sorted(course_dir.iterdir()):
        if item.is_dir() and has_video_recursive(item):
            create_module_note(item, vault_dir, course_dir)

    process_directory(course_dir, vault_dir, course_dir)

    print("\nConcluído.")


if __name__ == "__main__":
    main()
