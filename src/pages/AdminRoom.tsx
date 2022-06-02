import '../styles/room.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, remove, update } from 'firebase/database';
import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/logo.svg';
import checkImg from '../assets/check.svg';
import answerImg from '../assets/answer.svg';
import deleteImg from '../assets/delete.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const navigate = useNavigate();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId || '');

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
      await remove(roomRef);
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`);

    await update(roomRef, {
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`);

    await update(roomRef, {
      isHighlighted: true,
    });
  }

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar essa sala?')) {
      const roomRef = ref(database, `rooms/${roomId}`);
      await update(roomRef, {
        endedAt: new Date(),
      });

      navigate('/');
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetMeAsk" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Deletar pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
