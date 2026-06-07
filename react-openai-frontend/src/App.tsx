import { useState } from "react"
import { chatApi } from "./api/axios.api"
import ReactMarkdown from "react-markdown"


function App() {

  const [message, setMessage] = useState<string>('')
  const [response, setResponse] = useState<string>('')

  const handleInputMessage = (value: string): void => {
    setMessage(value)
  }

  const sentQuestion = async (prompt: string): Promise<void> => {
    const response = await chatApi.post('/', { prompt })
    setResponse(response.data.response)
  }

  return <div className="w-full h-screen flex flex-col items-center justify-center gap-4">

    <div className="flex gap-2 items-center border border-gray-700  rounded-md ">
      <input type="text" placeholder="Ingrese un mensaje" className="px-4 py-3 w-[500px] focus:outline-none" value={message} onChange={(e) => handleInputMessage(e.target.value)} />
      <button className="px-4 py-3 cursor-pointer" onClick={() => sentQuestion(message)}>Enviar</button>
    </div>

    <div className="max-w-[800px] px-4 py-3 text-gray-300">
      <ReactMarkdown>{response || "ingrese una pregunta"}</ReactMarkdown>
    </div>

  </div>
}

export default App
