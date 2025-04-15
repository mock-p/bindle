"use client"
import { useEffect, useRef, useState } from "react";
import { connect, send, onReceive } from "bindle-client";


export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();
  const sendTimeRef = useRef(null);

  useEffect(() => {
    connect();
    onReceive((data) => {
      if (data instanceof Blob) {
        data.text().then((text) => handleReceivedText(text));
      } else {
        handleReceivedText(data);
      }
    });
    function handleReceivedText(data) {
      console.log('Received raw data:', data);
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        parsed = { text: data };
      }
      if (parsed.sentAt) {
        const elapsed = Date.now() - parsed.sentAt;
        setMessages((msgs) => [
          ...msgs,
          `received data : ${parsed.text} (elapsed: ${elapsed} ms)`
        ]);
      } else {
        setMessages((msgs) => [...msgs, `received data : ${parsed.text}`]);
      }
    }
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      const payload = JSON.stringify({ text: input, sentAt: Date.now() });
      send(payload);
      setInput("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type something..."
          className="border px-2 py-1 rounded mr-2"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-1 rounded">Send</button>
      </div>
      <div className="mt-4 w-full max-w-md">
        {messages.map((msg, idx) => (
          <div key={idx} className="border-b py-1">{msg}</div>
        ))}
      </div>
    </div>
  );
}
