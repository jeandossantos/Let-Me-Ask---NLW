import { ReactNode } from 'react';
import '../styles/question.scss';

type QuestionProps = {
  children?: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered?: boolean;
  isHighLighted?: boolean;
};

export function Question({
  children,
  content,
  author,
  isAnswered = false,
  isHighLighted = false,
}: QuestionProps) {
  return (
    <div
      className={`question ${isAnswered ? 'answered' : ''} 
      ${isHighLighted ? 'highlighted' : ''}`}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
