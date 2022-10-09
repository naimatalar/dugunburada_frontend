

import { useState } from 'react'
import { DocumentApplicationChart } from '../../components/DocumentApplicationStatusChart.tsx'
import { DocumentTypeChart } from '../../components/DocumentTypeChart.tsx'
import Layout from '../../layout/layout'
import PageHeader from '../../layout/pageheader'


export default function index() {
  const [documentTypeYear, setDocumentTypeYear] = useState(new Date().getFullYear())

  const [docApCartYear, setDocApCartYear] = useState(new Date().getFullYear())
  const [docApCartMout, setDocApCartMout] = useState(new Date().getMonth() + 1)

  return <Layout>
    <PageHeader title="Dashboard" map={[

    ]}>

    </PageHeader>
    <div className='content'>
      <div className='row'>


        <div className='col-12 col-md-6 p-2 m-4'>
          <div className='row justify-content-center'>
            <label> <b>Yıl Giriniz: </b><input type={"number"} minLength={4} min={1990} value={documentTypeYear} onChange={(x) => setDocumentTypeYear(x.target.value)}></input></label>
          </div>

          {documentTypeYear && <DocumentTypeChart year={documentTypeYear}></DocumentTypeChart>}

        </div>
        <div className='col-12 col-md-3 p-2 m-4'>
          <div className='row'>
            <div className='col-12 col-md-6'> <b>Yıl Giriniz: </b><input type={"number"} minLength={4} min={1990} value={docApCartYear} onChange={(x) => setDocApCartYear(x.target.value)}></input></div>
            <div className='col-12 col-md-6'><b>Ay Seçiniz : </b><select style={{ padding: 2, width: "100%" }} value={docApCartMout} onChange={(x) => setDocApCartMout(x.target.value)}>

              <option value={1}>Ocak</option>
              <option value={2}>Şubat</option>
              <option value={3}>Mart</option>
              <option value={4}>Nisan</option>
              <option value={5}>Mayıs</option>
              <option value={6}>Haziran</option>
              <option value={7}>Temmuz</option>
              <option value={8}>Ağustos</option>
              <option value={9}>Eylül</option>
              <option value={10}>Ekim</option>
              <option value={11}>Kasım</option>
              <option value={12}>Aralık</option>
            </select></div>
            <div className='mt-3 text-center col-12'>
              <b style={{color:"grey",textAlign:"center"}}> Başvuru Sonuçları</b>
            </div>
          </div>

          <DocumentApplicationChart year={docApCartYear} mout={docApCartMout}></DocumentApplicationChart>

        </div>
      </div>
    </div>
  </Layout>



}
