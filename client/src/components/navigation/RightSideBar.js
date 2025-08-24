import React from 'react';

class RightSideBar extends React.Component {
    constructor(props) {
        super(props);
    
    }

    shuffle(arr) {
        let shuffled = [];
        while (arr.length > 0) {
            let randomIdx = Math.floor(Math.random() * arr.length);
            shuffled.push(arr[randomIdx])
            arr.splice(randomIdx, 1);
        }
        return shuffled;
     
    }

    render() {
        
        const kevin = {
            name: "Kevin Lu",
            git: "http://github.com/kluaa",
            linkedIn: "https://www.linkedin.com/in/kevin-lu-96b294191/",
        }

        const javier = {
            name: "Javier Ortiz",
            git: "https://github.com/javiermortiz",
            linkedIn: "https://www.linkedin.com/in/javiermortiz/",
        }

        const sammy = {
            name: "Sammy Gutierrez",
            git: "https://github.com/SammyGutierrez335",
            linkedIn: "https://www.linkedin.com/in/sammy-gutierrez/",
            portfolio: "https://sammygutierrez335.github.io/Portfolio/",
        }

        const members = [ sammy, kevin, javier ];

        const links = members.map(member => {
       
            return (
                <ul className="rsb-member">
                    <span className="member-name">{member.name}</span>
                   { member.git && <li>
                        <i className="fab fa-github-square"></i>
                        <a href={member.git}>Github</a>
                   </li> }
                   { member.linkedIn && <li>
                        <i className="fab fa-linkedin"></i>
                        <a href={member.linkedIn}>LinkedIn</a>
                   </li> }
                   { member.portfolio && <li>
                        <i className="fas fa-folder"></i>
                        <a href={member.portfolio}>Portfolio</a>
                   </li> }
                </ul>
            )
        })

        return (
            <div className="rsb-container">
                {links}
            </div>
        )
    }
}

export default RightSideBar;