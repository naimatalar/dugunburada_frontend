
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import AlertFunction from '../../../components/alertfunction';
import DataTable from '../../../components/datatable';
import Layout from '../../../layout/layout';
import PageHeader from '../../../layout/pageheader';
import PageLoading from '../../../layout/pageLoading';
import Image from "next/image"
import { Modal, ModalBody, ModalHeader, Tooltip } from 'reactstrap';
import { fileUploadUrl, GetWithToken, PostWithToken, PostWithTokenFile } from '../../api/crud';
const isBrowser = typeof window !== "undefined";

export default function Index() {
    const [modalOpen, setModelOpen] = useState(false)
    const [initialData, setInitialData] = useState({ id: null, valueList: [] })
    const [hiddenPassordField, setHiddenPassordField] = useState(false)
    const [refresh, setRefresh] = useState(null)

    const [loading, setLoading] = useState(true)
    const [refreshDataTable, setRefreshDatatable] = useState(null)
    const [file, setFile] = useState(null)
    const [selectedkind, setSelectedKind] = useState(1)
    const [selectedkindText, setSelectedKindText] = useState("Fiyatlandırma")
    const [selectedCompanyType, setSelectedCompanyType] = useState()
    const [selectedCompanyTypeText, setSelectedCompanyTypeText] = useState()
    const [companyTypeList, setCompanyTypeList] = useState([])
    const [pListVal, setPlistVal] = useState()
    const [plist, setPlist] = useState([])


    useEffect(() => {

        start();
    }, [])
    const start = async () => {
        var d = await GetWithToken("CompanyType/GetCompanyType").then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

        if (d.data?.length == 0) {
            alert("Öncelikle firma türü eklenmelidir")
            if (isBrowser) {
                window.location.replace("/super-admin/firma-turleri")
            }
        }
        setSelectedCompanyType(d.data[0].id)
        setSelectedCompanyTypeText(d.data[0].name)
        setCompanyTypeList(d.data)
        setLoading(false)
    }

    const submit = async (val) => {
        var dataId = null;
        if (val.id == undefined) {
            var d = await PostWithToken("CompanyProperty/createList", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            if (d.isError) {
                alert(d.message)
            } else {

                // dataId = d.data.id
            }

        } else {
            var d = await PostWithToken("CompanyProperty/Edit", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            if (d.isError) {
                alert(d.message)
            } else {
                // dataId = d.data.id
            }
        }


        setRefreshDatatable(new Date())
    }

    const deleteData = async (data) => {
        var d = await GetWithToken("CompanyProperty/delete/" + data.id).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
        if (d.isError) {
            alert(d.message)
        }
        setRefreshDatatable(new Date())

    }

    const removePrList = async (data) => {
       var ls=plist.filter(x=>{return x!=data})
        setPlist(ls)
        setRefreshDatatable(new Date())

    }
    const editData = async (data) => {
        setPlist([])
        var d = await GetWithToken("CompanyProperty/getById/" + data.id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })

        setInitialData(d.data)

        setPlist(d.data.valueList)
        setRefresh(new Date())
        setModelOpen(true)
    }

    return (
        <>{
            loading && <PageLoading></PageLoading>
        }

            <Modal isOpen={modalOpen}
                size="md"
                toggle={() => setModelOpen(!modalOpen)}
                modalTransition={{ timeout: 100 }}>
                <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }}>
                    <div className="d-flex justify-content-center mb-2">
                    </div>
                    <div className="d-flex ">
                        <p>{selectedkindText} <b>Tanımlama</b> Formu</p>
                    </div>
                    <button onClick={() => setModelOpen(!modalOpen)} type='button' className='modal-close-button btn btn-danger btn-sm p-1'><i className='fas fa-times'></i></button>

                </ModalHeader>  <ModalBody>
                    <Formik
                        initialValues={initialData}
                        validate={values => {
                            const errors = {};
                            values.valueList = []
                            if (!values.key) {
                                errors.key = 'Bu alan zorunludur';
                            }
                            if (!values.companyPropertyValueType) {
                                errors.companyPropertyValueType = 'Bu alan zorunludur';
                            }

                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            values.companyPropertyKind = selectedkind
                            values.companyTypeId = selectedCompanyType
                            values.valueList = plist.map((item, key) => { return item.item })
                            setTimeout(async () => {
                                await submit(values)
                                setSubmitting(false);
                                setModelOpen(!modalOpen)
                            }, 400);
                        }}
                    >
                        {({ isSubmitting, isValidating, handleChange, handleBlur, setFieldValue, values }) => (
                            <Form className='row mt-3 col-12 form-n-popup' >
                                {initialData && <>
                                    <ErrorMessage name="id" component="div" className='text-danger' />
                                    <Field type="hidden" name="id" />

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="key" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Özellik</label>
                                        <Field type="text" id="key" className="form-control" name="key" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="companyPropertyValueType" component="companyPropertyValueType" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Özellik Tipi</label>
                                        <select style={{ width: "100%", padding: 7 }} name='companyPropertyValueType' id='companyPropertyValueType' onChange={handleChange} onBlur={handleBlur} value={values.companyPropertyValueType}>
                                            <option value={""}>
                                                Seçiniz
                                            </option>
                                            <option value={1}>
                                                Yazı
                                            </option>
                                            <option value={2}>
                                                Sayısal
                                            </option>
                                            <option value={3}>
                                                Para
                                            </option>
                                            <option value={4}>
                                                Var/Yok
                                            </option>
                                            <option value={5}>
                                                Liste
                                            </option>

                                        </select>

                                    </div>
                                    {
                                        values.companyPropertyValueType == 5 &&
                                        <div className='mb-3 row col-12'>
                                            <div className='col-12 col-md-6'>

                                                <label className='input-label'>Değerler</label>
                                                <input type="text" id="kList" onChange={(x) => { setPlistVal(x.target.value) }} className="form-control" name="kList" />

                                            </div>
                                            <div className='col-12 col-md-6'>
                                                <button type='button' className='btn btn-outline-success' onClick={(x) => {

                                                    var sad = plist

                                                    plist.push({ item: pListVal, id: "" });
                                                    setFieldValue("valueList", plist)
                                                }}>+ Ekle</button>
                                            </div>
                                        </div>
                                    }

                                    <div className='col-12'>
                                        {
                                            plist?.map((item, key) => {
                                               
                                                return (<div className='col-12 p-list-item mb-2' key={key}>{item.item} <span onClick={()=>{removePrList(item)}} className='remove-lst-button'>X</span></div>)
                                            })
                                        }
                                    </div>


                                    <div className='col-12  mb-3'>
                                        <ErrorMessage name="isDefault" component="div" className='text-danger danger-alert-form' />
                                        <label className='mr-4'><Field type="checkbox" id="isDefault" name="isDefault" />Bütün Firmalar İçin </label>
                                        <label className='mr-4' ><Field type="checkbox" id="isPrimary" name="isPrimary" /> Birincil </label>
                                        <label className='mr-4'>   <Field type="checkbox" id="isOnlyValue" name="isOnlyValue" /> Sadece Değer</label>


                                    </div>


                                    <div className='row col-12  mt-4'>
                                        <div className='col-md-3 col-12 mt-1 '>
                                            <button type='submit' disabled={isSubmitting} className={"btn btn-primary btn-block loading-button" + (isSubmitting && " loading-button")}><span>Kaydet <i className="icon-circle-right2 ml-2"></i></span></button>
                                        </div>
                                        <div className='col-md-3 col-12 mt-1'>
                                            <button type='button' onClick={() => { toggleModal() }} className={"btn btn-warning btn-block "}><span>Kapat <i className="fas fa-undo ml-2"></i></span></button>
                                        </div>
                                    </div>
                                </>}
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>


            <Layout>
                <PageHeader title="Firma Özellikleri" map={[
                    { url: "", name: "Süper Admin" },
                    { url: "", name: "ÖzellikTanımları" }
                ]}>

                </PageHeader>
                <div className='content pr-3 pl-3 d-flex'>
                    <div className='sidebar sidebar-light sidebar-secondary sidebar-expand-md'>
                        <div className='sidebar-content'>
                            <div className='card'>


                                <div className='card-header bg-transparent header-elements-inline row'>
                                    <div className='row' style={{ width: "100%" }}>
                                        <h2><b>Firma Türü</b></h2>
                                        <div className='row' style={{ width: "100%" }}>
                                            <select style={{ width: "100%", padding: 5 }} onChange={(x) => { setSelectedCompanyType(x.target.value); setRefreshDatatable(new Date()) }}>
                                                {companyTypeList.map((item, key) => {
                                                    return <option key={key} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                })}
                                            </select>

                                        </div>

                                        {/* <span></span> */}
                                    </div>
                                </div>



                                <div className='card-body'>
                                    {/* 
                                    <ol class="rounded-list">
                                        <li><a href="">List item</a></li>
                                        <li><a href="">List item</a></li>

                                        <li><a href="">List item</a></li>
                                        <li><a href="">List item</a></li>
                                    </ol> */}

                                    <ol className='rounded-list'>
                                        <li onClick={() => { setSelectedKind(1); setRefreshDatatable(new Date()); setSelectedKindText("Fiyatlandırma") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 1 && 'act' || "slc_"} ><a style={selectedkind == 1 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 1 && ">>"} Fiyatlandırma</a></li>
                                        <li onClick={() => { setSelectedKind(2); setRefreshDatatable(new Date()); setSelectedKindText("Teknik ve Lokasyon Özellikleri") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 2 && 'act' || "slc_"} ><a style={selectedkind == 2 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 2 && ">>"} Teknik ve Lokasyon Özellikleri</a></li>
                                        <li onClick={() => { setSelectedKind(3); setRefreshDatatable(new Date()); setSelectedKindText("Hizmet ve Organizasyon") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 3 && 'act' || "slc_"} ><a style={selectedkind == 3 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 3 && ">>"} Hizmet ve Organizasyon</a></li>
                                        <li onClick={() => { setSelectedKind(4); setRefreshDatatable(new Date()); setSelectedKindText("Kapasite Bilgileri") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 4 && 'act' || "slc_"} ><a style={selectedkind == 4 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 4 && ">>"} Kapasite Bilgileri</a></li>
                                        <li onClick={() => { setSelectedKind(5); setRefreshDatatable(new Date()); setSelectedKindText("Genel Özellikler") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 5 && 'act' || "slc_"} ><a style={selectedkind == 5 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 5 && ">>"} Genel Özellikler</a></li>
                                        {/* <li onClick={() => { setSelectedKind(6); setRefreshDatatable(new Date()); setSelectedKindText("Sık Sorulan Sorular") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 6 && 'act' || "slc_"} ><a style={selectedkind == 6 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 6 && ">>"} Sık Sorulan Sorular</a></li>
                                        <li onClick={() => { setSelectedKind(7); setRefreshDatatable(new Date()); setSelectedKindText("Hakkinda") }} style={{ cursor: "pointer", textAlign: "center" }} className={selectedkind == 7 && 'act' || "slc_"} ><a style={selectedkind == 7 && { fontWeight: "bold" } || { fontWeight: "normal" }}>{selectedkind == 7 && ">>"} Hakkinda</a></li> */}


                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='content'>
                        <div className='content pl-4 pt-3'>
                            <div className='col'>

                                {selectedCompanyType && <DataTable Refresh={refreshDataTable} DataUrl={"CompanyProperty/GetAllByCompanyPropertyKind/" + selectedkind + "/" + selectedCompanyType} Headers={[
                                    ["key", "Özellik"],
                                    ["companyPropertyValueTypeString", "Özellik Tipi"],
                                    {
                                        header: <span>Birincil</span>,
                                        dynamicButton: (data) => { return <span title='Seçili' ><i className={data.isPrimary && 'fas fa-check' || 'fas fa-times'}></i> </span> }
                                    },
                                    {
                                        header: <span>Bütün Firmalar İçin</span>,
                                        dynamicButton: (data) => { return <span title='Seçili' ><i className={data.isDefault && 'fas fa-check' || 'fas fa-times'}></i> </span> }
                                    },
                                    {
                                        header: <span>Sadece Değer</span>,
                                        dynamicButton: (data) => { return <span title='Seçili' ><i className={data.isOnlyValue && 'fas fa-check' || 'fas fa-times'}></i> </span> }
                                    },

                                ]} Title={<span>{selectedkindText} Listesi</span>}
                                    Description={selectedkindText + " Firma kayıtlarında düzenleme ve ekleme işlemini burdan yapabilirsiniz"}
                                    HeaderButton={{
                                        text: "Yeni Ekle", action: () => {
                                            setModelOpen(!modalOpen)
                                            setPlist([])
                                            setInitialData({})
                                        }
                                    }}
                                    EditButton={editData}
                                    DeleteButton={deleteData}
                                // Pagination={{ pageNumber: 1, pageSize: 10 }}
                                ></DataTable>}
                            </div>


                        </div>

                    </div>

                </div>
            </Layout>
        </>
    )

}