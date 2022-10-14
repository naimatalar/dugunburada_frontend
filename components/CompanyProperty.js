import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import AlertFunction from '../components/alertfunction';
import DataTable from '../components/datatable';
import Layout from '../layout/layout';
import PageHeader from '../layout/pageheader';
import PageLoading from '../layout/pageLoading';
import Image from "next/image"
import { Modal, ModalBody, ModalHeader, Tooltip } from 'reactstrap';
import { fileUploadUrl, GetWithToken, PostWithToken, PostWithTokenFile } from '../pages/api/crud';
import ReactSelect from 'react-select';
import CurrencyInput from 'react-currency-input-field';

export default function CompanyProperty({ modalOpen, setModelOpen, companyPropertyTypeId,companyId }) {

    // const [modalOpen, setModelOpen] = useState(modalShow)
    const [initialData, setInitialData] = useState({ id: null })
    const [hiddenPassordField, setHiddenPassordField] = useState(false)
    const [refresh, setRefresh] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshDataTable, setRefreshDatatable] = useState(null)
    const [file, setFile] = useState(null)
    const [property, setProperty] = useState([])
    const [companyTypeListData, setCompanyTypeListData] = useState([])
    const [selectedPType, setSelectedPtype] = useState()


    useEffect(() => {
        start()
    }, [])
    const start = async () => {

        var d = await GetWithToken("Company/GetCompanyPropertyTypeById/" + companyPropertyTypeId).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        setCompanyTypeListData(d.data)  
        var d2 = await GetWithToken("Company/GetCompanyPropertyValueByCompanyId/" + companyId).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
        setProperty(d2.data)
    }
    return (
        <Modal isOpen={modalOpen}
            size="md"
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
                                {/* <div className=' col-12  mb-3'>
                                    <ErrorMessage name="name" component="div" className='text-danger danger-alert-form' />
                                    <label className='input-label'>Firma Adı</label>
                                    <Field type="text" id="name" className="form-control" name="name" />
                                </div> */}
                                <div className=' col-6  mb-3'>
                                    <ErrorMessage name="name" component="div" className='text-danger danger-alert-form' />
                                    <label className='input-label'>Firma Türü</label>
                                    <ReactSelect
                                        isClearable
                                        // inputValue={examinationInputVal}
                                        escapeClearsValue={true}
                                        // value={examinationVal}
                                        // onInputChange={(x) => { getExaminationDelectFunc(x, values.laboratoryId);setExaminationInputVal(x) }}
                                        styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
                                        onChange={(x) => { setSelectedPtype(x); }}
                                        options={companyTypeListData.map((item, key) => {

                                            return { label: item.key, value: item.id, Type: item.companyPropertyKind }
                                        })}>

                                    </ReactSelect>


                                </div>
                                {
                                    selectedPType?.Type == 1 &&
                                    <div className='col-md-6 col-12 mb-3'>
                                        {/* <ErrorMessage name="phone" component="div" className='text-danger danger-alert-form' /> */}
                                        <label className='input-label'>{selectedPType?.label}</label>


                                        <div className='col-12 mt-2'>

                                            <CurrencyInput suffix=' TL' style={{ marginTop: -8 }} className='form-control'></CurrencyInput>
                                        </div>
                                        <div className='col-md-6 mt-2'>
                                            <button className='btn btn-sm btn-info'>+ Ekle</button>
                                        </div>
                                    </div>
                                }
                                {
                                    property.map((item,key)=>{})
                                }





                                <div className='row col-12  mt-4 p-0'>
                                    <div className='col-md-6 col-12 mt-1 '>
                                        {/* <button type='submit' disabled={isSubmitting} className={"btn btn-primary btn-block loading-button" + (isSubmitting && " loading-button")}><span>Kaydet <i className="icon-circle-right2 ml-2"></i></span></button> */}
                                    </div>
                                    <div className='col-md-6 col-12 mt-1'>
                                        {/* <button style={{widt}} type='button' onClick={() => { setModelOpen(!modalOpen) }} className={"btn btn-warning btn-block "}><span>Kapat <i className="fas fa-undo ml-2"></i></span></button> */}
                                    </div>
                                </div>
                            </>}
                        </Form>
                    )}
                </Formik>



            </ModalBody>
        </Modal>
    )
}
