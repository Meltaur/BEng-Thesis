import React, { useState, useEffect } from 'react'
import DataFetch from './DataFetch'
import LoginForm from './LoginForm'
import LogoutForm from './LogoutForm'
import Graph from './Graph'
import DownloadCenter from './DownloadCenter'
import { useTranslation } from 'react-i18next'
import { propTypes } from 'react-country-flag'

function Login(){
    const [isLogged, setIsLogged] = useState(false) //Wyświetlanie innego interfejsu w zależności od stanu zmiennej
    const [store, setStore] = useState() //Zmienna przechowująca tokeny logowania oraz zmienną bool informującą o stanie zalogowania
    const [error, setError] = useState("") //Stan jest uaktualniany w sytuacji, gdy serwer HTTP odeśle błąd w odpowiedzi na próbę logowania
    const [refresh, setRefresh] = useState(false) //Zmienna statje się prawdziwa w sytuacji, kiedy access token jest przedawniony i należy wysłać do serwera HTTP refresh token
    const [logout, setLogout] = useState(false) //Zmienna staje się prawdziwa w momencie kliknięcia na przycisk wylogowania i jej zmiana inicjuje czynności konieczne do wylogowania
    const { t, i18n } = useTranslation() 

    useEffect(()=>{
        storecollector() //W momencie włączenia strony do zmiennej przypisywany jest zapisany w pamięci stan zalogowania i tokeny
    }, [])

    const storecollector = () => {
        let store = JSON.parse(localStorage.getItem('login')) //Interakcja z pamięcią przeglądarki - przypisanie do zmiennej zawartości pamięci
        if(store && store.login){  //Jeśli informacje były zapisane w pamięci to użytkownik będzie zalogowany
            setStore(store)
            setIsLogged(true)
        }
        
    }

    useEffect(()=>{  //Hook odpowiedzialny za odnowienie refresh tokena w przypadku przedawnienia access tokenu
            if(refresh){
                const token = "Bearer " + store.refresh_token
                fetch("/token/refresh", {
                    method: "POST",
                    headers: {
                    'Accept': 'application/json',
                    'Authorization': token
                    },
                }).then(res => res.json())
                .then(newtoken => setStore({"access_token":newtoken.access_token,"refresh_token":store.refresh_token, login:true}))
               .then(() => setRefresh(false))
               .then(() => {
                   if(logout){
                       setLogout(false)//Wylogowanie użytkownika w przypadku, jeśli stwierdzono nieważność access tokenu przy wylogowywaniu się
                       Logout(store.access_token, store.refresh_token)
                   }
               })
            }
    }, [refresh])

    useEffect(() =>{ //Hook odpowiedzialny za przetłumaczenie obecnego na stronie komunikatu błędu w przypadku zmiany języka
        if (error=='Nieprawidłowa nazwa użytkownika'){
            setError('Invalid username')
        }else if(error=='Nieprawidłowe hasło'){
            setError('Invalid password')
        }else if(error=='Invalid username'){
            setError('Nieprawidłowa nazwa użytkownika')
        }else if(error=='Invalid password'){
            setError('Nieprawidłowe hasło')
        }
    },[i18n.language])

    const Login = async (details) => { //Funkcja asynchroniczna odpowiedzialna za logowanie

        const response = await fetch("/login", { //Wysłanie do serwera HTTP danych logowania
            method: "POST",
            headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
            },
            body: JSON.stringify(details),
        });
        try{
            let result = await response.json() //Przyjęcie odpowiedzi
            if(result && result.access_token && result.refresh_token){ //W przypadku pozytywnej reakcji od serwera w odpowiedzi będą zawarte tokeny
                localStorage.setItem('login', JSON.stringify({//Dodanie do pamięci przeglądarki tokenów oraz zmiana statusu logowania
                    login: true,
                    access_token:result.access_token,
                    refresh_token:result.refresh_token
                }))
                storecollector()//Wywołanie funkcji storecollector w celu nadpisania stanu store oraz isLogged
                setError("")//Zresetowanie stanu odpowiedzialnego za błędy
            }
            else{
                if(result.msg==="Invalid username"){
                    setError(t('UsernameErr.label'))
                }else if(result.msg==="Invalid password"){
                    setError(t('PasswordErr.label'))
                }
            }
        }catch{
            setError(t('ServerErr.label'))
        }    
    }

    const Logout = async (access_token, refresh_token) => { //Funkcja odpowiedzialna za wylogowanie się. Usuwa z pamięci access token oraz refresh token
        const token = "Bearer " + access_token
        const token_refresh = "Bearer " + refresh_token
        try{
            const response_access = await fetch("logout/access", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Authorization': token
                    },
                }
            );
            let result_a = await response_access.json()
            if(result_a && result_a.message === 'Access token has been revoked'){
                const response_refresh = await fetch("logout/refresh", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': token_refresh
                        },
                    }
                );
                let result_r = await response_refresh.json()
                if(result_r && result_r.message === 'Refresh token has been revoked'){
                    setIsLogged(false)
                    setStore()
                    setError('')
                    localStorage.removeItem('login')
                }
            }else{
                throw new Error(response_access.status)
            }   
        }catch(error){
            if(error=='Error: 401'){
                console.log(error)
                setLogout(true)
                setRefresh(true) //W przypadku niepowodzenia należy odnowić access token
            }else{
                setError(t('ServerErr.label'))
            }
            
        }
        
    }

    const handleReset =  (value) => { //Funkcja pozwalająca na inicjację resetu w klasach dziedziczących po Login
        setRefresh(true)
        return new Promise((resolve)=>{
            resolve(value)
        }) 
        
        }
        
    return( 
        isLogged ? 
        <div>
            <div id="Graphsection">
                <Graph store={store} handleReset={handleReset} setError={setError} error={error}/>
                <LogoutForm Logout={Logout} store = {store} setError={setError}/>
            </div>
                <DownloadCenter store={store} handleReset={handleReset} setError={setError}/>
            
        </div>:
        <div id="Graphsection">
            <DataFetch />
            <LoginForm Login={Login} error={error}/>
        </div>
    )
}

export default Login

