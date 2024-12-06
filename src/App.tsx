/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction, useState } from 'react'
import styled from 'styled-components'
import Heading from './Heading'
import Editor from './Editor'
import { HeadingSize } from './types'

const App: React.FC = () => {
  const [baseObject, setBaseObject] = useState<string>('')
  const [fields, setFields] = useState<string>('')
  const [output, setOutput] = useState<string>('')

  const setValueAtPath = (obj: any, path: string, value: any) => {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce((o, key) => (o[key] = o[key] || {}), obj)
    target[lastKey] = value
  }

  const createCaseObject = (fields: [string, any[]][], currentObject: any) => {
    const caseObject: Record<string, any> = {}
    for (const [fieldPath] of fields) {
      const keys = fieldPath.split('.')
      const value = keys.reduce(
        (o, key) => (o ? o[key] : undefined),
        currentObject
      )
      caseObject[fieldPath] = value === undefined ? 'MISSING' : value
    }
    return caseObject
  }

  const generatePermutations = (baseObject: any, fields: [string, any[]][]) => {
    const results: any[] = []

    const backtrack = (current: any, index: number) => {
      if (index === fields.length) {
        const caseObject = createCaseObject(fields, current)
        results.push({
          case: caseObject,
          permutation: JSON.parse(JSON.stringify(current)),
        })
        return
      }

      const [fieldPath, values] = fields[index]
      for (const value of values) {
        const copy = JSON.parse(JSON.stringify(current))
        if (value === undefined) {
          const keys = fieldPath.split('.')
          const lastKey = keys.pop()!
          const target = keys.reduce((o, key) => (o[key] = o[key] || {}), copy)
          delete target[lastKey]
        } else {
          setValueAtPath(copy, fieldPath, value)
        }
        backtrack(copy, index + 1)
      }
    }

    backtrack(baseObject, 0)
    return results
  }

  const handleGenerate = () => {
    try {
      const parsedBaseObject = JSON.parse(baseObject)

      try {
        const parsedFields = JSON.parse(fields)

        const permutations = generatePermutations(
          parsedBaseObject,
          parsedFields
        )

        setOutput(JSON.stringify(permutations, null, 2))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert('Invalid JSON input in "fields". Please check your data.')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Invalid JSON input in "baseObject". Please check your data.')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Heading size={HeadingSize.S}>JSON Permutator</Heading>

      <Editor
        heading="Base Object"
        value={baseObject}
        onChange={(newValue) =>
          setBaseObject(newValue as SetStateAction<string>)
        }
      />

      <Editor
        heading="Fields"
        value={fields}
        onChange={(newValue) => setFields(newValue as SetStateAction<string>)}
      />

      <Button onClick={handleGenerate}>Generate Permutations</Button>

      {output && (
        <Editor
          heading="Output"
          value={output}
          onChange={(newValue) => setOutput(newValue as SetStateAction<string>)}
        />
      )}
    </div>
  )
}

const StyledButton = styled.button<{ padding?: string; marginTop?: string }>`
  background-color: var(--button-background);
  color: var(--button-text-color);
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1.5rem;

  &:hover {
    background-color: var(--button-hover-background);
  }
`
const Button = StyledButton

export default App
