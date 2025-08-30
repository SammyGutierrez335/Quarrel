import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import TopicHeader from "./TopicHeader";
import QuestionShow from "../questions/QuestionShow";
import Queries from "../../graphql/queries";
const { FETCH_TOPIC_BY_NAME } = Queries;

const TopicQuestions = () => {
  const { name } = useParams();
  const { loading, error, data } = useQuery(FETCH_TOPIC_BY_NAME, {
    variables: { name },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;
  
  const topic = data.topic_by_name;
  if (!topic) return <p>No topic found.</p>;
  
  return (
    <div>
      <TopicHeader key={topic._id} topic={topic} name={topic.name} />
      <div className="feed-container">
        {topic.questions.map((question) => (
          <QuestionShow
            key={question._id}
            fromTopicQuestions={true}
            id={question._id}
            question={question}
            name={question.question}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicQuestions;