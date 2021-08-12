import React, {useState, useEffect} from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer
  } from 'recharts';
import { useTranslation } from 'react-i18next'

function GraphDisplay(props){
    const { t, i18n } = useTranslation() 
    const [error, setError] = useState('')//Wyświetlanie błędu w przypadku nieprawidłowych danych
    const data = props.data 
    const quantity = props.quantity //Przypisanie do zmiennych wartości odziedziczonych, w których zawarte są informacje o danych danego dnia i pomiarze który należy wyświetlić
    useEffect(()=>{
        setError('')
    },[data, quantity]) //W przypadku dostarczenia nowych danych lub pomiarów do wyświetlenia resetowany jest błąd
    const jednostka = quantity.jednostka //Zmienna przechowująca informacje o jednostce pomiaru
    const timeStamps = data.map(data => data.TimeStamp.slice(11,16)) //Zmienna wykorzystywana do podpisania osi X na wykresie
    let [falownik1kWh, falownik2kWh, falownik3kWh] =[]
    falownik1kWh = data.filter(data => data.E_Total !== '0').map(data => parseFloat(data.E_Total.replace(',', '.')))
    falownik2kWh = data.filter(data => data.E_Total_1 !== '0').map(data => parseFloat(data.E_Total_1.replace(',', '.')))
    falownik3kWh = data.filter(data => data.E_Total_2 !== '0').map(data => parseFloat(data.E_Total_2.replace(',', '.'))) //Zmienne odpowiedzialne za obliczanie całkowitej energi oddanej z trzech falowników
    const date = data.map(data => data.TimeStamp.slice(0,10)) //Data potrzebna do wyświetlenia nad wykresem
    const sumaEnergi = (Math.max(...falownik1kWh) - Math.min(...falownik1kWh) + Math.max(...falownik2kWh) - Math.min(...falownik2kWh) + Math.max(...falownik3kWh) - Math.min(...falownik3kWh)).toFixed(2)//Obliczenie sumy energi
    props.energia(sumaEnergi)
    let chartData = [] //Zmienna do której będą przypisane wartości do wyświetlenia na wykresie
    let [graphData1, graphData2] =[] //Tak samo jak powyżej, ale wykorzystywane w przypadku gdy wielkość jest pomiarem ze stacji pogodowych
    if(quantity.wielkosc==="Suma"){ //Jeżeli użytkownik chce oglądać sumę mocy czynnych z trzech falowników
        let [falownik1, falownik2, falownik3] = [] 
        try{
            falownik1 = data.map(data => parseFloat(data.A_Ms_Watt.replace(',', '.')))
        }catch(e){
            falownik1 = data.map(data => parseFloat(data.A_Ms_Watt))//Operacja zamiany przecinka na kropkę nie jest możliwa w przypadku gdy wartość jest równa Nan
            if(!error){ setError(' - ' + t('Wrong_data.label'))}
        }
        try{
            falownik2 = data.map(data => parseFloat(data.A_Ms_Watt_1.replace(',', '.')))
        }catch(e){
            falownik2 = data.map(data => parseFloat(data.A_Ms_Watt_1))
            if(!error){ setError(' - ' + t('Wrong_data.label'))}
        }
        try{
            falownik3 = data.map(data => parseFloat(data.A_Ms_Watt_2.replace(',', '.')))
        }catch(e){
            falownik3 = data.map(data => parseFloat(data.A_Ms_Watt_2))
            if(!error){ setError(' - ' + t('Wrong_data.label'))}
        }
        for(let i=0; i<timeStamps.length; i++){ //Dodawanie kolejnych punktów w formie do wyświetlenia na wykresie
            const newRow = {"name":"", [jednostka]:""}
            newRow.name = timeStamps[i] 
            newRow[jednostka] = falownik1[i] + falownik2[i] + falownik3[i]
            newRow[jednostka]= parseFloat(newRow[jednostka].toFixed(2))
            chartData.push(newRow)
        }
    } 
    else if(quantity.wielkosc==="TmpAmb_C" || quantity.wielkosc==="IntSolIrr" || quantity.wielkosc==="envhmdt"){ //Jeżeli użytkownik chce oglądać któryś z pomiarów ze stacji pogodowej
        try{
            graphData1 = data.map(data => parseFloat(data[quantity.wielkosc].replace(',', '.')))
        }catch(e){
            graphData1 = data.map(data => parseFloat(data[quantity.wielkosc]))
            if(!error){ setError(' - ' + t('Wrong_data.label'))}
        }
        try{
            graphData2 = data.map(data => parseFloat(data[quantity.wielkosc+'_1'].replace(',', '.')))
        }catch(e){
            graphData2 = data.map(data => parseFloat(data[quantity.wielkosc+'_1']))
            if(!error){ setError(' - ' + t('Wrong_data.label'))}
        }
        for(let i=0; i<timeStamps.length; i++){
            const newRow = {"name":"", [jednostka]:""}
            newRow.name = timeStamps[i]
            newRow[jednostka] = (graphData1[i] + graphData2[i])/2
            newRow[jednostka] = parseFloat(newRow[jednostka].toFixed(2))
            chartData.push(newRow)
        }
    }
    else{//Wszystkie pozostałe pomiary
        try{
            graphData1 = data.map(data => parseFloat(data[quantity.wielkosc].replace(',', '.')))
        }catch(e){
            graphData1 = data.map(data => parseFloat(data[quantity.wielkosc]))
            if(!error){ setError(' - ' + t('Wrong_data.label'))}
        }
        for(let i=0; i<timeStamps.length; i++){
            const newRow = {"name":"", [jednostka]:""}
            newRow.name = timeStamps[i]
            newRow[jednostka] = graphData1[i]
            newRow[jednostka] = parseFloat(newRow[jednostka].toFixed(2))
            chartData.push(newRow)
        }
    }

    return(
        <div id='Chart'>
            <div id='Pasek'>
                <span id ="tytul">
                    {quantity.name}
                    {error}
                 </span>   
                 <span id="całkowitaEnergia">
                    {t('Day.label')}: {date[0]}<br/>
                    {t('E_Total.label')}:<br/>
                    {sumaEnergi}[kWh] 
                </span>
                
                <div style={{clear:'both'}}></div>
            </div>
            <ResponsiveContainer width="100%" height={600}> 
            <LineChart
                data={chartData}
                margin={{
                    top: 30, right: 30, left: 20, bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" >
                <Label value='t(s)' position="insideBottomRight" offset={-5} />
                </XAxis>
                <YAxis >
                <Label value={jednostka} position="top" offset={15} />
                </YAxis>
                <Tooltip />
                <Line type="monotone"  dataKey={jednostka} stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            </ResponsiveContainer> 
        </div>
        
    )
}
    
export default GraphDisplay