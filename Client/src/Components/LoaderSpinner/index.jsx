import FadeLoader from "react-spinners/FadeLoader";

export default function Loader({color="black",loadings,size=1}){
    return(
        <FadeLoader
        color={color}
        loading={loadings}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
    )
}

