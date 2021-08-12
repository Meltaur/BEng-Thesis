import React, { useState, useEffect } from 'react'
import Checkbox from "./Checkbox"
import today from "./today"
import download from "downloadjs"
import CheckFetch from './CheckFetch'
import { useTranslation } from 'react-i18next'


function DownloadCenter(props){
    const { t, i18n } = useTranslation() 
    let token = "Bearer " + props.store.access_token

    const [container, setContainer] = useState({quantities:[ //Stan przechowuje informację o nazwach wszystkich checkboxów oraz rozpoznaje czy są zaznaczone
        {id: 1, value: "A_Ms_Watt", unit:"[W]", isChecked: false, name: t('A_Ms_Watt.label')},
        {id: 2, value: "GridMs_TotVAr", unit:"[VAr]", isChecked: false, name: t('GridMs_TotVAr.label')},
        {id: 3, value: "GridMs_TotVA", unit:"[VA]", isChecked: false, name: t('GridMs_TotVA.label')},
        {id: 4, value: "A_Ms_Amp", unit:"[I]", isChecked: false, name: t('A_Ms_Amp.label')},
        {id: 5, value: "A_Ms_Vol", unit:"[V]", isChecked: false, name: t('A_Ms_Vol.label')},
        {id: 6, value: "A_Ms_Watt_1", unit:"[W]", isChecked: false, name: t('A_Ms_Watt_1.label')},
        {id: 7, value: "GridMs_TotVAr_1", unit:"[VAr]", isChecked: false, name: t('GridMs_TotVAr_1.label')},
        {id: 8, value: "GridMs_TotVA_1", unit:"[VA]", isChecked: false, name: t('GridMs_TotVA_1.label')},
        {id: 9, value: "A_Ms_Amp_1", unit:"[I]", isChecked: false, name: t('A_Ms_Amp_1.label')},
        {id: 10, value: "A_Ms_Vol_1", unit:"[V]", isChecked: false, name: t('A_Ms_Vol_1.label')},
        {id: 11, value: "A_Ms_Watt_2", unit:"[W]", isChecked: false, name: t('A_Ms_Watt_2.label')},
        {id: 12, value: "GridMs_TotVAr_2", unit:"[VAr]", isChecked: false, name: t('GridMs_TotVAr_2.label')},
        {id: 13, value: "GridMs_TotVA_2", unit:"[VA]", isChecked: false, name: t('GridMs_TotVA_2.label')},
        {id: 14, value: "A_Ms_Amp_2", unit:"[I]", isChecked: false, name: t('A_Ms_Amp_2.label')},
        {id: 15, value: "A_Ms_Vol_2", unit:"[V]", isChecked: false, name: t('A_Ms_Vol_2.label')},
        {id: 16, value: "IntSolIrr", unit:"[W/m^2]", isChecked: false, name: t('IntSolIrr.label')},
        {id: 17, value: "TmpAmb_C", unit:"[°C]", isChecked: false, name: t('TmpAmb_C.label')},
        {id: 18, value: "envhmdt", unit:"[%]", isChecked: false, name: t('envhmdt.label')},
        {id: 19, value: "E_Total", unit:"[kWh]", isChecked: false, name: t('E_Total.label')}
    ]})
    useEffect(() =>{ //Hook zmieniający nazwy checkboxów w przypadku zmiany języka
         setContainer({quantities:[
            {id: 1, value: "A_Ms_Watt", unit:"[W]", isChecked: false, name: t('A_Ms_Watt.label')},
            {id: 2, value: "GridMs_TotVAr", unit:"[VAr]", isChecked: false, name: t('GridMs_TotVAr.label')},
            {id: 3, value: "GridMs_TotVA", unit:"[VA]", isChecked: false, name: t('GridMs_TotVA.label')},
            {id: 4, value: "A_Ms_Amp", unit:"[I]", isChecked: false, name: t('A_Ms_Amp.label')},
            {id: 5, value: "A_Ms_Vol", unit:"[V]", isChecked: false, name: t('A_Ms_Vol.label')},
            {id: 6, value: "A_Ms_Watt_1", unit:"[W]", isChecked: false, name: t('A_Ms_Watt_1.label')},
            {id: 7, value: "GridMs_TotVAr_1", unit:"[VAr]", isChecked: false, name: t('GridMs_TotVAr_1.label')},
            {id: 8, value: "GridMs_TotVA_1", unit:"[VA]", isChecked: false, name: t('GridMs_TotVA_1.label')},
            {id: 9, value: "A_Ms_Amp_1", unit:"[I]", isChecked: false, name: t('A_Ms_Amp_1.label')},
            {id: 10, value: "A_Ms_Vol_1", unit:"[V]", isChecked: false, name: t('A_Ms_Vol_1.label')},
            {id: 11, value: "A_Ms_Watt_2", unit:"[W]", isChecked: false, name: t('A_Ms_Watt_2.label')},
            {id: 12, value: "GridMs_TotVAr_2", unit:"[VAr]", isChecked: false, name: t('GridMs_TotVAr_2.label')},
            {id: 13, value: "GridMs_TotVA_2", unit:"[VA]", isChecked: false, name: t('GridMs_TotVA_2.label')},
            {id: 14, value: "A_Ms_Amp_2", unit:"[I]", isChecked: false, name: t('A_Ms_Amp_2.label')},
            {id: 15, value: "A_Ms_Vol_2", unit:"[V]", isChecked: false, name: t('A_Ms_Vol_2.label')},
            {id: 16, value: "IntSolIrr", unit:"[W/m^2]", isChecked: false, name: t('IntSolIrr.label')},
            {id: 17, value: "TmpAmb_C", unit:"[°C]", isChecked: false, name: t('TmpAmb_C.label')},
            {id: 18, value: "envhmdt", unit:"[%]", isChecked: false, name: t('envhmdt.label')},
            {id: 19, value: "E_Total", unit:"[kWh]", isChecked: false, name: t('E_Total.label')}
        ]})
    },[i18n.language])
    const [toServer, setToServer] = useState() //Zmienna do której przekazywane są wszystkie informacje jakich potrzebuje serwer do przygotowania pliku csv
    const [startDate, setStartDate] = useState("2020-09-04") //Zmienna przechowująca informację który dzień, jest dniem najstarszych pomiarów z bazy danych
    const [endDate, setEndDate] = useState(today)//Ostatni dzień możliwy do wyboru na kalendarzu - dzisiejsza data
    const [error, setError] = useState('')//Zmienna do której przypisywany jest komunikat z serwera o błędach
    const [empty, setEmpty] = useState()//Zmienna jest prawdziwa w przypadku gdy nie wybrano żadnego checkboxa

    useEffect(()=>{ //Wysłanie do serwera zapytania o pobranie pliku csv oraz przyjęcie odpowiedzi
        const abortController = new AbortController()
        const signal = abortController.signal
            if(toServer){
            setEmpty(t('Wait.label'))//Komunikat przy oczekiwaniu na pobranie pliku
            fetch('/downloadcenter', 
            {method: "POST",
             signal: signal,
                headers: {
                    'Accept': 'text/csv',
                    'Content-Type': "application/json",
                    'Content-Disposition' : 'attachment',
                    'Errors': 'application/json',
                    'Authorization': token
            },
             body:JSON.stringify(toServer)
            }).then(res => CheckFetch(res)) 
            .then(res => {
                setError(res.headers.get('Errors')) //W pierwszej kolejności odczytywany jest komunikat z błędem
                return res.text() //Bez tego returna niemożliwe byłoby pobranie pliku csv, informacja o nim byłaby utracana
            })
            .then(blob =>  download(blob, "file.csv")) //Pobranie pliku csv. Wykorzystanie zewnętrznej biblioteki
            .then(()=>setEmpty(''))
            .then(()=>props.setError(''))
            .catch((error) => {if(error=='Error: 401'){ //Obsługa błędu dotyczącego nieaktywnego access tokenu
                  props.handleReset(toServer).then(res => {token = "Bearer " + props.store.access_token
                  setToServer()
                  setToServer(res)})}
                else{props.setError(t('ServerErr.label'))}}
                )}
            
        return function cleanup(){
            abortController.abort()
        }
    }, [toServer])
    
    const handleCheckChieldElement = e => { //Obsługa zaznaczania pojedynczych checkboxów
        let quantities = container.quantities
        quantities.forEach(quantity => { //Sprawdzenie wszystkich wartości ze stanu quantity
        if (quantity.value === e.target.value) //Jeśli nazwa ze stanu zgadza się z nazwą przypisaną do danego checkboxa
        quantity.isChecked =  e.target.checked //Przypisz do stanu zmienną checked checkboxa
        })
        setContainer({quantities: quantities}) //Uaktualnienie containera, wcześniejsze działania były wykonywane na zmiennej tymczasowej
    }

    const handleAllChecked = e => { //Funkcja zaznaczająca/odznaczająca wszystkie chceckboxy. Działa podobnie do funkcji handleCheckChieldElement
        let quantities = container.quantities
        quantities.forEach(quantity => quantity.isChecked = e.target.checked) 
        setContainer({quantities: quantities})
      }

    const handleSubmit = e => { //Funkcja wywoływana w momencie naciśnięcia przycisku "Pobierz plik .csv"
        e.preventDefault()
        let serverData = [] 
        let serverDataUnits = [] //Tabele, które będą się zapełniać w zależności od tego, czy checkbox był zaznaczony w momencie wywołania funkcji
        let quantities = container.quantities
        quantities.forEach(quantity => {
        if (quantity.isChecked)
            serverData.push(quantity.value)
            serverDataUnits.push(quantity.unit)
        })
        if(Array.isArray(serverData) && serverData.length){ //Jeśli wybrano jakieś zmienne to zaktualizuj stan toServer
            setToServer({quantities: serverData,
                units: serverDataUnits,
                startDate: startDate.slice(8,10)+'.'+startDate.slice(5,7)+'.'+startDate.slice(0,4),
                endDate: endDate.slice(8,10)+'.'+endDate.slice(5,7)+'.'+endDate.slice(0,4)})
        }else{
            setEmpty(t('Warning.label'))
        }
        
    }
    //Obsługa okna z błędami
    let modal = document.getElementById("myModal");
    let btn = document.getElementById("myBtn");
    let span = document.getElementsByClassName("close")[0];

    const nieprawidloweDane = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    }

    const nieprawidloweDaneSpan = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }

    return(
        <div id='downloadcenter'> 
            <div id='downloadCenterForm'>
            <form onSubmit={e=>handleSubmit(e)}>
                    
                        <div id='CP'>{t('CP.label')}</div>
                        <div className='label2'>
                            <input type="checkbox"  value="checkedall" className='checkbox' onClick={handleAllChecked}/>   
                            <label htmlFor='checkbox'>{t('Ch_Uch.label')}</label>
                        </div>

                            <input type= "date"
                            name="startDate"
                            id="startDate"
                            className='date'
                            min="2020-09-04"
                            max={endDate}
                            value={startDate}
                            onChange={e=>setStartDate(e.target.value)}
                            />
                            <br/>
                            <input type= "date"
                            name="endDate"
                            id="endDate"
                            className='date'
                            min={startDate}
                            max={today}
                            value={endDate}
                            onChange={e=>setEndDate(e.target.value)}
                            />
                            <br/>
                            <input type="submit" value={t('Download.label')} id='downloadbutton'/><br/><br/>
                            {empty}
                            <br/>
                            
                        </form>
                            <button id="myBtn" onClick={nieprawidloweDane}>{t('Wrong_data.label')}</button>
                                    <div id="myModal" className="modal">
                                        <div className="modal-content">
                                            <span className="close" onClick={nieprawidloweDaneSpan}>&times;</span>
                                            {t('Wrong_data_details.label')}
                                            <p>{error}</p>
                                        </div>
                                    </div>
                            </div>
                        <div id='checkboxes'>
                            {
                                container.quantities.map((quantities) => {
                                    return (<Checkbox handleCheckChieldElement={handleCheckChieldElement} {...quantities} key={quantities.id}/>)
                                })
                            }
                        </div>
                
            
            
            
            <div style={{clear:'both'}}></div>
        </div>    
    )
}

export default DownloadCenter
