import React from 'react'
import MonacoEditor from '@monaco-editor/react'
import Heading from './Heading'
import { HeadingSize } from './types'
import styled from 'styled-components'

const Editor: React.FC<{
  heading: string
  value: string
  onChange: (newValue: string | undefined) => void
}> = ({ heading, value, onChange }) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value)
  }

  return (
    <EditorWrapper>
      <Heading size={HeadingSize.XS}>{heading}</Heading>

      <MonacoEditor
        height={400}
        width={1000}
        language="json"
        value={value}
        options={{
          wordWrap: 'on',
        }}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </EditorWrapper>
  )
}

const EditorWrapper = styled.div`
  margin-bottom: 1rem;
`

export default Editor
