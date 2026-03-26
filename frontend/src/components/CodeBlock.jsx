import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodeBlock({ language, value }) {
  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-400 border-b border-gray-700">
        <span>{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="hover:text-white transition-colors"
        >
          复制代码
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1rem", fontSize: "0.875rem" }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
