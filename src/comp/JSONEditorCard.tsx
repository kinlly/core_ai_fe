import React from "react";
import { useToast } from "./Toast";

interface RecordRowProps {
    record: any;
    index: number;
    selectedFileName: string;
    reload: () => void;
}

export function JSONEditorCard({ record, index, selectedFileName, reload }: RecordRowProps) {
    const [isEditing, setIsEditing] = React.useState(true);
    const [instruction, setInstruction] = React.useState(record.instruction || "");
    const [output, setOutput] = React.useState(record.output || "");
    const { showToast } = useToast();

    async function handleSave() {
        const updated = { instruction, output };
        try {
            await fetch(`http://127.0.0.1:8000/files/${selectedFileName}/${index}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
            reload();
            showToast({ message: "Save Success", type: "success" });
        } catch (e) {
            showToast({ message: "Error check logs", type: "error" });
        }
    }

    async function handleDelete() {
        if (window.confirm(`Delete line ${index}?`)) {
            try {
                await fetch(`http://127.0.0.1:8000/files/${selectedFileName}/${index}`, {
                    method: "DELETE",
                });
                reload();
                showToast({ message: "Delete Success", type: "success" });
            } catch (e) {
                showToast({ message: "Error check logs", type: "error" });
            }
        }
    }

    const commentStyle: React.CSSProperties = {
        width: "97%",
        minHeight: "140px",
        padding: "6px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        resize: "none",
        background: "transparent",
        color: "white"
    };

    return (
        <div
            style={{
                borderRadius: 0,
                padding: "10px",
                marginBottom: "6px",
                marginTop: "6px",
                borderBottom: "2px solid #ffffff5e",
            }}
        >
            {isEditing ? (
                <>
                    {/* Header botones */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: "4px 10px",
                                background: "#4caf50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                            }}
                        >
                            💾
                        </button>

                        <button
                            onClick={handleDelete}
                            style={{
                                padding: "4px 10px",
                                background: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                            }}
                        >
                            🗑
                        </button>
                    </div>

                    {/* Formulario */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                            marginTop: "10px",
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    fontWeight: "bold",
                                    display: "block",
                                    marginBottom: "4px",
                                }}
                            >
                                Instruction
                            </label>
                            <textarea
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                style={commentStyle}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    fontWeight: "bold",
                                    display: "block",
                                    marginBottom: "4px",
                                }}
                            >
                                Output
                            </label>
                            <textarea
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                style={commentStyle}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Vista normal */}
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            margin: 0,
                        }}
                    >
                        {JSON.stringify(record, null, 2)}
                    </pre>

                    <div style={{ marginTop: "6px" }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ padding: "4px 8px" }}
                        >
                            ✏️
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
