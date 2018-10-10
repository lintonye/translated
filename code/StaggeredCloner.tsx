import * as React from "react";

const cloneAndUpdatePropsAsync = async (getUpdatePropsFun, node) => {
  if (!React.isValidElement(node)) return node;
  const updateProps = await getUpdatePropsFun(node.props);
  /**
   * TODO: why React.Children.map will cause an error on the canvas
   * But NOT in preview?
   */
  const clonedChildren = await Promise.all(
    React.Children.toArray(node.props.children).map(
      async c => await cloneAndUpdatePropsAsync(getUpdatePropsFun, c)
    )
  );
  return React.cloneElement(node, updateProps, clonedChildren);
};

interface Props {
  onUpdateProps: (
    propsOnChild: React.Props<any>
  ) => React.Props<any> | Promise<React.Props<any>>;
}

export default class StaggeredCloner extends React.Component<Props> {
  state = {
    root: null
  };

  clone = async children => {
    const root = await cloneAndUpdatePropsAsync(
      this.props.onUpdateProps,
      children[0]
    );
    this.setState({ root });
  };

  componentDidMount() {
    this.clone(this.props.children);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.clone(nextProps.children);
    }
  }
  /*  
   componentDidUpdate causes "Component exceeded time limit" 
   error way too often. componentWillReceiveProps performs
   better. However it'll soon be deprecated. 
   getDerivedStateFromProps isn't meant for data fetching.
   What to do here?
  */
  // componentDidUpdate(prevProps) {
  //   if (this.props.children !== prevProps.children) {
  //     this.translateChildren(this.props);
  //   }
  // }

  render() {
    return <>{this.state.root}</>;
  }
}
