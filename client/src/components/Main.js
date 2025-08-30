import React from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./navigation/NavBar";
import TopicsShow from "./topics/TopicsShow"
import TopicQuestions from "./topics/TopicQuestions"
import SideBar from "./navigation/SideBar"
import RightSideBar from "./navigation/RightSideBar";
import SearchResults from "./search/SearchResults";
import QuestionsForYou from "./answers_tab/questionsForYou";
import QuestionsYouAnswered from "./answers_tab/questionsYouAnswered";
import MainFeedContainer from "./main/main_feed_container";

const Main = () => {
    return (
        <div className="main">
            <NavBar />
            <div className="main-body">
                <Route path="/" component={SideBar} />
                <Switch>
                    <Route exact path="/" component={MainFeedContainer} />
                    <Route exact path="/topics" component={TopicsShow} />
                    <Route exact path="/topic/:name/questions" component={TopicQuestions} />
                    <Route exact path="/search/:query" component={SearchResults} />
                    <Route exact path="/answer" component={QuestionsForYou} />
                    <Route exact path="/answered" component={QuestionsYouAnswered} />
                </Switch>
                <Route path="/" component={RightSideBar} />
            </div>
        </div>
    )
};

export default Main;