import React from "react";
import { BookEditorDisplay } from "./BookEditorDisplay";
import { useToast } from "./Toast";

export function BookEditor(props: {
    bookChapter: {
        line: string;
        type: string;
    }[];
    bookChapterIndex: number;
    height?: string;
}) {
    const { bookChapter, bookChapterIndex } = props;
    const height = props.height ?? '372px';

    const [editBook, setEditBook] = React.useState<boolean>(false);
    const chapterRawString = bookChapter.map((bl) => bl.line).join('\n');
    const chapterLength = chapterRawString.length;
    const [chapterString, setChapterString] = React.useState(chapterRawString)

    const { showToast } = useToast();

    const onClickEditBook = async () => {
        if (editBook) {
            try {
                await fetch(`http://127.0.0.1:8000/book/${bookChapterIndex}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ line: chapterString.replace(/\n/g, "\\n") }),
                });
                showToast({ message: "Save Success", type: "success" });
            } catch (e) {
                showToast({ message: "Save FAIL", type: "error" });
            }
        } else {
            setEditBook(true);
            setChapterString(chapterRawString);
        }
    };

    return <div
        style={{
            position: 'relative',
            height,
            overflowY: "hidden",
            flexShrink: 0,
            border: "1px solid #ddd",
            marginBottom: "10px",
        }}
    >
        <div style={{ position: 'absolute', top: "30px", right: 0 }} onClick={onClickEditBook}> {editBook ? 'Save' : 'Edit'} </div>
        <div style={{
            overflow: "scroll",
            height: "100%",
            padding: "20px"
        }}>
            {
                editBook
                    ? (
                        <textarea
                            style={{ width: '100%', height: '100%', background: "transparent", color: "white", padding: "15px", border: 0 }}
                            onChange={(e) => setChapterString(e.target.value)}
                        >
                            {chapterRawString}
                        </textarea>
                    )
                    : <BookEditorDisplay bookChapter={bookChapter} />
            }
        </div>
        <div style={{ position: "absolute", bottom: 0, right: 0, background: "#80808042", padding: "4px 30px" }}> Length: {(chapterLength / 1000).toFixed(1)}K Lines: {bookChapter.length}  </div>
    </div>
}