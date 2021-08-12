import React from 'react'


function Checkbox(props){

    return( 
        <div className='label'>
            <input  onChange={props.handleCheckChieldElement} type="checkbox" className='checkbox' checked={props.isChecked} value={props.value} />
            <label htmlFor='checkbox' >{props.name}</label>
        </div>
    )
}

export default Checkbox

