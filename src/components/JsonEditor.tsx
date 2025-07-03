import { useEffect, useRef } from "react";
import { foldGutter, indentOnInput, syntaxTree } from "@codemirror/language";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { defaultKeymap } from "@codemirror/commands";

const JsonEditor = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const startState = EditorState.create({
        doc: value,
        extensions: [
          keymap.of(defaultKeymap),
          json(),
          lineNumbers(),
          foldGutter(),
          indentOnInput(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newValue = update.state.doc.toString();
              onChange(newValue);
            }
          }),
        ],
      });

      viewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current,
      });
    }

    return () => viewRef.current?.destroy();
  }, []);

  useEffect(() => {
  if (viewRef.current && value) {
    const transaction = viewRef.current.state.update({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: value,
      },
    });
    viewRef.current.dispatch(transaction);
  }
}, [value]);

  return <div style={{ margin: '10px', border: '2px solid blue' }} ref={editorRef} />;
};

export default JsonEditor;
