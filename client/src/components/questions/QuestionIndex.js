import React from "react";
import { Query } from '../../util/ApolloCompat';
import Queries from "../../graphql/queries";
import { Link } from "react-router-dom";
const { FETCH_QUESTIONS } = Queries;


class QuestionIndex extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="question-index">
                <Query query={FETCH_QUESTIONS}>
                    {({ loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return `Error! ${error.message}`;

                        return (
                            <div>
                                {data.questions.map(question => (
                                        <div key={question._id} className="question-item">
                                            <div>
                                                <Link to={`/${question._id}`}>
                                                    {question.question}
                                                </Link>
                                            </div>
                                        </div>
                                ))}
                            </div>
                        )
                    }
                    
                    }
                </Query>
            </div>
        )
    }
};

export default QuestionIndex;