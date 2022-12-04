import React, { useEffect, useState } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import { GetWithToken, PostWithToken } from '../pages/api/crud';
import AlertFunction from './alertfunction';

const AboutUs = ({ companyId }) => {
const [textContent,setTextContent]=useState("")
    useEffect(() => {

        start()
    }, [])
    const start = async () => {
        var d = await GetWithToken("AboutUs/GetAboutUsByCompanyId/" + companyId).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
      
        setTextContent(d.data?.text)
    }
    const create = async () => {
       await PostWithToken("AboutUs/create",{companyId:companyId,text:textContent}).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
     
    } 
    return (<div className='col-12'>

        <SunEditor onBlur={(event, editorContents)=>{setTextContent(editorContents)}} setContents={textContent} defaultValue={textContent} height='300' setOptions={{
            buttonList: [
                ['undo', 'redo'],
                ['fontSize','fontColor','bold', 'underline', 'italic'],
                [ 'fullScreen']
            ]
        }} />
        <div className='row justify-content-end mt-2'>
            <button type='button' onClick={()=>create()} className='btn btn-success btn-sm'>Kaydet</button>

        </div>
    </div>);
};

export default AboutUs;