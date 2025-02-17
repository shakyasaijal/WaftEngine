/**
 *
 * BlogPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import Disqus from 'disqus-react';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import * as mapDispatchToProps from './actions';
import { makeSelectBlog, makeSelectLoading } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { IMAGE_BASE } from '../App/constants';
import Loading from '../../components/Loading';
import RecentBlogs from './components/RecentBlogs';
import RelatedBlogs from './components/RelatedBlogs';
import LinkBoth from '../../components/LinkBoth';

export class BlogPage extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    loadBlogRequest: PropTypes.func.isRequired,
    loadRecentBlogsRequest: PropTypes.func.isRequired,
    blog: PropTypes.shape({}).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug_url: PropTypes.string,
      }),
    }).isRequired,
  };

  componentDidMount() {
    this.props.loadRecentBlogsRequest();
      this.props.loadRelatedBlogsRequest(this.props.match.params.slug_url);
      this.props.loadBlogRequest(this.props.match.params.slug_url);
    (function() {
      // DON'T EDIT BELOW THIS LINE
      const d = window.document;
      const s = d.createElement('script');
      s.src = 'https://waftengine.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.slug_url !== this.props.match.params.slug_url) {
      this.props.loadRelatedBlogsRequest(nextProps.match.params.slug_url);
      this.props.loadBlogRequest(nextProps.match.params.slug_url);
      (function() {
        // DON'T EDIT BELOW THIS LINE
        const d = window.document;
        const s = d.createElement('script');
        s.src = 'https://waftengine.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })();
    }
  }

  handleNewComment = () => {
    console.log('new comment recieved');
  };

  render() {
    const { blog, loading, location, match } = this.props;
    console.log(blog, 'blog');
    if (loading) {
      return <Loading />;
    }
    // const disqusShortname = blog.title;
    // const disqusConfig = {
    //   url: `http://localhost:5051/${location.pathname}`,
    //   identifier: match.params.slug_url,
    //   onNewComment: this.handleNewComment,
    //   title: blog.title,
    // return <Loading />;

    // };
    return (
      <>
        <Helmet>
          <title>{blog.title}</title>
        </Helmet>
        <div className="container mx-auto my-10 px-5">
          <div className="flex flex-wrap w-full lg:-mx-5">
            <div className="w-full lg:w-3/4 lg:px-5">
              <h2 className="capitalize">
                <span>{blog.title}</span>
              </h2>
              {/* <Disqus.CommentCount
                shortname={disqusShortname}
                config={disqusConfig}
              >
                Comments
              </Disqus.CommentCount> */}
              <br />
              <div className="blog_img">
                {blog && blog.image && blog.image.fieldname ? (
                  <img
                    src={`${IMAGE_BASE}${blog.image.path}`}
                    className="object-cover"
                    alt={`${blog.title}`}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                    }}
                  />
                ) : null}
              </div>
              <br />
              <div dangerouslySetInnerHTML={{ __html: blog.description }} />
              <br />
              {blog && blog.tags && blog.tags.length > 0 && (
                <div>
                  Tags:{' '}
                  {blog.tags.map((each, index) => (
                    <LinkBoth key={index} to={`/blog/tag/${each}`}>{`${
                      index === 0 ? '' : ', '
                    }${each}`}</LinkBoth>
                  ))}
                </div>
              )}
              <br />
              {blog && blog.author && (
                <div>
                  Authored By:{' '}
                  <LinkBoth to={`/blog/author/${blog.author._id}`}>
                    {blog.author.name}
                  </LinkBoth>
                </div>
              )}
              <div>
                {/* <Disqus.CommentEmbed showMedia={true} height={160} />

                <Disqus.DiscussionEmbed
                  shortname={disqusShortname}
                  config={disqusConfig}
                /> */}
                <div id="disqus_thread" />
              </div>
            </div>

            <div className="w-full mt-4 lg:mt-0 lg:w-1/4 bg-gray-400 p-3 border rounded">
              <RecentBlogs />
              <RelatedBlogs />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const withReducer = injectReducer({ key: 'blogPage', reducer });
const withSaga = injectSaga({ key: 'blogPage', saga });

const mapStateToProps = createStructuredSelector({
  blog: makeSelectBlog(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withReducer,
  withSaga,
  withConnect,
)(BlogPage);
