

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


 
      </div>
    </div>
  </Layout>



}
