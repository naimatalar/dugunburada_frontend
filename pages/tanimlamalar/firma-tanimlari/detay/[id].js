import React, { useEffect, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import AlertFunction from '../../../../components/alertfunction';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { apiConstant, fileUploadUrl, GetWithToken } from '../../../api/crud';
var isBrowser = typeof (window) != undefined;
export default function Index(props) {
    const [data, setData] = useState({})
    const [modalOpen, setModelOpen] = useState(false)
    const [initialData, setInitialData] = useState({ id: null })
    const [documentType, setDocumnetType] = useState()
    const [file, setFile] = useState([])

    useEffect(async () => {
        start()
    }, [])

    const start = async () => {
        var id = ""
        if (isBrowser) {
            id = window.location.href.split("/")[window.location.href.split("/").length - 1]
            var d = await GetWithToken("Company/getDetailById/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
            setData(d.data)
            console.log(d.data)
        }

    }
    return (
        <>
            <Modal isOpen={modalOpen}
                size="lg"
                toggle={() => setModelOpen(!modalOpen)}
                modalTransition={{ timeout: 100 }}>
                <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }}>
                    <div className="d-flex justify-content-center mb-2">
                    </div>
                    <div className="d-flex ">
                        <p>Analiz <b>Tanımlama</b> Formu</p>
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

                                    <ErrorMessage name="objectId" component="div" className='text-danger' />
                                    <Field type="hidden" name="objectId" />

                                    <ErrorMessage name="documnetKind" component="div" className='text-danger' />
                                    <Field values={2} type="hidden" name="documnetKind" />

                                    <ErrorMessage name="documentType" component="div" className='text-danger' />
                                    <Field values={documentType} type="hidden" name="documentType" />

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="name" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Adı</label>
                                        <Field type="text" id="name" className="form-control" name="name" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="documentNo" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Döküman No / Barkod</label>
                                        <Field type="text" id="documentNo" className="form-control" name="description" />
                                    </div>

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="documentDate" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Tarih</label>
                                        <Field type="date" id="documentDate" className="form-control" name="phone" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="expireDate" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Geçerlilik Tarih</label>
                                        <Field type="date" id="expireDate" className="form-control" name="phone" />
                                    </div>
                                    <div className='col-md-6 col-12 mb-3'>
                                        <label className='input-label'>Firma Logo</label>
                                        <input type="file" onChange={(x) => {
                                            file.push(x)
                                            setFile(x.target.files[0])
                                        }
                                        } name="file" id="file"></input>
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

                                    <div className='col-12  mb-3'>
                                        <ErrorMessage name="address" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Adres</label>
                                        <Field as="textarea" name="address" className="form-control">
                                        </Field>
                                    </div>
                                    <div className='col-12 mb-3'>
                                        <ErrorMessage name="description" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Açıklama</label>
                                        <Field as="textarea" name="description" className="form-control">
                                        </Field>
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

            <Layout permissionControl={false}>
                <PageHeader title={data.name} map={[
                    { url: "/tanimlamalar/firma-tanimlari/", name: "Firmma Tanımları" },
                    { url: "", name: "Detay" },

                ]}>
                </PageHeader>
                <div className='content '>
                    <div className='card p-5'>
                        <div className='row'>
                            <div className='col-12 col-md-4 firm-detail-box'>

                                <div className='col-12 text-center mb-2'>
                                    <b style={{ fontSize: 26 }}>{data.name}</b>
                                </div>
                                <div className='col-12 col-md-12 mb-3'>
                                    <div className='col-12 text-center'>
                                        <img style={{ width: "50%" }} src={fileUploadUrl + data?.logoUrl}></img>
                                    </div>

                                </div>
                                <div className='col-12 col-md-12 row'>
                                    <div className='col-12 mb-3 firm-detail-box-field' >
                                        <b>Telefon : </b>{data.phone}
                                    </div>
                                    <div className='col-12 mb-3 firm-detail-box-field' >
                                        <b>Mail : </b>{data.email}
                                    </div>
                                    <div className=' col-12 mb-3 firm-detail-box-field' >
                                        <b>Adres : </b>{data.address}
                                    </div>
                                    <div className='col-12 mt-2 firm-detail-box-field'>
                                        <b>Açıklama : </b>{data.description}
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-md-8 mt-md-0 mt-5'>
                                <button className='btn btn-success btn-sm mb-2' onClick={() => { setModelOpen(true);; setDocumnetType(2) }}><i className='fa fa-plus'></i> Yeni Rapor Ekle</button>
                                <table className='table table-hovered mb-3'>
                                    <thead>
                                        <tr>
                                            <th>
                                                Adı
                                            </th>
                                            <th>
                                                No
                                            </th>
                                            <th>
                                                Rapor Tarihi
                                            </th>
                                            <th>
                                                Geçerlilik Tarihi
                                            </th>
                                            <th>
                                                Belgeler
                                            </th>
                                            <th>
                                                #
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.report?.length == 0 && <tr>
                                            <td colSpan={5} className="text-center">Rapor Bulunamadı.</td>
                                        </tr>}
                                        {data.report?.map((item, key) => {
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{item.documnentNo}</td>
                                                <td>{item.documnentDate}</td>
                                                <td>{item.expireDate}</td>
                                                <td>{item.documentFiles?.length}</td>
                                                <td></td>


                                            </tr>
                                        })}
                                    </tbody>
                                </table>

                                <button className='btn btn-success btn-sm mb-2 mt-5' onClick={() => { setModelOpen(true); setDocumnetType(2) }}><i className='fa fa-plus'></i> Yeni Döküman Ekle</button>
                                <table className='table table-hovered'>
                                    <thead>
                                        <tr>
                                            <th>
                                                Adı
                                            </th>
                                            <th>
                                                No
                                            </th>
                                            <th>
                                                Rapor Tarihi
                                            </th>
                                            <th>
                                                Geçerlilik Tarihi
                                            </th>
                                            <th>
                                                Belgeler
                                            </th>
                                            <th>
                                                #
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.certifica?.length == 0 && <tr>
                                            <td colSpan={5} className="text-center">Sertifika Bulunamadı.</td>
                                        </tr>}
                                        {data.report?.map((item, key) => {
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{item.documnentNo}</td>
                                                <td>{item.documnentDate}</td>
                                                <td>{item.expireDate}</td>
                                                <td>{item.documentFiles?.length}</td>
                                                <td>#</td>

                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
