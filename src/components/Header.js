import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactCountryFlag from "react-country-flag"

const Header = () => {
    const [flag, setFlag] = useState("PL")
    const { t, i18n } = useTranslation() 
    const changeLanguage = () => {
        if(i18n.language == "pl"){
            setFlag("GB")
            i18n.changeLanguage('eng')
        }else{
            setFlag("PL")
            i18n.changeLanguage('pl')
        }   
        }

    
return(  
    <div id='header'>
        <div id='przywitanie'>
        {t('title.label')}
        </div>
        <div id='autor'>
            <button name="language" id="flaga"  onClick={changeLanguage}><ReactCountryFlag countryCode={flag} svg style={{
                    width: '100%',
                    height: '100%',
                    padding: '0px',
                    margin:'0px',
                    outline: '1px solid black',
                }}/></button>
        </div>
        <div style={{clear:'both'}}></div>      
    </div>
)


}
export default Header
