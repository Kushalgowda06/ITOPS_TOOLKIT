export const filterData = (key:any , filterArray : any) =>{
    
    let tempObject :any = {}
    filterArray?.forEach( (curr : any , index: any ) =>{

        if( tempObject.hasOwnProperty(curr[key])){
            tempObject[curr[key]].push(curr)
        }else{
            tempObject[curr[key]] = [curr]
        }
    })
    return tempObject
}
