import styled from 'styled-components'

interface NavbarProps {
  isPayloadVisible: boolean
  setIsPayloadVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({
  isPayloadVisible,
  setIsPayloadVisible,
}) => {
  return (
    <StyledNav>
      <MainHeading>JSON Permutator</MainHeading>
      <StyledButton onClick={() => setIsPayloadVisible(!isPayloadVisible)}>
        {isPayloadVisible ? 'Hide Payload' : 'Show Payload'}
      </StyledButton>
    </StyledNav>
  )
}

const MainHeading = styled.h1``

const StyledNav = styled.nav`
  display: flex;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 2rem;
  }

  background: var(--button-background);
  padding: 0.5rem;
  margin-bottom: 1rem;
`

const StyledButton = styled.button`
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
