import { useState } from "react";

export function JSONEditorLeftBar(props: { files: string[], selectedFile: string | null, loadFile: (file: string) => Promise<void> }) {
    const { files, loadFile, selectedFile } = props;
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div
            style={{
                width: isOpen ? "250px" : "50px",
                flexShrink: 0,
                padding: "10px",
                overflowY: "auto",
                top: 5,
                left: 0,
                bottom: 0,
            }}
        >
            <h2 style={{ textAlign: isOpen ? 'unset' : 'center' }}>{isOpen ? 'Available files' : 'F'}</h2>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="mt-2 ml-2 p-1 bg-gray-300 rounded hover:bg-gray-400"
                style={{ marginBottom: "20px", width: "100%" }}
            >
                {isOpen ? "«" : "»"}
            </button>
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
    )
}