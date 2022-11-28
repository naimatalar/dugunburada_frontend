import React, { useEffect, useState } from 'react';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { useRouter } from 'next/router'
import { fileUploadUrl, GetWithToken, PostNoneToken, PostWithToken } from '../../../api/crud';
import AlertFunction from '../../../../components/alertfunction';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
const isBrowser = typeof window !== "undefined";
import classnames from 'classnames';
import CurrencyInput from 'react-currency-input-field';
import Switch from "react-switch";
function Index(props) {



    const [loadingContent, setLoadingContent] = useState(true);
    const [company, setCompany] = useState({});
    const [activeTab, setActiveTab] = useState("1");
    const [properties, setProperties] = useState([]);
    const [hideLabel, setHideLabel] = useState();


    useEffect(() => {
        start()
    }, [])
    const start = async () => {
        if (isBrowser) {
            const hrf = window.location.href.split("/")
            const id = hrf[hrf.length - 1]

            var d = await GetWithToken("Company/GetFullDataCompanyById/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            setLoadingContent(false);
            setCompany(d.data)

            getProperty("1")
        }

    }
    const changeTab = async (tabId) => {
        setActiveTab(tabId)
        getProperty(tabId)
    }
    const getProperty = async (property) => {
        if (isBrowser) {
            const hrf = window.location.href.split("/")
            const id = hrf[hrf.length - 1]
            var d = await GetWithToken("Company/GetCompanyPropertyByCompanyAndPropertyId/" + id + "/" + property).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            setProperties(d.data)
            console.log(d.data)

        }

    }
    const setProperty = async (value, propertyId) => {

        var d = await PostWithToken("Company/SetProperty", { value: value, properyId: propertyId, companyId: company.id }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
        getProperty(activeTab)
    }
    const setListProperty = async (value, ItemId) => {

        var d = await PostWithToken("Company/AddCompanyListProperty", { isActive: value, companyId: company.id, itemId: ItemId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
        getProperty(activeTab)
    }
    return (
        <Layout loadingContent={loadingContent} permissionControl={false}>
            <PageHeader title="Firmalarım" map={[
                { url: "", name: "Firmalarım" },
                { url: "/firmalarim/firma-listesi/", name: "Firma Listesi" },
                { url: "", name: "Firma Özellikleri" }
            ]}>

            </PageHeader>
            <div className='content pr-3 pl-3'>
                <div className='card'>
                    <div className='row mt-3'>
                        <div className='col-12 row justify-content-center align-items-center'>
                            <img src={fileUploadUrl + company.logoUrl} style={{ width: 150 }} />
                            <div className='ml-3'><b style={{ fontSize: 20 }}>{company.name}</b> <span style={{ fontSize: 17 }}>({company.companyType})</span> {company.isPublis && <b style={{ color: "green" }}>Yayında</b> || <b style={{ color: "red" }}>Yayında Değil</b>} </div>
                        </div>
                    </div>
                    <div className='row mt-4 property-tab-ad'>
                        <div className='col-12'>
                            {/* [Display(Description = "Fiyatlandırma")]
            Price = 1,
            [Display(Description = "Teknik ve Lokasyon Özellikleri")]
            TechAndLocation = 2,
            [Display(Description = "Hizmet ve Organizasyon")]
            Organization = 3,
            [Display(Description = "Kapasite Bilgileri")]
            Capacity = 4,
            [Display(Description = "Genel Özellikler")]
            General = 5,
            [Display(Description = "Sık Sorulan Sorular")]
            Faq = 5,
            [Display(Description = "Hakkinda")]
            About = 6, */}

                            <Nav tabs>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("1")} className={classnames({ active: activeTab == "1" })}>
                                        Fiyatlandırma
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("2")} className={classnames({ active: activeTab == "2" })}>
                                        Teknik ve Lokasyon Özellikleri
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("3")} className={classnames({ active: activeTab == "3" })}>
                                        Hizmet ve Organizasyon
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("4")} className={classnames({ active: activeTab == "4" })}>
                                        Kapasite Bilgileri
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("5")} className={classnames({ active: activeTab == "5" })}>
                                        Genel Özellikler
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("6")} className={classnames({ active: activeTab == "6" })}>
                                        Sık Sorulan Sorular
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("7")} className={classnames({ active: activeTab == "7" })}>
                                        Hakkımızda
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    {activeTab == "1" &&
                                        <div style={{ padding: 20 }} className="row">
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
                                                                <div className='col-12 col-md-8'>
                                                                    <label className='mt-1'> {item.key}</label>
                                                                    <div style={{ position: "relative" }}>
                                                                        <input type='text' onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></input>
                                                                        <CurrencyInput onChange={(val) => { setProperty(val.target.value, item.id) }} id={item.id} placeholder='Fiyat Giriniz' suffix=' TL' className='form-control'></CurrencyInput>

                                                                    </div>
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
                                        </div>
                                    }

                                </TabPane>
                                <TabPane tabId="2">
                                    {activeTab == "2" && <div style={{ padding: 20 }} className="row">
                                        {properties.map((item, key) => {

                                            return (
                                                <>

                                                    {item.companyPropertyValueType == 1 &&
                                                        <div className='col-12'>
                                                            <label className='mt-1'> {item.key}</label>
                                                            <div style={{ position: "relative" }}>
                                                                <textarea placeholder={item.key + ' Giriniz'}  onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); document.getElementById(item.id).value=(item.companyPropertyValues?.value||"") }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></textarea>
                                                                <textarea  onBlur={(val)=>{setHideLabel(); if(val.target.value){setProperty(val.target.value, item.id)}}} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></textarea>
                                                            </div>
                                                        </div>
                                                    }

                                                    {item.companyPropertyValueType == 2 &&
                                                        <div className='col-12 col-md-5'>
                                                            <label className='mt-1'> {item.key}</label>
                                                            <div style={{ position: "relative" }}>

                                                                <input type={"number"} onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); document.getElementById(item.id).value=item.companyPropertyValues?.value; }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></input>
                                                                <input type={"number"} onBlur={(val)=>{setHideLabel(); if(val.target.value){setProperty(val.target.value, item.id)}}} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></input>
                                                            </div>
                                                        </div>
                                                    }

                                                    {item.companyPropertyValueType == 5 &&
                                                        <div className='col-12 col-md-5  labelGroup'>
                                                            <label className='mt-1 label-title-check'> {item.key}</label>
                                                            <div style={{ position: "relative" }}>
                                                                {item?.propertySelectLists.map((jitem, jkey) => {

                                                                    return <div key={jkey} className="mb-2">
                                                                        <label>
                                                                            <div className='col-12 p-0 switch-lable'>{jitem.item}</div>
                                                                            <Switch onChange={(val) => { setListProperty(val, jitem.id) }} checked={jitem.values?.filter((jx) => { return jx.propertySelectListId == jitem.id }).length > 0} id={jitem.id} placeholder={item.key + ' Giriniz'} ></Switch>
                                                                        </label>
                                                                    </div>// checked={jitem.companyPropertyValues?.value == "True"} 
                                                                })}
                                                            </div>
                                                        </div>
                                                    }

                                                    {item.companyPropertyValueType == 3 &&

                                                        <div className='col-12 col-md-5 '>
                                                            <label className='mt-1'> {item.key}</label>
                                                            <div style={{ position: "relative" }}>
                                                                <input type='text' onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></input>
                                                                <CurrencyInput onBlur={(val)=>{setHideLabel(); if(val.target.value){setProperty(val.target.value, item.id)}}}   id={item.id} placeholder='Fiyat Giriniz' suffix=' TL' className='form-control'></CurrencyInput>

                                                            </div>
                                                        </div>

                                                    }

                                                    {item.companyPropertyValueType == 4 &&

                                                        <div className='col-12 col-md-5 '>
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

                                                </>

                                            )
                                        })}
                                    </div>
                                    }

                                </TabPane>
                                <TabPane tabId="3">
                                    {activeTab == "3" &&
                                        <div style={{ padding: 20 }} className="row">
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
                                        </div>
                                    }

                                </TabPane>
                                <TabPane tabId="4">
                                    {activeTab == "4" &&
                                        <div style={{ padding: 20 }} className="row">
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
                                                                    <input type={"number"}  onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} value={item.companyPropertyValues?.value}></input>
                                                                    <input type={"number"} onBlur={()=>setHideLabel("")} onChange={(val) => { setProperty(val.target.value, item.id) }} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></input>
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
                                                                    {/* <input type={"checkbox"} onChange={(val) => { setProperty(val.target.checked, item.id) }} checked={item.companyPropertyValues?.value == "True"} id={item.id} placeholder={item.key + ' Giriniz'} className='form-control'></input> */}
                                                                    <label>
                                                                        <div className='col-12 p-0 switch-lable'>{item.item}</div>
                                                                        <Switch onChange={(val) => { setListProperty(val, item.id) }} checked={item.companyPropertyValues?.value == "True"} id={item.id} placeholder={item.key + ' Giriniz'} ></Switch>
                                                                    </label>

                                                                </div>
                                                            </div>
                                                        }

                                                    </>

                                                )
                                            })}
                                        </div>
                                    }

                                </TabPane>
                                <TabPane tabId="5">
                                    {activeTab == "5" &&
                                        <div style={{ padding: 20 }} className="row">
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

                                                    </>

                                                )
                                            })}
                                        </div>
                                    }

                                </TabPane>
                                <TabPane tabId="6">
                                    {activeTab == "6" &&

                                        <div style={{ padding: 20 }} className="row">
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
                                        </div>
                                    }


                                </TabPane>
                                <TabPane tabId="7">
                                    {activeTab == "7" &&
                                        <div style={{ padding: 20 }} className="row">
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
                                        </div>
                                    }

                                </TabPane>

                            </TabContent>
                        </div>

                    </div>
                </div>

            </div>

        </Layout>
    );
}

export default Index;