import React, { useEffect, useState } from 'react';
import Layout from '../../../layout/layout';
import PageHeader from '../../../layout/pageheader';
import PageLoading from '../../../layout/pageLoading';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import IndexCategory from '../../../components/IndexCategory';
import CategoryCompany from '../../../components/CategoryCompany';
import Discount from '../../../components/Discount';
import SelectedCompany from '../../../components/SelectedCompany';


export default function Index() {
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("1")




    useEffect(() => {

        start();
    }, [])
    const start = async () => {

        setLoading(false)
    }



    return (
        <>{
            loading && <PageLoading></PageLoading>
        }

            <Layout>
                <PageHeader title="Anasayfa Dizayn" map={[
                    { url: "", name: "Super Admin" },
                    { url: "", name: "Anasayfa Dizayn" }
                ]}>

                </PageHeader>


                <div className='content pr-3 pl-3'>
                    <div className='card'>
                        <Nav tabs style={{ backgroundColor: "#d3d2d2" }}>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { setActiveTab('1'); }}
                                >
                                    <b>Öne Çıkanlar</b>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { setActiveTab('2'); }}
                                >
                                    <b>İndirimler</b>

                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '3' })}
                                    onClick={() => { setActiveTab('3'); }}
                                >
                                    <b>Öne Çıkan Kategori</b>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '4' })}
                                    onClick={() => { setActiveTab('4'); }}
                                >
                                    <b>Kategori Firamaları</b>
                                </NavLink>
                            </NavItem>


                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                            {
                                    activeTab == "1" && <SelectedCompany></SelectedCompany>
                                }

                            </TabPane>
                            <TabPane tabId="2">
                            {
                                    activeTab == "2" && <Discount></Discount>
                                }

                            </TabPane>
                            <TabPane tabId="3">
                                {
                                    activeTab == "3" && <IndexCategory></IndexCategory>
                                }

                            </TabPane>
                            <TabPane tabId="4">
                            {
                                    activeTab == "4" && <CategoryCompany></CategoryCompany>
                                }

                            </TabPane>

                        </TabContent>
                    </div>
                </div>
            </Layout>
        </>
    )

}