import React, { useEffect, useState } from 'react';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { useRouter } from 'next/router'
import { GetWithToken } from '../../../api/crud';
import AlertFunction from '../../../../components/alertfunction';
const isBrowser = typeof window !== "undefined";
function Index(props) {



    const [loadingContent, setLoadingContent] = useState(true);
    const [company, setCompany] = useState({});
  

    useEffect(() => {
        start()
    }, [])
    const start = async () => {
        if (isBrowser) {
            const hrf = window.location.href.split("/")
            const id = hrf[hrf.length - 1]
     
            var d = await GetWithToken("Company/GetById/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            setLoadingContent(false);
            setCompany(d.data)
            console.log(d.data)
        }



    }

    return (
        <Layout loadingContent={loadingContent} permissionControl={false}>
            <PageHeader title="Firmalarım" map={[
                { url: "", name: "Firmalarım" },
                { url: "", name: "Firma Listesi" }
            ]}>

            </PageHeader>

        </Layout>
    );
}

export default Index;