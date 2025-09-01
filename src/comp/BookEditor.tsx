import React, { useEffect } from "react";
import { BookEditorDisplay } from "./BookEditorDisplay";

export function BookEditor(props: {
    bookChapter: {
        line: string;
        type: string;
    }[];
    bookChapterIndex: number;
    reset: () => void;
    setBookChapterIndex: (n: number) => void;
}) {
    const {
        bookChapter,
        reset,
        bookChapterIndex,
        setBookChapterIndex
    } = props;

    const [editBook, setEditBook] = React.useState<boolean>(false);
    const [chapterString, setChapterString] = React.useState('')
    const resetCallback = () => {
        reset();
        setBookChapterIndex(-1);
        setEditBook(false)
        setChapterString('');
    };

    const onClickEditBook = async () => {
        if (editBook) {
            await fetch(`http://127.0.0.1:8000/book/${bookChapterIndex}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ line: chapterString.replace(/\n/g, "\\n") }),
            });
            resetCallback();
        } else {
            setChapterString(bookChapter.map((bl) => bl.line).join('\n'))
            setEditBook(true);

        }
    };

    return <div
        style={{
            position: 'relative',
            height: "372px",
            overflowY: "auto",
            flexShrink: 0,
            border: "1px solid #ddd",
            marginBottom: "10px",
        }}
    >
        <div style={{ position: 'absolute', top: 0, right: 0 }} onClick={onClickEditBook}> {editBook ? 'Save' : 'Edit'} </div>
        {
            editBook
                ? (
                    <textarea
                        style={{ width: '100%', height: '100%', background: "transparent", color: "white" }}
                        onChange={(e) => setChapterString(e.target.value)}
                    >
                        {chapterString}
                    </textarea>
                )
                : <BookEditorDisplay bookChapter={bookChapter} />
        }
    </div>
}