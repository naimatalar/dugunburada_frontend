import React, { useEffect, useState } from 'react';
import Layout from '../../../../layout/layout';
import PageHeader from '../../../../layout/pageheader';
import { fileUploadUrl, GetWithToken, imageUploadUrl, PostNoneToken, PostWithToken, PostWithTokenFile } from '../../../api/crud';
import AlertFunction from '../../../../components/alertfunction';
import DeleteFunction from '../../../../components/deletefunction';

const isBrowser = typeof window !== "undefined";



function Index(props) {



    const [loadingContent, setLoadingContent] = useState(true);
    const [companyImage, setCompanyImage] = useState([]);
    const [companyId, setCompanyId] = useState();



    useEffect(() => {
        start()
    }, [])
    const start = async () => {
        if (isBrowser) {
            const hrf = window.location.href.split("/")
            const id = hrf[hrf.length - 1]
            setCompanyId(id);
            var d = await GetWithToken("Company/GetImages/" + id).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            setLoadingContent(false);
            setCompanyImage(d.data)
        }

    }
    const uploadFile = async (data) => {
       if(companyImage.length/3==10){
        AlertFunction("Yükleme Yapılmadı", "En Fazla 10 Adet Resim Yüklenebilir");
        return false
       }

        if (data) {
            var d = await PostWithTokenFile("FileUpload/ImageUpload", { name: "file", data: data }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            await PostWithToken("Company/uploadImage", { fileName: d.data.file.name, extension: d.data.file.extension, id: companyId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
            start()
        }


    }
    const deleteImage = async (data) => {

        if (data) {

            await PostWithToken("Company/RemoveImage", { fileName: data, id: companyId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu Bu işlem için yetkiniz bulunmuyor"); return false })


            start()
        }
    }

    return (
        <Layout loadingContent={loadingContent} pageName="firma-listesi">
            <PageHeader title="Firmalarım" map={[
                { url: "", name: "Firmalarım" },
                { url: "/firmalarim/firma-listesi/", name: "Firma Listesi" },
                { url: "", name: "Resimler" }
            ]}>

            </PageHeader>
            <div className='content pr-3 pl-3'>
                <div className='card pb-5'>
                    <div className='row mt-3'>
                        <div className='col-12 row justify-content-center align-items-center'>
                            {/* <img src={fileUploadUrl + company.logoUrl} style={{ width: 150 }} /> */}
                        </div>
                    </div>
                    <div className='row mt-4 property-tab-ad'>
                        <div className='col-12 row'>
                            {companyImage.map((item, key) => {


                                if (item.imageUrl?.includes("_x2")) {
                                    return <div key={key} className="col-12 col-md-2 image-content">

                                        <button className='delete-image-button' onClick={() => DeleteFunction("Uyarı", "Kayt Silinecek Onaylıyor Musunuz?", () => deleteImage(item.imageUrl.replace("_x2", "")))}><i className='fa fa-trash'></i></button>
                                        <img src={imageUploadUrl + item.imageUrl} style={{ width: "100%" }} />

                                    </div>
                                }


                            })}
                            <div className="col-12 col-md-3">

                                <button onClick={() => document.getElementById("file").click()}>Ekle</button>
                                <input type={"file"} onChange={(x) => { uploadFile(x.target.files[0]) }} name="file" style={{ width: 1, height: 1, opacity: 0, position: "absolute", zIndex: -9999 }} id="file"></input>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

        </Layout>
    );
}

export default Index;