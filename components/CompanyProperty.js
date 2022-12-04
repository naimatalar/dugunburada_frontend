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
import { PriceSplitter } from './pricesptitter';
import Switch from "react-switch";


export default function CompanyProperty({ setHideLabel, setProperty, properties = [],hideLabel ,setListProperty}) {

    const [refresh, setRefresh] = useState()
    const [valueById, setValueById] = useState({id:"",value:""});



    useEffect(() => {
      setRefresh(new Date())
    }, [setHideLabel,setProperty,properties,hideLabel])

    return (
        <div style={{ padding: 20 }} className="row">
        {properties.map((item, key) => {




           if (item.companyPropertyValueType == 1) {
               return (<div key={key} className='col-12'>
                   <label className='mt-1'> {item.key}</label>
                   <div style={{ position: "relative" }}>
                       <textarea placeholder={item.key + ' Giriniz'} onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); document.getElementById(item.id).value = (item.companyPropertyValues?.value || "") }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></textarea>
                       <textarea onBlur={(val) => { setHideLabel(); if (val.target.value) { setProperty(val.target.value, item.id) } }} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></textarea>
                   </div>
               </div>)
           }


           if (item.companyPropertyValueType == 2) {
               return <div key={key}  className='col-12 col-md-5'>
                   <label className='mt-1'> {item.key}</label>
                   <div style={{ position: "relative" }}>

                       <input type={"number"}  placeholder={item.key + ' Giriniz'}  onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); document.getElementById(item.id).value = item.companyPropertyValues?.value; }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value||""}></input>
                       <input type={"number"} onBlur={(val) => { setHideLabel(); setProperty(val.target.value, item.id)  }} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></input>
                   </div>
               </div>
           }

           if (item.companyPropertyValueType == 5) {
               return <fieldset key={key}  className='col-12 col-md-3 ml-3  labelGroup'>
                   <legend className='mt-1 label-title-check'> {item.key}</legend>
                   <div style={{ position: "relative" }}>
                       {item?.propertySelectLists.map((jitem, jkey) => {

                           return <div key={jkey} className="mb-2">
                               <label>
                                   <div className='col-12 p-0 switch-label'>{jitem.item}</div>
                                   <Switch onChange={(val) => { setListProperty(val, jitem.id) }} checked={jitem.values?.filter((jx) => { return jx.propertySelectListId == jitem.id }).length > 0} id={jitem.id} placeholder={item.key + ' Giriniz'} ></Switch>
                               </label>
                           </div>// checked={jitem.companyPropertyValues?.value == "True"} 
                       })}
                   </div>
               </fieldset>
           }
           if (item.companyPropertyValueType == 3) {

               return <div key={key}  className='col-12 col-md-5 '>
                   <label className='mt-1'> {item.key}</label>
                   <div style={{ position: "relative" }}>
                       <input type='text' onFocus={() => { setHideLabel(item.id); document.getElementById(item.id).focus();document.getElementById(item.id).value = 15 }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} placeholder='Fiyat Giriniz'  value={item.companyPropertyValues?.value==null?"": PriceSplitter(item.companyPropertyValues?.value) + (item.companyPropertyValues?.value!="" && " TL")}></input>
                       <CurrencyInput onValueChange={(val)=>{ setValueById({id:item.id,value:val}) }} onBlur={(val) => { setHideLabel(); if (valueById.id==item.id) { setProperty(valueById.value, item.id) } }} id={item.id} placeholder='Fiyat Giriniz' suffix=' TL' className='form-control'></CurrencyInput>

                   </div>
               </div>

           }
           if (item.companyPropertyValueType == 4) {

               return <div key={key}  className='col-12 col-md-5 '>
                   <label className='mt-1 switch-lable'> {item.key}</label>
                   <div style={{ position: "relative" }}>
                       {/* <input type={"checkbox"} readOnly="readonly" onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} checked={item.value}></input> */}
                       <label>
                           <div className='col-12 p-0 switch-lable'>{item.item}</div>
                           <Switch onChange={(val) => { setProperty(val, item.id) }} checked={item.companyPropertyValues?.value == "True"} id={item.id} placeholder={item.key + ' Giriniz'} ></Switch>
                       </label>
                   </div>
               </div>
           }




       })}
       </div>
    )
}
