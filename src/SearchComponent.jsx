import React from "react";
import _ from "lodash";

export default class MyFilteringComponent extends React.Component {
  state = {
    initialItems: [],
    items: []
  };

  filterList = event => {
    let items = this.state.initialItems;
    items = _.filter(items, item => {
      return (
        item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });
    console.log("derd, item", items);
    this.setState({ items: items });
  };

  componentWillMount = () => {
    this.setState({
      initialItems: this.props.content,
      items: this.props.content
    });
  };

  render() {
    //console.log("derd, this.stat", this.state);
    return (
      <div>
        <form>
          <input type="text" placeholder="Search" onChange={this.filterList} />
        </form>
        {/*<div>
          {_.map(this.state.items, item => {
            return <div key={item}>{item}</div>;
          })}
        </div>
        */}
      </div>
    );
  }
}
