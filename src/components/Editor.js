import React, { useEffect, useRef} from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchtags'
 

function Editor({socketRef,roomId,onCodeChange}) {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
           editorRef.current=Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    lineNumbers: true,
                    autoCloseTags: true,
                    autoCloseBrackets: true,

                }
            );
            editorRef.current.on('change', (editor,changes) => {
                const code=editor.getValue();
                console.log('changes: ',changes); 
                const {origin}=changes;
                onCodeChange(code);
                if(origin!=='setValue'){
                    socketRef.current.emit('code-change',{code,roomId});
                }
                console.log('code: ',code);
            }
            );
            
            
        }
             
        init();
    }, []);
    useEffect(() => {
        if(socketRef.current){
            socketRef.current.on('code-change',({code})=>{
                if(code!==null)
                editorRef.current.setValue(code);
            });
            return () => {
                socketRef.current.off('code-change');
            }
        }
    }, [socketRef.current]);

  return (
     <textarea id="realtimeEditor" defaultValue=""></textarea>
  )
}

export default Editor;