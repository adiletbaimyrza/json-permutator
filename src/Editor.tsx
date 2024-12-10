import React, { useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import styled from 'styled-components'

const Editor: React.FC<{
  heading: string
  value: string
  onChange: (newValue: string | undefined) => void
}> = ({ heading, value, onChange }) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)

  const handleEditorChange = (value: string | undefined) => {
    onChange(value)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <EditorWrapper isFullScreen={isFullScreen}>
      <EditorHeader>
        <EditorHeading>{heading}</EditorHeading>
        <EditorButton onClick={toggleFullScreen}>
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </EditorButton>
      </EditorHeader>

      <MonacoEditor
        height={isFullScreen ? window.innerHeight - 20 : 400}
        width={isFullScreen ? window.innerWidth - 20 : 800}
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

const EditorWrapper = styled.div.attrs<{ isFullScreen: boolean }>((_) => ({
  isFullScreen: undefined,
}))`
  margin-bottom: 1rem;
  ${({ isFullScreen }) =>
    isFullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #121212;
    z-index: 9999;
    padding: 1rem;
  `}
`

const EditorButton = styled.button`
  background-color: var(--button-background);
  color: var(--button-text-color);
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: var(--button-hover-background);
  }
`

const EditorHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const EditorHeading = styled.h3`
  margin: 0;
  color: var(--text-color);
`

export default Editor
