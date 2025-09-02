import React from "react";
import { useToast } from "./Toast";
import { JSONEditorLeftBar } from "./JSONEditorLeftBar";
import { BookEditor } from "./BookEditor";
import { requestBook, requestBookChapterInfo } from "./backend.helper";

export function ChapterEditor() {
    const [files, setFiles] = React.useState<{ name: string, size: number }[]>([]);
    const [bookChapterIndex, setBookChapterIndex] = React.useState(-1)
    const [bookChapter, setBookChapter] = React.useState<{
        line: string;
        type: string;
    }[]>();
    const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null);
    const { showToast } = useToast();

    React.useEffect(() => {
        (async () => {
            const filesResult: string[] = await requestBook();
            setFiles(filesResult.map((t, i) => ({
                name: "" + (i + 1),
                size: t.length
            })));
        })();
    }, []);

    const openChapter = async (selectedFile: string) => {
        try {
            const chapterNumber = parseInt(selectedFile);
            const bookChapterInfo = await requestBookChapterInfo(chapterNumber);
            setBookChapter(bookChapterInfo)
            setBookChapterIndex(chapterNumber - 1)
        } catch (e) {
            showToast({ message: "Chapter not found", type: "error" });
        }
    }

    const loadFile = async (fileName: string) => {
        setSelectedFileName(fileName);
        await openChapter(fileName);
    }

    return (
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
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
                </div>
                {
                    !!bookChapter && <BookEditor
                        height={'90%'}
                        key={selectedFileName}
                        bookChapter={bookChapter!}
                        bookChapterIndex={bookChapterIndex}
                    />
                }
            </div>
        </div >
    );
}
