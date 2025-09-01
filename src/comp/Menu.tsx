import React from "react";

export function Menu(props: { setView: React.Dispatch<React.SetStateAction<string>> }) {
    const { setView } = props;
    return (
        <div className="sidebar">
            <h2>Menú</h2>
            <ul>
                <li onClick={() => setView('conversation')}>
                    Conversation
                </li>
                <li onClick={() => setView('JSONLEditor')}>
                    JSONL Editor
                </li>
            </ul>
        </div>
    )
}