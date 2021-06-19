import {ReactComponent as ManSVG} from '../Icons/man.svg';
import {ReactComponent as ComputerSVG} from '../Icons/computer.svg';

export function FirstStepRight(props){
  return (
    <div className={`first-step ${props.hide} ${props.lock}`}>
      <h3 className="first-step__title">
        Who will go first?
      </h3>
      <div className="first-step__btns">
        <button
          className={`first-step__man-btn ${props.playerGoesFirst ? 'active' : ''}`}
          onClick={props.manFirst}
        >
          <ManSVG />
        </button>
        <button
          className={`first-step__computer-btn ${!props.playerGoesFirst ? 'active' : ''}`}
          onClick={props.computerFirst}
        >
          <ComputerSVG />
        </button>
      </div>
    </div>
  )
}