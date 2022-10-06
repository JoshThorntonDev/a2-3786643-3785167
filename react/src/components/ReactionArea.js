import "./css/ReactionArea.css"


function ReactionArea(props) {


    return (<span className="align-middle tempReactionArea">Likes: {props.likes} Dislikes: {props.dislikes}</span>)
}


export default ReactionArea