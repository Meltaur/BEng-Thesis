let checkFetch = response =>{
    if(!response.ok){
        throw Error(response.status)
    }
    return response
}

export default checkFetch