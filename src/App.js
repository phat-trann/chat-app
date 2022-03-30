import { ChatEngine } from 'react-chat-engine';

import ChatFeed from './components/ChatFeed';

function App() {
  return (
    <ChatEngine
      height="98vh"
      projectID="b0cc8e75-b499-4af8-b18c-308f710c12e0"
      userName="phat_tran"
      userSecret=""
      renderChatFeed={chatAppProps => <ChatFeed {...chatAppProps} />}
    />
  );
}

export default App;
