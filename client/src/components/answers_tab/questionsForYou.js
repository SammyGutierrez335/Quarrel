import React from "react";
import { Link } from "react-router-dom";
import { ApolloConsumer } from "@apollo/client";
import Queries from "../../graphql/queries";
import Feed from "../main/feed";

const { UNANSWERED_QUESTIONS } = Queries;

class QuestionsForYou extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      loading: true,
      error: null,
    };
  }

  fetchQuestions(client) {
    client
      .query({ query: UNANSWERED_QUESTIONS })
      .then(({ data }) => {
        this.setState({ questions: data.unansweredQuestions, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  render() {
    const { questions, loading, error } = this.state;

    return (
      <ApolloConsumer>
        {(client) => {
          if (loading && !error && questions.length === 0) {
            this.fetchQuestions(client);
          }

          return (
            <div className="answers-tab-results">
              <div className="answers-tab-header">
                <div className="answer-tab selected left-tab">
                  <Link to="/answer">Questions for you</Link>
                </div>
                <div className="answer-tab unselected right-tab">
                  <Link to="/answered">Questions you answered</Link>
                </div>
              </div>

              {loading && <p>Loading...</p>}
              {error && <p>Error: {error.message}</p>}

              {!loading && !error && questions.length === 0 && (
                <p>
                  We don't have any questions for you at the moment. Check later
                  for questions to answer.
                </p>
              )}

              {!loading && !error && questions.length > 0 && (
                <ul className="search-results-list">
                  {questions.map((q) => (
                    <Link key={q._id} to={`/q/${q._id}`}>
                      <li>
                        <div className="search-results-match">{q.question}</div>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}

              <Feed noAnswerYet={true} />
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default QuestionsForYou;
