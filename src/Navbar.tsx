import styled from 'styled-components'

const Navbar: React.FC<{
  isPayloadVisible: boolean
  setIsPayloadVisible: React.Dispatch<React.SetStateAction<boolean>>
  isFieldsVisible: boolean
  setIsFieldsVisible: React.Dispatch<React.SetStateAction<boolean>>
  handleGenerate: () => void
}> = ({
  isPayloadVisible,
  setIsPayloadVisible,
  isFieldsVisible,
  setIsFieldsVisible,
  handleGenerate,
}) => {
  return (
    <Nav>
      <MainHeading>JSON Permutator</MainHeading>
      <Button onClick={() => setIsPayloadVisible(!isPayloadVisible)}>
        {isPayloadVisible ? 'Hide Payload' : 'Show Payload'}
      </Button>
      <Button onClick={() => setIsFieldsVisible(!isFieldsVisible)}>
        {isFieldsVisible ? 'Hide Fields' : 'Show Fields'}
      </Button>
      <Button onClick={handleGenerate}>Generate Permutations</Button>
    </Nav>
  )
}

const Nav = styled.nav`
  position: fixed;
  display: flex;
  align-items: center;
  background: var(--button-background);
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  z-index: 10;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); /* Bigger shadow */

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const MainHeading = styled.h1`
  padding: 0 0.5rem;
`

const Button = styled.button`
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

export default Navbar
