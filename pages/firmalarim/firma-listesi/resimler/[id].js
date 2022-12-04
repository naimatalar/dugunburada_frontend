import React, { useEffect, useState } from 'react';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { useRouter } from 'next/router'
import { fileUploadUrl, GetWithToken, PostNoneToken, PostWithToken } from '../../../api/crud';
import AlertFunction from '../../../../components/alertfunction';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
const isBrowser = typeof window !== "undefined";
import classnames from 'classnames';
import CompanyProperty from '../../../../components/CompanyProperty';
// import CustomSunEditor from '../../../../components/CustomSunEditor';
import dynamic from 'next/dynamic';

import 'suneditor/dist/css/suneditor.min.css';
import FaqCompnent from '../../../../components/FaqCompnent';
import ContactUs from '../../../../components/ContactUs';
const AboutUs = dynamic(() => import('../../../../components/AboutUs'), {
    ssr: false,
});

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
        <Layout loadingContent={loadingContent} pageName="firma-listesi">
            <PageHeader title="Firmalarım" map={[
                { url: "", name: "Firmalarım" },
                { url: "/firmalarim/firma-listesi/", name: "Firma Listesi" },
                { url: "", name: "Firma Özellikleri" }
            ]}>

            </PageHeader>
            <div className='content pr-3 pl-3'>
                <div className='card pb-5'>
                    <div className='row mt-3'>
                        <div className='col-12 row justify-content-center align-items-center'>
                            <img src={fileUploadUrl + company.logoUrl} style={{ width: 150 }} />
                            <div className='ml-3'><b style={{ fontSize: 20 }}>{company.name}</b> <span style={{ fontSize: 17 }}>({company.companyType})</span> {company.isPublis && <b style={{ color: "green" }}>Yayında</b> || <b style={{ color: "red" }}>Yayında Değil</b>} </div>
                        </div>
                    </div>
                    <div className='row mt-4 property-tab-ad'>
                        <div className='col-12'>

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
                                <NavItem>
                                    <NavLink onClick={() => changeTab("8")} className={classnames({ active: activeTab == "8" })}>
                                        İletişim
                                    </NavLink>
                                </NavItem>

                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    {activeTab == "1" &&
                                        <CompanyProperty setListProperty={setListProperty} hideLabel={hideLabel} setHideLabel={setHideLabel} setProperty={setProperty} properties={properties}></CompanyProperty>
                                    }
                                </TabPane>
                                <TabPane tabId="2">
                                    {activeTab == "2" && <CompanyProperty setListProperty={setListProperty} hideLabel={hideLabel} setHideLabel={setHideLabel} setProperty={setProperty} properties={properties}></CompanyProperty>
                                    }
                                </TabPane>
                                <TabPane tabId="3">
                                    {activeTab == "3" && <CompanyProperty setListProperty={setListProperty} hideLabel={hideLabel} setHideLabel={setHideLabel} setProperty={setProperty} properties={properties}></CompanyProperty>
                                    }

                                </TabPane>
                                <TabPane tabId="4">
                                    {activeTab == "4" && <CompanyProperty setListProperty={setListProperty} hideLabel={hideLabel} setHideLabel={setHideLabel} setProperty={setProperty} properties={properties}></CompanyProperty>
                                    }

                                </TabPane>
                                <TabPane tabId="5">
                                    {activeTab == "5" && <CompanyProperty setListProperty={setListProperty} hideLabel={hideLabel} setHideLabel={setHideLabel} setProperty={setProperty} properties={properties}></CompanyProperty>
                                    }

                                </TabPane>
                                <TabPane tabId="6">
                                    {activeTab == "6" &&
                                        <FaqCompnent companyId={company.id}></FaqCompnent>
                                    }
                                </TabPane>
                                <TabPane tabId="7">
                                    {activeTab == "7" &&
                                        <AboutUs companyId={company.id}></AboutUs>}


                                </TabPane>
                                <TabPane tabId="8">
                                    {activeTab == "8" &&
                                        <ContactUs companyId={company.id}></ContactUs>}


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