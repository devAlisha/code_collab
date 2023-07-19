import React, { useEffect} from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchtags'


function Editor() {
    useEffect(() => {
        async function init() {
           Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    lineNumbers: true,
                    autoCloseTags: true,
                    autoCloseBrackets: true,

                }
            );

            
        }
            
        init();
    }, []);

  return (
     <textarea id="realtimeEditor" defaultValue=""></textarea>
  )
}

export default Editor;