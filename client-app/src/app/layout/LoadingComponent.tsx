import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

export const LoadingComponent: React.FC<{inverted?:boolean, content?: string}>= ({
    inverted,
    content
}) => {
    return (
       <Dimmer active inverted={inverted}>
           <Loader content={content} indeterminate blue/>
       </Dimmer>
    )
}
