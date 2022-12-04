
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
import CompanyProperty from '../../../components/CompanyProperty';


export default function Index() {
    const [modalOpen, setModelOpen] = useState(false)
    const [propertyModal, setPropertyModal] = useState(false)

    const [initialData, setInitialData] = useState({ id: null })
    const [hiddenPassordField, setHiddenPassordField] = useState(false)
    const [refresh, setRefresh] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshDataTable, setRefreshDatatable] = useState(null)
    const [file, setFile] = useState(null)
    const [companyTypeList, setCompanyTypeList] = useState([])
    const [selectedComapnyId, setSelectedComapnyId] = useState()

    const [selectedCompanyPropertyTypeId, setSelectedCompanyTypeId] = useState()

    useEffect(() => {

        start();
    }, [])
    const start = async () => {
        var d = await GetWithToken("Company/GetCompanyType").then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        setCompanyTypeList(d.data)
        setLoading(false)
    }

    const submit = async (val) => {
        var dataId = null;
        if (val.id == undefined) {
            var d = await PostWithToken("Company/Create", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            console.log(d)
            if (d.isError) {
                alert(d.message)
            } else {

                dataId = d.data.id
            }

        } else { 
            var d = await PostWithToken("Company/Edit", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            if (d.isError) {
                alert(d.message)
            } else {
                dataId = d.data.id
            }
        }
        if (file) {
            var d = await PostWithTokenFile("FileUpload/Upload", { name: "file", data: file }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            await PostWithToken("Company/UploadFile", { fileName: d.data.fileName, id: dataId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

        }

        setRefreshDatatable(new Date())
    }

    const deleteData = async (data) => {
        var d = await GetWithToken("Company/delete/" + data.companyId).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
        if (d.isError) {
            alert(d.message)
        }
        setRefreshDatatable(new Date())

    }

    const deleteFile = async (fileName, id) => {

        await PostWithToken("Company/FileDelete", { fileName: fileName, id: id }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })


    }

    const editData = async (data) => {
        setFile(null)
        console.log(data)
        setHiddenPassordField(true)
        var d = await GetWithToken("Company/getById/" + data.companyId).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })


        setInitialData(d.data)


        setRefresh(new Date())
        setModelOpen(true)
    }

    return (
        <>{
            loading && <PageLoading></PageLoading>
        }


            <Modal isOpen={modalOpen}
                size="sm"
                toggle={() => setModelOpen(!modalOpen)}
                modalTransition={{ timeout: 100 }}>
                <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }}>
                    <div className="d-flex justify-content-center mb-2">
                    </div>
                    <div className="d-flex ">
                        <p>FirmaÖzellik <b>Ekleme</b> Formu</p>
                    </div>
                    <button onClick={() => setModelOpen(!modalOpen)} type='button' className='modal-close-button btn btn-danger btn-sm p-1'><i className='fas fa-times'></i></button>

                </ModalHeader>  <ModalBody>
                    <Formik
                        initialValues={initialData}
                        validate={values => {
                            const errors = {};

                            if (!values.name) {
                                errors.name = 'Bu alan zorunludur';
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {


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
                                    <div className=' col-12  mb-3'>
                                        <ErrorMessage name="name" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Firma Adı</label>
                                        <Field type="text" id="name" className="form-control" name="name" />
                                    </div>
                                    <div className=' col-12  mb-3'>
                                        <ErrorMessage name="name" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Firma Türü</label>
                                        <select className='form-control' value={values.companyTypeId} onChange={handleChange} onBlur={onblur} id="companyTypeId" name="companyTypeId">
                                            <option>Seçiniz</option>
                                            {companyTypeList.map((item, key) => {
                                                return <option key={key} value={item.id}>{item.name}</option>
                                            })}
                                        </select>
                                    </div>


                                    <div className='col-md-6 col-12 mb-3'>
                                        {/* <ErrorMessage name="phone" component="div" className='text-danger danger-alert-form' /> */}
                                        <label className='input-label'>Firma Logo</label>
                                        <input type="file" onChange={(x) => setFile(x.target.files[0])} name="file" id="file"></input>
                                        {
                                            file != null &&
                                            <div className='col-12 mt-2'>
                                                <img style={{ width: "100px" }} src={URL.createObjectURL(file)}></img>
                                                <button type='button' className='btn btn-danger btn-sm' onClick={() => { setFile(null) }} > Kaldır X</button>
                                            </div>
                                        }

                                        {
                                            file == null && values.logoUrl &&
                                            <div className='col-12 mt-2'>
                                                <img style={{ width: "100px" }} src={fileUploadUrl + values.logoUrl}></img>
                                                <button type='button' className='btn btn-danger btn-sm' onClick={async () => { setFieldValue("logoUrl", null); setFile(null); await deleteFile(values.logoUrl, values.id); }} > Kaldır X</button>
                                            </div>
                                        }
                                    </div>
                                    <div className='row col-12  mt-4'>
                                        <div className='col-md-6 col-12 mt-1 '>
                                            <button type='submit' disabled={isSubmitting} className={"btn btn-primary btn-block loading-button" + (isSubmitting && " loading-button")}><span>Kaydet <i className="icon-circle-right2 ml-2"></i></span></button>
                                        </div>
                                        <div className='col-md-6 col-12 mt-1'>
                                            <button type='button' onClick={() => {  setModelOpen(!modalOpen) }} className={"btn btn-warning btn-block "}><span>Kapat <i className="fas fa-undo ml-2"></i></span></button>
                                        </div>
                                    </div>
                                </>}
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>





            <Layout>
                <PageHeader title="Firmalarım" map={[
                    { url: "", name: "Firmalarım" },
                    { url: "", name: "Firma Listesi" }
                ]}>

                </PageHeader>


                <div className='content pr-3 pl-3'>
                    <div className='card'>
                        <DataTable Refresh={refreshDataTable} DataUrl={"Company/GetByCurrentUser"} Headers={[
                            ["companyName", "Firma Adı"],
                            ["companyType", "Firma Türü"],
                            {
                                header: <span>Yayında mı</span>,
                                dynamicButton: (data) => { return <span title='yayın' ><i className={data.isPublish && 'fas fa-check active-icon' || 'fas fa-times passive-icon'}></i> </span> }
                            },
                            {
                                header: <span>#</span>,
                                dynamicButton: (data) => { return <a href={"firma-listesi/firma-ozellikleri/"+data.companyId}  className='btn btn-sm btn-outline-success'><i class="fa fa-trophy"></i> Özellikler </a> }
                            },
                            {
                                header: <span>#</span>,
                                dynamicButton: (data) => { return <a href={"firma-listesi/resimler/"+data.companyId}   className='btn btn-sm btn-outline-info'> <i className='fas fa-file-image'></i>  Resimler </a> }
                            }

                        ]} Title={<span>Firma  Listesi</span>}
                            Description={"Firma kayıtlarında düzenleme ve ekleme işlemini burdan yapabilirsiniz"}
                            HeaderButton={{
                                text: "Firma  Ekle", action: () => {
                                    setModelOpen(!modalOpen)
                                    setInitialData({})
                                }
                            }}
                            EditButton={editData}
                            DeleteButton={deleteData}
                        // Pagination={{ pageNumber: 1, pageSize: 10 }}
                        ></DataTable>
                    </div>
                </div>
            </Layout>
        </>
    )

}