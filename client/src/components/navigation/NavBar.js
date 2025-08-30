import React from 'react';
import { Link, withRouter } from "react-router-dom";
import Queries from "../../graphql/queries";
import { Query } from '../../util/ApolloCompat';import SearchBar from "./SearchBar";
import QuestionForm from "../questions/QuestionForm";

import ProfileIcon from "../customization/ProfileIcon";
import OptionsMenu from "./OptionsMenu";
import ReactDOM from "react-dom";
const { CURRENT_USER } = Queries;

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            isLoggedIn: "",
            client: "",
            showModal: false,
            searchFocus: "",
            showOptions: false,
            selected: { ["/"]: "", ["/answer"]: "", ["/topics"]: "" }
        };
        this.handleModal = this.handleModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleOptions = this.toggleOptions.bind(this);
        this.closeOptions = this.closeOptions.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        let oldLocation = prevProps.location.pathname;
        let newLocation = this.props.location.pathname;
        if (oldLocation !== newLocation) {
            this.setState({ selected: { [newLocation]: "selected" }})
        }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    logout(client) {
        return (
            <div>
                <button
                    className="nav-ask-btn"
                    onClick={e => {
                        e.preventDefault();
                        localStorage.removeItem("auth-token");
                        client.writeData({ data: { isLoggedIn: false } });
                        this.props.history.push("/logout");
                    }}
                >
                    Logout
            </button>
            </div>
        )
    }

    handleModal(e) {
        e.preventDefault();
        this.setState({ showModal: !this.state.showModal });
    }

    openModal(e) {
        e.preventDefault();
        this.setState({ showOptions: false, showModal: true, searchFocus: "search-focus" });
    }

    closeModal(e) {
        e.preventDefault();
        this.setState({ showModal: false, searchFocus: "" });
    }

    toggleOptions(e) {
        e.stopPropagation();
        if (!this.state.showModal) this.setState({ showOptions: !this.state.showOptions });
    }

    closeOptions() {
        this.setState({ showOptions: false });
    }

    handleClick(e) {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(e.target)) {
            this.setState({
                showOptions: false
            });
        }
    }

    render() {
        const token = localStorage.getItem("auth-token")
        return (
            <div className="nav-container">
                <div className="nav-content">
                    <div className="nav-logo" onClick={this.closeModal}>
                        <Link to="/">Quarrel</Link>
                    </div>
                    <ul className="nav-links" onClick={this.closeModal}>
                        <Link to="/">
                            <li className={`nav-home ${this.state.selected["/"]}`}>
                                <i className="far fa-list-alt"></i>
                                <span>Home</span>
                            </li>
                        </Link>
                        <Link to="/answer">
                            <li className={`nav-answer ${this.state.selected["/answer"]}`}>
                                <i className="far fa-edit"></i>
                                <span>Answer</span>
                            </li>
                        </Link>
                        <Link to="/topics">
                            <li className={`nav-topics ${this.state.selected["/topics"]}`}>
                                <i className="far fa-comments"></i>
                                <span>Topics</span>
                            </li>
                        </Link>
                    </ul>
                    <SearchBar
                        openModal={this.openModal}
                        closeModal={this.closeModal}
                        showModal={this.state.showModal}
                        searchFocus={this.state.searchFocus}
                    />

                    <Query
                        query={CURRENT_USER}
                        variables={{ token: token }}
                    >
                        {({ loading, error, data }) => {
                            if (loading) return null;
                            if (error) return null;
                            if (data.currentUser.profileUrl) {
                                return (
                                    <div className="nav-relative">
                                        <div className="nav-usericon"
                                            onClick={this.toggleOptions}>
                                            <ProfileIcon
                                                profileUrl={data.currentUser.profileUrl}
                                                fname={data.currentUser.fname}
                                                size={24}
                                                fsize={12}
                                            />
                                        </div>
                                        {this.state.showOptions && !this.state.showModal ? <div className="nav-options-menu">
                                            <OptionsMenu closeOptions={this.closeOptions} />
                                        </div> : null}
                                    </div>
                                )
                            }
                        }}
                    </Query>


                    <QuestionForm closeSearchModal={this.closeModal} button={true} />
                    {/* <SigninButton /> */}
                    {/* <ProfileUpload /> */}
                </div>
                {this.state.showModal && <div className="search-modal-background" onClick={this.closeModal}></div>}
            </div>

        );
    }
}

export default withRouter(NavBar);