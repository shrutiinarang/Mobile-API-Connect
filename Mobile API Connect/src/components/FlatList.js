import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const {width} = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
export default class FlatListExample extends Component {
  state = {
    text: '',
    contacts: [],
    allContacts: [],
    page: 1,
    refreshing: false,
  };
  constructor() {
    super();
    this.duringMomentum = false;
  }

  componentDidMount(): void {
    this.getContacts();
  }

  getContacts = async () => {
    this.setState({
      loading: true,
    });

    const {
      data: {results: contacts}, // results ı contacts adını al
    } = await axios.get(
      `https://randomuser.me/api?results=10&page${this.state.page}`,
    );

    const users = [...this.state.contacts, ...contacts];

    if (this.state.refreshing) {
      users.reverse();
    }
    this.setState({
      contacts: users,
      loading: false,
      allContacts: users,
      refreshing: false,
    });
  };
  onRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getContacts();
      },
    );
  };

  loadMore = () => {
    if (!this.duringMomentum) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getContacts();
        },
      );
      this.duringMomentum = false;
    }
  };

  renderContactsItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {backgroundColor: index % 2 === 0 ? 'white' : '#efefef'},
        ]}>
        <Image source={{uri: item.picture.medium}} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name.first}</Text>
          <Text style={styles.company}>{item.location.state}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  renderFooter = () => {
    if (!this.state.loading) {
      return null;
    }
    return (
      <View style={{paddingVertical: 30}}>
        <ActivityIndicator size="large" />
      </View>
    );
  };
  renderHeader = () => {
    const {text} = this.state;
    return (
      <TextInput
        onFocus={() => (this.duringMomentum = true)}
        onBlur={() => (this.duringMomentum = false)}
        onChangeText={text => {
          this.setState({
            text,
          });

          this.searchFilter(text);
        }}
        value={text}
        style={styles.myInput}
        secureTextEntry={false}
        autoCapitalize="words" // characters, sentences ,  none
        placeholder="Bir isim giriniz"
      />
    );
  };

  searchFilter = text => {
    const newData = this.state.allContacts.filter(item => {
      const listItem = `${item.name.first.toLowerCase()}${item.location.state.toLowerCase()}`;
      return listItem.indexOf(text.toLowerCase()) > -1;
    });

    this.setState({
      contacts: newData,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderContactsItem}
          data={this.state.contacts}
          keyExtractor={(item, index) => index.toString()} // veya keyExtractor={ item=> item._id }
          onEndReached={this.loadMore}
          onEndReachedThreshold={isIOS ? 0.5 : 20} // 0 ise sadece en dibe geldiginizde loadMore yapılır
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    height: 100,
    borderBottomWidth: 1,
    borderColor: '#eeee',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    marginTop: 5,
  },
  myInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dddd',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 12,
  },
});
