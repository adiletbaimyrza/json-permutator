import React from 'react'
import styled from 'styled-components'
import Permutation from './Permutation'

const PermutationList: React.FC<{
  permutations: any[]
  setPermutations: React.Dispatch<React.SetStateAction<any[]>>
}> = ({ permutations, setPermutations }) => {
  return (
    <ul>
      {permutations.length > 0 && (
        <PermutationsHeading>Permutations</PermutationsHeading>
      )}
      {permutations.map((item) => (
        <ListItem key={item.id}>
          <Permutation
            item={item}
            setPermutations={setPermutations}
          ></Permutation>
        </ListItem>
      ))}
    </ul>
  )
}

const ListItem = styled.li`
  list-style: none;
`
const PermutationsHeading = styled.h3`
  margin-bottom: 1rem;
  color: var(--text-color);
`
export default PermutationList
