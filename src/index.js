import React, { PropTypes, Component } from 'react';
import Bricks from 'bricks.js';
import InfiniteScroll from 'react-infinite-scroller';

export default class MasonryInfiniteScroller extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    className: PropTypes.string,
    hasMore: PropTypes.bool,
    loader: PropTypes.element,
    loadMore: PropTypes.func,
    packed: PropTypes.string,
    pageStart: PropTypes.number,
    position: PropTypes.bool,
    sizes: PropTypes.array,
    style: PropTypes.object,
    threshold: PropTypes.number,
    useWindow: PropTypes.bool,
    scrollable: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    packed: 'data-packed',
    position: true,
    sizes: [
      { columns: 1, gutter: 20 },
      { mq: '768px', columns: 2, gutter: 20 },
      { mq: '1024px', columns: 3, gutter: 20 }
    ],
    style: {}
  }

  componentDidMount() {
    const { packed, sizes, children, position } = this.props;

    const instance = Bricks({
      container: this.masonryContainer,
      packed: packed,
      sizes: sizes,
      position: position
    });

    instance.resize(true);

    if (children.length > 0) {
      setTimeout(() => { instance.pack() }, 10);
    }

    this.setState({ instance });
  }

  componentDidUpdate(prevProps) {
    const { children } = this.props;

    if (prevProps.children.length === 0 && children.length === 0) {
      return;
    }

    const { instance } = this.state;

    if (prevProps.children.length === 0 && children.length > 0) {
      return setTimeout(() => { instance.pack() }, 10);
    }

    if (prevProps.children.length !== children.length) {
      return setTimeout(() => { instance.update() }, 100);
    }
  }

  componentWillUnmount() {
    this.state.instance.resize(false);
  }

  render() {
    const { className, style, children, pageStart, loadMore, hasMore, loader, threshold, useWindow, scrollable } = this.props;
    return (
      <InfiniteScroll
        pageStart={pageStart}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={loader}
        threshold={threshold}
        useWindow={useWindow}
        scrollable={scrollable}
      >
        <div
          ref={(component) => this.masonryContainer = component}
          className={className}
          style={style}
        >
          {children}
        </div>
      </InfiniteScroll>
    );
  }
}
