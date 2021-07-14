import ClipLoader from "react-spinners/ClipLoader";

export default function LoadingOrError(props){
    const {error, isLoaded} = props;

    if (error) {
    return <div> Error; {error.message} </div>;
    } else if (!isLoaded) {
        return (
            <div className="flex justify-center items-center p-10">
                <ClipLoader loading={!isLoaded} size={150} />
            </div>
        )
    }
}