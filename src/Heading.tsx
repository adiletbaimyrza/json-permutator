import React from 'react'
import styled from 'styled-components'
import { HeadingSize } from './types'

const getHeadingStyle = (size: HeadingSize) => {
  switch (size) {
    case HeadingSize.XL:
      return { fontSize: '3rem', fontWeight: 'bold', marginBottom: '3rem' }
    case HeadingSize.L:
      return { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2.5rem' }
    case HeadingSize.M:
      return { fontSize: '2rem', fontWeight: 'normal', marginBottom: '2rem' }
    case HeadingSize.S:
      return {
        fontSize: '1.5rem',
        fontWeight: 'normal',
        marginBottom: '1.5rem',
      }
    case HeadingSize.XS:
      return {
        fontSize: '1.2rem',
        fontWeight: 'normal',
        marginBottom: '1.2rem',
      }
    default:
      return { fontSize: '2rem', fontWeight: 'normal', marginBottom: '2rem' }
  }
}

const Heading: React.FC<{
  size: HeadingSize
  children: React.ReactNode
}> = ({ size, children }) => {
  return <StyledHeading size={size}>{children}</StyledHeading>
}

const StyledHeading = styled.div<{ size: HeadingSize }>`
  font-size: ${(props) => getHeadingStyle(props.size).fontSize};
  font-weight: ${(props) => getHeadingStyle(props.size).fontWeight};
  margin-bottom: ${(props) => getHeadingStyle(props.size).marginBottom};
`

export default Heading
