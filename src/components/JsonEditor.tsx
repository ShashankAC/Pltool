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
    if (viewRef.current && value != null) {
      const editor = viewRef.current;
      const currentValue = editor.state.doc.toString();
      if (currentValue !== value) {
        // Save scroll and selection
        const scrollDOM = editor.scrollDOM;
        const scrollTop = scrollDOM ? scrollDOM.scrollTop : 0;
        const scrollLeft = scrollDOM ? scrollDOM.scrollLeft : 0;

        // Clamp selection to new document length
        let selection = editor.state.selection;
        const newDocLength = value.length;
        let anchor = Math.min(selection.main.anchor, newDocLength);
        let head = Math.min(selection.main.head, newDocLength);
        // If selection is out of bounds, reset to start
        if (anchor < 0 || head < 0 || anchor > newDocLength || head > newDocLength) {
          anchor = head = 0;
        }
        const transaction = editor.state.update({
          changes: { from: 0, to: editor.state.doc.length, insert: value },
          selection: { anchor, head },
        });
        editor.dispatch(transaction);

        // Restore scroll and selection after DOM update
        if (scrollDOM) {
          requestAnimationFrame(() => {
            scrollDOM.scrollTop = scrollTop;
            scrollDOM.scrollLeft = scrollLeft;
          });
        }
      }
    }
  }, [value]);

  return <div style={{
    margin: '10px',
    border: '2px solid blue',
    height: "600px",       // ⬅️ Fixed height
    overflow: "auto"
    }} 
    ref={editorRef} 
  />;
};

export default JsonEditor;
