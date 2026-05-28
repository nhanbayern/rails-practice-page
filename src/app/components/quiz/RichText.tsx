import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { clsx } from 'clsx';
import 'highlight.js/styles/github-dark.css';

type RichTextProps = {
  text: string;
  className?: string;
  inverted?: boolean;
};

function inferCodeLanguage(code: string) {
  if (/\b(resources|render|redirect_to|flash|params|before_action|validates|has_many|belongs_to)\b/.test(code)) {
    return 'ruby';
  }

  if (/\b(class|module|def|end|do)\b/.test(code)) {
    return 'ruby';
  }

  if (/\b(const|let|function|return|=>)\b/.test(code)) {
    return 'javascript';
  }

  return '';
}

function promoteEscapedNewlineInlineCode(markdown: string) {
  let output = '';
  let index = 0;

  while (index < markdown.length) {
    if (markdown.startsWith('```', index)) {
      const endFence = markdown.indexOf('```', index + 3);
      if (endFence === -1) {
        output += markdown.slice(index);
        break;
      }

      output += markdown.slice(index, endFence + 3).replace(/\\n/g, '\n');
      index = endFence + 3;
      continue;
    }

    if (markdown[index] !== '`') {
      output += markdown[index];
      index += 1;
      continue;
    }

    const endInlineCode = markdown.indexOf('`', index + 1);
    if (endInlineCode === -1) {
      output += markdown.slice(index);
      break;
    }

    const code = markdown.slice(index + 1, endInlineCode);
    const normalizedCode = code.replace(/\\n/g, '\n').trim();
    const shouldPromoteToBlock = code.includes('\\n') || normalizedCode.includes('\n');

    if (shouldPromoteToBlock) {
      const language = inferCodeLanguage(normalizedCode);
      output += `\n\n\`\`\`${language}\n${normalizedCode}\n\`\`\`\n\n`;
      index = endInlineCode + 1;

      if (markdown[index] === '.') {
        index += 1;
      }

      continue;
    }

    output += `\`${code}\``;
    index = endInlineCode + 1;
  }

  return output.replace(/\\n/g, '\n');
}

export function RichText({ text, className, inverted = false }: RichTextProps) {
  const markdown = promoteEscapedNewlineInlineCode(text);

  return (
    <div className={clsx('rich-text space-y-3', inverted ? 'text-slate-200' : 'text-slate-800', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p({ children }) {
            return <p className="leading-relaxed">{children}</p>;
          },
          code({ className: codeClassName, children, ...props }) {
            const isCodeBlock = Boolean(codeClassName);

            return (
              <code
                className={clsx(
                  codeClassName,
                  isCodeBlock
                    ? 'font-mono text-[0.95em]'
                    : inverted
                      ? 'rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.92em] font-semibold text-amber-200'
                      : 'rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.92em] font-semibold text-slate-950'
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return (
              <pre className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed shadow-sm">
                {children}
              </pre>
            );
          },
          ul({ children }) {
            return <ul className="ml-5 list-disc space-y-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="ml-5 list-decimal space-y-2">{children}</ol>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
