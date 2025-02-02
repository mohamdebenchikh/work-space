

export default function TextEditorContent({ content }: { content: string }) {
    return (
        <div
            className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}