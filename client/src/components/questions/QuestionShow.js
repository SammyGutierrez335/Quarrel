import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { Link, useParams } from "react-router-dom";
import AnswerForm from "../answer/AnswerForm";
import AnswerItem from "../answer/AnswerItem";
import Modal from "./EditTopicsModal";

const { FETCH_QUESTION, CURRENT_USER } = Queries;
const { TRACK_QUESTION } = Mutations;

function QuestionShow({ id, fromTopicQuestions = false }) {
  const { id: routeId } = useParams();
  const questionId = id || routeId;

  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMoreAnswers, setShowMoreAnswers] = useState(false);

  const { data, loading, error } = useQuery(FETCH_QUESTION, {
    variables: { id: questionId },
    skip: !questionId,
  });

  const { data: userData } = useQuery(CURRENT_USER, {
    variables: { token: localStorage.getItem("auth-token") },
    skip: !localStorage.getItem("auth-token"),
  });

  const [trackQuestion] = useMutation(TRACK_QUESTION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.question) return <p>Question not found.</p>;

  const question = data.question;
  const currentUser = userData?.currentUser;
  const trackedQuestions = currentUser?.trackedQuestions || [];
  const currentUserId = localStorage.getItem("currentUserId");

  const answers = (question.answers || []).map((answer) => (
    <AnswerItem key={answer._id} answer={answer} questionId={question._id} />
  ));

  const renderAnswers = () => {
    if (showMoreAnswers || !fromTopicQuestions) return answers;
    return answers[0] ? [answers[0]] : null;
  };

  const numAnswers = () => {
    const num = question.answers?.length || 0;
    return num === 1 ? "1 Answer" : `${num} Answers`;
  };

  const renderTopicsList = (topics = []) =>
    topics.map((topic) => (
      <Link key={topic._id} className="topics-list-item" to={`/topic/${topic.name}/questions`}>
        {topic.name}
      </Link>
    ));

  const renderPencil = () => {
    if (question.user?._id === currentUserId) {
      return (
        <div className="edit-topics" onClick={() => setShowModal(true)}>
          <i className="fas fa-pencil-alt"></i>
        </div>
      );
    }
    return null;
  };

  const renderQuestionTitle = () => {
    if (fromTopicQuestions) {
      return (
        <Link to={`/q/${question._id}`}>
          <h1>{question.question}</h1>
        </Link>
      );
    }
    return <h1>{question.question}</h1>;
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      await trackQuestion({ variables: { questionId: question._id } });
    } catch (err) {
      console.error("Track error:", err);
    }
  };

  return (
    <div className={fromTopicQuestions ? "feed-item" : ""}>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        checked={question.topics}
        question={question}
      />
      <div className="topics-list-container">
        {renderTopicsList(question.topics)}
        {renderPencil()}
      </div>
      <div className={fromTopicQuestions ? "topics-feed-question" : "qns-container"}>
        {renderQuestionTitle()}
        <div className="qns-actions">
          <div className="qns-answer" onClick={() => setShowForm(!showForm)}>
            <i className="far fa-angry"></i>
            <span>Quarrel</span>
          </div>
          <div
            className="qns-follow"
            id={trackedQuestions.some((t) => t._id === question._id) ? "qns-followed" : null}
            onClick={handleTrack}
          >
            <i className="fas fa-user-secret"></i>
            <span>Tracked</span>
          </div>
        </div>
        {showForm && <AnswerForm toggleForm={() => setShowForm(false)} questionId={question._id} />}
        <h2>{numAnswers()}</h2>
        {renderAnswers()}
        <div className="answers-toggle-container">
          {question.answers?.length > 1 && fromTopicQuestions && (
            <button className="answers-toggle" onClick={() => setShowMoreAnswers(!showMoreAnswers)}>
              {showMoreAnswers ? "Show Less Answers" : "Show More Answers"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionShow;
