import React, { useState } from 'react';
const TOOL_ID='html-encoder';
const privacy='Your data stays in your browser. Nothing is uploaded.';
const encode=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const decode=s=>{ const t=document.createElement('textarea'); t.innerHTML=s; return t.value; };
const copy=t=>navigator.clipboard?.writeText(t);
function HtmlEncoder(){ const [input,setInput]=useState('<div class="demo">Tom & Jerry</div>'); const [output,setOutput]=useState(''); return <div className="tool-card phase1b-tool dev-tool" data-tool={TOOL_ID}><div className="tool-status-line"><span className="status-ready">Working client-side</span><span>{privacy}</span></div><h2>HTML Encoder/Decoder</h2><div className="phase1b-two-panel"><label>Input<textarea className="form-textarea code-area" value={input} onChange={e=>setInput(e.target.value)} /></label><label>Output<textarea className="form-textarea code-area" readOnly value={output} /></label></div><div className="tool-button-row"><button className="btn btn-primary" onClick={()=>setOutput(encode(input))}>Encode HTML entities</button><button className="btn btn-secondary" onClick={()=>setOutput(decode(input))}>Decode HTML entities</button><button className="btn btn-secondary" onClick={()=>copy(output)} disabled={!output}>Copy output</button><button className="btn btn-secondary" onClick={()=>{setInput('');setOutput('');}}>Clear</button></div></div>; }
export default HtmlEncoder;
