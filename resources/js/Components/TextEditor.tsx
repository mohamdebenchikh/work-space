import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Underline from "@tiptap/extension-underline"

import { Toggle } from "@/Components/ui/toggle"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Highlighter,
} from "lucide-react"

interface TextEditorProps {
  content?: string
  onChange?: (content: string) => void
}

export function TextEditor({ content = "", onChange }: TextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({ 
        types: ["heading", "paragraph"],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TaskList,
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px] max-h-[500px] overflow-auto",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    setIsMounted(true)
    return () => {
      editor?.destroy()
    }
  }, [])

  if (!isMounted || !editor) {
    return (
      <div className="border rounded-lg shadow-sm animate-pulse">
        <div className="h-10 bg-muted/50" />
        <div className="h-[200px] bg-muted/30" />
      </div>
    )
  }

  return (
    <div className="border rounded-lg shadow-sm bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 mr-2 border-r">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            aria-label="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            aria-label="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("highlight")}
            onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
            aria-label="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </Toggle>
        </div>

        {/* Headings */}
        <div className="flex gap-1 pr-2 mr-2 border-r">
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </Toggle>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 mr-2 border-r">
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet List"
          >
            <List className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("taskList")}
            onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
            aria-label="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </Toggle>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 pr-2 mr-2 border-r">
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
            aria-label="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
            aria-label="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
            aria-label="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
            aria-label="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </Toggle>
        </div>

        {/* Block Elements */}
        <div className="flex gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("blockquote")}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </Toggle>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}