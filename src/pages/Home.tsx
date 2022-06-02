import { useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/illustration.svg';
import logoImg from '../assets/logo.svg';
import googleIcon from '../assets/google-icon.svg';
import { Button } from '../components/Button';

import '../styles/home.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { child, get, ref } from 'firebase/database';
import { database } from '../services/firebase';

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') return;

    const dbRef = ref(database);

    const room = await get(child(dbRef, `/rooms/${roomCode}`));

    if (!room.exists()) {
      alert('Room not exists!');
      return;
    }

    if (room.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo-real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="let me ask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
