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
  const [mutationBase, setMutationBase] = useState<string>('')
  const [isPayloadVisible, setIsPayloadVisible] = useState<boolean>(true)
  const [isFieldsVisible, setIsFieldsVisible] = useState<boolean>(true)
  const [permutations, setPermutations] = useState<any[]>([])
  const [isMutationBaseVisible, setIsMutationBaseVisible] =
    useState<boolean>(true)

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

  const generateMutations = (original: any, modified: any) => {
    const mutations: any[] = []

    const compareObjects = (orig: any, mod: any, path: string = '') => {
      const origKeys = Object.keys(orig || {})
      const modKeys = Object.keys(mod || {})
      const allKeys = new Set([...origKeys, ...modKeys])

      allKeys.forEach((key) => {
        const currentPath = path ? `${path}/${key}` : `/${key}`
        const origValue = orig?.[key]
        const modValue = mod?.[key]

        if (origValue === undefined && modValue !== undefined) {
          mutations.push({
            op: 'add',
            path: currentPath,
            value: modValue,
          })
        } else if (origValue !== undefined && modValue === undefined) {
          mutations.push({
            op: 'remove',
            path: currentPath,
          })
        } else if (
          origValue !== modValue &&
          typeof origValue !== 'object' &&
          typeof modValue !== 'object'
        ) {
          mutations.push({
            op: 'replace',
            path: currentPath,
            value: modValue,
          })
        } else if (
          typeof origValue === 'object' &&
          typeof modValue === 'object'
        ) {
          compareObjects(origValue, modValue, currentPath)
        }
      })
    }

    compareObjects(original, modified)
    return mutations
  }

  const generatePermutationsWithMutations = (
    originalPayload: any,
    fields: [string, any[]][]
  ) => {
    const results: any[] = []

    const parsedMutationBase = JSON.parse(mutationBase || '{}')

    const backtrack = (current: any, index: number) => {
      if (index === fields.length) {
        const caseObject = createCaseObject(fields, current)
        const mutations = generateMutations(originalPayload, current)

        const mutationBaseWithMutations = {
          ...parsedMutationBase,
          mutations,
        }

        results.push({
          id: uuidv4(),
          caseData: caseObject,
          permutation: JSON.parse(JSON.stringify(current)),
          mutations: mutationBaseWithMutations,
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

    backtrack(originalPayload, 0)
    return results
  }

  const handleGenerate = () => {
    try {
      const parsedBaseObject = JSON.parse(payload)

      try {
        const parsedFields = JSON.parse(fields)

        const generatedPermutations = generatePermutationsWithMutations(
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
        isMutationBaseVisible={isMutationBaseVisible}
        setIsMutationBaseVisible={setIsMutationBaseVisible}
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
        {isMutationBaseVisible && (
          <Editor
            heading="Mutation Base"
            value={mutationBase}
            onChange={(newValue) =>
              setMutationBase(newValue as SetStateAction<string>)
            }
          />
        )}

        <PermutationList
          permutations={permutations}
          setPermutations={setPermutations}
        />
      </Main>
    </>
  )
}

const Main = styled.main`
  margin-top: 120px;
`

export default App
