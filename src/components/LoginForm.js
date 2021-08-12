import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'


function LoginForm({Login, error}){
    const { t, i18n } = useTranslation() 
    const [details, setDetails] = useState({login: "", password: ""})

    const submitHandler = e =>{
        e.preventDefault()
        Login(details)
    }
    

    return( 
        <form onSubmit = {submitHandler}>
            <div id="sidebar">
                <input type="login" 
                name="Login"
                id="Login"
                placeholder={t('username.label')}
                onChange={e => setDetails({...details, login:e.target.value})}
                value={details.login}
                onFocus= {e => e.target.placeholder=''}
                onBlur= {e => e.target.placeholder=t('username.label')}
                /><br/>
                <input type="password" 
                name="Password"
                id="Password"
                placeholder={t('password.label')}
                onChange={e => setDetails({...details, password:e.target.value})}
                value={details.password}
                onFocus= {e => e.target.placeholder=''}
                onBlur= {e => e.target.placeholder=t('password.label')}
                /><br/>
                <input type="submit" id='loginbutton' value={t('login.label')}/>
                {(error !== "") ? (<div>{error}</div>): ""}
            </div>
        </form>    
    )
}

export default LoginForm

