import React, { Component, PropTypes } from 'react';
import { ScrollView,View,Text} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { fetchMediaFavorites } from './../../actions/Media/favorites';
import { followUser } from './../../actions/User/user';
import UserList from './../../components/User/UserList';
import LoadingIndicator from './../../components/LoadingIndicator';

class MediaFavorites extends Component {

  static propTypes = {
    mediaID : PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchMediaFavorites(this.props.mediaID));
  }

  loadUser(user) {
    Actions.userScene({
      title:user.name,
      userID:user.id
    });
  }

  loadMore() {
    this.props.dispatch(fetchMediaFavorites(this.props.mediaID));
  }

  followUser(user) {
    this.props.dispatch(followUser(this.props.userReducer.authUserID,user.id));
  }

  render() {

    const {users,userReducer} = this.props;
    return (
      <ScrollView contentContainerStyle={{top:64}}>
        <UserList
          users={users}
          loadUser={this.loadUser.bind(this)}
          followUser={this.followUser.bind(this)}
          authUserID={userReducer.authUserID ? userReducer.authUserID : 0 }
        />
        <View>
          <Text onPress={()=>this.loadMore()}>load more</Text>
        </View>
      </ScrollView>
    )
  }
}

//function makeMapStateToProps(initialState, initialOwnProps) {
//

  function mapStateToProps(state,props) {
    const mediaID = props.mediaID;

    const {mediaReducer,userReducer } = state;
    //const {
    //  pagination: { starredByUser },
    //  entities: { users, repos }
    //  } = state
    const {
      pagination: { mediaFavorites },
      entities: { users }
      } = state;

    console.log('paginatoin',state.pagination);

    const favoritedPagination = mediaFavorites[mediaID] || { ids: []};
    const favoritedUsers = favoritedPagination.ids.map(id => users[id]);

    return {
      users: favoritedUsers,
      isFetching: mediaReducer.favorites.isFetching,
      userReducer
    }
  }
//}
export default connect(mapStateToProps)(MediaFavorites);
