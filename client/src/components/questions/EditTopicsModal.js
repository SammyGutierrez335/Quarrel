import React from "react";
import { Mutation, Query } from '../../util/ApolloCompat';
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
const { FETCH_TOPICS } = Queries
const { ADD_TOPICS_TO_QUESTION} = Mutations
export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: props.question._id,
      topics: [],
      checked: {}
    }
    this.handleTopicSubmit = this.handleTopicSubmit.bind(this);
    this.updateTopic = this.updateTopic.bind(this);
  }


  handleTopicSubmit(e, addTopicsToQuestion) {
    e.preventDefault()
    let topics = this.state.topics;
    addTopicsToQuestion({ variables: { topics: topics, questionId: this.state.questionId} })
    this.onClose()
  }


  updateTopic(e) {
    let topicId = e.currentTarget.value;
    let dup = [...this.state.topics]
    dup.push(topicId)

    let trueState = Object.assign({}, this.state.checked, { [topicId]: true })
    let falseState = Object.assign({}, this.state.checked, { [topicId]: false })
    if (this.state.topics.includes(topicId)) {
      this.setState({ topics: this.state.topics.filter(topic => topic !== topicId), checked: falseState })
    } else {
      this.setState({ topics: dup, checked: trueState })
    }
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="modal-background" onClick={this.onClose}>
        <div className="topics-modal" onClick={e => e.stopPropagation()}>
          <Mutation
            mutation={ADD_TOPICS_TO_QUESTION}
            onError={err => this.setState({ message: err.message })}
            update={(cache,data) => this.updateCache(cache, data)}
            onCompleted={data => {
              this.setState({
                showTopicModal: false
              })
            }}
          >
            {(addTopicsToQuestion) => (
              <div className="topics-modal">
                <div className="topics-modal-header">
                  {this.state.successfulQuestion}
                </div>
                <div className="topics-modal-instructions">
                  Edit topics that best describe your question
                                    </div>
                <form onSubmit={e => this.handleTopicSubmit(e, addTopicsToQuestion)}>
                  <div className="topics-modal-body">
                    <Query query={FETCH_TOPICS} >
                      {({ loading, error, data }) => {
                        if (loading) return "loading...";
                        if (error) return `Error! ${error.message}`;
                        return data.topics.map(topic => {
                          return (
                            <div className="topics-modal-topic-container">
                              <input type="checkbox"
                                name={topic.name}
                                value={topic._id}
                                onChange={this.updateTopic}
                                checked={this.state.checked[topic._id]}
                              />
                              <img className="topic-modal-icon" src={topic.imageUrl} alt="" />
                              <label hmtlfor={topic.name}>{topic.name}</label>
                            </div>
                          )
                        })
                      }}
                    </Query>
                  </div>
                  <div className="add-question-modal-footer">
                    <button className="cancel-button" onClick={this.onClose}>Cancel</button>
                    <button className="add-button" type="submit">Edit Topics</button>
                  </div>
                </form>
              </div>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
  onClose = e => {
    this.props.onClose(e);
  };
}