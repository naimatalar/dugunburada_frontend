import React, { useEffect, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import AlertFunction from '../../../../components/alertfunction';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { apiConstant, fileUploadUrl, GetWithToken, PostWithToken, PostWithTokenFile } from '../../../api/crud';
var isBrowser = typeof (window) != undefined;
export default function Index(props) {
    const [data, setData] = useState({})
    const [modalOpen, setModelOpen] = useState(false)
    const [initialData, setInitialData] = useState({ id: null })
    const [documentType, setDocumnetType] = useState()
    const [file, setFile] = useState([])
    const [refreshPAge, setRefreshPAge] = useState(new Date())
    const [documentFiles, setDocumentFiles] = useState([])
    useEffect(async () => {
        start()
    }, [])

    const start = async () => {
        var id = ""
        if (isBrowser) {
            id = window.location.href.split("/")[window.location.href.split("/").length - 1]
            var d = await GetWithToken("Person/getDetailById/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
            setData(d.data)
        }
    }

    const deleteFile = async (f) => {
        var ff = file.filter((x) => { return x != f })
        setFile(ff);
        setRefreshPAge(new Date())
    }
    const deleteFileDbD = async (f) => {
        var ff = documentFiles.filter((x) => { return x != f })
        setDocumentFiles(ff);
        setRefreshPAge(new Date())
        var id = ""
        if (isBrowser) {
            id = window.location.href.split("/")[window.location.href.split("/").length - 1]
            var d = await GetWithToken("Person/getDetailById/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
            setData(d.data)
        }
    }

    const deleteDocument = async (id) => {
        if (confirm("Kayıt Silinecek Onaylıyor musnuz?")) {
            var d = await GetWithToken("document/delete/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
            start()
        }
    }


    const deleteFileDb = async (fileName, id) => {
        await PostWithToken("Document/FileDelete", { fileName: fileName, id: id }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })
        start()
    }

    const submit = async (val) => {
        var dataId = null;


        if (val.id == undefined) {
            var d = await PostWithToken("Document/Create", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })
            if (d.isError) {
                alert(d.message)
            } else {

                dataId = d.data.id
            }

        } else {

            var d = await PostWithToken("Document/Edit", val).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })

            if (d.isError) {
                alert(d.message)
            } else {
                dataId = d.data.id
            }
        }

        if (file.length > 0) {
            for (const item of file) {
                var da = await PostWithTokenFile("FileUpload/Upload", { name: "file", data: item }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })
                await PostWithToken("Document/UploadFile", { fileName: da.data.fileName, id: dataId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlmel için yetkiniz bulunmuyor"); return false })

            }
        }

        setInitialData({ id: null });
        setFile([])
        setDocumentFiles([])
        start()
    }

    return (
        <>
            {/* {
            loading && <PageLoading></PageLoading>
        } */}

            <Modal isOpen={modalOpen}
                size="lg"
                toggle={() => setModelOpen(!modalOpen)}
                modalTransition={{ timeout: 100 }}>
                <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }}>
                    <div className="d-flex justify-content-center mb-2">
                    </div>
                    <div className="d-flex ">
                        <p>Rapor {"&"} Sertifika <b>Tanımlama</b> Formu</p>
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

                            values.objectId = data.id;
                            values.documnetKind = 1;
                            values.documentType = documentType
                            setTimeout(async () => {
                                await submit(values)
                                setSubmitting(false);
                                setModelOpen(!modalOpen)
                                start()
                            }, 400);
                        }}
                    >
                        {({ isSubmitting, isValidating, handleChange, handleBlur, setFieldValue, values }) => (
                            <Form className='row mt-3 col-12 form-n-popup' >
                                {initialData && documentFiles && <>
                                    <ErrorMessage name="id" component="div" className='text-danger' />
                                    <Field type="hidden" name="id" />

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="name" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Adı</label>
                                        <Field type="text" id="name" className="form-control" name="name" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="documentNo" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Döküman No / Barkod</label>
                                        <Field type="text" id="documentNo" className="form-control" name="documentNo" />
                                    </div>

                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="documentDate" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Tarih</label>
                                        <Field type="date" id="documentDate" className="form-control" name="documentDate" />
                                    </div>
                                    <div className='col-md-6 col-12  mb-3'>
                                        <ErrorMessage name="expireDate" component="div" className='text-danger danger-alert-form' />
                                        <label className='input-label'>Geçerlilik Tarih</label>
                                        <Field type="date" id="expireDate" className="form-control" name="expireDate" />
                                    </div>
                                    <div className='col-md-6 col-12 mb-3'>
                                        <label className='input-label'>Dökümanlar</label>
                                        <input type="file" onChange={(x) => {
                                            var files = file;
                                            files.push(x.target.files[0])
                                            setFile(files)
                                            setRefreshPAge(new Date())
                                        }
                                        } name="file" id="file"></input>
                                        {
                                            file.length > 0 && refreshPAge &&
                                            <div className='col-12 mt-2'>
                                                {

                                                    file.map((item, key) => {

                                                        return (
                                                            <div key={key}>
                                                                <a download style={{ width: "100px" }} href={URL.createObjectURL(item)}>{item.name} - İndir</a>
                                                                <button type='button' className='btn btn-danger btn-sm' onClick={() => { deleteFile(item) }} > Kaldır X</button>
                                                            </div>)
                                                    })
                                                }
                                            </div>
                                        }



                                        <div className='col-12 mt-2'>
                                            {

                                                documentFiles.map((item, key) => {

                                                    return (
                                                        <div key={key}>
                                                            <a download style={{ width: "100px" }} href={fileUploadUrl + item.url}>{item.name} - İndir</a>
                                                            <button type='button' className='btn btn-danger btn-sm' onClick={() => { deleteFileDb(item.url, item.id); deleteFileDbD(item) }} > Kaldır X</button>
                                                        </div>)
                                                })
                                            }                                            </div>

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
                <PageHeader title={data?.firstName + " " + data?.lastName} map={[
                    { url: "/sertifika-rapor/firma-tanimlari/", name: "Firmma Tanımları" },
                    { url: "", name: "Detay" },

                ]}>
                </PageHeader>
                <div className='content '>
                    <div className='card p-5'>
                        <div className='row'>
                            <div className='col-12 col-md-4 firm-detail-box'>

                                <div className='col-12 text-center mb-2'>
                                    <b style={{ fontSize: 26 }}>{data?.firstName + " " + data?.lastName}</b>
                                </div>
                                <div className='col-12 col-md-12 mb-3'>
                                    <div className='col-12 text-center'>
                                        <img style={{ width: "50%" }} src={fileUploadUrl + data?.logoUrl}></img>
                                    </div>

                                </div>
                                <div className='col-12 col-md-12 row'>
                                    <div className='col-12 mb-3 firm-detail-box-field' >
                                        <b>Meslek : </b>{data?.title}
                                    </div>

                                    <div className='col-12 mt-2 firm-detail-box-field'>
                                        <b>Açıklama : </b>{data?.description}
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-md-8 mt-md-0 mt-5'>
                                <button className='btn btn-success btn-sm mb-2' onClick={() => { setModelOpen(true); setDocumnetType(1); setInitialData({ id: null }); setDocumentFiles([]) }}><i className='fa fa-plus'></i> Yeni Rapor Ekle</button>

                                {refreshPAge && <> <table className='table table-hover mb-3'>
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
                                        {data?.report?.length == 0 && <tr>
                                            <td colSpan={5} className="text-center">Rapor Bulunamadı.</td>
                                        </tr>}
                                        {data?.report?.map((item, key) => {
                                            return (refreshPAge &&
                                                <tr>
                                                    <td>{item.name}</td>
                                                    <td>{item.documentNo}</td>
                                                    <td>{item.documentDate}</td>
                                                    <td>{item.expireDate}</td>
                                                    <td>{item.documentFiles?.length}</td>
                                                    <td>
                                                        <button className='btn btn-info btn-sm' onClick={() => {

                                                            setDocumentFiles(item.documentFiles); setModelOpen(true); setInitialData({
                                                                name: item.name,
                                                                documentNo: item.documentNo,
                                                                documentDate: item.dDate,
                                                                expireDate: item.eDate,
                                                                description: item.description,
                                                                id: item.id,
                                                                documentType: 1

                                                            }); setDocumnetType(1); setRefreshPAge(new Date())
                                                        }}><i className='fa fa-edit'></i> Düzenle</button>

                                                        <button className='btn btn-danger btn-sm ml-1' onClick={() => {

                                                            deleteDocument(item.id)
                                                        }}><i className='fa fa-trash'></i> Sil</button>

                                                    </td>


                                                </tr>)
                                        })}
                                    </tbody>
                                </table>

                                    <button className='btn btn-success btn-sm mb-2 mt-5' onClick={() => { setModelOpen(true); setDocumnetType(2); setInitialData({ id: null }); setDocumentFiles([]) }}><i className='fa fa-plus'></i> Yeni Sertifika Ekle</button>
                                    <table className='table table-hover'>
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
                                            {data?.certifica?.length == 0 && <tr>
                                                <td colSpan={5} className="text-center">Sertifika Bulunamadı.</td>
                                            </tr>}
                                            {data?.certifica?.map((item, key) => {
                                                return (refreshPAge &&
                                                    <tr>
                                                        <td>{item.name}</td>
                                                        <td>{item.documentNo}</td>
                                                        <td>{item.documentDate}</td>
                                                        <td>{item.expireDate}</td>
                                                        <td>{item.documentFiles?.length}</td>
                                                        <td>

                                                            <button className='btn btn-info btn-sm' onClick={() => {

                                                                setDocumentFiles(item.documentFiles); setModelOpen(true); setInitialData({
                                                                    name: item.name,
                                                                    documentNo: item.documentNo,
                                                                    documentDate: item.dDate,
                                                                    expireDate: item.eDate,
                                                                    description: item.description,
                                                                    id: item.id,
                                                                    documentType: 2

                                                                }); setDocumnetType(2); setRefreshPAge(new Date())
                                                            }}><i className='fa fa-edit'></i> Düzenle</button>
                                                            <button className='btn btn-danger btn-sm ml-1' onClick={() => {

                                                                deleteDocument(item.id)
                                                            }}><i className='fa fa-trash'></i> Sil</button>
                                                        </td>

                                                    </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
