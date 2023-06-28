export const EditData = (data: any, id: string, post: any) => {
    const newData = data.map((item : any) => 
        (item._id === id ? post : item)
    )
    return newData;
}

export const DeleteData = (data: any, id:string) => {
    const newData = data.filter((item : any) => item._id !== id)
    return newData;
}