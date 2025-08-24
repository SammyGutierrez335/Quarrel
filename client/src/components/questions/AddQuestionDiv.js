import React from 'react';
import Queries from "../../graphql/queries";
import { Query } from '../../util/ApolloCompat';
import ProfileIcon from "../customization/ProfileIcon";
const { CURRENT_USER } = Queries;

const AddQuestionDiv = (props) => {
    return (
        <div onClick={props.handleModal} className="add-question-div">
            <Query
                query={CURRENT_USER} variables={{ token: localStorage.getItem("auth-token") }}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`
                    return (
                        <div className="add-question-modal-user">

                            <ProfileIcon
                                size={30}
                                profileUrl={data.currentUser.profileUrl}
                                fsize={15}
                                fname={data.currentUser.fname}
                            />
                            <div className="question-modal-user-name">
                                {`${capitalize(data.currentUser.fname)} ${capitalize(data.currentUser.lname)}`}
                            </div>
                        </div>
                    )
                }}
            </Query>
            <h1>What is your question?</h1>
        </div>
    )
}

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

export default AddQuestionDiv;