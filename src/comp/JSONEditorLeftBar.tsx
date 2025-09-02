import { useState } from "react";

export function JSONEditorLeftBar(props: { files: { name: string, size: number }[], selectedFileName: string | null, loadFile: (file: string) => Promise<void> }) {
    const { files, loadFile, selectedFileName } = props;
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
                    <li key={f.name} style={{ marginBottom: "8px" }}>
                        <button
                            onClick={async () => await loadFile(f.name)}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "6px 8px",
                                border: f.name === selectedFileName ? "1px solid lime" : "1px solid #ddd",
                                background: f.name === selectedFileName ? "#006400" : "transparent",
                                cursor: "pointer",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ display: 'flex', color: 'white', justifyContent: 'space-between   ' }}><span>{f.name}</span><span>{f.size}</span></div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}