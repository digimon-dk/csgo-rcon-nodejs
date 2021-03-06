import {h, Component} from 'preact';
import { Link } from 'preact-router/match';
import { connect } from "unistore/preact";

import Details from "./icons/Details";
import Edit from "./icons/Edit";

import storage from "../modules/storage";
import {statusResolver} from "../utils/Strings";

class Home extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        if(storage.get("filters") === null) {
            storage.set("filters", {
                notStarted: true,
                running: true,
                completed: true,
                archived: false
            });
        }

        this.state = {
            match_groups: {},
            filters: {
                notStarted: storage.get("filters").notStarted,
                running: storage.get("filters").running,
                completed: storage.get("filters").completed,
                archived: storage.get("filters").archived
            }
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = `Home | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
                "url": false
            }
        ]);

        this.splitMatchesToGroups();
    }

    /**
     * Runs when the component updates
     *
     * @param previousProps
     */
    componentDidUpdate(previousProps) {
        if(previousProps !== this.props) {
            this.setState({
                match_groups: {}
            });

            this.splitMatchesToGroups();
        }
    }

    /**
     * Splits the matches by group
     */
    splitMatchesToGroups() {
        let matchGroups = this.state.match_groups;

        for(let item = 0; item < this.props.matches.length; item++) {
            const match = this.props.matches[item];

            if(!this.state.match_groups[match.match_group]) {
                matchGroups[match.match_group] = [];
            }

            matchGroups[match.match_group].push(match);
        }

        this.setState({
            match_groups: matchGroups
        });
    }

    /**
     * Toggle the Not Started filter
     */
    toggleNotStarted() {
        this.setState({
            filters: {
                notStarted: !this.state.filters.notStarted,
                running: this.state.filters.running,
                completed: this.state.filters.completed,
                archived: this.state.filters.archived
            }
        });

        storage.set("filters", {
            notStarted: this.state.filters.notStarted,
            running: this.state.filters.running,
            completed: this.state.filters.completed,
            archived: this.state.filters.archived
        });
    }

    /**
     * Toggle the Running filter
     */
    toggleRunning() {
        this.setState({
            filters: {
                notStarted: this.state.filters.notStarted,
                running: !this.state.filters.running,
                completed: this.state.filters.completed,
                archived: this.state.filters.archived
            }
        });

        storage.set("filters", {
            notStarted: this.state.filters.notStarted,
            running: this.state.filters.running,
            completed: this.state.filters.completed,
            archived: this.state.filters.archived
        });
    }

    /**
     * Toggle the Completed filter
     */
    toggleCompleted() {
        this.setState({
            filters: {
                notStarted: this.state.filters.notStarted,
                running: this.state.filters.running,
                completed: !this.state.filters.completed,
                archived: this.state.filters.archived
            }
        });

        storage.set("filters", {
            notStarted: this.state.filters.notStarted,
            running: this.state.filters.running,
            completed: this.state.filters.completed,
            archived: this.state.filters.archived
        });
    }

    /**
     * Toggle the Archived filter
     */
    toggleArchived() {
        this.setState({
            filters: {
                notStarted: this.state.filters.notStarted,
                running: this.state.filters.running,
                completed: this.state.filters.completed,
                archived: !this.state.filters.archived
            }
        });

        storage.set("filters", {
            notStarted: this.state.filters.notStarted,
            running: this.state.filters.running,
            completed: this.state.filters.completed,
            archived: this.state.filters.archived
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>Matches</h3>

                <div className="filters">
                    <span>Filters:</span>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="not-started" onClick={() => this.toggleNotStarted()} checked={this.state.filters.notStarted} />
                        <label className="custom-control-label" htmlFor="not-started">Not started</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="running" onClick={() => this.toggleRunning()} checked={this.state.filters.running} />
                        <label className="custom-control-label" htmlFor="running">Running</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="completed" onClick={() => this.toggleCompleted()} checked={this.state.filters.completed} />
                        <label className="custom-control-label" htmlFor="completed">Completed</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="archived" onClick={() => this.toggleArchived()} checked={this.state.filters.archived} />
                        <label className="custom-control-label" htmlFor="archived">Archived</label>
                    </div>
                </div>
                {Object.keys(this.state.match_groups).map((group, index) => (
                    <div key={index}>
                        <h4>{group}</h4>
                        {this.renderGroup(this.state.match_groups[group])}
                    </div>
                ))}
            </div>
        );
    }

    /**
     * Renders a group with matches
     *
     * @param matches
     * @return {*}
     */
    renderGroup(matches) {
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Server</th>
                            <th>Map</th>
                            <th>Team 1</th>
                            <th>Team 2</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match, index) => {
                            if((this.state.filters.notStarted && match.status === 0) || (this.state.filters.running && (match.status > 0 && match.status < 99)) || (this.state.filters.completed && match.status === 99) || (this.state.filters.archived && match.status > 99)) {
                                return (
                                    <tr key={index}>
                                        <td>{match.server}</td>
                                        <td>{match.map}</td>
                                        <td>{match.team1.name}</td>
                                        <td>{match.team2.name}</td>
                                        <td>{`${statusResolver(match.status)} (${match.status})`}</td>
                                        <td>
                                            <Link href={`/match/${match.id}/edit`} title="Edit match">
                                                <Edit/>
                                            </Link>
                                            &nbsp;&nbsp;
                                            <Link href={`/match/${match.id}`} title="Match details">
                                                <Details/>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

/**
 * Connect the store to the component
 */
export default connect('servers,matches')(Home);
