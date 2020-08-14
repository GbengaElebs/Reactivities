//rafc
import React, { useEffect, useContext, useState } from "react";
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import  ActivityList  from "./ActivityList";
import {observer} from 'mobx-react-lite';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilter';


const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivites,loadingInitial, setPage, page,totalPages}= rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivites().then(() => setLoadingNext(false))
  }

  useEffect(() => {
    loadActivites();
  }, [loadActivites]);

  if (loadingInitial && page === 0)
    return <LoadingComponent content="Getting Activities...." />;
    
  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
        pageStart ={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && page + 1 < totalPages}
        initialLoad={false}
      >
        <ActivityList/>
        </InfiniteScroll>
      </Grid.Column>
      <GridColumn width={6}>
      <ActivityFilters/>
      </GridColumn>
      <GridColumn width={10}>
        <Loader active={loadingNext}/>
      </GridColumn>
    </Grid>
  );
};


export default observer(ActivityDashboard);