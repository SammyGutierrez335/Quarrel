import React from "react";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
import { Mutation } from '../../util/ApolloCompat';
import { FaArrowUp } from "react-icons/fa";
const { DISLIKE_COMMENT, DELETE_DISLIKE } = Mutations;
const { FETCH_QUESTION } = Queries;

class DislikeComment extends React.Component {
	constructor(props) {
		super(props);
		this.state= { message: "" }
	}

	handleDislike(e, dislikeComment) {
		e.preventDefault();
		dislikeComment({
			variables: {commentId: this.props.comment._id}
		})
	}

	handleUndislike(e, deleteDislike) {
		e.preventDefault();
		deleteDislike({
			variables: {commentId: this.props.comment._id}
		})
	}

	updateCache(cache, { data }) {
		let question;
		try {
			question = cache.readQuery({
				query: FETCH_QUESTION,
				variables: { id: this.props.questionId }
			}).question;
		} catch (err) {
			console.log(err);
		}
		if (question) {
			console.log(question);
			cache.writeQuery({
				query: FETCH_QUESTION,
				data: { question: question }
			});
		}
	}

	render() {
		const userIds = this.props.comment.dislikes.map(dislike => {
			return dislike.user._id;
		})

		if (userIds.includes(localStorage.getItem("currentUserId"))) {
			return (
				<div className="">
					<Mutation
						mutation={DELETE_DISLIKE}
						onError={err => this.setState({ message: err.message })}
						update={(cache, data) => this.updateCache(cache, data)}
						onCompleted={data => {
							// const { answer } = data.deleteDislike;
							this.setState({ message: "" });
						}}
					>
						{(deleteDislike, { data }) => (
							<div className="comment-disliked" onClick={e => this.handleUndislike(e, deleteDislike)}>
								<div className="comment-item-icon"><FaArrowUp /></div>
								<div className="comment-disliked-text">Upvote {this.props.comment.dislikes.length}</div>
							</div>
						)}
					</Mutation>
				</div>
			)
		} else {
			return (
				<div className="comment-dislike">
					<Mutation
						mutation={DISLIKE_COMMENT}
						onError={err => this.setState({ message: err.message })}
						update={(cache, data) => this.updateCache(cache, data)}
						onCompleted={data => {
							// const {answer} = data.dislikeComment;
						}}
					>
						{(dislikeComment, { data }) => (
							<div className="comment-dislike" onClick={e => this.handleDislike(e, dislikeComment)}>
								<div className="comment-item-icon"><FaArrowUp /></div>
								<div className="comment-item-text">Upvote {this.props.comment.dislikes.length}</div>
								
							</div>
						)}
					</Mutation>
				</div>
			)
		}
	}
};

export default DislikeComment;