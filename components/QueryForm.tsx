import React, { useState } from 'react'

interface QueryProps {
  id: string;
  fn: (...params: any[]) => Promise<any>;
}

const functionToParamNames = (fn: Function) => {
  const match = /\(((?:\w+, )*(?:\w+)?)\)/.exec(fn.toString())
  return match ? match[1].split(',').map((name: string) => name.trim()) : [];
}

const Query: React.FC<QueryProps> = ({ id, fn }) => {
  const [values, setValues] = useState([...new Array(fn.length)].map(() => ''))
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const functionNames = functionToParamNames(fn)

  const execute = async () => {
    setRunning(true)
    try {
      setResult(null)
      const newResult = await fn.apply(null, values)
      setResult(newResult)
    } catch (e) {
      setError(e.message)
    }
    setRunning(false)
  }

  return (
    <div>
      {id}
      {' - '}
      {[...new Array(fn.length)].map((_: any, index: number) => (
        <input
          key={index}
          value={values[index]}
          placeholder={functionNames[index]}
          onChange={(e: any) => {
            const newValues = [...values]
            newValues[index] = e.target.value
            setValues(newValues)
          }}
        />
      ))}
      <button onClick={execute} disabled={running}>Execute</button>
      {result && <span>{result}</span>}
      {error && <span>Error: {error}</span>}
    </div>
  )
}

export default Query
