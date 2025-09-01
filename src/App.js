import React from "react";
import { MainData } from './comp/MainData';
import { Conversation } from './comp/Conversation';
import { Menu } from './comp/Menu';

function App() {
  const [view, setView] = React.useState('conversation');

  return (
    <div className="app-layout">
      <div className="chat-container">
        <div className="chat-container-wrapper">
          {view === 'conversation' && (
            <Conversation />
          )}
          {view === 'mainData' && (
            <MainData />
          )}
        </div>
      </div>
      <Menu setView={setView} />
    </div>
  );
}

export default App;
