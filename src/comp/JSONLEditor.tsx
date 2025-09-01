import React from "react";
import { JSONEditorCard } from "./JSONEditorCard";
import { useToast } from "./Toast";
import { JSONEditorLeftBar } from "./JSONEditorLeftBar";
import { BookEditor } from "./BookEditor";

export function JSONLEditor() {
    const [files, setFiles] = React.useState<string[]>([]);
    const [data, setData] = React.useState<any[]>([]);
    const [bookChapterIndex, setBookChapterIndex] = React.useState(-1)
    const [bookChapter, setBookChapter] = React.useState<{
        line: string;
        type: string;
    }[]>();
    const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
    const { showToast } = useToast();

    React.useEffect(() => {
        (async () => {
            const res = await fetch("http://127.0.0.1:8000/files");
            const json = await res.json();
            setFiles(json.files);
        })();
    }, []);

    async function setOpenBookChapter(chapterNumber: number) {
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

        setBookChapter(parsed);
    }

    async function loadFile(file: string) {
        setData([]);
        setSelectedFile(file);
        const res = await fetch(`http://127.0.0.1:8000/files/${file}`);
        const json = await res.json();
        setData(json);
    }

    const reset = () => {
        setBookChapter(undefined);
    }

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            {/* Sidebar izquierda */}
            <JSONEditorLeftBar files={files} loadFile={loadFile} selectedFile={selectedFile} />
            {/* Panel derecho */}
            <div
                style={{
                    flex: 1,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden", // evita que se salga nada del panel derecho
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>Content of {selectedFile}</h4>
                    <h4
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (!selectedFile) return;
                            if (!bookChapter) {
                                const splittedString = selectedFile.split(".");
                                const potencialChapterNumber = splittedString[1];
                                try {
                                    const chapterNumber = parseInt(potencialChapterNumber);
                                    setOpenBookChapter(chapterNumber);
                                    setBookChapterIndex(chapterNumber - 1)
                                } catch (e) {
                                    showToast({ message: "Chapter not found", type: "error" });
                                }
                            } else {
                                reset();
                            }
                        }}
                    >
                        {bookChapter ? "📘 Close book 📘" : "📖 Open book 📖"}
                    </h4>
                </div>
                {
                    !!bookChapter && <BookEditor
                        bookChapter={bookChapter!}
                        bookChapterIndex={bookChapterIndex}
                        reset={reset}
                        setBookChapterIndex={setBookChapterIndex}
                    />
                }
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        minHeight: 0, // clave para que el scroll funcione bien en flexbox
                    }}
                >
                    {selectedFile ? (
                        <>

                            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                {data.map((l, i) => (
                                    <JSONEditorCard
                                        key={selectedFile + i}
                                        record={l}
                                        index={i}
                                        selectedFile={selectedFile!}
                                        reload={() => loadFile(selectedFile!)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Select a file to view its content</p>
                    )}
                </div>
            </div>
        </div >
    );
}
