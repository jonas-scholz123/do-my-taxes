const Card = (props) => {
    
    let handleClick = () => {};
    if (props.handleClick) {
       handleClick = props.handleClick 
    }
    return (
        <div class={"border shadow rounded-lg py-8 " + props.classes} onClick={() => handleClick()}>
            {props.content}
        </div>
    )
}

export default Card;