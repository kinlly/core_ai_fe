import React from "react";

export function Menu(props) {
    const { setView } = props;
    return (
        <div className="sidebar">
            <h2>Menú</h2>
            <ul>
                <li onClick={() => setView('conversation')}>
                    Conversation
                </li>
                <li onClick={() => setView('mainData')}>
                    Main Data
                </li>
            </ul>
        </div>
    )
}