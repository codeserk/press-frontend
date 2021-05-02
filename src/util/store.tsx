import React, { ComponentType, FC, Fragment } from 'react'

type Components = ComponentType | [ComponentType, Record<string, any>]

interface Props {
  components: Components[]
}

export const Compose: FC<Props> = ({ components, children }) => (
  <Fragment>
    {components.reverse().reduce((acc, curr) => {
      const [Provider, props] = Array.isArray(curr) ? [curr[0], curr[1]] : [curr, {}]
      return <Provider {...props}>{acc}</Provider>
    }, children)}
  </Fragment>
)
