export async function requestBookChapterInfo(chapterNumber: number) {
    const res = await fetch(`http://127.0.0.1:8000/book/${chapterNumber}`);
    const chapter = await res.json();
    const parsed = (chapter.line as string)
        .replace(/\\n/g, '\n')        // convertir "\n" en saltos reales
        .split('\n')                  // dividir por línea
        .map(l => l.trim())           // quitar espacios delante y detrás
        .filter(l => !/^\d+$/.test(l))// quitar solo números
        .map(l => ({
            line: l,
            type: /^[^:]+:/.test(l) ? "character" : "description"
        }));

    return parsed;
}

export async function requestBook() {
    const res = await fetch("http://127.0.0.1:8000/book");
    const json = await res.json();
    return json;
}

export async function requestFiles() {
    const res = await fetch("http://127.0.0.1:8000/files");
    const json = await res.json();
    return json.files;
}

export async function requestFileByName(fileName: string) {
    const res = await fetch(`http://127.0.0.1:8000/files/${fileName}`);
    const file = await res.json();
    return file;
}