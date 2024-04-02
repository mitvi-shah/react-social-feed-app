import { useEffect, useMemo, useState } from 'react';

import PropType from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import img from '../../../assets/images/img.jpg';
import { TimeAgo } from '../../../components/TimeAgo';
import { useGetFeedPostsQuery } from '../../../store/postsApi';

import '../home.css';

const FeedPosts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const { posts, disableNext, isLoading, isFetching } = useGetFeedPostsQuery(
    useMemo(() => {
      const arg = { page: 1 };

      if (searchParams.get('page')) {
        setPage(Number(searchParams.get('page')));
        arg.page = searchParams.get('page');
        return arg;
      } else {
        setPage(1);
        if (searchParams.get('title')) {
          arg.search = searchParams.get('title');
        }
        if (searchParams.get('isMyPostsOnly')) {
          arg.isMyPostsOnly = searchParams.get('isMyPostsOnly');
        }
      }
      return arg;
    }, [searchParams]),
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        disableNext: data?.total / 5 < page || data?.total / 5 === page,
        isLoading: isLoading,
        posts: data?.data,
        isFetching: isFetching,
      }),
    }
  );

  useEffect(() => {
    !(isLoading || isFetching) && !posts?.length && setPage(1);
    searchParams.get('page') &&
      searchParams.get('page') !== page &&
      setPage(Number(searchParams.get('page')));
  }, [posts?.length, isLoading, isFetching, searchParams, page]);

  const setPageParams = (currentPage) => {
    if (searchParams.get('page') !== currentPage) {
      setSearchParams({ page: currentPage });
      setPage(currentPage);
    }
  };

  const cards = posts?.map((post) => {
    return (
      <div className="card post-card my-3" key={post._id}>
        <h3 className="card-header">{post.title}</h3>
        <div className="px-3">
          <div className="description pt-2">{post.description}</div>
          Created At : <TimeAgo timestamp={new Date(post.createdAt)} />
          <img className="pt-2" src={img} alt="user" height={300} width={920} />
        </div>
      </div>
    );
  });

  return (
    <div className="position-relative">
      {cards}
      <div className="pagination-container">
        <Pagination>
          <Pagination.Prev
            onClick={() => setPageParams(page - 1)}
            disabled={page === Number(1)}
          >
            <span aria-hidden="true">«</span>
          </Pagination.Prev>
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next
            disabled={disableNext}
            onClick={() => setPageParams(page + 1)}
          >
            <span aria-hidden="true">»</span>
          </Pagination.Next>
        </Pagination>
      </div>
      {!(isLoading || isFetching) && !posts?.length && <h1>No Posts Found</h1>}
    </div>
  );
};

export default FeedPosts;
FeedPosts.propTypes = {
  title: PropType.string,
};
