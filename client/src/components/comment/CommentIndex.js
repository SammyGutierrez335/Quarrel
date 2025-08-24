import React from "react";
// import { Query } from '../../util/ApolloCompat';
// import Queries from "../../graphql/queries";
// import { Link } from "react-router-dom";
import moment from "moment";
import CommentForm from "./CommentForm";
import DislikeComment from "./DislikeComment";
import ProfileIcon from "../customization/ProfileIcon";
// const { FETCH_COMMENTS, FETCH_ANSWER } = Queries;

class CommentIndex extends React.Component {
    constructor(props) {
				super(props);
				this.state = {
					showForm: this.props.showForm,
					showCommentForm: true,
					showCommentButton: false,
				}
				this.closeCommentForm = this.closeCommentForm.bind(this);
		}

	componentDidMount()
	{
		// document.addEventListener('DOMContentLoaded', () => {
		const input = document.getElementById('comment-input');
		const button = document.getElementById('comment-submit-button');
		input.addEventListener('click', this.showButton);

		// });
		// document.addEventListener('click', showButton);
	}

	componentWillUnmount()
	{
		const input = document.getElementById('comment-input');
		input.removeEventListener('click', this.showButton);
	}
		
		handleDelete(e, deleteComment)
		{
			e.preventDefault();
			deleteComment({
				variables: {
					commentId: this.state.commentId,
					// answerId: this.state.answerId
				}
			})
		}

		closeCommentForm(e) {
			e.preventDefault();
			this.setState({showCommentForm: false, showCommentButton: false});
		}

    render() {
			window.addEventListener('DOMContentLoaded', function ()	{
				let input = document.getElementById('comment-input');
				let button = document.getElementById('comment-submit-button');

				input.addEventListener('focus', function () {
					button.style.display = "inline-block"
				}, true);
				input.addEventListener('blur', function () {
					button.style.display = "none"
				}, true);
			}, false);

        return (
            <div className="">
								<div className="">
									{/* {this.state.showCommentForm ? <CommentForm closeCommentForm={this.closeCommentForm} answerId={this.props.answerId} questionId={this.props.questionId} /> : null} */}
									<CommentForm answerId={this.props.answerId} questionId={this.props.questionId} />
								</div>
                {this.props.comments.map(comment => (
                    <div key={comment._id} className="comment-item-container">
                        <div className="comment-item-header">
														<div className="comment-item-user-icon">
															<ProfileIcon
																profileUrl={comment.user.profileUrl}
																fname={comment.user.fname}
																size={40}
																fsize={18}
															/>
														</div>
                            <div className="comment-item-user-info">{comment.user.fname} {comment.user.lname}
							<p className="comment-item-date">
								{moment(new Date(parseInt(comment.date)), "YYYY-MM-DD").fromNow()}
							</p>
														</div>
                        </div>

                        <div className="comment-item-content">
														{comment.comment}
                        </div>

                        <div className="comment-item-footer">
                            {/* <div className="comment-item-icon">
                                <i className="fas fa-reply"></i>
                            </div>
                            <div className="comment-item-text">Reply</div> */}
                            
														<DislikeComment comment={comment} questionId={this.props.questionId} />

                        </div>
                    </div>
                ))}
            </div>
        )
    }
};

export default CommentIndex;