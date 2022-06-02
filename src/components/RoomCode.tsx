import copyImg from '../assets/copy.svg';
import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string | undefined;
};

export function RoomCode(props: RoomCodeProps) {
  function copyCodeToClipboard() {
    navigator.clipboard.writeText(props.code || '');
  }

  return (
    <button onClick={copyCodeToClipboard} className="room-code">
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
