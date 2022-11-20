import React, { useEffect, useState } from 'react';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { useRouter } from 'next/router'
import { fileUploadUrl, GetWithToken } from '../../../api/crud';
import AlertFunction from '../../../../components/alertfunction';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
const isBrowser = typeof window !== "undefined";
import classnames from 'classnames';
function Index(props) {



    const [loadingContent, setLoadingContent] = useState(true);
    const [company, setCompany] = useState({});
    const [activeTab, setActiveTab] = useState("1");


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
            console.log(d.data)
        }

    }
    const changeTab = async (tabId) => {
        setActiveTab(tabId)

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
                            <img src={fileUploadUrl + company.logoUrl} style={{ width: 50 }} />
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
                                    <NavLink onClick={() => changeTab("1")} className={classnames({ active: activeTab=="1" })}>
                                        Fiyatlandırma
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("2")} className={classnames({ active: activeTab=="2"  })}>
                                        Teknik ve Lokasyon Özellikleri
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("3")} className={classnames({ active: activeTab=="3"  })}>
                                        Hizmet ve Organizasyon
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("4")} className={classnames({ active: activeTab=="4"  })}>
                                        Kapasite Bilgileri
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("5")} className={classnames({ active: activeTab=="5"  })}>
                                        Genel Özellikler
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("6")} className={classnames({ active: activeTab=="6"  })}>
                                        Sık Sorulan Sorular
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => changeTab("7")} className={classnames({ active: activeTab=="7"  })}>
                                        Hakkımızda
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <div style={{ padding: 20 }}>
                                        Fiyatlandırma
                                    </div>
                                </TabPane>
                                <TabPane tabId="2">
                                    <div style={{ padding: 20 }}>
                                        Teknik ve Lokasyon Özellikleri
                                    </div>
                                </TabPane>
                                <TabPane tabId="3">
                                    <div style={{ padding: 20 }}>
                                        Hizmet ve Organizasyon
                                    </div>
                                </TabPane>
                                <TabPane tabId="4">
                                    <div style={{ padding: 20 }}>
                                        Kapasite Bilgileri
                                    </div>
                                </TabPane>
                                <TabPane tabId="5">
                                    <div style={{ padding: 20 }}>
                                        Genel Özellikler
                                    </div>
                                </TabPane>
                                <TabPane tabId="6">
                                    <div style={{ padding: 20 }}>
                                        Sık Sorulan Sorular
                                    </div>
                                </TabPane>
                                <TabPane tabId="7">
                                    <div style={{ padding: 20 }}>
                                        Hakkımızda
                                    </div>
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