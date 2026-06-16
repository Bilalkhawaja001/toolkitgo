import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
const privacy='Your data stays in your browser. Nothing is uploaded.';
const encodeUtf8=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const decodeUtf8=s=>new TextDecoder().decode(Uint8Array.from(atob(s.trim()),c=>c.charCodeAt(0)));
function copy(text){ if(text) navigator.clipboard?.writeText(text); }
function Base64Encoder(){ const [input,setInput]=useState('Hello ToolKitGo'); const [output,setOutput]=useState(''); const [error,setError]=useState(''); const enc=()=>{setError('');setOutput(encodeUtf8(input));}; const dec=()=>{setError(''); try{setOutput(decodeUtf8(input));}catch(e){setOutput('');setError('Invalid Base64 input.');}}; return <div className="tool-card simple-tool"><div className="tool-status-line"><span className="status-ready">Working client-side</span><span>{privacy}</span></div><h2>Base64 Encoder/Decoder</h2><textarea className="form-textarea code-area" value={input} onChange={e=>setInput(e.target.value)} /><div className="tool-button-row"><button className="btn btn-primary" onClick={enc}>Encode to Base64</button><button className="btn btn-secondary" onClick={dec}>Decode to text</button><button className="btn btn-secondary" onClick={()=>copy(output)} disabled={!output}>Copy output</button></div><ErrorMessage message={error}/><textarea className="form-textarea code-area" readOnly value={output} placeholder="Output" /></div>; }
export default Base64Encoder;
