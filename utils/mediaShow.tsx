
export const imageShow = (src: string) => {
    return(
        <img src={src} alt="images" className="img-thumbnail"
        />
    )
}

export const videoShow = (src: string) => {
    return(
        <video controls src={src} className="img-thumbnail"
        />
    )
}