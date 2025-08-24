import React from 'react';
import { ApolloConsumer, gql } from '@apollo/client';
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { Link, withRouter } from "react-router-dom";
import AnswerForm from "../answer/AnswerForm";
import AnswerItem from "../answer/AnswerItem";
import Modal from "./EditTopicsModal";

const { FETCH_QUESTION, CURRENT_USER } = Queries;
const { TRACK_QUESTION } = Mutations;

class QuestionShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      body: "",
      showForm: false,
      show: false,
      updated: false,
      showMoreAnswers: false,
      question: null,
      loading: true,
      error: null,
      currentUser: null,
    };
    this.toggleForm = this.toggleForm.bind(this);
    this.numAnswers = this.numAnswers.bind(this);
    this.track = this.track.bind(this);
    this.renderTopicsList = this.renderTopicsList.bind(this);
    this.renderAnswers = this.renderAnswers.bind(this);
    this.toggleShowMoreAnswers = this.toggleShowMoreAnswers.bind(this);
    this.renderShowAnswersButton = this.renderShowAnswersButton.bind(this);
    this.containerClassName = this.containerClassName.bind(this);
    this.feedItemClassName = this.feedItemClassName.bind(this);
    this.renderQuestionTitle = this.renderQuestionTitle.bind(this);
  }

  componentDidMount() {
    // Fetch data on mount using ApolloConsumer in render
  }

  toggleTopicModal = () => {
    this.setState({ show: !this.state.show });
  };

  toggleForm() {
    this.setState({ showForm: !this.state.showForm });
  }

  numAnswers(question) {
    const num = question.answers.length;
    return num === 1 ? "1 Answer" : `${num} Answers`;
  }

  track(e, client, questionId) {
    e.preventDefault();
    client.mutate({
      mutation: TRACK_QUESTION,
      variables: { questionId },
    });
  }

  renderTopicsList(topics) {
    return topics.map(topic => (
      <Link key={topic._id} className="topics-list-item" to={`/topic/${topic.name}/questions`}>
        {topic.name}
      </Link>
    ));
  }

  renderPencil(question, currentUserId) {
    if (question.user._id === currentUserId) {
      return (
        <div className="edit-topics" onClick={this.toggleTopicModal}>
          <i className="fas fa-pencil-alt"></i>
        </div>
      );
    }
    return null;
  }

  renderQuestionTitle(question) {
    if (this.props.fromTopicQuesitons) {
      return (
        <Link to={`/q/${question._id}`}>
          <h1>{question.question}</h1>
        </Link>
      );
    } else {
      return <h1>{question.question}</h1>;
    }
  }

  renderAnswers(answers) {
    if (this.state.showMoreAnswers || !this.props.fromTopicQuesitons) {
      return answers;
    } else {
      return answers[0];
    }
  }

  renderShowAnswersButton(answersLength) {
    if (answersLength && this.props.fromTopicQuesitons) {
      return (
        <button className="answers-toggle" onClick={this.toggleShowMoreAnswers}>
          {this.state.showMoreAnswers ? "Show Less Answers" : "Show More Answers"}
        </button>
      );
    }
    return null;
  }

  toggleShowMoreAnswers() {
    this.setState({ showMoreAnswers: !this.state.showMoreAnswers });
  }

  containerClassName() {
    return this.props.fromTopicQuesitons ? "feed-item" : "";
  }

  feedItemClassName() {
    return this.props.fromTopicQuesitons ? "topics-feed-question" : "qns-container";
  }

  render() {
    return (
      <ApolloConsumer>
        {client => {
          const { question, loading, error, currentUser } = this.state;

          if (!question && !loading) {
            // Fetch question
            client
              .query({
                query: FETCH_QUESTION,
                variables: { id: this.props.match.params.id || this.props.id },
              })
              .then(result => this.setState({ question: result.data.question, loading: false }))
              .catch(err => this.setState({ error: err, loading: false }));

            // Fetch current user
            client
              .query({
                query: CURRENT_USER,
                variables: { token: localStorage.getItem("auth-token") },
              })
              .then(result => this.setState({ currentUser: result.data.currentUser }))
              .catch(() => {});
            return <p>Loading...</p>;
          }

          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;

          const answers = question.answers.map(answer => (
            <AnswerItem key={answer._id} answer={answer} questionId={question._id} />
          ));

          const trackedQuestions = currentUser?.trackedQuestions || [];
          const currentUserId = localStorage.getItem("currentUserId");

          return (
            <div className={this.containerClassName()}>
              <Modal onClose={this.toggleTopicModal} show={this.state.show} checked={question.topics} question={question} />
              <div className="topics-list-container">
                {this.renderTopicsList(question.topics)}
                {this.renderPencil(question, currentUserId)}
              </div>
              <div className={this.feedItemClassName()}>
                {this.renderQuestionTitle(question)}
                <div className="qns-actions">
                  <div className="qns-answer" onClick={this.toggleForm}>
                    <i className="far fa-angry"></i>
                    <span>Quarrel</span>
                  </div>
                  <div
                    className="qns-follow"
                    id={trackedQuestions.some(t => t._id === question._id) ? "qns-followed" : null}
                    onClick={e => this.track(e, client, question._id)}
                  >
                    <i className="fas fa-user-secret"></i>
                    <span>Tracked</span>
                  </div>
                </div>
                {this.state.showForm && <AnswerForm toggleForm={this.toggleForm} questionId={question._id} />}
                <h2>{this.numAnswers(question)}</h2>
                {this.renderAnswers(answers)}
                <div className="answers-toggle-container">{this.renderShowAnswersButton(answers.length)}</div>
              </div>
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default withRouter(QuestionShow);