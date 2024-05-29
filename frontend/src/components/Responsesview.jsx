import React, { useEffect, useState } from 'react';

  function ResponsesView() {
  const [texts, setTexts] = useState([]);

  const contentClass = "py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

  useEffect(() => {
    fetch('http://localhost:5000/show_responses-be')
      .then(response => response.json())
      .then(data => setTexts(data))
      .catch(error => console.error('Error fetching responses:', error));
    
      const websocket = new WebSocket('ws://localhost:5000');

      websocket.onmessage = (event) => {
        const newText = JSON.parse(event.data);
        setTexts((prevTexts) => [newText, ...prevTexts.slice(0, 99)]);
      }

      websocket.onclose = () => {
        console.log("Websocket connection closed!");
      }

      return () => {
        websocket.close();
      }
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-2xl mb-4 text-center font-semibold">Latest 100 Responses</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className={contentClass}>ID</th>
                <th className={contentClass}>Content</th>
              </tr>
            </thead>
            <tbody>
              {texts.map((text) => (
                <tr key={text.id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{text.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis max-w-xs">
                      {text.content}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsesView;