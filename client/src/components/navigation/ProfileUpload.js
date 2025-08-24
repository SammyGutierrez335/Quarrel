import React from 'react';
import axios from 'axios';
import { Mutation } from '../../util/ApolloCompat';
import Mutations from "../../graphql/mutations";
const { UPDATE_PROFILE_PIC } = Mutations;

class ProfileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        }
        this.handleFile = this.handleFile.bind(this);
    }

    handleFile(e) {
       this.setState({file: e.target.files[0]});
    }

    handleUpdate(e, updateProfilePic) {
        e.preventDefault();
        if (!this.state.file) return null;
        const fd = new FormData();
        fd.append('image', this.state.file, this.state.file.name)
        axios.post('/api/upload', fd)
            .then(res => {
                console.log(res);
                updateProfilePic({
                    variables: {
                        profileUrl: res.data.imageUrl
                    }
                }).catch(err => console.log(err));
            })
    }

    render() {
        return (
            <Mutation
                mutation={UPDATE_PROFILE_PIC}

            >
                {updateProfilePic => {
                    return (
                        <div>
                            <input type="file" onChange={this.handleFile} />
                            <button onClick={e => this.handleUpdate(e, updateProfilePic)}>Submit</button>
                        </div>
                    )
                }}

            </Mutation>
        )
    }
}

export default ProfileUpload;