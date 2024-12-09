import React, { SetStateAction, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import Editor from './Editor'
import Navbar from './Navbar'
import PermutationList from './PermutationList'

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
  const [permutations, setPermutations] = useState<any[]>([])

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
          id: uuidv4(),
          caseData: caseObject,
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

        const generatedPermutations = generatePermutations(
          parsedBaseObject,
          parsedFields
        )

        setPermutations(generatedPermutations)
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
        handleGenerate={handleGenerate}
      />
      <Main>
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
            onChange={(newValue) =>
              setFields(newValue as SetStateAction<string>)
            }
          />
        )}

        <PermutationList
          permutations={permutations}
          setPermutations={setPermutations}
        />
        {output && (
          <Editor
            heading="Output"
            value={output}
            onChange={(newValue) =>
              setOutput(newValue as SetStateAction<string>)
            }
          />
        )}
      </Main>
    </>
  )
}

const Main = styled.main`
  margin-top: 120px;
`

export default App
