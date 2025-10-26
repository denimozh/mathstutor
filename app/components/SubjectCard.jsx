// SubjectCard.jsx
import React from 'react';

const SubjectCard = ({ subject, score, questions, borderClass, bgClass }) => {
  return (
    <div
      className={`flex flex-col gap-8 rounded-xl items-center justify-center h-fit p-8 border ${borderClass} ${bgClass}`}
    >
      <p className="text-xl xl:text-2xl">{subject}</p>
      <p className="text-2xl xl:text-4xl">{score}%</p>
      <p className="text-lg xl:text-xl">{questions} Questions</p>
    </div>
  );
};

export default SubjectCard;
