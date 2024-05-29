import React, { useState } from "react";

function CreateResponse() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const response = await fetch(
      'http://localhost:5000/response-be',
      {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({ text })
      }
    )
    setText('');
    if (response.ok) {
      alert('Response saved successfully!')
    }
    else{
      const result = await response.json();
      setError(result.errors ? result.errors[0].msg : 'Error saving response');
    }
  };
  return (
      <div className="flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h1 className="text-xl mb-4 font-semibold">Is a hot dog a sandwich? Why?</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <textarea
            className="w-full p-2 border rounded mb-4"
            rows="10"
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
            <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
            Save
            </button>
        </form>
      </div>
  );
}

export default CreateResponse;
