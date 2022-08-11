import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Components } from 'react-markdown/lib/ast-to-react'

const MySyntaxHighlighter = (props: any) => {
  return (
    <SyntaxHighlighter
      style={okaidia}
      language={props.match[1]}
      PreTag="div"
      {...props}
    >
      {String(props.children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}

const components: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    Object.assign(props, { match })

    return !inline && match ? (
      <MySyntaxHighlighter {...props} />
    ) : (
      <code className={className} {...props} >
        {children}
      </code >
    )
  }
}

interface MarkdownProps {
  children: string
}

export default function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      className={'MarkdownRenderer'}
      remarkPlugins={[gfm]}
      components={components}
    >
      {props.children}
    </ReactMarkdown>
  )
}