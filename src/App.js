import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]); // respuestas generadas
  const [conversation, setConversation] = useState([]); // confirmadas
  const [manualInput, setManualInput] = useState('');

  const generateResponses = async (prompt) => {
    setLoading(true);
    try {
      // Convertimos la conversación confirmada a formato que espera BE
      const conversationForBE = conversation.flatMap(c => [
        { role: 'user', content: c.question },
        { role: 'assistant', content: c.answer }
      ]);

      // Añadimos la nueva pregunta del usuario
      conversationForBE.push({ role: 'user', content: prompt });

      const res = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: conversationForBE,
          temperatures: [0.3, 0.5, 0.7],
        }),
      });
      const data = await res.json();
      setCandidates(data.candidates.map((c) => c.response.replaceAll('</s>', '')));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    generateResponses(prompt);
  };

  const handleSelect = (answer) => {
    const selected = answer === '' ? manualInput.trim() : answer;
    if (!selected) return;

    setConversation([...conversation, { question: prompt, answer: selected, rejected: candidates.filter(c => c && c !== selected) }]);
    setPrompt('');
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

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 800, margin: 'auto' }}>
      <h1>Chat Curador</h1>
      <p><i>Esto deberia ir directamente on click save al server un save history y generar el JSON en el PC y poder hablar con la IA desde la tablet de chill</i></p>

      <div>
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{ width: '70%', padding: 8 }}
        />
        <button onClick={handleSend} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Generando...' : 'Generar'}
        </button>
      </div>

      {candidates.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Selecciona la respuesta correcta o escribe la tuya</h3>
          {candidates.map((c, i) => (
            <div key={i} style={{ margin: '5px 0' }}>
              <button onClick={() => handleSelect(c)} style={{ padding: 8, width: '100%' }}>
                {c || <em>Escribir manualmente...</em>}
              </button>
            </div>
          ))}
          {candidates.includes('') && (
            <input
              type="text"
              placeholder="Escribe tu respuesta..."
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 5 }}
            />
          )}
        </div>
      )}

      {conversation.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Conversación Confirmada</h3>
          <div style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 10 }}>
            {conversation.map((c, i) => (
              <div key={i}>
                Q: {c.question}
                <br />
                A: {c.answer}
                <br />
                <hr />
              </div>
            ))}
          </div>

          <button onClick={handleExport} style={{ marginTop: 10, marginRight: 10 }}>
            Exportar JSON
          </button>
          <button onClick={handleClear} style={{ marginTop: 10 }}>
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
