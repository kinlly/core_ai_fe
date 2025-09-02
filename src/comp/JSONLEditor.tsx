import React from "react";
import { JSONEditorCard } from "./JSONEditorCard";
import { useToast } from "./Toast";
import { JSONEditorLeftBar } from "./JSONEditorLeftBar";
import { BookEditor } from "./BookEditor";
import { requestBookChapterInfo, requestFileByName, requestFiles } from "./backend.helper";

export function JSONLEditor() {
    const [files, setFiles] = React.useState<{ name: string, size: number }[]>([]);
    const [data, setData] = React.useState<any[]>([]);
    const [bookChapterIndex, setBookChapterIndex] = React.useState(-1)
    const [bookChapter, setBookChapter] = React.useState<{
        line: string;
        type: string;
    }[]>();
    const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null);
    const { showToast } = useToast();

    React.useEffect(() => {
        (async () => {
            const filesResult = await requestFiles();
            setFiles(filesResult);
        })();
    }, []);

    const openChapter = async (selectedFile: string) => {
        const splittedString = selectedFile.split(".");
        const potencialChapterNumber = splittedString[1];
        try {
            const chapterNumber = parseInt(potencialChapterNumber);
            const bookChapterInfo = await requestBookChapterInfo(chapterNumber);
            setBookChapter(bookChapterInfo)
            setBookChapterIndex(chapterNumber - 1)
        } catch (e) {
            showToast({ message: "Chapter not found", type: "error" });
        }
    }

    const closeChapter = () => {
        setBookChapter(undefined);
    }

    const toggleBookCallback = async () => {
        if (!selectedFileName) return;
        if (!bookChapter) {
            await openChapter(selectedFileName);
        } else {
            closeChapter();
        }
    }

    const loadFile = async (fileName: string) => {
        const file = await requestFileByName(fileName);
        setData(file);
        setSelectedFileName(fileName);
        await openChapter(fileName);
    }

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            <JSONEditorLeftBar files={files} loadFile={loadFile} selectedFileName={selectedFileName} />
            <div
                key={selectedFileName}
                style={{
                    flex: 1,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden", // evita que se salga nada del panel derecho
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>Content of {selectedFileName}</h4>
                    <h4
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleBookCallback()}
                    >
                        {bookChapter ? "📘 Close book 📘" : "📖 Open book 📖"}
                    </h4>
                </div>
                {
                    !!bookChapter && <BookEditor
                        key={selectedFileName}
                        bookChapter={bookChapter!}
                        bookChapterIndex={bookChapterIndex}
                    />
                }
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        minHeight: 0,
                    }}
                >
                    {selectedFileName ? (
                        <>

                            <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                {data.map((l, i) => (
                                    <JSONEditorCard
                                        key={selectedFileName + i}
                                        record={l}
                                        index={i}
                                        selectedFileName={selectedFileName!}
                                        reload={() => loadFile(selectedFileName!)}
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
