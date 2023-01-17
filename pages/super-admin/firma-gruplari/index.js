
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


export default function Index() {
    const [modalOpen, setModelOpen] = useState(false)
    const [initialData, setInitialData] = useState({ id: null })
    const [hiddenPassordField, setHiddenPassordField] = useState(false)
    const [refresh, setRefresh] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshDataTable, setRefreshDatatable] = useState(null)
    const [file, setFile] = useState(null)
    


    useEffect(() => {

        start();
    }, [])
    const start = async () => {

        setLoading(false)
    }

    const submit = async (val) => {
        var dataId = null;
        if (val.id == undefined) {
            var d = await PostWithToken("CompanyGroup/Create", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            if (d.isError) {
                alert(d.message)
            } else {

                dataId = d.data.id
            }

        } else {
            var d = await PostWithToken("CompanyGroup/Edit", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            if (d.isError) {
                alert(d.message)
            } else {
                dataId = d.data.id
            }
        }
        if (file) {
            var d = await PostWithTokenFile("FileUpload/Upload", { name: "file", data: file }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            await PostWithToken("CompanyGroup/UploadFile", { fileName: d.data.fileName, id: dataId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

        }

        setRefreshDatatable(new Date())
    }

    const deleteData = async (data) => {
        var d = await GetWithToken("CompanyGroup/delete/" + data.id).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
        if (d.isError) {
            alert(d.message)
        }
        setRefreshDatatable(new Date())

    }

    const deleteFile = async (fileName, id) => {

        await PostWithToken("CompanyGroup/FileDelete", { fileName: fileName, id: id }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })


    }

    const editData = async (data) => {
        setFile(null)
        setHiddenPassordField(true)
        var d = await GetWithToken("CompanyGroup/getById/" + data.id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })


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
                        <p>Firma Türü <b>Tanımlama</b> Formu</p>
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
                                        <label className='input-label'>Firma Grup Adı</label>
                                        <Field type="text" id="name" className="form-control" name="name" />
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
                                            file == null && values.imageUrl &&
                                            <div className='col-12 mt-2'>
                                                <img style={{ width: "100px" }} src={fileUploadUrl + values.imageUrl}></img>
                                                <button type='button' className='btn btn-danger btn-sm' onClick={async () => { setFieldValue("imageUrl", null); setFile(null); await deleteFile(values.logoUrl, values.id); }} > Kaldır X</button>
                                            </div>
                                        }
                                    </div>



                                    <div className='row col-12  mt-4'>
                                        <div className='col-md-6 col-12 mt-1 '>
                                            <button type='submit' disabled={isSubmitting} className={"btn btn-primary btn-block loading-button" + (isSubmitting && " loading-button")}><span>Kaydet <i className="icon-circle-right2 ml-2"></i></span></button>
                                        </div>
                                        <div className='col-md-6 col-12 mt-1'>
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
                <PageHeader title="Firma Grupları" map={[
                    { url: "", name: "Super Admin" },
                    { url: "", name: "Firma Grupları Listesi" }
                ]}>

                </PageHeader>


                <div className='content pr-3 pl-3'>
                    <div className='card'>
                        <DataTable Refresh={refreshDataTable} DataUrl={"CompanyGroup/GetAll"} Headers={[
                            ["name", "Firma Grup Adı"],
                            ["CompaniesLength", "Firma Sayısı"],

                        ]} Title={<span>Firma Grup Listesi</span>}
                            Description={"Firma grubu kayıtlarında düzenleme ve ekleme işlemini burdan yapabilirsiniz"}
                            HeaderButton={{
                                text: "Firma Grubu Ekle", action: () => {
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