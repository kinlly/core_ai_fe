import React, { useEffect, useRef, useState } from "react";

export function Conversation() {
    const TEMP = [0.0, 0.3, 0.5, 0.7];
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [manualInput, setManualInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, candidates]);

    const generateResponses = async (prompt) => {
        setLoading(true);
        try {
            const conversationForBE = conversation.flatMap(c => [
                { role: 'user', content: c.question },
                { role: 'assistant', content: c.answer }
            ]);

            conversationForBE.push({ role: 'user', content: prompt });

            const res = await fetch('http://127.0.0.1:8000/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation: conversationForBE,
                    temperatures: TEMP,
                }),
            });
            const data = await res.json();
            setCandidates(data.candidates.map((c) => ({
                value: c.response.replaceAll('</s>', ''),
                dislike: false
            })));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => {
        if (!prompt.trim()) return;
        generateResponses(prompt);
        setConversation([...conversation, { question: prompt, answer: '', rejected: [] }]);
        setPrompt('');
    };

    const handleSelect = (answer) => {
        const selected = answer === '' ? manualInput.trim() : answer;
        if (!selected) return;

        const last = conversation[conversation.length - 1];
        const updated = {
            ...last,
            answer: selected,
            rejected: candidates.filter(c => c.dislike).map(c => c.value),
        };

        setConversation([...conversation.slice(0, -1), updated]);
        setCandidates([]);
        setManualInput('');
    };

    const handleExport = () => {
        const dataset = [];
        const datasetDPO = [];

        conversation.forEach((c, idx) => {
            // Construir la conversación acumulada hasta este punto
            const convHistory = [];
            for (let i = 0; i <= idx; i++) {
                convHistory.push({ from: "user", value: conversation[i].question });
                convHistory.push({ from: "assistant", value: conversation[i].answer });
            }

            // Caso 2: conversación completa para el dataset (sin distinguir chosen/rejected)
            dataset.push({ conversations: convHistory });

            // Crear DPO si hay rejected
            if (c.rejected && c.rejected.length > 0) {
                c.rejected.forEach(bad => {
                    datasetDPO.push({
                        chosen: { conversations: convHistory.slice(-4) },
                        rejected: {
                            conversations: [
                                ...convHistory.slice(-4).slice(0, -1), // toda la historia excepto la última respuesta
                                { from: "assistant", value: bad } // sustituimos la última respuesta por la rechazada
                            ]
                        }
                    });
                });
            }
        });

        const string = JSON.stringify(dataset, null, 2).slice(1, -1);
        const blob = new Blob([string], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversation_export.jsonl';
        a.click();

        const string2 = JSON.stringify(datasetDPO, null, 2).slice(1, -1);
        const blob2 = new Blob([string2], { type: 'application/json' });
        const url2 = URL.createObjectURL(blob2);
        const a2 = document.createElement('a');
        a2.href = url2;
        a2.download = 'conversation_dpo_export.jsonl';
        a2.click();
    };

    const handleClear = () => {
        setPrompt('');
        setCandidates([]);
        setConversation([]);
        setManualInput('');
    };

    const pendingToAnswer = loading || !!candidates.length;

    return (
        <>
            <div className="messages">
                {conversation.map((c, i) => (
                    <div key={i}>
                        {c.question && (
                            <div className="bubble user">{c.question}</div>
                        )}
                        {c.answer && (
                            <div className="bubble assistant">{c.answer}</div>
                        )}
                    </div>
                ))}
                {candidates.length > 0 && (
                    <div className="candidate-grid">
                        {candidates.map((c, i) => !c.value ? <></> : (
                            <div key={i} className="candidate-card" style={{ border: c.dislike ? '3px solid red' : c.like ? '3px solid lime' : '3px solid transparent' }}>
                                <div className="candidate-header">
                                    <span className="temp">Temp {TEMP[i]} </span> <span onClick={() => handleSelect(c.value)} style={{ cursor: pendingToAnswer ? "not-allowed" : "pointer" }}>✅</span>
                                </div>
                                <div className="candidate-body">
                                    <p>{c.value}</p>
                                </div>
                                <div className="candidate-actions">
                                    <button
                                        onClick={() =>
                                            setCandidates(prev =>
                                                prev.map((p, idx) =>
                                                    idx !== i ? p : { ...p, dislike: false, like: !p.like }
                                                )
                                            )
                                        }
                                    >
                                        👍
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCandidates(prev =>
                                                prev.map((p, idx) =>
                                                    idx !== i ? p : { ...p, like: false, dislike: !p.dislike }
                                                )
                                            )
                                        }
                                    >
                                        👎
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="manual-input">
                            <input
                                type="text"
                                placeholder="Escribe tu respuesta..."
                                value={manualInput}
                                onChange={e => setManualInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSelect('')}
                            />
                            <button onClick={() => handleSelect('')}>Confirmar</button>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                {!!conversation.length && (
                    <button onClick={handleExport} disabled={pendingToAnswer} style={{ marginRight: '8px', cursor: pendingToAnswer ? "not-allowed" : "pointer" }}>
                        {loading ? '✨' : `💾`}
                    </button>
                )}
                <input
                    type="text"
                    disabled={pendingToAnswer}
                    placeholder={pendingToAnswer ? "waiting to decide" : "Ask a question"}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={pendingToAnswer} style={{ marginRight: '8px', cursor: pendingToAnswer ? "not-allowed" : "pointer" }}>
                    {loading ? '✨' : `📨`}
                </button>
                <button onClick={handleClear} disabled={loading} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? '✨' : `❌`}
                </button>
            </div>
            <div style={{ position: 'sticky', bottom: 0, alignSelf: 'center', paddingBottom: '5px' }}>
                <p style={{ margin: 0 }}>🐱🐱 This Chat will contain <b>always</b> errors 🐱🐱</p>
            </div>
        </>
    );
}