import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { FaLink } from "react-icons/fa";
import { Link, withRouter } from "react-router-dom";
import ProfileIcon from "../customization/ProfileIcon";
import AddQuestionDiv from "./AddQuestionDiv";
import Validator from "validator";

const { FETCH_QUESTIONS, CURRENT_USER, SIMILAR_QUESTIONS, FETCH_TOPICS } = Queries;
const { NEW_QUESTION, ADD_TOPIC_TO_QUESTION } = Mutations;

function QuestionForm({ history, closeSearchModal = () => {}, button, div }) {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [link, setLink] = useState("");
  const [successfulQuestion, setSuccessfulQuestion] = useState("");
  const [successfulQId, setSuccessfulQId] = useState("");
  const [redirectId, setRedirectId] = useState("");
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topics, setTopics] = useState([]);
  const [checked, setChecked] = useState({});
  const [dataMatches, setDataMatches] = useState([]);

  // Current user (for avatar/name in the Add Question modal)
  const { data: currentUserData, loading: currentUserLoading, error: currentUserError } = useQuery(
    CURRENT_USER,
    {
      variables: { token: localStorage.getItem("auth-token") },
      skip: !showModal,
    }
  );

  // Similar questions for the live matches list
  const { data: similarData, loading: similarLoading } = useQuery(SIMILAR_QUESTIONS, {
    variables: { question },
    skip: question.length <= 1,
  });

  useEffect(() => {
    if (similarData?.similarQuestions) {
      setDataMatches(similarData.similarQuestions);
    }
  }, [similarData]);

  // Topic list when the topics modal is open
  const {
    data: topicsData,
    loading: topicsLoading,
    error: topicsError,
  } = useQuery(FETCH_TOPICS, { skip: !showTopicModal });

  // Create question
  const [createQuestion] = useMutation(NEW_QUESTION, {
    update(cache, { data }) {
      try {
        const existing = cache.readQuery({ query: FETCH_QUESTIONS });
        if (!existing) return;
        const newQ = data.newQuestion;
        cache.writeQuery({
          query: FETCH_QUESTIONS,
          data: { questions: [newQ, ...existing.questions] },
        });
      } catch (err) {
        // Cache might not have FETCH_QUESTIONS yet; ignore
      }
    },
    onError(err) {
      setMessage(err.message || "Could not add question.");
      setTimeout(() => setMessage(""), 5001);
    },
    onCompleted(data) {
      const { question: qText, _id } = data.newQuestion;
      setMessage("You asked: ");
      setSuccess("success");
      setShowModal(false);
      setQuestion("");
      setLink("");
      setSuccessfulQuestion(qText);
      setSuccessfulQId(_id);
      setShowTopicModal(true);
      setDataMatches([]);
      setTimeout(() => setMessage(""), 5001);
    },
  });

  // Add topic to question
  const [addTopicToQuestion] = useMutation(ADD_TOPIC_TO_QUESTION);

  useEffect(() => {
    if (redirectId) history.push(`/q/${redirectId}`);
  }, [redirectId, history]);

  const handleModal = (e) => {
    e.preventDefault();
    closeSearchModal(e);
    setShowModal((prev) => !prev);
    setMessage("");
    setSuccess("");
    setQuestion("");
    setLink("");
    setSuccessfulQuestion("");
    setSuccessfulQId("");
    setDataMatches([]);
  };

  const closeMessage = () => setMessage("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let q = question;

    if (q.trim().length < 1 || q.split(" ").length < 3) {
      setMessage(
        "This question needs more detail. Add more information to ask a clear question, written as a complete sentence."
      );
      setTimeout(closeMessage, 5001);
      return;
    }

    if (link.length === 0 || Validator.isURL(link)) {
      q = q.trim();
      if (q[q.length - 1] !== "?") q += "?";
      createQuestion({ variables: { question: q, link } });
    } else {
      setMessage("The source should be a valid link.");
      setTimeout(closeMessage, 5001);
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let topicId of topics) {
        // Await each to keep order/avoid race messages
        // (same behavior as sequential .forEach with mutations)
        // eslint-disable-next-line no-await-in-loop
        await addTopicToQuestion({ variables: { topicId, questionId: successfulQId } });
      }
      setShowTopicModal(false);
      setTopics([]);
      setChecked({});
      setMessage("You successfully set topics for ");
      setTimeout(closeMessage, 5001);
    } catch (err) {
      setMessage(err.message || "Failed to set topics.");
      setTimeout(closeMessage, 5001);
    }
  };

  const handleTopicModal = (e) => {
    e.preventDefault();
    setShowTopicModal((prev) => !prev);
    setTopics([]);
    setChecked({});
  };

  const updateTopic = (e) => {
    const topicId = e.currentTarget.value;
    if (topics.includes(topicId)) {
      setTopics(topics.filter((id) => id !== topicId));
      setChecked({ ...checked, [topicId]: false });
    } else {
      setTopics([...topics, topicId]);
      setChecked({ ...checked, [topicId]: true });
    }
  };

  const capitalize = (word = "") => (word ? word[0].toUpperCase() + word.slice(1) : "");

  const redirect = useCallback(
    (id) => () => {
      setShowModal(false);
      setRedirectId(id);
    },
    []
  );

  // Matches list (keeps showing previous matches while loading—same UX as before)
  const matchesList =
    question.length > 1 ? (
      <ul className="matches-list">
        {(similarLoading ? dataMatches : dataMatches)?.map((match) => (
          <li className="matches-item" onClick={redirect(match._id)} key={match._id}>
            <div>{match.question}</div>
            <div className="question-form-answers-number">
              {`${match.answers.length} ${match.answers.length === 1 ? "answer" : "answers"}`}
            </div>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div>
      {message.length > 0 && (
        <div className={`modal-message hide-me ${success}`}>
          <div className="hidden">x</div>
          <p>
            {message}
            {successfulQId && (
              <Link to={`/q/${successfulQId}`}>{successfulQuestion}</Link>
            )}
          </p>
          <div className="close-message" onClick={closeMessage}>
            x
          </div>
        </div>
      )}

      {/* optional triggers from props, same as before */}
      {button && (
        <button className="nav-ask-btn" onClick={handleModal}>
          Add Question
        </button>
      )}
      {div && <AddQuestionDiv handleModal={handleModal} />}

      {/* Add Question modal */}
      {showModal && (
        <div className="modal-background" onClick={handleModal}>
          <div className="modal-child" onClick={(e) => e.stopPropagation()}>
            <div className="add-question-modal">
              <div className="modal-header">
                <div className="add-question-modal-header">
                  <div className="tab selected">Add Question</div>
                </div>
                <div className="add-question-modal-x">
                  <span onClick={handleModal}>X</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="add-question-modal-content">
                  {/* current user header */}
                  {!currentUserLoading && !currentUserError && currentUserData?.currentUser && (
                    <div className="add-question-modal-user">
                      <ProfileIcon
                        size={30}
                        profileUrl={currentUserData.currentUser.profileUrl}
                        fsize={15}
                        fname={currentUserData.currentUser.fname}
                      />
                      <div className="question-modal-user-name">
                        {`${capitalize(currentUserData.currentUser.fname)} ${capitalize(
                          currentUserData.currentUser.lname
                        )} asked`}
                      </div>
                    </div>
                  )}

                  <div className="add-question-modal-question">
                    <textarea
                      onChange={(e) => setQuestion(e.target.value)}
                      value={question}
                      placeholder='Start your question with "What", "How", "Why", etc.'
                    />
                    {matchesList}
                  </div>

                  <div className="add-question-modal-link">
                    <span>
                      <FaLink />
                    </span>
                    <input
                      onChange={(e) => setLink(e.target.value)}
                      value={link}
                      placeholder="Optional: include a link that gives context"
                    />
                  </div>
                </div>

                <div className="add-question-modal-footer">
                  <button type="button" className="cancel-button" onClick={handleModal}>
                    Cancel
                  </button>
                  <button className="add-button" type="submit">
                    Add Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Topics modal */}
      {showTopicModal && (
        <div className="modal-background" onClick={handleTopicModal}>
          <div className="modal-child" onClick={(e) => e.stopPropagation()}>
            <div className="add-question-modal">
              <div className="topics-modal">
                <div className="topics-modal-header">{successfulQuestion}</div>
                <div className="topics-modal-instructions">
                  Add topics that best describe your question
                </div>

                <form onSubmit={handleTopicSubmit}>
                  <div className="topics-modal-body">
                    {topicsLoading && "loading..."}
                    {topicsError && `Error! ${topicsError.message}`}
                    {!topicsLoading &&
                      !topicsError &&
                      topicsData?.topics?.map((topic) => (
                        <div
                          className="topics-modal-topic-container"
                          key={topic._id}
                        >
                          <input
                            type="checkbox"
                            name={topic.name}
                            value={topic._id}
                            onChange={updateTopic}
                            checked={!!checked[topic._id]}
                          />
                          <img className="topic-modal-icon" src={topic.imageUrl} alt="" />
                          <label htmlFor={topic.name}>{topic.name}</label>
                        </div>
                      ))}
                  </div>

                  <div className="add-question-modal-footer">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleTopicModal}
                    >
                      Cancel
                    </button>
                    <button className="add-button" type="submit">
                      Add Topics
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(QuestionForm);