const Card = (props) => {
    
    let handleClick = () => {};
    if (props.handleClick) {
       handleClick = props.handleClick 
    }
    return (
        <div class={props.classes + " border shadow rounded-lg "} onClick={() => handleClick()}>
            {props.content}
        </div>
    )
}

export default Card;