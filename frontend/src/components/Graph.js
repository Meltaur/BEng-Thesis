import React, { useState, useEffect } from 'react'
import GraphDisplay from './GraphDisplay'
import GraphForm from './GraphForm'
import CheckFetch from './CheckFetch'
import EmptyGraphDisplay from './EmptyChartDisplay'
import { useTranslation } from 'react-i18next'

function Graph(props){
const { t, i18n } = useTranslation() 
let token = "Bearer " + props.store.access_token
const [data, setData] = useState() //Zmienna do której przypisywana jest odpowiedź serwera HTTP na zapytania dotyczące wykresu
const [day, setDay] = useState("") //Zminna wysyłana do serwera z informacją o interesującym użytkownika dniu
const [sumaEnergi, setSumaEnergi] = useState("") //Zmienna przechowująca informację o sumie oddanej energii danego dnia
const [isLoading, setIsLoading] = useState(true) //W przypadku gdy zmienna jest prawdziwa wyświetlany jest pusty graf
const [quantity, setQuantity] = useState({"wielkosc":"", "name":"", "jednostka": ""})//Zmienna przechowująca informację o interesującej użytkownika wielkości pomiarowej

    useEffect(()=>{ //Wysłanie zapytania do serwer w momencie zmiany stanu dnia
        const abortController = new AbortController() //Ma za zadanie posprzątanie po zakończeniu pracy funkcji
        const signal = abortController.signal
            if(day){
                setIsLoading(true)
                fetch('/graphdata', {
                    method: "POST",
                    signal: signal,
                        headers: {
                            'Accept': 'application/json',   
                            "Content-Type": "application/json",
                            'Authorization': token
                    },
                    body:JSON.stringify(day)
                }).then(res => CheckFetch(res))//W pierwszej kolejności wywoływana jest funkcja sprawdzająca czy odpowiedzią nie jest błąd 401
                  .then(res => res.json())
                  .then(data => setData(data))
                  .then(isLoading => setIsLoading(isLoading = false))
                  .then(()=>props.setError(''))
                  .catch((error) => {if(error=='Error: 401'){//W przypadku wystąpienia błędu wywoływana jest funkcja inicjalizująca wysłanie reset tokenu
                  props.handleReset(day).then(res => {token = "Bearer " + props.store.access_token
                      setDay()
                      setDay(res)})} //Ponowne ustawienie dnia w celu rozpoczęcia pracy hooka po uzyskaniu nowego tokena
                  else{
                      props.setError(t('ServerErr.label'))
                  }}
                  
        )}
        return function cleanup(){
            abortController.abort()
        }
    }, [day])

    const chooseDay = (dayFromCalendar) => {
        setDay({"day":dayFromCalendar})
    }

    const chooseQuantity = (choosenQuantity) => { //Funkcje chooseDay i chooseQuantity są dziedziczone do GraphForm
        setQuantity(choosenQuantity)
    }

    const energia = (sumaEnergi) => {
        setSumaEnergi(sumaEnergi)
    }

    

    return(
        <div>
            {!isLoading && data ? <div><GraphDisplay data={data} quantity={quantity} energia={energia}/></div>:
            <div>
            <EmptyGraphDisplay />
            </div>}
            <GraphForm chooseDay={chooseDay} chooseQuantity={chooseQuantity} sumaEnergi={sumaEnergi} error={props.error}/>
        </div>
    )
}

export default Graph

