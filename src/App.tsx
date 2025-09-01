import React from "react";
import { MainData } from './comp/MainData';
import { Conversation } from './comp/Conversation';
import { Menu } from './comp/Menu';
import { JSONLEditor } from "./comp/JSONLEditor";
import { ToastProvider } from "./comp/Toast";

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
          {view === 'mainData' && (
            <div className="chat-container-wrapper">
              <MainData />
            </div>
          )}
          {view === 'JSONLEditor' && (
            <JSONLEditor />
          )}
        </div>
        <Menu setView={setView} />
      </div>
    </ToastProvider>
  );
}

export default App;
