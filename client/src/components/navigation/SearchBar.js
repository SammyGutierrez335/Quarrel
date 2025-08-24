import React from 'react';
import { withRouter } from 'react-router-dom';
import Queries from "../../graphql/queries";
import { Query } from '../../util/ApolloCompat';
const { SIMILAR_QUESTIONS } = Queries;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            dataMatches: []
        };
        this.update = this.update.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    update(e) {
        this.setState({ search: e.currentTarget.value });
    }

    redirect(id) {
        return e => {
            this.props.history.push(`/q/${id}`);
            this.props.closeModal(e);
            this.setState({ search: "", dataMatches: [] });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.search.length > 0) {
            this.props.closeModal(e);
            this.props.history.push(`/search/${this.state.search.split(" ").join("-")}`);
        }
    }

    render() {
        let searchList = "";
        const searchLength = this.state.search.length;
        if (searchLength > 1) {
            searchList = (
                <Query query={SIMILAR_QUESTIONS} variables={{ question: this.state.search }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return this.state.dataMatches.map(match => {
                                return <li onClick={this.redirect(match._id)} key={match._id}>{match.question}</li>
                            })
                        }
                        if (error) return `Error! ${error.message}`;
                        if (data.similarQuestions.length) {
                            this.state.dataMatches = data.similarQuestions;
                        }
                        return this.state.dataMatches.map(match => {
                            return <li onClick={this.redirect(match._id)} key={match._id}>{match.question}</li>
                        })
                    }}
                </Query>
            )
        }
        return (
            <div className="search-wrapper">
                <div className={`search-container ${this.props.searchFocus}`} onClick={this.props.openModal}>
                    <i className="fas fa-search"></i>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            className="search"
                            type="text"
                            placeholder="Search Quarrel"
                            value={this.state.search}
                            onChange={this.update}
                        />
                    </form>
                </div>
                {
                    this.props.showModal && this.state.search.length > 0 &&
                    <ul className="search-list">
                        <div class="arrow-up-search"></div>
                        <li onClick={this.handleSubmit}><span><i className="fas fa-search"></i> Search: </span>{this.state.search}</li>
                        {searchList}
                    </ul>
                }
            </div>
        )
    }
}

export default withRouter(SearchBar);