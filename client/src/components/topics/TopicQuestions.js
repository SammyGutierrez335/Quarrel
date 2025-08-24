import React from "react";
import TopicHeader from "./TopicHeader"
import QuestionShow from "../questions/QuestionShow"
import { Query } from '../../util/ApolloCompat';
import Queries from "../../graphql/queries";
const { FETCH_TOPIC_BY_NAME } = Queries;

class TopicQuestions extends React.Component {

  render() {
    return (
        <Query
          query={FETCH_TOPIC_BY_NAME}
          variables={{ name: this.props.match.params.name }}
          >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            let topic = data.topic_by_name
            return <div >
              <TopicHeader key={topic._id} topic={topic} name={topic.name} />
            <div className="feed-container">


                {topic.questions.map(question => {
                  
                  return <QuestionShow key={question._id} fromTopicQuesitons={true} id={question._id} question={question} name={question.name} />
                }
                )}

                </div>
            </div>
          }}
        </Query>
    );
  }
}

export default TopicQuestions;