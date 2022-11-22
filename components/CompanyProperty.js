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

export default function CompanyProperty({ setHideLabel, setProperty, properties = [],hideLabel }) {

    const [refresh, setRefresh] = useState()



    useEffect(() => {
      setRefresh(new Date())
    }, [setHideLabel,setProperty,properties,hideLabel])

    return (
        <>
            {properties.map((item, key) => {

                return (
                    <>

                        {item.companyPropertyValueType == 1 &&
                            <div className='col-12'>
                                <label className='mt-1'> {item.key}</label>
                                <div style={{ position: "relative" }}>
                                    <textarea onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></textarea>
                                    <textarea onChange={(val) => { setProperty(val.target.value, item.id) }} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></textarea>
                                </div>
                            </div>
                        }
                        {item.companyPropertyValueType == 2 &&
                            <div className='col-12 col-md-6'>
                                <label className='mt-1'> {item.key}</label>
                                <div style={{ position: "relative" }}>
                                    <input type={"number"} onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></input>
                                    <input type={"number"} onChange={(val) => { setProperty(val.target.value, item.id) }} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></input>
                                </div>
                            </div>
                        }

                        {item.companyPropertyValueType == 5 &&
                            <div className='col-12'>
                                <label className='mt-1'> {item.key}</label>
                                <div style={{ position: "relative" }}>
                                    <textarea onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></textarea>
                                    <textarea onChange={(val) => { setProperty(val.target.value, item.id) }} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></textarea>
                                </div>
                            </div>
                        }

                        {item.companyPropertyValueType == 3 &&

                            <div className='col-12 col-md-6'>
                                <label className='mt-1'> {item.key}</label>
                                <div style={{ position: "relative" }}>
                                    <input type='text' onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></input>
                                    <CurrencyInput onChange={(val) => { setProperty(val.target.value, item.id) }} id={item.id} placeholder='Fiyat Giriniz' suffix=' TL' className='form-control'></CurrencyInput>

                                </div>
                            </div>

                        }
                        {item.companyPropertyValueType == 4 &&
                            <div className='col-12 col-md-6'>
                                <label className='mt-1'> {item.key}</label>
                                <div style={{ position: "relative" }}>
                                    {/* <input type={"checkbox"} readOnly="readonly" onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} checked={item.value}></input> */}
                                    <input type={"checkbox"} onChange={(val) => { setProperty(val.target.checked, item.id) }} checked={item.companyPropertyValues?.value == "True"} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></input>
                                </div>
                            </div>
                        }

                    </>

                )
            })}
        </>
    )
}
