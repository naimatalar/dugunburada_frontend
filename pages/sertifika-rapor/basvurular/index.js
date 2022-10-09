
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
    const [initialData, setInitialData] = useState({ id: null, negaticeStatus: null })
    const [hiddenPassordField, setHiddenPassordField] = useState(false)
    const [refresh, setRefresh] = useState(null)
    const [roles, setRoles] = useState([])
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

        var d = await PostWithToken("DocumentApplication/Update", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })

        if (d.isError) {
            alert(d.message)
        }


        setRefreshDatatable(new Date())
    }





    const editData = async (data) => {
        debugger
        setHiddenPassordField(true)
        var d = await GetWithToken("DocumentApplication/GetById/" + data).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })


        setInitialData(d.data)


        setRefresh(new Date())
        setModelOpen(true)
    }

    return (
        <>{
            loading && <PageLoading></PageLoading>
        }

            <Modal isOpen={modalOpen}
                size="lg"
                toggle={() => setModelOpen(!modalOpen)}
                modalTransition={{ timeout: 100 }}>
                <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }}>
                    <div className="d-flex justify-content-center mb-2">
                    </div>
                    <div className="d-flex ">
                        <p>Firma <b>Tanımlama</b> Formu</p>
                    </div>
                    <button onClick={() => setModelOpen(!modalOpen)} type='button' className='modal-close-button btn btn-danger btn-sm p-1'><i className='fas fa-times'></i></button>

                </ModalHeader>  <ModalBody>
                    <Formik
                        initialValues={initialData}
                        validate={values => {
                            const errors = {};

                            if (!values.interviewer) {
                                errors.interviewer = "Bu alan zorunludur"
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
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="fullName" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Ad Soyad</label>
                                        <Field type="text" id="fullName" className="form-control" disabled name="fullName" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="mail" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>E-Posta</label>
                                        <Field type="text" id="mail" className="form-control" disabled name="mail" />
                                    </div>

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="phone" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Telefon</label>
                                        <Field type="text" id="phone" className="form-control" disabled name="phone" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="phone" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Başvuru Kanalı</label>
                                        <Field type="text" id="phone" className="form-control" value={values.isMobil&&"Mobil App"||"Web"} disabled name="phone" />
                                    </div>

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="phone" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Durum</label>
                                        <select onChange={(x) => setFieldValue("status", x.target.value)} onBlur={handleBlur} value={values?.status} style={{ width: "100%", padding: 7 }}>
                                            <option value={1}>
                                                Bekliyor
                                            </option>
                                            <option value={2}>
                                                Olumlu
                                            </option>
                                            <option value={3}>
                                                Olumsuz
                                            </option>
                                        </select>
                                    </div>
                                    {values?.status == 3 && <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="phone" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Olumsuz Sebebi</label>
                                        <select onChange={(x) => setFieldValue("negaticeStatus", x.target.value)} onBlur={handleBlur} value={values?.negaticeStatus} style={{ width: "100%", padding: 7 }}>
                                            <option value={1}>
                                                İletişim Bilgileri Numarası Hatalı
                                            </option>
                                            <option value={2}>
                                                Ulaşılamadı
                                            </option>
                                            <option value={3}>
                                                Konuşmayı Reddetti
                                            </option>
                                        </select>
                                    </div>
                                    }


                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="interviewer" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Görüşen Kişi</label>

                                        <Field type="text" id="interviewer" className="form-control" name="interviewer" />
                                    </div>

                                    <div className='col-12 mb-3'>
                                        <ErrorMessage name="description" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Başvurulan Sertifika/Rapor</label>
                                        <div className='row mt-3' style={{
                                            background: " #d4ffdd",
                                            padding: 5,
                                            border: "1px solid #0e7211"
                                        }}>
                                            <div className='col-12 col-lg-6 '>
                                                <b>ADI : </b>{values.documentName}
                                            </div>
                                            <div className='col-12 col-lg-6 '>
                                                <b> Onay Numarası :</b> {values.documentNo}
                                            </div>
                                            <div className='col-12 mt-2'>
                                                <b>Açıklama : </b>{values.documentDescription}
                                            </div>
                                            <div className='col-12 mt-3 mb-3'>
                                                <b>Ek Belgeler : </b>{
                                                    values?.documentFiles?.map((value, key) => {
                                                        console.log("fsdgd", value)
                                                        return (<a target="_blank" key={key} rel="noreferrer" href={fileUploadUrl + value.url}> {value.extension} </a>)
                                                    })}
                                            </div>

                                        </div>
                                    </div>

                                    <div className='col-12 mb-3'>
                                        <ErrorMessage name="description" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Görüşme Notları</label>
                                        <Field as="textarea" name="notes" className="form-control">
                                        </Field>
                                    </div>





                                    <div className='row col-12  mt-4'>
                                        <div className='col-md-3 col-12 mt-1 '>
                                            <button type='submit' disabled={isSubmitting} className={"btn btn-primary btn-block loading-button" + (isSubmitting && " loading-button")}><span>Kaydet <i className="icon-circle-right2 ml-2"></i></span></button>
                                        </div>
                                        <div className='col-md-3 col-12 mt-1'>
                                            <button type='button' onClick={() => { setModelOpen(!modalOpen) }} className={"btn btn-warning btn-block "}><span>Kapat <i className="fas fa-undo ml-2"></i></span></button>
                                        </div>
                                    </div>
                                </>}
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>


            <Layout>
                <PageHeader title="Sertifika & Firma" map={[
                    { url: "", name: "Sertifika & Firma" },
                    { url: "", name: "Başvurular" },

                ]}>

                </PageHeader>



                <div className='content pr-3 pl-3'>
                    <div className='card'>
                        <DataTable Refresh={refreshDataTable} DataUrl={"DocumentApplication/GetAll"} Headers={[
                            ["fullName", "Ad Soyad"],
                            ["mail", "E-Posta"],
                            ["phone", "Telefon"],

                            {
                                header: <span>Durum</span>,
                                dynamicButton: (data) => {

                                    if (data.status == 1) {
                                        return (<span style={{ color: "orange", fontWeight: "bold" }} ><i className='fas fa-exclamation-triangle'></i> Bekliyor</span>)

                                    } else if (data.status == 2) {

                                        return (<span style={{ color: "green", fontWeight: "bold" }} ><i className='fas fa-check-circle'></i> Onaylandı</span>)


                                    } else if (data.status == 3) {

                                        return (<span style={{ color: "red", fontWeight: "bold" }} ><i className='fa fa-times-circle'></i> Olumsuz</span>)


                                    }

                                }
                            }, {
                                header: <span>Detay</span>,
                                dynamicButton: (data) => { return <button className='btn btn-sm btn-info' title='Detay' onClick={() => { editData(data.id) }}><i className='fas fa-search'></i> Detay</button> }
                            }
                        ]} Title={<span>Firma Listesi</span>}
                            Description={"Yapılan başuruları takip edebilir, başvurular hakkında işlem kaydı tutabilirsiniz"}
                            // HeaderButton={{
                            //     text: "Firma Oluştur", action: () => {
                            //         setModelOpen(!modalOpen)
                            //         setInitialData({})
                            //         setFile(null)
                            //     }
                            // }}

                            HideButtons
                            Pagination={{ pageNumber: 1, pageSize: 10 }}
                        ></DataTable>
                    </div>
                </div>
            </Layout>
        </>
    )

}