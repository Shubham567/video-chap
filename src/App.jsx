import { useEffect, useRef, useState } from 'react'
import './App.css'
import { initVideoContainers, rtcJoin, rtcLeave, startBasicCall } from './agoraCall'

function App() {
  const incomingVref = useRef(null);
  const localVref = useRef(null);

  useEffect(() => {
    initVideoContainers(incomingVref.current,localVref.current);
    startBasicCall();
  },[])

  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Agora test Video Call</h1>
        <div className={"videoContainers"}>
          <div ref={incomingVref} className={"video"}>Incoming Video</div>
          <div ref={localVref} className={"video"}>Local Video</div>
        </div>
        <div className="buttonContainer">
          <button onClick={rtcJoin}>Join Call</button>
          <button onClick={rtcLeave}>Leave Call</button>
        </div>
      </header>
    </div>
  )
}

export default App;
