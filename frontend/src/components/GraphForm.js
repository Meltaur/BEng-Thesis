import React, { useEffect, useState } from 'react'
import today from "./today"
import html2canvas from "html2canvas"
import jspdf from "jspdf"
import { useTranslation } from 'react-i18next'

function GraphForm(props){
const { t, i18n } = useTranslation() 
const [day, setDay] = useState(today) //Po inicjalizacji pracy komponentu zostanie wyświetlony wykres z obecnego dnia
const [quantity, setQuantity] = useState({"wielkosc":"Suma", "name":t('Sum.label'), "jednostka": "P[W]"})//Domyślnie wyświetlonie zostanie wykres sumy mocy z trzech falowników

useEffect(() =>{
            let temp = day.slice(8,10)+'.'+day.slice(5,7)+'.'+day.slice(0,4) //Zamiana odpowiedzi jaką dostarcza input type="date" na formę która zostanie wysłana do serwera HTTP
            props.chooseDay(temp)
    },[day])

useEffect(() =>{
    props.chooseQuantity(quantity) //Przesłania do komponentu Graph informacji o interesującej użytkownika wielkości pomiarowej
},[quantity])

useEffect(() =>{ //Uaktualnienie nazwy wielkości w przypadku zmiany języka
    const temp = document.getElementById('quantity')
     setQuantity({
         "wielkosc":temp.options[temp.selectedIndex].getAttribute('wielkosc'),
         "name":temp.options[temp.selectedIndex].getAttribute('name'), 
         "jednostka": temp.options[temp.selectedIndex].getAttribute('jednostka')
      })
},[i18n.language])

const handleChange = e =>{ //Obsłużenie wyboru pomiaru na rozwijanej liście
    e.preventDefault()
     setQuantity({
        "wielkosc":e.target.options[e.target.selectedIndex].getAttribute('wielkosc'),
        "name":e.target.options[e.target.selectedIndex].getAttribute('name'), 
        "jednostka": e.target.options[e.target.selectedIndex].getAttribute('jednostka')
     })
}

const printDocument = () => { //Funkcja obsługująca przycisk pobrania wykresu jako pliku pdf.
    const input = document.getElementById('Chart') //Przypisanie do zmiennej obszaru diva zawierającego graf
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png') //Zamiana diva na format png przy pomocy zewnętrznej biblioteki html2canvas
        const pdf = new jspdf( {orientation: "landscape"}) //Utworzenie pliku pdf przy pomocy biblioteki jspdf
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height/2) //Dodanie do pdfa wcześniej utworzonego obrazu
        pdf.save("Wykres.pdf") //Zapisanie pdfa na dysku
      })
    
  }

    return(
        <div id="sidebar">

            <form onSubmit={e => {e.preventDefault(); setDay(e.target.date.value)}}>
                <input type= "date"
                name="Date"
                id="date"
                className="date"
                min="2020-09-04"
                max={today}
                defaultValue={today}
                /><br/>
                <input type="submit" value={t('Choose_day.label')} id="choosedate"/>
            </form>
            <select name="quantity" id="quantity" onChange={e => handleChange(e)}>
                <option wielkosc="Suma" name={t('Sum.label')} jednostka= "P[W]">{t('Sum.label')}</option>
                <option wielkosc="A_Ms_Watt" name={t('A_Ms_Watt.label')} jednostka= "P[W]">{t('A_Ms_Watt.label')}</option>
                <option wielkosc="A_Ms_Watt_1" name={t('A_Ms_Watt_1.label')} jednostka= "P[W]">{t('A_Ms_Watt_1.label')}</option>
                <option wielkosc="A_Ms_Watt_2" name={t('A_Ms_Watt_2.label')} jednostka= "P[W]">{t('A_Ms_Watt_2.label')}</option>
                <option wielkosc="GridMs_TotVAr" name={t('GridMs_TotVAr.label')} jednostka="Q[VAr]">{t('GridMs_TotVAr.label')}</option>
                <option wielkosc="GridMs_TotVAr_1" name={t('GridMs_TotVAr_1.label')} jednostka= "Q[VAr]">{t('GridMs_TotVAr_1.label')}</option>
                <option wielkosc="GridMs_TotVAr_2" name={t('GridMs_TotVAr_2.label')} jednostka= "Q[VAr]">{t('GridMs_TotVAr_2.label')}</option>
                <option wielkosc="GridMs_TotVA" name={t('GridMs_TotVA.label')} jednostka= "S[VA]">{t('GridMs_TotVA.label')}</option>
                <option wielkosc="GridMs_TotVA_1" name={t('GridMs_TotVA_1.label')} jednostka= "S[VA]">{t('GridMs_TotVA_1.label')}</option>
                <option wielkosc="GridMs_TotVA_2" name={t('GridMs_TotVA_2.label')} jednostka= "S[VA]">{t('GridMs_TotVA_2.label')}</option>
                <option wielkosc="A_Ms_Amp" name={t('A_Ms_Amp.label')} jednostka= "I[A]">{t('A_Ms_Amp.label')}</option>
                <option wielkosc="A_Ms_Amp_1" name={t('A_Ms_Amp_1.label')} jednostka= "I[A]">{t('A_Ms_Amp_1.label')}</option>
                <option wielkosc="A_Ms_Amp_2" name={t('A_Ms_Amp_2.label')} jednostka= "I[A]">{t('A_Ms_Amp_2.label')}</option>
                <option wielkosc="A_Ms_Vol" name={t('A_Ms_Vol.label')} jednostka= "U[V]">{t('A_Ms_Vol.label')}</option>
                <option wielkosc="A_Ms_Vol_1" name={t('A_Ms_Vol_1.label')} jednostka= "U[V]">{t('A_Ms_Vol_1.label')}</option>
                <option wielkosc="A_Ms_Vol_2" name={t('A_Ms_Vol_2.label')} jednostka= "U[V]">{t('A_Ms_Vol_2.label')}</option>
                <option wielkosc="IntSolIrr" name={t('IntSolIrr.label')} jednostka= "G[W/m^2]">{t('IntSolIrr.label')}</option>
                <option wielkosc="TmpAmb_C" name={t('TmpAmb_C.label')} jednostka= "T[°C]">{t('TmpAmb_C.label')}</option>
                <option wielkosc="envhmdt" name={t('envhmdt.label')} jednostka= "f[%]">{t('envhmdt.label')}</option>
            </select>
            <button onClick={printDocument} id='pdf'>{t('PDF.label')}</button>
            <br/><span style={{color: "red"}}>{props.error}</span>

        </div>
      
    )
}

export default GraphForm
