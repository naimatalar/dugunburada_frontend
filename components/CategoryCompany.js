import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { fileUploadUrl, GetWithToken, PostWithToken } from '../pages/api/crud';
import AlertFunction from './alertfunction';

function CategoryCompany(props) {
    const [data, setData] = useState([])
    const [selectData, setSelectData] = useState([])
    const [selectCompanyData, setSelectComapnyData] = useState([])

    const [companyTypeId, setCompanyTypeId] = useState()
    const [companyId, setCompanyId] = useState()
    const [description, setDescription] = useState()


    useEffect(() => {
        start()

    }, [])

    const start = async () => {

        var d = await GetWithToken("IndexDesign/getSelectedCompanyTypeCompany").then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        setData(d.data)
        selectedChange("")

    }
    const selectedChange = async (data) => {

        var d = await PostWithToken("companyType/getCompanyTypeByName", { name: data }).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        var lst = [];
        for (const item of d.data) {
            lst.push({ label: item.name, value: item.id })

        }
        setSelectData(lst)
    }

    const selectedCompanyChange = async (data) => {

        var d = await PostWithToken("company/GetCompanyByNameAndCompanyType", { name: data, id: companyTypeId }).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        var lst = [];
        for (const item of d.data) {
            lst.push({ label: item.name, value: item.id })

        }
        setSelectComapnyData(lst)
    }
    const create = async () => {

        var d = await PostWithToken("IndexDesign/createSelectedCompanyTypeCompany", { description: description, companyId: companyId ,companyTypeId:companyTypeId}).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        setDescription("")
        start()
    }

    const deleteData = async (id) => {
        var d = await GetWithToken("IndexDesign/removeSelectedCompanyTypeCompany/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        start()
    }



    return (
        <div >
            <div className='row'>
                <div className='col-12'>
                    <div className='row justify-content-center' style={{
                        position: "absolute",
                        width: "100%",
                        zIndex: "99"
                    }}>
                        <div className='col-12 col-md-4 '>
                            <Select placeholder="Seçiniz" onChange={(x) => { setCompanyTypeId(x.value); selectedCompanyChange("") }} onInputChange={(x) => { selectedChange(x) }} options={selectData} ></Select>

                        </div>
                        <div className='col-12 col-md-4'>
                            <Select placeholder="Seçiniz" onChange={(x) => { setCompanyId(x.value) }} onInputChange={(x) => { selectedCompanyChange(x) }} options={selectCompanyData} ></Select>

                        </div>
                        <div className='row col-12 justify-content-center p-0 mt-3'>
                            <div className='col-12 col-md-6 p-0'>
                                <textarea rows={3} style={{ width: "100%" }} value={description} onChange={(x) => setDescription(x.target.value)}></textarea>

                            </div>
                            <div className='col-12 col-md-2 row  justify-content-end pl-4'>
                                <button style={{width:"100%"}} onClick={() => create()} className='btn btn-success'> Ekle </button>

                            </div>
                        </div>

                    </div>
                    <div className='row mt-5 pb-5 justify-content-center' style={{paddingTop:100}}>
                        {data.length == 0 && <>
                            <div className='col-12 row justify-content-center'>
                                <div className='col-6 text-center'>
                                    <b style={{ fontSize: 20 }}>Anasayfa Kategori Firmaları</b>

                                </div>

                            </div>
                            <div className='col-12 row justify-content-center'>
                                <div className='col-6 text-center'>
                                    <span style={{ fontSize: 20 }}>Henüz Anasayfa Kategori Firmaları Eklenmemiş.</span>

                                </div>

                            </div>

                        </>
                        }
                        {data.map((item, key) => {

                            return <div className='col-12 col-md-3 p-3 row '>
                                <button className='bb-index-delete' onClick={() => { confirm("Kayıt Silinecek Onayliyor Musunuz") && deleteData(item.id) }}><i className='fa fa-trash'></i></button>
                                <div className='bb-index-cat col-12'>

                                    <img style={{ width: "100%" }} src={fileUploadUrl + item.logoUrl}></img>
                                    <div className='bb-index-name'> {item.name}</div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CategoryCompany;