import { rgba } from 'polished'
import styled, { css } from 'styled-components/macro'
import React from 'react'
import { useField } from 'react-final-form'
import { Control, ControlIconLabel } from './control'
import { colors, radii } from 'theme'

// The border radius on the input is set in case the browser forces the
// background-color to something other than transparent, e.g. in case of
// autofill.
const StyledSelect = styled.select`
  background-color: ${rgba(colors.ink.mid, 0.04)};
  color: ${colors.text.default};
  flex: 1;
  font-size: 0.9rem;
  line-height: 1rem;
  padding: 0.5rem;
  border-radius: ${radii.small};
  ${props =>
    props.hasIconLabel &&
    css`
      padding-left: 2.25rem;
    `}
`

const StyledArrow = styled.div`
  position: absolute;
  right: 0.5rem;
  border: 4px solid transparent;
  border-top-color: ${colors.ink.mid};
  margin-top: 5px;

  &::after {
    content: ' ';
    position: absolute;
    border: 4px solid transparent;
    border-bottom-color: ${colors.ink.mid};
    margin-left: -4px;
    margin-top: -14px;
  }
`

const StyledControlIconLabel = styled(ControlIconLabel)`
  position: absolute;
  left: 0;
`

export const SelectControl = ({
  onChange,
  glyph,
  className,
  style,
  label,
  placeholder,
  id,
  size,
  variant,
  value,
  ...props
}) => {
  let hasIconLabel = glyph !== undefined

  return (
    <Control
      id={id}
      label={label}
      variant={variant}
      className={className}
      style={style}>
      {id => (
        <>
          {hasIconLabel && (
            <StyledControlIconLabel
              glyph={glyph}
              variant={variant || (!value && 'empty')}
            />
          )}
          <StyledSelect
            {...props}
            id={id}
            hasIconLabel={hasIconLabel}
            placeholder={placeholder || label}
            value={value}
            onChange={event => onChange && onChange(event.target.value)}
          />
          <StyledArrow />
        </>
      )}
    </Control>
  )
}

export function FormSelectControl({ name, initialValue, variant, ...props }) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid

  return (
    <SelectControl
      {...field.input}
      {...props}
      variant={variant || (error && 'warning')}
    />
  )
}

export default SelectControl
