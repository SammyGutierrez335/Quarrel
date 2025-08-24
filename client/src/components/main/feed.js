import React from 'react';
import { ApolloConsumer } from '@apollo/client';
import Queries from "../../graphql/queries";
import FeedItem from "./feed_item";

const { FETCH_QUESTIONS } = Queries;

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchQuestions();
    }

    fetchQuestions() {
        this.props.client
            .query({ query: FETCH_QUESTIONS })
            .then(result => {
                this.setState({ questions: result.data.questions || [], loading: false });
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            });
    }

    render() {
        const { questions, loading, error } = this.state;

        if (loading) return <ul className="feed-container"><li>Loading...</li></ul>;
        if (error) return <ul className="feed-container"><li>{`Error! ${error.message}`}</li></ul>;
        if (!questions.length) return <ul className="feed-container"><li>No questions available.</li></ul>;

        return (
            <ul className="feed-container">
                {questions.map(question => (
                    <FeedItem
                        key={question._id}
                        question={question}
                        noAnswerYet={this.props.noAnswerYet}
                    />
                ))}
            </ul>
        );
    }
}

// Wrap with ApolloConsumer to get the client in props
export default function FeedWithClient(props) {
    return (
        <ApolloConsumer>
            {client => <Feed {...props} client={client} />}
        </ApolloConsumer>
    );
}
