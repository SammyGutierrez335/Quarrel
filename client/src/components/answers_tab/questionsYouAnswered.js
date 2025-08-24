import React from "react";
import { ApolloConsumer } from "@apollo/client";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
import AnswerItem from "../answer/AnswerItem";

const { ANSWERS_BY_USER } = Queries;

class QuestionsYouAnswered extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      loading: true,
      error: null,
    };
  }

  removeHTMLTags(str) {
    const pattern = /<.*?>|&nbsp;/;
    str = str.split(pattern).join(" ");
    return str;
  }

  fetchAnswers(client) {
    const userId = localStorage.getItem("currentUserId");
    client
      .query({ query: ANSWERS_BY_USER, variables: { userId } })
      .then(({ data }) => {
        this.setState({ answers: data.answersByUser, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  render() {
    const { answers, loading, error } = this.state;

    return (
      <ApolloConsumer>
        {(client) => {
          if (loading && !error && answers.length === 0) {
            this.fetchAnswers(client);
          }

          return (
            <div className="answers-tab-results">
              <div className="answers-tab-header">
                <div className="answer-tab unselected left-tab">
                  <Link to="/answer">Questions for you</Link>
                </div>
                <div className="answer-tab selected right-tab">
                  <Link to="/answered">Questions you answered</Link>
                </div>
              </div>

              {loading && <p>Loading...</p>}
              {error && <p>Error: {error.message}</p>}
              {!loading && !error && answers.length === 0 && (
                <li key={0} id="no-results" className="feed-item">
                  You haven't answered any questions yet.
                </li>
              )}

              {!loading && !error && answers.length > 0 && (
                <ul className="feed-container">
                  {answers.map((match) => (
                    <li
                      key={match.question._id}
                      className="questions-you-answered-item"
                    >
                      <Link to={`/q/${match.question._id}`}>
                        <div className="answers-tab-question">
                          {match.question.question}
                        </div>
                      </Link>
                      <AnswerItem
                        key={match._id}
                        answer={match}
                        questionId={match.question._id}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default QuestionsYouAnswered;