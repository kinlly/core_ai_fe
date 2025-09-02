import React, { useState } from "react";

export function Menu(props: { setView: React.Dispatch<React.SetStateAction<string>> }) {
    const { setView } = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="sidebar" style={{ width: isOpen ? "15%" : "50px" }} >
                <h2 style={{ alignSelf: isOpen ? 'unset' : 'center' }}>{isOpen ? 'Menu' : 'M'}</h2>
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="mt-2 ml-2 p-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                    {isOpen ? "»" : "«"}
                </button>
                <ul style={{ justifyItems: isOpen ? 'unset' : 'center' }}>
                    <li onClick={() => setView('conversation')}>
                        💬💬 {isOpen ? 'Conversation' : ''}
                    </li>
                    <li onClick={() => setView('JSONLEditor')}>
                        💬📄 {isOpen ? 'JSONL Editor' : ''}
                    </li>
                    <li onClick={() => setView('Chapters')}>
                        📘📘 {isOpen ? 'Chapters Editor' : ''}
                    </li>
                </ul>
            </div >
        </>
    )
}