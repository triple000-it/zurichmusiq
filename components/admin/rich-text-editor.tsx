"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Video,
  Table,
  Eye,
  Code2
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...", 
  className = "" 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual')

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const processedContent = processContentForEditor(value)
      editorRef.current.innerHTML = processedContent
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Process content to make text visible in editor
  const processContentForEditor = (content: string) => {
    if (!content) return content
    
    // Replace white text classes with dark text classes
    let processedContent = content
      .replace(/text-white/g, 'text-gray-900')
      .replace(/text-white\/80/g, 'text-gray-700')
      .replace(/text-white\/60/g, 'text-gray-600')
      .replace(/text-white\/40/g, 'text-gray-500')
      .replace(/text-gray-300/g, 'text-gray-600')
      .replace(/text-gray-400/g, 'text-gray-500')
    
    // Add inline styles to override any remaining white text
    processedContent = processedContent.replace(
      /style="([^"]*color:\s*white[^"]*)"/g,
      'style="$1; color: #111827 !important;"'
    )
    
    // Add global style override for any remaining white text
    processedContent = `<div style="color: #111827 !important;">${processedContent}</div>`
    
    return processedContent
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html)
    editorRef.current?.focus()
    handleInput()
  }

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ]

  const handleLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const handleImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      const alt = prompt('Enter alt text:') || ''
      insertHTML(`<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;" />`)
    }
  }

  const handleTable = () => {
    const html = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td>
        </tr>
      </table>
    `
    insertHTML(html)
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
        <div className="flex flex-wrap gap-1 justify-between">
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => execCommand(button.command, button.value)}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title={button.title}
              >
                <button.icon className="h-4 w-4" />
              </button>
            ))}
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            <button
              onClick={handleLink}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleImage}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              title="Insert Image"
            >
              <Image className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleTable}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              title="Insert Table"
            >
              <Table className="h-4 w-4" />
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('visual')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'visual' 
                  ? 'bg-[#4fdce5] text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Visual Editor"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('html')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'html' 
                  ? 'bg-[#4fdce5] text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="HTML Code"
            >
              <Code2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      {viewMode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          className={`min-h-96 p-4 focus:outline-none ${
            isFocused ? 'ring-2 ring-[#4fdce5]' : ''
          }`}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            minHeight: '300px',
            lineHeight: '1.6',
            color: '#1f2937',
            backgroundColor: '#ffffff'
          }}
          dangerouslySetInnerHTML={{ __html: processContentForEditor(value) }}
        />
      ) : (
        <textarea
          className="w-full min-h-96 p-4 border-0 focus:outline-none resize-none font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            minHeight: '300px',
            lineHeight: '1.6',
            color: '#1f2937',
            backgroundColor: '#ffffff'
          }}
          placeholder={placeholder}
        />
      )}

      {/* CSS to override white text colors in editor */}
      <style jsx>{`
        div[contenteditable] * {
          color: #1f2937 !important;
        }
        div[contenteditable] h1,
        div[contenteditable] h2,
        div[contenteditable] h3,
        div[contenteditable] h4,
        div[contenteditable] h5,
        div[contenteditable] h6 {
          color: #111827 !important;
        }
        div[contenteditable] p {
          color: #374151 !important;
        }
        div[contenteditable] .text-white {
          color: #1f2937 !important;
        }
        div[contenteditable] .text-white\\/80 {
          color: #4b5563 !important;
        }
        div[contenteditable] .text-white\\/60 {
          color: #6b7280 !important;
        }
        div[contenteditable] .text-gray-300 {
          color: #6b7280 !important;
        }
        div[contenteditable] .text-gray-600 {
          color: #4b5563 !important;
        }
        div[contenteditable] [style*="color: white"] {
          color: #1f2937 !important;
        }
        div[contenteditable] [style*="color:white"] {
          color: #1f2937 !important;
        }
      `}</style>

      {/* Placeholder */}
      {!value && (
        <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}
