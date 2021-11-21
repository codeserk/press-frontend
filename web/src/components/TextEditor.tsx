import dynamic from 'next/dynamic'
import React, { FC, useMemo } from 'react'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'code'],
  ],
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'code',
]

interface OnChangeHandler {
  (e: any): void
}

type Props = {
  value?: string
  placeholder: string
  onChange?: OnChangeHandler
}

export const TextEditor: FC<Props> = ({ value, onChange, placeholder }) => {
  return useMemo(
    () => (
      <ReactQuill
        theme="snow"
        value={value || ''}
        modules={modules}
        formats={formats}
        onChange={onChange}
        placeholder={placeholder}
      />
    ),
    [value, placeholder],
  )
}
