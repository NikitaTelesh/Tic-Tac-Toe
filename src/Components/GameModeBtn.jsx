export function GameModeBtm(props){
  return (
    <button
      className={`game-mode ${props.active}`}
      onClick={props.onClick}
    >Click to play with {props.text}
    </button>
  )
}