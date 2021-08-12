import React from 'react'
import { useTranslation } from 'react-i18next'

function LogoutForm({Logout, store}){
    const { t, i18n } = useTranslation() 
    const submitHandler = e =>{
        e.preventDefault()
        Logout(store.access_token, store.refresh_token)
    }

    return( 
        <form onSubmit = {submitHandler} id='logbar'>
                <input type="submit" value={t('Logout.label')} id='logoutbutton'/>
        </form>  
    )
}

export default LogoutForm

