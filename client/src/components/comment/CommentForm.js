import React, { Fragment } from "react";
import { ApolloConsumer, useApolloClient } from "@apollo/client";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
import ProfileIcon from "../customization/ProfileIcon";

const { NEW_COMMENT } = Mutations;
const { CURRENT_USER, FETCH_QUESTION } = Queries;

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answerId: this.props.answerId,
      comment: "",
      showCommentForm: this.props.showCommentForm,
      showCommentButton: false,
      currentUser: null,
    };
    this.update = this.update.bind(this);
    this.closeCommentForm = this.closeCommentForm.bind(this);
  }

  componentDidMount() {
    const input = document.getElementById("comment-input");
    if (input) input.addEventListener("click", this.showButton);
  }

  componentWillUnmount() {
    const input = document.getElementById("comment-input");
    if (input) input.removeEventListener("click", this.showButton);
  }

  update(field) {
    return (e) => {
      this.setState({ [field]: e.target.value });
    };
  }

  updateCache(cache, { data: { newComment } }) {
    let question;
    try {
      question = cache.readQuery({
        query: FETCH_QUESTION,
        variables: { id: this.props.questionId },
      }).question;
    } catch (err) {
      console.log(err);
    }
    if (question) {
      question.answers.forEach((answer) => {
        if (answer._id === newComment.answer._id) {
          answer.comments = answer.comments.concat(newComment);
        }
      });
      cache.writeQuery({
        query: FETCH_QUESTION,
        data: { question: question },
      });
    }
  }

  handleSubmit(client) {
    const { comment, answerId } = this.state;
    client
      .mutate({
        mutation: NEW_COMMENT,
        variables: { comment, answerId },
        update: (cache, data) => this.updateCache(cache, data),
      })
      .then(() => {
        this.setState({
          comment: "",
          showCommentForm: false,
          showCommentButton: false,
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { comment } = this.state;

    return (
      <ApolloConsumer>
        {(client) => (
          <div className="comment-form-container">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmit(client);
              }}
              className="comment-form"
            >
              <div className="comment-item-user-icon">
                {this.state.currentUser ? (
                  <ProfileIcon
                    profileUrl={this.state.currentUser.profileUrl}
                    fname={this.state.currentUser.fname}
                    size={40}
                    fsize={18}
                  />
                ) : (
                  <ApolloConsumer>
                    {(client) => {
                      client
                        .query({
                          query: CURRENT_USER,
                          variables: { token: localStorage.getItem("auth-token") },
                        })
                        .then(({ data }) =>
                          this.setState({ currentUser: data.currentUser })
                        )
                        .catch((err) => console.error(err));
                      return null;
                    }}
                  </ApolloConsumer>
                )}
              </div>

              <div className="comment-form-input-box">
                <input
                  type="text"
                  onChange={this.update("comment")}
                  value={comment}
                  placeholder="Add a comment..."
                  className="comment-form-input"
                  id="comment-input"
                />
              </div>

              <input
                type="submit"
                className="comment-form-button"
                id="comment-submit-button"
                value="Add Comment"
              />
            </form>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default CommentForm;
