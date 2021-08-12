import React, { useState, useEffect } from 'react'
import GraphDisplay from './GraphDisplay'
import EmptyGraphDisplay from './EmptyChartDisplay'
import { useTranslation } from 'react-i18next'

function DataFetch(){
    const [data, setData] = useState([{}])
    const [isLoading, setIsLoading] = useState(true)
    const [sumaEnergi, setSumaEnergi] = useState("")
    const { t, i18n } = useTranslation() 

    useEffect(() => { //Wysłanie zapytanie do serwera HTTP o wyświetlenie wykresu z dnia poprzedniego. Aktywowane przy otwarciu strony
    const abortController = new AbortController()
    const signal = abortController.signal
      fetch('/api/lastday', {signal: signal}).then(res => res.json())
      .then(data => setData(data))
      .then(isLoading => setIsLoading(isLoading = false))

      return function cleanup(){
          abortController.abort()
      }
    }, []) 

    const energia = (sumaEnergi) => { //Funkcja dziedziczona do GraphDisplay
        setSumaEnergi(sumaEnergi)
    }


    return( 
        <div>
            {isLoading?<div><EmptyGraphDisplay /></div>:
            <div><GraphDisplay data = {data} quantity={{"wielkosc":"Suma", "name":t('Sum.label'), "jednostka": "P[W]"}} energia={energia}/></div>}
            
        </div>
    )
}

export default DataFetch

