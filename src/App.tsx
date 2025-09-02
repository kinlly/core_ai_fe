import React from "react";
import { Conversation } from './comp/Conversation';
import { Menu } from './comp/Menu';
import { JSONLEditor } from "./comp/JSONLEditor";
import { ToastProvider } from "./comp/Toast";
import { ChapterEditor } from "./comp/ChapterEditor";

function App() {
  const [view, setView] = React.useState('conversation');

  return (
    <ToastProvider>
      <div className="app-layout">
        <div className="chat-container">
          {view === 'conversation' && (
            <div className="chat-container-wrapper">
              <Conversation />
            </div>
          )}
          {view === 'JSONLEditor' && (
            <JSONLEditor />
          )}
          {view === 'Chapters' && (
            <ChapterEditor />
          )}
        </div>
        <Menu setView={setView} />
      </div>
    </ToastProvider>
  );
}

export default App;
