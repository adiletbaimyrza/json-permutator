import React, { useState } from 'react'
import styled from 'styled-components'
import Editor from './Editor'

const colors = ['#ff6799', '#ffe659', '#74a0ff']

const Permutation: React.FC<{
  item: any
  setPermutations: React.Dispatch<React.SetStateAction<any[]>>
}> = ({ item, setPermutations }) => {
  const { id, caseData, permutation } = item
  const [isPermutationVisible, setIsPermutationVisible] =
    useState<boolean>(false)

  const handleToggleVisibility = () => {
    setIsPermutationVisible((prev) => !prev)
  }

  const handleDelete = () => {
    setPermutations((prevPermutations) =>
      prevPermutations.filter((perm) => perm.id !== id)
    )
  }

  return (
    <PermutationBar>
      <PermutationHeader>
        <CaseWrapper>
          {Object.entries(caseData).map(([key, value], index) => (
            <Case
              key={key}
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              {JSON.stringify(value, null, 2)}
            </Case>
          ))}
        </CaseWrapper>
        <PermutationControls>
          <PermutationButton onClick={handleToggleVisibility}>
            {isPermutationVisible ? 'Hide' : 'Show'}
          </PermutationButton>
          <PermutationButton onClick={handleDelete}>Delete</PermutationButton>
        </PermutationControls>
      </PermutationHeader>
      {isPermutationVisible && (
        <Editor
          heading="Permutation"
          value={JSON.stringify(permutation, null, 2)}
          onChange={() => {}}
        />
      )}
    </PermutationBar>
  )
}

const PermutationBar = styled.div`
  background-color: var(--button-background);
  color: var(--button-text-color);
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
`

const PermutationButton = styled.div`
  background-color: var(--background-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: var(--background-hover);
  }
`
const PermutationControls = styled.div`
  display: flex;
  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`
const PermutationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Case = styled.div`
  color: var(--background-color);
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
`
const CaseWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`
export default Permutation
