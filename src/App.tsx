import React, { SetStateAction, useState } from 'react'
import * as XLSX from 'xlsx'
import styled from 'styled-components'
import Editor from './Editor'
import Navbar from './Navbar'

const defaultBaseObject = `{
  "field1": 1,
  "field2": {
    "nestedField1": "value",
    "nestedField2": null
  }
}`

const defaultFields = `[
  ["field1", [1, 2, null]],
  ["field2.nestedField1", ["value", "someOtherValue"]]
]`

const App: React.FC = () => {
  const [payload, setBaseObject] = useState<string>(defaultBaseObject)
  const [fields, setFields] = useState<string>(defaultFields)
  const [output, setOutput] = useState<string>('')
  const [isPayloadVisible, setIsPayloadVisible] = useState<boolean>(true)
  const [isFieldsVisible, setIsFieldsVisible] = useState<boolean>(true)

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

  const generatePermutations = (payload: any, fields: [string, any[]][]) => {
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

    backtrack(payload, 0)
    return results
  }

  const handleGenerate = () => {
    try {
      const parsedBaseObject = JSON.parse(payload)

      try {
        const parsedFields = JSON.parse(fields)

        const permutations = generatePermutations(
          parsedBaseObject,
          parsedFields
        )

        setOutput(JSON.stringify(permutations, null, 2))
      } catch (error) {
        alert('Invalid JSON input in "fields". Please check your data.')
      }
    } catch (error) {
      alert('Invalid JSON input in "payload". Please check your data.')
    }
  }

  const exportToExcel = () => {
    try {
      const parsedBaseObject = JSON.parse(payload)

      try {
        const parsedFields = JSON.parse(fields)

        const permutations = generatePermutations(
          parsedBaseObject,
          parsedFields
        )

        const flattenedData = permutations.map(({ case: caseObject }) => {
          const updatedCaseObject = Object.fromEntries(
            Object.entries(caseObject).map(([key, value]) => [
              key,
              value === null ? 'MISSING' : value,
            ])
          )
          return updatedCaseObject
        })

        const ws = XLSX.utils.json_to_sheet(flattenedData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Permutations')

        XLSX.writeFile(wb, 'permutations.xlsx')
      } catch (error) {
        alert('Invalid JSON input in "fields". Please check your data.')
      }
    } catch (error) {
      alert('Invalid JSON input in "payload". Please check your data.')
    }
  }

  return (
    <>
      <Navbar
        isPayloadVisible={isPayloadVisible}
        setIsPayloadVisible={setIsPayloadVisible}
        isFieldsVisible={isFieldsVisible}
        setIsFieldsVisible={setIsFieldsVisible}
      />
      {isPayloadVisible && (
        <Editor
          heading="Payload"
          value={payload}
          onChange={(newValue) =>
            setBaseObject(newValue as SetStateAction<string>)
          }
        />
      )}
      {isFieldsVisible && (
        <Editor
          heading="Fields"
          value={fields}
          onChange={(newValue) => setFields(newValue as SetStateAction<string>)}
        />
      )}
      <Button onClick={handleGenerate}>Generate Permutations</Button>
      {output && (
        <Editor
          heading="Output"
          value={output}
          onChange={(newValue) => setOutput(newValue as SetStateAction<string>)}
        />
      )}
      <Button onClick={exportToExcel}>Export to Excel</Button>
    </>
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
  margin-right: 1.5rem;

  &:hover {
    background-color: var(--button-hover-background);
  }
`
const Button = StyledButton

export default App
