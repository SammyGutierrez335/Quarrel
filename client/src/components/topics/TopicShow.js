// import React from "react";
// import TopicHeader from "./TopicHeader"
// import { Query } from '../../util/ApolloCompat';
// import Queries from "../../graphql/queries";
// const { FETCH_TOPIC_BY_NAME } = Queries;

// class TopicShow extends React.Component {

//   render() {
//     return (
//       < div >
//         <Query
//           query={FETCH_TOPIC_BY_NAME}
//           variables={{ name: this.props.match.params.name }}
//         >
//           {({ loading, error, data }) => {
//             if (loading) return "Loading...";
//             if (error) return `Error! ${error.message}`;
//             data.topic_by_name.map(topic => {
//             return <div>
//               <TopicHeader key={topic._id} topic={topic} name={topic.name} />
//             </div>
//             })
//           }}
//         </Query>
//       </div >

//     );
//   }
// }

// export default TopicShow;