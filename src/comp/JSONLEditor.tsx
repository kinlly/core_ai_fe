import React from "react";
import { JSONEditorCard } from "./JSONEditorCard";
import { useToast } from "./Toast";

export function JSONLEditor() {
    const [files, setFiles] = React.useState<string[]>([]);
    const [data, setData] = React.useState<any[]>([]);
    const [bookChapter, setBookChapter] = React.useState('')
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
        setBookChapter(chapter.line);
    }

    async function loadFile(file: string) {
        setData([]);
        setSelectedFile(file);
        const res = await fetch(`http://127.0.0.1:8000/files/${file}`);
        const json = await res.json();
        setData(json);
    }

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            {/* Sidebar izquierda */}
            <div
                style={{
                    width: "250px",
                    flexShrink: 0,
                    padding: "10px",
                    overflowY: "auto",
                    top: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <h3>Available files</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {files.map((f) => (
                        <li key={f} style={{ marginBottom: "8px" }}>
                            <button
                                onClick={() => loadFile(f)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "6px 8px",
                                    border: "1px solid #ddd",
                                    background:
                                        f === selectedFile ? "#e0e0e0" : "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                {f}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Panel derecho */}
            <div
                style={{
                    flex: 1,
                    padding: "20px",
                    overflowY: "auto",
                    width: "100%",
                }}
            >
                {!!bookChapter && <pre>{bookChapter}</pre>}
                {selectedFile ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                            <h4>Content of {selectedFile}</h4>
                            <h4 onClick={() => {
                                if (!bookChapter) {
                                    const splittedString = selectedFile.split('.');
                                    const potencialChapterNumber = splittedString[1];
                                    try {
                                        const chapterNumber = parseInt(potencialChapterNumber);
                                        setOpenBookChapter(chapterNumber);
                                    } catch (e) {
                                        showToast({ message: 'Chapter not found', type: 'error' });
                                    }
                                } else {
                                    setBookChapter('')
                                }
                            }}> {bookChapter ? '📘 Close book 📘' : '📖 Open book 📖'} </h4>
                        </div>
                        <div
                            style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                            }}
                        >
                            {data.map((l, i) => (
                                <JSONEditorCard
                                    key={selectedFile + i}
                                    record={l}
                                    index={i}
                                    selectedFile={selectedFile!}
                                    reload={() => loadFile(selectedFile!)}
                                />)
                            )}
                        </div>
                    </>
                ) : (
                    <p>Select a file to view its content</p>
                )}
            </div>
        </div>
    );
}
