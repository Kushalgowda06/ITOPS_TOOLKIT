import React, { useState } from 'react'
import VmWare from '../VmWare/VmWare'


const VmWarePage = () => {
    const [formData, setFormData] = useState({});

    const updateFormData = ( data : any ) =>{
        setFormData(data)
    }
    return (
        <VmWare  currentformData = {formData} updateFormData={updateFormData}/>
    )
}

export default VmWarePage
